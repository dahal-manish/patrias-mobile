import { Stack } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Redirect } from "expo-router";
import { ProgressProvider } from "../../src/context/ProgressContext";

export default function AppLayout() {
  const { user, initializing } = useAuth();

  // If user is not authenticated, redirect to auth stack
  if (!initializing && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Show nothing while initializing (parent layout handles loading screen)
  if (initializing) {
    return null;
  }

  return (
    <ProgressProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          title: "Patrias",
          headerStyle: {
            backgroundColor: "#10b981",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen
          name="practice"
          options={{
            title: "Practice",
          }}
        />
        <Stack.Screen
          name="progress"
          options={{
            title: "Progress",
          }}
        />
      </Stack>
    </ProgressProvider>
  );
}

