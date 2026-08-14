<script setup>
import { ref } from 'vue';import BaseModal from './BaseModal.vue';import { useSettingsStore } from '../../stores/settingsStore.js';import { useNotificationStore } from '../../stores/notificationStore.js';import { useFocusTimer } from '../../composables/useFocusTimer.js'
defineEmits(['close']);const settings=useSettingsStore(),notify=useNotificationStore(),minutes=ref(settings.settings.focusDuration)
const timer=useFocusTimer(()=>{settings.addFocusSession({id:`focus-${Date.now()}`,duration:minutes.value,completedAt:new Date().toISOString()});notify.success('Focus session complete. Take a short break.')}, minutes.value)
function start(){timer.start()}
</script>
<template><BaseModal title="Focus timer" @close="$emit('close')"><div class="focus-panel"><p>Set a small block of uninterrupted time.</p><div class="timer-display">{{timer.display}}</div><div class="timer-presets"><button v-for="m in [25, 5]" :key="m" :class="{active:minutes===m}" @click="minutes=m;timer.reset(m)">{{m}} min</button></div><div class="timer-actions"><button v-if="!timer.running" class="primary-button" @click="start">{{timer.remaining < timer.total ? 'Resume' : 'Start'}}</button><button v-else class="secondary-button" @click="timer.pause">Pause</button><button class="text-button" @click="timer.reset(minutes)">Reset</button></div></div></BaseModal></template>
