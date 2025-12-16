import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { validatePassword, validateEmail } from "../../src/lib/validation";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(validatePassword(""));
  const { signup } = useAuth();
  const router = useRouter();

  // Update password validation as user types
  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

  const handleSignup = async () => {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      Alert.alert("Error", emailValidation.error || "Please enter a valid email");
      return;
    }

    // Validate password
    if (!passwordValidation.isValid) {
      Alert.alert(
        "Password Requirements",
        passwordValidation.errors.join("\n") || "Please fix the password requirements"
      );
      return;
    }

    setLoading(true);
    const { error } = await signup(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert("Signup Failed", error.message || "An error occurred during signup");
    } else {
      // If signup succeeds and session is returned, navigation happens automatically
      // Otherwise, show a message about email confirmation if needed
      Alert.alert(
        "Success",
        "Account created! Please check your email to confirm your account.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/login"),
          },
        ]
      );
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "weak":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "strong":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

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

        <View>
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

          {/* Password validation feedback */}
          {password.length > 0 && (
            <View style={styles.validationContainer}>
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthLabel}>Password strength: </Text>
                <Text
                  style={[
                    styles.strengthValue,
                    { color: getStrengthColor(passwordValidation.strength) },
                  ]}
                >
                  {passwordValidation.strength}
                </Text>
              </View>

              {passwordValidation.errors.length > 0 && (
                <View style={styles.errorsContainer}>
                  {passwordValidation.errors.map((error, index) => (
                    <Text key={index} style={styles.errorText}>
                      • {error}
                    </Text>
                  ))}
                </View>
              )}

              {/* Show checkmarks for passed requirements */}
              {passwordValidation.checks.length > 0 && password.length > 0 && (
                <View style={styles.checksContainer}>
                  {passwordValidation.checks.map((check, index) => (
                    <View key={index} style={styles.checkRow}>
                      <Text style={styles.checkIcon}>
                        {check.passed ? "✓" : "○"}
                      </Text>
                      <Text
                        style={[
                          styles.checkText,
                          check.passed ? styles.checkPassed : styles.checkFailed,
                        ]}
                      >
                        {check.message}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (loading || !passwordValidation.isValid) && styles.buttonDisabled,
          ]}
          onPress={handleSignup}
          disabled={loading || !passwordValidation.isValid}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    marginTop: 32,
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
  validationContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  strengthValue: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  errorsContainer: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginBottom: 4,
  },
  checksContainer: {
    marginTop: 8,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 16,
  },
  checkText: {
    fontSize: 12,
  },
  checkPassed: {
    color: "#10b981",
  },
  checkFailed: {
    color: "#9ca3af",
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
    marginBottom: 32,
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

