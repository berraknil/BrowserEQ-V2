import { ref } from "vue";
import { audioCtx, gainNode } from "./audioProcessing";

export const isRecording = ref(false);
export const downloadUrl = ref<string | null>(null);
export const recordingProcessor = ref<ScriptProcessorNode | null>(null);
export const recordingSource = ref<MediaStreamAudioSourceNode | null>(null);
export const recordingDestination = ref<MediaStreamAudioDestinationNode | null>(
  null
);
export const audioData = ref<Float32Array[]>([
  new Float32Array(0),
  new Float32Array(0),
]);

export function startRecording(currentStream: MediaStream | null) {
  if (!currentStream || !gainNode || !audioCtx) return false;

  downloadUrl.value = null;
  audioData.value = [new Float32Array(0), new Float32Array(0)];

  // Create a new destination for recording
  const destination = audioCtx.createMediaStreamDestination();

  // Connect gainNode to both the regular destination and recording destination
  gainNode.connect(destination);

  recordingProcessor.value = audioCtx.createScriptProcessor(16384, 2, 2);
  recordingSource.value = audioCtx.createMediaStreamSource(destination.stream);

  recordingProcessor.value.onaudioprocess = (e) => {
    if (isRecording.value) {
      const inputL = e.inputBuffer.getChannelData(0);
      const inputR = e.inputBuffer.getChannelData(1);

      // Concatenate new chunks
      const newL = new Float32Array(audioData.value[0].length + inputL.length);
      const newR = new Float32Array(audioData.value[1].length + inputR.length);

      newL.set(audioData.value[0]);
      newL.set(inputL, audioData.value[0].length);
      newR.set(audioData.value[1]);
      newR.set(inputR, audioData.value[1].length);

      audioData.value[0] = newL;
      audioData.value[1] = newR;
    }
  };

  recordingSource.value.connect(recordingProcessor.value);
  recordingProcessor.value.connect(audioCtx.destination);
  isRecording.value = true;

  // Store destination for cleanup
  recordingDestination.value = destination;
  return true;
}

export function stopRecording() {
  if (!isRecording.value || !audioCtx) return;

  isRecording.value = false;

  // Clean up recording nodes
  if (recordingProcessor.value) {
    recordingProcessor.value.disconnect();
    recordingSource.value?.disconnect();
    // Disconnect gainNode from recording destination
    gainNode?.disconnect(recordingDestination.value);
    recordingDestination.value = null;
  }

  // Create WAV file from recorded data
  const wavBlob = encodeWAV(audioData.value, audioCtx.sampleRate);
  downloadUrl.value = URL.createObjectURL(wavBlob);

  // Reset recording nodes
  recordingProcessor.value = null;
  recordingSource.value = null;
}

export function downloadRecording() {
  if (!downloadUrl.value) return false;

  const a = document.createElement("a");
  a.href = downloadUrl.value;
  a.download = `recording-${new Date().toISOString()}.wav`;
  a.click();
  return true;
}

export function cleanup() {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value);
  }
  if (isRecording.value) {
    stopRecording();
  }
  recordingDestination.value = null;
}

// WAV encoding functions
function encodeWAV(audioData: Float32Array[], sampleRate: number): Blob {
  const numChannels = audioData.length;
  const length = audioData[0].length * numChannels;
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);

  // Write WAV header
  writeUTFBytes(view, 0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  writeUTFBytes(view, 8, "WAVE");
  writeUTFBytes(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeUTFBytes(view, 36, "data");
  view.setUint32(40, length * 2, true);

  // Write audio data
  const offset = 44;
  for (let i = 0; i < audioData[0].length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioData[channel][i]));
      view.setInt16(
        offset + (i * numChannels + channel) * 2,
        sample * 0x7fff,
        true
      );
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeUTFBytes(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
