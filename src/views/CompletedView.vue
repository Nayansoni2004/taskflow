<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore.js'
import TaskList from '../components/task/TaskList.vue'
const emit = defineEmits(['edit-task'])
const tasks = useTaskStore()
const completed = computed(() => [...tasks.completed].sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt))))
</script>

<template>
  <div class="page simple-page">
    <section class="page-heading"><div><span class="eyebrow">Progress</span><h2>Completed</h2><p>{{ completed.length }} tasks finished. Nice work.</p></div></section>
    <TaskList :tasks="completed" compact empty-title="No completed tasks yet" empty-message="Finish a task and it will show up here." @edit="$emit('edit-task', $event)" />
  </div>
</template>
