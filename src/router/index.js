// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import { createSafeImport } from '@/utils/chunkLoader.js'

// Route-level lazy loading with loading states for better mobile performance
const routes = [
  {
    path: '/',
    name: 'home',
    component: createSafeImport(() => import('../App.vue'), 'app')
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: createSafeImport(() => import('../views/WelcomeView.vue'), 'welcome')
  },
  {
    path: '/how-it-works',
    name: 'how-it-works',
    component: createSafeImport(() => import('../views/HowItWorksView.vue'), 'how-it-works')
  },
  {
    path: '/simulator',
    name: 'finance-minister-simulator',
    component: createSafeImport(() => import('../views/FinanceMinisterSimulator.vue'), 'simulator')
  },
  {
    path: '/budget-simulator',
    name: 'shared-budget',
    component: createSafeImport(() => import('../views/FinanceMinisterSimulator.vue'), 'simulator'),
    meta: {
      isSharedBudget: true
    },
    // Pass URL query parameters as props to the component
    props: (route) => ({ ...route.query })
  },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: createSafeImport(() => import('../views/TermsOfServiceView.vue'), 'terms')
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

// Add global route loading styles
const routeLoadingStyles = `
<style>
.route-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  color: #3498db;
  font-weight: 600;
}

.route-loading .loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(52, 152, 219, 0.2);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.route-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  color: #e74c3c;
  font-weight: 600;
  text-align: center;
}

.route-error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.route-error button:hover {
  background: #2980b9;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
`

// Inject styles into document head if not already present
if (typeof document !== 'undefined' && !document.querySelector('#route-loading-styles')) {
  const styleElement = document.createElement('style')
  styleElement.id = 'route-loading-styles'
  styleElement.innerHTML = routeLoadingStyles.replace(/<style>|<\/style>/g, '')
  document.head.appendChild(styleElement)
}

export default router
