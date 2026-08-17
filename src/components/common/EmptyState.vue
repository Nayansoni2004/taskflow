<script setup>
import SvgIcon from './SvgIcon.vue'

defineProps({
  icon: { default: 'check' },
  title: String,
  message: String,
  action: { default: 'Add task' }
})

defineEmits(['add'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">
      <SvgIcon :name="icon" size="24" color="var(--primary)" />
    </div>
    <h3>{{ title }}</h3>
    <p style="max-width: 320px; margin: 6px auto 16px;">{{ message }}</p>
    <button v-if="action" class="secondary-btn" @click="$emit('add')">
      <SvgIcon name="plus" size="14" />
      <span>{{ action }}</span>
    </button>
  </div>
</template>
