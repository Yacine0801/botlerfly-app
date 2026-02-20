import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/theme";
import { StatusBar } from "expo-status-bar";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { useAuth } from "@/src/hooks/useAuth";

/**
 * Splash/Index screen - shows briefly on app launch
 * Checks onboarding and auth status, then routes accordingly
 */
export default function IndexScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const isLoading = onboardingLoading || authLoading;

  useEffect(() => {
    // Animate the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace("/onboarding");
      } else if (!isAuthenticated) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLoading, hasCompletedOnboarding, isAuthenticated]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons name="chatbubbles" size={100} color={COLORS.orange} />
        <Animated.Text style={[styles.logoText, { opacity: fadeAnim }]}>
          BotlerFly
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 20,
    letterSpacing: -0.5,
  },
});
