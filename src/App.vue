<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { databaseService } from '@/services/database'
import OfflineIndicator from '@/components/OfflineIndicator.vue'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    console.log('App mounted - initializing...')
    
    // Initialize database
    console.log('Initializing database...')
    const db = databaseService.init()
    console.log('Database initialized:', db)
    
    // Check authentication status
    console.log('Checking auth...')
    await authStore.checkAuth()
    console.log('Auth check complete')
    
  } catch (error) {
    console.error('Error during app initialization:', error)
  }
})
</script>

<template>
  <div id="app">
    <OfflineIndicator />
    <RouterView />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: var(--background-color);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: var(--text-primary);
  background-color: var(--background-color);
}
</style>