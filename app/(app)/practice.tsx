import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { usePracticeQuestions } from "../../src/hooks/usePracticeQuestions";
import { useProgress } from "../../src/context/ProgressContext";
import { usePracticeSession } from "../../src/context/PracticeSessionContext";
import { saveAttempt, savePracticeSession as saveSessionToDB } from "../../src/lib/progressSync";
import type { PracticeQuestion } from "../../src/lib/questions";

const PRACTICE_QUESTION_COUNT = 10;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const TOP_MARGIN = SCREEN_HEIGHT * 0.1;
const BOTTOM_MARGIN = SCREEN_HEIGHT * 0.1;

export default function PracticeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { saveSession } = useProgress();
  const {
    savedSession,
    saveSession: savePracticeSession,
    clearSession,
    hasActiveSession,
  } = usePracticeSession();
  const { data: fetchedQuestions, isLoading, error } = usePracticeQuestions(
    PRACTICE_QUESTION_COUNT
  );
  
  // Use saved questions if resuming, otherwise use fetched questions
  const [questions, setQuestions] = useState<PracticeQuestion[] | undefined>(
    undefined
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // Track selected option text
  const [hasCheckedResume, setHasCheckedResume] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // Check for saved session on mount and show resume dialog
  useEffect(() => {
    if (!isLoading && fetchedQuestions && !hasCheckedResume) {
      setHasCheckedResume(true);
      
      if (hasActiveSession() && savedSession) {
        // Show resume dialog
        Alert.alert(
          "Resume Practice?",
          `You have an incomplete practice session. Would you like to resume from question ${savedSession.currentIndex + 1}?`,
          [
            {
              text: "Start New",
              style: "cancel",
              onPress: () => {
                clearSession();
                setQuestions(fetchedQuestions);
                setCurrentIndex(0);
                setAnswers([]);
                setUserAnswers([]);
                setCorrectCount(0);
                setSelectedAnswer(null);
                setCompleted(false);
                setIsResuming(false);
              },
            },
            {
              text: "Resume",
              onPress: () => {
                // Restore saved session with saved questions
                setIsResuming(true);
                setQuestions(savedSession.questions);
                setCurrentIndex(savedSession.currentIndex);
                setAnswers(savedSession.answers);
                setCorrectCount(savedSession.correctCount);
                setSelectedAnswer(null);
              },
            },
          ]
        );
      } else {
        // No saved session, use fetched questions
        setQuestions(fetchedQuestions);
      }
    }
  }, [
    isLoading,
    fetchedQuestions,
    hasCheckedResume,
    hasActiveSession,
    savedSession,
    clearSession,
  ]);

  // Save session result when completed (only once)
  const [hasSaved, setHasSaved] = useState(false);
  useEffect(() => {
    if (completed && questions && !hasSaved && answers.length === questions.length) {
      // Save to local storage (for backward compatibility)
      saveSession(correctCount, questions.length);
      
      // Save all attempts to database
      saveSessionToDB(questions, answers, userAnswers).then((result) => {
        if (result.success) {
          console.log(`Synced ${result.synced} attempts to database`);
          // Invalidate analytics queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
        } else {
          console.warn(`Failed to sync ${result.failed} attempts`);
        }
      });
      
      clearSession(); // Clear practice session when completed
      setHasSaved(true);
    }
  }, [completed, correctCount, questions, answers, userAnswers, saveSession, hasSaved, clearSession, queryClient]);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if (completed || !questions) return;

    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === questions[currentIndex].correctIndex;
    const selectedOptionText = questions[currentIndex].options[optionIndex];
    
    const newAnswers = [...answers, isCorrect];
    const newUserAnswers = [...userAnswers, selectedOptionText];
    setAnswers(newAnswers);
    setUserAnswers(newUserAnswers);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    // Save attempt to database immediately
    saveAttempt(
      questions[currentIndex].id,
      isCorrect,
      selectedOptionText,
      "mcq"
    ).catch((error) => {
      console.error("Error saving attempt:", error);
      // Error is already handled in saveAttempt (queued for retry)
    });

    // Move to next question after a brief delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setCompleted(true);
      }
    }, 1000);
  };

  // Handle back button press
  const handleBack = () => {
    if (!questions) {
      router.back();
      return;
    }

    // If user has answered at least one question, save progress
    if (answers.length > 0) {
      savePracticeSession(questions, currentIndex, answers, correctCount);
    }

    router.back();
  };

  // Reset practice session
  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setCompleted(false);
    setAnswers([]);
    setUserAnswers([]);
    setHasSaved(false);
    clearSession();
  };

  // Loading state
  if (isLoading || !questions) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>
          {isResuming ? "Resuming practice..." : "Loading questions..."}
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Failed to load questions. Please try again.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No questions (shouldn't happen if loading handled correctly, but safety check)
  if (questions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No questions available.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Completed - show summary
  if (completed) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Practice Complete!</Text>
          <Text style={styles.summaryScore}>
            You scored {correctCount} / {questions.length}
          </Text>
          <Text style={styles.summaryPercentage}>{percentage}%</Text>

          <View style={styles.summaryButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(app)/home")}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleReset}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Active practice - show current question
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
            </Text>
          </View>

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          {/* Answer options */}
          <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctIndex;
          const showResult = selectedAnswer !== null;

          let buttonStyle: any = styles.optionButton;
          let textStyle: any = styles.optionText;

          if (showResult) {
            if (isCorrect) {
              buttonStyle = [styles.optionButton, styles.optionCorrect];
              textStyle = [styles.optionText, styles.optionTextCorrect];
            } else if (isSelected && !isCorrect) {
              buttonStyle = [styles.optionButton, styles.optionIncorrect];
              textStyle = [styles.optionText, styles.optionTextIncorrect];
            } else {
              buttonStyle = [styles.optionButton, styles.optionDisabled];
              textStyle = [styles.optionText, styles.optionTextDisabled];
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback message */}
      {selectedAnswer !== null && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              selectedAnswer === currentQuestion.correctIndex
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect,
            ]}
          >
            {selectedAnswer === currentQuestion.correctIndex
              ? "✓ Correct!"
              : `✗ Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctIndex]}`}
          </Text>
        </View>
        )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    flex: 1,
    paddingTop: TOP_MARGIN,
    paddingBottom: BOTTOM_MARGIN,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "600",
  },
  contentContainer: {
    padding: 24,
    paddingTop: 0,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
    flex: 1,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
    flex: 2,
    justifyContent: "space-around",
  },
  optionButton: {
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    minHeight: 56,
    justifyContent: "center",
  },
  optionCorrect: {
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
  },
  optionIncorrect: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  optionTextCorrect: {
    color: "#065f46",
  },
  optionTextIncorrect: {
    color: "#991b1b",
  },
  optionTextDisabled: {
    color: "#9ca3af",
  },
  feedbackContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "500",
  },
  feedbackCorrect: {
    color: "#065f46",
  },
  feedbackIncorrect: {
    color: "#991b1b",
  },
  summaryContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  summaryScore: {
    fontSize: 24,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 8,
  },
  summaryPercentage: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 32,
  },
  summaryButtons: {
    width: "100%",
    gap: 12,
  },
  button: {
    height: 50,
    backgroundColor: "#10b981",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#f3f4f6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#1f2937",
  },
});
