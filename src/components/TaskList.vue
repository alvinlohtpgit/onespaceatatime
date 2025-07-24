<template>
  <div class="task-list">
    <div class="task-list-header">
      <h3>Up Next</h3>
      <span class="task-count">{{ tasks.length }} {{ tasks.length === 1 ? 'task' : 'tasks' }}</span>
    </div>
    
    <draggable 
      v-model="localTasks"
      :animation="200"
      handle=".drag-handle"
      @end="handleDragEnd"
      item-key="_id"
      class="tasks-container"
      role="list"
      :aria-label="`Task list with ${tasks.length} tasks`"
    >
      <template #item="{ element }">
        <TaskCard 
          :task="element"
          @complete="$emit('complete-task', element)"
          @edit="$emit('edit-task', element)"
          @delete="$emit('delete-task', element)"
        />
      </template>
    </draggable>
    
    <div v-if="tasks.length === 0" class="empty-tasks">
      <p>No upcoming tasks. You're all caught up!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['reorder-tasks', 'complete-task', 'edit-task', 'delete-task'])

// Create a local copy of tasks for draggable
const localTasks = ref([...props.tasks])

// Watch for changes in props.tasks and update local copy
watch(() => props.tasks, (newTasks) => {
  localTasks.value = [...newTasks]
}, { deep: true })

const handleDragEnd = () => {
  // Emit the new order to parent
  emit('reorder-tasks', localTasks.value)
}
</script>

<style scoped>
.task-list {
  margin-top: 2rem;
}

.task-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.task-list-header h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin: 0;
}

.task-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
  background-color: #f5f5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.tasks-container {
  min-height: 100px;
}

.empty-tasks {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #fafafa;
  border-radius: 0.5rem;
  border: 2px dashed #e5e5e5;
}

.empty-tasks p {
  color: var(--text-secondary);
  margin: 0;
}

/* Drag and drop styles */
.sortable-ghost {
  opacity: 0.5;
}

.sortable-drag {
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}
</style>