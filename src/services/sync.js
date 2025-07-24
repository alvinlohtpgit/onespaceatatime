import PouchDB from 'pouchdb'
import { kindeService } from './kinde'

class SyncService {
  constructor() {
    this.syncHandler = null
    this.remoteDb = null
    this.localDb = null
  }

  async initSync(localDb, remoteUrl) {
    if (!remoteUrl) {
      console.log('No remote URL configured, running in offline mode')
      return false
    }

    try {
      // Get authentication token for CouchDB
      const token = await kindeService.getToken()
      const username = await kindeService.getUsername()
      
      // Configure remote database with authentication
      this.remoteDb = new PouchDB(remoteUrl, {
        fetch: (url, opts) => {
          opts.headers = opts.headers || {}
          opts.headers['Authorization'] = `Bearer ${token}`
          return PouchDB.fetch(url, opts)
        }
      })
      
      this.localDb = localDb
      
      // Start sync
      this.startSync(username)
      
      return true
    } catch (error) {
      console.error('Failed to initialize sync:', error)
      return false
    }
  }

  startSync(username) {
    if (!this.localDb || !this.remoteDb) return

    // Create a filter to only sync user's documents
    const userFilter = (doc) => {
      return doc.username === username || doc._id.startsWith(`${username}::`)
    }

    // Set up bidirectional sync
    this.syncHandler = this.localDb.sync(this.remoteDb, {
      live: true,
      retry: true,
      filter: userFilter,
      query_params: { username: username }
    })

    // Handle sync events
    this.syncHandler
      .on('change', (info) => {
        console.log('Sync change:', info)
      })
      .on('paused', (err) => {
        if (err) {
          console.log('Sync paused due to error:', err)
        } else {
          console.log('Sync paused - all changes synced')
        }
      })
      .on('active', () => {
        console.log('Sync resumed')
      })
      .on('denied', (err) => {
        console.error('Sync denied:', err)
      })
      .on('complete', (info) => {
        console.log('Sync completed:', info)
      })
      .on('error', (err) => {
        console.error('Sync error:', err)
      })
  }

  stopSync() {
    if (this.syncHandler) {
      this.syncHandler.cancel()
      this.syncHandler = null
    }
  }

  async validateData(db) {
    try {
      // Check database integrity
      const info = await db.info()
      console.log('Database info:', info)
      
      // Verify indexes exist
      const indexes = await db.getIndexes()
      console.log('Database indexes:', indexes)
      
      // Test a simple query
      const testQuery = await db.find({
        selector: { type: { $exists: true } },
        limit: 1
      })
      
      return {
        valid: true,
        info: info,
        indexes: indexes.indexes.length,
        canQuery: testQuery.docs.length >= 0
      }
    } catch (error) {
      console.error('Data validation failed:', error)
      return {
        valid: false,
        error: error.message
      }
    }
  }

  async checkOnlineStatus() {
    return navigator.onLine
  }

  setupOfflineDetection(callback) {
    window.addEventListener('online', () => {
      console.log('Connection restored')
      callback(true)
      if (this.syncHandler) {
        this.startSync()
      }
    })

    window.addEventListener('offline', () => {
      console.log('Connection lost - working offline')
      callback(false)
    })
  }
}

export const syncService = new SyncService()