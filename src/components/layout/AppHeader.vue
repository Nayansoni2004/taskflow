<script setup>
defineProps({ title: String }); defineEmits(['menu','add','focus'])
</script>
<template><header class="app-header">
  <div class="header-title"><button class="icon-button mobile-menu" aria-label="Open navigation" @click="$emit('menu')">☰</button><div><span class="eyebrow">Workspace</span><h1>{{ title }}</h1></div></div>
  <div class="header-actions"><button class="focus-button" @click="$emit('focus')">Focus timer</button><button class="primary-button" @click="$emit('add')">Add task</button></div>
</header></template>
