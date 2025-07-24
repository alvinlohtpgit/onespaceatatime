<template>
  <Card 
    class="task-card" 
    :class="{ 'dragging': isDragging }"
    role="listitem"
    :aria-label="`Task: ${task.title}`"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <template #content>
      <div class="task-card-content">
        <div class="drag-handle">
          <i class="pi pi-bars"></i>
        </div>
        
        <div class="task-info">
          <h4 class="task-title">{{ task.title }}</h4>
          <p class="task-preview" v-if="task.notes">{{ truncateText(task.notes, 100) }}</p>
          <div class="task-meta">
            <Tag 
              v-if="task.priority" 
              :value="task.priority" 
              :severity="getPrioritySeverity(task.priority)"
              size="small"
            />
            <span class="task-date">{{ formatDate(task.createdAt) }}</span>
          </div>
        </div>
        
        <div class="task-actions">
          <Button 
            icon="pi pi-check" 
            class="p-button-success p-button-rounded p-button-text p-button-sm"
            @click.stop="$emit('complete', task)"
            v-tooltip.left="'Complete'"
          />
          <Button 
            icon="pi pi-pencil" 
            class="p-button-rounded p-button-text p-button-sm"
            @click.stop="$emit('edit', task)"
            v-tooltip.left="'Edit'"
          />
          <Button 
            icon="pi pi-trash" 
            class="p-button-danger p-button-rounded p-button-text p-button-sm"
            @click.stop="$emit('delete', task)"
            v-tooltip.left="'Delete'"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['complete', 'edit', 'delete'])

const isDragging = ref(false)

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString()
}

const getPrioritySeverity = (priority) => {
  const severityMap = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return severityMap[priority] || 'info'
}

const handleKeydown = (event) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      emit('edit', props.task)
      break
    case 'Delete':
      event.preventDefault()
      emit('delete', props.task)
      break
    case 'c':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        emit('complete', props.task)
      }
      break
  }
}
</script>

<style scoped>
.task-card {
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  cursor: move;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.task-card.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
}

.task-card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.drag-handle {
  color: #d4d4d4;
  cursor: grab;
  padding: 0.5rem;
}

.drag-handle:active {
  cursor: grabbing;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.task-preview {
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.task-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

:deep(.p-button-sm) {
  width: 2rem;
  height: 2rem;
}

:deep(.p-tag-small) {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .task-actions {
    opacity: 1;
  }
  
  .drag-handle {
    padding: 0.25rem;
  }
  
  .task-card-content {
    gap: 0.5rem;
  }
}
</style>