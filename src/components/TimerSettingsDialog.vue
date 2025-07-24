<template>
  <Dialog 
    v-model:visible="isVisible" 
    header="Timer Settings" 
    :style="{ width: '450px' }"
    :modal="true"
  >
    <div class="settings-content">
      <div class="form-field">
        <label>Work Duration (minutes)</label>
        <InputNumber 
          v-model="localSettings.workDuration" 
          :min="1"
          :max="60"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label>Short Break (minutes)</label>
        <InputNumber 
          v-model="localSettings.shortBreak" 
          :min="1"
          :max="30"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label>Long Break (minutes)</label>
        <InputNumber 
          v-model="localSettings.longBreak" 
          :min="1"
          :max="60"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label>Cycles Before Long Break</label>
        <InputNumber 
          v-model="localSettings.cyclesBeforeLongBreak" 
          :min="2"
          :max="8"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <div class="checkbox-field">
          <Checkbox 
            v-model="localSettings.enabled" 
            inputId="pomodoro-enabled"
            binary
          />
          <label for="pomodoro-enabled">Enable Pomodoro Timer</label>
        </div>
      </div>
    </div>
    
    <template #footer>
      <Button 
        label="Cancel" 
        class="p-button-text" 
        @click="handleCancel"
      />
      <Button 
        label="Save Settings" 
        icon="pi pi-check" 
        @click="handleSave"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'settings-updated'])

const settingsStore = useSettingsStore()

const isVisible = ref(props.visible)
const isLoading = ref(false)

const localSettings = ref({
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  cyclesBeforeLongBreak: 4,
  enabled: false
})

// Watch for changes in visibility prop
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue
  if (newValue) {
    // Load current settings
    localSettings.value = {
      ...settingsStore.pomodoroSettings
    }
  }
})

// Emit visibility changes
watch(isVisible, (newValue) => {
  emit('update:visible', newValue)
})

const handleSave = async () => {
  isLoading.value = true
  
  try {
    await settingsStore.updatePomodoroSettings(localSettings.value)
    isVisible.value = false
    emit('settings-updated')
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  isVisible.value = false
}
</script>

<style scoped>
.settings-content {
  padding: 1rem 0;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-field label {
  margin: 0;
  cursor: pointer;
}

.w-full {
  width: 100%;
}

:deep(.p-inputnumber) {
  width: 100%;
}

:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>