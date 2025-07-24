<template>
  <Card class="pomodoro-card">
    <template #header>
      <div class="timer-header">
        <h3>
          <i class="pi pi-clock"></i>
          Pomodoro Timer
        </h3>
        <Button 
          icon="pi pi-cog" 
          class="p-button-text p-button-rounded p-button-sm"
          @click="showSettings = true"
          v-tooltip.bottom="'Timer Settings'"
        />
      </div>
    </template>
    
    <template #content>
      <div class="timer-display">
        <div class="timer-phase">
          <Tag :value="phaseLabel" :severity="phaseSeverity" />
        </div>
        
        <div class="timer-time">
          {{ timerStore.formattedTime }}
        </div>
        
        <div class="timer-controls">
          <Button 
            v-if="!timerStore.isRunning"
            :label="timerStore.timerState.isPaused ? 'Resume' : 'Start'"
            :icon="timerStore.timerState.isPaused ? 'pi pi-play' : 'pi pi-play'"
            class="p-button-success"
            @click="handleStart"
          />
          <Button 
            v-else
            label="Pause"
            icon="pi pi-pause"
            class="p-button-warning"
            @click="timerStore.pauseTimer"
          />
          <Button 
            label="Reset"
            icon="pi pi-refresh"
            class="p-button-secondary"
            @click="timerStore.resetTimer"
            :disabled="!timerStore.timerState.isActive"
          />
        </div>
        
        <div class="timer-cycles">
          <span class="cycles-label">Cycles completed:</span>
          <div class="cycles-dots">
            <span 
              v-for="i in 4" 
              :key="i"
              class="cycle-dot"
              :class="{ 'completed': i <= (timerStore.timerState.cyclesCompleted % 4) }"
            ></span>
          </div>
        </div>
      </div>
    </template>
  </Card>
  
  <TimerSettingsDialog 
    v-model:visible="showSettings"
    @settings-updated="loadTimerState"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTimerStore } from '@/stores/timer'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import TimerSettingsDialog from './TimerSettingsDialog.vue'

const props = defineProps({
  currentTaskId: {
    type: String,
    default: null
  }
})

const timerStore = useTimerStore()
const settingsStore = useSettingsStore()
const toast = useToast()

const showSettings = ref(false)

const phaseLabel = computed(() => {
  const phase = timerStore.timerState.currentPhase
  if (phase === 'work') return 'Focus Time'
  if (phase === 'shortBreak') return 'Short Break'
  return 'Long Break'
})

const phaseSeverity = computed(() => {
  const phase = timerStore.timerState.currentPhase
  if (phase === 'work') return 'danger'
  if (phase === 'shortBreak') return 'warning'
  return 'success'
})

const handleStart = () => {
  if (timerStore.timerState.isPaused) {
    timerStore.resumeTimer()
  } else {
    timerStore.startTimer(props.currentTaskId)
  }
}

const loadTimerState = async () => {
  await timerStore.loadTimerState()
}

// Watch for phase completion
watch(() => timerStore.timerState.currentPhase, (newPhase, oldPhase) => {
  if (newPhase !== oldPhase && timerStore.timerState.isActive) {
    // Phase changed, show notification
    const message = newPhase === 'work' 
      ? 'Break time is over. Ready to focus?' 
      : 'Time for a break!'
    
    toast.add({
      severity: 'info',
      summary: phaseLabel.value,
      detail: message,
      life: 5000,
      closable: true
    })
    
    // Play notification sound
    playNotificationSound()
  }
})

const playNotificationSound = () => {
  // Create a simple beep sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

onMounted(async () => {
  await loadTimerState()
  timerStore.setupChangeListener()
})

onUnmounted(() => {
  // Timer cleanup is handled in the store
})
</script>

<style scoped>
.pomodoro-card {
  background: linear-gradient(135deg, #fff5e6 0%, #ffffff 100%);
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}

.timer-header h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timer-display {
  text-align: center;
  padding: 1rem;
}

.timer-phase {
  margin-bottom: 1.5rem;
}

.timer-time {
  font-size: 4rem;
  font-weight: 300;
  color: var(--text-primary);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.timer-cycles {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.cycles-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.cycles-dots {
  display: flex;
  gap: 0.5rem;
}

.cycle-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e5e5e5;
  transition: all 0.3s ease;
}

.cycle-dot.completed {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .timer-time {
    font-size: 3rem;
  }
  
  .timer-controls {
    flex-wrap: wrap;
  }
}
</style>