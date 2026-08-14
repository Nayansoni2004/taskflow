import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'home', component: () => import('../views/WelcomeView.vue'), meta: { title: 'TaskFlow', simple: true } },
  { path: '/tasks', name: 'tasks', component: () => import('../views/TasksView.vue'), meta: { title: 'My Tasks' } },
  { path: '/today', name: 'today', component: () => import('../views/TodayView.vue'), meta: { title: 'Today' } },
  { path: '/completed', name: 'completed', component: () => import('../views/CompletedView.vue'), meta: { title: 'Completed' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
export default createRouter({ history: createWebHistory(), routes, scrollBehavior: () => ({ top: 0 }) })
