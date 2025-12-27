import { Slot } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { user, initializing } = useAuth();

  // If user is authenticated, redirect to app stack
  if (!initializing && user) {
    return <Redirect href="/(app)/home" />;
  }

  return <Slot />;
}

