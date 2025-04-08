<template>
  <section class="simulator-card spending-card w-full" style="min-height: 1440px; display: flex; flex-direction: column;">
    <h2 class="card-title">
      <span class="material-icons icon">payments</span>
      Spending Controls
    </h2>
    <div class="card-content w-full" style="flex-grow: 1;">
      <div class="w-full overflow-y-auto pr-2" style="height: 100%;">
        <!-- Main Categories Group -->
        <CategoryGroup
          title="Main Categories"
          :total-amount="totalMainCategories"
          :expanded="expandedGroups.mainCategories"
          group-id="mainCategories"
          @toggle="toggleGroup"
        >
          <div class="main-categories-info">
            <p>Adjust spending for major federal budget categories. Increasing percentages raises spending, while decreasing them reduces spending.</p>
          </div>
          <div class="main-categories-grid">
            <div v-for="category in mainCategoriesList" :key="category.id" class="main-category-item">
              <div class="main-category-header">
                <h4>{{ category.name }}</h4>
                <div class="main-category-base">
                  Base: ${{ formatAmount(category.baseAmount) }}B
                  <CategoryInfo
                    :name="category.name"
                    :description="category.description || ''"
                    :base-amount="category.baseAmount"
                    :current-setting="validSpendingFactors[category.id]"
                  />
                </div>
              </div>
              <div class="main-category-content">
                <div class="main-category-controls">
                  <PercentageInput
                    :id="`spending-${category.id}`"
                    :model-value="validSpendingFactors[category.id]"
                    :disabled="autoBalanceActive"
                    :base-amount="category.baseAmount"
                    @update:model-value="updateCategoryAdjustment(category.id, $event)"
                    class="main-category-percentage-input"
                  />
                  <button 
                    class="reset-button" 
                    @click="updateCategoryAdjustment(category.id, 100)"
                    title="Reset to baseline"
                  >
                    Reset
                  </button>
                </div>
                <div class="main-category-impact">
                  <div class="impact-label">Current:</div>
                  <div class="impact-value" :class="validSpendingFactors[category.id] > 100 ? 'text-green-600' : validSpendingFactors[category.id] < 100 ? 'text-red-600' : 'text-gray-600'">
                    ${{ formatAmount(category.baseAmount * validSpendingFactors[category.id] / 100) }}B
                    ({{ validSpendingFactors[category.id] > 100 ? '+' : ''}}{{ (validSpendingFactors[category.id] - 100).toFixed(0) }}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CategoryGroup>

        <!-- Other Categories Group -->
        <CategoryGroup
          title="Other Categories"
          :total-amount="totalOtherCategories"
          :expanded="expandedGroups.otherCategories"
          group-id="otherCategories"
          @toggle="toggleGroup"
        >
          <div v-if="expandedGroups.otherCategories" class="w-full">
            <div class="other-categories-info">
              <p>Adjust spending for additional federal budget categories. These categories represent specialized programs and investments.</p>
            </div>
            <div class="other-categories-grid">
              <div v-for="group in otherCategoriesGroups.filter(g => g.id !== 'governmentOperations' && g.id !== 'loansInvestments')" :key="group.id" class="other-category-item">
                <div class="other-category-header">
                  <h4>{{ group.name }}</h4>
                  <div class="other-category-base">
                    Base: ${{ formatAmount(group.baseAmount) }}B
                    <CategoryInfo
                      :name="group.name"
                      :description="group.description || ''"
                      :base-amount="group.baseAmount"
                      :current-setting="validSpendingFactors[group.id]"
                    />
                  </div>
                </div>
                <div class="other-category-content">
                  <div class="other-category-controls">
                    <PercentageInput
                      :id="`spending-${group.id}`"
                      :model-value="validSpendingFactors[group.id]"
                      :disabled="autoBalanceActive"
                      :base-amount="group.baseAmount"
                      @update:model-value="updateCategoryAdjustment(group.id, $event)"
                      class="other-category-percentage-input"
                    />
                    <button 
                      class="reset-button" 
                      @click="updateCategoryAdjustment(group.id, 100)"
                      title="Reset to baseline"
                    >
                      Reset
                    </button>
                  </div>
                  <div class="other-category-impact">
                    <div class="impact-label">Current:</div>
                    <div class="impact-value" :class="validSpendingFactors[group.id] > 100 ? 'text-green-600' : validSpendingFactors[group.id] < 100 ? 'text-red-600' : 'text-gray-600'">
                      ${{ formatAmount(group.baseAmount * validSpendingFactors[group.id] / 100) }}B
                      ({{ validSpendingFactors[group.id] > 100 ? '+' : ''}}{{ (validSpendingFactors[group.id] - 100).toFixed(0) }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Subcategories in a separate grid below -->
            <div class="mt-4 w-full">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Subcategories</h4>
              <div class="grid grid-cols-1 gap-4 w-full">
                <!-- Display Loans, Investments & Advances subcategories -->
                <div class="w-full mb-4">
                  <div class="text-sm font-medium text-gray-700 mb-3 border-b border-gray-200 pb-1">Loans, Investments & Advances Subcategories</div>
                  <div class="subcategories-grid">
                    <div v-for="child in getGroupChildren('loansInvestments')" :key="child.id" class="subcategory-item">
                      <div class="subcategory-header">
                        <h4>{{ child.name }}</h4>
                        <div class="subcategory-base">
                          Base: ${{ formatAmount(child.baseAmount) }}B
                          <CategoryInfo
                            :name="child.name"
                            :description="child.description || ''"
                            :base-amount="child.baseAmount"
                            :current-setting="validSpendingFactors[child.id]"
                          />
                        </div>
                      </div>
                      <div class="subcategory-content">
                        <div class="subcategory-controls">
                          <PercentageInput
                            :id="`spending-${child.id}`"
                            :model-value="validSpendingFactors[child.id]"
                            :disabled="autoBalanceActive"
                            :base-amount="child.baseAmount"
                            @update:model-value="updateCategoryAdjustment(child.id, $event)"
                            class="subcategory-percentage-input"
                          />
                          <button 
                            class="reset-button" 
                            @click="updateCategoryAdjustment(child.id, 100)"
                            title="Reset to baseline"
                          >
                            Reset
                          </button>
                        </div>
                        <div class="subcategory-impact">
                          <div class="impact-label">Current:</div>
                          <div class="impact-value" :class="validSpendingFactors[child.id] > 100 ? 'text-green-600' : validSpendingFactors[child.id] < 100 ? 'text-red-600' : 'text-gray-600'">
                            ${{ formatAmount(child.baseAmount * validSpendingFactors[child.id] / 100) }}B
                            ({{ validSpendingFactors[child.id] > 100 ? '+' : ''}}{{ (validSpendingFactors[child.id] - 100).toFixed(0) }}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Add other groups with subcategories here if needed -->
              </div>
            </div>
            
            <!-- Reset button for Other Categories -->
            <div class="mt-2 flex justify-end">
              <button class="action-button reset-button" @click="resetOtherCategories">
                Reset Other Categories
              </button>
            </div>
          </div>
        </CategoryGroup>

        <!-- Government Operations Group -->
        <CategoryGroup
          title="Government Operations"
          :total-amount="totalGovOps"
          :expanded="expandedGroups.governmentOperations"
          group-id="governmentOperations"
          @toggle="toggleGroup"
        >
          <div v-if="expandedGroups.governmentOperations" class="w-full">
            <div class="gov-ops-info mb-3">
              <p>Government operations include administrative functions, transfers, and other essential government services.</p>
            </div>
            
            <div class="gov-ops-grid">
              <div v-for="child in sortedGovOpsChildren" :key="child.id" class="gov-ops-item">
                <div class="gov-ops-header">
                  <h4 :title="child.name">{{ child.name }}</h4>
                  <div class="gov-ops-base">
                    Base: ${{ formatAmount(child.baseAmount) }}B
                    <CategoryInfo
                      :name="child.name"
                      :description="''"
                      :base-amount="child.baseAmount"
                      :current-setting="validSpendingFactors[child.id]"
                    />
                  </div>
                </div>
                <div class="gov-ops-content">
                  <div class="gov-ops-description" v-if="child.description">
                    {{ child.description }}
                  </div>
                  <div class="gov-ops-controls">
                    <PercentageInput
                      :id="`spending-${child.id}`"
                      :model-value="validSpendingFactors[child.id]"
                      :disabled="autoBalanceActive"
                      :base-amount="child.baseAmount"
                      @update:model-value="updateCategoryAdjustment(child.id, $event)"
                      class="gov-ops-percentage-input"
                    />
                    <button 
                      class="reset-button gov-ops-reset" 
                      @click="updateCategoryAdjustment(child.id, 100)"
                      title="Reset to baseline"
                    >
                      <span class="material-icons" style="font-size: 14px;">restart_alt</span>
                    </button>
                  </div>
                  <div class="gov-ops-impact">
                    <div class="impact-label">Current:</div>
                    <div class="impact-value" :class="validSpendingFactors[child.id] > 100 ? 'text-green-600' : validSpendingFactors[child.id] < 100 ? 'text-red-600' : 'text-gray-600'">
                      ${{ formatAmount(child.baseAmount * validSpendingFactors[child.id] / 100) }}B
                      ({{ validSpendingFactors[child.id] > 100 ? '+' : ''}}{{ (validSpendingFactors[child.id] - 100).toFixed(0) }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reset button for Government Operations -->
            <div class="mt-4 flex justify-end">
              <button class="action-button reset-button" @click="resetGovernmentOperations">
                Reset Government Ops
              </button>
            </div>
          </div>
        </CategoryGroup>

        <!-- Tax Expenditures / Tax Credits Group -->
        <CategoryGroup
          title="Tax Expenditures / Tax Credits"
          :total-amount="totalTaxExpenditures"
          :expanded="expandedGroups.taxExpenditures"
          group-id="taxExpenditures"
          @toggle="toggleGroup"
        >
          <div class="tax-expenditures-info">
            <p>Adjust tax credits and deductions to see their impact on federal revenue. Reducing credits increases revenue, while expanding them decreases revenue.</p>
          </div>
          <div class="tax-expenditures-grid">
            <div v-for="expenditure in taxExpendituresArray" :key="expenditure.id" class="tax-expenditure-item">
              <div class="tax-expenditure-header">
                <h4>{{ expenditure.name }}</h4>
                <div class="tax-expenditure-base">
                  Base: ${{ formatAmount(expenditure.netAmount) }}B
                  <CategoryInfo
                    :name="expenditure.name"
                    :description="expenditure.description || 'No description available.'"
                    :base-amount="expenditure.netAmount"
                    :current-setting="expenditure.adjustmentFactor"
                  />
                </div>
              </div>
              <div class="tax-expenditure-content">
                <div class="tax-expenditure-description">
                  {{ expenditure.description }}
                </div>
                <div class="tax-expenditure-controls">
                  <PercentageInput
                    :model-value="expenditure.adjustmentFactor"
                    :min="expenditure.minAdjustment"
                    :max="expenditure.maxAdjustment"
                    :base-amount="expenditure.netAmount"
                    @update:model-value="handleTaxExpenditureUpdate(expenditure.id, $event)"
                  />
                  <button 
                    class="reset-button" 
                    @click="resetTaxExpenditure(expenditure.id)"
                    title="Reset to baseline"
                  >
                    Reset
                  </button>
                </div>
                <div class="tax-expenditure-impact">
                  <div class="impact-label">Revenue Impact:</div>
                  <div class="impact-value" :class="getImpactClass(expenditure)">
                    {{ getImpactPrefix(expenditure) }}${{ formatAmount(calculateImpact(expenditure)) }}B
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tax-expenditures-summary">
            <div class="summary-header">
              <h4>Total Impact on Revenue</h4>
              <button class="reset-all-button" @click="resetAllTaxExpenditures">Reset All</button>
            </div>
            <div class="stacked-bar">
              <div 
                v-for="expenditure in taxExpendituresArray" 
                :key="expenditure.id"
                class="stacked-bar-segment"
                :style="{ 
                  width: `${getImpactPercentage(expenditure)}%`, 
                  backgroundColor: expenditure.color,
                  marginLeft: getImpactPercentage(expenditure) < 0 ? 'auto' : '0'
                }"
                :title="`${expenditure.name}: ${getImpactPrefix(expenditure)}$${formatAmount(calculateImpact(expenditure))}B`"
              ></div>
            </div>
            <div class="summary-total">
              <span>Net Revenue Change:</span>
              <span :class="getTotalImpactClass()">
                {{ getTotalImpactPrefix() }}${{ formatAmount(Math.abs(budgetStore.taxExpenditureRevenueImpact)) }}B
              </span>
            </div>
          </div>
        </CategoryGroup>

        <!-- Total Spending Summary -->
        <div class="mt-4 p-3 bg-gray-100 rounded-md w-full">
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-800">Total Spending:</span>
            <span class="text-sm font-semibold text-red-600">{{ formatCurrency(totalSpending) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';
import CategoryGroup from './CategoryGroup.vue';
// eslint-disable-next-line no-unused-vars
import SpendingCategory from './SpendingCategory.vue';
import PercentageInput from './PercentageInput.vue';
import CategoryInfo from './CategoryInfo.vue';

// Define props
const props = defineProps({
  mainCategories: {
    type: Array,
    default: () => []
  },
  otherCategoriesGroups: {
    type: Array,
    default: () => []
  },
  sortedGovOpsChildren: {
    type: Array,
    default: () => []
  },
  spendingFactors: {
    type: Object,
    default: () => ({})
  },
  autoBalanceActive: {
    type: Boolean,
    default: false
  },
  expandedGroups: {
    type: Object,
    default: () => ({
      mainCategories: true,
      otherCategories: false,
      governmentOperations: false,
      taxExpenditures: true
    })
  },
  totalMainCategories: {
    type: Number,
    default: 0
  },
  totalOtherCategories: {
    type: Number,
    default: 0
  },
  totalGovOps: {
    type: Number,
    default: 0
  },
  totalSpending: {
    type: Number,
    default: 0
  },
  getGroupChildren: {
    type: Function,
    default: () => []
  },
  taxExpenditures: {
    type: Object,
    default: () => ({})
  },
  totalTaxExpenditures: {
    type: Number,
    default: 0
  },
  taxExpenditureRevenueImpact: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits([
  'update-spending-factor',
  'update-group-spending-factor',
  'toggle-group-expansion',
  'reset-gov-ops',
  'reset-other-categories',
  'update-tax-expenditure-adjustment',
  'reset-tax-expenditure',
  'reset-all-tax-expenditures'
]);

// Use store for additional data if needed
const budgetStore = useBudgetSimulatorStore();

// Ensure we have valid spending factors for all categories
const validSpendingFactors = computed(() => {
  const result = { ...props.spendingFactors };
  
  // Initialize spending factors for main categories if missing
  mainCategoriesList.value.forEach(category => {
    if (result[category.id] === undefined) {
      result[category.id] = 100; // Default to 100%
    }
  });
  
  // Initialize spending factors for other categories if missing
  if (props.otherCategoriesGroups) {
    props.otherCategoriesGroups.forEach(group => {
      if (result[group.id] === undefined) {
        result[group.id] = 100; // Default to 100%
      }
      
      // Also initialize for children
      // Use props.getGroupChildren which is passed from the parent component
      const children = props.getGroupChildren(group.id);
      if (children) {
        children.forEach(child => {
          if (result[child.id] === undefined) {
            result[child.id] = 100; // Default to 100%
          }
        });
      }
    });
  }
  
  // Initialize spending factors for government operations if missing
  if (props.sortedGovOpsChildren) {
    props.sortedGovOpsChildren.forEach(child => {
      if (result[child.id] === undefined) {
        result[child.id] = 100; // Default to 100%
      }
    });
  }
  
  return result;
});

// Convert tax expenditures object to array for v-for
const taxExpendituresArray = computed(() => {
  // Log the tax expenditures to debug
  console.log('Tax Expenditures in SpendingControls:', props.taxExpenditures);
  
  // If props.taxExpenditures is empty or undefined, use the store directly
  if (!props.taxExpenditures || Object.keys(props.taxExpenditures).length === 0) {
    console.log('Using store tax expenditures directly');
    return Object.values(budgetStore.taxExpenditures);
  }
  
  return Object.values(props.taxExpenditures);
});

// Use props or fallback to store data
const mainCategoriesList = computed(() => {
  let categories = props.mainCategories && props.mainCategories.length > 0 
    ? props.mainCategories 
    : Object.values(budgetStore.spendingCategories).filter(category => category.group === 'main');
  
  // Filter out Loans, Investments & Advances and Government Operations
  return categories.filter(category => 
    category.id !== 'loansInvestments' && 
    category.id !== 'governmentOperations');
});

// eslint-disable-next-line no-unused-vars
const otherCategoriesList = computed(() => {
  return props.otherCategoriesGroups && props.otherCategoriesGroups.length > 0
    ? props.otherCategoriesGroups
    : Object.values(budgetStore.spendingCategories).filter(category => category.group === 'other');
});

// Methods
function toggleGroup(groupId) {
  emit('toggle-group-expansion', groupId);
}

function updateCategoryAdjustment(categoryId, value) {
  // Directly update the store like the Tax Expenditures section
  console.log('SpendingControls: updateCategoryAdjustment called with', categoryId, value);
  
  // Add a reactivity trigger similar to what was done in BudgetResults
  budgetStore.lastUpdate = Date.now();
  
  const factor = value / 100;
  budgetStore.updateSpendingFactor(categoryId, factor);
  
  // Also emit the event for backward compatibility
  emit('update-spending-factor', categoryId, value);
}

function resetOtherCategories() {
  console.log('SpendingControls: resetOtherCategories called');
  // Reset all other categories directly in the store
  Object.values(budgetStore.spendingCategories)
    .filter(category => category.group === 'other' && !category.isGroup)
    .forEach(category => {
      budgetStore.updateSpendingFactor(category.id, 1);
    });
  
  // Also reset any group children
  Object.values(budgetStore.spendingCategories)
    .filter(category => category.isGroup && category.id !== 'governmentOperations')
    .forEach(group => {
      if (group.children) {
        Object.values(group.children).forEach(child => {
          budgetStore.updateSpendingFactor(child.id, 1);
        });
      }
    });
  
  // Also emit the event for backward compatibility
  emit('reset-other-categories');
}

function resetGovernmentOperations() {
  console.log('SpendingControls: resetGovernmentOperations called');
  // Reset government operations directly in the store
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    Object.values(govOps.children).forEach(child => {
      budgetStore.updateSpendingFactor(child.id, 1);
    });
  }
  
  // Also emit the event for backward compatibility
  emit('reset-gov-ops');
}

function handleTaxExpenditureUpdate(expenditureId, value) {
  console.log('SpendingControls: handleTaxExpenditureUpdate called with', expenditureId, value);
  // Only use direct store update for simplicity and to avoid conflicts
  budgetStore.updateTaxExpenditureAdjustment(expenditureId, value);
}

function resetTaxExpenditure(expenditureId) {
  console.log('SpendingControls: resetTaxExpenditure called with', expenditureId);
  // Only use direct store update for simplicity and to avoid conflicts
  budgetStore.updateTaxExpenditureAdjustment(expenditureId, 0);
}

function resetAllTaxExpenditures() {
  console.log('SpendingControls: resetAllTaxExpenditures called');
  // Only use direct store update for simplicity and to avoid conflicts
  budgetStore.resetTaxExpenditures();
}

function formatCurrency(value) {
  return '$' + value.toFixed(1) + 'B';
}

function formatAmount(amount) {
  // Handle undefined, null, or non-numeric values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.0';
  }
  return amount.toFixed(1);
}

function calculateImpact(expenditure) {
  // Inverse relationship: negative adjustment means increased revenue
  return -1 * expenditure.netAmount * (expenditure.adjustmentFactor / 100);
}

function getImpactClass(expenditure) {
  // Negative adjustment factor means more revenue (positive impact)
  return expenditure.adjustmentFactor <= 0 ? 'positive-impact' : 'negative-impact';
}

function getImpactPrefix(expenditure) {
  // Negative adjustment factor means more revenue (positive impact)
  return expenditure.adjustmentFactor <= 0 ? '+' : '-';
}

function getImpactPercentage(expenditure) {
  // Calculate the percentage of this expenditure's impact relative to the total
  const impact = calculateImpact(expenditure);
  const totalImpact = Math.abs(props.taxExpenditureRevenueImpact);
  
  if (totalImpact === 0) return 0;
  
  // Return the percentage (positive or negative)
  return (impact / totalImpact) * 100 * (impact >= 0 ? 1 : -1);
}

function getTotalImpactClass() {
  // For total impact, positive value means increased revenue (positive impact)
  return budgetStore.taxExpenditureRevenueImpact >= 0 ? 'positive-impact' : 'negative-impact';
}

function getTotalImpactPrefix() {
  // For total impact, positive value means increased revenue (positive impact)
  return budgetStore.taxExpenditureRevenueImpact >= 0 ? '+' : '-';
}
</script>

<style scoped>
.simulator-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button {
  background-color: #e9ecef;
  color: #495057;
}

.reset-button:hover {
  background-color: #dee2e6;
}

.tax-expenditures-info,
.main-categories-info,
.other-categories-info {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.tax-expenditures-grid,
.main-categories-grid,
.other-categories-grid,
.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.tax-expenditure-item,
.main-category-item,
.other-category-item,
.subcategory-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.tax-expenditure-header,
.main-category-header,
.other-category-header,
.subcategory-header {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tax-expenditure-header h4,
.main-category-header h4,
.other-category-header h4,
.subcategory-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.tax-expenditure-base,
.main-category-base,
.other-category-base,
.subcategory-base {
  font-size: 0.875rem;
  color: #4a5568;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  margin-left: 0.25rem;
}

.tooltip-icon {
  cursor: help;
  color: #718096;
  font-size: 0.8rem;
}

.tooltip-text {
  visibility: hidden;
  width: 250px;
  background-color: #2d3748;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 8px 12px;
  position: fixed;
  z-index: 1000;
  top: 20px;
  right: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.85rem;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tax-expenditure-content,
.main-category-content,
.other-category-content,
.subcategory-content {
  padding: 1rem;
}

.tax-expenditure-description,
.main-category-description,
.other-category-description,
.subcategory-description {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 1rem;
  min-height: 4rem;
}

.tax-expenditure-controls,
.main-category-controls,
.other-category-controls,
.subcategory-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.reset-button {
  padding: 0.375rem 0.75rem;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #e2e8f0;
}

.tax-expenditure-impact,
.main-category-impact,
.other-category-impact,
.subcategory-impact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #4a5568;
}

.impact-label {
  color: #4a5568;
}

.positive-impact {
  color: #38a169;
  font-weight: 600;
}

.negative-impact {
  color: #e53e3e;
  font-weight: 600;
}

/* Government Operations Styles */
.gov-ops-info {
  background-color: #f8fafc;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.gov-ops-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #4a5568;
}

.gov-ops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(234px, 1fr)); /* 10% smaller than 260px */
  gap: 1rem;
}

.gov-ops-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.gov-ops-header {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gov-ops-header h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gov-ops-base {
  font-size: 0.85rem;
  color: #4a5568;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.gov-ops-content {
  padding: 1rem;
}

.gov-ops-description {
  font-size: 0.85rem;
  color: #4a5568;
  margin-bottom: 1rem;
  max-height: 4.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.gov-ops-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.gov-ops-percentage-input {
  flex: 1;
}

.gov-ops-reset {
  padding: 0.25rem;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gov-ops-impact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.tax-expenditures-summary {
  background-color: #f8fafc;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 1rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.summary-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.reset-all-button {
  padding: 0.375rem 0.75rem;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-all-button:hover {
  background-color: #e2e8f0;
}

.stacked-bar {
  height: 1.5rem;
  background-color: #e2e8f0;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.stacked-bar-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
</style>
