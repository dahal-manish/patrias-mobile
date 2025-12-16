import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // Redirect to appropriate stack based on auth state
  if (user) {
    return <Redirect href="/(app)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

