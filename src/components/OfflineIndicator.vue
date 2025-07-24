<template>
  <transition name="slide-down">
    <div v-if="!isOnline" class="offline-indicator">
      <i class="pi pi-wifi"></i>
      <span>Working Offline</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { syncService } from '@/services/sync'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = (online) => {
  isOnline.value = online
}

onMounted(() => {
  syncService.setupOfflineDetection(updateOnlineStatus)
  isOnline.value = navigator.onLine
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.offline-indicator {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.offline-indicator i {
  font-size: 1rem;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translate(-50%, -100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translate(-50%, -100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .offline-indicator {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>