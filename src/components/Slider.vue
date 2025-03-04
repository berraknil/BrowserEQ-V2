<script setup lang="ts">
const props = defineProps<{
  sliderLabel: string
  min: number
  max: number
  step: number
  direction: 'horizontal' | 'vertical'
  showValue?: boolean
}>()

const emit = defineEmits(['update:modelValue'])
const sliderValue = defineModel<number>()
</script>

<template>
  <!-- Add a single root div element with v-bind="$attrs" to inherit attributes properly -->
  <div class="slider-container" v-bind="$attrs">
    <span class="slider-label">{{ props.sliderLabel }}</span>

    <v-slider color="#FFEA00" track-color="#6A1B9A" thumb-color="#FFF3E0" :center-affix="true" hide-details
      v-model="sliderValue" :min="props.min" :max="props.max" :step="props.step" class="slider"
      :direction="props.direction" />

    <span v-if="props.showValue !== false" class="slider-value">
      {{ props.direction === 'vertical' ? Math.round(sliderValue || 0) : sliderValue?.toFixed(1) }}
    </span>
  </div>
</template>

<style>
/* Add styling for the new root container */
.slider-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.slider {
  display: flex;
  flex-direction: column;
  padding: 8px 4px;
}

.slider-label,
.slider-value {
  align-self: center;
}

.v-slider.v-input--vertical>.v-input__control {
  min-height: 140px !important;
}

.v-slider-track {
  --v-slider-track-size: 10px !important;
}

.slider-value {
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 4px solid #FFF3E0;
  display: block;
  min-height: 20px;
}

/* 
.v-slider.v-input--horizontal>.v-input__control {
  display: contents !important;
} */
</style>
