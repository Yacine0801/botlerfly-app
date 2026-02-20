import { Audio } from "expo-av";

export async function requestMicPermission(): Promise<boolean> {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting microphone permission:", error);
    return false;
  }
}

export async function startRecording(): Promise<Audio.Recording> {
  try {
    // Configure audio mode for recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();

    return recording;
  } catch (error) {
    console.error("Failed to start recording:", error);
    throw error;
  }
}

export async function stopRecording(
  recording: Audio.Recording
): Promise<string> {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    return uri || "";
  } catch (error) {
    console.error("Failed to stop recording:", error);
    throw error;
  }
}

export async function playAudio(uri: string): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();

    // Cleanup when playback finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Failed to play audio:", error);
    throw error;
  }
}

export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
