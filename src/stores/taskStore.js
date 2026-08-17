import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { storageService, uid } from '../services/storageService.js'
import { playCompletionSound } from '../services/audioService.js'
import { NotificationService } from '../services/notificationService.js'

const localDate = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-CA')
}

export const CATEGORIES = ['Work', 'Study', 'Personal', 'Projects']

const seed = () => [
  ['Design modern TaskFlow interface', 'urgent', 'in-progress', 0, ['design', 'vue'], 'Create a sleek, clean, minimalist task view with micro-interactions and SVG vector icons.', 'Work'],
  ['Complete Machine Learning assignment', 'high', 'todo', 0, ['academics'], 'Finish regression model analysis and submit on portal.', 'Study'],
  ['Review focus timer settings', 'medium', 'todo', 1, ['focus'], 'Set up custom focus blocks with break reminders.', 'Projects'],
  ['30-minute evening workout & cardio', 'low', 'completed', -1, ['fitness'], 'Log workout routine and track daily steps.', 'Personal']
].map((x, i) => {
  const now = new Date().toISOString()
  return {
    id: `task-${i + 1}`,
    title: x[0],
    description: x[5] || '',
    completed: x[2] === 'completed',
    priority: x[1],
    status: x[2],
    category: x[6] || 'Work',
    dueDate: localDate(x[3]),
    dueTime: i === 0 ? '14:00' : '',
    reminderAt: '',
    reminderTriggered: false,
    tags: x[4] || [],
    subtasks: i === 0 ? [
      { id: 'sub-1', title: 'Refine typography & margins', completed: true },
      { id: 'sub-2', title: 'Add smooth checkmark animations', completed: false }
    ] : [],
    createdAt: now,
    updatedAt: now,
    completedAt: x[2] === 'completed' ? now : null
  }
})

export const useTaskStore = defineStore('tasks', () => {
  const stored = storageService.read('tasks', null)
  const tasks = ref(Array.isArray(stored) ? stored : seed())
  const deleted = ref(new Map())

  const today = computed(() => localDate())
  const completed = computed(() => tasks.value.filter(t => t.completed))
  const pending = computed(() => tasks.value.filter(t => !t.completed))
  const overdue = computed(() => pending.value.filter(t => t.dueDate && t.dueDate < today.value))
  const dueToday = computed(() => tasks.value.filter(t => t.dueDate === today.value))

  watch(tasks, value => storageService.write('tasks', value), { deep: true })

  // Periodically check for triggered reminders
  if (typeof window !== 'undefined') {
    setInterval(() => {
      NotificationService.checkReminders({ tasks: tasks.value, updateTask })
    }, 15000)
  }

  const normalize = data => {
    const now = new Date().toISOString()
    return {
      id: uid('task'),
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      category: 'Work',
      status: 'todo',
      dueDate: '',
      dueTime: '',
      reminderAt: '',
      reminderTriggered: false,
      tags: [],
      subtasks: [],
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      ...data
    }
  }

  function createTask(data) {
    const task = normalize(data)
    task.id ||= uid('task')
    task.createdAt ||= new Date().toISOString()
    task.updatedAt ||= task.createdAt
    task.completed = task.status === 'completed' || Boolean(task.completed)
    task.completedAt = task.completed ? (task.completedAt || new Date().toISOString()) : null
    tasks.value.unshift(task)
    return task
  }

  function updateTask(id, data) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    Object.assign(task, data, { updatedAt: new Date().toISOString() })
    task.completed = task.status === 'completed' || Boolean(task.completed)
    task.completedAt = task.completed ? (task.completedAt || new Date().toISOString()) : null
    return task
  }

  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    const becomingComplete = !task.completed
    if (becomingComplete) {
      playCompletionSound()
    }
    updateTask(id, {
      completed: becomingComplete,
      status: becomingComplete ? 'completed' : 'todo',
      completedAt: becomingComplete ? new Date().toISOString() : null
    })
  }

  function toggleSubtask(taskId, subtaskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task || !task.subtasks) return
    const subtask = task.subtasks.find(s => s.id === subtaskId)
    if (subtask) {
      subtask.completed = !subtask.completed
      task.updatedAt = new Date().toISOString()
    }
  }

  function addSubtask(taskId, title) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && title.trim()) {
      if (!Array.isArray(task.subtasks)) task.subtasks = []
      task.subtasks.push({ id: uid('subtask'), title: title.trim(), completed: false })
      task.updatedAt = new Date().toISOString()
    }
  }

  function removeSubtask(taskId, subtaskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && Array.isArray(task.subtasks)) {
      task.subtasks = task.subtasks.filter(s => s.id !== subtaskId)
      task.updatedAt = new Date().toISOString()
    }
  }

  function deleteTask(id) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index < 0) return null
    const [task] = tasks.value.splice(index, 1)
    deleted.value.set(id, { task, index })
    setTimeout(() => deleted.value.delete(id), 6000)
    return task
  }

  function restoreTask(id) {
    const item = deleted.value.get(id)
    if (!item) return false
    tasks.value.splice(item.index, 0, item.task)
    deleted.value.delete(id)
    return true
  }

  function replace(data) {
    tasks.value = Array.isArray(data) ? data : []
  }

  function getByCategory(cat) {
    return tasks.value.filter(t => t.category?.toLowerCase() === cat.toLowerCase())
  }

  return {
    tasks,
    today,
    completed,
    pending,
    overdue,
    dueToday,
    categories: CATEGORIES,
    createTask,
    updateTask,
    toggleTask,
    toggleSubtask,
    addSubtask,
    removeSubtask,
    deleteTask,
    restoreTask,
    replace,
    deleted,
    getByCategory
  }
})
