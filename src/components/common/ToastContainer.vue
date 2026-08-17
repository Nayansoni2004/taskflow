<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore.js'
import { RotateCcw, CheckCircle, Info } from 'lucide-vue-next'

const taskStore = useTaskStore()

const deletedList = computed(() => {
  if (!taskStore.deleted || typeof taskStore.deleted.entries !== 'function') return []
  return Array.from(taskStore.deleted.entries()).map(([id, data]) => ({
    id,
    task: data.task
  }))
})

function undo(id) {
  taskStore.restoreTask(id)
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast-fade">
      <div 
        v-for="item in deletedList" 
        :key="item.id" 
        class="toast-item"
      >
        <div class="toast-content">
          <Info :size="18" class="toast-icon" />
          <span>Task deleted</span>
        </div>
        <button class="undo-btn" @click="undo(item.id)">
          <RotateCcw :size="14" />
          <span>Undo</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 1024px) {
  .toast-container {
    bottom: 90px;
    right: 16px;
    left: 16px;
    align-items: center;
  }
}

.toast-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background-color: var(--text-main);
  color: var(--bg-app);
  padding: 12px 18px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: 0.88rem;
  font-weight: 500;
  min-width: 280px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast-icon {
  color: var(--primary);
}

.undo-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.undo-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
