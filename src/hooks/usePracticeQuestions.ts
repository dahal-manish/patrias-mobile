import { useQuery } from "@tanstack/react-query";
import { fetchPracticeQuestions, type PracticeQuestion } from "../lib/questions";

/**
 * React Query hook to fetch practice questions
 */
export function usePracticeQuestions(count: number = 10) {
  return useQuery<PracticeQuestion[]>({
    queryKey: ["practiceQuestions", count],
    queryFn: () => fetchPracticeQuestions(count),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
  });
}

