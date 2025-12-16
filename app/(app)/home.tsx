import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import {
  scheduleDailyReminder,
  isDailyReminderScheduled,
} from "../../src/lib/notifications";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScheduling, setIsScheduling] = useState(false);
  const [reminderScheduled, setReminderScheduled] = useState(false);

  // Check if reminder is already scheduled on mount
  useEffect(() => {
    const checkReminderStatus = async () => {
      const scheduled = await isDailyReminderScheduled();
      setReminderScheduled(scheduled);
    };
    checkReminderStatus();
  }, []);

  const handleLogout = async () => {
    await logout();
    // Navigation will happen automatically via AuthContext state change
  };

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(app)/practice")}
        >
          <Text style={styles.buttonText}>Start 10-question practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(app)/progress")}
        >
          <Text style={styles.buttonText}>View progress</Text>
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

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.buttonTextDanger]}>Log out</Text>
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
    marginBottom: 32,
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

