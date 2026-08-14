<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'
import TaskModal from './components/task/TaskModal.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import FocusPanel from './components/common/FocusPanel.vue'
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts.js'
const route = useRoute(), taskModal = ref(false), editingTask = ref(null), mobileNav = ref(false), focusOpen = ref(false)
const title = computed(() => route.meta.title || 'TaskFlow')
function openTask(task = null, dueDate = '') { editingTask.value = task ? { ...task } : dueDate ? { dueDate } : null; taskModal.value = true }
function closeTask() { taskModal.value = false; editingTask.value = null }
useKeyboardShortcuts({ newTask: () => openTask(), escape: () => { closeTask(); focusOpen.value = false } })
</script>
<template>
  <div class="app-shell">
      <AppSidebar v-if="!route.meta.simple" :open="mobileNav" @close="mobileNav=false" @add="openTask()" />
    <div class="workspace" :class="{ 'simple-workspace': route.meta.simple }">
      <AppHeader v-if="!route.meta.simple" :title="title" @menu="mobileNav=true" @add="openTask()" @focus="focusOpen=true" />
      <main id="main-content"><RouterView @add-task="openTask" @edit-task="openTask" @open-focus="focusOpen=true" /></main>
    </div>
    <TaskModal v-if="taskModal" :task="editingTask" @close="closeTask" />
    <FocusPanel v-if="focusOpen" @close="focusOpen=false" />
    <ToastContainer />
  </div>
</template>
