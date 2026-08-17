import { createRouter, createWebHistory } from 'vue-router'
import HomeLandingView from '../views/HomeLandingView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeLandingView, meta: { title: 'TaskFlow' } },
  { path: '/tasks', name: 'tasks', component: () => import('../views/DailyTasksView.vue'), meta: { title: 'Daily Tasks' } },
  { path: '/calendar', name: 'calendar', component: () => import('../views/CalendarView.vue'), meta: { title: 'Schedule Calendar' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
