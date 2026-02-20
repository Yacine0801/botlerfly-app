import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";
const USER_EMAIL_KEY = "user_email";

async function getStoredValue(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setStoredValue(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function removeStoredValue(key: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

export interface AuthHook {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, joinCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

/**
 * Hook to manage authentication state
 */
export function useAuth(): AuthHook {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getStoredValue(AUTH_TOKEN_KEY);
      const email = await getStoredValue(USER_EMAIL_KEY);
      setIsAuthenticated(!!token);
      setUserEmail(email);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUserEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, joinCode?: string) => {
    try {
      await setStoredValue(AUTH_TOKEN_KEY, "demo_token");
      await setStoredValue(USER_EMAIL_KEY, email);
      setIsAuthenticated(true);
      setUserEmail(email);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeStoredValue(AUTH_TOKEN_KEY);
      await removeStoredValue(USER_EMAIL_KEY);
      setIsAuthenticated(false);
      setUserEmail(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    userEmail,
    login,
    logout,
    isLoading,
  };
}
