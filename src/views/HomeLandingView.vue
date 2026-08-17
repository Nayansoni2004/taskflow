<script setup>
import { useRouter } from 'vue-router'
import { usePWAInstall } from '../composables/usePWAInstall.js'
import { 
  CheckCircle, 
  Sparkles, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Download, 
  Zap 
} from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'open-focus'])
const router = useRouter()
const { promptInstall } = usePWAInstall()
</script>

<template>
  <div class="page-container home-landing-container">
    <!-- Hero Section (Simplified) -->
    <section class="hero-section">
      <div class="hero-badge">
        <div class="badge-icon-dot">
          <Zap :size="12" />
        </div>
        <span>Offline-First Productivity</span>
      </div>

      <h1 class="hero-title">
        Turn To Dos into Done with <span class="title-highlight">TaskFlow</span>
      </h1>

      <p class="hero-subtitle">
        A clean, minimalist workspace to capture tasks, schedule your week, and stay in deep focus.
      </p>

      <div class="hero-cta-buttons">
        <router-link to="/tasks" class="btn btn-volt hero-main-btn">
          <span>Get Started</span>
          <ArrowRight :size="18" />
        </router-link>

        <button class="btn btn-secondary hero-pwa-btn" @click="promptInstall">
          <Download :size="18" />
          <span>Download App</span>
        </button>
      </div>
    </section>

    <!-- Quick Navigation Feature Cards (3 Columns) -->
    <section class="features-section">
      <div class="features-grid">
        <!-- Card 1: Daily Tasks -->
        <div class="flow-dark-card feature-card-dark" @click="router.push('/tasks')">
          <div class="card-icon-badge volt-badge">
            <CheckCircle :size="20" />
          </div>
          <h3 class="card-title">Daily Tasks</h3>
          <p class="card-desc">
            Organize daily tasks by priority and subtasks.
          </p>
          <div class="card-action-link">
            <span>Open tasks</span>
            <ArrowRight :size="14" />
          </div>
        </div>

        <!-- Card 2: Schedule Calendar -->
        <div class="flow-card feature-card-white" @click="router.push('/calendar')">
          <div class="card-icon-badge sub-badge">
            <CalendarIcon :size="18" />
          </div>
          <h3 class="card-title">Calendar</h3>
          <p class="card-desc">
            Plan your week with the mobile date strip agenda.
          </p>
          <div class="card-action-link">
            <span>View agenda</span>
            <ArrowRight :size="14" />
          </div>
        </div>

        <!-- Card 3: Focus Timer -->
        <div class="flow-card feature-card-white" @click="emit('open-focus')">
          <div class="card-icon-badge sub-badge">
            <Sparkles :size="18" />
          </div>
          <h3 class="card-title">Focus Timer</h3>
          <p class="card-desc">
            Deep focus block with break alerts.
          </p>
          <div class="card-action-link">
            <span>Start timer</span>
            <ArrowRight :size="14" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-landing-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 960px;
  margin: 0 auto;
  padding-top: 16px;
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 99px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
}

.badge-icon-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--accent-volt);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 12px;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }
}

.title-highlight {
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0;
    right: 0;
    height: 10px;
    background-color: var(--accent-volt);
    z-index: -1;
    border-radius: 3px;
  }
}

.hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.45;
  margin-bottom: 24px;
  max-width: 540px;
}

.hero-cta-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-main-btn {
  padding: 12px 24px;
  font-size: 0.95rem;
}

.hero-pwa-btn {
  padding: 12px 20px;
  font-size: 0.95rem;
}

/* Features Section */
.features-section {
  width: 100%;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card-dark, .feature-card-white {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  transition: border-color 0.2s ease;
}

.feature-card-dark:hover, .feature-card-white:hover {
  border-color: var(--border-medium);
}

.card-icon-badge {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.volt-badge {
  background-color: var(--accent-volt);
  color: var(--text-main);
}

.sub-badge {
  background-color: var(--bg-subtle);
  color: var(--text-main);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.feature-card-dark .card-title {
  color: #ffffff;
}

.card-desc {
  font-size: 0.88rem;
  line-height: 1.4;
  flex: 1;
}

.feature-card-dark .card-desc {
  color: #a1a1aa;
}

.feature-card-white .card-desc {
  color: var(--text-muted);
}

.card-action-link {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  font-weight: 700;
  margin-top: 4px;
}

.feature-card-dark .card-action-link {
  color: var(--accent-volt);
}

.feature-card-white .card-action-link {
  color: var(--primary);
}
</style>
