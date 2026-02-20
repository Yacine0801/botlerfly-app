import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import { CheckIn } from "@/src/types";

type FilterType = "all" | "week" | "month";

// Mock data for demonstration
const MOCK_CHECK_INS: CheckIn[] = [
  {
    id: "1",
    moduleId: "weekly-review",
    date: new Date(2026, 1, 19, 14, 30),
    messages: [
      {
        id: "m1",
        role: "bot",
        content: "How was your week?",
        timestamp: new Date(2026, 1, 19, 14, 30),
      },
      {
        id: "m2",
        role: "user",
        content:
          "Great week! Closed 3 deals and had a productive meeting with the product team.",
        timestamp: new Date(2026, 1, 19, 14, 31),
      },
    ],
    summary:
      "Great week! Closed 3 deals and had a productive meeting with the product team.",
    duration: 300,
    mode: "text",
  },
  {
    id: "2",
    moduleId: "energy-check",
    date: new Date(2026, 1, 18, 10, 15),
    messages: [
      {
        id: "m3",
        role: "bot",
        content: "How's your energy today?",
        timestamp: new Date(2026, 1, 18, 10, 15),
      },
      {
        id: "m4",
        role: "user",
        content:
          "Feeling a bit tired after yesterday's long meeting, but ready to tackle the day.",
        timestamp: new Date(2026, 1, 18, 10, 16),
      },
    ],
    summary:
      "Feeling a bit tired after yesterday's long meeting, but ready to tackle the day.",
    duration: 180,
    mode: "voice",
  },
  {
    id: "3",
    moduleId: "daily-priorities",
    date: new Date(2026, 1, 17, 9, 0),
    messages: [
      {
        id: "m5",
        role: "bot",
        content: "What are your top 3 priorities today?",
        timestamp: new Date(2026, 1, 17, 9, 0),
      },
      {
        id: "m6",
        role: "user",
        content:
          "1. Finish Q1 report 2. Client presentation at 2pm 3. Review team feedback forms",
        timestamp: new Date(2026, 1, 17, 9, 1),
      },
    ],
    summary:
      "1. Finish Q1 report 2. Client presentation at 2pm 3. Review team feedback forms",
    duration: 240,
    mode: "text",
  },
  {
    id: "4",
    moduleId: "challenge-reflection",
    date: new Date(2026, 1, 15, 16, 45),
    messages: [
      {
        id: "m7",
        role: "bot",
        content: "What challenge did you face today?",
        timestamp: new Date(2026, 1, 15, 16, 45),
      },
      {
        id: "m8",
        role: "user",
        content:
          "Had a difficult conversation with a stakeholder about project delays. We managed to find a solution.",
        timestamp: new Date(2026, 1, 15, 16, 46),
      },
    ],
    summary:
      "Had a difficult conversation with a stakeholder about project delays. We managed to find...",
    duration: 420,
    mode: "voice",
  },
  {
    id: "5",
    moduleId: "weekly-review",
    date: new Date(2026, 1, 12, 15, 0),
    messages: [
      {
        id: "m9",
        role: "bot",
        content: "Let's review your week!",
        timestamp: new Date(2026, 1, 12, 15, 0),
      },
      {
        id: "m10",
        role: "user",
        content:
          "Solid week overall. Made progress on the new feature launch and onboarded two new team members.",
        timestamp: new Date(2026, 1, 12, 15, 1),
      },
    ],
    summary:
      "Solid week overall. Made progress on the new feature launch and onboarded two new team...",
    duration: 360,
    mode: "text",
  },
];

const MODULE_INFO: Record<
  string,
  { emoji: string; title: string; titleEN: string }
> = {
  "weekly-review": { emoji: "📊", title: "Revue Hebdo", titleEN: "Weekly Review" },
  "energy-check": { emoji: "⚡", title: "Énergie", titleEN: "Energy Check" },
  "daily-priorities": { emoji: "🎯", title: "Priorités", titleEN: "Daily Priorities" },
  "challenge-reflection": {
    emoji: "💭",
    title: "Réflexion",
    titleEN: "Challenge Reflection",
  },
};

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(MOCK_CHECK_INS);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredCheckIns = (): CheckIn[] => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (selectedFilter) {
      case "week":
        return checkIns.filter((c) => c.date >= oneWeekAgo);
      case "month":
        return checkIns.filter((c) => c.date >= oneMonthAgo);
      default:
        return checkIns;
    }
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  const filteredCheckIns = getFilteredCheckIns();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "all" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "all" && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "week" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("week")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "week" && styles.filterChipTextActive,
              ]}
            >
              This week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === "month" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("month")}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === "month" && styles.filterChipTextActive,
              ]}
            >
              This month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Check-in List */}
        {filteredCheckIns.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📝</Text>
            <Text style={styles.emptyStateTitle}>No check-ins yet</Text>
            <Text style={styles.emptyStateText}>
              Start your first BotlerFly!
            </Text>
            <TouchableOpacity style={styles.emptyStateCTA}>
              <Text style={styles.emptyStateCTAText}>Start Check-in</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.checkInList}>
            {filteredCheckIns.map((checkIn) => {
              const module = MODULE_INFO[checkIn.moduleId];
              return (
                <TouchableOpacity
                  key={checkIn.id}
                  style={styles.checkInCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkInHeader}>
                    <View style={styles.checkInTitleRow}>
                      <Text style={styles.moduleEmoji}>{module?.emoji}</Text>
                      <Text style={styles.moduleTitle}>
                        {module?.titleEN || "Check-in"}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={COLORS.grey400}
                    />
                  </View>

                  <View style={styles.checkInMeta}>
                    <Text style={styles.metaText}>
                      {formatDate(checkIn.date)} • {formatTime(checkIn.date)}
                    </Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>
                      {formatDuration(checkIn.duration)}
                    </Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.modeIndicator}>
                      {checkIn.mode === "text" ? "💬" : "🎤"}
                    </Text>
                  </View>

                  {checkIn.summary && (
                    <Text style={styles.summaryText} numberOfLines={2}>
                      {checkIn.summary}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.navy,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grey200,
  },
  filterChipActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.grey600,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  checkInList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  checkInCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkInHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  checkInTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  moduleEmoji: {
    fontSize: 20,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.navy,
  },
  checkInMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.grey600,
  },
  metaDot: {
    fontSize: 13,
    color: COLORS.grey400,
  },
  modeIndicator: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.grey800,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl * 2,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.grey600,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  emptyStateCTA: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  emptyStateCTAText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
