// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import HowItWorksView from '../views/HowItWorksView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../App.vue')
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: HowItWorksView
  },
  {
    path: '/simulator',
    name: 'finance-minister-simulator',
    component: () => import('../views/FinanceMinisterSimulator.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 }
  }
})

export default router
