import { getSupabaseClient } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_SYNC_KEY = "pending_sync_attempts";

export interface AttemptToSync {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  mode?: string;
}

/**
 * Save a single attempt to the database
 */
export async function saveAttempt(
  questionId: string,
  correct: boolean,
  userAnswer: string,
  mode: string = "mcq"
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      // Queue for later sync
      await queueAttemptForSync({ questionId, correct, userAnswer, mode });
      return { success: false, error: "User not authenticated" };
    }

    // Save the attempt
    const { error } = await supabase.from("attempts").insert({
      user_id: user.id,
      question_id: questionId,
      mode: mode,
      correct: correct,
      user_answer: userAnswer,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving attempt:", error);
      // Queue for later sync
      await queueAttemptForSync({ questionId, correct, userAnswer, mode });
      return { success: false, error: error.message };
    }

    // Update streak if this is the first activity today
    await updateStreak(user.id);

    return { success: true };
  } catch (error) {
    console.error("Unexpected error saving attempt:", error);
    await queueAttemptForSync({ questionId, correct, userAnswer, mode });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Save an entire practice session (all questions) to the database
 */
export async function savePracticeSession(
  questions: Array<{ id: string; correctIndex: number }>,
  answers: boolean[],
  userAnswers: string[]
): Promise<{ success: boolean; synced: number; failed: number; errors?: string[] }> {
  const results = await Promise.allSettled(
    questions.map((question, index) =>
      saveAttempt(
        question.id,
        answers[index] || false,
        userAnswers[index] || "",
        "mcq"
      )
    )
  );

  const synced = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.length - synced;
  const errors = results
    .filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.success))
    .map((r) => r.status === "rejected" ? (r.reason as Error).message : r.value.error || "Unknown error");

  return { success: synced > 0, synced, failed, errors: errors.length > 0 ? errors : undefined };
}

/**
 * Queue an attempt for later sync (when offline or auth fails)
 */
async function queueAttemptForSync(attempt: AttemptToSync): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    const pending: AttemptToSync[] = existing ? JSON.parse(existing) : [];
    pending.push(attempt);
    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error("Error queueing attempt for sync:", error);
  }
}

/**
 * Retry syncing pending attempts
 */
export async function retryPendingSyncs(): Promise<{ synced: number; failed: number }> {
  try {
    const pendingJson = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    if (!pendingJson) {
      return { synced: 0, failed: 0 };
    }

    const pending: AttemptToSync[] = JSON.parse(pendingJson);
    if (pending.length === 0) {
      return { synced: 0, failed: 0 };
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { synced: 0, failed: pending.length };
    }

    const results = await Promise.allSettled(
      pending.map((attempt) =>
        supabase.from("attempts").insert({
          user_id: user.id,
          question_id: attempt.questionId,
          mode: attempt.mode || "mcq",
          correct: attempt.correct,
          user_answer: attempt.userAnswer,
          created_at: new Date().toISOString(),
        })
      )
    );

    const synced = results.filter((r) => r.status === "fulfilled" && !r.value.error).length;
    const failed = results.length - synced;

    // Update streak once if any attempts were successfully synced
    if (synced > 0) {
      await updateStreak(user.id);
    }

    // Remove synced attempts from queue
    const stillPending: AttemptToSync[] = [];
    results.forEach((result, index) => {
      if (result.status === "rejected" || (result.status === "fulfilled" && result.value.error)) {
        stillPending.push(pending[index]);
      }
    });

    if (stillPending.length > 0) {
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(stillPending));
    } else {
      await AsyncStorage.removeItem(PENDING_SYNC_KEY);
    }

    return { synced, failed };
  } catch (error) {
    console.error("Error retrying pending syncs:", error);
    return { synced: 0, failed: 0 };
  }
}

/**
 * Get count of pending syncs
 */
export async function getPendingSyncCount(): Promise<number> {
  try {
    const pendingJson = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    if (!pendingJson) return 0;
    const pending: AttemptToSync[] = JSON.parse(pendingJson);
    return pending.length;
  } catch (error) {
    console.error("Error getting pending sync count:", error);
    return 0;
  }
}

/**
 * Update study streak for user (called after saving an attempt)
 */
async function updateStreak(userId: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split("T")[0];

    const { data: existingStreak, error: fetchError } = await supabase
      .from("study_streaks")
      .select("last_study_date, current_streak, longest_streak")
      .eq("user_id", userId)
      .single();

    // Handle table not found error
    if (fetchError && fetchError.code === "PGRST205") {
      console.warn("study_streaks table not found. Please run the database migration to create it.");
      return; // Silently fail - table doesn't exist
    }

    if (existingStreak) {
      const lastDate = existingStreak.last_study_date;
      const lastDateObj = lastDate ? new Date(lastDate) : null;
      const todayObj = new Date(today);
      const oneDayAgo = new Date(todayObj);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      let newStreak = existingStreak.current_streak || 0;

      if (lastDate !== today) {
        // Check if last study date is yesterday (consecutive day)
        if (lastDateObj && lastDateObj.toDateString() === oneDayAgo.toDateString()) {
          newStreak = (existingStreak.current_streak || 0) + 1;
        } else {
          // Not consecutive, reset to 1
          newStreak = 1;
        }

        const { error: updateError } = await supabase.from("study_streaks").upsert({
          user_id: userId,
          last_study_date: today,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, existingStreak.longest_streak || 0),
        });

        if (updateError && updateError.code === "PGRST205") {
          console.warn("study_streaks table not found during update.");
          return;
        }
      }
    } else if (!fetchError || fetchError.code === "PGRST116") {
      // No streak record exists yet (PGRST116 = no rows returned)
      const { error: insertError } = await supabase.from("study_streaks").insert({
        user_id: userId,
        last_study_date: today,
        current_streak: 1,
        longest_streak: 1,
      });

      if (insertError && insertError.code === "PGRST205") {
        console.warn("study_streaks table not found during insert.");
        return;
      }
    }
  } catch (error) {
    console.error("Error updating streak:", error);
    // Don't throw - streak update failure shouldn't block attempt saving
  }
}

