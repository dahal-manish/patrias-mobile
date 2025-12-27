import { getSupabaseClient } from "./supabase";

export interface RecentSession {
  date: string;
  total: number;
  correct: number;
  accuracy: number;
  mode: string;
}

export interface ModuleStats {
  total: number;
  correct: number;
  percentage: number;
  recentAttempts: Array<{
    correct: boolean;
    created_at: string;
  }>;
}

export interface OverallStats {
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CategoryPerformance {
  category: string;
  total: number;
  correct: number;
  accuracy: number;
}

/**
 * Fetch overall statistics for the user
 */
export async function fetchOverallStats(): Promise<OverallStats | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Get all attempts
    const { data: allAttempts, error: attemptsError } = await supabase
      .from("attempts")
      .select("correct")
      .eq("user_id", user.id);

    if (attemptsError) {
      console.error("Error fetching attempts:", attemptsError);
      return null;
    }

    const totalQuestions = allAttempts?.length || 0;
    const totalCorrect = allAttempts?.filter((a) => a.correct).length || 0;
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    // Get streak
    const { data: streak, error: streakError } = await supabase
      .from("study_streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", user.id)
      .single();

    if (streakError) {
      if (streakError.code === "PGRST116") {
        // No streak record exists yet - use defaults
      } else if (streakError.code === "PGRST205") {
        // Table doesn't exist - use defaults
        console.warn("study_streaks table not found. Please run the database migration to create it.");
      } else {
        console.error("Error fetching streak:", streakError);
      }
    }

    return {
      totalQuestions,
      totalCorrect,
      accuracy: Math.round(accuracy * 10) / 10,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
    };
  } catch (error) {
    console.error("Unexpected error fetching overall stats:", error);
    return null;
  }
}

/**
 * Fetch recent practice sessions
 */
export async function fetchRecentSessions(limit: number = 10): Promise<RecentSession[]> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return [];
    }

    // Get recent attempts
    const { data: attempts, error } = await supabase
      .from("attempts")
      .select("correct, created_at, mode")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit * 10); // Get more to group into sessions

    if (error) {
      console.error("Error fetching recent attempts:", error);
      return [];
    }

    if (!attempts || attempts.length === 0) {
      return [];
    }

    // Group attempts by date and mode
    const sessionsMap = new Map<string, RecentSession>();

    attempts.forEach((attempt) => {
      const date = new Date(attempt.created_at).toDateString();
      const sessionKey = `${date}-${attempt.mode || "mcq"}`;

      if (!sessionsMap.has(sessionKey)) {
        sessionsMap.set(sessionKey, {
          date,
          total: 0,
          correct: 0,
          accuracy: 0,
          mode: attempt.mode || "mcq",
        });
      }

      const session = sessionsMap.get(sessionKey)!;
      session.total += 1;
      if (attempt.correct) {
        session.correct += 1;
      }
      session.accuracy = (session.correct / session.total) * 100;
    });

    // Convert to array and sort by date (most recent first)
    const sessions = Array.from(sessionsMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    return sessions;
  } catch (error) {
    console.error("Unexpected error fetching recent sessions:", error);
    return [];
  }
}

/**
 * Fetch module-specific statistics
 */
export async function fetchModuleStats(mode: string = "mcq"): Promise<ModuleStats | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Get last 30 attempts for this module
    const { data: moduleAttempts, error } = await supabase
      .from("attempts")
      .select("correct, created_at")
      .eq("user_id", user.id)
      .eq("mode", mode)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching module attempts:", error);
      return null;
    }

    const total = moduleAttempts?.length || 0;
    const correct = moduleAttempts?.filter((a) => a.correct).length || 0;
    const percentage = total > 0 ? Math.round((correct / total) * 100 * 10) / 10 : 0;

    return {
      total,
      correct,
      percentage,
      recentAttempts: (moduleAttempts || []).slice(0, 5).map((a) => ({
        correct: a.correct,
        created_at: a.created_at,
      })),
    };
  } catch (error) {
    console.error("Unexpected error fetching module stats:", error);
    return null;
  }
}

/**
 * Fetch category performance (if questions have category field)
 */
export async function fetchCategoryPerformance(): Promise<CategoryPerformance[]> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return [];
    }

    // Get attempts with question category
    const { data: attempts, error } = await supabase
      .from("attempts")
      .select("correct, questions(category)")
      .eq("user_id", user.id)
      .limit(1000); // Get a good sample

    if (error) {
      console.error("Error fetching category performance:", error);
      return [];
    }

    if (!attempts || attempts.length === 0) {
      return [];
    }

    // Group by category
    const categoryMap = new Map<string, { total: number; correct: number }>();

    attempts.forEach((attempt: any) => {
      const category = attempt.questions?.category || "Unknown";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { total: 0, correct: 0 });
      }
      const stats = categoryMap.get(category)!;
      stats.total += 1;
      if (attempt.correct) {
        stats.correct += 1;
      }
    });

    // Convert to array
    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      total: stats.total,
      correct: stats.correct,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100 * 10) / 10 : 0,
    }));
  } catch (error) {
    console.error("Unexpected error fetching category performance:", error);
    return [];
  }
}

/**
 * Fetch progress over time (last N days)
 */
export async function fetchProgressOverTime(days: number = 30): Promise<Array<{ date: string; accuracy: number }>> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return [];
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get attempts from last N days
    const { data: attempts, error } = await supabase
      .from("attempts")
      .select("correct, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching progress over time:", error);
      return [];
    }

    if (!attempts || attempts.length === 0) {
      return [];
    }

    // Group by date
    const dateMap = new Map<string, { total: number; correct: number }>();

    attempts.forEach((attempt) => {
      const date = new Date(attempt.created_at).toISOString().split("T")[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { total: 0, correct: 0 });
      }
      const stats = dateMap.get(date)!;
      stats.total += 1;
      if (attempt.correct) {
        stats.correct += 1;
      }
    });

    // Convert to array and calculate accuracy
    return Array.from(dateMap.entries())
      .map(([date, stats]) => ({
        date,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100 * 10) / 10 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Unexpected error fetching progress over time:", error);
    return [];
  }
}

