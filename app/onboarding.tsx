import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { getDeviceLanguage, translations } from "@/src/utils/locale";
import { StatusBar } from "expo-status-bar";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  key: "slide1" | "slide2" | "slide3";
}

const SLIDES: Slide[] = [
  {
    icon: "chatbubbles-outline",
    key: "slide1",
  },
  {
    icon: "mic-outline",
    key: "slide2",
  },
  {
    icon: "shield-checkmark-outline",
    key: "slide3",
  },
];

export default function OnboardingScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useOnboarding();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Detect device locale for language
  const [language, setLanguage] = useState<"en" | "fr">("en");

  useEffect(() => {
    const deviceLang = getDeviceLanguage();
    setLanguage(deviceLang);
  }, []);

  const t = translations[language];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(index);
      },
    }
  );

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await completeOnboarding();
      router.replace("/login");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {SLIDES.map((slide, index) => {
            const slideContent = t.onboarding[slide.key];
            return (
              <View key={index} style={styles.slide}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={slide.icon}
                    size={120}
                    color={COLORS.orange}
                  />
                </View>
                <Text style={styles.title}>{slideContent.title}</Text>
                <Text style={styles.subtitle}>{slideContent.subtitle}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Dot Indicators */}
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => {
            const opacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            const scale = scrollX.interpolate({
              inputRange: [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ],
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity,
                    transform: [{ scale }],
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? t.getStarted : t.next}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
  },
  skipText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    opacity: 0.85,
    lineHeight: 28,
    paddingHorizontal: SPACING.md,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
    marginHorizontal: 6,
  },
  nextButton: {
    backgroundColor: COLORS.orange,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    alignItems: "center",
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
