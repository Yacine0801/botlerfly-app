import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/theme";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { useAuth } from "@/src/hooks/useAuth";

export default function RootLayout() {
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const isLoading = onboardingLoading || authLoading;

  useEffect(() => {
    if (isLoading) return;

    // Handle routing based on onboarding and auth status
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    } else if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [hasCompletedOnboarding, isAuthenticated, isLoading]);

  // Show loading screen while checking status
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={COLORS.navy} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.navy} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.offWhite },
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" options={{ presentation: "card" }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.navy,
  },
});
