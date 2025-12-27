import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { useOverallStats } from "../../src/hooks/useAnalytics";
import { getCurrentStreak, hasPracticedToday } from "../../src/lib/streaks";
import {
  scheduleDailyReminder,
  isDailyReminderScheduled,
} from "../../src/lib/notifications";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: overallStats, isLoading: loadingStats } = useOverallStats();
  const [isScheduling, setIsScheduling] = useState(false);
  const [reminderScheduled, setReminderScheduled] = useState(false);
  const [streak, setStreak] = useState<{ current_streak: number; longest_streak: number } | null>(null);
  const [practicedToday, setPracticedToday] = useState<boolean>(false);
  const [loadingStreak, setLoadingStreak] = useState(true);

  // Check if reminder is already scheduled on mount
  useEffect(() => {
    const checkReminderStatus = async () => {
      const scheduled = await isDailyReminderScheduled();
      setReminderScheduled(scheduled);
    };
    checkReminderStatus();
  }, []);

  // Load streak and today's practice status
  useEffect(() => {
    const loadStreakData = async () => {
      setLoadingStreak(true);
      try {
        const streakData = await getCurrentStreak();
        if (streakData) {
          setStreak(streakData);
        }
        const practiced = await hasPracticedToday();
        setPracticedToday(practiced);
      } catch (error) {
        console.error("Error loading streak data:", error);
      } finally {
        setLoadingStreak(false);
      }
    };
    loadStreakData();
  }, []);

  const handleSetReminder = async () => {
    setIsScheduling(true);
    try {
      // Schedule the reminder (this will request permissions if needed)
      const success = await scheduleDailyReminder();
      if (success) {
        setReminderScheduled(true);
        Alert.alert(
          "Reminder Set!",
          "You'll receive a daily reminder at 8:00 PM to practice your civics questions.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive daily reminders.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      Alert.alert(
        "Error",
        "An error occurred while setting the reminder. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.emailText}>{user?.email}</Text>

      {/* Quick Stats */}
      {(overallStats || streak) && (
        <View style={styles.statsContainer}>
          {streak && (
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{streak.current_streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              {practicedToday && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayBadgeText}>✓ Today</Text>
                </View>
              )}
            </View>
          )}
          {overallStats && (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{overallStats.totalQuestions}</Text>
                <Text style={styles.statLabel}>Questions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{overallStats.accuracy.toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </>
          )}
        </View>
      )}

      {loadingStreak && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#10b981" />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(app)/practice")}
        >
          <Text style={styles.buttonText}>Start 10-question practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(app)/study")}
        >
          <Text style={styles.buttonText}>Study Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(app)/analytics")}
        >
          <Text style={styles.buttonText}>View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonSecondary,
            reminderScheduled && styles.buttonActive,
            isScheduling && styles.buttonDisabled,
          ]}
          onPress={handleSetReminder}
          disabled={isScheduling}
        >
          <Text
            style={[
              styles.buttonText,
              styles.buttonTextSecondary,
              reminderScheduled && styles.buttonTextActive,
            ]}
          >
            {isScheduling
              ? "Setting reminder..."
              : reminderScheduled
              ? "✓ Daily reminder set (8 PM)"
              : "Set daily reminder"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 32,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    position: "relative",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  todayBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  todayBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 16,
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
  buttonActive: {
    backgroundColor: "#d1fae5",
    borderWidth: 2,
    borderColor: "#10b981",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonDanger: {
    backgroundColor: "#ef4444",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#1f2937",
  },
  buttonTextActive: {
    color: "#065f46",
  },
  buttonTextDanger: {
    color: "#fff",
  },
});

