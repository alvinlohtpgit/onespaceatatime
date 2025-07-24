import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { databaseService } from '@/services/database'
import { useAuthStore } from './auth'
import { useSettingsStore } from './settings'

export const useTimerStore = defineStore('timer', () => {
  const timerState = ref({
    isActive: false,
    isPaused: false,
    currentPhase: 'work',
    timeRemaining: 1500,
    cyclesCompleted: 0,
    sessionStartTime: null,
    taskId: null
  })
  
  const isLoading = ref(false)
  const error = ref(null)
  let timerInterval = null

  const authStore = useAuthStore()
  const settingsStore = useSettingsStore()

  const isRunning = computed(() => timerState.value.isActive && !timerState.value.isPaused)
  const minutes = computed(() => Math.floor(timerState.value.timeRemaining / 60))
  const seconds = computed(() => timerState.value.timeRemaining % 60)
  const formattedTime = computed(() => {
    const m = minutes.value.toString().padStart(2, '0')
    const s = seconds.value.toString().padStart(2, '0')
    return `${m}:${s}`
  })

  async function loadTimerState() {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      const state = await databaseService.getTimerState(authStore.username)
      timerState.value = {
        isActive: state.isActive,
        isPaused: state.isPaused,
        currentPhase: state.currentPhase,
        timeRemaining: state.timeRemaining,
        cyclesCompleted: state.cyclesCompleted,
        sessionStartTime: state.sessionStartTime,
        taskId: state.taskId
      }
    } catch (err) {
      error.value = err.message
      console.error('Error loading timer state:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function saveTimerState() {
    if (!authStore.username) return

    try {
      await databaseService.updateTimerState(authStore.username, timerState.value)
    } catch (err) {
      console.error('Error saving timer state:', err)
    }
  }

  function startTimer(taskId = null) {
    if (timerState.value.isActive && !timerState.value.isPaused) return

    timerState.value.isActive = true
    timerState.value.isPaused = false
    timerState.value.sessionStartTime = new Date().toISOString()
    
    if (taskId) {
      timerState.value.taskId = taskId
    }

    timerInterval = setInterval(() => {
      if (timerState.value.timeRemaining > 0) {
        timerState.value.timeRemaining--
        saveTimerState()
      } else {
        handlePhaseComplete()
      }
    }, 1000)

    saveTimerState()
  }

  function pauseTimer() {
    if (!timerState.value.isActive || timerState.value.isPaused) return

    timerState.value.isPaused = true
    clearInterval(timerInterval)
    timerInterval = null
    saveTimerState()
  }

  function resumeTimer() {
    if (!timerState.value.isActive || !timerState.value.isPaused) return

    startTimer()
  }

  function resetTimer() {
    clearInterval(timerInterval)
    timerInterval = null

    const phase = timerState.value.currentPhase
    const settings = settingsStore.pomodoroSettings
    
    let duration = settings.workDuration * 60
    if (phase === 'shortBreak') {
      duration = settings.shortBreak * 60
    } else if (phase === 'longBreak') {
      duration = settings.longBreak * 60
    }

    timerState.value = {
      isActive: false,
      isPaused: false,
      currentPhase: phase,
      timeRemaining: duration,
      cyclesCompleted: timerState.value.cyclesCompleted,
      sessionStartTime: null,
      taskId: null
    }

    saveTimerState()
  }

  function handlePhaseComplete() {
    clearInterval(timerInterval)
    timerInterval = null

    // Emit notification
    notifyPhaseComplete()

    // Determine next phase
    const settings = settingsStore.pomodoroSettings
    let nextPhase = 'work'
    let nextDuration = settings.workDuration * 60

    if (timerState.value.currentPhase === 'work') {
      timerState.value.cyclesCompleted++
      
      if (timerState.value.cyclesCompleted % settings.cyclesBeforeLongBreak === 0) {
        nextPhase = 'longBreak'
        nextDuration = settings.longBreak * 60
      } else {
        nextPhase = 'shortBreak'
        nextDuration = settings.shortBreak * 60
      }
    }

    timerState.value = {
      isActive: false,
      isPaused: false,
      currentPhase: nextPhase,
      timeRemaining: nextDuration,
      cyclesCompleted: timerState.value.cyclesCompleted,
      sessionStartTime: null,
      taskId: null
    }

    saveTimerState()
  }

  function notifyPhaseComplete() {
    // This will be implemented with PrimeVue Toast or custom notification
    const phase = timerState.value.currentPhase
    let message = 'Time for a break!'
    
    if (phase === 'shortBreak' || phase === 'longBreak') {
      message = 'Break time is over. Ready to focus?'
    }

    // For now, just console log
    console.log(message)
  }

  function setupChangeListener() {
    if (!authStore.username) return
    
    databaseService.watchChanges((change) => {
      if (change.doc.type === 'timer_state') {
        loadTimerState()
      }
    }, authStore.username)
  }

  return {
    timerState,
    isLoading,
    error,
    isRunning,
    minutes,
    seconds,
    formattedTime,
    loadTimerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setupChangeListener
  }
})