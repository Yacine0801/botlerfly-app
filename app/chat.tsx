import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "@/src/constants/theme";
import { getModuleById, getModuleTitle } from "@/src/constants/modules";
import { createChat, GeminiChat } from "@/src/services/gemini";
import { Message } from "@/src/types";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const moduleId = params.module as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<GeminiChat | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const module = getModuleById(moduleId);

  // Initialize chat session and send welcome message
  useEffect(() => {
    if (module) {
      try {
        const chat = createChat(moduleId);
        setChatSession(chat);

        // Send initial greeting to get welcome message
        const initChat = async () => {
          setIsLoading(true);
          try {
            const welcomeResponse = await chat.sendMessage("Hello");
            const welcomeMessage: Message = {
              id: Date.now().toString(),
              role: "bot",
              content: welcomeResponse,
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
          } catch (error) {
            console.error("Error initializing chat:", error);
          } finally {
            setIsLoading(false);
          }
        };

        initChat();
      } catch (error) {
        console.error("Error creating chat session:", error);
      }
    }
  }, [moduleId, module]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage(inputText.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [botMessage, ...prev]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceMode = () => {
    // Navigate to voice mode with the same module
    router.push(`/voice?module=${moduleId}`);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.role === "bot";

    return (
      <View style={[styles.messageContainer, isBot ? styles.botMessage : styles.userMessage]}>
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  if (!module) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Module not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerEmoji}>{module.emoji}</Text>
            <Text style={styles.headerText}>{getModuleTitle(module, "FR")}</Text>
          </View>
          <TouchableOpacity onPress={handleVoiceMode} style={styles.headerButton}>
            <Ionicons name="mic" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Messages Area */}
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.typingIndicator}>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color={COLORS.grey400} />
                    <Text style={styles.typingText}>BotlerFly is typing...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.grey400}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={handleSend}
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={20}
                color={!inputText.trim() || isLoading ? COLORS.grey400 : COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Trust Badge */}
          <View style={styles.trustBadge}>
            <Ionicons name="lock-closed" size={12} color={COLORS.grey400} />
            <Text style={styles.trustBadgeText}>
              Data protected · EU hosted · GDPR compliant
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.navy,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.navyDark,
  },
  headerButton: {
    padding: SPACING.xs,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
    justifyContent: "center",
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  messagesList: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.md,
    maxWidth: "80%",
  },
  botMessage: {
    alignSelf: "flex-start",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  messageBubble: {
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  botBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.orange,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: COLORS.grey800,
  },
  userText: {
    color: COLORS.white,
  },
  typingIndicator: {
    marginBottom: SPACING.md,
    alignSelf: "flex-start",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  typingText: {
    fontSize: 14,
    color: COLORS.grey600,
    fontStyle: "italic",
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grey200,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm + 4,
    paddingBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: 15,
    color: COLORS.grey800,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    backgroundColor: COLORS.orange,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.grey200,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: SPACING.xs,
  },
  trustBadgeText: {
    fontSize: 11,
    color: COLORS.grey400,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.grey600,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.md,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
