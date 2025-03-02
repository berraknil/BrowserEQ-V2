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

      // Initialize mute state from preset
      if (preset && preset.mainOut) {
        isMuted.value = preset.mainOut.muted || false;
        rememberedVolume = preset.mainOut.gain || 1.0;

        // Apply initial volume based on mute state
        if (gainNode) {
          gainNode.gain.value = isMuted.value ? 0 : rememberedVolume;
        }
      }

      // Create filter nodes
      filters.value = Object.values(preset.filters).map((EQFilter) => {
        let filter = audioCtx.createBiquadFilter();
        filter.type = EQFilter.type as BiquadFilterType;
        filter.frequency.value = 20;

        if (EQFilter.type === "peaking") {
          filter.Q.value = EQFilter.Q.value;
        } else {
          filter.Q.value = 0;
        }

        if (EQFilter.type === "lowshelf" || EQFilter.type === "highshelf") {
          filter.gain.value = EQFilter.gain.value;
        } else {
          filter.gain.value = 0;
        }

        return filter;
      });

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

export function updateFilterValue(filterType: BiquadFilterType, value: number) {
  const filter = filters.value.find((filter) => filter.type === filterType);
  if (filter) {
    filter.frequency.value = value;
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
  if (!targetFilter) return;

  // Set enabled state in preset
  (preset.filters as any)[filterType].enabled = enabled;

  if (enabled) {
    // Enabling filter
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
