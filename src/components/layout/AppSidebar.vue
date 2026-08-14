<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore.js'
import { useSettingsStore } from '../../stores/settingsStore.js'

defineProps({ open: Boolean })
defineEmits(['close', 'add'])

const tasks = useTaskStore()
const settings = useSettingsStore()
const nav = [
  ['/','H','Home'], ['/tasks','T','My tasks'], ['/today','D','Today'], ['/completed','✓','Completed']
]
const completion = computed(() => tasks.tasks.length ? Math.round(tasks.completed.length / tasks.tasks.length * 100) : 0)
function toggleTheme() { settings.setTheme(settings.settings.theme === 'dark' ? 'light' : 'dark') }
</script>

<template>
  <div v-if="open" class="sidebar-scrim" @click="$emit('close')"></div>
  <aside class="sidebar" :class="{ open }" aria-label="Primary navigation">
    <RouterLink to="/" class="brand" @click="$emit('close')"><span class="brand-mark">✓</span><span>TaskFlow</span></RouterLink>
    <button class="sidebar-add" @click="$emit('add'); $emit('close')"><span>+</span> New task</button>
    <p class="sidebar-label">Workspace</p>
    <nav class="main-nav">
      <RouterLink v-for="item in nav" :key="item[0]" :to="item[0]" @click="$emit('close')"><span class="nav-glyph">{{ item[1] }}</span><span>{{ item[2] }}</span><small v-if="item[0] === '/today'">{{ tasks.dueToday.filter(t => !t.completed).length }}</small></RouterLink>
    </nav>
    <section class="sidebar-progress"><div><span>Weekly progress</span><b>{{ completion }}%</b></div><div class="sidebar-progress-track"><i :style="{ width: completion + '%' }"></i></div><p>{{ tasks.completed.length }} of {{ tasks.tasks.length }} tasks complete</p></section>
    <div class="sidebar-footer">
      <button class="sidebar-theme" @click="toggleTheme"><span>{{ settings.settings.theme === 'dark' ? '☀' : '◐' }}</span>{{ settings.settings.theme === 'dark' ? 'Light mode' : 'Dark mode' }}</button>
      <p class="sidebar-note">Keep moving, one task at a time.</p>
    </div>
  </aside>
</template>
