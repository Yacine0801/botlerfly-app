import React, { useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/theme";
import { StatusBar } from "expo-status-bar";

/**
 * Splash/Index screen - shows briefly on app launch
 * The root layout will handle routing to onboarding/login/tabs
 */
export default function IndexScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

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

    // Give the splash screen a brief moment, then let the layout handle routing
    const timer = setTimeout(() => {
      // The root layout will determine where to go
      router.replace("/(tabs)");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
