<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { X, Play, Pause, RotateCcw, Sparkles, Coffee } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const mode = ref('focus') // 'focus' | 'break'
const timeLeft = ref(25 * 60) // 25 minutes
const isRunning = ref(false)
let timerId = null

const minutes = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  return m < 10 ? `0${m}` : `${m}`
})

const seconds = computed(() => {
  const s = timeLeft.value % 60
  return s < 10 ? `0${s}` : `${s}`
})

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  isRunning.value = true
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      pauseTimer()
      switchMode(mode.value === 'focus' ? 'break' : 'focus')
    }
  }, 1000)
}

function pauseTimer() {
  isRunning.value = false
  if (timerId) clearInterval(timerId)
}

function resetTimer() {
  pauseTimer()
  timeLeft.value = mode.value === 'focus' ? 25 * 60 : 5 * 60
}

function switchMode(newMode) {
  mode.value = newMode
  pauseTimer()
  timeLeft.value = newMode === 'focus' ? 25 * 60 : 5 * 60
}

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="focus-card animate-slide-up">
      <!-- Header -->
      <div class="focus-header">
        <div class="focus-title">
          <Sparkles :size="20" class="sparkle-icon" />
          <span>Focus Mode</span>
        </div>
        <button class="btn-icon btn-ghost" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <!-- Mode Selector -->
      <div class="mode-tabs">
        <button 
          :class="['mode-tab', { active: mode === 'focus' }]" 
          @click="switchMode('focus')"
        >
          <Sparkles :size="16" />
          Focus (25m)
        </button>
        <button 
          :class="['mode-tab', { active: mode === 'break' }]" 
          @click="switchMode('break')"
        >
          <Coffee :size="16" />
          Break (5m)
        </button>
      </div>

      <!-- Timer Display -->
      <div class="timer-display pulse-glow">
        <div class="time-text">{{ minutes }}:{{ seconds }}</div>
        <span class="timer-status">
          {{ isRunning ? (mode === 'focus' ? 'Deep Focus Session' : 'Relaxing Break') : 'Paused' }}
        </span>
      </div>

      <!-- Control Buttons -->
      <div class="timer-controls">
        <button class="btn btn-primary main-control-btn" @click="toggleTimer">
          <Pause v-if="isRunning" :size="22" />
          <Play v-else :size="22" />
          <span>{{ isRunning ? 'Pause' : 'Start Session' }}</span>
        </button>

        <button class="btn btn-secondary reset-btn" title="Reset Timer" @click="resetTimer">
          <RotateCcw :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.focus-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 420px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-shadow: var(--shadow-xl);
}

.focus-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.focus-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.sparkle-icon {
  color: var(--accent);
}

.mode-tabs {
  display: flex;
  background-color: var(--bg-subtle);
  padding: 4px;
  border-radius: 99px;
  width: 100%;
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 99px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab.active {
  background-color: var(--bg-surface-elevated);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.timer-display {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 4px solid var(--primary-light);
  background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.time-text {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
}

.timer-status {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-subtle);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timer-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.main-control-btn {
  flex: 1;
  padding: 12px;
  font-size: 1rem;
}

.reset-btn {
  padding: 12px;
}
</style>
