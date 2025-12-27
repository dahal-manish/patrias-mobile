import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Notification identifier for the daily reminder
const DAILY_REMINDER_ID = "daily-practice-reminder";

/**
 * Request notification permissions from the user
 * Returns true if permissions are granted, false otherwise
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permissions haven't been requested yet, ask for them
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // On Android, we also need to create a notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#10b981",
      });
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
}

/**
 * Schedule a daily reminder notification at 8 PM local time
 * Cancels any existing daily reminder before scheduling a new one
 */
export async function scheduleDailyReminder(): Promise<boolean> {
  try {
    // First, check and request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error("Notification permissions not granted");
    }

    // Cancel any existing daily reminder
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);

    // Schedule the daily reminder for 8 PM local time
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20, // 8 PM
      minute: 0,
    };

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content: {
        title: "Time to Practice! 🇺🇸",
        body: "Time to practice your civics questions with Patrias",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    return true;
  } catch (error) {
    console.error("Error scheduling daily reminder:", error);
    return false;
  }
}

/**
 * Cancel the daily reminder notification
 */
export async function cancelDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  } catch (error) {
    console.error("Error canceling daily reminder:", error);
  }
}

/**
 * Check if the daily reminder is currently scheduled
 */
export async function isDailyReminderScheduled(): Promise<boolean> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    return scheduledNotifications.some(
      (notification) => notification.identifier === DAILY_REMINDER_ID
    );
  } catch (error) {
    console.error("Error checking scheduled notifications:", error);
    return false;
  }
}

/**
 * Get notification permission status
 */
export async function getNotificationPermissionStatus(): Promise<{
  granted: boolean;
  status: Notifications.PermissionStatus;
}> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return {
      granted: status === "granted",
      status,
    };
  } catch (error) {
    console.error("Error getting notification permissions:", error);
    return {
      granted: false,
      status: "undetermined" as Notifications.PermissionStatus,
    };
  }
}

