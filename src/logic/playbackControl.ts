export async function togglePlayback(currentStream: MediaStream) {
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          action: isPlaying ? "resumeStream" : "pauseStream",
          streamEnabled: isPlaying,
        });
      }
    });

    return isPlaying;
  } catch (e) {
    console.warn("Error toggling playback:", e);
    return false;
  }
}
