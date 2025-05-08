<template>
  <div class="budget-summary">
    <h2 class="text-lg font-semibold mb-3 text-gray-800 flex items-center">
      <span class="material-icons mr-2 text-purple-500 text-sm">summarize</span>
      Budget Summary
    </h2>
    <div class="border-t border-gray-200 pt-3">
      <div class="space-y-4">
        <!-- Revenue Summary -->
        <div class="revenue-summary">
          <h3 class="text-sm font-medium text-gray-700 mb-2">
            Revenue Summary
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Target Revenue -->
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span class="text-xs text-gray-600">Target Revenue:</span>
              <div class="flex items-center">
                <div
                  v-if="!editingTarget"
                  class="flex items-center"
                >
                  <span class="text-xs font-medium mr-1">${{ targetRevenueDisplay }}B</span>
                  <button 
                    v-if="budgetStore.budgetGoals.enabled" 
                    class="text-blue-500 hover:text-blue-700"
                    @click="startEditingTarget"
                  >
                    <span class="material-icons text-xs">edit</span>
                  </button>
                </div>
                <div
                  v-else
                  class="flex items-center"
                >
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span class="text-gray-500 text-xs">$</span>
                    </div>
                    <input 
                      ref="targetInput" 
                      v-model.number="editableTargetRevenue"
                      type="number"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-20 pl-5 pr-8 text-xs border-gray-300 rounded-md"
                      step="0.1"
                      @keyup.enter="saveTargetRevenue"
                    >
                    <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span class="text-gray-500 text-xs">B</span>
                    </div>
                  </div>
                  <div class="flex ml-1">
                    <button
                      class="text-green-500 hover:text-green-700 mr-1"
                      @click="saveTargetRevenue"
                    >
                      <span class="material-icons text-xs">check</span>
                    </button>
                    <button
                      class="text-red-500 hover:text-red-700"
                      @click="cancelEditingTarget"
                    >
                      <span class="material-icons text-xs">close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Current Revenue -->
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span class="text-xs text-gray-600">Current Revenue:</span>
              <div class="flex items-center">
                <span class="text-xs font-medium">${{ budgetStore.totalRevenue.toFixed(1) }}B</span>
                <span 
                  v-if="budgetStore.budgetGoals.enabled && budgetStore.budgetGoals.targetRevenue" 
                  class="ml-1 text-sm"
                  :class="statusClass"
                >
                  {{ statusIcon }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Revenue Sources Breakdown -->
          <div class="mt-3">
            <div class="text-xs text-gray-600 mb-1">
              Top Revenue Sources:
            </div>
            <div class="space-y-1">
              <div 
                v-for="source in topRevenueSources" 
                :key="source.id" 
                class="flex justify-between items-center text-xs"
              >
                <div class="flex items-center">
                  <div 
                    class="w-2 h-2 rounded-full mr-1" 
                    :style="{ backgroundColor: source.color }"
                  />
                  <span>{{ source.name }}</span>
                </div>
                <span>${{ (source.rate * source.base).toFixed(1) }}B</span>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500 italic">
              Note: Personal Income Tax reflects the average effective rate across all brackets.
            </div>
          </div>
        </div>
        
        <!-- Spending Summary -->
        <div class="spending-summary mt-3 pt-3 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">
            Spending Summary
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span class="text-xs text-gray-600">Total Spending:</span>
              <span class="text-xs font-medium">${{ budgetStore.totalSpending.toFixed(1) }}B</span>
            </div>
            
            <!-- Target Deficit/Surplus -->
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span class="text-xs text-gray-600">Target {{ budgetStore.budgetGoals.targetDeficit >= 0 ? 'Deficit' : 'Surplus' }}:</span>
              <div class="flex items-center">
                <div
                  v-if="!editingDeficit"
                  class="flex items-center"
                >
                  <span class="text-xs font-medium mr-1">{{ targetDeficitDisplay }}</span>
                  <button 
                    v-if="budgetStore.budgetGoals.enabled" 
                    class="text-blue-500 hover:text-blue-700"
                    @click="startEditingDeficit"
                  >
                    <span class="material-icons text-xs">edit</span>
                  </button>
                </div>
                <div
                  v-else
                  class="flex items-center"
                >
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span class="text-gray-500 text-xs">$</span>
                    </div>
                    <input 
                      ref="deficitInput" 
                      v-model.number="editableTargetDeficit"
                      type="number"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-20 pl-5 pr-8 text-xs border-gray-300 rounded-md"
                      step="0.1"
                      @keyup.enter="saveTargetDeficit"
                    >
                    <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span class="text-gray-500 text-xs">B</span>
                    </div>
                  </div>
                  <div class="flex ml-1">
                    <button
                      class="text-green-500 hover:text-green-700 mr-1"
                      @click="saveTargetDeficit"
                    >
                      <span class="material-icons text-xs">check</span>
                    </button>
                    <button
                      class="text-red-500 hover:text-red-700"
                      @click="cancelEditingDeficit"
                    >
                      <span class="material-icons text-xs">close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <span class="text-xs text-gray-600">Current Balance:</span>
              <span 
                class="text-xs font-medium" 
                :class="{ 
                  'text-green-600': budgetStore.surplus > 0,
                  'text-red-600': budgetStore.surplus < 0,
                  'text-gray-600': budgetStore.surplus === 0
                }"
              >
                {{ budgetStore.surplus > 0 ? '+' : '' }}${{ budgetStore.surplus.toFixed(1) }}B
              </span>
            </div>
            
            <div
              v-if="budgetStore.budgetGoals.enabled && budgetStore.budgetGoals.targetDeficit !== null" 
              class="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span class="text-xs text-gray-600">Goal Status:</span>
              <div class="flex items-center">
                <span
                  class="text-xs font-medium"
                  :class="{
                    'text-green-600': budgetStore.deficitGoalStatus.status === 'success',
                    'text-yellow-600': budgetStore.deficitGoalStatus.status === 'warning',
                    'text-red-600': budgetStore.deficitGoalStatus.status === 'danger'
                  }"
                >
                  {{ budgetStore.deficitGoalStatus.message }}
                </span>
                <span 
                  class="ml-1 text-sm"
                  :class="{
                    'text-green-600': budgetStore.deficitGoalStatus.status === 'success',
                    'text-yellow-600': budgetStore.deficitGoalStatus.status === 'warning',
                    'text-red-600': budgetStore.deficitGoalStatus.status === 'danger'
                  }"
                >
                  {{ budgetStore.deficitGoalStatus.icon }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Export Options -->
        <!-- Achievement Badges Section -->
        <div class="achievement-badges mt-3 pt-3 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <span class="material-icons mr-2 text-amber-500 text-sm">emoji_events</span>
            Budget Achievements
          </h3>
          <div class="flex flex-wrap justify-center gap-3 my-3">
            <div
              v-if="earnedBadges.length > 0"
              class="flex flex-wrap justify-center gap-3"
            >
              <AchievementBadge 
                v-for="badge in earnedBadges" 
                :key="badge.title" 
                :badge="badge" 
                size="medium"
                :show-tooltip="true"
              />
            </div>
            <div
              v-else
              class="text-center py-3 px-4 bg-gray-50 rounded-md w-full"
            >
              <p class="text-sm text-gray-500">
                Make budget adjustments to earn achievement badges!
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-3 pt-3 border-t border-gray-200">
          <button 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Export Budget Summary
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Export Budget PDF Panel -->
  <ExportPanel />
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useBudgetSimulatorStore } from '../stores/budgetSimulator.js';
import ExportPanel from './budget/ExportPanel.vue';
import AchievementBadge from './AchievementBadge.vue';

// Initialize the budget simulator store
const budgetStore = useBudgetSimulatorStore();

// State for inline editing
const editingTarget = ref(false);
const editableTargetRevenue = ref(0);
const targetInput = ref(null);

const editingDeficit = ref(false);
const editableTargetDeficit = ref(0);
const deficitInput = ref(null);

// Computed properties
const targetRevenueDisplay = computed(() => {
  if (budgetStore.budgetGoals.enabled && budgetStore.budgetGoals.targetRevenue !== null) {
    return budgetStore.budgetGoals.targetRevenue.toFixed(1);
  }
  return 'Not set';
});

const targetDeficitDisplay = computed(() => {
  if (budgetStore.budgetGoals.enabled && budgetStore.budgetGoals.targetDeficit !== null) {
    const prefix = budgetStore.budgetGoals.targetDeficit >= 0 ? '+' : '';
    return `${prefix}$${budgetStore.budgetGoals.targetDeficit.toFixed(1)}B`;
  }
  return 'Not set';
});

// Get earned badges from the store
const earnedBadges = computed(() => budgetStore.earnedBadges);

const percentOfGoal = computed(() => {
  if (!budgetStore.budgetGoals.targetRevenue) return 0;
  return (budgetStore.totalRevenue / budgetStore.budgetGoals.targetRevenue) * 100;
});

const statusIcon = computed(() => {
  if (percentOfGoal.value >= 95 && percentOfGoal.value <= 105) {
    return '✅';
  } else if (percentOfGoal.value >= 90 && percentOfGoal.value < 95 || 
             percentOfGoal.value > 105 && percentOfGoal.value <= 110) {
    return '⚠️';
  } else {
    return '❌';
  }
});

const statusClass = computed(() => {
  if (percentOfGoal.value >= 95 && percentOfGoal.value <= 105) {
    return 'text-green-600';
  } else if (percentOfGoal.value >= 90 && percentOfGoal.value < 95 || 
             percentOfGoal.value > 105 && percentOfGoal.value <= 110) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
});

// Deficit goal status
/* Commenting out unused computed property to fix ESLint error
const deficitPercentOfGoal = computed(() => {
  if (!budgetStore.budgetGoals.targetDeficit) return 100;
  return (budgetStore.surplus / Math.abs(budgetStore.budgetGoals.targetDeficit)) * 100;
});
*/

/* Commenting out unused computed properties to fix ESLint errors
const deficitStatusIcon = computed(() => {
  if (!budgetStore.budgetGoals.targetDeficit) return '';
  
  // Check if signs match (both positive or both negative)
  const signsMatch = Math.sign(budgetStore.surplus) === Math.sign(budgetStore.budgetGoals.targetDeficit) ||
                    budgetStore.budgetGoals.targetDeficit === 0;
  
  if (!signsMatch) {
    return '❌';
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return '✅';
  } else if (Math.abs(deficitPercentOfGoal.value - 100) <= 10) {
    return '⚠️';
  } else {
    return '❌';
  }
});

const deficitStatusClass = computed(() => {
  if (!budgetStore.budgetGoals.targetDeficit) return '';
  
  // Check if signs match (both positive or both negative)
  const signsMatch = Math.sign(budgetStore.surplus) === Math.sign(budgetStore.budgetGoals.targetDeficit) ||
                    budgetStore.budgetGoals.targetDeficit === 0;
  
  if (!signsMatch) {
    return 'text-red-600';
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return 'text-green-600';
  } else if (Math.abs(deficitPercentOfGoal.value - 100) <= 10) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
});

const deficitStatusText = computed(() => {
  if (!budgetStore.budgetGoals.targetDeficit) return '';
  
  // Check if signs match (both positive or both negative)
  const signsMatch = Math.sign(budgetStore.surplus) === Math.sign(budgetStore.budgetGoals.targetDeficit) ||
                    budgetStore.budgetGoals.targetDeficit === 0;
  
  if (!signsMatch) {
    return 'Off target';
  }
  
  if (Math.abs(deficitPercentOfGoal.value - 100) <= 5) {
    return 'On target';
  } else {
    const diff = Math.abs(budgetStore.surplus - budgetStore.budgetGoals.targetDeficit).toFixed(1);
    return `${budgetStore.surplus > budgetStore.budgetGoals.targetDeficit ? 'Over' : 'Under'} by $${diff}B`;
  }
});
*/

// Get top 3 revenue sources by value
const topRevenueSources = computed(() => {
  return Object.values(budgetStore.revenueSources)
    .sort((a, b) => (b.rate * b.base) - (a.rate * a.base))
    .slice(0, 3);
});

// Methods for inline editing
function startEditingTarget() {
  editableTargetRevenue.value = budgetStore.budgetGoals.targetRevenue || 0;
  editingTarget.value = true;
  nextTick(() => {
    targetInput.value?.focus();
  });
}

function saveTargetRevenue() {
  if (editableTargetRevenue.value !== null && editableTargetRevenue.value >= 0) {
    budgetStore.updateBudgetGoals({ targetRevenue: editableTargetRevenue.value });
  }
  editingTarget.value = false;
}

function cancelEditingTarget() {
  editingTarget.value = false;
}

function startEditingDeficit() {
  editableTargetDeficit.value = budgetStore.budgetGoals.targetDeficit || 0;
  editingDeficit.value = true;
  nextTick(() => {
    deficitInput.value?.focus();
  });
}

function saveTargetDeficit() {
  if (editableTargetDeficit.value !== null) {
    budgetStore.updateBudgetGoals({ targetDeficit: editableTargetDeficit.value });
  }
  editingDeficit.value = false;
}

function cancelEditingDeficit() {
  editingDeficit.value = false;
}
</script>

<style scoped>
/* Custom styles for budget summary */
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
