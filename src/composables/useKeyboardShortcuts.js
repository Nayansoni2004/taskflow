import { onMounted, onUnmounted } from 'vue'
export function useKeyboardShortcuts(actions) {
  const handler = e => {
    const tag = e.target?.tagName?.toLowerCase()
    if (['input', 'textarea', 'select'].includes(tag) || e.target?.isContentEditable) return
    if (e.key === 'n' && actions.newTask) { e.preventDefault(); actions.newTask() }
    if (e.key === '/' && actions.search) { e.preventDefault(); actions.search() }
    if (e.key === '?' && actions.help) actions.help()
    if (e.key === 'Escape' && actions.escape) actions.escape()
  }
  onMounted(() => addEventListener('keydown', handler)); onUnmounted(() => removeEventListener('keydown', handler))
}
