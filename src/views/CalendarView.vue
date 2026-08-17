<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'edit-task'])
const taskStore = useTaskStore()

const currentDate = ref(new Date())

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysCount = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, dateStr: null })
  }
  for (let d = 1; d <= daysCount; d++) {
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(d).padStart(2, '0')
    const dateStr = `${year}-${monthStr}-${dayStr}`
    days.push({ day: d, dateStr })
  }
  return days
})

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function getTasksForDate(dateStr) {
  if (!dateStr) return []
  return taskStore.tasks.filter(t => t.dueDate === dateStr)
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
</script>

<template>
  <div class="page-container">
    <div class="calendar-header-bar">
      <div class="title-block">
        <div class="view-icon-badge">
          <CalendarIcon :size="24" />
        </div>
        <div>
          <h1 class="view-title">Schedule Calendar</h1>
          <p class="view-subtitle">Visualize tasks across dates.</p>
        </div>
      </div>

      <div class="calendar-nav-controls">
        <button class="nav-arrow-btn" @click="prevMonth">
          <ChevronLeft :size="20" />
        </button>
        <span class="month-title">{{ currentMonthYear }}</span>
        <button class="nav-arrow-btn" @click="nextMonth">
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid Card -->
    <div class="calendar-card glass-card">
      <div class="weekday-header">
        <div v-for="wd in weekDays" :key="wd" class="weekday-cell">{{ wd }}</div>
      </div>

      <div class="calendar-grid">
        <div 
          v-for="(cell, index) in daysInMonth" 
          :key="index" 
          :class="['day-cell', { empty: !cell.day }]"
        >
          <div v-if="cell.day" class="day-cell-content">
            <span class="day-number">{{ cell.day }}</span>
            <div class="day-tasks-list">
              <div 
                v-for="task in getTasksForDate(cell.dateStr)" 
                :key="task.id"
                :class="['mini-task-pill', { completed: task.completed }]"
                @click="emit('edit-task', task)"
              >
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-header-bar {
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
  background-color: var(--accent-light);
  color: var(--accent);
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

.calendar-nav-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: var(--bg-surface-elevated);
  padding: 6px 16px;
  border-radius: 99px;
  border: 1px solid var(--border-subtle);
}

.month-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 150px;
  text-align: center;
}

.nav-arrow-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.nav-arrow-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.calendar-card {
  padding: 20px;
  overflow-x: auto;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 12px;
  text-align: center;
}

.weekday-cell {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  min-height: 100px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.day-cell.empty {
  background-color: transparent;
  border-color: transparent;
}

.day-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.day-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.mini-task-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  background-color: var(--primary-light);
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.mini-task-pill.completed {
  opacity: 0.5;
  text-decoration: line-through;
  background-color: var(--bg-subtle);
  color: var(--text-subtle);
}
</style>
