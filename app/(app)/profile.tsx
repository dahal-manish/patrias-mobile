import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: "settings",
      title: "Settings",
      icon: "settings" as const,
      color: "#10b981",
      onPress: () => {
        // TODO: Navigate to settings screen when implemented
        Alert.alert("Coming Soon", "Settings screen will be available soon!");
      },
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle" as const,
      color: "#3b82f6",
      onPress: () => {
        Alert.alert("Help", "For support, please contact us at support@patrias.us");
      },
    },
    {
      id: "about",
      title: "About",
      icon: "information-circle" as const,
      color: "#8b5cf6",
      onPress: () => {
        Alert.alert(
          "About Patrias",
          "Patrias helps you prepare for the U.S. Citizenship Test with practice questions, flashcards, and progress tracking."
        );
      },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#10b981" />
          </View>
          <Text style={styles.emailText}>{user?.email}</Text>
          <Text style={styles.memberText}>Member since {new Date().getFullYear()}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, isLoggingOut && styles.signOutButtonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="log-out" size={20} color="#fff" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 48,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#10b981",
  },
  emailText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  memberText: {
    fontSize: 14,
    color: "#6b7280",
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 16,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
  },
});

