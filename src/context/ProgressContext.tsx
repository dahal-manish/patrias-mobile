import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [lastSession, setLastSession] = useState<PracticeSessionResult | null>(
    null
  );

  // Load last session from storage on mount
  useEffect(() => {
    const loadLastSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (stored) {
          setLastSession(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading last session:", error);
      }
    };

    loadLastSession();
  }, []);

  // Save a new practice session result
  const saveSession = async (score: number, total: number) => {
    const result: PracticeSessionResult = {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      completedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(result));
      setLastSession(result);
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

