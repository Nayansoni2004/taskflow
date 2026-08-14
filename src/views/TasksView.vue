<script setup>
import { computed, onMounted } from 'vue';import { useRoute } from 'vue-router';import { useTasks } from '../composables/useTasks.js';import TaskList from '../components/task/TaskList.vue'
const emit=defineEmits(['add-task','edit-task']);const route=useRoute();const {query,filtered}=useTasks();const visible=computed(()=>filtered.value);onMounted(()=>{query.value=String(route.query.q||'')})
</script>
<template><div class="page simple-page"><section class="page-heading"><div><span class="eyebrow">Your list</span><h2>Tasks</h2><p>{{visible.length}} open items to keep track of.</p></div><button class="primary-button" @click="$emit('add-task')">Add task</button></section><section class="simple-search"><label>Search<input v-model="query" placeholder="Find a task"></label></section><TaskList :tasks="visible" empty-title="Nothing to do" empty-message="Add a task when something comes up." @add="$emit('add-task')" @edit="$emit('edit-task',$event)"/></div></template>
