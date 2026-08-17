<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/themeStore.js'
import SplashScreen from './components/common/SplashScreen.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'
import MobileNav from './components/layout/MobileNav.vue'
import TaskModal from './components/task/TaskModal.vue'
import FocusPanel from './components/common/FocusPanel.vue'
import ToastContainer from './components/common/ToastContainer.vue'

const route = useRoute()
const themeStore = useThemeStore()

const taskModalOpen = ref(false)
const editingTask = ref(null)
const focusOpen = ref(false)

const title = computed(() => route.meta.title || 'TaskFlow')

function openTask(task = null) {
  editingTask.value = task ? { ...task } : null
  taskModalOpen.value = true
}

function closeTask() {
  taskModalOpen.value = false
  editingTask.value = null
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    closeTask()
    focusOpen.value = false
  } else if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
    e.preventDefault()
    openTask()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div>
    <!-- Startup Animated Brand Splash Screen -->
    <SplashScreen 
      v-if="themeStore.showSplash" 
      @finish="themeStore.dismissSplash" 
    />

    <!-- Main Shell App -->
    <div class="app-shell">
      <!-- Desktop/Tablet Left Sidebar -->
      <AppSidebar @add-task="openTask()" @open-focus="focusOpen = true" />

      <div class="main-content-wrapper">
        <!-- Sticky Top Header -->
        <AppHeader :title="title" @add-task="openTask()" @open-focus="focusOpen = true" />

        <!-- Router View Page Content -->
        <main id="main-content">
          <RouterView @add-task="openTask" @edit-task="openTask" @open-focus="focusOpen = true" />
        </main>
      </div>

      <!-- Mobile Bottom Navigation Bar -->
      <MobileNav @add-task="openTask()" />

      <!-- Overlays & Modals -->
      <TaskModal v-if="taskModalOpen" :task="editingTask" @close="closeTask" />
      <FocusPanel v-if="focusOpen" @close="focusOpen = false" />
      <ToastContainer />
    </div>
  </div>
</template>

<style scoped>
#main-content {
  flex: 1;
}
</style>
