import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { storageService } from '../services/storageService.js'
const defaults = { theme: 'system', defaultPriority: 'medium', defaultView: 'list', focusDuration: 25, shortcuts: true, focusSessions: [] }
export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive({ ...defaults, ...storageService.read('settings', {}) })
  watch(settings, value => storageService.write('settings', value), { deep: true })
  function applyTheme() {
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }
  function setTheme(theme) { settings.theme = theme; applyTheme() }
  function addFocusSession(session) { settings.focusSessions.push(session) }
  function replace(data) { Object.assign(settings, defaults, data); applyTheme() }
  applyTheme()
  if (typeof matchMedia !== 'undefined') matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme)
  return { settings, setTheme, applyTheme, addFocusSession, replace }
})
