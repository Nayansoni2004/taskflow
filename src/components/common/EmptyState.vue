<script setup>defineProps({ icon:{default:'✓'}, title:String, message:String, action:{default:'Add task'} });defineEmits(['action'])</script>
<template><div class="empty-state"><div class="empty-icon">{{ icon }}</div><h3>{{ title }}</h3><p>{{ message }}</p><button v-if="action" class="secondary-button" @click="$emit('action')">＋ {{ action }}</button></div></template>
