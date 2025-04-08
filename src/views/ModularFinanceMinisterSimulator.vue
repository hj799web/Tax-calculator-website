<template>
  <div class="finance-minister-simulator">
    <div class="main-container">
      <h1 class="main-title">
        Budget Simulator: Be the Finance Minister
      </h1>

      <!-- Year Selector -->
      <YearSelector 
        :current-year="currentYear" 
        @year-selected="selectYear" 
      />

      <div class="simulator-grid">
        <!-- Budget Goals Section -->
        <section class="simulator-card goals-card">
          <h2 class="card-title">
            <span class="material-icons icon">flag</span>
            Budget Goals
          </h2>
          <div class="card-content">
            <GoalTracker 
              :current-revenue="budgetStore.totalRevenue"
              :current-spending="budgetStore.totalSpending"
              :initial-goals="budgetStore.budgetGoals"
              :surplus="budgetStore.surplus"
              @goal-status-changed="updateGoalStatus"
              @auto-balance-toggled="toggleAutoBalance"
            />
          </div>
        </section>

        <!-- Budget Results Section -->
        <BudgetResults 
          :auto-balance-active="autoBalanceActive"
          @reset-budget="resetBudget"
          @toggle-auto-balance="toggleAutoBalance"
          @save-budget="saveBudget"
        />
        
        <!-- Budget Presets Section -->
        <PresetSelector
          @preset-applied="handlePresetApplied"
          @preset-reset="resetBudget"
        />

        <!-- Revenue Sources Section -->
        <section class="simulator-card revenue-card">
          <h2 class="card-title">
            <span class="material-icons icon">payments</span>
            Revenue Sources
          </h2>
          <div class="card-content">
            <RevenueSliders :auto-balance-active="autoBalanceActive" />
          </div>
        </section>

        <!-- Spending Controls Section -->
        <SpendingControls 
          :main-categories="mainCategories"
          :other-categories-groups="otherCategoriesGroups"
          :sorted-gov-ops-children="sortedGovOpsChildren"
          :spending-factors="spendingFactors"
          :auto-balance-active="autoBalanceActive"
          :expanded-groups="expandedGroups"
          :total-main-categories="budgetStore.mainCategoriesSpending"
          :total-other-categories="budgetStore.otherCategoriesTotal"
          :total-gov-ops="budgetStore.governmentOperationsSpending"
          :total-spending="budgetStore.totalSpending"
          :get-group-children="budgetStore.getGroupChildren"
          :tax-expenditures="taxExpenditures"
          :total-tax-expenditures="totalTaxExpenditures"
          :tax-expenditure-revenue-impact="taxExpenditureRevenueImpact"
          @update-spending-factor="updateSpendingFactor"
          @update-group-spending-factor="updateGroupSpendingFactor"
          @toggle-group-expansion="toggleGroupExpansion"
          @reset-gov-ops="resetGovOpsSubcategories"
          @reset-other-categories="resetOtherCategoriesSubcategories"
          @update-tax-expenditure-adjustment="updateTaxExpenditureAdjustment"
          @reset-tax-expenditure="resetTaxExpenditure"
          @reset-all-tax-expenditures="resetAllTaxExpenditures"
        />

        <!-- Charts Panel -->
        <section class="simulator-card charts-card">
          <ChartsPanel />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBudgetSimulatorStore } from '../stores/budgetSimulator.js';
import { storeToRefs } from 'pinia';
import RevenueSliders from '../components/RevenueSliders.vue';
import GoalTracker from '../components/GoalTracker.vue';
import ChartsPanel from '../components/ChartsPanel.vue';
import YearSelector from '../components/budget/YearSelector.vue';
import BudgetResults from '../components/budget/BudgetResults.vue';
import SpendingControls from '../components/budget/SpendingControls.vue';
import PresetSelector from '../components/PresetSelector.vue';

// Initialize store and local state
const budgetStore = useBudgetSimulatorStore();
const { 
  spendingCategories, 
  taxExpenditures, 
  totalTaxExpenditures, 
  taxExpenditureRevenueImpact 
} = storeToRefs(budgetStore);

// Initialize local state
const currentYear = ref(budgetStore.currentYear);
const expandedGroups = ref({
  mainCategories: true,
  otherCategories: false,
  governmentOperations: false,
  taxExpenditures: true
});
const spendingFactors = ref({});
const autoBalanceActive = ref(false);

// Computed property for fiscal year display
// eslint-disable-next-line no-unused-vars
const fiscalYear = computed(() => {
  return `${currentYear.value - 1}-${currentYear.value}`;
});

function selectYear(year) {
  currentYear.value = year;
  budgetStore.setCurrentYear(year);
  initializeLocalValues();
}

const mainCategories = computed(() => {
  return Object.values(budgetStore.spendingCategories)
    .filter(category => !category.isGroup)
    .sort((a, b) => a.id - b.id);
});

const otherCategoriesGroups = computed(() => {
  return Object.values(budgetStore.spendingCategories)
    .filter(category => category.isGroup && category.id !== 9)
    .sort((a, b) => a.id - b.id);
});

const sortedGovOpsChildren = computed(() => {
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    // Use a more reliable sorting method for decimal IDs
    return Object.values(govOps.children).sort((a, b) => {
      // First convert to string and split by decimal point
      const aParts = a.id.toString().split('.');
      const bParts = b.id.toString().split('.');
      
      // Compare the integer part first
      const aInt = parseInt(aParts[0]);
      const bInt = parseInt(bParts[0]);
      if (aInt !== bInt) return aInt - bInt;
      
      // If integer parts are the same, compare decimal parts
      const aDecimal = aParts.length > 1 ? parseInt(aParts[1]) : 0;
      const bDecimal = bParts.length > 1 ? parseInt(bParts[1]) : 0;
      return aDecimal - bDecimal;
    });
  }
  return [];
});

function initializeLocalValues() {
  Object.values(budgetStore.spendingCategories).forEach(category => {
    if (!category.isGroup) {
      spendingFactors.value[category.id] = Math.round((category.adjustmentFactor || 1) * 100) || 100;
    } else if (category.children) {
      spendingFactors.value[category.id] = Math.round(budgetStore.getGroupFactor(category.id) * 100) || 100;
      Object.values(category.children).forEach(child => {
        spendingFactors.value[child.id] = Math.round((child.adjustmentFactor || 1) * 100) || 100;
      });
    }
  });
  // Ensure Government Operations subcategories are initialized
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    Object.values(govOps.children).forEach(child => {
      if (spendingFactors.value[child.id] === undefined) {
        spendingFactors.value[child.id] = 100;
      }
    });
  }
}

function toggleGroupExpansion(groupId) {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId];
}

function updateSpendingFactor(categoryId, value) {
  const factor = value / 100;
  budgetStore.updateSpendingFactor(categoryId, factor);
  if (autoBalanceActive.value) {
    budgetStore.autoBalanceBudget();
  }
}

function updateGroupSpendingFactor(groupId, value) {
  const factor = value / 100;
  budgetStore.updateGroupSpendingFactor(groupId, factor);
  if (autoBalanceActive.value) {
    budgetStore.autoBalanceBudget();
  }
}

function toggleAutoBalance() {
  if (autoBalanceActive.value) {
    budgetStore.autoBalanceBudget();
  }
}

function resetBudget() {
  budgetStore.resetBudget();
  initializeLocalValues();
}

function saveBudget() {
  budgetStore.syncToLocalStorage();
  alert('Budget saved successfully!');
}

function updateGoalStatus(statusData) {
  budgetStore.updateGoalStatus(statusData);
}

function resetGovOpsSubcategories() {
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    Object.values(govOps.children).forEach(child => {
      spendingFactors.value[child.id] = 100;
      budgetStore.updateSpendingFactor(child.id, 1);
    });
  }
}

function resetOtherCategoriesSubcategories() {
  otherCategoriesGroups.value.forEach(group => {
    const children = budgetStore.getGroupChildren(group.id);
    if (children) {
      Object.values(children).forEach(child => {
        spendingFactors.value[child.id] = 100;
        budgetStore.updateSpendingFactor(child.id, 1);
      });
    }
  });
}

function updateTaxExpenditureAdjustment(expenditureId, value) {
  console.log('Updating tax expenditure adjustment:', expenditureId, value);
  budgetStore.updateTaxExpenditureAdjustment(expenditureId, value);
  console.log('Updated tax expenditure adjustment:', expenditureId, value);
}

function resetTaxExpenditure(expenditureId) {
  console.log('Resetting tax expenditure:', expenditureId);
  budgetStore.updateTaxExpenditureAdjustment(expenditureId, 0);
  console.log('Reset tax expenditure:', expenditureId);
}

function resetAllTaxExpenditures() {
  console.log('Resetting all tax expenditures');
  budgetStore.resetTaxExpenditures();
  console.log('All tax expenditures reset');
  // Force UI update
  lastUpdate.value = Date.now();
}

function handlePresetApplied(presetKey) {
  console.log(`Applied budget preset: ${presetKey}`);
  // Force UI update
  lastUpdate.value = Date.now();
}

watch([() => budgetStore.spendingCategories, () => budgetStore.taxExpenditures], () => {
  initializeLocalValues();
}, { deep: true });

onMounted(() => {
  budgetStore.initializeStore();
  initializeLocalValues();
  
  // Log the tax expenditures to verify they're loaded
  console.log('Tax Expenditures on mount:', taxExpenditures.value);
  console.log('Budget Store direct access:', budgetStore.taxExpenditures);
});
</script>

<style scoped>
.finance-minister-simulator {
  padding: 1rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 1.5rem;
}

.simulator-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto auto auto;
  gap: 1.5rem;
}

.simulator-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.goals-card {
  grid-column: 1;
  grid-row: 1;
}

.results-card {
  grid-column: 1;
  grid-row: 2;
}

.revenue-card {
  grid-column: 1;
  grid-row: 3;
}

.spending-card {
  grid-column: 2;
  grid-row: 1 / span 3;
  min-height: 1200px;
  display: flex;
  flex-direction: column;
}

.charts-card {
  grid-column: 1 / span 2;
  grid-row: 4;
}

.card-title {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.card-title .icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
  color: #4263eb;
}

.card-content {
  padding: 1rem;
}

@media (max-width: 768px) {
  .simulator-grid {
    grid-template-columns: 1fr;
  }
  
  .goals-card,
  .results-card,
  .revenue-card,
  .spending-card,
  .charts-card {
    grid-column: 1;
  }
  
  .goals-card { grid-row: 1; }
  .results-card { grid-row: 2; }
  .revenue-card { grid-row: 3; }
  .spending-card { grid-row: 4; }
  .charts-card { grid-row: 5; }
}
</style>
