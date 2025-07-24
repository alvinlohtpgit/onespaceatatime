import { ref, computed } from 'vue'
import { kindeService } from '@/services/kinde'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(false)
const user = ref(null)
const isLoading = ref(true)

export function useAuth() {
  const router = useRouter()

  const checkAuth = async () => {
    try {
      isLoading.value = true
      const authenticated = await kindeService.isAuthenticated()
      isAuthenticated.value = authenticated
      
      if (authenticated) {
        const userData = await kindeService.getUser()
        user.value = userData
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

  const login = async () => {
    await kindeService.login()
  }

  const register = async () => {
    await kindeService.register()
  }

  const logout = async () => {
    await kindeService.logout()
    isAuthenticated.value = false
    user.value = null
    router.push('/')
  }

  const username = computed(() => {
    return user.value?.given_name || user.value?.email?.split('@')[0] || 'user'
  })

  const userId = computed(() => {
    return user.value?.id || null
  })

  return {
    isAuthenticated,
    user,
    isLoading,
    checkAuth,
    login,
    register,
    logout,
    username,
    userId
  }
}