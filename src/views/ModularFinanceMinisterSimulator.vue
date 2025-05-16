<template>
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

    <div class="simulator-grid">
      <!-- Goals Card -->
      <div class="simulator-card goals-card">
        <div class="card-header">
          <h2 class="card-title">Budget Goals</h2>
        </div>
        <div class="card-content">
          <GoalTracker />
        </div>
      </div>

      <!-- Results Card -->
      <div class="simulator-card results-card">
        <div class="card-header">
          <h2 class="card-title">Budget Results</h2>
        </div>
        <div class="card-content">
          <BudgetResults />
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="simulator-card revenue-card">
        <div class="card-header">
          <h2 class="card-title">Revenue Sources</h2>
        </div>
        <div class="card-content">
          <RevenueSliders />
        </div>
      </div>

      <!-- Spending Card -->
      <div class="simulator-card spending-card">
        <div class="card-header">
          <h2 class="card-title">Spending Controls</h2>
        </div>
        <div class="card-content">
          <SpendingControls />
        </div>
      </div>

      <!-- Charts Card -->
      <div class="simulator-card charts-card">
        <div class="card-header">
          <h2 class="card-title">Budget Analysis</h2>
        </div>
        <div class="card-content">
          <ChartsPanel />
        </div>
      </div>
    </div>

    <!-- Error Boundary -->
    <div v-if="error" class="error-boundary">
      <div class="error-content">
        <span class="material-icons error-icon">error_outline</span>
        <h3 class="error-title">Something went wrong</h3>
        <p class="error-message">{{ error }}</p>
        <button class="error-button" @click="resetError">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import GoalTracker from '@/domains/budget/components/GoalTracker.vue';
import BudgetResults from '@/domains/budget/components/BudgetResults.vue';
import RevenueSliders from '@/domains/budget/components/RevenueSliders.vue';
import SpendingControls from '@/domains/budget/components/SpendingControls.vue';
import ChartsPanel from '@/domains/budget/components/ChartsPanel.vue';
import { debounce } from 'lodash-es';

const budgetStore = useBudgetSimulatorStore();
const currentYear = ref(2023);
const error = ref(null);
const isMobile = ref(window.innerWidth < 768);

// Initialize budget store
onMounted(() => {
  try {
    budgetStore.initializeBudget();
  } catch (err) {
    error.value = 'Failed to initialize budget. Please try again.';
    console.error('Budget initialization error:', err);
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
    error.value = 'Failed to update budget for the selected year.';
    console.error('Budget update error:', err);
  }
};

// Error handling
const resetError = () => {
  error.value = null;
  try {
    budgetStore.initializeBudget();
  } catch (err) {
    error.value = 'Failed to reset budget. Please refresh the page.';
    console.error('Budget reset error:', err);
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
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform, box-shadow;
}

.simulator-header:hover {
  transform: translateY(-5px) translateZ(0);
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
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  will-change: transform, box-shadow;
}

.year-button:hover:not(:disabled) {
  background: #f7fafc;
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
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
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  will-change: transform, box-shadow;
  contain: content;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.simulator-card:hover {
  transform: translateY(-5px) translateZ(0) rotateX(2deg);
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
  transform: translateZ(20px);
  transition: transform 0.3s ease;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transform: translateZ(30px);
  transition: transform 0.3s ease;
}

.card-title .material-icons {
  color: #4299e1;
}

.card-content {
  position: relative;
  min-height: 200px;
  contain: content;
  transform: translateZ(10px);
  transition: transform 0.3s ease;
}

/* Card Grid Layout */
.goals-card {
  grid-column: span 4;
  grid-row: 1;
  transform: translateZ(0) rotateX(0deg);
  transition: transform 0.3s ease;
}

.goals-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
}

.results-card {
  grid-column: span 8;
  grid-row: 1;
  transform: translateZ(0) rotateX(0deg);
  transition: transform 0.3s ease;
}

.results-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
}

.revenue-card {
  grid-column: span 6;
  grid-row: 2;
  transform: translateZ(0) rotateX(0deg);
  transition: transform 0.3s ease;
}

.revenue-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
}

.spending-card {
  grid-column: span 6;
  grid-row: 2;
  transform: translateZ(0) rotateX(0deg);
  transition: transform 0.3s ease;
}

.spending-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
}

.charts-card {
  grid-column: span 12;
  grid-row: 3;
  transform: translateZ(0) rotateX(0deg);
  transition: transform 0.3s ease;
}

.charts-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
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
  transform: translateZ(0);
  will-change: transform;
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
  transform: translateY(-2px) translateZ(0);
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
  .simulator-card:hover {
    transform: none;
    box-shadow: 
      0 10px 20px rgba(0, 0, 0, 0.19),
      0 6px 6px rgba(0, 0, 0, 0.23);
  }
  
  .simulator-card:active {
    transform: translateY(-2px) translateZ(10px) rotateX(1deg);
    box-shadow: 
      0 12px 24px rgba(0, 0, 0, 0.2),
      0 8px 8px rgba(0, 0, 0, 0.15);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .simulator-card,
  .year-button,
  .simulator-header,
  .error-button,
  .card-header,
  .card-title,
  .card-content {
    transition: none;
    transform: none !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .simulator-card {
    border: 2px solid CanvasText;
  }
  
  .card-header {
    border-bottom: 2px solid CanvasText;
  }
  
  .year-button,
  .error-button {
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
</style>
