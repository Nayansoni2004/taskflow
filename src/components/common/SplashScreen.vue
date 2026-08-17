<script setup>
import { ref, onMounted } from 'vue'
import { CheckSquare, ArrowRight, Sparkles } from 'lucide-vue-next'

const emit = defineEmits(['finish'])

const progress = ref(0)
const isExiting = ref(false)

onMounted(() => {
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2
    } else {
      clearInterval(interval)
      setTimeout(() => {
        finishSplash()
      }, 300)
    }
  }, 30)
})

function finishSplash() {
  isExiting.value = true
  setTimeout(() => {
    emit('finish')
  }, 600)
}
</script>

<template>
  <div :class="['splash-screen', { 'splash-exit': isExiting }]">
    <div class="splash-background">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="splash-content">
      <!-- Animated Brand Logo Icon -->
      <div class="logo-box pulse-glow">
        <CheckSquare :size="48" class="logo-icon" />
      </div>

      <!-- App Title Animation -->
      <h1 class="brand-title">
        <span class="letter-t">Task</span><span class="gradient-text">Flow</span>
      </h1>
      
      <p class="brand-subtitle">
        <Sparkles :size="14" class="sparkle-icon" />
        Organize • Focus • Accomplish
      </p>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-percent">{{ progress }}%</span>
      </div>

      <!-- Quick Action / Skip Button -->
      <button class="skip-btn" @click="finishSplash">
        <span>Enter App</span>
        <ArrowRight :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0f19;
  color: #ffffff;
  overflow: hidden;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.splash-exit {
  opacity: 0;
  transform: scale(1.08);
  pointer-events: none;
}

.splash-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: floatOrb 8s infinite alternate ease-in-out;
}

.orb-1 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #6366f1 0%, rgba(99, 102, 241, 0) 70%);
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: -4s;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 50px) scale(1.15); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.6;
}

.splash-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px;
  max-width: 420px;
  width: 100%;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-box {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 24px;
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
}

.logo-icon {
  animation: popIcon 1.2s ease infinite alternate;
}

@keyframes popIcon {
  0% { transform: scale(0.95); }
  100% { transform: scale(1.05); }
}

.brand-title {
  font-size: 3.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 12px;
}

.letter-t {
  color: #ffffff;
}

.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 36px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.sparkle-icon {
  color: #fbbf24;
}

.progress-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #c084fc);
  border-radius: 99px;
  transition: width 0.1s linear;
}

.progress-percent {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  width: 36px;
  text-align: right;
}

.skip-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}
</style>
