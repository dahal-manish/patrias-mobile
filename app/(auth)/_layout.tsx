import { Stack } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { user, initializing } = useAuth();

  // If user is authenticated, redirect to app stack
  if (!initializing && user) {
    return <Redirect href="/(app)/home" />;
  }

  return (
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
        name="login"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}

