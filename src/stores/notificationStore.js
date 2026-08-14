import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uid } from '../services/storageService.js'
export const useNotificationStore = defineStore('notifications', () => {
  const toasts = ref([])
  function remove(id) { toasts.value = toasts.value.filter(t => t.id !== id) }
  function push(message, type = 'info', options = {}) {
    const toast = { id: uid('toast'), message, type, action: options.action, actionLabel: options.actionLabel }
    toasts.value.push(toast); setTimeout(() => remove(toast.id), options.duration || 5000); return toast.id
  }
  return { toasts, push, remove, success: m => push(m, 'success'), error: m => push(m, 'error'), warning: m => push(m, 'warning'), info: m => push(m, 'info') }
})
