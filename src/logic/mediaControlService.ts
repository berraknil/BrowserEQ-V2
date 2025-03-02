import { ref } from "vue";

// Constants for time controls
export const DEFAULT_SKIP_TIME = 15; // seconds

// Track the last media action status
export const lastActionStatus = ref<{
  action: string;
  success: boolean;
  message?: string;
} | null>(null);

/**
 * Send a media control command to the active tab's content script
 */
export async function sendMediaCommand(
  action: string,
  options: Record<string, any> = {}
): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
          lastActionStatus.value = {
            action,
            success: false,
            message: "No active tab found",
          };
          resolve(false);
          return;
        }

        // Send message with timeout for response
        const timeout = setTimeout(() => {
          lastActionStatus.value = {
            action,
            success: false,
            message: "Command timed out",
          };
          resolve(false);
        }, 1000);

        chrome.tabs.sendMessage(
          activeTab.id,
          { action, ...options },
          (response) => {
            clearTimeout(timeout);

            if (chrome.runtime.lastError) {
              lastActionStatus.value = {
                action,
                success: false,
                message: chrome.runtime.lastError.message,
              };
              resolve(false);
              return;
            }

            lastActionStatus.value = {
              action,
              success: response?.success ?? false,
              message: response?.message,
            };
            resolve(response?.success ?? false);
          }
        );
      });
    });
  } catch (e) {
    console.error("Error sending media command:", e);
    lastActionStatus.value = {
      action,
      success: false,
      message: e.message,
    };
    return false;
  }
}

/**
 * Toggle play/pause state of the media
 */
export async function togglePlayback(
  currentStream: MediaStream
): Promise<boolean> {
  try {
    if (!currentStream) return false;

    // Toggle both audio and video tracks
    const tracks = currentStream.getTracks();
    tracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    // Update play state based on audio track
    const audioTrack = currentStream.getAudioTracks()[0];
    const isPlaying = audioTrack?.enabled ?? false;

    // Send message to content script to sync video state
    await sendMediaCommand(isPlaying ? "resumeStream" : "pauseStream", {
      streamEnabled: isPlaying,
    });

    return isPlaying;
  } catch (e) {
    console.warn("Error toggling playback:", e);
    return false;
  }
}

/**
 * Rewind the current media by a specified amount of time
 */
export async function rewindStream(
  seconds: number = DEFAULT_SKIP_TIME
): Promise<boolean> {
  return sendMediaCommand("rewindStream", { seconds });
}

/**
 * Fast-forward the current media by a specified amount of time
 */
export async function forwardStream(
  seconds: number = DEFAULT_SKIP_TIME
): Promise<boolean> {
  return sendMediaCommand("forwardStream", { seconds });
}

/**
 * Restart the current media from the beginning
 */
export async function restartStream(): Promise<boolean> {
  return sendMediaCommand("restartStream");
}

/**
 * Get the current playback status
 */
export async function getPlaybackStatus(): Promise<{
  playing: boolean;
  currentTime: number;
  duration: number;
  canSeek: boolean;
} | null> {
  const response = await sendMediaCommand("getMediaStatus");
  if (!response) return null;

  // Extract status from lastActionStatus which contains the response data
  const status = lastActionStatus.value?.message
    ? JSON.parse(lastActionStatus.value.message)
    : null;

  return status;
}
