// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useBudgetSimulatorStore } from '@/domains/budget'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)

// Performance monitoring for initial render
const startTime = performance.now()

app.mount('#app')

// Log initial render performance
if (process.env.NODE_ENV === 'development') {
  const renderTime = performance.now() - startTime
  console.log(`[Performance] Initial render: ${renderTime.toFixed(2)}ms`)
}

// Global error handler for production
app.config.errorHandler = (err, vm, info) => {
  console.error('[App Error]', err, info)
  
  // In production, you might want to send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(err)
  }
}

// Initialize the budget simulator store
const budgetStore = useBudgetSimulatorStore()
budgetStore.initializeStore()
