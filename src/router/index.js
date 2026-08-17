import { createRouter, createWebHistory } from 'vue-router'
import HomeDashboardView from '../views/HomeDashboardView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeDashboardView, meta: { title: 'Home Dashboard' } },
  { path: '/today', name: 'today', component: () => import('../views/TodayView.vue'), meta: { title: 'Today' } },
  { path: '/calendar', name: 'calendar', component: () => import('../views/CalendarView.vue'), meta: { title: 'Calendar' } },
  { path: '/completed', name: 'completed', component: () => import('../views/CompletedView.vue'), meta: { title: 'Completed' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
