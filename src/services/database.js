import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind)

class DatabaseService {
  constructor() {
    this.db = null
    this.initialized = false
    this.currentUsername = null
    this.changeListeners = []
  }

  init() {
    if (this.initialized) return this.db

    this.db = new PouchDB('onespaceatatime')
    this.initialized = true

    // Create indexes for better performance
    this.createIndexes()

    return this.db
  }

  async initializeUserData(username) {
    if (!username) return

    this.currentUsername = username
    const db = this.getDB()

    // Check if user has existing data
    const userDocs = await db.find({
      selector: {
        username: username
      },
      limit: 1
    })

    // If no user data exists, create default documents
    if (userDocs.docs.length === 0) {
      await this.createDefaultUserData(username)
    }
  }

  async createDefaultUserData(username) {
    const db = this.getDB()
    
    // Create default settings
    const defaultSettings = {
      _id: `${username}::settings`,
      type: 'settings',
      username: username,
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
    }

    // Create default timer state
    const defaultTimer = {
      _id: `${username}::timer::state`,
      type: 'timer_state',
      username: username,
      isActive: false,
      isPaused: false,
      currentPhase: 'work',
      timeRemaining: 1500,
      cyclesCompleted: 0,
      sessionStartTime: null,
      taskId: null
    }

    try {
      await db.bulkDocs([defaultSettings, defaultTimer])
    } catch (error) {
      console.error('Error creating default user data:', error)
    }
  }

  async cleanupUserData() {
    // Cancel all change listeners
    this.changeListeners.forEach(listener => {
      if (listener && listener.cancel) {
        listener.cancel()
      }
    })
    this.changeListeners = []
    
    // Clear current username
    this.currentUsername = null
  }

  async createIndexes() {
    try {
      // Index for tasks by username and order
      await this.db.createIndex({
        index: {
          fields: ['type', 'username', 'order']
        }
      })

      // Index for completed tasks
      await this.db.createIndex({
        index: {
          fields: ['type', 'username', 'completed']
        }
      })
    } catch (error) {
      console.error('Error creating indexes:', error)
    }
  }

  getDB() {
    if (!this.initialized) {
      this.init()
    }
    return this.db
  }

  // User-scoped operations
  async getUserTasks(username) {
    const db = this.getDB()
    const result = await db.find({
      selector: {
        type: 'task',
        username: username,
        completed: false
      },
      sort: ['order']
    })
    return result.docs
  }

  async getCompletedTasks(username) {
    const db = this.getDB()
    const result = await db.find({
      selector: {
        type: 'task',
        username: username,
        completed: true
      },
      sort: [{ completedAt: 'desc' }]
    })
    return result.docs
  }

  async createTask(username, taskData) {
    const db = this.getDB()
    const timestamp = Date.now()
    const uuid = Math.random().toString(36).substring(2, 15)
    
    const task = {
      _id: `${username}::task::${timestamp}::${uuid}`,
      type: 'task',
      username: username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      order: timestamp,
      ...taskData
    }
    
    return await db.put(task)
  }

  async updateTask(taskId, updates) {
    const db = this.getDB()
    const task = await db.get(taskId)
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return await db.put(updatedTask)
  }

  async deleteTask(taskId) {
    const db = this.getDB()
    const task = await db.get(taskId)
    return await db.remove(task)
  }

  async reorderTasks(username, taskIds) {
    const db = this.getDB()
    const bulkUpdates = []
    
    for (let i = 0; i < taskIds.length; i++) {
      const task = await db.get(taskIds[i])
      // Validate that the task belongs to the user
      if (task.username !== username) {
        throw new Error(`Task ${taskIds[i]} does not belong to user ${username}`)
      }
      task.order = i
      task.updatedAt = new Date().toISOString()
      bulkUpdates.push(task)
    }
    
    return await db.bulkDocs(bulkUpdates)
  }

  // Settings operations
  async getUserSettings(username) {
    const db = this.getDB()
    const settingsId = `${username}::settings`
    
    try {
      return await db.get(settingsId)
    } catch (error) {
      if (error.status === 404) {
        // Create default settings if not exist
        const defaultSettings = {
          _id: settingsId,
          type: 'settings',
          username: username,
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
        }
        await db.put(defaultSettings)
        return defaultSettings
      }
      throw error
    }
  }

  async updateUserSettings(username, updates) {
    const db = this.getDB()
    const settings = await this.getUserSettings(username)
    const updatedSettings = {
      ...settings,
      ...updates
    }
    return await db.put(updatedSettings)
  }

  // Timer state operations
  async getTimerState(username) {
    const db = this.getDB()
    const timerId = `${username}::timer::state`
    
    try {
      return await db.get(timerId)
    } catch (error) {
      if (error.status === 404) {
        // Create default timer state if not exist
        const defaultTimer = {
          _id: timerId,
          type: 'timer_state',
          username: username,
          isActive: false,
          isPaused: false,
          currentPhase: 'work',
          timeRemaining: 1500,
          cyclesCompleted: 0,
          sessionStartTime: null,
          taskId: null
        }
        await db.put(defaultTimer)
        return defaultTimer
      }
      throw error
    }
  }

  async updateTimerState(username, updates) {
    const db = this.getDB()
    const timer = await this.getTimerState(username)
    const updatedTimer = {
      ...timer,
      ...updates
    }
    return await db.put(updatedTimer)
  }

  // Listen for changes
  watchChanges(callback, username) {
    const db = this.getDB()
    const listener = db.changes({
      since: 'now',
      live: true,
      include_docs: true,
      filter: (doc) => {
        return doc.username === username
      }
    }).on('change', callback)
    
    this.changeListeners.push(listener)
    return listener
  }

  // Validate user access
  validateUserAccess(docId, username) {
    if (!docId || !username) return false
    return docId.startsWith(`${username}::`)
  }
}

export const databaseService = new DatabaseService()