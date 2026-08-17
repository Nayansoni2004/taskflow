<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 18
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  }
})

const iconSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="iconSize"
    :height="iconSize"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="svg-icon"
  >
    <!-- Home -->
    <path v-if="name === 'home'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline v-if="name === 'home'" points="9 22 9 12 15 12 15 22"></polyline>

    <!-- Calendar -->
    <rect v-if="name === 'calendar' || name === 'today'" x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line v-if="name === 'calendar' || name === 'today'" x1="16" y1="2" x2="16" y2="6"></line>
    <line v-if="name === 'calendar' || name === 'today'" x1="8" y1="2" x2="8" y2="6"></line>
    <line v-if="name === 'calendar' || name === 'today'" x1="3" y1="10" x2="21" y2="10"></line>

    <!-- Tasks / List -->
    <line v-if="name === 'tasks' || name === 'list'" x1="8" y1="6" x2="21" y2="6"></line>
    <line v-if="name === 'tasks' || name === 'list'" x1="8" y1="12" x2="21" y2="12"></line>
    <line v-if="name === 'tasks' || name === 'list'" x1="8" y1="18" x2="21" y2="18"></line>
    <line v-if="name === 'tasks' || name === 'list'" x1="3" y1="6" x2="3.01" y2="6"></line>
    <line v-if="name === 'tasks' || name === 'list'" x1="3" y1="12" x2="3.01" y2="12"></line>
    <line v-if="name === 'tasks' || name === 'list'" x1="3" y1="18" x2="3.01" y2="18"></line>

    <!-- Check / Check Square -->
    <polyline v-if="name === 'check'" points="20 6 9 17 4 12"></polyline>
    <polyline v-if="name === 'check-square'" points="9 11 12 14 22 4"></polyline>
    <path v-if="name === 'check-square'" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>

    <!-- Clock / Timer -->
    <circle v-if="name === 'clock' || name === 'timer'" cx="12" cy="12" r="10"></circle>
    <polyline v-if="name === 'clock' || name === 'timer'" points="12 6 12 12 16 14"></polyline>

    <!-- Bell / Reminder -->
    <path v-if="name === 'bell' || name === 'reminder'" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path v-if="name === 'bell' || name === 'reminder'" d="M13.73 21a2 2 0 0 1-3.46 0"></path>

    <!-- Sun -->
    <circle v-if="name === 'sun'" cx="12" cy="12" r="5"></circle>
    <line v-if="name === 'sun'" x1="12" y1="1" x2="12" y2="3"></line>
    <line v-if="name === 'sun'" x1="12" y1="21" x2="12" y2="23"></line>
    <line v-if="name === 'sun'" x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line v-if="name === 'sun'" x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line v-if="name === 'sun'" x1="1" y1="12" x2="3" y2="12"></line>
    <line v-if="name === 'sun'" x1="21" y1="12" x2="23" y2="12"></line>
    <line v-if="name === 'sun'" x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line v-if="name === 'sun'" x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>

    <!-- Moon -->
    <path v-if="name === 'moon'" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>

    <!-- Plus -->
    <line v-if="name === 'plus'" x1="12" y1="5" x2="12" y2="19"></line>
    <line v-if="name === 'plus'" x1="5" y1="12" x2="19" y2="12"></line>

    <!-- Search -->
    <circle v-if="name === 'search'" cx="11" cy="11" r="8"></circle>
    <line v-if="name === 'search'" x1="21" y1="21" x2="16.65" y2="16.65"></line>

    <!-- Edit / Pencil -->
    <path v-if="name === 'edit'" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path v-if="name === 'edit'" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>

    <!-- Trash -->
    <polyline v-if="name === 'trash'" points="3 6 5 6 21 6"></polyline>
    <path v-if="name === 'trash'" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>

    <!-- Chevron Left -->
    <polyline v-if="name === 'chevron-left'" points="15 18 9 12 15 6"></polyline>

    <!-- Chevron Right -->
    <polyline v-if="name === 'chevron-right'" points="9 18 15 12 9 6"></polyline>

    <!-- File Text / Notes -->
    <path v-if="name === 'file-text' || name === 'notes'" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline v-if="name === 'file-text' || name === 'notes'" points="14 2 14 8 20 8"></polyline>
    <line v-if="name === 'file-text' || name === 'notes'" x1="16" y1="13" x2="8" y2="13"></line>
    <line v-if="name === 'file-text' || name === 'notes'" x1="16" y1="17" x2="8" y2="17"></line>
    <line v-if="name === 'file-text' || name === 'notes'" x1="10" y1="9" x2="8" y2="9"></line>

    <!-- X / Close -->
    <line v-if="name === 'x' || name === 'close'" x1="18" y1="6" x2="6" y2="18"></line>
    <line v-if="name === 'x' || name === 'close'" x1="6" y1="6" x2="18" y2="18"></line>

    <!-- Menu -->
    <line v-if="name === 'menu'" x1="3" y1="12" x2="21" y2="12"></line>
    <line v-if="name === 'menu'" x1="3" y1="6" x2="21" y2="6"></line>
    <line v-if="name === 'menu'" x1="3" y1="18" x2="21" y2="18"></line>

    <!-- Tag -->
    <path v-if="name === 'tag'" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line v-if="name === 'tag'" x1="7" y1="7" x2="7.01" y2="7"></line>

    <!-- Alert / Warning -->
    <path v-if="name === 'alert'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line v-if="name === 'alert'" x1="12" y1="9" x2="12" y2="13"></line>
    <line v-if="name === 'alert'" x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
</template>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
