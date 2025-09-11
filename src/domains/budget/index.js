// Store facade with optional sandbox override injection
import { inject, provide } from 'vue'
import { useBudgetSimulatorStore as realUseBudgetSimulatorStore } from './store/budgetSimulator.js'

const BUDGET_STORE_OVERRIDE = Symbol('budget-store-override')

export function provideBudgetStoreOverride(storeLike) {
  // Provide a store-like object to child components (used by year sandbox)
  provide(BUDGET_STORE_OVERRIDE, storeLike)
}

export function clearBudgetStoreOverride() {
  provide(BUDGET_STORE_OVERRIDE, null)
}

// Keep the same API name so existing imports continue to work
export function useBudgetSimulatorStore() {
  const override = inject(BUDGET_STORE_OVERRIDE, null)
  // If a sandbox override is provided in the component tree, use it
  if (override) return override
  // Fallback to the real Pinia store
  return realUseBudgetSimulatorStore()
}

// Re-export utilities
export * from './utils/sharedBudget.js'
