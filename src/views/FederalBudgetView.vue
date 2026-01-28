<template>
  <!-- Federal Budget Breakdown Section -->
  <section class="federal-budget-section">
    <h2 class="section-title">
      {{ translate('federalBudget.title', 'Federal Budget Allocation') }}
    </h2>
    <p
      v-if="yearStore.budgetYear === '2023-2024'"
      class="allocation-description"
    >
      {{ translate('federalBudget.descriptions.budget2024', 'These charts summarize the 2023–2024 federal budget: one shows the comprehensive allocation; the other shows the proposed Budget 2023–2024 allocations.') }}
      {{ translate('federalBudget.explanations.budget2024', 'Two views: ‘2023–2024 Canada Federal Budget Allocation Chart’ (comprehensive) and ‘Budget 2023–2024’ (proposed).') }}
    </p>
    <p
      v-else-if="yearStore.selectedTaxYear === '2025'"
      class="allocation-description"
    >
      {{ translate('federalBudget.descriptions.estimates2025', 'The 2025–26 Federal Main Estimates chart presents the government’s planned spending allocations for the fiscal year, as set out in the Treasury Board’s current expenditure forecasts.') }}
    </p>
    <p
      v-else
      class="allocation-description"
    >
      {{ translate('federalBudget.descriptions.historic', 'The 2022–2023 Canada\'s Federal Budget Allocation Chart offers a detailed yet simplified breakdown of how the Canadian federal government spent its money during the 2022–2023 fiscal year—data sourced from the Public Accounts of Canada financial report.') }}
    </p>
    

    <!-- Charts Section -->
    <section class="charts-section">
      <h2 class="section-title">
        {{ translate('federalBudget.chartsTitle', 'Budget Visualizations') }}
      </h2>
      <div
        v-if="netFederalTaxPerPeriod > 0"
        class="charts-wrapper"
      >
        <!-- Render the appropriate chart(s) based on selected year -->
        <template v-if="yearStore.budgetYear === '2022-2023'">
          <!-- Historic single chart -->
          <FederalBudgetPieChart />
        </template>
        <template v-else-if="yearStore.budgetYear === '2023-2024'">
          <!-- 2023–2024 Comprehensive Budget Chart -->
          <FederalBudget2024PieChart />
        </template>
        <template v-else-if="yearStore.budgetYear === '2025-26'">
          <!-- 2025–2026 Budget Chart -->
          <Budget2025PieChart />
        </template>
        <template v-else>
          <!-- Fallback: use current/default spending data -->
          <FederalBudgetPieChart />
        </template>
      </div>
      <div
        v-else
        class="no-federal-taxes"
      >
        {{ translate('federalBudget.noData', 'No federal taxes to visualize') }}
      </div>
    </section>
  </section>

  <!-- Combined Total Federal Tax Allocated Section -->
  <section class="allocation-table-section total-federal-tax-allocated">
    <div class="allocation-insulated">
      <h2 class="section-title">
        {{ translate('federalBudget.total.title', 'Total Federal Tax Allocated') }}
      </h2>
      <div class="allocation-total">
        <span>{{ translate('federalBudget.total.label', 'Total Federal Tax Allocated:') }}</span>
        <span>{{ formatCurrency(netFederalTaxPerPeriod) }}</span>
      </div>
      <!-- Normal-sized sort button -->
      <button
        class="sort-button"
        :aria-label="translate('federalBudget.sortButton', 'Sort by Amount ({order})', { 'order': nextSortOrder })"
        :title="translate('federalBudget.sortButton', 'Sort by Amount ({order})', { 'order': nextSortOrder })"
        :disabled="netFederalTaxPerPeriod <= 0"
        @click="toggleLocalSortOrder"
      >
        {{ translate('federalBudget.sortButton', 'Sort by Amount ({order})', { 'order': nextSortOrder }) }}
      </button>
      <table class="allocation-table">
        <thead>
          <tr>
            <th>{{ translate('federalBudget.table.category', 'Category') }}</th>
            <th>{{ translate('federalBudget.table.amount', 'Amount') }}</th>
            <th>{{ translate('federalBudget.table.percentage', 'Percentage') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in tableSortedCategories"
            :key="category.id"
          >
            <td>{{ category.name }}</td>
            <td>{{ formatCurrency(category.allocatedAmount) }}</td>
            <td>{{ category.percentage.toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="js">
import { computed, ref } from 'vue'
import { formatCurrency } from '@/domains/calculator/utils/chartUtils.js'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { useYearStore } from '@/domains/calculator/store/year.js'
import { storeToRefs } from 'pinia'
import FederalBudgetPieChart from '@/domains/calculator/components/FederalBudgetPieChart.vue'
import FederalBudget2024PieChart from '@/domains/calculator/components/FederalBudget2024PieChart.vue'
import Budget2025PieChart from '@/domains/calculator/components/Budget2025PieChart.vue'
import { useI18n } from '@/i18n'


const { t } = useI18n()
const translate = (key, fallback = '', params) => {
  const value = t(key, params)
  return value === key ? fallback : value
}

const { netFederalTaxPerPeriod, sortedBudgetCategories } = storeToRefs(useCalculatorStore())
const yearStore = useYearStore()
// Local-only sort for this table
const localSortOrder = ref((typeof window !== 'undefined' && window.localStorage.getItem('federalTableSortOrder')) || 'desc')
const toggleLocalSortOrder = () => {
  localSortOrder.value = localSortOrder.value === 'asc' ? 'desc' : 'asc'
  try {
    window.localStorage.setItem('federalTableSortOrder', localSortOrder.value)
  } catch (e) {
    // Benign in private mode or blocked storage environments
    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      console.debug('localStorage not available for federal table sort preference')
    }
  }
}
const nextSortOrder = computed(() => (localSortOrder.value === 'asc' ? 'DESC' : 'ASC'))
const tableSortedCategories = computed(() => {
  const rows = [...(sortedBudgetCategories?.value || [])]
  return rows.sort((a, b) => localSortOrder.value === 'asc' ? a.allocatedAmount - b.allocatedAmount : b.allocatedAmount - a.allocatedAmount)
})
</script>

<style scoped>
.federal-budget-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
}

.section-title {
  font-size: clamp(1.2rem, 2.2vw + 0.8rem, 2rem);
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1rem;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 2px;
}

.allocation-description, .budget-explanation {
  font-size: clamp(0.95rem, 0.6vw + 0.85rem, 1.1rem);
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.charts-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.charts-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.no-federal-taxes {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-style: italic;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.allocation-table-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
}

.allocation-insulated {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.allocation-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 1rem 0;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 12px;
  font-size: clamp(1rem, 0.8vw + 0.95rem, 1.2rem);
  font-weight: 600;
  color: #2c3e50;
}

.sort-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

.sort-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
}

.allocation-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
}

.allocation-table th,
.allocation-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.allocation-table th {
  background: rgba(52, 152, 219, 0.1);
  font-weight: 600;
  color: #2c3e50;
}

.allocation-table tr:hover {
  background: rgba(52, 152, 219, 0.05);
  }
  
.allocation-table tr:last-child td {
  border-bottom: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile refinements */
@media (max-width: 768px) {
  .federal-budget-section, .allocation-table-section { padding: 1.25rem; border-radius: 14px; }
  .allocation-insulated { padding: 1rem; }
}

@media (max-width: 480px) {
  .charts-wrapper { grid-template-columns: 1fr; gap: 1rem; }
  .sort-button { padding: 0.6rem 1rem; border-radius: 6px; }
  .allocation-table th, .allocation-table td { padding: 0.75rem; }
}
</style>
