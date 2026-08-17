<script setup>
import { computed, ref } from 'vue'
import { CATEGORIES, useTaskStore } from '../stores/taskStore.js'
import { parseTaskInput } from '../services/smartParser.js'
import TaskList from '../components/task/TaskList.vue'
import SvgIcon from '../components/common/SvgIcon.vue'

defineEmits(['add-task', 'edit-task'])

const tasks = useTaskStore()
const quickText = ref('')
const searchQuery = ref('')
const selectedCategory = ref('All')

function handleQuickAdd() {
  if (!quickText.value.trim()) return
  const parsed = parseTaskInput(quickText.value)
  tasks.createTask({
    title: parsed.title,
    dueDate: parsed.dueDate,
    priority: parsed.priority,
    subtasks: parsed.subtasks,
    category: selectedCategory.value !== 'All' ? selectedCategory.value : 'Work'
  })
  quickText.value = ''
}

const filteredTasks = computed(() => {
  let list = tasks.pending

  if (selectedCategory.value !== 'All') {
    list = list.filter(t => t.category?.toLowerCase() === selectedCategory.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    )
  }

  return list
})
</script>

<template>
  <div class="page">
    <section class="page-heading">
      <div>
        <h2>Tasks</h2>
        <p>{{ filteredTasks.length }} tasks in {{ selectedCategory === 'All' ? 'all categories' : selectedCategory }}</p>
      </div>

      <button class="primary-btn" @click="$emit('add-task')">
        <SvgIcon name="plus" size="16" color="#ffffff" />
        <span>New Task</span>
      </button>
    </section>

    <!-- Quick Add Bar -->
    <div class="quick-add-bar">
      <SvgIcon name="plus" size="18" color="var(--primary)" />
      <input
        v-model="quickText"
        placeholder="Type a task and press Enter (e.g. Finish assignment tomorrow @high)..."
        @keydown.enter.prevent="handleQuickAdd"
      />
      <button v-if="quickText.trim()" class="primary-btn" style="padding: 6px 14px; font-size: 13px;" @click="handleQuickAdd">
        Add
      </button>
    </div>

    <!-- Category Filter Tabs & Search Bar -->
    <div class="filter-controls">
      <div class="category-tabs">
        <button
          class="cat-tab"
          :class="{ active: selectedCategory === 'All' }"
          @click="selectedCategory = 'All'"
        >
          All
        </button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          class="cat-tab"
          :class="[cat.toLowerCase(), { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="search-box">
        <SvgIcon name="search" size="16" color="var(--text-muted)" />
        <input
          v-model="searchQuery"
          placeholder="Search tasks, notes, tags..."
        />
      </div>
    </div>

    <TaskList
      :tasks="filteredTasks"
      empty-title="No tasks found"
      empty-message="No matching tasks in this category."
      @add="$emit('add-task')"
      @edit="$emit('edit-task', $event)"
    />
  </div>
</template>

<style scoped>
.filter-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cat-tab {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 99px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text-muted);
}

.cat-tab:hover {
  background: var(--surface-2);
  color: var(--text);
}

.cat-tab.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  min-width: 240px;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: var(--text);
  width: 100%;
}
</style>
