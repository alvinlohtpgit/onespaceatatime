<template>
  <div class="callback-container">
    <h2>Authenticating...</h2>
    <p>Please wait while we log you in.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { kindeService } from '@/services/kinde'

const router = useRouter()

onMounted(async () => {
  try {
    const success = await kindeService.handleCallback()
    if (success) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error('Callback error:', error)
    router.push('/')
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}

h2 {
  color: #262626;
  margin-bottom: 1rem;
}

p {
  color: #999999;
}
</style>