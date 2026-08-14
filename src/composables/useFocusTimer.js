import { computed, onUnmounted, ref } from 'vue'
export function useFocusTimer(onComplete, initialMinutes = 25) {
  const total = ref(Math.max(1, Number(initialMinutes) || 25) * 60), remaining = ref(total.value), running = ref(false); let timer
  const display = computed(() => `${String(Math.floor(remaining.value / 60)).padStart(2, '0')}:${String(remaining.value % 60).padStart(2, '0')}`)
  function tick() { if (remaining.value <= 1) { remaining.value = 0; pause(); onComplete?.(); return } remaining.value-- }
  function start() { if (running.value) return; if (remaining.value <= 0) remaining.value = total.value; running.value = true; timer = setInterval(tick, 1000) }
  function pause() { running.value = false; clearInterval(timer) }
  function reset(minutes = total.value / 60) { pause(); total.value = Math.max(1, Number(minutes) || 25) * 60; remaining.value = total.value }
  onUnmounted(pause); return { total, remaining, running, display, start, pause, reset }
}
