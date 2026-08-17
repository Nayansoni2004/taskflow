import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Theme state: 'dark' | 'light'
  const savedTheme = localStorage.getItem('taskflow_theme')
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = ref(savedTheme || (systemPrefersDark ? 'dark' : 'light'))

  // Splash screen state: shows once when the app starts
  const showSplash = ref(true)

  // Global search & filter state
  const searchQuery = ref('')
  const activeCategory = ref('all')
  const activePriority = ref('all')
  const activeStatus = ref('all')
  const viewMode = ref('list') // 'list' | 'grid'

  // Apply class to html / body element
  const applyTheme = (val) => {
    if (val === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initial call
  applyTheme(theme.value)

  watch(theme, (newVal) => {
    localStorage.setItem('taskflow_theme', newVal)
    applyTheme(newVal)
  })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function dismissSplash() {
    showSplash.value = false
  }

  function replaySplash() {
    showSplash.value = true
  }

  return {
    theme,
    showSplash,
    searchQuery,
    activeCategory,
    activePriority,
    activeStatus,
    viewMode,
    toggleTheme,
    dismissSplash,
    replaySplash
  }
})
