<script setup>
import { useRouter } from 'vue-router'
import { usePWAInstall } from '../composables/usePWAInstall.js'
import { 
  CheckCircle, 
  Sparkles, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Download 
} from 'lucide-vue-next'

const emit = defineEmits(['add-task', 'open-focus'])
const router = useRouter()
const { promptInstall } = usePWAInstall()
</script>

<template>
  <div class="page-container home-landing-container">
    <!-- Hero Section (Minimalist & Flat) -->
    <section class="hero-section">
      <h1 class="hero-title">
        Turn To Dos into Done with TaskFlow
      </h1>

      <p class="hero-subtitle">
        A clean, minimalist workspace to capture tasks, schedule your week, and stay in deep focus.
      </p>

      <div class="hero-cta-buttons">
        <router-link to="/tasks" class="btn btn-primary hero-main-btn">
          <span>Open Tasks</span>
          <ArrowRight :size="16" />
        </router-link>

        <button class="btn btn-secondary hero-pwa-btn" @click="promptInstall">
          <Download :size="16" />
          <span>Download App</span>
        </button>
      </div>
    </section>

    <!-- Quick Navigation Feature Cards (3 Columns) -->
    <section class="features-section">
      <div class="features-grid">
        <!-- Card 1: Daily Tasks (Solid Black) -->
        <div class="flow-dark-card feature-card-dark" @click="router.push('/tasks')">
          <div class="card-icon-badge volt-badge">
            <CheckCircle :size="18" />
          </div>
          <h3 class="card-title">Daily Tasks</h3>
          <p class="card-desc">
            Organize daily tasks by priority and subtasks.
          </p>
          <div class="card-action-link">
            <span>Open tasks</span>
            <ArrowRight :size="12" />
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
            <ArrowRight :size="12" />
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
            <ArrowRight :size="12" />
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
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 24px;
  min-height: 100vh;
  justify-content: center;
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text-main);
  margin-bottom: 12px;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.8rem;
  }
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 24px;
}

.hero-cta-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-main-btn {
  padding: 10px 20px;
  font-size: 0.9rem;
}

.hero-pwa-btn {
  padding: 10px 18px;
  font-size: 0.9rem;
}

/* Features Section */
.features-section {
  width: 100%;
  margin-top: 12px;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.feature-card-dark {
  background-color: var(--bg-dark-card);
  color: #ffffff;
  border-color: var(--bg-dark-card);
}

.feature-card-white {
  background-color: #ffffff;
}

.card-icon-badge {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
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
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.feature-card-dark .card-title {
  color: #ffffff;
}

.card-desc {
  font-size: 0.82rem;
  line-height: 1.35;
  color: var(--text-muted);
}

.feature-card-dark .card-desc {
  color: #a1a1aa;
}

.card-action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
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
