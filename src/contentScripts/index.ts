/* eslint-disable no-console */
import { onMessage } from "webext-bridge/content-script";
import { createApp } from "vue";
import App from "./ContentScript.vue";
import { setupApp } from "~/logic/common-setup";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info("BrowserEQ v2 initialized");

  /**
   * Find the most appropriate media element on the page
   * This performs an intelligent search for the active/main media
   */
  function findActiveMediaElement(): HTMLMediaElement | null {
    try {
      // Check for known video player patterns
      const specialSelectors = [
        // YouTube
        () => document.querySelector(".html5-main-video"),
        () => document.querySelector("video.video-stream"),
        // Netflix
        () => document.querySelector(".VideoContainer video"),
        // Generic large video
        () => {
          const videos = Array.from(document.querySelectorAll("video"));
          return videos.sort(
            (a, b) =>
              b.videoWidth * b.videoHeight - a.videoWidth * a.videoHeight
          )[0]; // Return the largest video
        },
      ];

      // Try each selector strategy in order
      for (const selector of specialSelectors) {
        const element = selector();
        if (element instanceof HTMLVideoElement && element.readyState > 0) {
          return element;
        }
      }

      // Find any playing video
      const playingVideos = Array.from(
        document.querySelectorAll("video")
      ).filter((v) => !v.paused && v.currentTime > 0);
      if (playingVideos.length > 0) {
        return playingVideos[0];
      }

      // Fall back to any video with a source
      const videosWithSource = Array.from(
        document.querySelectorAll("video")
      ).filter((v) => v.src || v.querySelector("source"));
      if (videosWithSource.length > 0) {
        return videosWithSource[0];
      }

      // Last resort: audio elements
      const audios = Array.from(document.querySelectorAll("audio"));
      const playingAudio = audios.find((a) => !a.paused);
      if (playingAudio) return playingAudio;

      // Return the first audio element if none are playing
      return audios[0] || null;
    } catch (e) {
      console.error("Error finding media element:", e);
      return null;
    }
  }

  /**
   * Perform a safe seek operation on a media element
   */
  function safeSeek(media: HTMLMediaElement, newTime: number): boolean {
    if (!media || media.readyState < 1) return false;

    try {
      // Handle YouTube special case
      if (window.location.hostname.includes("youtube.com")) {
        const ytPlayer = document.querySelector(".html5-video-player");
        if (ytPlayer && "seekTo" in ytPlayer) {
          // @ts-ignore: YouTube player API
          ytPlayer.seekTo(newTime);
          return true;
        }
      }

      // Standard HTML5 seek
      const wasPlaying = !media.paused;

      // Clamp time value to valid range
      const clampedTime = Math.max(0, Math.min(media.duration || 0, newTime));

      // Set currentTime and handle seeking events
      media.currentTime = clampedTime;

      // Resume playback if it was playing before
      if (wasPlaying && media.paused) {
        const playPromise = media.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => console.warn("Error resuming playback:", e));
        }
      }

      return true;
    } catch (e) {
      console.warn("Seek operation failed:", e);
      return false;
    }
  }

  // Enhanced media control message handler
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const media = findActiveMediaElement();

    // Prepare response object
    let response = {
      success: false,
      message: "No media element found",
    };

    if (media) {
      try {
        switch (message.action) {
          case "pauseStream":
            if (!media.paused) {
              media.pause();
              response = { success: true, message: "Media paused" };
            } else {
              response = { success: true, message: "Media already paused" };
            }
            break;

          case "resumeStream":
            if (media.paused) {
              const playPromise = media.play();
              if (playPromise !== undefined) {
                playPromise.catch((e) =>
                  console.warn("Error playing media:", e)
                );
              }
              response = { success: true, message: "Media resumed" };
            } else {
              response = { success: true, message: "Media already playing" };
            }
            break;

          case "rewindStream": {
            const seconds = message.seconds || 15;
            const newTime = Math.max(0, media.currentTime - seconds);
            const success = safeSeek(media, newTime);
            response = {
              success,
              message: success
                ? `Rewound ${seconds}s to ${newTime.toFixed(1)}`
                : "Failed to rewind",
            };
            break;
          }

          case "forwardStream": {
            const seconds = message.seconds || 15;
            const newTime = Math.min(
              media.duration || 0,
              media.currentTime + seconds
            );
            const success = safeSeek(media, newTime);
            response = {
              success,
              message: success
                ? `Fast-forwarded ${seconds}s to ${newTime.toFixed(1)}`
                : "Failed to fast-forward",
            };
            break;
          }

          case "restartStream": {
            const success = safeSeek(media, 0);
            response = {
              success,
              message: success ? "Media restarted" : "Failed to restart",
            };
            break;
          }

          case "getMediaStatus": {
            response = {
              success: true,
              message: JSON.stringify({
                playing: !media.paused,
                currentTime: media.currentTime,
                duration: media.duration || 0,
                canSeek: media.seekable && media.seekable.length > 0,
              }),
            };
            break;
          }
        }
      } catch (e) {
        console.error("Media control error:", e);
        response = { success: false, message: `Error: ${e.message}` };
      }
    }

    sendResponse(response);
    return true; // Keep message channel open for async response
  });

  // Create mount point first
  const mountPoint = document.createElement("div");
  mountPoint.id = "browser-eq-app";
  document.documentElement.appendChild(mountPoint);

  // Initialize Vuetify
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light",
    },
  });

  // Initialize Vue app with error handling
  function initializeApp() {
    try {
      const app = createApp(App);
      app.use(vuetify);

      // Make sure mount point exists
      const container = document.querySelector("#browser-eq-app");
      if (!container) {
        console.error("Mount point not found");
        return;
      }

      // Mount with error handling
      app.mount("#browser-eq-app");
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  }

  // Wait for document to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }

  // Cleanup mount point if needed
  window.addEventListener("unload", () => {
    const container = document.querySelector("#browser-eq-app");
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
})();
