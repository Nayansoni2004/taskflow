<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores/themeStore.js'
import { 
  Search, 
  Sun, 
  Moon, 
  Sparkles, 
  Plus, 
  CheckSquare,
  X
} from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'TaskFlow' }
})

const emit = defineEmits(['add-task', 'open-focus'])

const route = useRoute()
const themeStore = useThemeStore()

const formattedDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

function clearSearch() {
  themeStore.searchQuery = ''
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Mobile Logo Header -->
      <div class="mobile-logo-box">
        <div class="mini-brand-icon">
          <CheckSquare :size="20" />
        </div>
        <span class="mini-brand-title">Task<span>Flow</span></span>
      </div>

      <!-- Page Title & Date Greeting -->
      <div class="header-title-area">
        <h1 class="header-page-title">{{ title }}</h1>
        <span class="header-date-badge">{{ formattedDate }}</span>
      </div>

      <!-- Global Search Bar -->
      <div class="header-search-box">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="themeStore.searchQuery"
          type="text" 
          placeholder="Search tasks, tags, or categories..." 
          class="search-input"
        />
        <button v-if="themeStore.searchQuery" class="clear-search-btn" @click="clearSearch">
          <X :size="14" />
        </button>
      </div>

      <!-- Header Quick Actions -->
      <div class="header-actions">
        <!-- Focus Timer Button -->
        <button class="header-icon-btn focus-btn" title="Focus Timer" @click="emit('open-focus')">
          <Sparkles :size="18" />
          <span class="btn-text">Focus</span>
        </button>

        <!-- Dark/Light Theme Toggle -->
        <button class="header-icon-btn theme-toggle-btn" title="Toggle Theme" @click="themeStore.toggleTheme">
          <Sun v-if="themeStore.theme === 'dark'" :size="18" />
          <Moon v-else :size="18" />
        </button>

        <!-- New Task Button (Desktop/Tablet) -->
        <button class="btn btn-primary header-add-btn" @click="emit('add-task')">
          <Plus :size="18" />
          <span>Task</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 800;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-container {
  height: 100%;
  padding: 0 32px;
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
}

.mobile-logo-box {
  display: none;
  align-items: center;
  gap: 8px;
}

@media (max-width: 1024px) {
  .mobile-logo-box {
    display: flex;
  }
}

.mini-brand-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.mini-brand-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--text-main);

  span {
    color: var(--primary);
  }
}

.header-title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 1024px) {
  .header-title-area {
    display: none;
  }
}

.header-page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.header-date-badge {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-muted);
  background-color: var(--bg-subtle);
  padding: 3px 10px;
  border-radius: 99px;
}

.header-search-box {
  flex: 1;
  max-width: 420px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-subtle);
}

.search-input {
  width: 100%;
  padding: 9px 36px 9px 38px;
  border-radius: 99px;
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-subtle);
  color: var(--text-main);
  font-size: 0.88rem;
  font-family: var(--font-sans);
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary);
  background-color: var(--bg-surface-elevated);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--text-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface-elevated);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-icon-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.focus-btn {
  color: var(--accent);
  background-color: var(--accent-light);
  border-color: rgba(139, 92, 246, 0.2);
}

@media (max-width: 640px) {
  .btn-text {
    display: none;
  }
  .header-add-btn {
    display: none;
  }
}
</style>
