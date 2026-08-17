<script setup>
import { useRoute } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore.js'
import { 
  Home, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  Plus 
} from 'lucide-vue-next'

const emit = defineEmits(['add-task'])
const route = useRoute()
const taskStore = useTaskStore()

const mobileItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Tasks', path: '/tasks', icon: CheckCircle, count: () => taskStore.pending.length },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon }
]
</script>

<template>
  <div class="mobile-nav-bar">
    <div class="mobile-nav-content">
      <router-link
        v-for="item in mobileItems.slice(0, 2)"
        :key="item.path"
        :to="item.path"
        class="mobile-nav-item"
        :class="{ active: route.path === item.path }"
      >
        <div class="icon-wrapper">
          <component :is="item.icon" :size="20" />
          <span v-if="item.count && item.count() > 0" class="mobile-badge">
            {{ item.count() }}
          </span>
        </div>
        <span class="mobile-label">{{ item.name }}</span>
      </router-link>

      <!-- Center FAB Button -->
      <div class="fab-container">
        <button class="fab-btn" @click="emit('add-task')" aria-label="Add Task">
          <Plus :size="22" />
        </button>
      </div>

      <router-link
        v-for="item in mobileItems.slice(2)"
        :key="item.path"
        :to="item.path"
        class="mobile-nav-item"
        :class="{ active: route.path === item.path }"
      >
        <div class="icon-wrapper">
          <component :is="item.icon" :size="20" />
        </div>
        <span class="mobile-label">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.mobile-nav-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 900;
  padding: 8px 16px 16px 16px;
  background: transparent;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .mobile-nav-bar {
    display: block;
  }
}

.mobile-nav-content {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: 8px 12px;
  box-shadow: var(--shadow-lg);
  max-width: 440px;
  margin: 0 auto;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--text-subtle);
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.mobile-nav-item.active {
  color: var(--primary);
  font-weight: 800;
}

.icon-wrapper {
  position: relative;
}

.mobile-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background-color: var(--accent-volt);
  color: var(--text-main);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 99px;
}

.fab-container {
  margin-top: -24px;
}

.fab-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--accent-volt);
  color: var(--text-main);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-volt);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.fab-btn:active {
  transform: scale(0.92);
}
</style>
