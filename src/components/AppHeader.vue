<template>
  <header class="app-header">
    <div class="header-content">
      <div class="brand">
        <i class="pi pi-check-square brand-icon"></i>
        <h1 class="brand-name">One Space At a Time</h1>
      </div>
      <div class="header-actions">
        <Button 
          icon="pi pi-cog" 
          class="p-button-text p-button-rounded"
          @click="showSettings = true"
          v-tooltip.bottom="'Settings'"
        />
        <UserProfile />
      </div>
    </div>
  </header>

  <Dialog 
    v-model:visible="showSettings" 
    header="Settings" 
    :style="{ width: '450px' }"
    :modal="true"
  >
    <div class="settings-content">
      <div class="settings-section">
        <h4>Pomodoro Timer</h4>
        <div class="setting-item">
          <Checkbox 
            v-model="pomodoroEnabled" 
            inputId="pomodoro-toggle"
            binary
            @change="togglePomodoro"
          />
          <label for="pomodoro-toggle">Enable Pomodoro Timer</label>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>Focus Mode</h4>
        <div class="setting-item">
          <Checkbox 
            v-model="focusModeEnabled" 
            inputId="focus-toggle"
            binary
            @change="toggleFocusMode"
          />
          <label for="focus-toggle">Enable Focus Lock Mode</label>
        </div>
        <p class="setting-description">
          When enabled, hides all tasks except the current one to minimize distractions.
        </p>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import UserProfile from './UserProfile.vue'

const settingsStore = useSettingsStore()

const showSettings = ref(false)

const pomodoroEnabled = computed({
  get: () => settingsStore.isPomodoroEnabled,
  set: () => {} // Handled by togglePomodoro
})

const focusModeEnabled = computed({
  get: () => settingsStore.isFocusModeEnabled,
  set: () => {} // Handled by toggleFocusMode
})

const togglePomodoro = async () => {
  await settingsStore.togglePomodoro()
}

const toggleFocusMode = async () => {
  await settingsStore.toggleFocusMode()
}

onMounted(() => {
  settingsStore.setupChangeListener()
})
</script>

<style scoped>
.app-header {
  background-color: white;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 70px;
  max-width: 1400px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.brand-name {
  font-size: 1.25rem;
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-content {
  padding: 1rem 0;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.setting-item label {
  cursor: pointer;
  color: var(--text-primary);
}

.setting-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-left: 2rem;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .brand-name {
    display: none;
  }
}
</style>