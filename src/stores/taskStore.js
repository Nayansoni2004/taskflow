import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { storageService, uid } from '../services/storageService.js'
const localDate = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toLocaleDateString('en-CA') }
const seed = () => [
  ['Build dashboard UI', 'urgent', 'in-progress', 0, 'project-1', ['vue', 'design']],
  ['Complete Vue fundamentals', 'high', 'todo', 0, 'project-3', ['learning']],
  ['Implement task persistence', 'medium', 'todo', 1, 'project-1', ['vue']],
  ['Review Spring Boot API', 'medium', 'todo', 3, 'project-3', ['backend']],
  ['Prepare interview questions', 'low', 'todo', 5, 'project-1', ['career']],
  ['Plan weekend hike', 'low', 'completed', -1, 'project-2', ['wellbeing']],
].map((x, i) => { const now = new Date().toISOString(); return { id: `task-${i + 1}`, title: x[0], description: i === 0 ? 'Create a responsive overview with useful, live metrics.' : '', completed: x[2] === 'completed', priority: x[1], status: x[2], dueDate: localDate(x[3]), dueTime: i < 2 ? ['10:30', '15:00'][i] : '', projectId: x[4], tags: x[5], subtasks: i === 0 ? [{ id: 'sub-1', title: 'Create layout', completed: true }, { id: 'sub-2', title: 'Connect live data', completed: false }] : [], notes: '', recurrence: null, createdAt: now, updatedAt: now, completedAt: x[2] === 'completed' ? now : null, demo: true } })
export const useTaskStore = defineStore('tasks', () => {
  const stored = storageService.read('tasks', null)
  const tasks = ref(Array.isArray(stored) ? stored : seed())
  const deleted = ref(new Map())
  const today = computed(() => localDate())
  const completed = computed(() => tasks.value.filter(t => t.completed))
  const pending = computed(() => tasks.value.filter(t => !t.completed && t.status !== 'archived'))
  const overdue = computed(() => pending.value.filter(t => t.dueDate && t.dueDate < today.value))
  const dueToday = computed(() => tasks.value.filter(t => t.dueDate === today.value))
  watch(tasks, value => storageService.write('tasks', value), { deep: true })
  const normalize = data => { const now = new Date().toISOString(); return { id: uid('task'), title: '', description: '', completed: false, priority: 'medium', status: 'todo', dueDate: '', dueTime: '', projectId: '', tags: [], subtasks: [], notes: '', recurrence: null, createdAt: now, updatedAt: now, completedAt: null, ...data } }
  function createTask(data) { const task = normalize(data); task.id ||= uid('task'); task.createdAt ||= new Date().toISOString(); task.updatedAt ||= task.createdAt; task.completed = task.status === 'completed' || Boolean(task.completed); task.completedAt = task.completed ? (task.completedAt || new Date().toISOString()) : null; tasks.value.unshift(task); return task }
  function updateTask(id, data) { const task = tasks.value.find(t => t.id === id); if (!task) return; Object.assign(task, data, { updatedAt: new Date().toISOString() }); task.completed = task.status === 'completed'; task.completedAt = task.completed ? (task.completedAt || new Date().toISOString()) : null; return task }
  function nextDate(date, recurrence) { const d = new Date(`${date || localDate()}T12:00:00`); if (recurrence.type === 'daily') d.setDate(d.getDate() + 1); else if (recurrence.type === 'weekdays') { do d.setDate(d.getDate() + 1); while ([0, 6].includes(d.getDay())) } else if (recurrence.type === 'weekly') d.setDate(d.getDate() + 7); else if (recurrence.type === 'monthly') d.setMonth(d.getMonth() + 1); else d.setDate(d.getDate() + Number(recurrence.interval || 1)); return d.toLocaleDateString('en-CA') }
  function toggleTask(id) { const task = tasks.value.find(t => t.id === id); if (!task) return; const becomingComplete = !task.completed; updateTask(id, { completed: becomingComplete, status: becomingComplete ? 'completed' : 'todo', completedAt: becomingComplete ? new Date().toISOString() : null }); if (becomingComplete && task.recurrence) { const exists = tasks.value.some(t => t.recurringParentId === task.id); if (!exists) createTask({ ...task, id: undefined, completed: false, status: 'todo', completedAt: null, dueDate: nextDate(task.dueDate, task.recurrence), recurringParentId: task.id, createdAt: undefined, updatedAt: undefined }) } }
  function deleteTask(id) { const index = tasks.value.findIndex(t => t.id === id); if (index < 0) return null; const [task] = tasks.value.splice(index, 1); deleted.value.set(id, { task, index }); setTimeout(() => deleted.value.delete(id), 6000); return task }
  function restoreTask(id) { const item = deleted.value.get(id); if (!item) return false; tasks.value.splice(item.index, 0, item.task); deleted.value.delete(id); return true }
  function addSubtask(id, title) { const task = tasks.value.find(t => t.id === id); if (task && title.trim()) task.subtasks.push({ id: uid('subtask'), title: title.trim(), completed: false }) }
  function replace(data) { tasks.value = Array.isArray(data) ? data : [] }
  return { tasks, today, completed, pending, overdue, dueToday, createTask, updateTask, toggleTask, deleteTask, restoreTask, addSubtask, replace }
})
