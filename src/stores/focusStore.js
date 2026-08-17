import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSettingsStore } from './settingsStore.js'
import { useNotificationStore } from './notificationStore.js'
import { playTimerEndSound } from '../services/audioService.js'
import { NotificationService } from '../services/notificationService.js'

export const useFocusStore = defineStore('focus', () => {
  const mode = ref('focus') // 'focus' | 'shortBreak' | 'longBreak' | 'custom'
  const durationMinutes = ref(25)
  const remainingSeconds = ref(25 * 60)
  const isRunning = ref(false)
  const activeTaskId = ref(null)
  let timerInterval = null

  const displayTime = computed(() => {
    const mins = Math.floor(remainingSeconds.value / 60)
    const secs = remainingSeconds.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  const progressPercent = computed(() => {
    const total = durationMinutes.value * 60
    if (total <= 0) return 0
    return Math.round(((total - remainingSeconds.value) / total) * 100)
  })

  function setDuration(minutes, newMode = 'focus') {
    const mins = Math.max(1, Math.min(360, Number(minutes) || 25))
    pause()
    mode.value = newMode
    durationMinutes.value = mins
    remainingSeconds.value = mins * 60
  }

  function setMode(newMode, minutes) {
    setDuration(minutes, newMode)
  }

  function start() {
    if (isRunning.value) return
    if (remainingSeconds.value <= 0) {
      remainingSeconds.value = durationMinutes.value * 60
    }
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (remainingSeconds.value <= 1) {
        remainingSeconds.value = 0
        pause()
        onTimerComplete()
      } else {
        remainingSeconds.value--
      }
    }, 1000)
  }

  function pause() {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function toggle() {
    if (isRunning.value) {
      pause()
    } else {
      start()
    }
  }

  function reset(minutes = durationMinutes.value) {
    setDuration(minutes, mode.value)
  }

  function onTimerComplete() {
    const settings = useSettingsStore()
    const notify = useNotificationStore()

    playTimerEndSound()

    if (mode.value === 'focus' || mode.value === 'custom') {
      settings.addFocusSession({
        id: `focus-${Date.now()}`,
        duration: durationMinutes.value,
        taskId: activeTaskId.value,
        completedAt: new Date().toISOString()
      })
      notify.success('Focus session complete! Time for a break.')
      NotificationService.sendNotification('Focus Session Complete', {
        body: `Great work! You completed a ${durationMinutes.value} minute focus block.`
      })
    } else {
      notify.success('Break finished! Ready to jump back in?')
      NotificationService.sendNotification('Break Completed', {
        body: 'Time to start your next focus block.'
      })
    }
  }

  return {
    mode,
    durationMinutes,
    remainingSeconds,
    isRunning,
    activeTaskId,
    displayTime,
    progressPercent,
    setMode,
    setDuration,
    start,
    pause,
    toggle,
    reset
  }
})
