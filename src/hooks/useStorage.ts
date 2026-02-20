import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

export interface StorageHook {
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * Custom hook for persisting data using expo-secure-store
 * Handles JSON serialization/deserialization automatically
 */
export function useStorage(): StorageHook {
  const getItem = async <T,>(key: string): Promise<T | null> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  };

  const setItem = async <T,>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  };

  const removeItem = async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  };

  return { getItem, setItem, removeItem };
}

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: "user_profile",
  LANGUAGE: "language",
  CHECK_IN_HISTORY: "check_in_history",
  NOTIFICATION_TIME: "notification_time",
  DEFAULT_MODE: "default_mode",
  ONBOARDING_COMPLETED: "onboarding_completed",
  AUTH_TOKEN: "auth_token",
  USER_EMAIL: "user_email",
};
