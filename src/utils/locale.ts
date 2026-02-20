import { Platform, NativeModules } from "react-native";

/**
 * Detects the device language
 * Returns 'en' or 'fr' based on device locale
 */
export function getDeviceLanguage(): "en" | "fr" {
  let locale = "en";

  try {
    if (Platform.OS === "ios") {
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        "en";
    } else if (Platform.OS === "android") {
      locale = NativeModules.I18nManager?.localeIdentifier || "en";
    }

    // Convert locale to simple language code
    const languageCode = locale.split(/[-_]/)[0].toLowerCase();

    // Return 'fr' if French, otherwise default to 'en'
    return languageCode === "fr" ? "fr" : "en";
  } catch (error) {
    console.error("Error detecting device language:", error);
    return "en";
  }
}

/**
 * Get translations for a given language
 */
export const translations = {
  en: {
    skip: "Skip",
    next: "Next",
    getStarted: "Get Started",
    onboarding: {
      slide1: {
        title: "5 minutes. Zero meetings.",
        subtitle:
          "Share your updates, ideas, and blockers through a quick AI interview.",
      },
      slide2: {
        title: "Text or voice. Your choice.",
        subtitle:
          "Respond by text or speak naturally. BotlerFly understands both, in your language.",
      },
      slide3: {
        title: "Your data stays yours.",
        subtitle: "EU hosted. GDPR compliant. Encrypted. Never shared.",
      },
    },
  },
  fr: {
    skip: "Passer",
    next: "Suivant",
    getStarted: "Commencer",
    onboarding: {
      slide1: {
        title: "5 minutes. Zéro meeting.",
        subtitle:
          "Partagez vos mises à jour, idées et blocages via une interview IA rapide.",
      },
      slide2: {
        title: "Texte ou voix. À vous de choisir.",
        subtitle:
          "Répondez par texte ou parlez naturellement. BotlerFly comprend les deux, dans votre langue.",
      },
      slide3: {
        title: "Vos données restent les vôtres.",
        subtitle: "Hébergé en UE. Conforme RGPD. Chiffré. Jamais partagé.",
      },
    },
  },
};
