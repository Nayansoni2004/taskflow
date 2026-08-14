const PREFIX = 'taskflow:'
export const storageService = {
  read(key, fallback) {
    try { const value = localStorage.getItem(PREFIX + key); return value === null ? fallback : JSON.parse(value) }
    catch (error) { console.warn(`TaskFlow could not read ${key}`, error); return fallback }
  },
  write(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true }
    catch (error) { console.error(`TaskFlow could not save ${key}`, error); return false }
  },
  remove(key) { try { localStorage.removeItem(PREFIX + key) } catch (error) { console.error(error) } },
  clear() { Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k)) },
}
export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
