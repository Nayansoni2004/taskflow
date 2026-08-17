import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Global search & filter state
  const searchQuery = ref('')
  const activeCategory = ref('all')
  const activePriority = ref('all')
  const activeStatus = ref('all')
  const viewMode = ref('list') // 'list' | 'grid'

  // Push notifications state
  const pushNotificationPermission = ref(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  )
  const notificationsEnabled = ref(
    typeof window !== 'undefined' ? localStorage.getItem('notifications_enabled') === 'true' : false
  )

  function updateNotificationPermission(val) {
    pushNotificationPermission.value = val
  }

  function toggleNotificationsEnabled() {
    notificationsEnabled.value = !notificationsEnabled.value
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications_enabled', notificationsEnabled.value.toString())
    }
  }

  return {
    searchQuery,
    activeCategory,
    activePriority,
    activeStatus,
    viewMode,
    pushNotificationPermission,
    notificationsEnabled,
    updateNotificationPermission,
    toggleNotificationsEnabled
  }
})
