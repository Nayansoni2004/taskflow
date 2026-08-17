<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'
import MobileNav from './components/layout/MobileNav.vue'
import TaskModal from './components/task/TaskModal.vue'
import FocusPanel from './components/common/FocusPanel.vue'
import ToastContainer from './components/common/ToastContainer.vue'
import { CheckSquare } from 'lucide-vue-next'

const route = useRoute()

const taskModalOpen = ref(false)
const editingTask = ref(null)
const focusOpen = ref(false)
const isLoading = ref(true)

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
  // Simple elegant loading animation on app startup
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div>
    <!-- Startup Loading Animation Screen -->
    <Transition name="fade">
      <div v-if="isLoading" class="startup-loader">
        <div class="loader-content">
          <div class="loader-logo">
            <CheckSquare :size="48" class="loader-icon" />
          </div>
          <h2 class="loader-title">TaskFlow</h2>
          <div class="loader-spinner-bar">
            <div class="spinner-progress"></div>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="!isLoading" class="app-shell">
      <!-- Desktop Left Navigation Sidebar - Hidden on Home Landing -->
      <AppSidebar v-if="route.path !== '/'" @add-task="openTask()" @open-focus="focusOpen = true" />

      <div :class="['main-content-wrapper', { 'full-width': route.path === '/' }]">
        <!-- Top Sticky Header -->
        <AppHeader :title="title" @add-task="openTask()" @open-focus="focusOpen = true" />

        <!-- Page Content Router View -->
        <main id="main-content">
          <RouterView @add-task="openTask" @edit-task="openTask" @open-focus="focusOpen = true" />
        </main>
      </div>

      <!-- Mobile Bottom Navigation Bar -->
      <MobileNav @add-task="openTask()" />

      <!-- Modals & Overlays -->
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

/* Startup Loader Screen Styles */
.startup-loader {
  position: fixed;
  inset: 0;
  background-color: #ffffff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.loader-logo {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  background-color: var(--accent-volt);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulseLogo 1.5s infinite ease-in-out;
}

.loader-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.03em;
}

.loader-spinner-bar {
  width: 120px;
  height: 4px;
  background-color: var(--border-subtle);
  border-radius: 2px;
  overflow: hidden;
}

.spinner-progress {
  height: 100%;
  width: 40%;
  background-color: var(--primary);
  border-radius: 2px;
  animation: loadingProgress 1.2s infinite ease-in-out;
}

@keyframes pulseLogo {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes loadingProgress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
