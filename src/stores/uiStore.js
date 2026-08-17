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

  function updateNotificationPermission(val) {
    pushNotificationPermission.value = val
  }

  return {
    searchQuery,
    activeCategory,
    activePriority,
    activeStatus,
    viewMode,
    pushNotificationPermission,
    updateNotificationPermission
  }
})
