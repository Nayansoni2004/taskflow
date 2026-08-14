<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import BaseModal from '../common/BaseModal.vue'
import { useTaskStore } from '../../stores/taskStore.js'
import { useSettingsStore } from '../../stores/settingsStore.js'
import { useNotificationStore } from '../../stores/notificationStore.js'
const props = defineProps({ task: Object }); const emit = defineEmits(['close']); const tasks=useTaskStore(), settings=useSettingsStore(), notify=useNotificationStore(), titleInput=ref(), error=ref('')
const form = reactive({ title:'', dueDate:'' })
const editing = computed(() => Boolean(props.task?.id))
onMounted(async()=>{ if(props.task) Object.assign(form, { title:props.task.title, dueDate:props.task.dueDate }); await nextTick(); titleInput.value?.focus() })
function submit(){ if(!form.title.trim()) { error.value='A task title is required.'; titleInput.value?.focus(); return } const data={title:form.title.trim(),dueDate:form.dueDate}; if(editing.value){tasks.updateTask(props.task.id,data);notify.success('Changes saved')}else{tasks.createTask({...data, priority:settings.settings.defaultPriority});notify.success('Task created')} emit('close') }
</script>
<template><BaseModal :title="editing?'Edit task':'Create a new task'" wide @close="$emit('close')"><form id="task-form" class="task-form" @submit.prevent="submit">
  <label class="field full"><span>Task title <b>*</b></span><input ref="titleInput" v-model="form.title" :aria-invalid="Boolean(error)" placeholder="What needs to get done?" @input="error=''"/><small v-if="error" class="field-error">{{ error }}</small></label>
  <label class="field full"><span>Due date <em>(optional)</em></span><input v-model="form.dueDate" type="date"></label>
 </form><template #footer><button class="text-button" @click="$emit('close')">Cancel</button><button class="primary-button" form="task-form">{{editing?'Save changes':'Create task'}}</button></template></BaseModal></template>
