<template>
  <div class="goal-tracker bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        Budget Goals
      </h3>
      <div class="flex items-center">
        <input 
          id="enable-goals" 
          v-model="localGoals.enabled" 
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          @change="updateGoals"
        >
        <label
          for="enable-goals"
          class="ml-2 block text-sm text-gray-700"
        >
          Enable Budget Goals
        </label>
      </div>
    </div>
    
    <div
      v-if="localGoals.enabled"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Target Revenue Input -->
        <div class="space-y-1">
          <label
            for="target-revenue"
            class="block text-sm font-medium text-gray-700"
          >
            Target Revenue ($B)
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input 
              id="target-revenue" 
              v-model.number="localGoals.targetRevenue" 
              type="number"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.0"
              min="0"
              step="0.1"
              :disabled="autoBalanceEnabled"
              @change="updateGoals"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">B</span>
            </div>
          </div>
        </div>
        
        <!-- Target Deficit/Surplus Input -->
        <div class="space-y-1">
          <label
            for="target-deficit"
            class="block text-sm font-medium text-gray-700"
          >
            Target {{ localGoals.targetDeficit !== null && localGoals.targetDeficit >= 0 ? 'Deficit' : 'Surplus' }} ($B)
          </label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input 
              id="target-deficit" 
              v-model.number="localGoals.targetDeficit" 
              type="number"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.0"
              step="0.1"
              :disabled="autoBalanceEnabled"
              @change="updateGoals"
            >
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">B</span>
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Positive = Deficit, Negative = Surplus
          </div>
        </div>
      </div>
      
      <!-- Auto-balance option -->
      <div class="mt-4 flex items-center">
        <input 
          id="auto-balance" 
          v-model="autoBalanceEnabled" 
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          @change="handleAutoBalanceChange"
        >
        <label
          for="auto-balance"
          class="ml-2 block text-sm text-gray-700"
        >
          Auto-balance budget to match goal
        </label>
      </div>

      
      <!-- Auto-balance message -->
      <div
        v-if="autoBalanceEnabled && autoBalanceMessage"
        class="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm"
      >
        {{ autoBalanceMessage }}
      </div>
      
      <!-- Feedback Section -->
      <div class="mt-4 border-t border-gray-200 pt-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">
          Goal Status:
        </h4>
        
        <!-- Revenue Goal Status -->
        <div
          v-if="localGoals.targetRevenue !== null"
          class="mb-3"
        >
          <div class="flex items-center mb-1">
            <span class="text-sm font-medium text-gray-600 mr-2">Revenue Goal:</span>
            <span class="text-xl mr-1">{{ revenueStatusIcon }}</span>
            <span
              :class="revenueStatusClass"
              class="text-sm font-medium"
            >
              {{ revenueStatusText }}
            </span>
          </div>
          <div class="text-xs text-gray-600">
            {{ revenueGapMessage }}
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full" 
              :style="{ width: `${Math.min(100, (props.currentRevenue / localGoals.targetRevenue) * 100)}%`, backgroundColor: revenueStatusColor }"
            />
          </div>
        </div>
        
        <!-- Deficit Goal Status -->
        <div
          v-if="localGoals.targetDeficit !== null"
          class="mb-3"
        >
          <div class="flex items-center mb-1">
            <span class="text-sm font-medium text-gray-600 mr-2">
              {{ localGoals.targetDeficit >= 0 ? 'Deficit' : 'Surplus' }} Goal:
            </span>
            <span class="text-xl mr-1">{{ deficitStatusIcon }}</span>
            <span
              :class="deficitStatusClass"
              class="text-sm font-medium"
            >
              {{ deficitStatusText }}
            </span>
          </div>
          <div class="text-xs text-gray-600">
            {{ deficitGapMessage }}
          </div>
          <div
            v-if="localGoals.targetDeficit !== 0"
            class="mt-2 w-full bg-gray-200 rounded-full h-2"
          >
            <div
              class="h-2 rounded-full" 
              :style="{ width: `${Math.min(100, Math.abs((currentDeficit / (Math.abs(localGoals.targetDeficit) || 1)) * 100))}%`, backgroundColor: deficitStatusColor }"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div
      v-else
      class="text-center text-gray-500 italic py-2"
    >
      Enable budget goals to track your progress
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBudgetSimulatorStore } from '../store/budgetSimulator';

// Props
const props = defineProps({
  currentRevenue: {
    type: Number,
    required: true
  },
  currentSpending: {
    type: Number,
    required: true
  },
  initialGoals: {
    type: Object,
    default: () => ({
      enabled: false,
      targetRevenue: null,
      targetDeficit: null
    })
  }
});

// Emits
const emit = defineEmits(['update:goals', 'goalStatusChanged', 'autoBalanceToggled']);

// Router for URL params
const router = useRouter();
const route = useRoute();

// Local state
const localGoals = ref({
  enabled: props.initialGoals.enabled || false,
  targetRevenue: props.initialGoals.targetRevenue || null,
  targetDeficit: props.initialGoals.targetDeficit || null
});

// Auto-balance feature
const autoBalanceEnabled = ref(false);
const autoBalanceMessage = ref('');

const budgetStore = useBudgetSimulatorStore();

// Computed properties
const currentDeficit = computed(() => {
  return props.currentSpending - props.currentRevenue;
});

// Revenue goal status
const revenuePercentOfGoal = computed(() => {
  if (!localGoals.value.targetRevenue) return 100;
  return (props.currentRevenue / localGoals.value.targetRevenue) * 100;
});

const revenueStatusIcon = computed(() => {
  if (revenuePercentOfGoal.value >= 95 && revenuePercentOfGoal.value <= 105) {
    return '✅';
  } else if ((revenuePercentOfGoal.value >= 90 && revenuePercentOfGoal.value < 95) || 
             (revenuePercentOfGoal.value > 105 && revenuePercentOfGoal.value <= 110)) {
    return '⚠️';
  } else {
    return '❌';
  }
});

const revenueStatusClass = computed(() => {
  if (revenuePercentOfGoal.value >= 95 && revenuePercentOfGoal.value <= 105) {
    return 'text-green-600';
  } else if ((revenuePercentOfGoal.value >= 90 && revenuePercentOfGoal.value < 95) || 
             (revenuePercentOfGoal.value > 105 && revenuePercentOfGoal.value <= 110)) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
});

const revenueStatusColor = computed(() => {
  if (revenuePercentOfGoal.value >= 95 && revenuePercentOfGoal.value <= 105) {
    return '#10B981'; // green-500
  } else if ((revenuePercentOfGoal.value >= 90 && revenuePercentOfGoal.value < 95) || 
             (revenuePercentOfGoal.value > 105 && revenuePercentOfGoal.value <= 110)) {
    return '#F59E0B'; // amber-500
  } else {
    return '#EF4444'; // red-500
  }
});

const revenueStatusText = computed(() => {
  if (revenuePercentOfGoal.value >= 95 && revenuePercentOfGoal.value <= 105) {
    return 'On Target';
  } else if (revenuePercentOfGoal.value < 95) {
    return 'Under Target';
  } else {
    return 'Over Target';
  }
});

const revenueGapMessage = computed(() => {
  if (!localGoals.value.targetRevenue) return '';
  
  const gap = props.currentRevenue - localGoals.value.targetRevenue;
  const percentGap = (gap / localGoals.value.targetRevenue) * 100;
  
  if (Math.abs(percentGap) < 2) {
    return 'Your revenue is right on target!';
  } else if (gap > 0) {
    return `You're $${gap.toFixed(1)}B (${percentGap.toFixed(1)}%) over your revenue target.`;
  } else {
    return `You're $${Math.abs(gap).toFixed(1)}B (${Math.abs(percentGap).toFixed(1)}%) under your revenue target.`;
  }
});

// Deficit/Surplus goal status
const deficitPercentOfGoal = computed(() => {
  if (!localGoals.value.targetDeficit || localGoals.value.targetDeficit === 0) return 100;
  // Compare current deficit with absolute target (prevent division by zero)
  const currentDeficitValue = props.currentSpending - props.currentRevenue;
  return (currentDeficitValue / Math.abs(localGoals.value.targetDeficit)) * 100;
});

const deficitStatusIcon = computed(() => {
  if (!localGoals.value.targetDeficit) return '';
  
  const currentDeficitValue = props.currentSpending - props.currentRevenue;
  const signsMatch = Math.sign(currentDeficitValue) === Math.sign(localGoals.value.targetDeficit) ||
                    localGoals.value.targetDeficit === 0;
  
  if (!signsMatch) {
    return '❌';
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return '✅';
  } else if (Math.abs(deficitPercentOfGoal.value - 100) <= 15) {
    return '⚠️';
  } else {
    return '❌';
  }
});

const deficitStatusClass = computed(() => {
  if (!localGoals.value.targetDeficit) return '';
  
  const currentDeficitValue = props.currentSpending - props.currentRevenue;
  const signsMatch = Math.sign(currentDeficitValue) === Math.sign(localGoals.value.targetDeficit) ||
                    localGoals.value.targetDeficit === 0;
  
  if (!signsMatch) {
    return 'text-red-600';
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return 'text-green-600';
  } else if (Math.abs(deficitPercentOfGoal.value - 100) <= 15) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
});

const deficitStatusColor = computed(() => {
  if (!localGoals.value.targetDeficit) return '#CBD5E0'; // gray-400
  
  const currentDeficitValue = props.currentSpending - props.currentRevenue;
  const signsMatch = Math.sign(currentDeficitValue) === Math.sign(localGoals.value.targetDeficit) ||
                    localGoals.value.targetDeficit === 0;
  
  if (!signsMatch) {
    return '#EF4444'; // red-500
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return '#10B981'; // green-500
  } else if (Math.abs(deficitPercentOfGoal.value - 100) <= 15) {
    return '#F59E0B'; // amber-500
  } else {
    return '#EF4444'; // red-500
  }
});

const deficitStatusText = computed(() => {
  if (!localGoals.value.targetDeficit) return '';
  
  const currentDeficitValue = props.currentSpending - props.currentRevenue;
  const signsMatch = Math.sign(currentDeficitValue) === Math.sign(localGoals.value.targetDeficit) ||
                    localGoals.value.targetDeficit === 0;
  
  if (!signsMatch) {
    return localGoals.value.targetDeficit >= 0 
      ? 'You have a surplus instead of a deficit' 
      : 'You have a deficit instead of a surplus';
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return 'On Target';
  } else if (deficitPercentOfGoal.value < 95) {
    return localGoals.value.targetDeficit >= 0 
      ? 'Deficit is too small' 
      : 'Surplus is too large';
  } else {
    return localGoals.value.targetDeficit >= 0 
      ? 'Deficit is too large' 
      : 'Surplus is too small';
  }
});

const deficitGapMessage = computed(() => {
  if (!localGoals.value.targetDeficit) return '';
  
  const currentDeficitValue = props.currentSpending - props.currentRevenue;
  const gap = currentDeficitValue - localGoals.value.targetDeficit;
  
  if (Math.abs(gap) < 2) {
    return `Your budget is right on target!`;
  } else if (gap > 0) {
    return localGoals.value.targetDeficit >= 0
      ? `Your deficit is $${gap.toFixed(1)}B higher than your target.`
      : `Your surplus is $${Math.abs(gap).toFixed(1)}B lower than your target.`;
  } else {
    return localGoals.value.targetDeficit >= 0
      ? `Your deficit is $${Math.abs(gap).toFixed(1)}B lower than your target.`
      : `Your surplus is $${Math.abs(gap).toFixed(1)}B higher than your target.`;
  }
});

// Methods
function updateGoals() {
  emit('update:goals', { ...localGoals.value });
  
  if (localGoals.value.enabled) {
    updateUrlParams();
  } else {
    clearUrlParams();
  }
  
  emit('goalStatusChanged', {
    revenue: {
      status: revenueStatusClass.value,
      icon: revenueStatusIcon.value,
      text: revenueStatusText.value,
      message: revenueGapMessage.value
    },
    deficit: {
      status: deficitStatusClass.value,
      icon: deficitStatusIcon.value,
      text: deficitStatusText.value,
      message: deficitGapMessage.value
    }
  });
}

function handleAutoBalanceChange() {
  // Simple implementation that just emits the event and updates the message
  emit('autoBalanceToggled', autoBalanceEnabled.value);
  
  // Set the message based on the current state
  if (autoBalanceEnabled.value) {
    if (localGoals.value.targetRevenue !== null) {
      const amount = localGoals.value.targetRevenue.toFixed(1);
      autoBalanceMessage.value = `Auto-balancing revenue to reach your $${amount}B revenue goal...`;
      
      // Directly update the store
      budgetStore.budgetGoals.targetRevenue = localGoals.value.targetRevenue;
      budgetStore.budgetGoals.enabled = true;
      budgetStore.toggleAutoBalance(true);
    } else if (localGoals.value.targetDeficit !== null) {
      const isDeficit = localGoals.value.targetDeficit >= 0;
      const amount = isDeficit ? 
        localGoals.value.targetDeficit.toFixed(1) : 
        Math.abs(localGoals.value.targetDeficit).toFixed(1);
      
      autoBalanceMessage.value = isDeficit ?
        `Auto-balancing revenue to reach your $${amount}B deficit goal...` :
        `Auto-balancing revenue to reach your $${amount}B surplus goal...`;
        
      // Directly update the store
      budgetStore.budgetGoals.targetDeficit = localGoals.value.targetDeficit;
      budgetStore.budgetGoals.enabled = true;
      budgetStore.toggleAutoBalance(true);
    } else {
      autoBalanceMessage.value = 'Please set either a revenue goal or a deficit/surplus goal to auto-balance the budget.';
      autoBalanceEnabled.value = false;
    }
  } else {
    autoBalanceMessage.value = '';
    budgetStore.toggleAutoBalance(false);
  }
}


function updateUrlParams() {
  if (!localGoals.value.enabled) return;
  
  const query = { ...route.query };
  
  if (localGoals.value.targetRevenue !== null) {
    query.revenueGoal = localGoals.value.targetRevenue.toString();
  } else {
    delete query.revenueGoal;
  }
  
  if (localGoals.value.targetDeficit !== null) {
    query.deficitGoal = localGoals.value.targetDeficit.toString();
  } else {
    delete query.deficitGoal;
  }
  
  router.replace({ query });
}

function clearUrlParams() {
  const query = { ...route.query };
  delete query.revenueGoal;
  delete query.deficitGoal;
  router.replace({ query });
}

function loadFromUrlParams() {
  const { revenueGoal, deficitGoal } = route.query;
  
  if (revenueGoal !== undefined || deficitGoal !== undefined) {
    const updatedGoals = { ...localGoals.value, enabled: true };
    
    if (revenueGoal !== undefined) {
      updatedGoals.targetRevenue = parseFloat(revenueGoal);
    }
    
    if (deficitGoal !== undefined) {
      updatedGoals.targetDeficit = parseFloat(deficitGoal);
    }
    
    localGoals.value = updatedGoals;
    updateGoals();
  }
}

// Watchers
watch(() => props.initialGoals, (newGoals) => {
  if (newGoals) {
    localGoals.value = { ...newGoals };
  }
}, { deep: true });

watch(() => route.query, (newQuery) => {
  if (newQuery.revenueGoal !== undefined || newQuery.deficitGoal !== undefined) {
    loadFromUrlParams();
  }
}, { deep: true });

// Initialize from URL params on mount
onMounted(() => {
  loadFromUrlParams();
});
</script>

<style scoped>
.goal-tracker {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  contain: content;
}

.goal-tracker:hover {
  transform: translateY(-5px) translateZ(0);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.goal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.goal-item:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.goal-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border-radius: 0.5rem;
  color: #4299e1;
  font-size: 1.5rem;
}

.goal-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.goal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.goal-description {
  font-size: 0.875rem;
  color: #4a5568;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  width: 200px;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4299e1;
  border-radius: 0.25rem;
  transition: width 0.3s ease;
  will-change: width;
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 3rem;
  text-align: right;
}

.goal-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-achieved {
  color: #38a169;
  background: #f0fff4;
}

.status-in-progress {
  color: #3182ce;
  background: #ebf8ff;
}

.status-not-started {
  color: #718096;
  background: #f7fafc;
}

/* Responsive Design */
@container (max-width: 768px) {
  .goal-tracker {
    padding: 1rem;
  }
  
  .goal-item {
    padding: 0.75rem;
  }
  
  .goal-title {
    font-size: 1rem;
  }
  
  .progress-bar {
    width: 150px;
  }
}

@container (max-width: 480px) {
  .goal-tracker {
    padding: 0.75rem;
  }
  
  .goal-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .goal-info {
    width: 100%;
  }
  
  .goal-progress {
    width: 100%;
    justify-content: space-between;
  }
  
  .progress-bar {
    width: 100%;
    flex: 1;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .goal-tracker:hover,
  .goal-item:hover {
    transform: none;
  }
  
  .goal-tracker:active,
  .goal-item:active {
    transform: translateY(-2px) translateZ(0);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .goal-tracker,
  .goal-item,
  .progress-fill {
    transition: none;
    transform: none !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .goal-tracker,
  .goal-item {
    border: 2px solid CanvasText;
  }
  
  .goal-icon,
  .goal-status {
    border: 2px solid CanvasText;
  }
}

/* Print Styles */
@media print {
  .goal-tracker {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .goal-item {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .goal-icon,
  .goal-status {
    border: 1px solid #000;
  }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
