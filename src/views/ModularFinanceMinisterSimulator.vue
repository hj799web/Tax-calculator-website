<template>
  <ErrorBoundary component-name="FinanceMinisterSimulator">
    <div class="simulator-container">
      <div class="simulator-header">
        <h1 class="simulator-title">Finance Minister Simulator</h1>
        <div class="year-selector">
          <button 
            class="year-button"
            @click="decrementYear"
            :disabled="currentYear <= 2020"
            aria-label="Previous year"
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <span class="year-display">{{ currentYear }}</span>
          <button 
            class="year-button"
            @click="incrementYear"
            :disabled="currentYear >= 2025"
            aria-label="Next year"
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>

      <div v-if="FEATURES.PANEL_NAV" class="mb-4">
        <PanelHost />
      </div>

      <div class="simulator-grid" v-if="!FEATURES.PANEL_NAV">
        <ErrorBoundary component-name="GoalTracker">
          <div class="simulator-card goals-card">
            <div class="card-header">
              <h2 class="card-title">Budget Goals</h2>
            </div>
            <div class="card-content">
              <GoalTracker />
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary component-name="BudgetResults">
          <div class="simulator-card results-card">
            <div class="card-header">
              <h2 class="card-title">Budget Results</h2>
            </div>
            <div class="card-content">
              <BudgetResults />
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary component-name="RevenueSliders">
          <div class="simulator-card revenue-card">
            <div class="card-header">
              <h2 class="card-title">Revenue Sources</h2>
            </div>
            <div class="card-content">
              <RevenueSliders />
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary component-name="SpendingControls">
          <div class="simulator-card spending-card">
            <div class="card-header">
              <h2 class="card-title">Spending Controls</h2>
            </div>
            <div class="card-content">
              <SpendingControls />
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary component-name="ChartsPanel">
          <div class="simulator-card charts-card">
            <div class="card-header">
              <h2 class="card-title">Budget Analysis</h2>
            </div>
            <div class="card-content">
              <ChartsPanel />
              <div class="mt-4">
                <MultiYearProjectionsPanel v-if="FEATURES.MULTI_YEAR_PLANNING" />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
    <MultiYearDock v-if="FEATURES.MULTI_YEAR_PLANNING" />
  </ErrorBoundary>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
import GoalTracker from '@/domains/budget/components/GoalTracker.vue';
import BudgetResults from '@/domains/budget/components/BudgetResults.vue';
import RevenueSliders from '@/domains/budget/components/BudgetRevenueSliders.vue';
import SpendingControls from '@/domains/budget/components/BudgetSpendingControls.vue';
import ChartsPanel from '@/domains/budget/components/BudgetChartsPanel.vue';
import { debounce } from 'lodash-es';
import { handleError } from '@/utils/errorHandler.js';
import { FEATURES } from '@/features.js';
import MultiYearProjectionsPanel from '@/domains/budget/components/MultiYearProjectionsPanel.vue';
import MultiYearDock from '@/domains/budget/components/MultiYearDock.vue';
import PanelHost from '@/domains/budget/components/BudgetPanelHost.vue';

const budgetStore = useBudgetSimulatorStore();
const currentYear = ref(2023);
const error = ref(null);
const isMobile = ref(window.innerWidth < 768);

// Initialize budget store
onMounted(() => {
  try {
    budgetStore.initializeBudget();
  } catch (err) {
    handleError(err, (msg) => error.value = msg);
  }
});

// Year control functions
const incrementYear = () => {
  if (currentYear.value < 2025) {
    currentYear.value++;
    updateBudgetForYear();
  }
};

const decrementYear = () => {
  if (currentYear.value > 2020) {
    currentYear.value--;
    updateBudgetForYear();
  }
};

const updateBudgetForYear = () => {
  try {
    budgetStore.updateBudgetForYear(currentYear.value);
  } catch (err) {
    handleError(err, (msg) => error.value = msg);
  }
};

// Error handling
const resetError = () => {
  error.value = null;
  try {
    budgetStore.initializeBudget();
  } catch (err) {
    handleError(err, (msg) => error.value = msg);
  }
};

// Responsive handling
const handleResize = debounce(() => {
  isMobile.value = window.innerWidth < 768;
}, 250);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Watch for year changes
watch(currentYear, (newYear) => {
  updateBudgetForYear();
});
</script>

<style scoped>
.simulator-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fc 0%, #e9f0f7 100%);
  container-type: inline-size;
}

.simulator-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.simulator-header:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.simulator-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.year-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.year-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #2d3748;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.year-button:hover:not(:disabled) {
  background: #f7fafc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.year-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.year-display {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 100px;
  text-align: center;
}

.simulator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  container-type: inline-size;
}

.simulator-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  contain: content;
}

.simulator-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title .material-icons {
  color: #4299e1;
}

.card-content {
  position: relative;
  min-height: 200px;
  contain: content;
}

/* Card Grid Layout */
.goals-card {
  grid-column: span 4;
  grid-row: 1;
  transition: transform 0.3s ease;
}

.goals-card:hover {
  transform: translateY(-5px);
}

.results-card {
  grid-column: span 8;
  grid-row: 1;
  transition: transform 0.3s ease;
}

.results-card:hover {
  transform: translateY(-5px);
}

.revenue-card {
  grid-column: span 6;
  grid-row: 2;
  transition: transform 0.3s ease;
}

.revenue-card:hover {
  transform: translateY(-5px);
}

.spending-card {
  grid-column: span 6;
  grid-row: 2;
  transition: transform 0.3s ease;
}

.spending-card:hover {
  transform: translateY(-5px);
}

.charts-card {
  grid-column: span 12;
  grid-row: 3;
  transition: transform 0.3s ease;
}

.charts-card:hover {
  transform: translateY(-5px);
}

/* Error Boundary */
.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.error-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
}

.error-icon {
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.error-button {
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  will-change: transform, background-color;
}

.error-button:hover {
  background: #3182ce;
  transform: translateY(-2px);
}

/* Responsive Design */
@container (max-width: 1200px) {
  .simulator-container {
    padding: 1.5rem;
  }
  
  .simulator-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@container (max-width: 768px) {
  .simulator-container {
    padding: 1rem;
  }
  
  .simulator-header {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .simulator-title {
    font-size: 2rem;
  }
  
  .simulator-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .simulator-card {
    padding: 1.25rem;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
}

@container (max-width: 480px) {
  .simulator-header {
    padding: 1rem;
  }
  
  .simulator-title {
    font-size: 1.75rem;
  }
  
  .year-selector {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .simulator-card {
    padding: 1rem;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .year-button:hover:not(:disabled) {
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .year-button:active:not(:disabled) {
    background: #f7fafc;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .year-button {
    transition: none;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .year-button {
    border: 2px solid CanvasText;
  }
}

/* Print Styles */
@media print {
  .simulator-container {
    background: none;
    padding: 0;
  }
  
  .simulator-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .year-button,
  .error-boundary {
    display: none;
  }
}

@media (max-width: 600px) {
  .card-title, .card-content, .summary-card, .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header, .tile-title, .tile-amount, .slider-labels {
    writing-mode: initial !important;
    text-orientation: initial !important;
    transform: none !important;
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
  }
}
</style>
