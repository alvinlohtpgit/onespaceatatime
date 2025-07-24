<template>
  <div class="completed-tasks">
    <div class="section-header" @click="toggleExpanded">
      <Button 
        :icon="isExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" 
        class="p-button-text p-button-rounded p-button-sm"
      />
      <h3>Completed Tasks</h3>
      <span class="task-count">{{ completedTasks.length }}</span>
    </div>
    
    <transition name="slide">
      <div v-if="isExpanded" class="completed-list">
        <div v-if="completedTasks.length === 0" class="empty-completed">
          <p>No completed tasks yet. Keep going!</p>
        </div>
        
        <TransitionGroup name="list" tag="div" v-else>
          <Card 
            v-for="task in completedTasks" 
            :key="task._id"
            class="completed-task-card"
          >
            <template #content>
              <div class="completed-task-content">
                <div class="task-info">
                  <h4 class="task-title">
                    <i class="pi pi-check-circle"></i>
                    {{ task.title }}
                  </h4>
                  <p class="task-notes" v-if="task.notes">{{ task.notes }}</p>
                  <div class="task-meta">
                    <span class="completed-date">
                      Completed {{ formatCompletedDate(task.completedAt) }}
                    </span>
                    <span v-if="task.actualDuration" class="task-duration">
                      • {{ task.actualDuration }} minutes
                    </span>
                  </div>
                </div>
                
                <div class="task-actions">
                  <Button 
                    icon="pi pi-undo" 
                    class="p-button-text p-button-rounded p-button-sm"
                    @click="handleUncomplete(task)"
                    v-tooltip.left="'Mark as incomplete'"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    class="p-button-danger p-button-text p-button-rounded p-button-sm"
                    @click="handleDelete(task)"
                    v-tooltip.left="'Delete permanently'"
                  />
                </div>
              </div>
            </template>
          </Card>
        </TransitionGroup>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'

const tasksStore = useTasksStore()
const confirm = useConfirm()
const toast = useToast()

const isExpanded = ref(false)
const completedTasks = computed(() => tasksStore.completedTasks)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const formatCompletedDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString()
}

const handleUncomplete = async (task) => {
  await tasksStore.updateTask(task._id, {
    completed: false,
    completedAt: null
  })
  toast.add({
    severity: 'info',
    summary: 'Task Restored',
    detail: task.title,
    life: 3000
  })
}

const handleDelete = (task) => {
  confirm.require({
    message: `Are you sure you want to permanently delete "${task.title}"?`,
    header: 'Delete Completed Task',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await tasksStore.deleteTask(task._id)
      toast.add({
        severity: 'info',
        summary: 'Task Deleted',
        detail: 'The task has been permanently removed',
        life: 3000
      })
    }
  })
}
</script>

<style scoped>
.completed-tasks {
  margin-top: 3rem;
  border-top: 2px solid #e5e5e5;
  padding-top: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.section-header:hover {
  background-color: #fafafa;
}

.section-header h3 {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
  flex: 1;
}

.task-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
  background-color: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.completed-list {
  margin-top: 1rem;
}

.empty-completed {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.completed-task-card {
  margin-bottom: 0.75rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.completed-task-card:hover {
  opacity: 1;
}

.completed-task-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-weight: 400;
  text-decoration: line-through;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-title i {
  color: var(--primary-color);
  text-decoration: none;
}

.task-notes {
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  opacity: 0.8;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.completed-task-card:hover .task-actions {
  opacity: 1;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.list-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

@media (max-width: 768px) {
  .task-actions {
    opacity: 1;
  }
}
</style>