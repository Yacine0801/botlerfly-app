import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import { MODULES } from "@/src/constants/modules";

export default function CheckInScreen() {
  const router = useRouter();
  const userName = "Yacine"; // TODO: Get from user context/state

  const handleStartCheckin = () => {
    // Navigate to the first module or a module selection screen
    router.push(`/chat?module=${MODULES[0].id}`);
  };

  const handleModulePress = (moduleId: string) => {
    router.push(`/chat?module=${moduleId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>BotlerFly</Text>
            <Text style={styles.logoIcon}>🦋</Text>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Bonjour {userName}</Text>
          <Text style={styles.subGreeting}>Ready for your daily check-in?</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.grey600} />
            <Text style={styles.statLabel}>Last check-in</Text>
            <Text style={styles.statValue}>Yesterday</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={20} color={COLORS.orange} />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>7 days</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleStartCheckin}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>Start your BotlerFly</Text>
          <Ionicons name="arrow-forward" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* Modules Section */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Choose a module</Text>
          <Text style={styles.sectionSubtitle}>
            Or start a guided check-in above
          </Text>

          {MODULES.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handleModulePress(module.id)}
              activeOpacity={0.7}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>{module.emoji}</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>
                  {module.title} / {module.titleEN}
                </Text>
                <Text style={styles.moduleDescription}>
                  {module.description}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.grey400}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.navy,
  },
  logoIcon: {
    fontSize: 24,
  },
  greetingSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.grey600,
  },
  statsContainer: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    gap: SPACING.xs,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey600,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
  },
  ctaButton: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  modulesSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.grey600,
    marginBottom: SPACING.md,
  },
  moduleCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.orangeBg,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleEmoji: {
    fontSize: 24,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: SPACING.xs,
  },
  moduleDescription: {
    fontSize: 13,
    color: COLORS.grey600,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: SPACING.lg,
  },
});
