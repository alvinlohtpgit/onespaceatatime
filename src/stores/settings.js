import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { databaseService } from '@/services/database'
import { useAuthStore } from './auth'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    pomodoro: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      cyclesBeforeLongBreak: 4,
      enabled: false
    },
    focusMode: {
      enabled: false,
      nudgeAfterMinutes: 30
    },
    theme: {
      colors: {
        primary: '#ffa90a',
        secondary: '#ffd793',
        background: '#ffffff',
        textSecondary: '#999999',
        textPrimary: '#262626'
      }
    }
  })
  
  const isLoading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()

  const pomodoroSettings = computed(() => settings.value.pomodoro)
  const focusModeSettings = computed(() => settings.value.focusMode)
  const themeSettings = computed(() => settings.value.theme)
  const isPomodoroEnabled = computed(() => settings.value.pomodoro.enabled)
  const isFocusModeEnabled = computed(() => settings.value.focusMode.enabled)

  async function loadSettings() {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      const userSettings = await databaseService.getUserSettings(authStore.username)
      settings.value = {
        pomodoro: userSettings.pomodoro,
        focusMode: userSettings.focusMode,
        theme: userSettings.theme
      }
    } catch (err) {
      error.value = err.message
      console.error('Error loading settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function updatePomodoroSettings(updates) {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      const newSettings = {
        ...settings.value,
        pomodoro: {
          ...settings.value.pomodoro,
          ...updates
        }
      }
      await databaseService.updateUserSettings(authStore.username, newSettings)
      settings.value = newSettings
    } catch (err) {
      error.value = err.message
      console.error('Error updating pomodoro settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function updateFocusModeSettings(updates) {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      const newSettings = {
        ...settings.value,
        focusMode: {
          ...settings.value.focusMode,
          ...updates
        }
      }
      await databaseService.updateUserSettings(authStore.username, newSettings)
      settings.value = newSettings
    } catch (err) {
      error.value = err.message
      console.error('Error updating focus mode settings:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function togglePomodoro() {
    await updatePomodoroSettings({ enabled: !settings.value.pomodoro.enabled })
  }

  async function toggleFocusMode() {
    await updateFocusModeSettings({ enabled: !settings.value.focusMode.enabled })
  }

  function setupChangeListener() {
    if (!authStore.username) return
    
    databaseService.watchChanges((change) => {
      if (change.doc.type === 'settings') {
        loadSettings()
      }
    }, authStore.username)
  }

  return {
    settings,
    isLoading,
    error,
    pomodoroSettings,
    focusModeSettings,
    themeSettings,
    isPomodoroEnabled,
    isFocusModeEnabled,
    loadSettings,
    updatePomodoroSettings,
    updateFocusModeSettings,
    togglePomodoro,
    toggleFocusMode,
    setupChangeListener
  }
})