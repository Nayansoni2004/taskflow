<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
defineProps({ title: String, wide: Boolean }); const emit = defineEmits(['close']); const panel = ref()
function key(e) { if (e.key === 'Escape') emit('close') }
onMounted(() => { addEventListener('keydown', key); panel.value?.focus() }); onUnmounted(() => removeEventListener('keydown', key))
</script>
<template><Teleport to="body"><div class="modal-backdrop" role="presentation" @mousedown.self="$emit('close')"><section ref="panel" class="modal" :class="{ wide }" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1"><header class="modal-header"><h2>{{ title }}</h2><button class="icon-button" aria-label="Close dialog" @click="$emit('close')">×</button></header><div class="modal-body"><slot /></div><footer v-if="$slots.footer" class="modal-footer"><slot name="footer" /></footer></section></div></Teleport></template>
