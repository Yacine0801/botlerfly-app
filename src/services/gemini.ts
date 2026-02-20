import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";
import { APP_CONFIG } from "../constants/config";
import { getModuleById } from "../constants/modules";

// Initialize Gemini AI
const getGeminiClient = () => {
  const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
                 process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.");
  }

  return new GoogleGenAI({ apiKey });
};

// Chat session type
export interface GeminiChat {
  sendMessage: (message: string) => Promise<string>;
}

/**
 * Create a chat session for a specific module
 * @param moduleId - The ID of the module (pulse, blockers, skills, ideas, free)
 * @returns A chat session object
 */
export const createChat = (moduleId: string): GeminiChat => {
  const module = getModuleById(moduleId);

  if (!module) {
    throw new Error(`Module not found: ${moduleId}`);
  }

  const ai = getGeminiClient();

  // Message history for maintaining context
  const history: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  return {
    sendMessage: async (message: string): Promise<string> => {
      try {
        // Add user message to history
        history.push({
          role: "user",
          parts: [{ text: message }],
        });

        // Generate response with full context
        const response = await ai.models.generateContent({
          model: APP_CONFIG.geminiModel,
          contents: history,
          config: {
            systemInstruction: module.systemPrompt,
          },
        });

        const responseText = response.text || "";

        // Add model response to history
        history.push({
          role: "model",
          parts: [{ text: responseText }],
        });

        return responseText;
      } catch (error) {
        console.error("Error sending message to Gemini:", error);
        throw new Error("Failed to get response from AI. Please try again.");
      }
    },
  };
};

/**
 * Send a single message without maintaining chat history
 * Useful for one-off queries or testing
 */
export const sendSingleMessage = async (
  moduleId: string,
  message: string
): Promise<string> => {
  const module = getModuleById(moduleId);

  if (!module) {
    throw new Error(`Module not found: ${moduleId}`);
  }

  const ai = getGeminiClient();

  try {
    const response = await ai.models.generateContent({
      model: APP_CONFIG.geminiModel,
      contents: message,
      config: {
        systemInstruction: module.systemPrompt,
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI. Please try again.");
  }
};

/**
 * Generate a summary of the chat conversation
 */
export const generateChatSummary = async (
  moduleId: string,
  messages: Array<{ role: string; content: string }>
): Promise<string> => {
  const ai = getGeminiClient();

  const conversationText = messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const prompt = `Please summarize this ${moduleId} check-in conversation:\n\n${conversationText}`;

  try {
    const response = await ai.models.generateContent({
      model: APP_CONFIG.geminiModel,
      contents: prompt,
      config: {
        systemInstruction: `You are an AI assistant that creates concise summaries of employee check-in conversations.
        Create a brief 2-3 sentence summary highlighting the key points, insights, and any action items from the conversation.`,
      },
    });

    return response.text || "Summary generation failed.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Summary generation failed.";
  }
};
