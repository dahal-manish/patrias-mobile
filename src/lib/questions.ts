import { getSupabaseClient } from "./supabase";

/**
 * Question type matching the Supabase questions table structure
 */
export interface Question {
  id: string;
  domain: string;
  prompt: string;
  choices?: string[] | any; // JSONB field - can be array of strings or object
  correct_answer: string;
  difficulty: number;
  category?: string;
  tags?: string[];
  bank_version: "2008" | "2025";
  active: boolean;
  is_dynamic?: boolean;
  uscis_question_number?: number;
}

/**
 * Simplified question format for the practice screen
 */
export interface PracticeQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

/**
 * Fetch 10 random civics questions from Supabase for practice
 * For MVP, we'll simplify and just get 10 random active questions
 */
export async function fetchPracticeQuestions(
  count: number = 10
): Promise<PracticeQuestion[]> {
  const supabase = getSupabaseClient();

  // Fetch active civics questions (default to 2025 bank for MVP)
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("domain", "civics")
    .eq("active", true)
    .eq("bank_version", "2025")
    .eq("is_dynamic", false) // Exclude dynamic questions for MVP
    .eq("pool_flashcards_only", false) // Exclude flashcards-only
    .limit(100); // Get a larger pool to randomize from

  if (error) {
    console.error("Error fetching questions:", error);
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }

  if (!questions || questions.length === 0) {
    throw new Error("No questions found in database");
  }

  // Shuffle and take the requested count
  const shuffled = questions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Transform to practice format
  return selected.map((q) => {
    // Handle choices - it might be an array or an object
    let options: string[] = [];
    
    if (Array.isArray(q.choices)) {
      options = q.choices;
    } else if (q.choices && typeof q.choices === "object") {
      // If it's an object, try to extract values
      options = Object.values(q.choices).filter(
        (v): v is string => typeof v === "string"
      );
    }

    // If no choices in database, create options array with correct answer
    if (options.length === 0) {
      options = [q.correct_answer];
    }

    // Ensure we have at least 2 options (correct answer + some placeholders)
    // For MVP, if we only have the correct answer, we'll add some generic wrong answers
    if (options.length < 2) {
      options.push("None of the above", "All of the above", "Not applicable");
    }

    // Ensure correct answer is in options
    if (!options.includes(q.correct_answer)) {
      options.push(q.correct_answer);
    }

    // Shuffle options and find correct index
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.findIndex(
      (opt) => opt === q.correct_answer
    );

    // If correct answer not found (shouldn't happen), default to first
    const finalCorrectIndex = correctIndex >= 0 ? correctIndex : 0;

    return {
      id: q.id,
      text: q.prompt,
      options: shuffledOptions,
      correctIndex: finalCorrectIndex,
    };
  });
}

