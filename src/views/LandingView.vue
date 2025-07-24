<template>
  <div class="landing-container">
    <Card class="landing-card">
      <template #header>
        <div class="logo-container">
          <i class="pi pi-check-square logo-icon"></i>
        </div>
      </template>
      <template #title>
        <h1>One Thing at a Time</h1>
      </template>
      <template #subtitle>
        <p>Focus on what matters, one task at a time.</p>
      </template>
      <template #content>
        <div class="auth-buttons">
          <Button 
            label="Login" 
            icon="pi pi-sign-in" 
            @click="handleLogin"
            class="p-button-primary"
            :loading="isLoading"
          />
          <Button 
            label="Sign Up" 
            icon="pi pi-user-plus" 
            @click="handleRegister"
            class="p-button-secondary"
            :loading="isLoading"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  isLoading.value = true
  try {
    await authStore.login()
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  isLoading.value = true
  try {
    await authStore.register()
  } catch (error) {
    console.error('Register error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
  min-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  margin: 0 auto;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.landing-card {
  max-width: 650px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.logo-container {
  text-align: center;
  padding: 2rem 0;
}

.logo-icon {
  font-size: 4rem;
  color: var(--primary-color);
}

:deep(.p-card-title) {
  text-align: center;
  color: var(--text-primary);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

:deep(.p-card-subtitle) {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.auth-buttons .p-button {
  flex: 1;
  min-width: 150px;
}

@media (max-width: 480px) {
  .auth-buttons {
    flex-direction: column;
  }
  
  .auth-buttons .p-button {
    width: 100%;
  }
}
</style>