import { getSupabaseClient } from "./supabase";

export interface StudyStreak {
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
}

/**
 * Get the current study streak for the user
 */
export async function getCurrentStreak(): Promise<StudyStreak | null> {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from("study_streaks")
      .select("current_streak, longest_streak, last_study_date")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No streak record exists yet
        return { current_streak: 0, longest_streak: 0, last_study_date: null };
      }
      if (error.code === "PGRST205") {
        // Table doesn't exist - return default values
        console.warn("study_streaks table not found. Please run the database migration to create it.");
        return { current_streak: 0, longest_streak: 0, last_study_date: null };
      }
      console.error("Error fetching streak:", error);
      return { current_streak: 0, longest_streak: 0, last_study_date: null };
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching streak:", error);
    return null;
  }
}

/**
 * Check if user has practiced today
 */
export async function hasPracticedToday(): Promise<boolean> {
  try {
    const streak = await getCurrentStreak();
    if (!streak || !streak.last_study_date) {
      return false;
    }

    const today = new Date().toISOString().split("T")[0];
    const lastStudyDate = new Date(streak.last_study_date).toISOString().split("T")[0];
    return today === lastStudyDate;
  } catch (error) {
    console.error("Error checking if practiced today:", error);
    return false;
  }
}

