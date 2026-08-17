<script setup>
import { ref, watch, onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore.js'
import { 
  X, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  ListTodo, 
  Trash2, 
  Check 
} from 'lucide-vue-next'

const props = defineProps({
  task: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const taskStore = useTaskStore()

const title = ref('')
const description = ref('')
const priority = ref('medium')
const category = ref('Work')
const dueDate = ref('')
const dueTime = ref('')
const newSubtaskTitle = ref('')
const subtasks = ref([])
const newTagText = ref('')
const tags = ref([])

onMounted(() => {
  if (props.task) {
    title.value = props.task.title || ''
    description.value = props.task.description || ''
    priority.value = props.task.priority || 'medium'
    category.value = props.task.category || 'Work'
    dueDate.value = props.task.dueDate || ''
    dueTime.value = props.task.dueTime || ''
    subtasks.value = props.task.subtasks ? JSON.parse(JSON.stringify(props.task.subtasks)) : []
    tags.value = props.task.tags ? [...props.task.tags] : []
  }
})

function addSubtask() {
  if (newSubtaskTitle.value.trim()) {
    subtasks.value.push({
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.value.trim(),
      completed: false
    })
    newSubtaskTitle.value = ''
  }
}

function removeSubtask(index) {
  subtasks.value.splice(index, 1)
}

function addTag() {
  const tag = newTagText.value.trim().toLowerCase().replace(/#/g, '')
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    newTagText.value = ''
  }
}

function removeTag(tagToRemove) {
  tags.value = tags.value.filter(t => t !== tagToRemove)
}

function handleSave() {
  if (!title.value.trim()) return

  const payload = {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    category: category.value,
    dueDate: dueDate.value,
    dueTime: dueTime.value,
    subtasks: subtasks.value,
    tags: tags.value
  }

  if (props.task && props.task.id) {
    taskStore.updateTask(props.task.id, payload)
  } else {
    taskStore.createTask(payload)
  }

  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card animate-slide-up">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ task && task.id ? 'Edit Task' : 'Create New Task' }}
        </h2>
        <button class="btn-icon btn-ghost close-btn" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <!-- Modal Body Form -->
      <div class="modal-body">
        <!-- Title Input -->
        <div class="form-group">
          <label class="form-label">Task Title *</label>
          <input 
            v-model="title"
            type="text" 
            placeholder="What needs to be done?" 
            class="form-input title-input"
            autofocus
            @keyup.enter="handleSave"
          />
        </div>

        <!-- Description Input -->
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea 
            v-model="description"
            rows="3" 
            placeholder="Add extra context, links, or notes..." 
            class="form-input text-area"
          ></textarea>
        </div>

        <!-- Two Column Grid for Category & Priority -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select v-model="category" class="form-select">
              <option v-for="cat in taskStore.categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Priority</label>
            <select v-model="priority" class="form-select">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <!-- Due Date & Time Grid -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <CalendarIcon :size="14" />
              Due Date
            </label>
            <input v-model="dueDate" type="date" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Clock :size="14" />
              Due Time
            </label>
            <input v-model="dueTime" type="time" class="form-input" />
          </div>
        </div>

        <!-- Subtasks Checklist Builder -->
        <div class="form-group">
          <label class="form-label">
            <ListTodo :size="14" />
            Subtasks Checklist
          </label>
          
          <div class="subtask-input-box">
            <input 
              v-model="newSubtaskTitle"
              type="text" 
              placeholder="Add a step..." 
              class="form-input sub-input"
              @keyup.enter.prevent="addSubtask"
            />
            <button type="button" class="btn btn-secondary add-sub-btn" @click="addSubtask">
              <Plus :size="16" />
            </button>
          </div>

          <div v-if="subtasks.length > 0" class="modal-subtask-list">
            <div v-for="(sub, idx) in subtasks" :key="sub.id || idx" class="modal-subtask-item">
              <span>{{ sub.title }}</span>
              <button type="button" class="btn-icon btn-ghost del-sub-btn" @click="removeSubtask(idx)">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- Tags Input -->
        <div class="form-group">
          <label class="form-label">
            <Tag :size="14" />
            Tags
          </label>
          
          <div class="tags-input-box">
            <div v-for="tag in tags" :key="tag" class="tag-pill">
              #{{ tag }}
              <button type="button" class="remove-tag" @click="removeTag(tag)">×</button>
            </div>

            <input 
              v-model="newTagText"
              type="text" 
              placeholder="Add tag & press Enter..." 
              class="tag-input"
              @keyup.enter.prevent="addTag"
            />
          </div>
        </div>
      </div>

      <!-- Modal Footer Actions -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="emit('close')">Cancel</button>
        <button 
          type="button" 
          class="btn btn-primary" 
          :disabled="!title.trim()"
          @click="handleSave"
        >
          <Check :size="18" />
          <span>{{ task && task.id ? 'Save Changes' : 'Create Task' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 540px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-input, .form-select, .text-area {
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-subtle);
  color: var(--text-main);
  font-size: 0.9rem;
  font-family: var(--font-sans);
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus, .form-select:focus, .text-area:focus {
  border-color: var(--primary);
  background-color: var(--bg-surface-elevated);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.title-input {
  font-size: 1.05rem;
  font-weight: 600;
}

.subtask-input-box {
  display: flex;
  gap: 8px;
}

.sub-input {
  flex: 1;
}

.modal-subtask-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.modal-subtask-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--text-main);
}

.tags-input-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-subtle);
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: var(--primary-light);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 99px;
}

.remove-tag {
  background: transparent;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
}

.tag-input {
  flex: 1;
  min-width: 120px;
  border: none;
  background: transparent;
  color: var(--text-main);
  font-size: 0.88rem;
  outline: none;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
</style>
