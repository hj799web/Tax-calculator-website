// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useBudgetSimulatorStore } from './stores/budgetSimulator'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// Initialize the budget simulator store
const budgetStore = useBudgetSimulatorStore()
budgetStore.initializeStore()
