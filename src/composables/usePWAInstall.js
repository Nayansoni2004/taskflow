import { ref, onMounted, onUnmounted } from 'vue'

const deferredPrompt = ref(null)
const isInstalled = ref(false)

export function usePWAInstall() {
  function handleBeforeInstallPrompt(e) {
    e.preventDefault()
    deferredPrompt.value = e
  }

  function handleAppInstalled() {
    isInstalled.value = true
    deferredPrompt.value = null
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      isInstalled.value = true
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  })

  async function promptInstall() {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      if (outcome === 'accepted') {
        isInstalled.value = true
      }
      deferredPrompt.value = null
    } else {
      alert('To install TaskFlow on your mobile phone or desktop, tap "Add to Home Screen" or install from your browser menu.')
    }
  }

  return {
    canInstall: ref(true), // Always allow user to attempt installation / get instructions
    isInstalled,
    promptInstall
  }
}
