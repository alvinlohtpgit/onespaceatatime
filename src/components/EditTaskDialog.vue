<template>
  <Dialog 
    v-model:visible="isVisible" 
    :header="'Edit Task'" 
    :style="{ width: '450px' }"
    :modal="true"
    @hide="handleHide"
  >
    <form @submit.prevent="handleSubmit">
      <div class="form-field">
        <label>Task Title *</label>
        <InputText 
          v-model="taskData.title" 
          placeholder="What needs to be done?"
          class="w-full"
          :class="{ 'p-invalid': errors.title }"
        />
        <small class="p-error" v-if="errors.title">{{ errors.title }}</small>
      </div>
      
      <div class="form-field">
        <label>Notes</label>
        <Textarea 
          v-model="taskData.notes" 
          placeholder="Additional notes"
          rows="3"
          class="w-full"
          autoResize
        />
      </div>
      
      <div class="form-field">
        <label>Next Action</label>
        <InputText 
          v-model="taskData.nextAction" 
          placeholder="What's the very next step?"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label>Why This Matters</label>
        <InputText 
          v-model="taskData.whyItMatters" 
          placeholder="Why is this important?"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label>Priority</label>
        <Dropdown 
          v-model="taskData.priority" 
          :options="priorityOptions" 
          optionLabel="label"
          optionValue="value"
          placeholder="Select priority"
          class="w-full"
        />
      </div>
      
      <div class="form-field">
        <label>Estimated Duration (minutes)</label>
        <InputNumber 
          v-model="taskData.estimatedDuration" 
          :min="1"
          :max="480"
          placeholder="How long will this take?"
          class="w-full"
        />
      </div>
    </form>
    
    <template #footer>
      <Button 
        label="Cancel" 
        class="p-button-text" 
        @click="isVisible = false"
      />
      <Button 
        label="Save Changes" 
        icon="pi pi-check" 
        @click="handleSubmit"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible'])

const tasksStore = useTasksStore()

const isVisible = ref(props.visible)
const isLoading = ref(false)

const taskData = ref({
  title: '',
  notes: '',
  nextAction: '',
  whyItMatters: '',
  priority: null,
  estimatedDuration: null
})

const errors = ref({
  title: ''
})

const priorityOptions = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' }
]

// Watch for changes in visibility prop
watch(() => props.visible, (newValue) => {
  isVisible.value = newValue
  if (newValue && props.task) {
    // Populate form with task data
    taskData.value = {
      title: props.task.title || '',
      notes: props.task.notes || '',
      nextAction: props.task.nextAction || '',
      whyItMatters: props.task.whyItMatters || '',
      priority: props.task.priority || null,
      estimatedDuration: props.task.estimatedDuration || null
    }
    errors.value = {}
  }
})

// Emit visibility changes
watch(isVisible, (newValue) => {
  emit('update:visible', newValue)
})

const validateForm = () => {
  errors.value = {}
  
  if (!taskData.value.title.trim()) {
    errors.value.title = 'Task title is required'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await tasksStore.updateTask(props.task._id, {
      title: taskData.value.title.trim(),
      notes: taskData.value.notes.trim(),
      nextAction: taskData.value.nextAction.trim(),
      whyItMatters: taskData.value.whyItMatters.trim(),
      priority: taskData.value.priority,
      estimatedDuration: taskData.value.estimatedDuration
    })
    
    isVisible.value = false
  } catch (error) {
    console.error('Error updating task:', error)
  } finally {
    isLoading.value = false
  }
}

const handleHide = () => {
  errors.value = {}
}
</script>

<style scoped>
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

.w-full {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-dropdown),
:deep(.p-inputnumber-input) {
  width: 100%;
}
</style>