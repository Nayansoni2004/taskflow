<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore.js'
import { useThemeStore } from '../../stores/themeStore.js'
import { 
  CheckSquare, 
  Home, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Plus, 
  Sun, 
  Moon, 
  Clock, 
  FolderKanban,
  Briefcase,
  User,
  GraduationCap,
  Sparkles
} from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'open-focus'])

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const themeStore = useThemeStore()

const navItems = [
  { name: 'Home', path: '/', icon: Home, count: () => taskStore.pending.length },
  { name: 'Today', path: '/today', icon: Clock, count: () => taskStore.dueToday.length },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Completed', path: '/completed', icon: CheckCircle, count: () => taskStore.completed.length }
]

const categories = [
  { name: 'Work', icon: Briefcase, color: '#6366f1' },
  { name: 'Personal', icon: User, color: '#10b981' },
  { name: 'Study', icon: GraduationCap, color: '#f59e0b' },
  { name: 'Projects', icon: FolderKanban, color: '#8b5cf6' }
]

function getCategoryCount(catName) {
  return taskStore.tasks.filter(t => t.category?.toLowerCase() === catName.toLowerCase() && !t.completed).length
}

function selectCategory(catName) {
  if (themeStore.activeCategory === catName) {
    themeStore.activeCategory = 'all'
  } else {
    themeStore.activeCategory = catName
  }
  if (route.path !== '/') {
    router.push('/')
  }
}
</script>

<template>
  <aside class="sidebar-container">
    <!-- Brand Logo -->
    <div class="sidebar-brand">
      <div class="brand-icon-box">
        <CheckSquare :size="24" />
      </div>
      <div class="brand-text">
        <span class="brand-name">Task<span>Flow</span></span>
        <span class="brand-badge">Pro</span>
      </div>
    </div>

    <!-- Quick Action Button -->
    <div class="sidebar-action">
      <button class="btn btn-primary new-task-btn" @click="emit('add-task')">
        <Plus :size="20" />
        <span>New Task</span>
      </button>
    </div>

    <!-- Main Navigation Links -->
    <nav class="sidebar-nav">
      <div class="nav-section-title">Overview</div>
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: route.path === item.path }"
      >
        <component :is="item.icon" :size="20" class="nav-icon" />
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
        :class="{ active: themeStore.activeCategory === cat.name }"
        @click="selectCategory(cat.name)"
      >
        <div class="cat-left">
          <span class="cat-dot" :style="{ backgroundColor: cat.color }"></span>
          <component :is="cat.icon" :size="18" class="cat-icon" />
          <span class="cat-name">{{ cat.name }}</span>
        </div>
        <span class="cat-count">{{ getCategoryCount(cat.name) }}</span>
      </div>
    </nav>

    <!-- Sidebar Bottom Footer -->
    <div class="sidebar-footer">
      <button class="focus-timer-btn" @click="emit('open-focus')">
        <Sparkles :size="18" />
        <span>Focus Mode</span>
      </button>

      <div class="theme-toggle-wrapper">
        <button class="theme-btn" @click="themeStore.toggleTheme">
          <Sun v-if="themeStore.theme === 'dark'" :size="18" />
          <Moon v-else :size="18" />
          <span>{{ themeStore.theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
      </div>
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
  padding: 24px 16px;
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
  gap: 12px;
  padding: 0 8px 24px 8px;
  border-bottom: 1px solid var(--border-subtle);
}

.brand-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 12px var(--primary-glow);
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);

  span {
    color: var(--primary);
  }
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 99px;
  background-color: var(--primary-light);
  color: var(--primary);
  text-transform: uppercase;
}

.sidebar-action {
  margin: 20px 0;
}

.new-task-btn {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 16px 8px 8px 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.nav-link.active {
  background-color: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.nav-icon {
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background-color: var(--bg-subtle);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
}

.nav-link.active .nav-badge {
  background-color: var(--primary);
  color: #ffffff;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.88rem;
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
  font-weight: 600;
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
  gap: 10px;
}

.focus-timer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--accent-light) 0%, var(--primary-light) 100%);
  color: var(--accent);
  border: 1px solid rgba(139, 92, 246, 0.2);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.focus-timer-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface-elevated);
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}
</style>
