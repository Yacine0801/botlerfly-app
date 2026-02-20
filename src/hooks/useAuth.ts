import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "auth_token";
const USER_EMAIL_KEY = "user_email";

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
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const email = await SecureStore.getItemAsync(USER_EMAIL_KEY);
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
      // In a real app, this would call your API
      // For now, we'll just store the email
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, "demo_token");
      await SecureStore.setItemAsync(USER_EMAIL_KEY, email);
      setIsAuthenticated(true);
      setUserEmail(email);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_EMAIL_KEY);
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
