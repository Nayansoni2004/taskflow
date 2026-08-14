<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
const emit = defineEmits(['add-task', 'open-focus'])
const tasks = useTaskStore()
const openTasks = computed(() => tasks.pending.length)
</script>

<template>
  <div class="welcome-screen">
    <div class="welcome-brand"><span>✓</span> TaskFlow</div>
    <section class="welcome-card">
      <p class="eyebrow">A simpler way to plan</p>
      <h1>Make space for<br>what matters.</h1>
      <p>Keep today clear, capture what needs doing, and focus on one task at a time.</p>
      <div class="welcome-actions">
        <button class="primary-button" @click="$emit('add-task')">Add a task</button>
        <RouterLink class="secondary-button" to="/tasks">View my tasks</RouterLink>
      </div>
      <small>{{ openTasks }} open {{ openTasks === 1 ? 'task' : 'tasks' }}</small>
    </section>
    <button class="welcome-focus" @click="$emit('open-focus')">Start a focus timer →</button>
  </div>
</template>
