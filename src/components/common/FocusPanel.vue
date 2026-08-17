<script setup>
import { computed } from 'vue'
import { X, Play, Pause, RotateCcw, Sparkles, Coffee } from 'lucide-vue-next'
import { useFocusStore } from '../../stores/focusStore.js'

const emit = defineEmits(['close'])
const focusStore = useFocusStore()

const minutes = computed(() => {
  const m = Math.floor(focusStore.remainingSeconds / 60)
  return m < 10 ? `0${m}` : `${m}`
})

const seconds = computed(() => {
  const s = focusStore.remainingSeconds % 60
  return s < 10 ? `0${s}` : `${s}`
})

function toggleTimer() {
  focusStore.toggle()
}

function resetTimer() {
  focusStore.reset()
}

function switchMode(newMode) {
  const mins = newMode === 'focus' ? 25 : 5
  focusStore.setMode(newMode, mins)
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="focus-card flow-dark-card animate-slide-up">
      <!-- Header -->
      <div class="focus-header">
        <div class="focus-title">
          <div class="volt-icon-dot">
            <Sparkles :size="16" />
          </div>
          <span>Focus Timer</span>
        </div>
        <button class="btn-icon btn-ghost close-btn" @click="emit('close')">
          <X :size="20" />
        </button>
      </div>

      <!-- Mode Selector -->
      <div class="mode-tabs">
        <button 
          :class="['mode-tab', { active: focusStore.mode === 'focus' }]" 
          @click="switchMode('focus')"
        >
          <Sparkles :size="15" />
          Focus (25m)
        </button>
        <button 
          :class="['mode-tab', { active: focusStore.mode === 'shortBreak' }]" 
          @click="switchMode('shortBreak')"
        >
          <Coffee :size="15" />
          Break (5m)
        </button>
      </div>

      <!-- Timer Display -->
      <div class="timer-display">
        <div class="time-text">{{ minutes }}:{{ seconds }}</div>
        <span class="timer-status">
          {{ focusStore.isRunning ? (focusStore.mode === 'focus' ? 'Deep Focus Block' : 'Relaxing Break') : 'Ready' }}
        </span>
      </div>

      <!-- Control Buttons -->
      <div class="timer-controls">
        <button class="btn btn-volt main-control-btn" @click="toggleTimer">
          <Pause v-if="focusStore.isRunning" :size="20" />
          <Play v-else :size="20" />
          <span>{{ focusStore.isRunning ? 'Pause' : 'Start Session' }}</span>
        </button>

        <button class="btn btn-secondary reset-btn" title="Reset Timer" @click="resetTimer">
          <RotateCcw :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.focus-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
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
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffffff;
}

.volt-icon-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--accent-volt);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  color: #a1a1aa;
}

.close-btn:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.mode-tabs {
  display: flex;
  background-color: rgba(255, 255, 255, 0.08);
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
  color: #a1a1aa;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab.active {
  background-color: #ffffff;
  color: var(--text-main);
}

.timer-display {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid rgba(184, 240, 0, 0.3);
  background: radial-gradient(circle, rgba(184, 240, 0, 0.08) 0%, transparent 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.time-text {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
}

.timer-status {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-volt);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.timer-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.main-control-btn {
  flex: 1;
  padding: 12px;
  font-size: 0.95rem;
}

.reset-btn {
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.15);
}

.reset-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
