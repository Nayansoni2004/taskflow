<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore.js'
import { 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  Tag, 
  Edit3, 
  Trash2, 
  CheckSquare, 
  ListTodo,
  AlertCircle
} from 'lucide-vue-next'

const props = defineProps({
  task: { type: Object, required: true }
})

const emit = defineEmits(['edit', 'delete'])

const taskStore = useTaskStore()

const subtaskProgress = computed(() => {
  if (!props.task.subtasks || props.task.subtasks.length === 0) return null
  const total = props.task.subtasks.length
  const done = props.task.subtasks.filter(s => s.completed).length
  return {
    done,
    total,
    percent: Math.round((done / total) * 100)
  }
})

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return null
  const today = new Date().toLocaleDateString('en-CA')
  if (props.task.dueDate === today) return 'Today'
  
  const d = new Date(props.task.dueDate)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const isOverdue = computed(() => {
  if (props.task.completed || !props.task.dueDate) return false
  const today = new Date().toLocaleDateString('en-CA')
  return props.task.dueDate < today
})

function toggleTask() {
  taskStore.toggleTask(props.task.id)
}

function toggleSubtask(subId) {
  taskStore.toggleSubtask(props.task.id, subId)
}
</script>

<template>
  <div :class="['task-card-container', { 'is-completed': task.completed, 'is-overdue': isOverdue }]">
    <div class="task-card-header">
      <!-- Checkbox toggle button -->
      <button 
        :class="['checkbox-btn', { checked: task.completed }]" 
        @click="toggleTask"
        :aria-label="task.completed ? 'Mark task as incomplete' : 'Mark task as completed'"
      >
        <Check v-if="task.completed" :size="14" class="check-icon" />
      </button>

      <!-- Task Title & Description -->
      <div class="task-info">
        <h3 class="task-title" @click="toggleTask">{{ task.title }}</h3>
        <p v-if="task.description" class="task-desc">{{ task.description }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="task-actions">
        <button class="action-btn edit-btn" title="Edit Task" @click="emit('edit', task)">
          <Edit3 :size="16" />
        </button>
        <button class="action-btn delete-btn" title="Delete Task" @click="emit('delete', task.id)">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <!-- Subtasks checklist bar -->
    <div v-if="task.subtasks && task.subtasks.length > 0" class="subtasks-section">
      <div class="subtasks-header">
        <div class="subtasks-count">
          <ListTodo :size="14" />
          <span>Subtasks ({{ subtaskProgress.done }}/{{ subtaskProgress.total }})</span>
        </div>
        <div class="subtask-progress-bar">
          <div class="subtask-progress-fill" :style="{ width: `${subtaskProgress.percent}%` }"></div>
        </div>
      </div>

      <div class="subtasks-list">
        <div 
          v-for="sub in task.subtasks" 
          :key="sub.id"
          class="subtask-item"
          :class="{ 'sub-completed': sub.completed }"
          @click="toggleSubtask(sub.id)"
        >
          <div :class="['mini-checkbox', { checked: sub.completed }]">
            <Check v-if="sub.completed" :size="10" />
          </div>
          <span class="subtask-title">{{ sub.title }}</span>
        </div>
      </div>
    </div>

    <!-- Task Footer Metadata Tags -->
    <div class="task-card-footer">
      <div class="footer-left">
        <!-- Priority Badge -->
        <span :class="['badge', `badge-${task.priority}`]">
          {{ task.priority }}
        </span>

        <!-- Category Tag -->
        <span v-if="task.category" class="category-tag">
          <Tag :size="12" />
          {{ task.category }}
        </span>

        <!-- Tags list -->
        <span v-for="tag in task.tags" :key="tag" class="custom-tag">
          #{{ tag }}
        </span>
      </div>

      <!-- Due Date Badge -->
      <div v-if="formattedDueDate" :class="['due-date-badge', { overdue: isOverdue }]">
        <AlertCircle v-if="isOverdue" :size="13" />
        <Clock v-else :size="13" />
        <span>{{ formattedDueDate }} <template v-if="task.dueTime">@ {{ task.dueTime }}</template></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card-container {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.task-card-container:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.task-card-container.is-completed {
  opacity: 0.7;
  background-color: var(--bg-subtle);
}

.task-card-container.is-completed .task-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-card-container.is-overdue {
  border-left: 4px solid var(--danger);
}

.task-card-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.checkbox-btn {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--border-medium);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.checkbox-btn:hover {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

.checkbox-btn.checked {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
}

.check-icon {
  stroke-width: 3;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  word-break: break-word;
  transition: color 0.2s ease;
}

.task-title:hover {
  color: var(--primary);
}

.task-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-top: 4px;
  line-height: 1.45;
  white-space: pre-line;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.task-card-container:hover .task-actions {
  opacity: 1;
}

.action-btn {
  padding: 6px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-subtle);
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.delete-btn:hover {
  background-color: var(--danger-light);
  color: var(--danger);
}

/* Subtasks Styling */
.subtasks-section {
  background-color: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.subtasks-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
}

.subtask-progress-bar {
  width: 90px;
  height: 5px;
  background-color: var(--border-subtle);
  border-radius: 99px;
  overflow: hidden;
}

.subtask-progress-fill {
  height: 100%;
  background-color: var(--primary);
  border-radius: 99px;
  transition: width 0.3s ease;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 3px 0;
}

.subtask-item.sub-completed .subtask-title {
  text-decoration: line-through;
  opacity: 0.6;
}

.mini-checkbox {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid var(--border-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.mini-checkbox.checked {
  background-color: var(--primary);
  border-color: var(--primary);
}

/* Footer Section */
.task-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--bg-subtle);
  padding: 3px 10px;
  border-radius: 99px;
}

.custom-tag {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 500;
}

.due-date-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--bg-subtle);
  padding: 4px 10px;
  border-radius: 99px;
}

.due-date-badge.overdue {
  background-color: var(--danger-light);
  color: var(--danger);
}
</style>
