<template>
  <div>
    <TaskNudge 
      :currentTask="currentTask"
      @split-task="handleSplitTask"
    />
    <Card class="doing-now-card">
    <template #header>
      <div class="doing-now-header">
        <h2>
          <i class="pi pi-bolt"></i>
          Doing Now
        </h2>
        <div class="header-actions" v-if="currentTask">
          <Button 
            icon="pi pi-external-link" 
            class="p-button-rounded p-button-text"
            @click="openPopout"
            v-tooltip.bottom="'Pop Out'"
          />
          <Button 
            icon="pi pi-check" 
            class="p-button-success p-button-rounded p-button-text"
            @click="completeCurrentTask"
            v-tooltip.bottom="'Complete Task'"
          />
          <Button 
            icon="pi pi-pencil" 
            class="p-button-rounded p-button-text"
            @click="editCurrentTask"
            v-tooltip.bottom="'Edit Task'"
          />
        </div>
      </div>
    </template>
    
    <template #content>
      <div v-if="!currentTask" class="empty-state">
        <i class="pi pi-inbox empty-icon"></i>
        <p>No task in progress. Add a task to get started!</p>
      </div>
      
      <div v-else class="task-content">
        <h3 class="task-title">{{ currentTask.title }}</h3>
        
        <div class="task-details" v-if="currentTask.nextAction || currentTask.whyItMatters">
          <div class="detail-item" v-if="currentTask.nextAction">
            <label>Next Action:</label>
            <p>{{ currentTask.nextAction }}</p>
          </div>
          
          <div class="detail-item" v-if="currentTask.whyItMatters">
            <label>Why This Matters:</label>
            <p>{{ currentTask.whyItMatters }}</p>
          </div>
        </div>
        
        <div class="task-notes" v-if="currentTask.notes">
          <label>Notes:</label>
          <p>{{ currentTask.notes }}</p>
        </div>
      </div>
    </template>
  </Card>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, onUnmounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useTimerStore } from '@/stores/timer'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TaskNudge from './TaskNudge.vue'

const emit = defineEmits(['edit-task'])

const tasksStore = useTasksStore()
const toast = useToast()
const currentTask = computed(() => tasksStore.currentTask)
const popoutWindow = ref(null)

const completeCurrentTask = async () => {
  if (currentTask.value) {
    await tasksStore.completeTask(currentTask.value._id)
  }
}

const editCurrentTask = () => {
  if (currentTask.value) {
    emit('edit-task', currentTask.value)
  }
}

const handleSplitTask = (task) => {
  // For now, just show a message. In a full implementation,
  // this would open a dialog to split the task into subtasks
  toast.add({
    severity: 'info',
    summary: 'Split Task',
    detail: 'Task splitting feature coming soon!',
    life: 3000
  })
}

const openPopout = () => {
  if (!currentTask.value) return
  
  // Import timer and settings stores
  const timerStore = useTimerStore()
  const settingsStore = useSettingsStore()
  
  // Create a minimal popout window
  const popoutFeatures = 'width=400,height=700,toolbar=no,menubar=no,location=no,status=no,scrollbars=yes'
  const popout = window.open('', 'taskPopout', popoutFeatures)
  
  if (popout) {
    // Write the minimal HTML for the popout
    popout.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${currentTask.value.title} - One Space At a Time</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
            color: #262626;
            height: 100vh;
            overflow-y: auto;
          }
          .task-title {
            font-size: 1.75rem;
            margin-bottom: 1.5rem;
            line-height: 1.3;
            color: #262626;
          }
          .task-section {
            margin-bottom: 1.5rem;
          }
          .task-section label {
            display: block;
            font-weight: 600;
            color: #ffa90a;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .task-section p {
            margin: 0;
            line-height: 1.6;
          }
          .close-button {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ffa90a;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
          }
          .close-button:hover {
            background: #ff9500;
          }
          .timer-section {
            background: rgba(255, 169, 10, 0.1);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 2rem;
            text-align: center;
            display: none;
          }
          .timer-phase {
            font-size: 0.9rem;
            font-weight: 600;
            color: #ffa90a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
          }
          .timer-display {
            font-size: 3rem;
            font-weight: 300;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            letter-spacing: 0.1em;
            color: #262626;
            margin-bottom: 1rem;
          }
          .timer-status {
            font-size: 0.85rem;
            color: #666;
          }
        </style>
      </head>
      <body>
        <button class="close-button" onclick="window.close()">Close</button>
        
        <div class="timer-section" id="timerSection">
          <div class="timer-phase" id="timerPhase">Focus Time</div>
          <div class="timer-display" id="timerDisplay">00:00</div>
          <div class="timer-status" id="timerStatus">Timer not running</div>
        </div>
        
        <h1 class="task-title">${currentTask.value.title}</h1>
        ${currentTask.value.nextAction ? `
          <div class="task-section">
            <label>Next Action:</label>
            <p>${currentTask.value.nextAction}</p>
          </div>
        ` : ''}
        ${currentTask.value.whyItMatters ? `
          <div class="task-section">
            <label>Why This Matters:</label>
            <p>${currentTask.value.whyItMatters}</p>
          </div>
        ` : ''}
        ${currentTask.value.notes ? `
          <div class="task-section">
            <label>Notes:</label>
            <p>${currentTask.value.notes}</p>
          </div>
        ` : ''}
        
        <scr` + `ipt>
          // Timer state
          let timerState = ${JSON.stringify({
            isActive: timerStore.timerState.isActive,
            isPaused: timerStore.timerState.isPaused,
            currentPhase: timerStore.timerState.currentPhase,
            timeRemaining: timerStore.timerState.timeRemaining,
            isPomodoroEnabled: settingsStore.isPomodoroEnabled
          })};
          
          // Update timer display
          function updateTimerDisplay() {
            const timerSection = document.getElementById('timerSection');
            const timerPhase = document.getElementById('timerPhase');
            const timerDisplay = document.getElementById('timerDisplay');
            const timerStatus = document.getElementById('timerStatus');
            
            if (!timerState.isPomodoroEnabled) {
              timerSection.style.display = 'none';
              return;
            }
            
            timerSection.style.display = 'block';
            
            // Update phase
            if (timerState.currentPhase === 'work') {
              timerPhase.textContent = 'Focus Time';
            } else if (timerState.currentPhase === 'shortBreak') {
              timerPhase.textContent = 'Short Break';
            } else {
              timerPhase.textContent = 'Long Break';
            }
            
            // Update time
            const minutes = Math.floor(timerState.timeRemaining / 60);
            const seconds = timerState.timeRemaining % 60;
            timerDisplay.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            
            // Update status
            if (!timerState.isActive) {
              timerStatus.textContent = 'Timer not running';
            } else if (timerState.isPaused) {
              timerStatus.textContent = 'Timer paused';
            } else {
              timerStatus.textContent = 'Timer running';
            }
          }
          
          // Listen for timer updates from parent window
          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'timerUpdate') {
              timerState = event.data.state;
              updateTimerDisplay();
            }
          });
          
          // Initial display
          updateTimerDisplay();
        </scr` + `ipt>
      </body>
      </html>
    `)
    popout.document.close()
    
    // Store reference to popout window for updates
    popoutWindow.value = popout
  }
}

// Watch timer changes and send updates to popout window
watchEffect(() => {
  if (popoutWindow.value && !popoutWindow.value.closed) {
    const timerStore = useTimerStore()
    const settingsStore = useSettingsStore()
    
    popoutWindow.value.postMessage({
      type: 'timerUpdate',
      state: {
        isActive: timerStore.timerState.isActive,
        isPaused: timerStore.timerState.isPaused,
        currentPhase: timerStore.timerState.currentPhase,
        timeRemaining: timerStore.timerState.timeRemaining,
        isPomodoroEnabled: settingsStore.isPomodoroEnabled
      }
    }, '*')
  }
})

// Clean up on unmount
onUnmounted(() => {
  if (popoutWindow.value && !popoutWindow.value.closed) {
    popoutWindow.value.close()
  }
})
</script>

<style scoped>
.doing-now-card {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border: 2px solid var(--primary-color);
  box-shadow: 0 4px 20px rgba(255, 169, 10, 0.15);
}

.doing-now-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}

.doing-now-header h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: #e5e5e5;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.task-content {
  padding: 1rem;
}

.task-title {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.task-details {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-item label,
.task-notes label {
  display: block;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item p,
.task-notes p {
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}

.task-notes {
  border-top: 1px solid #e5e5e5;
  padding-top: 1.5rem;
}

@media (max-width: 768px) {
  .task-title {
    font-size: 1.5rem;
  }
}
</style>