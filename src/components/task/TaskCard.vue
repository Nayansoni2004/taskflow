<script setup>
import { useTaskStore } from '../../stores/taskStore.js'
import { useNotificationStore } from '../../stores/notificationStore.js'
const props=defineProps({task:Object,compact:Boolean});const emit=defineEmits(['edit']);const tasks=useTaskStore(),notify=useNotificationStore()
function toggle(){tasks.toggleTask(props.task.id);notify.success(props.task.completed?'Task reopened':'Task completed')}
function remove(){const deleted=tasks.deleteTask(props.task.id);if(deleted)notify.push('Task deleted','warning',{actionLabel:'Undo',action:()=>tasks.restoreTask(deleted.id),duration:6000})}
</script>
<template><article class="task-card" :class="{done:task.completed,compact}" @click="$emit('edit',task)">
 <button class="task-check" :class="task.priority" :aria-label="task.completed?'Mark incomplete':'Mark complete'" @click.stop="toggle">{{task.completed?'✓':''}}</button>
 <div class="task-content"><div class="task-heading"><h3>{{task.title}}</h3></div>
  <div class="task-meta"><span v-if="task.dueDate">Due {{task.dueDate}}</span></div>
 </div><div class="task-actions"><button class="icon-button" aria-label="Edit task" @click.stop="$emit('edit',task)">Edit</button><button class="icon-button danger" aria-label="Delete task" @click.stop="remove">×</button></div>
</article></template>
