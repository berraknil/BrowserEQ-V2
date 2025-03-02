<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startMinimized } from '~/logic/storage'
import Logo from '~/components/Logo.vue'

const minimizedStart = ref(false)

onMounted(async () => {
  minimizedStart.value = await startMinimized.get()
})

async function saveSettings() {
  await startMinimized.set(minimizedStart.value)
}
</script>

<template>
  <div class="page-container">
    <main class="p-4 content-wrapper">
      <header class="header">
        <h1 class="text-2xl">OPTIONS</h1>
        <Logo />
      </header>

      <div class="settings-group mb-4">
        <v-switch v-model="minimizedStart" label="Start in compact mode" color="#E2B241" hide-details
          @change="saveSettings">
        </v-switch>
        <div class="text-sm text-gray-600 mt-1">
          When enabled, BrowserEQ will open in compact mode by default
        </div>
      </div>
    </main>
  </div>
</template>

<style>
body {
  background: #FFF7E0;
  margin: 0;
  padding: 0;
}

.page-container {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
}

.content-wrapper {
  width: 70%;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logo {
  background-color: #E2B241;
  padding: 0.5rem;
  border: 2px solid #E2B241 !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.logo img {
  max-height: 3rem;
}

.settings-group {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #E2B241;
}
</style>
