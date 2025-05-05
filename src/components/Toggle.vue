<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  toggleLabel: string
  modelValue: boolean
  inputValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])
const toggleValue = ref(props.modelValue)

watch(toggleValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <div class="toggle">
    <v-checkbox :model-value="modelValue" :input-value="inputValue"
      @update:model-value="(value) => emit('update:modelValue', value)" color="red" hide-details direction="vertical"
      density="compact">
    </v-checkbox>
    <div class="toggle-label">{{ props.toggleLabel }}</div>
  </div>

</template>

<style>
.toggle {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 4px;
}

.toggle-label {
  margin: 0;
  padding: 0;
}

.v-checkbox .v-selection-control {
  min-height: 32px !important;
}
</style>
