<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import TaskCard from '../components/task/TaskCard.vue'
import { CheckCircle, Inbox } from 'lucide-vue-next'

const emit = defineEmits(['edit-task'])
const taskStore = useTaskStore()

const completedTasks = computed(() => taskStore.completed)

function handleDelete(id) {
  taskStore.deleteTask(id)
}
</script>

<template>
  <div class="page-container">
    <div class="view-header">
      <div class="title-block">
        <div class="view-icon-badge">
          <CheckCircle :size="24" />
        </div>
        <div>
          <h1 class="view-title">Completed Archive</h1>
          <p class="view-subtitle">Review your finished accomplishments.</p>
        </div>
      </div>
    </div>

    <div v-if="completedTasks.length > 0" class="tasks-list">
      <TaskCard 
        v-for="task in completedTasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit-task', $event)"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="empty-state">
      <Inbox :size="56" class="empty-icon" />
      <h3>No completed tasks yet</h3>
      <p>As you check off tasks, they will be archived here for easy reference.</p>
    </div>
  </div>
</template>

<style scoped>
.view-header {
  margin-bottom: 28px;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.view-icon-badge {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--success-light);
  color: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-title {
  font-size: 1.8rem;
  font-weight: 800;
}

.view-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-medium);
  border-radius: var(--radius-xl);
  gap: 12px;
}

.empty-icon {
  color: var(--text-subtle);
}
</style>
