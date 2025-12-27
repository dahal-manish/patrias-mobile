import { Slot, Redirect, useSegments } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { ProgressProvider } from "../../src/context/ProgressContext";
import { PracticeSessionProvider } from "../../src/context/PracticeSessionContext";
import { BottomTabBar } from "../../components/BottomTabBar";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppLayout() {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  // If user is not authenticated, redirect to auth stack
  if (!initializing && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Show nothing while initializing (parent layout handles loading screen)
  if (initializing) {
    return null;
  }

  // Hide tab bar on practice screen
  const hideTabBar = segments.includes("practice");

  return (
    <ProgressProvider>
      <PracticeSessionProvider>
        <View style={styles.container}>
          <View style={styles.content}>
            <Slot />
          </View>
          {!hideTabBar && (
            <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
              <BottomTabBar />
            </View>
          )}
        </View>
      </PracticeSessionProvider>
    </ProgressProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

