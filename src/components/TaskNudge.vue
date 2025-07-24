<template>
  <transition name="nudge">
    <Card v-if="shouldShowNudge" class="nudge-card">
      <template #content>
        <div class="nudge-content">
          <i class="pi pi-info-circle nudge-icon"></i>
          <div class="nudge-message">
            <h4>{{ nudgeTitle }}</h4>
            <p>{{ nudgeMessage }}</p>
          </div>
          <div class="nudge-actions">
            <Button 
              label="Take a Break" 
              icon="pi pi-pause" 
              class="p-button-warning p-button-sm"
              @click="handleTakeBreak"
            />
            <Button 
              label="Split Task" 
              icon="pi pi-share-alt" 
              class="p-button-info p-button-sm"
              @click="handleSplitTask"
            />
            <Button 
              label="Dismiss" 
              class="p-button-text p-button-sm"
              @click="dismissNudge"
            />
          </div>
        </div>
      </template>
    </Card>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'

const props = defineProps({
  currentTask: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['split-task'])

const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()
const toast = useToast()

const shouldShowNudge = ref(false)
const taskStartTime = ref(null)
const nudgeTimer = ref(null)
const dismissedTasks = ref(new Set())

const nudgeAfterMinutes = computed(() => 
  settingsStore.focusModeSettings.nudgeAfterMinutes || 30
)

const nudgeTitle = computed(() => {
  if (!props.currentTask) return ''
  const duration = getTaskDuration()
  if (duration > 60) {
    return `You've been on this task for ${Math.floor(duration / 60)} hours`
  }
  return `You've been on this task for ${duration} minutes`
})

const nudgeMessage = computed(() => {
  const suggestions = [
    'Consider taking a short break to refresh your focus.',
    'Would you like to split this into smaller subtasks?',
    'Sometimes stepping away helps solve problems faster.',
    'A quick walk might give you a fresh perspective.'
  ]
  return suggestions[Math.floor(Math.random() * suggestions.length)]
})

const getTaskDuration = () => {
  if (!taskStartTime.value) return 0
  const now = Date.now()
  const duration = Math.floor((now - taskStartTime.value) / 60000)
  return duration
}

const checkNudgeTime = () => {
  if (!props.currentTask || dismissedTasks.value.has(props.currentTask._id)) {
    shouldShowNudge.value = false
    return
  }
  
  const duration = getTaskDuration()
  if (duration >= nudgeAfterMinutes.value) {
    shouldShowNudge.value = true
  }
}

const handleTakeBreak = () => {
  // Start a break timer if pomodoro is enabled
  if (settingsStore.isPomodoroEnabled) {
    // Timer will handle the break
    toast.add({
      severity: 'info',
      summary: 'Break Time',
      detail: 'Take a short break and come back refreshed!',
      life: 3000
    })
  }
  dismissNudge()
}

const handleSplitTask = () => {
  emit('split-task', props.currentTask)
  dismissNudge()
}

const dismissNudge = () => {
  if (props.currentTask) {
    dismissedTasks.value.add(props.currentTask._id)
  }
  shouldShowNudge.value = false
}

const resetNudgeTimer = () => {
  if (nudgeTimer.value) {
    clearInterval(nudgeTimer.value)
  }
  
  taskStartTime.value = Date.now()
  shouldShowNudge.value = false
  
  // Check every minute
  nudgeTimer.value = setInterval(checkNudgeTime, 60000)
}

// Watch for task changes
watch(() => props.currentTask?._id, (newTaskId, oldTaskId) => {
  if (newTaskId !== oldTaskId) {
    if (oldTaskId) {
      dismissedTasks.value.delete(oldTaskId)
    }
    resetNudgeTimer()
  }
})

onMounted(() => {
  if (props.currentTask) {
    resetNudgeTimer()
  }
})

onUnmounted(() => {
  if (nudgeTimer.value) {
    clearInterval(nudgeTimer.value)
  }
})
</script>

<style scoped>
.nudge-card {
  background: linear-gradient(135deg, #fff9e6 0%, #fffef5 100%);
  border: 1px solid var(--primary-color);
  margin-bottom: 1rem;
  animation: gentle-pulse 2s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
}

.nudge-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.nudge-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.nudge-message {
  flex: 1;
}

.nudge-message h4 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.nudge-message p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.nudge-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

/* Transition */
.nudge-enter-active,
.nudge-leave-active {
  transition: all 0.5s ease;
}

.nudge-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.nudge-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .nudge-content {
    flex-direction: column;
  }
  
  .nudge-actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>