import React, { createContext, useContext, useState } from "react";
import type { PracticeQuestion } from "../lib/questions";

export interface SavedPracticeSession {
  questions: PracticeQuestion[];
  currentIndex: number;
  answers: boolean[];
  correctCount: number;
  startedAt: string;
}

interface PracticeSessionContextType {
  savedSession: SavedPracticeSession | null;
  saveSession: (
    questions: PracticeQuestion[],
    currentIndex: number,
    answers: boolean[],
    correctCount: number
  ) => void;
  getSavedSession: () => SavedPracticeSession | null;
  clearSession: () => void;
  hasActiveSession: () => boolean;
}

const PracticeSessionContext = createContext<PracticeSessionContextType | undefined>(undefined);

export function PracticeSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [savedSession, setSavedSession] = useState<SavedPracticeSession | null>(null);

  const saveSession = (
    questions: PracticeQuestion[],
    currentIndex: number,
    answers: boolean[],
    correctCount: number
  ) => {
    setSavedSession({
      questions,
      currentIndex,
      answers,
      correctCount,
      startedAt: new Date().toISOString(),
    });
  };

  const getSavedSession = () => {
    return savedSession;
  };

  const clearSession = () => {
    setSavedSession(null);
  };

  const hasActiveSession = () => {
    return savedSession !== null;
  };

  const value: PracticeSessionContextType = {
    savedSession,
    saveSession,
    getSavedSession,
    clearSession,
    hasActiveSession,
  };

  return (
    <PracticeSessionContext.Provider value={value}>
      {children}
    </PracticeSessionContext.Provider>
  );
}

export function usePracticeSession() {
  const context = useContext(PracticeSessionContext);
  if (context === undefined) {
    throw new Error(
      "usePracticeSession must be used within a PracticeSessionProvider"
    );
  }
  return context;
}


