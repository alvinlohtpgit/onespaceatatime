import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { kindeService } from '@/services/kinde'
import { databaseService } from '@/services/database'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true)

  const username = computed(() => {
    return user.value?.given_name || user.value?.email?.split('@')[0] || 'user'
  })

  const userId = computed(() => {
    return user.value?.id || null
  })

  async function checkAuth() {
    try {
      isLoading.value = true
      const authenticated = await kindeService.isAuthenticated()
      isAuthenticated.value = authenticated
      
      if (authenticated) {
        user.value = await kindeService.getUser()
        // Initialize user data in database
        await databaseService.initializeUserData(username.value)
      } else {
        user.value = null
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      isAuthenticated.value = false
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function login() {
    await kindeService.login()
  }

  async function register() {
    await kindeService.register()
  }

  async function logout() {
    // Clean up database listeners and data
    await databaseService.cleanupUserData()
    
    // Logout from Kinde
    await kindeService.logout()
    
    // Clear local state
    isAuthenticated.value = false
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    username,
    userId,
    checkAuth,
    login,
    register,
    logout
  }
})