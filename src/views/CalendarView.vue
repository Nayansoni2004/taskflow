<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import TaskCard from '../components/task/TaskCard.vue'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Inbox
} from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'edit-task'])
const taskStore = useTaskStore()

// State for active date
const selectedDate = ref(new Date().toLocaleDateString('en-CA')) // YYYY-MM-DD
const currentWeekStart = ref(getWeekStartDate(new Date()))

function getWeekStartDate(d) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
  return new Date(date.setDate(diff))
}

// Generate 7 days for the current week strip
const weekDaysList = computed(() => {
  const days = []
  const start = new Date(currentWeekStart.value)

  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dateStr = d.toLocaleDateString('en-CA')
    const dayNum = d.getDate()
    const weekName = d.toLocaleDateString('en-US', { weekday: 'short' })
    const isToday = dateStr === new Date().toLocaleDateString('en-CA')
    const hasTasks = taskStore.tasks.some(t => t.dueDate === dateStr)

    days.push({ dateStr, dayNum, weekName, isToday, hasTasks })
  }
  return days
})

const formattedSelectedDate = computed(() => {
  const [y, m, d] = selectedDate.value.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
})

const selectedDateTasks = computed(() => {
  return taskStore.tasks.filter(t => t.dueDate === selectedDate.value)
})

function prevWeek() {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() - 7)
  currentWeekStart.value = d
}

function nextWeek() {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() + 7)
  currentWeekStart.value = d
}

function resetToToday() {
  const today = new Date()
  currentWeekStart.value = getWeekStartDate(today)
  selectedDate.value = today.toLocaleDateString('en-CA')
}

function handleDeleteTask(id) {
  taskStore.deleteTask(id)
}
</script>

<template>
  <div class="page-container calendar-page">
    <!-- Header Block -->
    <div class="calendar-top-bar">
      <div>
        <h1 class="view-title">Schedule Agenda</h1>
        <p class="view-subtitle">Weekly date strip & task timeline.</p>
      </div>

      <div class="nav-controls">
        <button class="btn btn-secondary nav-btn" @click="prevWeek">
          <ChevronLeft :size="18" />
        </button>
        <button class="btn btn-secondary today-btn" @click="resetToToday">
          Today
        </button>
        <button class="btn btn-secondary nav-btn" @click="nextWeek">
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>

    <!-- Mobile-Friendly 7-Day Date Strip -->
    <div class="date-strip-container flow-card">
      <div class="date-strip-scroll">
        <div 
          v-for="item in weekDaysList" 
          :key="item.dateStr"
          :class="['date-pill', { active: selectedDate === item.dateStr, today: item.isToday }]"
          @click="selectedDate = item.dateStr"
        >
          <span class="day-name">{{ item.weekName }}</span>
          <span class="day-number">{{ item.dayNum }}</span>
          <span v-if="item.hasTasks" class="task-dot"></span>
        </div>
      </div>
    </div>

    <!-- Selected Date Banner -->
    <div class="selected-date-header">
      <div class="date-info">
        <h2 class="date-title">{{ formattedSelectedDate }}</h2>
        <span class="task-count-badge">
          {{ selectedDateTasks.length }} task{{ selectedDateTasks.length === 1 ? '' : 's' }}
        </span>
      </div>

      <button class="btn btn-primary add-date-task-btn" @click="emit('add-task', { dueDate: selectedDate })">
        <Plus :size="17" />
        <span>Add for Date</span>
      </button>
    </div>

    <!-- Agenda Task List for Selected Date -->
    <section class="agenda-section">
      <div v-if="selectedDateTasks.length > 0" class="agenda-list">
        <TaskCard 
          v-for="task in selectedDateTasks"
          :key="task.id"
          :task="task"
          @edit="emit('edit-task', $event)"
          @delete="handleDeleteTask"
        />
      </div>

      <!-- Empty State for Selected Date -->
      <div v-else class="empty-date-state flow-card">
        <div class="empty-icon-circle">
          <Inbox :size="36" />
        </div>
        <h3>No tasks scheduled</h3>
        <p>Your agenda is clear for {{ formattedSelectedDate }}.</p>
        <button class="btn btn-primary" @click="emit('add-task', { dueDate: selectedDate })">
          <Plus :size="17" />
          <span>Add Task</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.calendar-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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

.nav-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  padding: 8px 12px;
  border-radius: var(--radius-full);
}

.today-btn {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
}

/* Date Strip Component */
.date-strip-container {
  padding: 14px 18px;
}

.date-strip-scroll {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  overflow-x: auto;
}

.date-pill {
  flex: 1;
  min-width: 60px;
  padding: 12px 8px;
  border-radius: var(--radius-md);
  background-color: var(--bg-subtle);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.date-pill:hover {
  background-color: var(--border-subtle);
}

.date-pill.active {
  background-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(9, 9, 11, 0.25);
}

.day-name {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.day-number {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
}

.task-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--accent-volt);
  margin-top: 2px;
}

.date-pill.active .task-dot {
  background-color: var(--accent-volt);
}

/* Selected Date Section */
.selected-date-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-title {
  font-size: 1.25rem;
  font-weight: 800;
}

.task-count-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-main);
  background-color: var(--accent-volt-light);
  padding: 3px 10px;
  border-radius: 99px;
}

.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-date-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 20px;
  gap: 12px;
}

.empty-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--bg-subtle);
  color: var(--text-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
