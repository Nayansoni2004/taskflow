<script setup>
import TaskCard from './TaskCard.vue'
import EmptyState from '../common/EmptyState.vue'

defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  compact: Boolean,
  emptyTitle: {
    type: String,
    default: 'No tasks found'
  },
  emptyMessage: {
    type: String,
    default: 'Add a new task to get started.'
  }
})

defineEmits(['add', 'edit'])
</script>

<template>
  <div>
    <TransitionGroup v-if="tasks.length" name="list" tag="div" class="task-list">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :compact="compact"
        @edit="$emit('edit', $event)"
      />
    </TransitionGroup>

    <EmptyState
      v-else
      :title="emptyTitle"
      :message="emptyMessage"
      @add="$emit('add')"
    />
  </div>
</template>
