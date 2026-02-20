import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = "onboarding_completed";

export interface OnboardingHook {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook to track if user has completed the onboarding flow
 */
export function useOnboarding(): OnboardingHook {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
      setHasCompletedOnboarding(value === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setHasCompletedOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  };

  return {
    hasCompletedOnboarding,
    completeOnboarding,
    isLoading,
  };
}
