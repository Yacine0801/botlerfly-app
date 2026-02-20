import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import { useAuth } from "@/src/hooks/useAuth";
import { StatusBar } from "expo-status-bar";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleContinue = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, joinCode || undefined);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithoutAccount = () => {
    // For demo mode, we'll just navigate to tabs without auth
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
              {/* Logo Section */}
              <View style={styles.logoContainer}>
                <View style={styles.logoIconContainer}>
                  <Ionicons
                    name="chatbubbles"
                    size={60}
                    color={COLORS.orange}
                  />
                </View>
                <Text style={styles.logoText}>BotlerFly</Text>
                <Text style={styles.tagline}>
                  Your AI-powered standup assistant
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="you@company.com"
                    placeholderTextColor={COLORS.grey400}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Join Code (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter team invitation code"
                    placeholderTextColor={COLORS.grey400}
                    value={joinCode}
                    onChangeText={setJoinCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    isLoading && styles.continueButtonDisabled,
                  ]}
                  onPress={handleContinue}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.continueButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>

                {/* Or Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.divider} />
                </View>

                {/* Continue Without Account */}
                <TouchableOpacity
                  onPress={handleContinueWithoutAccount}
                  disabled={isLoading}
                >
                  <Text style={styles.linkText}>
                    Continue without account
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By continuing, you agree to our Terms & Privacy Policy
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navyDark,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: SPACING.xxl * 2,
    paddingBottom: SPACING.xxl,
  },
  logoIconContainer: {
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.7,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: SPACING.xxl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.white,
  },
  continueButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.md,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: COLORS.white,
    opacity: 0.6,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.orangeLight,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    paddingVertical: SPACING.xl,
  },
  footerText: {
    color: COLORS.white,
    opacity: 0.5,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
