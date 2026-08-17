<script setup>
import { useRoute } from 'vue-router'
import { useTaskStore } from '../../stores/taskStore.js'
import { 
  Home, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Plus 
} from 'lucide-vue-next'

const emit = defineEmits(['add-task'])
const route = useRoute()
const taskStore = useTaskStore()

const mobileItems = [
  { name: 'Home', path: '/', icon: Home, count: () => taskStore.pending.length },
  { name: 'Today', path: '/today', icon: Clock, count: () => taskStore.dueToday.length },
  { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { name: 'Done', path: '/completed', icon: CheckCircle }
]
</script>

<template>
  <div class="mobile-nav-bar">
    <div class="mobile-nav-content">
      <router-link
        v-for="(item, index) in mobileItems.slice(0, 2)"
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
          <Plus :size="24" />
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
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 8px 12px;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  margin: 0 auto;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  color: var(--text-subtle);
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.mobile-nav-item.active {
  color: var(--primary);
  font-weight: 700;
}

.icon-wrapper {
  position: relative;
}

.mobile-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background-color: var(--primary);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 99px;
}

.fab-container {
  margin-top: -24px;
}

.fab-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px var(--primary-glow);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.fab-btn:active {
  transform: scale(0.92);
}
</style>
