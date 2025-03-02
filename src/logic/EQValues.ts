// Base EQ preset definitions

interface EQPreset {
  mainOut: {
    gain: number;
    muted: boolean;
  };
  filters: {
    [key: string]: EQFilter;
  };
}

interface EQFilter {
  name: string;
  type: BiquadFilterType;
  enabled: boolean;
  frequency: {
    value: number;
  };
  Q?: {
    name: string;
    value: number;
  };
  gain?: {
    value: number;
  };
}

// Create a utility function to clone the base preset to avoid reference issues
const clonePreset = (preset) => JSON.parse(JSON.stringify(preset));

// Create a base preset with default values
const basePreset = {
  mainOut: {
    gain: 1,
    muted: false,
  },
  filters: {
    highpass: {
      name: "High Pass",
      type: "highpass",
      enabled: false,
      frequency: { value: 80 },
      Q: { name: "Resonance", value: 0.7 },
    },
    bandpass: {
      name: "Band Pass",
      type: "bandpass",
      enabled: false,
      frequency: { value: 1000 },
      Q: { name: "Bandwidth", value: 1.0 },
    },
    lowpass: {
      name: "Low Pass",
      type: "lowpass",
      enabled: false,
      frequency: { value: 1000 },
      Q: { name: "Resonance", value: 0.7 },
    },
    lowshelf: {
      name: "Low Shelf",
      type: "lowshelf",
      enabled: false,
      frequency: { value: 250 },
      gain: { value: 0 },
    },
    highshelf: {
      name: "High Shelf",
      type: "highshelf",
      enabled: false,
      frequency: { value: 6000 },
      gain: { value: 0 },
    },
    peaking: {
      name: "Peaking",
      type: "peaking",
      enabled: false,
      frequency: { value: 3000 },
      Q: { name: "Bandwidth", value: 1.0 },
      gain: { value: 0 },
    },
  },
};

// Define all presets
const EQValues = {
  // Neutral preset - flat response with no processing
  Neutral: clonePreset(basePreset),

  // VoiceClarity - enhances speech intelligibility
  VoiceClarity: {
    mainOut: {
      gain: 1.1,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: true,
        frequency: { value: 120 },
        Q: { name: "Resonance", value: 0.7 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: true,
        frequency: { value: 8000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: true,
        frequency: { value: 200 },
        gain: { value: -3 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: false,
        frequency: { value: 6000 },
        gain: { value: 0 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: true,
        frequency: { value: 2500 },
        Q: { name: "Bandwidth", value: 1.2 },
        gain: { value: 5 },
      },
    },
  },

  // BassBoost - enhances low frequency response
  BassBoost: {
    mainOut: {
      gain: 1,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: false,
        frequency: { value: 80 },
        Q: { name: "Resonance", value: 0.7 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: true,
        frequency: { value: 180 },
        gain: { value: 6 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: true,
        frequency: { value: 8000 },
        gain: { value: 1.5 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: false,
        frequency: { value: 3000 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: 0 },
      },
    },
  },

  // Podcast - optimized for spoken word content
  Podcast: {
    mainOut: {
      gain: 1.2,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: true,
        frequency: { value: 85 },
        Q: { name: "Resonance", value: 0.6 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: true,
        frequency: { value: 250 },
        gain: { value: -2 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: false,
        frequency: { value: 6000 },
        gain: { value: 0 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: true,
        frequency: { value: 2800 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: 4 },
      },
    },
  },

  // ReducedFatigue - gentler on the ears for long listening sessions
  ReducedFatigue: {
    mainOut: {
      gain: 0.9,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: true,
        frequency: { value: 40 },
        Q: { name: "Resonance", value: 0.5 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: true,
        frequency: { value: 7500 },
        Q: { name: "Resonance", value: 0.6 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: true,
        frequency: { value: 200 },
        gain: { value: -1 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: true,
        frequency: { value: 6000 },
        gain: { value: -4 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: false,
        frequency: { value: 3000 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: 0 },
      },
    },
  },

  // NoiseReduction - helps when in noisy environments
  NoiseReduction: {
    mainOut: {
      gain: 1.1,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: true,
        frequency: { value: 180 },
        Q: { name: "Resonance", value: 0.8 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: true,
        frequency: { value: 6000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: false,
        frequency: { value: 250 },
        gain: { value: 0 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: false,
        frequency: { value: 6000 },
        gain: { value: 0 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: true,
        frequency: { value: 3000 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: 3 },
      },
    },
  },

  // HearingAid - simulate basic hearing aid functionality
  HearingAid: {
    mainOut: {
      gain: 1.3,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: true,
        frequency: { value: 70 },
        Q: { name: "Resonance", value: 0.5 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: false,
        frequency: { value: 250 },
        gain: { value: 0 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: true,
        frequency: { value: 4000 },
        gain: { value: 6 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: true,
        frequency: { value: 1500 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: 3 },
      },
    },
  },

  // ClassicalMusic - optimized for classical recordings
  ClassicalMusic: {
    mainOut: {
      gain: 1,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: false,
        frequency: { value: 80 },
        Q: { name: "Resonance", value: 0.7 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: true,
        frequency: { value: 120 },
        gain: { value: 1.5 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: true,
        frequency: { value: 8000 },
        gain: { value: 2 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: true,
        frequency: { value: 1800 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: -1 },
      },
    },
  },

  // Legacy presets kept for compatibility
  hissReduction: {
    mainOut: {
      gain: 1.1,
      muted: false,
    },
    filters: {
      highpass: {
        name: "High Pass",
        type: "highpass",
        enabled: false,
        frequency: { value: 80 },
        Q: { name: "Resonance", value: 0.7 },
      },
      bandpass: {
        name: "Band Pass",
        type: "bandpass",
        enabled: false,
        frequency: { value: 1000 },
        Q: { name: "Bandwidth", value: 1.0 },
      },
      lowpass: {
        name: "Low Pass",
        type: "lowpass",
        enabled: true,
        frequency: { value: 12000 },
        Q: { name: "Resonance", value: 0.7 },
      },
      lowshelf: {
        name: "Low Shelf",
        type: "lowshelf",
        enabled: false,
        frequency: { value: 250 },
        gain: { value: 0 },
      },
      highshelf: {
        name: "High Shelf",
        type: "highshelf",
        enabled: true,
        frequency: { value: 6000 },
        gain: { value: -6 },
      },
      peaking: {
        name: "Peaking",
        type: "peaking",
        enabled: false,
        frequency: { value: 3000 },
        Q: { name: "Bandwidth", value: 1.0 },
        gain: { value: 0 },
      },
    },
  },

  // Placeholder for active filters tracking
  activeFilters: [],
};

export default EQValues;
