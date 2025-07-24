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
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TaskNudge from './TaskNudge.vue'

const emit = defineEmits(['edit-task'])

const tasksStore = useTasksStore()
const toast = useToast()
const currentTask = computed(() => tasksStore.currentTask)

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
  
  // Create a minimal popout window
  const popoutFeatures = 'width=400,height=600,toolbar=no,menubar=no,location=no,status=no,scrollbars=yes'
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
        </style>
      </head>
      <body>
        <button class="close-button" onclick="window.close()">Close</button>
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
      </body>
      </html>
    `)
    popout.document.close()
  }
}
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