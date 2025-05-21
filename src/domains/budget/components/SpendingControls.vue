<template>
  <section
    class="simulator-card spending-card w-full"
    style="min-height: 1440px; display: flex; flex-direction: column;"
  >
    <div
      class="card-content w-full"
      style="flex-grow: 1;"
    >
      <div
        class="w-full overflow-y-auto pr-2"
        style="height: 100%;"
      >
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
            <div
              v-for="category in mainCategoriesList"
              :key="category.id"
              class="main-category-item"
            >
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
                    class="main-category-percentage-input"
                    @update:model-value="updateCategoryAdjustment(category.id, $event)"
                  />
                  <button 
                    class="reset-button" 
                    title="Reset to baseline"
                    @click="updateCategoryAdjustment(category.id, 100)"
                  >
                    Reset
                  </button>
                </div>
                <div class="main-category-impact">
                  <div class="impact-label">
                    Current:
                  </div>
                  <div
                    class="impact-value"
                    :class="validSpendingFactors[category.id] > 100 ? 'text-green-600' : validSpendingFactors[category.id] < 100 ? 'text-red-600' : 'text-gray-600'"
                  >
                    ${{ formatAmount(category.baseAmount * validSpendingFactors[category.id] / 100) }}B
                    ({{ validSpendingFactors[category.id] > 100 ? '+' : '' }}{{ (validSpendingFactors[category.id] - 100).toFixed(0) }}%)
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
          <div
            v-if="expandedGroups.otherCategories"
            class="w-full"
          >
            <div class="other-categories-info">
              <p>Adjust spending for additional federal budget categories. These categories represent specialized programs and investments.</p>
            </div>
            <div class="other-categories-grid">
              <div
                v-for="group in otherCategoriesGroups.filter(g => g.id !== 'governmentOperations' && g.id !== 'loansInvestments')"
                :key="group.id"
                class="other-category-item"
              >
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
                      class="other-category-percentage-input"
                      @update:model-value="updateCategoryAdjustment(group.id, $event)"
                    />
                    <button 
                      class="reset-button" 
                      title="Reset to baseline"
                      @click="updateCategoryAdjustment(group.id, 100)"
                    >
                      <span
                        class="material-icons"
                        style="font-size: 14px;"
                      >restart_alt</span>
                    </button>
                  </div>
                  <div class="other-category-impact">
                    <div class="impact-label">
                      Current:
                    </div>
                    <div
                      class="impact-value"
                      :class="validSpendingFactors[group.id] > 100 ? 'text-green-600' : validSpendingFactors[group.id] < 100 ? 'text-red-600' : 'text-gray-600'"
                    >
                      ${{ formatAmount(group.baseAmount * validSpendingFactors[group.id] / 100) }}B
                      ({{ validSpendingFactors[group.id] > 100 ? '+' : '' }}{{ (validSpendingFactors[group.id] - 100).toFixed(0) }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Subcategories in a separate grid below -->
            <div class="mt-4 w-full">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Subcategories
              </h4>
              <div class="grid grid-cols-1 gap-4 w-full">
                <!-- Display Loans, Investments & Advances subcategories -->
                <div class="w-full mb-4">
                  <div class="text-sm font-medium text-gray-700 mb-3 border-b border-gray-200 pb-1">
                    Loans, Investments & Advances Subcategories
                  </div>
                  <div class="subcategories-grid">
                    <div
                      v-for="child in getGroupChildren('loansInvestments')"
                      :key="child.id"
                      class="subcategory-item"
                    >
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
                            class="subcategory-percentage-input"
                            @update:model-value="updateCategoryAdjustment(child.id, $event)"
                          />
                          <button 
                            class="reset-button" 
                            title="Reset to baseline"
                            @click="updateCategoryAdjustment(child.id, 100)"
                          >
                            <span
                              class="material-icons"
                              style="font-size: 14px;"
                            >restart_alt</span>
                          </button>
                        </div>
                        <div class="subcategory-impact">
                          <div class="impact-label">
                            Current:
                          </div>
                          <div
                            class="impact-value"
                            :class="validSpendingFactors[child.id] > 100 ? 'text-green-600' : validSpendingFactors[child.id] < 100 ? 'text-red-600' : 'text-gray-600'"
                          >
                            ${{ formatAmount(child.baseAmount * validSpendingFactors[child.id] / 100) }}B
                            ({{ validSpendingFactors[child.id] > 100 ? '+' : '' }}{{ (validSpendingFactors[child.id] - 100).toFixed(0) }}%)
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
              <button
                class="action-button reset-button"
                @click="resetOtherCategories"
              >
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
          <div
            v-if="expandedGroups.governmentOperations"
            class="w-full"
          >
            <div class="gov-ops-info mb-3">
              <p>Government operations include administrative functions, transfers, and other essential government services.</p>
            </div>
            
            <div class="gov-ops-grid">
              <div
                v-for="child in sortedGovOpsChildren"
                :key="child.id"
                class="gov-ops-item"
              >
                <div class="gov-ops-header">
                  <h4 :title="child.name">
                    {{ child.name }}
                  </h4>
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
                  <div
                    v-if="child.description"
                    class="gov-ops-description"
                  >
                    {{ child.description }}
                  </div>
                  <div class="gov-ops-controls">
                    <PercentageInput
                      :id="`spending-${child.id}`"
                      :model-value="validSpendingFactors[child.id]"
                      :disabled="autoBalanceActive"
                      :base-amount="child.baseAmount"
                      class="gov-ops-percentage-input"
                      @update:model-value="updateCategoryAdjustment(child.id, $event)"
                    />
                    <button 
                      class="reset-button gov-ops-reset" 
                      title="Reset to baseline"
                      @click="updateCategoryAdjustment(child.id, 100)"
                    >
                      <span
                        class="material-icons"
                        style="font-size: 14px;"
                      >restart_alt</span>
                    </button>
                  </div>
                  <div class="gov-ops-impact">
                    <div class="impact-label">
                      Current:
                    </div>
                    <div
                      class="impact-value"
                      :class="validSpendingFactors[child.id] > 100 ? 'text-green-600' : validSpendingFactors[child.id] < 100 ? 'text-red-600' : 'text-gray-600'"
                    >
                      ${{ formatAmount(child.baseAmount * validSpendingFactors[child.id] / 100) }}B
                      ({{ validSpendingFactors[child.id] > 100 ? '+' : '' }}{{ (validSpendingFactors[child.id] - 100).toFixed(0) }}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reset button for Government Operations -->
            <div class="mt-4 flex justify-end">
              <button
                class="action-button reset-button"
                @click="resetGovernmentOperations"
              >
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
            <div
              v-for="expenditure in taxExpendituresArray"
              :key="expenditure.id"
              class="tax-expenditure-item"
            >
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
                    title="Reset to baseline"
                    @click="resetTaxExpenditure(expenditure.id)"
                  >
                    Reset
                  </button>
                </div>
                <div class="tax-expenditure-impact">
                  <div class="impact-label">
                    Revenue Impact:
                  </div>
                  <div
                    class="impact-value"
                    :class="getImpactClass(expenditure)"
                  >
                    {{ getImpactPrefix(expenditure) }}${{ formatAmount(calculateImpact(expenditure)) }}B
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tax-expenditures-summary">
            <div class="summary-header">
              <h4>Total Impact on Revenue</h4>
              <button
                class="reset-all-button"
                @click="resetAllTaxExpenditures"
              >
                Reset All
              </button>
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
              />
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
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
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
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  overflow: hidden;
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  perspective: 1000px;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  min-height: 1440px;
}

.simulator-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.card-title, .card-content, .main-category-header, .main-category-item, .other-category-header, .other-category-item, .subcategory-header, .subcategory-item, .gov-ops-header, .gov-ops-item, .tax-expenditure-header, .tax-expenditure-item, .impact-value, .reset-button {
  word-break: break-word;
  white-space: normal;
}

.card-title {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem 1rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  transform: translateZ(30px);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
  margin-top: 0;
  margin-bottom: 0.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  box-shadow: none;
}

.card-title .icon {
  margin-right: 0.75rem;
  font-size: 1.5rem;
  color: #4263eb;
}

.card-content {
  padding: 1rem;
  transform: translateZ(10px);
  transition: transform 0.3s ease;
  flex-grow: 1;
  position: relative;
  z-index: 0;
}

.action-button {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  background: #2980b9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.reset-button {
  padding: 0.35rem 0.7rem;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 0.23rem;
  font-size: 0.81rem;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-button:hover {
  background-color: #e2e8f0;
}

.tax-expenditures-info,
.main-categories-info,
.other-categories-info {
  margin-bottom: 1.3rem;
  padding: 0.65rem;
  background-color: #f8fafc;
  border-radius: 0.21rem;
  font-size: 0.78rem;
  color: #4a5568;
}

.tax-expenditures-grid,
.main-categories-grid,
.other-categories-grid,
.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(259px, 1fr));
  gap: 1.3rem;
  margin-bottom: 1.3rem;
}

.tax-expenditure-item,
.main-category-item,
.other-category-item,
.subcategory-item,
.gov-ops-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.33rem;
  overflow: hidden;
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.tax-expenditure-item:hover,
.main-category-item:hover,
.other-category-item:hover,
.subcategory-item:hover,
.gov-ops-item:hover {
  transform: translateY(-2px) translateZ(10px) rotateX(1deg);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

.tax-expenditure-header,
.main-category-header,
.other-category-header,
.subcategory-header,
.gov-ops-header {
  background-color: #f8fafc;
  padding: 0.65rem 0.86rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transform: translateZ(20px);
  transition: transform 0.3s ease;
}

.tax-expenditure-header h4,
.main-category-header h4,
.other-category-header h4,
.subcategory-header h4,
.gov-ops-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.tax-expenditure-base,
.main-category-base,
.other-category-base,
.subcategory-base,
.gov-ops-base {
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
.subcategory-content,
.gov-ops-content {
  padding: 0.86rem;
  transform: translateZ(10px);
  transition: transform 0.3s ease;
}

.tax-expenditure-description,
.main-category-description,
.other-category-description,
.subcategory-description,
.gov-ops-description {
  font-size: 0.75rem;
  color: #4a5568;
  margin-bottom: 0.86rem;
  min-height: 3.46rem;
}

.tax-expenditure-controls,
.main-category-controls,
.other-category-controls,
.subcategory-controls,
.gov-ops-controls {
  display: flex;
  align-items: center;
  gap: 0.44rem;
  margin-bottom: 0.86rem;
}

.reset-button {
  padding: 0.35rem 0.7rem;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 0.23rem;
  font-size: 0.81rem;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-button:hover {
  background-color: #e2e8f0;
}

.tax-expenditure-impact,
.main-category-impact,
.other-category-impact,
.subcategory-impact,
.gov-ops-impact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
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
  grid-template-columns: repeat(auto-fill, minmax(202px, 1fr));
  gap: 0.86rem;
}

.gov-ops-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.35rem;
  overflow: hidden;
}

.gov-ops-header {
  background-color: #f8fafc;
  padding: 0.65rem 0.86rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gov-ops-header h4 {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #2d3748;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gov-ops-base {
  font-size: 0.73rem;
  color: #4a5568;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.21rem;
}

.gov-ops-content {
  padding: 1rem;
}

.gov-ops-description {
  font-size: 0.73rem;
  color: #4a5568;
  margin-bottom: 0.86rem;
  max-height: 3.9rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.gov-ops-controls {
  display: flex;
  align-items: center;
  gap: 0.47rem;
  margin-bottom: 0.75rem;
}

.gov-ops-percentage-input {
  flex: 1;
}

.gov-ops-reset {
  padding: 0.21rem;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 0.23rem;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s;
}

.gov-ops-reset:hover {
  background-color: #e2e8f0;
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
  padding: 0.35rem 0.7rem;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 0.23rem;
  font-size: 0.81rem;
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

.spending-controls {
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

.spending-controls:hover {
  transform: translateY(-5px) translateZ(0);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.spending-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.spending-group:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.group-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-title .material-icons {
  color: #4299e1;
}

.group-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.spending-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spending-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, background-color;
}

.spending-item:hover {
  background: #edf2f7;
  transform: translateY(-1px) translateZ(0);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.item-description {
  font-size: 0.875rem;
  color: #4a5568;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.amount-input {
  width: 120px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #2d3748;
  background: white;
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, border-color, box-shadow;
}

.amount-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.amount-input:hover {
  border-color: #4299e1;
}

.percentage-display {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  min-width: 4rem;
  text-align: right;
}

/* Responsive Design */
@container (max-width: 768px) {
  .spending-controls {
    padding: 1rem;
  }
  
  .spending-group {
    padding: 1rem;
  }
  
  .group-title {
    font-size: 1rem;
  }
  
  .group-total {
    font-size: 1.125rem;
  }
  
  .amount-input {
    width: 100px;
  }
}

@container (max-width: 480px) {
  .spending-controls {
    padding: 0.75rem;
  }
  
  .spending-group {
    padding: 0.75rem;
  }
  
  .group-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .group-total {
    text-align: left;
  }
  
  .spending-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .item-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .amount-input {
    width: 100%;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .action-button:hover,
  .reset-button:hover {
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .action-button:active,
  .reset-button:active {
    background: #2980b9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .action-button,
  .reset-button {
    transition: none;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .action-button,
  .reset-button {
    border: 2px solid CanvasText;
  }
}

/* Print Styles */
@media print {
  .spending-controls {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .spending-group {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .spending-item {
    break-inside: avoid;
    border: 1px solid #000;
  }
  
  .amount-input {
    border: 1px solid #000;
  }
}

@media (max-width: 600px) {
  .card-title, .card-content {
    font-size: 0.95rem;
    padding: 0.5rem 0.5rem;
  }
  .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header {
    font-size: 0.9rem;
    padding: 0.5rem 0.5rem;
  }
  .main-category-item, .other-category-item, .subcategory-item, .gov-ops-item, .tax-expenditure-item {
    padding: 0.5rem 0.5rem;
  }
}
</style>
