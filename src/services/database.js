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
    if (!this.db) return
    
    try {
      // Index for tasks by username and order
      const orderIndexResult = await this.db.createIndex({
        index: {
          fields: ['type', 'username', 'order']
        }
      })
      console.log('DatabaseService: Order index created:', orderIndexResult)

      // Index for completed tasks
      const completedIndexResult = await this.db.createIndex({
        index: {
          fields: ['type', 'username', 'completed']
        }
      })
      console.log('DatabaseService: Completed index created:', completedIndexResult)

      // Index for completed tasks with completedAt for sorting
      const completedAtIndexResult = await this.db.createIndex({
        index: {
          fields: ['type', 'username', 'completed', 'completedAt']
        }
      })
      console.log('DatabaseService: CompletedAt index created:', completedAtIndexResult)

    } catch (error) {
      console.error('DatabaseService: Error creating indexes:', error)
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
    console.log('DatabaseService: getUserTasks called for username:', username)
    
    const db = this.getDB()
    
    // Ensure indexes are created before querying
    await this.createIndexes()
    
    try {
      const result = await db.find({
        selector: {
          type: 'task',
          username: username,
          completed: false
        },
        sort: [{'order': 'asc'}]
      })
      
      console.log('DatabaseService: Found', result.docs.length, 'tasks for user:', username)
      console.log('DatabaseService: Tasks:', result.docs)
      
      return result.docs
    } catch (error) {
      console.warn('DatabaseService: Error with sorted query, trying without sort:', error)
      
      // Fallback: get tasks without sorting and sort manually
      const result = await db.find({
        selector: {
          type: 'task',
          username: username,
          completed: false
        }
      })
      
      // Sort manually by order field
      const sortedDocs = result.docs.sort((a, b) => (a.order || 0) - (b.order || 0))
      
      console.log('DatabaseService: Found', sortedDocs.length, 'tasks for user (manual sort):', username)
      
      return sortedDocs
    }
  }

  async getCompletedTasks(username) {
    const db = this.getDB()
    
    // Ensure indexes are created before querying
    await this.createIndexes()
    
    try {
      const result = await db.find({
        selector: {
          type: 'task',
          username: username,
          completed: true
        },
        sort: [{ completedAt: 'desc' }]
      })
      return result.docs
    } catch (error) {
      console.warn('DatabaseService: Error with sorted completed tasks query, trying without sort:', error)
      
      // Fallback: get tasks without sorting and sort manually
      const result = await db.find({
        selector: {
          type: 'task',
          username: username,
          completed: true
        }
      })
      
      // Sort manually by completedAt field (newest first)
      const sortedDocs = result.docs.sort((a, b) => {
        const dateA = new Date(a.completedAt || 0)
        const dateB = new Date(b.completedAt || 0)
        return dateB - dateA
      })
      
      return sortedDocs
    }
  }

  async createTask(username, taskData) {
    console.log('DatabaseService: createTask called with username:', username, 'taskData:', taskData)
    
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
    
    console.log('DatabaseService: Creating task document:', task)
    
    const result = await db.put(task)
    console.log('DatabaseService: Task created with result:', result)
    
    return result
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