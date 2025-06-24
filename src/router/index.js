// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../App.vue')
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: () => import('../views/HowItWorksView.vue')
  },
  {
    path: '/simulator',
    name: 'finance-minister-simulator',
    component: () => import('../views/FinanceMinisterSimulator.vue')
  },
  {
    path: '/budget-simulator',
    name: 'shared-budget',
    component: () => import('../views/FinanceMinisterSimulator.vue'),
    meta: {
      isSharedBudget: true
    },
    // Pass URL query parameters as props to the component
    props: (route) => ({ ...route.query })
  },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: () => import('../views/TermsOfServiceView.vue')
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
