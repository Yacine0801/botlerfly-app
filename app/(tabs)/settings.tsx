import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import { UserProfile } from "@/src/types";
import { useAuth } from "@/src/hooks/useAuth";

type NotificationTime = "9:00" | "10:00" | "11:00";
type DefaultMode = "text" | "voice";

export default function SettingsScreen() {
  const { logout, userEmail } = useAuth();

  // Mock user profile
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "Sarah Johnson",
    email: userEmail || "sarah.j@company.com",
    company: "Acme Corp",
    role: "Product Manager",
    language: "EN",
  });

  const [language, setLanguage] = useState<"FR" | "EN">(profile.language);
  const [notificationTime, setNotificationTime] =
    useState<NotificationTime>("10:00");
  const [defaultMode, setDefaultMode] = useState<DefaultMode>("text");

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleResetOnboarding = async () => {
    Alert.alert(
      "Reset Onboarding",
      "This will show the onboarding flow again. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("onboarding_completed");
            await logout();
            router.replace("/onboarding");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLinkPress = async (url: string, title: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Cannot open ${title}`);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open ${title}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <Text style={styles.profileMeta}>
                {profile.company} • {profile.role}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingsCard}>
            {/* Language Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="language" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <View style={styles.languageToggle}>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "FR" && styles.languageOptionActive,
                  ]}
                  onPress={() => setLanguage("FR")}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      language === "FR" && styles.languageOptionTextActive,
                    ]}
                  >
                    FR
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "EN" && styles.languageOptionActive,
                  ]}
                  onPress={() => setLanguage("EN")}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      language === "EN" && styles.languageOptionTextActive,
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Notification Time */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="notifications" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>Reminder Time</Text>
              </View>
              <View style={styles.timeSelector}>
                {(["9:00", "10:00", "11:00"] as NotificationTime[]).map(
                  (time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        notificationTime === time && styles.timeOptionActive,
                      ]}
                      onPress={() => setNotificationTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          notificationTime === time &&
                            styles.timeOptionTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Default Mode */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubble" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>Default Check-in Mode</Text>
              </View>
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[
                    styles.modeOption,
                    defaultMode === "text" && styles.modeOptionActive,
                  ]}
                  onPress={() => setDefaultMode("text")}
                >
                  <Text style={styles.modeIcon}>💬</Text>
                  <Text
                    style={[
                      styles.modeOptionText,
                      defaultMode === "text" && styles.modeOptionTextActive,
                    ]}
                  >
                    Text
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modeOption,
                    defaultMode === "voice" && styles.modeOptionActive,
                  ]}
                  onPress={() => setDefaultMode("voice")}
                >
                  <Text style={styles.modeIcon}>🎤</Text>
                  <Text
                    style={[
                      styles.modeOptionText,
                      defaultMode === "voice" && styles.modeOptionTextActive,
                    ]}
                  >
                    Voice
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingsCard}>
            {/* App Version */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>App Version</Text>
              </View>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>

            <View style={styles.divider} />

            {/* About BotlerFly */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() =>
                handleLinkPress("https://botlerfly.com", "About BotlerFly")
              }
            >
              <View style={styles.settingLeft}>
                <Ionicons name="globe" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>About BotlerFly</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.grey400}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Privacy Policy */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() =>
                handleLinkPress(
                  "https://botlerfly.com/privacy",
                  "Privacy Policy"
                )
              }
            >
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.grey400}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Terms of Service */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() =>
                handleLinkPress("https://botlerfly.com/terms", "Terms of Service")
              }
            >
              <View style={styles.settingLeft}>
                <Ionicons name="document-text" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.grey400}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleSignOut}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="log-out" size={20} color={COLORS.danger} />
                <Text style={[styles.settingLabel, styles.signOutText]}>
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleResetOnboarding}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="refresh" size={20} color={COLORS.grey600} />
                <Text style={styles.settingLabel}>
                  Reset Onboarding
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.navy,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.grey600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.grey600,
    marginBottom: SPACING.xs,
  },
  profileMeta: {
    fontSize: 13,
    color: COLORS.grey400,
  },
  settingsCard: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.md,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.navy,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 16,
    color: COLORS.grey600,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grey100,
    marginLeft: SPACING.md + 20 + SPACING.sm,
  },
  languageToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    padding: 2,
  },
  languageOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm - 2,
  },
  languageOptionActive: {
    backgroundColor: COLORS.orange,
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.grey600,
  },
  languageOptionTextActive: {
    color: COLORS.white,
  },
  timeSelector: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  timeOption: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.white,
  },
  timeOptionActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  timeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.grey600,
  },
  timeOptionTextActive: {
    color: COLORS.white,
  },
  modeToggle: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  modeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    backgroundColor: COLORS.white,
  },
  modeOptionActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  modeIcon: {
    fontSize: 16,
  },
  modeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.grey600,
  },
  modeOptionTextActive: {
    color: COLORS.white,
  },
  signOutText: {
    color: COLORS.danger,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
