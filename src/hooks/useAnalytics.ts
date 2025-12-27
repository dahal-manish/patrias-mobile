import { useQuery } from "@tanstack/react-query";
import {
  fetchOverallStats,
  fetchRecentSessions,
  fetchModuleStats,
  fetchCategoryPerformance,
  fetchProgressOverTime,
  type OverallStats,
  type RecentSession,
  type ModuleStats,
  type CategoryPerformance,
} from "../lib/analytics";

/**
 * Hook to fetch overall user statistics
 */
export function useOverallStats() {
  return useQuery<OverallStats | null>({
    queryKey: ["analytics", "overall"],
    queryFn: fetchOverallStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch recent practice sessions
 */
export function useRecentSessions(limit: number = 10) {
  return useQuery<RecentSession[]>({
    queryKey: ["analytics", "recent-sessions", limit],
    queryFn: () => fetchRecentSessions(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch module-specific statistics
 */
export function useModuleStats(mode: string = "mcq") {
  return useQuery<ModuleStats | null>({
    queryKey: ["analytics", "module", mode],
    queryFn: () => fetchModuleStats(mode),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch category performance
 */
export function useCategoryPerformance() {
  return useQuery<CategoryPerformance[]>({
    queryKey: ["analytics", "category-performance"],
    queryFn: fetchCategoryPerformance,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch progress over time
 */
export function useProgressOverTime(days: number = 30) {
  return useQuery<Array<{ date: string; accuracy: number }>>({
    queryKey: ["analytics", "progress-over-time", days],
    queryFn: () => fetchProgressOverTime(days),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

