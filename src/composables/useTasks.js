import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/taskStore.js'
export function useTasks() {
  const store = useTaskStore(), { tasks } = storeToRefs(store); const query = ref(''), sort = ref('dueDate'), filters = ref({ priority: '', status: '', projectId: '', tag: '' })
  const priorityRank = { urgent: 0, high: 1, medium: 2, low: 3 }
  const filtered = computed(() => [...tasks.value].filter(t => { const q = query.value.toLowerCase(); const matches = !q || [t.title, t.description, t.notes, ...(t.tags || [])].join(' ').toLowerCase().includes(q); return matches && (!filters.value.priority || t.priority === filters.value.priority) && (!filters.value.status || t.status === filters.value.status) && (!filters.value.projectId || t.projectId === filters.value.projectId) && (!filters.value.tag || t.tags?.includes(filters.value.tag)) }).sort((a, b) => sort.value === 'priority' ? priorityRank[a.priority] - priorityRank[b.priority] : sort.value === 'alphabetical' ? a.title.localeCompare(b.title) : String(a[sort.value] || '9999').localeCompare(String(b[sort.value] || '9999'))))
  return { query, sort, filters, filtered }
}
