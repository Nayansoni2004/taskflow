<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import TaskCard from '../components/task/TaskCard.vue'
import { Clock, Plus, CheckCircle2 } from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'edit-task'])
const taskStore = useTaskStore()

const todayTasks = computed(() => taskStore.dueToday)

function handleDelete(id) {
  taskStore.deleteTask(id)
}
</script>

<template>
  <div class="page-container">
    <div class="view-header">
      <div class="title-block">
        <div class="view-icon-badge">
          <Clock :size="24" />
        </div>
        <div>
          <h1 class="view-title">Today's Focus</h1>
          <p class="view-subtitle">Tasks scheduled for completion today.</p>
        </div>
      </div>

      <button class="btn btn-primary" @click="emit('add-task')">
        <Plus :size="18" />
        <span>Add Today's Task</span>
      </button>
    </div>

    <div v-if="todayTasks.length > 0" class="tasks-list">
      <TaskCard 
        v-for="task in todayTasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit-task', $event)"
        @delete="handleDelete"
      />
    </div>

    <div v-else class="empty-state">
      <CheckCircle2 :size="56" class="empty-icon" />
      <h3>No tasks due today</h3>
      <p>All caught up for today! Add a new task or take a well-deserved break.</p>
      <button class="btn btn-primary" @click="emit('add-task')">
        <Plus :size="18" />
        <span>Add Task</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
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
  background-color: var(--primary-light);
  color: var(--primary);
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
  color: var(--success);
}
</style>
