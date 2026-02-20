import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import PulsingCircle from "@/src/components/PulsingCircle";
import {
  requestMicPermission,
  startRecording,
  stopRecording,
  formatDuration,
} from "@/src/services/audio";
import { getModuleById, getModuleTitle } from "@/src/constants/modules";

type VoiceStatus = "idle" | "listening" | "thinking" | "speaking";

interface TranscriptMessage {
  id: string;
  speaker: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function VoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const moduleId = (params.module as string) || "pulse";
  const module = getModuleById(moduleId);
  const moduleTitle = module ? getModuleTitle(module, "EN") : "Daily Pulse";

  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Request permission on mount
  useEffect(() => {
    (async () => {
      const granted = await requestMicPermission();
      setHasPermission(granted);
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Microphone access is needed for voice check-ins. Please enable it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () => {
                // On iOS, you'd use Linking.openSettings()
                // For now, just show alert
                Alert.alert(
                  "Settings",
                  "Please enable microphone access in your device settings."
                );
              },
            },
          ]
        );
      }
    })();
  }, []);

  // Timer effect
  useEffect(() => {
    if (status === "listening" || status === "thinking" || status === "speaking") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1000);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(console.error);
      }
    };
  }, [recording]);

  const handleMicPress = async () => {
    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        "Please enable microphone access to use voice check-ins."
      );
      return;
    }

    if (status === "idle") {
      // Start recording
      try {
        const newRecording = await startRecording();
        setRecording(newRecording);
        setStatus("listening");
      } catch (error) {
        Alert.alert("Error", "Failed to start recording. Please try again.");
        console.error(error);
      }
    } else if (status === "listening") {
      // Stop recording and process
      try {
        if (recording) {
          const uri = await stopRecording(recording);
          setRecording(null);

          // Add user message to transcript (placeholder)
          const userMessage: TranscriptMessage = {
            id: Date.now().toString(),
            speaker: "user",
            text: "[Voice recording transcription will appear here]",
            timestamp: new Date(),
          };
          setTranscript((prev) => [...prev, userMessage]);

          // Simulate AI thinking
          setStatus("thinking");

          // Simulate AI response (placeholder)
          setTimeout(() => {
            const aiMessage: TranscriptMessage = {
              id: (Date.now() + 1).toString(),
              speaker: "ai",
              text: "Thank you for sharing. I understand what you're saying. How can I help you further?",
              timestamp: new Date(),
            };
            setTranscript((prev) => [...prev, aiMessage]);
            setStatus("speaking");

            // Return to idle after "speaking"
            setTimeout(() => {
              setStatus("idle");
            }, 3000);
          }, 2000);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to process recording. Please try again.");
        console.error(error);
        setStatus("idle");
      }
    }
  };

  const handleSwitchToText = () => {
    if (recording) {
      recording.stopAndUnloadAsync().catch(console.error);
    }
    router.push(`/chat?module=${moduleId}`);
  };

  const getStatusText = (): string => {
    switch (status) {
      case "idle":
        return "Tap to start";
      case "listening":
        return "Listening...";
      case "thinking":
        return "BotlerFly is thinking...";
      case "speaking":
        return "BotlerFly is speaking...";
    }
  };

  const getCircleColor = (): string => {
    if (status === "listening") {
      return COLORS.orange;
    }
    return COLORS.grey400;
  };

  const getMicButtonColor = (): string => {
    if (status === "listening") {
      return COLORS.danger;
    }
    return COLORS.orange;
  };

  // Auto-scroll transcript to bottom when new messages arrive
  useEffect(() => {
    if (transcript.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [transcript]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          {module && <Text style={styles.headerEmoji}>{module.emoji}</Text>}
          <Text style={styles.headerTitle}>{moduleTitle}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Voice Indicator */}
        <View style={styles.voiceIndicatorContainer}>
          <PulsingCircle
            isActive={status === "listening" || status === "thinking"}
            color={getCircleColor()}
            size={200}
          />
        </View>

        {/* Status Text */}
        <Text style={styles.statusText}>{getStatusText()}</Text>

        {/* Timer */}
        {(status === "listening" || status === "thinking" || status === "speaking") && (
          <Text style={styles.timer}>{formatDuration(elapsedTime)}</Text>
        )}

        {/* Transcript Area */}
        {transcript.length > 0 && (
          <ScrollView
            ref={scrollViewRef}
            style={styles.transcriptContainer}
            contentContainerStyle={styles.transcriptContent}
            showsVerticalScrollIndicator={false}
          >
            {transcript.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.transcriptMessage,
                  message.speaker === "user"
                    ? styles.userMessage
                    : styles.aiMessage,
                ]}
              >
                <Text
                  style={[
                    styles.transcriptSpeaker,
                    message.speaker === "user"
                      ? styles.userSpeaker
                      : styles.aiSpeaker,
                  ]}
                >
                  {message.speaker === "user" ? "You" : "BotlerFly"}
                </Text>
                <Text style={styles.transcriptText}>{message.text}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {/* Switch to Text Button */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={handleSwitchToText}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbox-outline" size={20} color={COLORS.white} />
          <Text style={styles.switchButtonText}>Switch to text</Text>
        </TouchableOpacity>

        {/* Mic Button */}
        <TouchableOpacity
          style={[
            styles.micButton,
            { backgroundColor: getMicButtonColor() },
          ]}
          onPress={handleMicPress}
          activeOpacity={0.8}
          disabled={status === "thinking" || status === "speaking"}
        >
          <Ionicons
            name={status === "listening" ? "stop" : "mic"}
            size={36}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
  voiceIndicatorContainer: {
    marginBottom: SPACING.xl,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  timer: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.orangeLight,
    marginBottom: SPACING.lg,
  },
  transcriptContainer: {
    width: "100%",
    maxHeight: 200,
    marginTop: SPACING.lg,
  },
  transcriptContent: {
    paddingVertical: SPACING.sm,
  },
  transcriptMessage: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  userMessage: {
    backgroundColor: "rgba(232, 148, 58, 0.2)",
  },
  aiMessage: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  transcriptSpeaker: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  userSpeaker: {
    color: COLORS.orangeLight,
  },
  aiSpeaker: {
    color: COLORS.white,
  },
  transcriptText: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
  },
  controls: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
