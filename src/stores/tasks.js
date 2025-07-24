import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { databaseService } from '@/services/database'
import { useAuthStore } from './auth'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const completedTasks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()

  const currentTask = computed(() => {
    return tasks.value[0] || null
  })

  const remainingTasks = computed(() => {
    return tasks.value.slice(1)
  })

  async function loadTasks() {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      tasks.value = await databaseService.getUserTasks(authStore.username)
    } catch (err) {
      error.value = err.message
      console.error('Error loading tasks:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadCompletedTasks() {
    if (!authStore.username) return

    try {
      completedTasks.value = await databaseService.getCompletedTasks(authStore.username)
    } catch (err) {
      console.error('Error loading completed tasks:', err)
    }
  }

  async function createTask(taskData) {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      await databaseService.createTask(authStore.username, {
        userId: authStore.userId,
        ...taskData
      })
      await loadTasks()
    } catch (err) {
      error.value = err.message
      console.error('Error creating task:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(taskId, updates) {
    try {
      isLoading.value = true
      error.value = null
      await databaseService.updateTask(taskId, updates)
      await loadTasks()
      if (updates.completed) {
        await loadCompletedTasks()
      }
    } catch (err) {
      error.value = err.message
      console.error('Error updating task:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(taskId) {
    try {
      isLoading.value = true
      error.value = null
      await databaseService.deleteTask(taskId)
      await loadTasks()
    } catch (err) {
      error.value = err.message
      console.error('Error deleting task:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function completeTask(taskId) {
    await updateTask(taskId, {
      completed: true,
      completedAt: new Date().toISOString()
    })
  }

  async function reorderTasks(newTaskOrder) {
    if (!authStore.username) return

    try {
      isLoading.value = true
      error.value = null
      const taskIds = newTaskOrder.map(task => task._id)
      await databaseService.reorderTasks(authStore.username, taskIds)
      tasks.value = newTaskOrder
    } catch (err) {
      error.value = err.message
      console.error('Error reordering tasks:', err)
      await loadTasks() // Reload tasks if reorder fails
    } finally {
      isLoading.value = false
    }
  }

  function setupChangeListener() {
    if (!authStore.username) return
    
    databaseService.watchChanges((change) => {
      if (change.doc.type === 'task') {
        loadTasks()
        if (change.doc.completed) {
          loadCompletedTasks()
        }
      }
    }, authStore.username)
  }

  return {
    tasks,
    completedTasks,
    isLoading,
    error,
    currentTask,
    remainingTasks,
    loadTasks,
    loadCompletedTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    reorderTasks,
    setupChangeListener
  }
})