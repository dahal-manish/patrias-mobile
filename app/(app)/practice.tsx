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
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePracticeQuestions } from "../../src/hooks/usePracticeQuestions";
import { useProgress } from "../../src/context/ProgressContext";
import type { PracticeQuestion } from "../../src/lib/questions";

const PRACTICE_QUESTION_COUNT = 10;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { saveSession } = useProgress();
  
  // Ensure insets are always defined
  const safeTop = insets?.top ?? 0;
  const contentHeight = SCREEN_HEIGHT * 0.7;
  const { data: questions, isLoading, error } = usePracticeQuestions(
    PRACTICE_QUESTION_COUNT
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  // Save session result when completed (only once)
  const [hasSaved, setHasSaved] = useState(false);
  useEffect(() => {
    if (completed && questions && !hasSaved) {
      saveSession(correctCount, questions.length);
      setHasSaved(true);
    }
  }, [completed, correctCount, questions, saveSession, hasSaved]);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if (completed || !questions) return;

    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === questions[currentIndex].correctIndex;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

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

  // Reset practice session
  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setCompleted(false);
    setAnswers([]);
    setHasSaved(false);
  };

  // Handle back button press
  const handleBackPress = () => {
    // If session is completed, just go back
    if (completed) {
      router.back();
      return;
    }

    // If in the middle of a session, show confirmation
    if (currentIndex > 0 || selectedAnswer !== null) {
      Alert.alert(
        "Leave Practice Session?",
        "Your progress will not be saved if you leave now. Are you sure you want to exit?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      // If at the start, just go back
      router.back();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading questions...</Text>
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

  // No questions
  if (!questions || questions.length === 0) {
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
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={[styles.header, { paddingTop: safeTop + 30 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Practice Complete</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.contentContainer, styles.summaryContentContainer, { minHeight: contentHeight }]}
            showsVerticalScrollIndicator={false}
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
        </View>
      </View>
    );
  }

  // Active practice - show current question
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={[styles.header, { paddingTop: safeTop + 30 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice Session</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.contentContainer, { minHeight: contentHeight }]}
          showsVerticalScrollIndicator={false}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexGrow: 1,
    justifyContent: "center",
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
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    minHeight: 52,
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
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "500",
    lineHeight: 20,
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
    marginTop: 12,
    padding: 14,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
  feedbackCorrect: {
    color: "#065f46",
  },
  feedbackIncorrect: {
    color: "#991b1b",
  },
  summaryContentContainer: {
    justifyContent: "center",
    minHeight: "100%",
  },
  summaryContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  summaryTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
  },
  summaryScore: {
    fontSize: 22,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 8,
    textAlign: "center",
  },
  summaryPercentage: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 24,
  },
  summaryButtons: {
    width: "100%",
    gap: 10,
    paddingHorizontal: 4,
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
