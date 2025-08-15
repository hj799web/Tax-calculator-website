<template>
  <div 
    class="budget-change-banner"
    :class="{
      'banner-persistent': persistent,
      'banner-expanded': persistent && isExpanded,
      'banner-collapsed': persistent && !isExpanded
    }"
  >
    <!-- Toggle Button (only when persistent) -->
    <button 
      v-if="persistent"
      class="banner-toggle"
      @click="toggleExpanded"
      :aria-label="isExpanded ? 'Collapse budget changes' : 'Expand budget changes'"
    >
      <span class="material-icons">{{ isExpanded ? 'chevron_left' : 'chevron_right' }}</span>
      <span v-if="!isExpanded && totalChanges > 0" class="change-badge">
        {{ totalChanges }}
      </span>
    </button>

    <!-- Banner Content -->
    <div v-show="!persistent || isExpanded" class="banner-content">
      <!-- Active Changes -->
      <TransitionGroup 
        name="banner-change" 
        tag="div" 
        class="change-banner"
        :class="{ 'banner-visible': hasActiveChanges }"
      >
        <BudgetChangeNotification
          v-for="change in recentChanges" 
          :key="change.id"
          :change="change"
          @dismiss="dismissChange"
        />
      </TransitionGroup>
      
      <!-- Batch Change Summary -->
      <TransitionGroup 
        name="banner-change" 
        tag="div" 
        class="batch-banner"
        :class="{ 'banner-visible': hasBatchChanges }"
      >
        <BatchChangeSummary
          v-for="batch in batchChanges" 
          :key="batch.batchId"
          :changes="batch"
          @dismiss="dismissBatch"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useChangeTracker } from '@/composables/useChangeTracker';
import { createBudgetChangeInterceptors } from '@/utils/storeInterceptors';
import BudgetChangeNotification from './BudgetChangeNotification.vue';
import BatchChangeSummary from './BatchChangeSummary.vue';

// Props for flexibility
const props = defineProps({
  persistent: { type: Boolean, default: false },
  position: { type: String, default: 'right', validator: (val) => ['left', 'right'].includes(val) }
});

const budgetStore = useBudgetSimulatorStore();
const isExpanded = ref(true);

const { 
  recentChanges, 
  batchChanges, 
  hasActiveChanges, 
  hasBatchChanges,
  dismissChange, 
  dismissBatch,
  processChangeEvent,
  beginBatch,
  endBatch,
  currentBatchId
} = useChangeTracker();

// Computed
const totalChanges = computed(() => {
  return recentChanges.value.length + batchChanges.value.length;
});

// Methods
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
  if (props.persistent) {
    localStorage.setItem('budgetBannerExpanded', isExpanded.value.toString());
  }
};

// Store original methods
let originalMethods = {};

// Initialize change tracking
function initializeChangeTracking() {
  try {
    // Store original methods
    originalMethods = {
      setRevenueRate: budgetStore.setRevenueRate,
      updateSpendingFactor: budgetStore.updateSpendingFactor
    };
    
    // Create interceptors
    const interceptors = createBudgetChangeInterceptors(budgetStore, {
      processChangeEvent,
      beginBatch,
      endBatch,
      currentBatchId
    });
    
    // Apply interceptors
    budgetStore.setRevenueRate = interceptors.revenueInterceptor;
    budgetStore.updateSpendingFactor = interceptors.spendingInterceptor;
    
    // Add change tracker to store for access by interceptors
    budgetStore.changeTracker = {
      processChangeEvent,
      currentBatchId
    };
    
    console.log('Budget change tracking initialized successfully');
  } catch (error) {
    console.error('Failed to initialize budget change tracking:', error);
  }
}

// Cleanup function
function cleanupChangeTracking() {
  try {
    // Restore original methods
    if (originalMethods.setRevenueRate) {
      budgetStore.setRevenueRate = originalMethods.setRevenueRate;
    }
    if (originalMethods.updateSpendingFactor) {
      budgetStore.updateSpendingFactor = originalMethods.updateSpendingFactor;
    }
    
    // Remove change tracker from store
    delete budgetStore.changeTracker;
    
    console.log('Budget change tracking cleaned up');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Lifecycle hooks
onMounted(() => {
  // Restore state on mount
  if (props.persistent) {
    const savedState = localStorage.getItem('budgetBannerExpanded');
    if (savedState !== null) {
      isExpanded.value = savedState === 'true';
    }
  }
  
  initializeChangeTracking();
});

onUnmounted(() => {
  cleanupChangeTracking();
});
</script>

<style scoped>
.budget-change-banner {
  /* Default positioning (right side) */
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 380px;
  pointer-events: none;
}

/* Persistent mode - left side */
.budget-change-banner.banner-persistent {
  left: 0;
  right: auto;
  top: 50%;
  transform: translateY(-50%);
  flex-direction: row;
  align-items: flex-start;
  pointer-events: auto;
}

.banner-toggle {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 2001;
  transition: all 0.3s ease;
  color: #374151;
}

.banner-toggle:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  color: #1f2937;
}

.banner-toggle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.change-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.banner-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0 12px 12px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 280px;
  max-width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  pointer-events: auto;
}

.banner-collapsed .banner-content {
  display: none;
}

.change-banner,
.batch-banner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.change-banner.banner-visible,
.batch-banner.banner-visible {
  pointer-events: auto;
}

/* Transition animations */
.banner-change-enter-active,
.banner-change-leave-active {
  transition: all 0.3s ease;
}

.banner-change-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.banner-change-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.banner-change-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .budget-change-banner {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .budget-change-banner.banner-persistent {
    top: auto;
    bottom: 20px;
    transform: none;
    left: 10px;
    right: 10px;
    flex-direction: column;
  }
  
  .banner-toggle {
    width: 100%;
    height: 40px;
    border-radius: 8px 8px 0 0;
    order: -1;
  }
  
  .banner-content {
    max-width: none;
    border-radius: 0 0 8px 8px;
  }
  
  .change-badge {
    top: 8px;
    right: 8px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .banner-change-enter-active,
  .banner-change-leave-active,
  .banner-change-move {
    transition: none;
  }
  
  .banner-change-enter-from,
  .banner-change-leave-to {
    transform: none;
  }
  
  .change-badge {
    animation: none;
  }
  
  .banner-toggle {
    transition: none;
  }
}

/* High contrast mode */
@media (forced-colors: active) {
  .banner-toggle {
    border: 2px solid CanvasText;
  }
  
  .banner-content {
    border: 2px solid CanvasText;
  }
  
  .change-badge {
    border: 2px solid CanvasText;
  }
}

/* Focus management for accessibility */
.banner-toggle:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Scrollbar styling for banner content */
.banner-content::-webkit-scrollbar {
  width: 6px;
}

.banner-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.banner-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.banner-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style> 