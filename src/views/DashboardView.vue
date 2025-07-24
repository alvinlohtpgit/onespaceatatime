<template>
  <div class="dashboard-layout">
    <AppHeader />
    <main class="dashboard-content">
      <div class="content-wrapper">
        <div class="welcome-section" v-if="!hasTasks && !tasksStore.isLoading">
          <Card class="welcome-card">
            <template #content>
              <div class="welcome-content">
                <i class="pi pi-inbox welcome-icon"></i>
                <h2>Welcome to One Space At a Time!</h2>
                <p>You don't have any tasks yet. Add your first task to get started.</p>
                <AddTask />
              </div>
            </template>
          </Card>
        </div>
        
        <div class="tasks-section" v-else-if="hasTasks">
          <div class="main-grid">
            <div class="left-column">
              <DoingNow @edit-task="handleEditTask" />
              <PomodoroTimer 
                v-if="settingsStore.isPomodoroEnabled" 
                :currentTaskId="tasksStore.currentTask?._id"
              />
            </div>
            
            <div class="right-column">
              <AddTask />
              <TaskList 
                v-if="!settingsStore.isFocusModeEnabled"
                :tasks="tasksStore.remainingTasks"
                @reorder-tasks="handleReorderTasks"
                @complete-task="handleCompleteTask"
                @edit-task="handleEditTask"
                @delete-task="handleDeleteTask"
              />
              <Card v-else class="focus-mode-card">
                <template #content>
                  <div class="focus-mode-content">
                    <i class="pi pi-lock focus-icon"></i>
                    <h3>Focus Lock Active</h3>
                    <p>All tasks are hidden to help you focus on your current task.</p>
                    <Button 
                      label="Disable Focus Lock" 
                      icon="pi pi-unlock" 
                      class="p-button-secondary"
                      @click="disableFocusMode"
                    />
                  </div>
                </template>
              </Card>
              <CompletedTasks />
            </div>
          </div>
        </div>
        
        <div class="loading-section" v-else-if="tasksStore.isLoading">
          <ProgressSpinner />
        </div>
      </div>
    </main>
    
    <EditTaskDialog 
      v-model:visible="showEditDialog"
      :task="editingTask"
    />
    
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { useSettingsStore } from '@/stores/settings'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import AppHeader from '@/components/AppHeader.vue'
import DoingNow from '@/components/DoingNow.vue'
import TaskList from '@/components/TaskList.vue'
import AddTask from '@/components/AddTask.vue'
import EditTaskDialog from '@/components/EditTaskDialog.vue'
import PomodoroTimer from '@/components/PomodoroTimer.vue'
import CompletedTasks from '@/components/CompletedTasks.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

const authStore = useAuthStore()
const tasksStore = useTasksStore()
const settingsStore = useSettingsStore()
const confirm = useConfirm()
const toast = useToast()

const showEditDialog = ref(false)
const editingTask = ref(null)

const hasTasks = computed(() => tasksStore.tasks.length > 0)

onMounted(async () => {
  // Load user data
  await Promise.all([
    tasksStore.loadTasks(),
    tasksStore.loadCompletedTasks(),
    settingsStore.loadSettings()
  ])
  
  // Setup change listeners for real-time updates
  tasksStore.setupChangeListener()
  settingsStore.setupChangeListener()
})

const handleReorderTasks = async (newOrder) => {
  await tasksStore.reorderTasks(newOrder)
}

const handleCompleteTask = async (task) => {
  await tasksStore.completeTask(task._id)
  toast.add({
    severity: 'success',
    summary: 'Task Completed',
    detail: task.title,
    life: 3000
  })
}

const handleEditTask = (task) => {
  editingTask.value = task
  showEditDialog.value = true
}

const handleDeleteTask = (task) => {
  confirm.require({
    message: `Are you sure you want to delete "${task.title}"?`,
    header: 'Delete Task',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await tasksStore.deleteTask(task._id)
      toast.add({
        severity: 'info',
        summary: 'Task Deleted',
        detail: task.title,
        life: 3000
      })
    }
  })
}

const disableFocusMode = async () => {
  await settingsStore.toggleFocusMode()
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: #fafafa;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-card {
  max-width: 600px;
  margin: 4rem auto 0;
  text-align: center;
}

.welcome-content {
  padding: 2rem;
}

.welcome-icon {
  font-size: 4rem;
  color: #e5e5e5;
  margin-bottom: 1.5rem;
}

.welcome-content h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.welcome-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.tasks-section {
  flex: 1;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.focus-mode-card {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border: 2px dashed #d4d4d4;
}

.focus-mode-content {
  text-align: center;
  padding: 3rem 1rem;
}

.focus-icon {
  font-size: 3rem;
  color: #d4d4d4;
  margin-bottom: 1rem;
}

.focus-mode-content h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.focus-mode-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .welcome-card {
    margin-top: 2rem;
  }
}
</style>