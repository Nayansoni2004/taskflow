<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import { useUIStore } from '../stores/uiStore.js'
import TaskCard from '../components/task/TaskCard.vue'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  List, 
  LayoutGrid, 
  SearchX,
  Sparkles
} from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'edit-task'])

const taskStore = useTaskStore()
const uiStore = useUIStore()

// Statistics calculations
const stats = computed(() => {
  const total = taskStore.tasks.length
  const completed = taskStore.completed.length
  const pending = taskStore.pending.length
  const overdue = taskStore.overdue.length
  return { total, completed, pending, overdue }
})

// Filtered tasks logic
const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    // Search query filter
    if (uiStore.searchQuery.trim()) {
      const q = uiStore.searchQuery.toLowerCase()
      const matchTitle = task.title.toLowerCase().includes(q)
      const matchDesc = task.description?.toLowerCase().includes(q)
      const matchCat = task.category?.toLowerCase().includes(q)
      const matchTags = task.tags?.some(t => t.toLowerCase().includes(q))
      if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false
    }

    // Category filter
    if (uiStore.activeCategory !== 'all') {
      if (task.category?.toLowerCase() !== uiStore.activeCategory.toLowerCase()) {
        return false
      }
    }

    // Priority filter
    if (uiStore.activePriority !== 'all') {
      if (task.priority !== uiStore.activePriority) return false
    }

    // Status filter
    if (uiStore.activeStatus === 'pending') {
      if (task.completed) return false
    } else if (uiStore.activeStatus === 'completed') {
      if (!task.completed) return false
    }

    return true
  })
})

function handleDeleteTask(id) {
  taskStore.deleteTask(id)
}
</script>

<template>
  <div class="page-container">
    <!-- Header Block -->
    <div class="view-header">
      <div class="header-left">
        <h1 class="view-title">Daily Tasks</h1>
        <p class="view-subtitle">Manage your daily work, subtasks, and deadlines.</p>
      </div>

      <button class="btn btn-primary" @click="emit('add-task')">
        <Plus :size="18" />
        <span>Add Task</span>
      </button>
    </div>

    <!-- Quick Stats Bar -->
    <div class="stats-bar">
      <div class="stat-pill">
        <span class="stat-count">{{ stats.pending }}</span>
        <span class="stat-name">Pending</span>
      </div>
      <div class="stat-pill">
        <span class="stat-count">{{ stats.completed }}</span>
        <span class="stat-name">Completed</span>
      </div>
      <div v-if="stats.overdue > 0" class="stat-pill overdue-pill">
        <span class="stat-count">{{ stats.overdue }}</span>
        <span class="stat-name">Overdue</span>
      </div>
    </div>

    <!-- Toolbar Filters & Category Pills -->
    <section class="toolbar-section">
      <div class="category-pills">
        <button 
          :class="['pill-btn', { active: uiStore.activeCategory === 'all' }]"
          @click="uiStore.activeCategory = 'all'"
        >
          All Tasks
        </button>
        <button 
          v-for="cat in taskStore.categories" 
          :key="cat"
          :class="['pill-btn', { active: uiStore.activeCategory === cat }]"
          @click="uiStore.activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="toolbar-right">
        <!-- Status Filter Select -->
        <select v-model="uiStore.activeStatus" class="toolbar-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <!-- Priority Filter Select -->
        <select v-model="uiStore.activePriority" class="toolbar-select">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <!-- View Switcher -->
        <div class="view-mode-toggle">
          <button 
            :class="['view-btn', { active: uiStore.viewMode === 'list' }]" 
            title="List View"
            @click="uiStore.viewMode = 'list'"
          >
            <List :size="17" />
          </button>
          <button 
            :class="['view-btn', { active: uiStore.viewMode === 'grid' }]" 
            title="Grid View"
            @click="uiStore.viewMode = 'grid'"
          >
            <LayoutGrid :size="17" />
          </button>
        </div>
      </div>
    </section>

    <!-- Task List / Grid Display -->
    <section class="tasks-content-section">
      <div 
        v-if="filteredTasks.length > 0" 
        :class="['tasks-layout', uiStore.viewMode === 'grid' ? 'grid-view' : 'list-view']"
      >
        <TaskCard 
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @edit="emit('edit-task', $event)"
          @delete="handleDeleteTask"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-box">
        <div class="empty-icon-wrapper">
          <SearchX :size="40" />
        </div>
        <h3 class="empty-title">No tasks found</h3>
        <p class="empty-desc">
          Try adjusting your search query or filters, or create a new task to get started!
        </p>
        <button class="btn btn-primary" @click="emit('add-task')">
          <Plus :size="18" />
          <span>Create New Task</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.view-title {
  font-size: 2rem;
  font-weight: 800;
}

.view-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.stats-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
  font-size: 0.85rem;
}

.stat-count {
  font-family: var(--font-display);
  font-weight: 800;
  color: var(--text-main);
}

.stat-name {
  color: var(--text-muted);
  font-weight: 600;
}

.overdue-pill {
  border-color: rgba(239, 68, 68, 0.3);
  background-color: var(--danger-light);
  .stat-count, .stat-name {
    color: var(--danger);
  }
}

/* Toolbar Controls */
.toolbar-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.pill-btn {
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.pill-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.pill-btn.active {
  background-color: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-select {
  padding: 6px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface);
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  font-weight: 500;
}

.view-mode-toggle {
  display: flex;
  background-color: var(--bg-subtle);
  padding: 3px;
  border-radius: var(--radius-md);
}

.view-btn {
  padding: 5px 8px;
  border: none;
  background: transparent;
  color: var(--text-subtle);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn.active {
  background-color: var(--bg-surface);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

/* Tasks Layout */
.tasks-layout.list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tasks-layout.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* Empty State */
.empty-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  background-color: var(--bg-surface);
  border: 1px dashed var(--border-medium);
  border-radius: var(--radius-xl);
}

.empty-icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--accent-volt-light);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 0.88rem;
  color: var(--text-muted);
  max-width: 380px;
  margin-bottom: 24px;
}
</style>
