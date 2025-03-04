<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, computed } from 'vue'
import Slider from '~/components/Slider.vue'
import Toggle from '~/components/Toggle.vue'
import Strip from '~/components/Strip.vue'
import EQValues from '~/logic/EQValues'
import { startMinimized } from '~/logic/storage'
import * as AudioProcessor from '~/logic/audioProcessing'
import * as RecordingService from '~/logic/recordingService'
import * as MediaControlService from '~/logic/mediaControlService'

// UI State
const isInitialized = ref(false);
const isMinimized = ref(false);
const selectedPreset = ref('Neutral');
const isMono = ref(false);
const isMuted = ref(false);
const isPlaying = ref(true);
let currentStream: MediaStream | null = null;

// Preset handling
const presetNames = Object.keys(EQValues).filter(name => name !== 'activeFilters');
let preset = EQValues[selectedPreset.value as keyof typeof EQValues];

// Format preset names for display
const formattedPresetNames = computed(() => {
  return presetNames.map(name => ({
    title: name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()),
    value: name
  }));
});

// EQ Values
const mainVolumeValue = ref(preset.mainOut.gain)
const currentGainValue = ref(mainVolumeValue.value);

// Filter values
const lowPassValue = ref(preset.filters.lowpass.frequency.value)
const lowPassEnabled = ref(preset.filters.lowpass.enabled)
const highPassValue = ref(preset.filters.highpass.frequency.value)
const highpassEnabled = ref(preset.filters.highpass.enabled)
const lowShelfValue = ref(preset.filters.lowshelf.frequency.value)
const lowShelfEnabled = ref(preset.filters.lowshelf.enabled)
const highShelfValue = ref(preset.filters.highshelf.frequency.value)
const highShelfEnabled = ref(preset.filters.highshelf.enabled)
const bandPassValue = ref(preset.filters.bandpass.frequency.value)
const bandPassEnabled = ref(preset.filters.bandpass.enabled)
const peakingValue = ref(preset.filters.peaking.frequency.value)
const peakingEnabled = ref(preset.filters.peaking.enabled)

// Filter Q and gain values
const highPassQValue = ref(preset.filters.highpass.Q?.value || 0);
const bandPassQValue = ref(preset.filters.bandpass.Q?.value || 0);
const lowPassQValue = ref(preset.filters.lowpass.Q?.value || 0);
const lowShelfGainValue = ref(preset.filters.lowshelf.gain?.value || 0);
const highShelfGainValue = ref(preset.filters.highshelf.gain?.value || 0);
const peakingGainValue = ref(preset.filters.peaking.gain?.value || 0);

function toggleMinimize() {
  isMinimized.value = !isMinimized.value;
}

// Handle volume changes
watch(mainVolumeValue, (newValue) => {
  currentGainValue.value = newValue;

  // Update preset's stored gain value
  if (preset && preset.mainOut) {
    preset.mainOut.gain = newValue;
  }

  // This will store the new value but only apply it if not muted
  AudioProcessor.setVolume(newValue);
});

// Handle preset changes with error handling
watch(selectedPreset, async (newPreset) => {
  try {
    preset = EQValues[newPreset as keyof typeof EQValues];
    if (!preset) {
      console.error('Invalid preset:', newPreset);
      return;
    }

    // First update all enabled states
    Object.entries(preset.filters).forEach(([filterType, filterData]: [string, any]) => {
      switch (filterType) {
        case 'highpass': highpassEnabled.value = Boolean(filterData?.enabled); break;
        case 'bandpass': bandPassEnabled.value = Boolean(filterData?.enabled); break;
        case 'lowpass': lowPassEnabled.value = Boolean(filterData?.enabled); break;
        case 'lowshelf': lowShelfEnabled.value = Boolean(filterData?.enabled); break;
        case 'highshelf': highShelfEnabled.value = Boolean(filterData?.enabled); break;
        case 'peaking': peakingEnabled.value = Boolean(filterData?.enabled); break;
      }
    });

    // Reset filters with error handling
    await AudioProcessor.resetFilters();

    // Update main volume safely
    if (preset.mainOut) {
      mainVolumeValue.value = preset.mainOut.gain || 1.0;
    }

    // Update filter values with safety checks
    Object.entries(preset.filters).forEach(([filterType, filterData]: [string, any]) => {
      if (filterData) {
        updateFilterValues(filterType, filterData);

        // Connect enabled filters with safety check
        if (filterData.enabled) {
          AudioProcessor.connectToFilter(filterType, true, preset);
        }
      }
    });

    // Update mute state safely
    isMuted.value = Boolean(preset.mainOut?.muted);
  } catch (error) {
    console.error('Error updating preset:', error);
    // Optionally reset to a safe state or show user feedback
  }
});

// Helper function to update filter values
function updateFilterValues(filterType: string, filterData: any) {
  try {
    if (!filterData) return;

    switch (filterType) {
      case 'highpass':
        highPassValue.value = filterData.frequency?.value ?? highPassValue.value;
        highPassQValue.value = filterData.Q?.value ?? highPassQValue.value;
        break;
      case 'bandpass':
        bandPassValue.value = filterData.frequency?.value ?? bandPassValue.value;
        bandPassQValue.value = filterData.Q?.value ?? bandPassQValue.value;
        break;
      case 'lowpass':
        lowPassValue.value = filterData.frequency?.value ?? lowPassValue.value;
        lowPassQValue.value = filterData.Q?.value ?? lowPassQValue.value;
        break;
      case 'lowshelf':
        lowShelfValue.value = filterData.frequency?.value ?? lowShelfValue.value;
        lowShelfGainValue.value = filterData.gain?.value ?? lowShelfGainValue.value;
        break;
      case 'highshelf':
        highShelfValue.value = filterData.frequency?.value ?? highShelfValue.value;
        highShelfGainValue.value = filterData.gain?.value ?? highShelfGainValue.value;
        break;
      case 'peaking':
        peakingValue.value = filterData.frequency?.value ?? peakingValue.value;
        peakingGainValue.value = filterData.gain?.value ?? peakingGainValue.value;
        break;
    }

    // Only update filter if we have valid data
    if (filterData.frequency?.value !== undefined) {
      AudioProcessor.updateFilterValue(filterType as BiquadFilterType, filterData.frequency.value);
    }
  } catch (error) {
    console.error(`Error updating filter values for ${filterType}:`, error);
  }
}

// Mute/unmute function
function voiceMute(data: { value: boolean; currentVol: number }) {
  isMuted.value = data.value;

  // Update preset mute state
  if (preset && preset.mainOut) {
    preset.mainOut.muted = data.value;
  }

  // This will handle proper volume management during mute/unmute
  AudioProcessor.toggleMute(data.value, mainVolumeValue.value);
}

// Mono/stereo toggle
function handleMonoToggle() {
  isMono.value = AudioProcessor.handleMonoToggle(isMono.value, currentGainValue.value);
}

// Toggle play/pause
async function togglePlayback() {
  if (!currentStream) return;
  isPlaying.value = await MediaControlService.togglePlayback(currentStream);
}

async function rewindStream() {
  if (!isPlaying.value) return;
  await MediaControlService.rewindStream();
}

async function forwardStream() {
  if (!isPlaying.value) return;
  await MediaControlService.forwardStream();
}

async function restartStream() {
  if (!isPlaying.value) return;
  await MediaControlService.restartStream();
}

// Initialize audio
async function initializeAudio() {
  currentStream = await AudioProcessor.startCapture(preset);
  console.log('Audio initialized');
}

// Template reference fixes
function startRecording() {
  if (!currentStream) return;
  RecordingService.startRecording(currentStream);
}

function stopRecording() {
  RecordingService.stopRecording();
}

function downloadRecording() {
  RecordingService.downloadRecording();
}

// Connect filter method fix
function connectToFilter({ filterType, value }: { filterType: BiquadFilterType, value: boolean }) {
  AudioProcessor.connectToFilter(filterType, value, preset);
}

// Update filter value method fix
function updateFilterValue(type: BiquadFilterType, value: number, secondaryValue?: number) {
  AudioProcessor.updateFilterValue(type, value, secondaryValue);

  // Update local state to keep UI in sync
  if (type === 'bandpass' && secondaryValue !== undefined) {
    bandPassQValue.value = secondaryValue;
  }
}

onMounted(async () => {
  try {
    // Load minimized state first
    const minimizedState = await startMinimized.get();
    isMinimized.value = minimizedState;

    // Initialize audio processing
    await initializeAudio();

    // Sync mute state with audio processor
    isMuted.value = AudioProcessor.isMuted.value;

    isInitialized.value = true;
  } catch (e) {
    console.error('Error during initialization:', e);
    isInitialized.value = true;  // Still show the UI even if initialization fails
  }
});

onBeforeUnmount(() => {
  // Clean up recording resources
  RecordingService.cleanup();
});
</script>

<template>
  <!-- Add v-if to prevent flashing during load -->
  <main v-if="isInitialized" class="text-center text-gray-700" :class="{ 'minimized': isMinimized }">
    <div class="compact-layout" v-if="isMinimized">
      <v-btn variant="text" size="x-small" class="minimize-btn" @click="toggleMinimize">
        <v-icon size="small">mdi-arrow-expand</v-icon>
      </v-btn>

      <div class="compact-volume">
        <div class="volume-control">
          <v-icon size="small" class="volume-icon" :color="isMuted ? '#9E9E9E' : '#212121'">
            {{ isMuted ? 'mdi-volume-off' : 'mdi-volume-high' }}
          </v-icon>
          <Slider v-model="mainVolumeValue" sliderLabel="" :min="0" :max="3" :step="0.1" direction="horizontal"
            class="compact-slider" :showValue="false" />
          <span class="volume-value">{{ mainVolumeValue.toFixed(1) }}</span>
        </div>
        <Toggle v-model="isMuted" :input-value="isMuted" toggleLabel="" class="compact-mute"
          @update:model-value="(value) => voiceMute({ value, currentVol: mainVolumeValue })" />
      </div>

      <!-- Single row compact controls -->
      <div class="compact-controls">
        <v-btn icon variant="text" size="x-small" :color="isPlaying ? '#424242' : '#9E9E9E'" :disabled="!isPlaying"
          @click="restartStream" class="transport-btn">
          <v-icon size="x-small">mdi-restart</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="x-small" :color="isPlaying ? '#424242' : '#9E9E9E'" :disabled="!isPlaying"
          @click="rewindStream" class="transport-btn">
          <v-icon size="x-small">mdi-rewind-15</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="x-small" :color="isPlaying ? '#424242' : '#388E3C'" @click="togglePlayback"
          class="transport-btn">
          <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="x-small" :color="isPlaying ? '#424242' : '#9E9E9E'" :disabled="!isPlaying"
          @click="forwardStream" class="transport-btn">
          <v-icon size="x-small">mdi-fast-forward-15</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="x-small" :color="RecordingService.isRecording.value ? '#D32F2F' : '#424242'"
          @click="RecordingService.isRecording.value ? stopRecording() : startRecording()" class="transport-btn">
          <v-icon size="x-small">{{ RecordingService.isRecording.value ? 'mdi-stop' : 'mdi-record' }}</v-icon>
        </v-btn>

        <v-btn icon variant="text" size="x-small" :color="RecordingService.downloadUrl.value ? '#424242' : '#9E9E9E'"
          :disabled="!RecordingService.downloadUrl.value" @click="downloadRecording" class="transport-btn">
          <v-icon size="x-small">mdi-download</v-icon>
        </v-btn>

        <v-btn variant="text" size="x-small" :color="isMono ? '#424242' : '#388E3C'" @click="handleMonoToggle"
          class="mono-btn transport-btn">
          {{ isMono ? 'M' : 'S' }}
        </v-btn>
      </div>
    </div>

    <template v-else>
      <header class="header" :class="{ 'minimized': isMinimized }">
        <v-btn variant="outlined" class="minimize-btn" @click="toggleMinimize">
          {{ isMinimized ? 'Maximize' : 'Minimize' }}
        </v-btn>
        <Logo :class="{ 'minimized': isMinimized }" />
      </header>
      <div class="transport" :class="{ 'minimized': isMinimized }">
        <div class="transport-selector">
          <v-select item-color="#E2B241" bg-color="#E2B241" v-model="selectedPreset" class="selector"
            :hide-details="true" density="compact" chips label="Presets" :items="formattedPresetNames"
            item-title="title" item-value="value" variant="outlined"></v-select>
        </div>
        <div class="transport-controls">
          <span>
            <v-btn icon variant="text" size="small" :color="isPlaying ? '#424242' : '#9E9E9E'" :disabled="!isPlaying"
              @click="restartStream">
              <v-icon>mdi-restart</v-icon>
            </v-btn>

            <v-btn icon variant="text" size="small" :color="isPlaying ? '#424242' : '#9E9E9E'" :disabled="!isPlaying"
              @click="rewindStream">
              <v-icon>mdi-rewind-15</v-icon>
            </v-btn>

            <v-btn icon variant="text" size="small" :color="isPlaying ? '#424242' : '#388E3C'" @click="togglePlayback">
              <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>

            <v-btn icon variant="text" size="small" :color="isPlaying ? '#424242' : '#9E9E9E'" :disabled="!isPlaying"
              @click="forwardStream">
              <v-icon>mdi-fast-forward-15</v-icon>
            </v-btn>

            <v-btn icon variant="text" size="small" :color="RecordingService.isRecording.value ? '#D32F2F' : '#424242'"
              @click="RecordingService.isRecording.value ? stopRecording() : startRecording()">
              <v-icon>{{ RecordingService.isRecording.value ? 'mdi-stop' : 'mdi-record' }}</v-icon>
            </v-btn>

            <v-btn icon variant="text" size="small" :color="RecordingService.downloadUrl.value ? '#424242' : '#9E9E9E'"
              :disabled="!RecordingService.downloadUrl.value" @click="downloadRecording">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </span>

          <!-- Replace Toggle with button -->
          <v-btn variant="text" size="small" :color="isMono ? '#424242' : '#388E3C'" @click="handleMonoToggle"
            class="mono-btn" :class="{ 'mono-active': isMono }">
            {{ isMono ? 'MONO' : 'STEREO' }}
          </v-btn>
        </div>
      </div>
      <div class="slider-wrapper">
        <span class="strip volume">
          <Slider v-model="mainVolumeValue" sliderLabel="Main" :min="0" :max="6" :step="0.1" direction="vertical" />
          <span class="slider-value">
            {{ mainVolumeValue?.toFixed(1) }}
          </span>
          <Toggle v-model="isMuted" :input-value="isMuted" toggleLabel="Mute"
            @update:model-value="(value) => voiceMute({ value, currentVol: mainVolumeValue })" />
        </span>

        <!-- Other strips hidden when minimized -->
        <template v-if="!isMinimized">
          <Strip v-model:mainSliderValue="highPassValue" v-model:secondarySliderValue="highPassQValue"
            v-model:enabled="highpassEnabled" :input-enabled="highpassEnabled" mainSliderLabel="High Pass"
            secondarySliderLabel="Resonance" :mainMin="20" :mainMax="22000" :mainStep="1" :secondaryMin="0"
            :secondaryMax="10" :secondaryStep="0.1" filterType="highpass"
            @updateFilter="({ type, value, secondaryValue }) => updateFilterValue(type, value, secondaryValue)"
            @toggleFilter="({ filterType, value }) => connectToFilter({ filterType, value })" />

          <Strip v-model:mainSliderValue="bandPassValue" v-model:secondarySliderValue="bandPassQValue"
            v-model:enabled="bandPassEnabled" :input-enabled="bandPassEnabled" mainSliderLabel="Band Pass"
            secondarySliderLabel="Bandwidth" :mainMin="20" :mainMax="22000" :mainStep="1" :secondaryMin="0"
            :secondaryMax="100" :secondaryStep="1" filterType="bandpass"
            @updateFilter="({ type, value, secondaryValue }) => updateFilterValue(type, value, secondaryValue)"
            @toggleFilter="({ filterType, value }) => connectToFilter({ filterType, value })" />

          <Strip v-model:mainSliderValue="lowPassValue" v-model:secondarySliderValue="lowPassQValue"
            v-model:enabled="lowPassEnabled" :input-enabled="lowPassEnabled" mainSliderLabel="Low Pass"
            secondarySliderLabel="Resonance" :mainMin="20" :mainMax="22000" :mainStep="1" :secondaryMin="0"
            :secondaryMax="6" :secondaryStep="1" filterType="lowpass"
            @updateFilter="({ type, value }) => updateFilterValue(type, value)"
            @toggleFilter="({ filterType, value }) => connectToFilter({ filterType, value })" />

          <Strip v-model:mainSliderValue="lowShelfValue" v-model:secondarySliderValue="lowShelfGainValue"
            v-model:enabled="lowShelfEnabled" :input-enabled="lowShelfEnabled" mainSliderLabel="Low Shelf"
            secondarySliderLabel="Gain" :mainMin="20" :mainMax="22000" :mainStep="1" :secondaryMin="-30"
            :secondaryMax="9" :secondaryStep="1" filterType="lowshelf"
            @updateFilter="({ type, value }) => updateFilterValue(type, value)"
            @toggleFilter="({ filterType, value }) => connectToFilter({ filterType, value })" />

          <Strip v-model:mainSliderValue="highShelfValue" v-model:secondarySliderValue="highShelfGainValue"
            v-model:enabled="highShelfEnabled" :input-enabled="highShelfEnabled" mainSliderLabel="High Shelf"
            secondarySliderLabel="Gain" :mainMin="20" :mainMax="22000" :mainStep="1" :secondaryMin="-30"
            :secondaryMax="9" :secondaryStep="1" filterType="highshelf"
            @updateFilter="({ type, value }) => updateFilterValue(type, value)"
            @toggleFilter="({ filterType, value }) => connectToFilter({ filterType, value })" />

          <Strip v-model:mainSliderValue="peakingValue" v-model:secondarySliderValue="peakingGainValue"
            v-model:enabled="peakingEnabled" :input-enabled="peakingEnabled" mainSliderLabel="Peaking"
            secondarySliderLabel="Gain" :mainMin="20" :mainMax="22000" :mainStep="1" :secondaryMin="-30"
            :secondaryMax="9" :secondaryStep="1" filterType="peaking"
            @updateFilter="({ type, value }) => updateFilterValue(type, value)"
            @toggleFilter="({ filterType, value }) => connectToFilter({ filterType, value })" />
        </template>
      </div>
    </template>
  </main>
</template>

<style>
:root {
  /* Color variables */
  --bg-color: #FFF7E0;
  --primary-color: #E2B241;
  --primary-dark: #C29B37;
  --secondary-color: #424242;
  --secondary-dark: #212121;
  --text-color: #000000;
  --text-light: #FFF3E0;
  --accent-color: #388E3C;
  --accent-dark: #2E7D32;
  --danger-color: #D32F2F;
  --disabled-color: #9E9E9E;
  --shadow-color: rgba(0, 0, 0, 0.2);
  --shadow-small: 0px 1px 2px var(--shadow-color);
  --shadow-medium: 0px 1px 3px 1px #000000;
  --border-color: #212121bd;
}

body {
  background-color: var(--bg-color);
  font-size: 14px;
  font-weight: 600;
}

main {
  margin: 0;
  padding: 10px;
  padding-bottom: 20px;
  transition: max-width 0.3s ease;
}

.header {
  display: flex;
  margin-bottom: .5rem;
}

.header.minimized {
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.minimized>.slider-wrapper>.strip {
  padding: 10px;
}

.logo {
  margin-left: auto;
  background-color: var(--primary-color);
  padding: 0.5rem;
  border: 2px solid var(--primary-color) !important;
  box-shadow: var(--shadow-small);
  border-radius: 4px;
}

.logo img {
  max-height: 3rem;
}

.logo.minimized {
  padding: 8px 0 !important;
  outline: 1px solid var(--border-color);
  border-radius: 1px;
}

.slider-wrapper {
  display: flex;
}

.strip {
  margin: 4px;
  padding: 4px 8px;
  outline: 1px solid transparent;
  box-shadow: var(--shadow-medium);
  display: flex;
  flex-direction: column;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.slider-wrapper span {
  min-width: 100px;
  display: flex;
  flex-direction: column;
}

.transport {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 2px;
  margin: 2px;
}

.transport-selector {
  width: 45% !important;
}

.transport.minimized>.transport-selector {
  width: 100% !important;
}

.transport .toggle {
  margin-right: 1rem;
  font-size: 12px;
}

.transport.minimized>.transport-controls {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  margin: 0 !important;
}

.transport.minimized>.transport-controls span {
  display: flex;
}

.transport.minimized .mono-btn {
  width: 85% !important;
  margin-bottom: 8px !important;
}

.transport-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.transport-controls .v-btn {
  opacity: 1 !important;
}

.transport-controls .v-btn--disabled {
  opacity: 0.6 !important;
}

h4 {
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.selector {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.mono-btn {
  min-width: 80px !important;
  width: 80px !important;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 0.8rem;
  border: 2px solid var(--primary-color) !important;
  box-shadow: var(--shadow-small);
  border-radius: 4px;
  background-color: var(--secondary-color) !important;
  color: var(--text-light) !important;
  transition: all 0.2s ease;
}

.mono-btn:hover {
  border-color: var(--primary-color) !important;
  background-color: var(--secondary-dark) !important;
}

.mono-btn.mono-active {
  background-color: var(--primary-color) !important;
  color: var(--secondary-dark) !important;
  font-weight: 700;
}

.minimized {
  max-width: 200px !important;
  transition: max-width 0.3s ease;
}

.header.minimized>.minimize-btn {
  background-color: var(--primary-color) !important;
  color: var(--secondary-dark) !important;
  margin-top: 8px;
  height: 26px !important;
  width: 100% !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  outline: 1px solid var(--border-color);
  border-radius: 1px;
  order: 2;
  text-transform: initial;
}

.minimize-btn {
  font-size: 0.8rem !important;
  color: var(--secondary-color) !important;
  min-width: 80px !important;
  width: 100px !important;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 0.8rem;
  border: 2px solid var(--primary-color) !important;
  box-shadow: var(--shadow-small);
  border-radius: 4px;
  background-color: var(--secondary-color) !important;
  color: var(--text-light) !important;
  transition: all 0.2s ease;
}

.transport.minimized {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.compact-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 480px;
  height: 50px;
  padding: 0 12px;
  background: var(--bg-color);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.compact-layout .minimize-btn {
  min-width: 24px !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
  margin: 0 !important;
}

.compact-volume {
  display: flex;
  align-items: center;
  flex: 1;
  padding-right: 8px;
  max-width: 250px;
  margin: 0 auto;
}

.volume-control {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 12px;
  width: 100%;
}

.volume-value {
  min-width: 24px;
  text-align: center;
  font-size: 12px;
  color: var(--secondary-color);
}

.compact-volume .compact-slider {
  flex: 1;
  margin: 0;
  width: 100%;
  display: flex;
}

.compact-volume :deep(.v-slider) {
  margin: 0;
  width: 100%;
  min-width: 120px;
}

.compact-volume .compact-mute {
  display: flex;
  align-items: center;
}

.compact-volume :deep(.v-slider .v-slider-track__fill) {
  background-color: var(--primary-color) !important;
}

.compact-volume :deep(.slider-label),
.compact-volume :deep(.slider-value),
.compact-volume :deep(.toggle-label) {
  display: none;
}

.compact-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.transport-btn {
  min-width: 28px !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  margin: 0 2px !important;
}

.compact-controls .mono-btn {
  min-width: 24px !important;
  width: 24px !important;
  font-size: 12px !important;
  padding: 0 !important;
}

main.minimized {
  padding: 0;
  margin: 0;
  max-width: 480px !important;
  max-height: 50px !important;
  overflow: hidden;
}

.compact-controls .v-btn .v-icon {
  --v-icon-size-multiplier: 1.1 !important;
}

.v-slider.v-input--horizontal {
  margin-inline: 0;
  width: 100% !important;
}

.compact-volume :deep(.v-slider__track) {
  width: 100% !important;
}

.compact-volume :deep(.v-slider__track-container) {
  width: 100% !important;
}

.v-slider.v-input--horizontal {
  margin-inline: 0;
}

.compact-volume>.toggle {
  padding-top: 0 !important;
}

.compact-controls>.v-btn--icon .v-icon {
  --v-icon-size-multiplier: 1.5 !important
}

.slider-value {
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 4px solid #FFF3E0;
  display: block;
  min-height: 20px;
}
</style>
