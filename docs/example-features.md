# BrowserEQ Example Features - Extended Explanations

This document provides more detailed information about the features showcased in the Examples tab of the BrowserEQ documentation.

## Voice Clarity and Noise Reduction

### How it Works

BrowserEQ employs a combination of filters to enhance voice clarity:

1. **High-Pass Filter (HPF)**: Set to around 100-150Hz to remove low-frequency rumble, like computer fans, air conditioners, or traffic noise.

2. **Low-Pass Filter (LPF)**: Set to around 7-8kHz to reduce high-frequency hiss and sibilance while preserving speech intelligibility.

3. **Peaking Filters**: Two peaking filters boost the key speech frequencies:
   - A gentle boost around 1kHz-3kHz enhances consonants for better clarity
   - A slight boost around 200-500Hz preserves voice warmth and fullness

### Optimal Settings

For best voice clarity in video conferences:

```
Voice Clarity Preset:
- HPF: 130Hz, Q=0.7
- LPF: 7500Hz, Q=0.7
- Peak1: 2500Hz, +4dB, Q=1.0
- Peak2: 400Hz, +2dB, Q=1.2
- Output Gain: 0dB to +3dB (as needed)
```

### Common Issues Solved

- Makes hard-to-hear speakers more intelligible
- Reduces fatigue during long video meetings
- Helps compensate for poor microphones used by other participants
- Improves comprehension in non-native language conversations

## Stereo/Mono Conversion

### How it Works

BrowserEQ's Stereo/Mono switch functions by summing the left and right audio channels and sending the combined signal to both ears. This creates a balanced listening experience regardless of which ear you're using or your hearing capabilities.

### Key Benefits

1. **Accessibility**: Critical for users with unilateral hearing loss who miss audio panned to one side

2. **Convenience**: Essential when sharing earbuds with someone or using a single earbud

3. **Content Optimization**: Valuable for older music recordings with extreme stereo separation that can sound unbalanced

4. **Listening Comfort**: Reduces listening fatigue when audio is improperly balanced between channels

### When to Use

Mono mode is best for:
- Phone calls, voice conferences, and spoken content
- When using a single earbud
- When sharing audio with others nearby
- For users with hearing loss in one ear

Stereo mode is best for:
- Music appreciation (when full stereo separation is desired)
- Gaming and movies (for positional audio cues)
- Content specifically designed with artistic stereo effects

## Music Enhancement and Timbral Control

### How It Works

BrowserEQ provides precise control over the entire frequency spectrum of music using:

1. **Multi-band EQ**: Multiple frequency bands can be adjusted simultaneously for complete tonal control:
   - Bass (20-250Hz): Controls the foundation and impact of music
   - Low-mids (250-500Hz): Affects the warmth and fullness of instruments
   - Mids (500-2000Hz): Controls presence and articulation of vocals and instruments
   - Upper-mids (2-4kHz): Affects detail and definition
   - Highs (4-20kHz): Controls air, sparkle, and cymbal detail

2. **Filter Types**: Different filter shapes allow for precise sound sculpting:
   - Low Shelf: Gentle boost or cut of bass frequencies
   - High Shelf: Smooth enhancement or reduction of treble
   - Peaking Filters: Targeted adjustment of specific frequency ranges
   - Resonance (Q) Control: Adjusts the width of affected frequency bands

### Common Music Enhancement Techniques

#### Genre-Specific Adjustments

1. **Rock/Metal Enhancement**:
```
- Low Shelf: 100Hz, +3dB, Q=0.7
- Peak: 3kHz, +2dB, Q=1.0
- High Shelf: 8kHz, +2dB, Q=0.7
```

2. **Electronic Music Bass Enhancement**:
```
- Low Shelf: 80Hz, +4dB, Q=0.7
- Peak: 60Hz, +3dB, Q=2.0 (for sub-bass)
- Peak: 2.5kHz, -2dB, Q=1.0 (reduce harshness)
```

3. **Classical Music Clarity**:
```
- Low Shelf: 180Hz, -1dB, Q=0.7
- Peak: 1kHz, +1dB, Q=1.5
- High Shelf: 6kHz, +2dB, Q=0.7
```

#### Speaker/Headphone Compensation

BrowserEQ can compensate for deficiencies in audio equipment:

- **Enhance Lacking Bass**: Low shelf boost at 60-100Hz
- **Reduce Muddy Sound**: Cut around 250-400Hz
- **Add Missing Detail**: Gentle boost at 3-8kHz
- **Control Harshness**: Reduction at 2-4kHz or 6-8kHz depending on the equipment

### Advanced Applications

- **Real-time A/B Testing**: Compare different EQ settings during playback
- **Finding Hidden Details**: Isolate frequency bands to discover buried musical elements
- **Reducing Listening Fatigue**: Create custom curves that are easier on the ears for long sessions
- **Creating "New" Mixes**: Dramatically reshape the balance of existing recordings

### Technical Implementation

Music enhancement uses a combination of filter types from the Web Audio API:
- `BiquadFilterNode` with different filter types for each frequency band
- Careful management of filter order to minimize phase issues
- Real-time parameter adjustments that maintain audio quality

## Technical Implementation

Both features leverage the Web Audio API's native capabilities:
- Voice clarity uses multiple `BiquadFilterNode` instances in series
- Stereo/Mono conversion uses the `ChannelMergerNode` and `ChannelSplitterNode`
