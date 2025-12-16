import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { validateEmail } from "../../src/lib/validation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      Alert.alert("Error", emailValidation.error || "Please enter a valid email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);
    const { error } = await login(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message || "An error occurred during login");
    } else {
      // Navigation will happen automatically via AuthContext state change
      // The (app) layout will be shown when user is set
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    backgroundColor: "#10b981",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: "#6b7280",
    fontSize: 14,
  },
  linkTextBold: {
    color: "#10b981",
    fontWeight: "600",
  },
});

