<template>
  <div class="user-profile">
    <Avatar 
      :label="avatarLabel" 
      :style="{ backgroundColor: '#ffd793', color: '#262626' }"
      shape="circle"
      size="large"
    />
    <div class="user-info" v-if="!collapsed">
      <span class="username">{{ displayName }}</span>
      <span class="email">{{ userEmail }}</span>
    </div>
    <Button 
      icon="pi pi-sign-out" 
      class="p-button-text p-button-rounded logout-btn"
      @click="handleLogout"
      v-tooltip.left="'Logout'"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(() => {
  return authStore.user?.given_name || authStore.user?.family_name || authStore.username
})

const userEmail = computed(() => {
  return authStore.user?.email || ''
})

const avatarLabel = computed(() => {
  const name = displayName.value
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return 'U'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background-color: rgba(255, 215, 147, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.username {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.email {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.logout-btn {
  color: var(--text-secondary);
}

.logout-btn:hover {
  color: var(--primary-color);
  background-color: rgba(255, 169, 10, 0.1);
}

@media (max-width: 768px) {
  .user-info {
    display: none;
  }
}
</style>