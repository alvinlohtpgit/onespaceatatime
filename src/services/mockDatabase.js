// Temporary mock database service to test without PouchDB
class MockDatabaseService {
  constructor() {
    this.data = new Map()
    this.initialized = false
    this.currentUsername = null
  }

  init() {
    console.log('Mock database initialized')
    this.initialized = true
    return { name: 'mock-db' }
  }

  async initializeUserData(username) {
    console.log('Initializing user data for:', username)
    this.currentUsername = username
    
    if (!this.data.has(username)) {
      this.data.set(username, {
        tasks: [],
        settings: {
          pomodoro: {
            workDuration: 25,
            shortBreak: 5,
            longBreak: 15,
            enabled: false
          }
        },
        timer: {
          isActive: false,
          timeRemaining: 1500
        }
      })
    }
  }

  async cleanupUserData() {
    console.log('Cleaning up user data')
    this.currentUsername = null
  }

  getDB() {
    return { name: 'mock-db' }
  }

  async getUserTasks(username) {
    const userData = this.data.get(username) || { tasks: [] }
    return userData.tasks.filter(task => !task.completed)
  }

  async getCompletedTasks(username) {
    const userData = this.data.get(username) || { tasks: [] }
    return userData.tasks.filter(task => task.completed)
  }

  async createTask(username, taskData) {
    const userData = this.data.get(username) || { tasks: [] }
    const task = {
      _id: `${username}::task::${Date.now()}::${Math.random().toString(36).substring(2)}`,
      type: 'task',
      username: username,
      createdAt: new Date().toISOString(),
      completed: false,
      ...taskData
    }
    userData.tasks.push(task)
    this.data.set(username, userData)
    return { ok: true, id: task._id }
  }

  async updateTask(taskId, updates) {
    // Find task across all users (simplified)
    for (const [username, userData] of this.data.entries()) {
      const taskIndex = userData.tasks.findIndex(t => t._id === taskId)
      if (taskIndex !== -1) {
        userData.tasks[taskIndex] = {
          ...userData.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        this.data.set(username, userData)
        return { ok: true }
      }
    }
    throw new Error('Task not found')
  }

  async deleteTask(taskId) {
    for (const [username, userData] of this.data.entries()) {
      const taskIndex = userData.tasks.findIndex(t => t._id === taskId)
      if (taskIndex !== -1) {
        userData.tasks.splice(taskIndex, 1)
        this.data.set(username, userData)
        return { ok: true }
      }
    }
    throw new Error('Task not found')
  }

  async getUserSettings(username) {
    const userData = this.data.get(username)
    return userData?.settings || {
      pomodoro: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        enabled: false
      }
    }
  }

  async getTimerState(username) {
    const userData = this.data.get(username)
    return userData?.timer || {
      isActive: false,
      timeRemaining: 1500
    }
  }

  watchChanges(callback, username) {
    console.log('Mock watching changes for:', username)
    return { cancel: () => console.log('Mock change listener cancelled') }
  }

  validateUserAccess(docId, username) {
    return docId && username && docId.startsWith(`${username}::`)
  }
}

export const databaseService = new MockDatabaseService()