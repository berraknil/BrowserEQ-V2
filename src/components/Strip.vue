<script setup lang="ts">
import Slider from './Slider.vue'
import Toggle from './Toggle.vue'

const props = defineProps<{
    mainSliderValue: number
    secondarySliderValue: number
    enabled: boolean
    inputEnabled: boolean  // Add this new prop
    mainSliderLabel: string
    secondarySliderLabel: string
    mainMin: number
    mainMax: number
    mainStep: number
    secondaryMin: number
    secondaryMax: number
    secondaryStep: number
    filterType: string
}>()

const emit = defineEmits(['update:mainSliderValue', 'update:secondarySliderValue', 'update:enabled', 'updateFilter', 'toggleFilter'])
</script>

<template>
    <span class="strip">
        <!-- Vertical frequency slider -->
        <Slider :model-value="mainSliderValue" @update:model-value="(value) => {
            emit('update:mainSliderValue', value);
            // Always pass both values to ensure filter state is complete
            emit('updateFilter', {
                type: filterType,
                value,
                secondaryValue: secondarySliderValue
            });
        }" :sliderLabel="mainSliderLabel" :min="mainMin" :max="mainMax" :step="mainStep" direction="vertical"
            :showValue="true" />

        <!-- Horizontal Q/Gain slider -->
        <Slider :model-value="secondarySliderValue" @update:model-value="(value) => {
            emit('update:secondarySliderValue', value);
            // Always pass both values to ensure filter state is complete
            emit('updateFilter', {
                type: filterType,
                value: mainSliderValue,
                secondaryValue: value
            });
        }" :sliderLabel="secondarySliderLabel" :min="secondaryMin" :max="secondaryMax" :step="secondaryStep"
            direction="horizontal" :showValue="true" />
        <Toggle :model-value="enabled" :input-value="inputEnabled" @update:model-value="(value) => {
            emit('update:enabled', value);
            emit('toggleFilter', { filterType, value });
        }" toggleLabel="Enabled" />
    </span>
</template>

<style scoped>
.strip {
    margin: 4px;
    padding: 4px 8px;
    outline: 1px solid transparent;
    box-shadow: 0px 1px 3px 1px #000000;
    display: flex;
    flex-direction: column;
    background-color: #E2B241;
    color: #000;
}
</style>
