<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '../../stores/uiStore.js'
import { useFocusStore } from '../../stores/focusStore.js'
import { NotificationService } from '../../services/notificationService.js'
import { usePWAInstall } from '../../composables/usePWAInstall.js'
import { 
  Search, 
  Sparkles, 
  Plus, 
  CheckSquare,
  Bell,
  BellOff,
  Download,
  X
} from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'TaskFlow' }
})

const emit = defineEmits(['add-task', 'open-focus'])

const route = useRoute()
const uiStore = useUIStore()
const focusStore = useFocusStore()
const { promptInstall, isInstalled } = usePWAInstall()

const formattedDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

async function toggleNotifications() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    uiStore.updateNotificationPermission(Notification.permission)
  }

  if (uiStore.pushNotificationPermission !== 'granted') {
    const perm = await NotificationService.requestPermission()
    uiStore.updateNotificationPermission(perm)
    if (perm === 'granted') {
      if (!uiStore.notificationsEnabled) {
        uiStore.toggleNotificationsEnabled()
      }
      NotificationService.sendNotification('TaskFlow Alerts Enabled', {
        body: 'You will receive push notifications for scheduled tasks & meetings!'
      })
    }
  } else {
    uiStore.toggleNotificationsEnabled()
    if (uiStore.notificationsEnabled) {
      NotificationService.sendNotification('TaskFlow Alerts Enabled', {
        body: 'You will receive push notifications for scheduled tasks & meetings!'
      })
    }
  }
}

function clearSearch() {
  uiStore.searchQuery = ''
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Mobile Logo Header (No PRO Badge) -->
      <div :class="['mobile-logo-box', { 'show-desktop': route.path === '/' }]">
        <div class="mini-brand-icon">
          <CheckSquare :size="18" />
        </div>
        <span class="mini-brand-title">Task<span>Flow</span></span>
      </div>

      <!-- Page Title & Date Greeting -->
      <div v-if="route.path !== '/'" class="header-title-area">
        <h1 class="header-page-title">{{ title }}</h1>
        <span class="header-date-badge">{{ formattedDate }}</span>
      </div>

      <!-- Global Search Bar -->
      <div class="header-search-box">
        <Search :size="16" class="search-icon" />
        <input 
          v-model="uiStore.searchQuery"
          type="text" 
          placeholder="Search tasks or categories..." 
          class="search-input"
        />
        <button v-if="uiStore.searchQuery" class="clear-search-btn" @click="clearSearch">
          <X :size="14" />
        </button>
      </div>

      <!-- Header Action Items -->
      <div class="header-actions">
        <!-- Notification Toggle -->
        <button 
          :class="['header-icon-btn', { active: uiStore.pushNotificationPermission === 'granted' && uiStore.notificationsEnabled }]" 
          :title="uiStore.pushNotificationPermission === 'granted' && uiStore.notificationsEnabled ? 'Mute Notifications' : 'Unmute Notifications'"
          @click="toggleNotifications"
        >
          <Bell v-if="uiStore.pushNotificationPermission === 'granted' && uiStore.notificationsEnabled" :size="17" class="bell-active" />
          <BellOff v-else :size="17" />
          <span class="btn-text">
            {{ uiStore.pushNotificationPermission !== 'granted' ? 'Alerts' : (uiStore.notificationsEnabled ? 'Alerts: On' : 'Alerts: Off') }}
          </span>
        </button>

        <!-- Focus Timer Button -->
        <button 
          :class="['header-icon-btn', 'focus-btn', { active: focusStore.isRunning }]" 
          title="Focus Timer" 
          @click="emit('open-focus')"
        >
          <Sparkles :size="17" :class="{ 'bell-active': focusStore.isRunning }" />
          <span class="btn-text">Focus</span>
        </button>

        <!-- PWA Download Button -->
        <button v-if="!isInstalled" class="header-icon-btn pwa-btn" title="Install Offline App" @click="promptInstall">
          <Download :size="17" />
          <span class="btn-text">Install</span>
        </button>

        <!-- New Task Button -->
        <button class="btn btn-primary header-add-btn" @click="emit('add-task')">
          <Plus :size="17" />
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
}

.header-container {
  height: 100%;
  padding: 0 32px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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

.mobile-logo-box.show-desktop {
  display: flex;
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
  background-color: var(--accent-volt);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-brand-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--text-main);

  span {
    color: var(--text-muted);
  }
}

.header-title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 1024px) {
  .header-title-area {
    display: none;
  }
}

.header-page-title {
  font-size: 1.15rem;
  font-weight: 800;
}

.header-date-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  background-color: var(--bg-subtle);
  padding: 3px 9px;
  border-radius: 99px;
}

.header-search-box {
  flex: 1;
  max-width: 360px;
  position: relative;
  display: flex;
  align-items: center;
}

@media (max-width: 1024px) {
  .header-search-box {
    display: none;
  }
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-subtle);
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 36px;
  border-radius: 99px;
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-subtle);
  color: var(--text-main);
  font-size: 0.85rem;
  font-family: var(--font-sans);
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary);
  background-color: var(--bg-surface);
  box-shadow: 0 0 0 2px rgba(9, 9, 11, 0.1);
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
  gap: 8px;
}

.header-icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface);
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-icon-btn:hover {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.header-icon-btn.active {
  border-color: var(--accent-volt);
  background-color: var(--accent-volt-light);
  color: var(--text-main);
}

.bell-active {
  color: #84cc16;
}

.focus-btn {
  background-color: var(--bg-subtle);
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 12px;
  }
  .btn-text {
    display: none;
  }
  .header-icon-btn {
    padding: 8px;
  }
}

@media (max-width: 640px) {
  .header-add-btn {
    display: none;
  }
}
</style>
