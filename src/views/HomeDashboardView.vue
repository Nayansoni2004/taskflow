<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import { useThemeStore } from '../stores/themeStore.js'
import TaskCard from '../components/task/TaskCard.vue'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  List, 
  LayoutGrid, 
  Filter, 
  SearchX,
  Sparkles,
  Layers
} from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'edit-task'])

const taskStore = useTaskStore()
const themeStore = useThemeStore()

// Greeting message based on local time
const greeting = computed(() => {
  const hr = new Date().getHours()
  if (hr < 12) return 'Good Morning'
  if (hr < 18) return 'Good Afternoon'
  return 'Good Evening'
})

// Statistics calculations
const stats = computed(() => {
  const total = taskStore.tasks.length
  const completed = taskStore.completed.length
  const pending = taskStore.pending.length
  const overdue = taskStore.overdue.length
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, completed, pending, overdue, rate }
})

// Filtered tasks logic
const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    // Search query filter
    if (themeStore.searchQuery.trim()) {
      const q = themeStore.searchQuery.toLowerCase()
      const matchTitle = task.title.toLowerCase().includes(q)
      const matchDesc = task.description?.toLowerCase().includes(q)
      const matchCat = task.category?.toLowerCase().includes(q)
      const matchTags = task.tags?.some(t => t.toLowerCase().includes(q))
      if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false
    }

    // Category filter
    if (themeStore.activeCategory !== 'all') {
      if (task.category?.toLowerCase() !== themeStore.activeCategory.toLowerCase()) {
        return false
      }
    }

    // Priority filter
    if (themeStore.activePriority !== 'all') {
      if (task.priority !== themeStore.activePriority) return false
    }

    // Status filter
    if (themeStore.activeStatus === 'pending') {
      if (task.completed) return false
    } else if (themeStore.activeStatus === 'completed') {
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
    <!-- Hero Greeting & Stats Banner -->
    <section class="dashboard-hero">
      <div class="hero-text-box">
        <h1 class="hero-greeting">
          {{ greeting }}, <span class="gradient-text">Productive Champ</span>! 👋
        </h1>
        <p class="hero-subtext">
          You have {{ stats.pending }} pending task{{ stats.pending === 1 ? '' : 's' }} today. Stay focused and keep moving forward!
        </p>
      </div>

      <!-- Quick Stats Widgets Grid -->
      <div class="stats-grid">
        <div class="stat-card glass-card">
          <div class="stat-icon-wrapper pending-icon">
            <Clock :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pending }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon-wrapper completed-icon">
            <CheckCircle2 :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.completed }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon-wrapper overdue-icon">
            <AlertTriangle :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.overdue }}</span>
            <span class="stat-label">Overdue</span>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon-wrapper rate-icon">
            <TrendingUp :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.rate }}%</span>
            <span class="stat-label">Efficiency</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Toolbar Filters & Layout Switcher -->
    <section class="toolbar-section">
      <div class="toolbar-left">
        <!-- Category Pills -->
        <div class="category-pills">
          <button 
            :class="['pill-btn', { active: themeStore.activeCategory === 'all' }]"
            @click="themeStore.activeCategory = 'all'"
          >
            All Tasks
          </button>
          <button 
            v-for="cat in taskStore.categories" 
            :key="cat"
            :class="['pill-btn', { active: themeStore.activeCategory === cat }]"
            @click="themeStore.activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- Status Filter Select -->
        <select v-model="themeStore.activeStatus" class="toolbar-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <!-- Priority Filter Select -->
        <select v-model="themeStore.activePriority" class="toolbar-select">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <!-- View Mode Switcher -->
        <div class="view-mode-toggle">
          <button 
            :class="['view-btn', { active: themeStore.viewMode === 'list' }]" 
            title="List View"
            @click="themeStore.viewMode = 'list'"
          >
            <List :size="18" />
          </button>
          <button 
            :class="['view-btn', { active: themeStore.viewMode === 'grid' }]" 
            title="Grid View"
            @click="themeStore.viewMode = 'grid'"
          >
            <LayoutGrid :size="18" />
          </button>
        </div>
      </div>
    </section>

    <!-- Task List / Grid Display -->
    <section class="tasks-content-section">
      <div 
        v-if="filteredTasks.length > 0" 
        :class="['tasks-layout', themeStore.viewMode === 'grid' ? 'grid-view' : 'list-view']"
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
          <SearchX :size="48" />
        </div>
        <h3 class="empty-title">No tasks found</h3>
        <p class="empty-desc">
          Try adjusting your search query or filters, or add a new task to get started!
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
.dashboard-hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.hero-text-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-greeting {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero-subtext {
  font-size: 1rem;
  color: var(--text-muted);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pending-icon {
  background-color: var(--primary-light);
  color: var(--primary);
}

.completed-icon {
  background-color: var(--success-light);
  color: var(--success);
}

.overdue-icon {
  background-color: var(--danger-light);
  color: var(--danger);
}

.rate-icon {
  background-color: var(--accent-light);
  color: var(--accent);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
}

.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
  background-color: var(--bg-surface-elevated);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
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
  box-shadow: 0 2px 8px var(--primary-glow);
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
  background-color: var(--bg-surface-elevated);
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
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
  background-color: var(--bg-surface-elevated);
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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  max-width: 400px;
  margin-bottom: 24px;
}
</style>
