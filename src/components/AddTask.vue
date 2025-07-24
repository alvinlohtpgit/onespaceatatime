<template>
  <div class="add-task-container">
    <Button 
      v-if="!isExpanded"
      label="Add Task" 
      icon="pi pi-plus" 
      class="p-button-primary add-task-button"
      @click="isExpanded = true"
    />
    
    <Card v-else class="add-task-card">
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="form-field">
            <InputText 
              v-model="taskData.title" 
              placeholder="What needs to be done?"
              class="w-full"
              :class="{ 'p-invalid': errors.title }"
              ref="titleInput"
            />
            <small class="p-error" v-if="errors.title">{{ errors.title }}</small>
          </div>
          
          <div class="form-field">
            <Textarea 
              v-model="taskData.notes" 
              placeholder="Additional notes (optional)"
              rows="3"
              class="w-full"
              autoResize
            />
          </div>
          
          <div class="advanced-fields" v-if="showAdvanced">
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
          </div>
          
          <div class="form-actions">
            <Button 
              label="Advanced"
              icon="pi pi-cog"
              class="p-button-text p-button-sm"
              @click="showAdvanced = !showAdvanced"
              type="button"
            />
            
            <div class="action-buttons">
              <Button 
                label="Cancel"
                class="p-button-text"
                @click="resetForm"
                type="button"
              />
              <Button 
                label="Add Task"
                icon="pi pi-plus"
                class="p-button-primary"
                type="submit"
                :loading="isLoading"
              />
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

const tasksStore = useTasksStore()

const isExpanded = ref(false)
const isLoading = ref(false)
const showAdvanced = ref(false)
const titleInput = ref(null)

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
    await tasksStore.createTask({
      title: taskData.value.title.trim(),
      notes: taskData.value.notes.trim(),
      nextAction: taskData.value.nextAction.trim(),
      whyItMatters: taskData.value.whyItMatters.trim(),
      priority: taskData.value.priority,
      estimatedDuration: taskData.value.estimatedDuration
    })
    
    resetForm()
  } catch (error) {
    console.error('Error creating task:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  taskData.value = {
    title: '',
    notes: '',
    nextAction: '',
    whyItMatters: '',
    priority: null,
    estimatedDuration: null
  }
  errors.value = {}
  isExpanded.value = false
  showAdvanced.value = false
}

// Focus on title input when expanded
watch(isExpanded, async (newValue) => {
  if (newValue) {
    await nextTick()
    titleInput.value?.$el?.focus()
  }
})
</script>

<style scoped>
.add-task-container {
  margin-bottom: 2rem;
}

.add-task-button {
  width: 100%;
}

.add-task-card {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.advanced-fields {
  background-color: #fafafa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
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

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .action-buttons {
    justify-content: flex-end;
  }
}
</style>