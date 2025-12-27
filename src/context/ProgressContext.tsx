import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRecentSessions } from "../lib/analytics";
import { retryPendingSyncs } from "../lib/progressSync";

const PROGRESS_STORAGE_KEY = "last_practice_session";

export interface PracticeSessionResult {
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

interface ProgressContextType {
  lastSession: PracticeSessionResult | null;
  saveSession: (score: number, total: number) => Promise<void>;
  clearSession: () => Promise<void>;
  syncWithDatabase: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [lastSession, setLastSession] = useState<PracticeSessionResult | null>(
    null
  );

  // Sync with database on mount
  useEffect(() => {
    const initializeSync = async () => {
      // Retry any pending syncs
      await retryPendingSyncs();
      
      // Sync last session from database
      await syncWithDatabase();
    };

    initializeSync();
  }, []);

  // Sync last session from database
  const syncWithDatabase = async () => {
    try {
      // Try to get the most recent session from database
      const sessions = await fetchRecentSessions(1);
      
      if (sessions && sessions.length > 0) {
        const latestSession = sessions[0];
        const result: PracticeSessionResult = {
          score: latestSession.correct,
          total: latestSession.total,
          percentage: Math.round(latestSession.accuracy),
          completedAt: new Date(latestSession.date).toISOString(),
        };
        
        // Update both state and local storage (as cache)
        setLastSession(result);
        await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(result));
      } else {
        // Fallback to local storage if no database sessions
        const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (stored) {
          setLastSession(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error("Error syncing with database:", error);
      // Fallback to local storage on error
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (stored) {
          setLastSession(JSON.parse(stored));
        }
      } catch (storageError) {
        console.error("Error loading from local storage:", storageError);
      }
    }
  };

  // Save a new practice session result
  const saveSession = async (score: number, total: number) => {
    const result: PracticeSessionResult = {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      completedAt: new Date().toISOString(),
    };

    try {
      // Save to local storage as cache
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(result));
      setLastSession(result);
      
      // Sync with database (attempts are already saved individually, but we can refresh)
      // The database sync will happen automatically when analytics are fetched
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  // Clear the stored session
  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
      setLastSession(null);
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  };

  const value: ProgressContextType = {
    lastSession,
    saveSession,
    clearSession,
    syncWithDatabase,
  };

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

