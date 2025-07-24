<template>
  <div style="padding: 2rem; background: white; min-height: 100vh;">
    <h1 style="color: #262626;">Test View Working!</h1>
    <p style="color: #999999;">If you can see this, the router is working.</p>
    <div style="margin-top: 2rem;">
      <button @click="testAuth" style="padding: 1rem; background: #ffa90a; color: white; border: none; border-radius: 4px;">
        Test Auth Store
      </button>
    </div>
    <div style="margin-top: 1rem;">
      <p>Auth Status: {{ authStore.isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}</p>
      <p>Loading: {{ authStore.isLoading }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const testAuth = async () => {
  console.log('Testing auth...')
  try {
    await authStore.checkAuth()
    console.log('Auth test complete')
  } catch (error) {
    console.error('Auth test error:', error)
  }
}
</script>