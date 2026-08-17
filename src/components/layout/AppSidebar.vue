<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore.js'
import { useUIStore } from '../../stores/uiStore.js'
import { 
  CheckSquare, 
  Home, 
  CheckCircle,
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  Briefcase,
  User,
  GraduationCap,
  FolderKanban,
  Download
} from 'lucide-vue-next'
import { usePWAInstall } from '../../composables/usePWAInstall.js'

const emit = defineEmits(['add-task', 'open-focus'])

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const uiStore = useUIStore()
const { promptInstall } = usePWAInstall()

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Daily Tasks', path: '/tasks', icon: CheckCircle, count: () => taskStore.pending.length },
  { name: 'Schedule Calendar', path: '/calendar', icon: CalendarIcon }
]

const categories = [
  { name: 'Work', icon: Briefcase, color: '#09090b' },
  { name: 'Personal', icon: User, color: '#b8f000' },
  { name: 'Study', icon: GraduationCap, color: '#8b5cf6' },
  { name: 'Projects', icon: FolderKanban, color: '#10b981' }
]

function getCategoryCount(catName) {
  return taskStore.tasks.filter(t => t.category?.toLowerCase() === catName.toLowerCase() && !t.completed).length
}

function selectCategory(catName) {
  if (uiStore.activeCategory === catName) {
    uiStore.activeCategory = 'all'
  } else {
    uiStore.activeCategory = catName
  }
  if (route.path !== '/tasks') {
    router.push('/tasks')
  }
}
</script>

<template>
  <aside class="sidebar-container">
    <!-- Brand Logo - Clean TaskFlow (No PRO label) -->
    <div class="sidebar-brand">
      <div class="brand-icon-box">
        <CheckSquare :size="22" />
      </div>
      <div class="brand-text">
        <span class="brand-name">Task<span>Flow</span></span>
      </div>
    </div>

    <!-- Quick Action Button -->
    <div class="sidebar-action">
      <button class="btn btn-primary new-task-btn" @click="emit('add-task')">
        <Plus :size="18" />
        <span>New Task</span>
      </button>
    </div>

    <!-- Main Navigation Links -->
    <nav class="sidebar-nav">
      <div class="nav-section-title">Navigation</div>
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: route.path === item.path }"
      >
        <component :is="item.icon" :size="19" class="nav-icon" />
        <span class="nav-label">{{ item.name }}</span>
        <span v-if="item.count && item.count() > 0" class="nav-badge">
          {{ item.count() }}
        </span>
      </router-link>

      <!-- Categories Section -->
      <div class="nav-section-title">Categories</div>
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="category-item"
        :class="{ active: uiStore.activeCategory === cat.name }"
        @click="selectCategory(cat.name)"
      >
        <div class="cat-left">
          <span class="cat-dot" :style="{ backgroundColor: cat.color }"></span>
          <component :is="cat.icon" :size="17" class="cat-icon" />
          <span class="cat-name">{{ cat.name }}</span>
        </div>
        <span class="cat-count">{{ getCategoryCount(cat.name) }}</span>
      </div>
    </nav>

    <!-- Sidebar Bottom Action -->
    <div class="sidebar-footer">
      <button class="focus-timer-btn" @click="emit('open-focus')">
        <Sparkles :size="18" />
        <span>Focus Timer</span>
      </button>

      <button class="pwa-download-btn" @click="promptInstall">
        <Download :size="16" />
        <span>Download App</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  z-index: 100;
  padding: 24px 18px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .sidebar-container {
    display: none;
  }
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px 20px 4px;
  border-bottom: 1px solid var(--border-subtle);
}

.brand-icon-box {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background-color: var(--accent-volt);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--accent-volt-light);
}

.brand-text {
  display: flex;
  align-items: center;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;

  span {
    color: var(--text-muted);
  }
}

.sidebar-action {
  margin: 18px 0;
}

.new-task-btn {
  width: 100%;
  padding: 11px;
  border-radius: var(--radius-full);
  font-size: 0.92rem;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section-title {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 16px 8px 8px 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.nav-link.active {
  background-color: var(--primary);
  color: #ffffff;
}

.nav-badge {
  background-color: var(--accent-volt);
  color: var(--text-main);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 99px;
  margin-left: auto;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.category-item.active {
  background-color: var(--bg-subtle);
  color: var(--primary);
  font-weight: 700;
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.cat-count {
  font-size: 0.75rem;
  color: var(--text-subtle);
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.focus-timer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-full);
  background-color: var(--accent-volt);
  color: var(--text-main);
  border: none;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-volt);
}

.focus-timer-btn:hover {
  transform: translateY(-1px);
}

.pwa-download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 9px;
  border-radius: var(--radius-full);
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pwa-download-btn:hover {
  background-color: var(--border-subtle);
}
</style>
