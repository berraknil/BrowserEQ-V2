import { ref } from "vue";

export interface EQFilter {
  type: BiquadFilterType;
  frequency: { value: number };
  Q?: { value: number };
  gain?: { value: number };
  enabled: boolean;
}

export interface EQPreset {
  mainOut: {
    gain: number;
    muted: boolean;
  };
  filters: {
    [key: string]: EQFilter;
  };
}

// State
export const filters = ref<BiquadFilterNode[]>([]);
export const activeFilters = ref<BiquadFilterNode[]>([]);
export const lastFilter = ref<BiquadFilterNode | null>(null);

// Add mute state tracking
export const isMuted = ref(false);
export let rememberedVolume = 1.0;

export let gainNode: GainNode | null = null;
export let source: MediaStreamAudioSourceNode;
export let audioCtx: AudioContext;

// Add this utility function at the top with other utility functions
function bandwidthToQ(bandwidth: number): number {
  // Convert bandwidth (0-100) to Q (0.1-10)
  // Higher bandwidth = lower Q, Lower bandwidth = higher Q
  return 10.1 - bandwidth / 10;
}

// Setup audio context and capture
export async function startCapture(
  preset: EQPreset
): Promise<MediaStream | null> {
  return new Promise((resolve) => {
    chrome.tabCapture.capture({ audio: true }, (stream) => {
      if (!stream) {
        resolve(null);
        return;
      }

      const AudioContext = window.AudioContext;
      audioCtx = new AudioContext();
      source = audioCtx.createMediaStreamSource(stream);
      gainNode = audioCtx.createGain();
      source.connect(gainNode);

      // Initialize mute state and volume
      if (preset?.mainOut) {
        isMuted.value = preset.mainOut.muted || false;
        rememberedVolume = preset.mainOut.gain || 1.0;
        gainNode.gain.value = isMuted.value ? 0 : rememberedVolume;
      }

      // Create and initialize filter nodes with correct initial values
      filters.value = Object.entries(preset.filters).map(
        ([type, filterData]) => {
          const filter = audioCtx.createBiquadFilter();
          filter.type = type as BiquadFilterType;

          // Set initial frequency
          filter.frequency.value = filterData.frequency.value;

          // Set Q value based on filter type
          if (filterData.Q) {
            switch (type) {
              case "bandpass":
                filter.Q.value = Math.max(0.1, filterData.Q.value); // Q must be > 0
                break;
              case "peaking":
                filter.Q.value = filterData.Q.value || 2.0; // Default Q for peaking
                break;
              case "lowpass":
              case "highpass":
                filter.Q.value = filterData.Q.value || 0.707; // Butterworth response
                break;
              default:
                filter.Q.value = filterData.Q.value || 1.0;
            }
          }

          // Set gain for filters that support it
          if (
            filterData.gain &&
            (type === "lowshelf" || type === "highshelf" || type === "peaking")
          ) {
            filter.gain.value = filterData.gain.value;
          }

          return filter;
        }
      );

      gainNode.connect(audioCtx.destination);
      resolve(stream);
    });
  });
}

// Update toggle mute function
export function toggleMute(muted: boolean, volume: number) {
  if (!gainNode || !audioCtx) return;

  // Store mute state
  isMuted.value = muted;

  if (muted) {
    // Remember current volume but set gain to 0
    rememberedVolume = volume;
    gainNode.gain.value = 0;
  } else {
    // Restore remembered volume
    gainNode.gain.value = rememberedVolume;
  }
}

// Update volume setting function
export function setVolume(volume: number) {
  if (!gainNode) return;

  // Always store the requested volume
  rememberedVolume = volume;

  // Only apply it if not muted
  if (!isMuted.value) {
    gainNode.gain.value = volume;
  }
  // If muted, we keep gain at 0 but remember the new volume for when unmuted
}

export function updateFilterValue(
  filterType: BiquadFilterType,
  value: number,
  secondaryValue?: number
) {
  const filter = filters.value.find((filter) => filter.type === filterType);
  if (!filter) return;

  // Always update frequency
  filter.frequency.value = value;

  // Handle secondary parameter based on filter type
  if (secondaryValue !== undefined) {
    switch (filterType) {
      case "bandpass":
        // Convert bandwidth value to Q
        filter.Q.value = bandwidthToQ(secondaryValue);
        break;
      case "lowpass":
      case "highpass":
        filter.Q.value = Math.max(0.1, secondaryValue); // Resonance control
        break;
      case "peaking":
      case "lowshelf":
      case "highshelf":
        filter.gain.value = secondaryValue; // Gain control in dB
        break;
    }
  }
}

export function connectToFilter(
  filterType: string,
  enabled: boolean,
  preset: EQPreset
) {
  const targetFilter = filters.value.find(
    (filter) => filter.type === filterType
  );
  if (!targetFilter || !preset.filters) return;

  const filterData = preset.filters[filterType];
  filterData.enabled = enabled;

  if (enabled) {
    // Set initial values when enabling
    targetFilter.frequency.value = filterData.frequency.value;

    // Handle Q and gain values properly
    if (filterType === "bandpass" && filterData.Q) {
      targetFilter.Q.value = bandwidthToQ(filterData.Q.value);
    } else if (filterData.Q) {
      targetFilter.Q.value = filterData.Q.value;
    }

    if (
      filterData.gain &&
      (filterType === "lowshelf" ||
        filterType === "highshelf" ||
        filterType === "peaking")
    ) {
      targetFilter.gain.value = filterData.gain.value;
    }

    try {
      if (activeFilters.value.length === 0) {
        // First filter being added
        source.disconnect();
        source.connect(targetFilter);
        targetFilter.connect(gainNode);
        activeFilters.value.push(targetFilter);
        lastFilter.value = targetFilter;
      } else {
        // Adding filter to chain
        const lastActiveFilter =
          activeFilters.value[activeFilters.value.length - 1];
        if (lastActiveFilter) {
          lastActiveFilter.disconnect();
          lastActiveFilter.connect(targetFilter);
          targetFilter.connect(gainNode);
          activeFilters.value.push(targetFilter);
          lastFilter.value = targetFilter;
        }
      }
    } catch (e) {
      console.warn("Error connecting filter:", e);
    }
  } else {
    // Disabling filter
    const filterIndex = activeFilters.value.findIndex(
      (f) => f.type === filterType
    );
    if (filterIndex === -1) return;

    try {
      if (activeFilters.value.length === 1) {
        // Last filter being removed
        targetFilter.disconnect();
        source.disconnect();
        source.connect(gainNode);
        activeFilters.value = [];
        lastFilter.value = null;
      } else if (filterIndex === 0) {
        // First filter in chain being removed
        targetFilter.disconnect();
        source.disconnect();
        source.connect(activeFilters.value[1]);
        activeFilters.value.splice(0, 1);
        lastFilter.value = activeFilters.value[activeFilters.value.length - 1];
      } else if (filterIndex === activeFilters.value.length - 1) {
        // Last filter in chain being removed
        const prevFilter = activeFilters.value[filterIndex - 1];
        targetFilter.disconnect();
        prevFilter.disconnect();
        prevFilter.connect(gainNode);
        activeFilters.value.splice(filterIndex, 1);
        lastFilter.value = prevFilter;
      } else {
        // Middle filter being removed
        const prevFilter = activeFilters.value[filterIndex - 1];
        const nextFilter = activeFilters.value[filterIndex + 1];
        targetFilter.disconnect();
        prevFilter.disconnect();
        prevFilter.connect(nextFilter);
        activeFilters.value.splice(filterIndex, 1);
        lastFilter.value = activeFilters.value[activeFilters.value.length - 1];
      }
    } catch (e) {
      console.warn("Error disconnecting filter:", e);
    }
  }
}

export function handleMonoToggle(isMono: boolean, currentGain: number) {
  if (!source || !gainNode || !audioCtx) return false;

  const sourceNode = lastFilter.value || source;
  sourceNode.disconnect();

  if (isMono) {
    // Convert to mono
    const splitter = audioCtx.createChannelSplitter(2);
    const merger = audioCtx.createChannelMerger(2);

    sourceNode.connect(splitter);

    // Mix both channels equally for true mono
    splitter.connect(merger, 0, 0); // Left to left
    splitter.connect(merger, 1, 0); // Right to left
    splitter.connect(merger, 0, 1); // Left to right
    splitter.connect(merger, 1, 1); // Right to right

    // Each channel now gets 50% of each input
    const gainCompensation = audioCtx.createGain();
    gainCompensation.gain.value = 0.5;

    merger.connect(gainCompensation);
    gainCompensation.connect(gainNode);
  } else {
    // Restore stereo
    sourceNode.connect(gainNode);
  }

  gainNode.gain.value = currentGain;
  return !isMono;
}

export function resetFilters() {
  try {
    source?.disconnect();
    filters.value.forEach((filter) => filter.disconnect());
    activeFilters.value = [];
    lastFilter.value = null;
    source?.connect(gainNode);
  } catch (e) {
    console.warn("Error resetting connections:", e);
  }
}
