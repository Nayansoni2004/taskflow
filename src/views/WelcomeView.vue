<script setup>
import { computed, ref } from 'vue'
import { CATEGORIES, useTaskStore } from '../stores/taskStore.js'
import { parseTaskInput } from '../services/smartParser.js'
import TaskCard from '../components/task/TaskCard.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

defineEmits(['add-task', 'edit-task', 'open-focus'])

const tasks = useTaskStore()
const quickText = ref('')

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
})

const stats = computed(() => [
  { label: 'Due Today', count: tasks.dueToday.filter(t => !t.completed).length, color: 'var(--primary)' },
  { label: 'Overdue', count: tasks.overdue.length, color: 'var(--red)' },
  { label: 'Pending', count: tasks.pending.length, color: 'var(--amber)' },
  { label: 'Completed', count: tasks.completed.length, color: 'var(--green)' }
])

const categoryCounts = computed(() => {
  const map = {}
  CATEGORIES.forEach(cat => {
    map[cat] = tasks.pending.filter(t => t.category?.toLowerCase() === cat.toLowerCase()).length
  })
  return map
})

function handleQuickAdd() {
  if (!quickText.value.trim()) return
  const parsed = parseTaskInput(quickText.value)
  tasks.createTask({
    title: parsed.title,
    dueDate: parsed.dueDate,
    priority: parsed.priority,
    subtasks: parsed.subtasks,
    category: 'Work'
  })
  quickText.value = ''
}
</script>

<template>
  <div class="page home-dashboard">
    <!-- Hero Greeting & Stats Overview -->
    <section class="dashboard-hero">
      <div>
        <span class="hero-date">{{ todayFormatted }}</span>
        <h1 class="hero-title">Focus & Get Things Done</h1>
      </div>

      <div class="hero-actions">
        <button class="focus-btn" @click="$emit('open-focus')">
          <SvgIcon name="clock" size="16" />
          <span>Start Focus Block</span>
        </button>

        <button class="primary-btn" @click="$emit('add-task')">
          <SvgIcon name="plus" size="16" color="#ffffff" />
          <span>New Task</span>
        </button>
      </div>
    </section>

    <!-- Quick Add Input -->
    <div class="quick-add-bar">
      <SvgIcon name="plus" size="18" color="var(--primary)" />
      <input
        v-model="quickText"
        placeholder="Quick add a task for today (press Enter)..."
        @keydown.enter.prevent="handleQuickAdd"
      />
      <button v-if="quickText.trim()" class="primary-btn" style="padding: 6px 14px; font-size: 13px;" @click="handleQuickAdd">
        Add
      </button>
    </div>

    <!-- 4 Stats Cards Grid -->
    <section class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <span class="stat-label">{{ s.label }}</span>
        <span class="stat-count" :style="{ color: s.color }">{{ s.count }}</span>
      </div>
    </section>

    <!-- 4 Categories Overview Tiles -->
    <section style="margin-bottom: 32px;">
      <h3 class="section-subtitle">Categories</h3>
      <div class="category-grid">
        <RouterLink
          v-for="cat in CATEGORIES"
          :key="cat"
          to="/tasks"
          class="category-card"
          :class="cat.toLowerCase()"
        >
          <div class="cat-header">
            <span class="category-pill" :class="cat.toLowerCase()">{{ cat }}</span>
            <span class="cat-count">{{ categoryCounts[cat] || 0 }} tasks</span>
          </div>
          <p class="cat-desc">
            {{ cat === 'Work' ? 'Engineering & Company tasks' : cat === 'Study' ? 'Academics & Courses' : cat === 'Personal' ? 'Health & Habits' : 'Builds & Side Hobbies' }}
          </p>
        </RouterLink>
      </div>
    </section>

    <!-- Today's Tasks Section -->
    <section>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <h3 class="section-subtitle">Today's Priorities</h3>
        <RouterLink to="/today" class="link-btn">View Today View →</RouterLink>
      </div>

      <div v-if="tasks.dueToday.length" class="task-list">
        <TaskCard
          v-for="task in tasks.dueToday.slice(0, 5)"
          :key="task.id"
          :task="task"
          @edit="$emit('edit-task', $event)"
        />
      </div>

      <div v-else class="empty-today-box">
        <p style="color: var(--text-muted); font-size: 14px;">No tasks due today. Take time to plan your next focus block!</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.hero-date {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-count {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  margin-top: 4px;
}

.section-subtitle {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 14px;
}

.category-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
}

.cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cat-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.cat-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

.link-btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}

.empty-today-box {
  background: var(--surface-2);
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  padding: 24px;
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard-hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .stats-grid, .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
