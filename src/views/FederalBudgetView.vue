<template>
  <!-- Federal Budget Breakdown Section -->
  <section class="federal-budget-section">
    <h2 class="section-title">
      Federal Budget Allocation
    </h2>
    <p
      v-if="yearStore.budgetYear === '2023-2024'"
      class="allocation-description"
    >
      The <strong>Budget 2023-2024 Allocation Chart</strong> represents the proposed spending allocations presented by the Canadian federal government for the 2023-2024 fiscal year.
    </p>
    <p
      v-else
      class="allocation-description"
    >
      The <strong>2022–2023 Canada's Federal Budget Allocation Chart</strong> offers a detailed yet simplified breakdown of how the Canadian federal government spent its money during the 2022–2023 fiscal year—data sourced from the Public Accounts of Canada financial report.
    </p>
    <p
      v-if="yearStore.budgetYear === '2023-2024'"
      class="budget-explanation"
    >
      The <strong>2023-2024 Canada Federal Budget Allocation Chart</strong> shows the comprehensive breakdown of major allocations in the 2023-2024 federal budget. In contrast, the <strong>Budget 2023-2024 Pie Chart</strong> represents the proposed spending allocations presented by the Canadian federal government for 2023-2024.
    </p>

    <!-- Charts Section -->
    <section class="charts-section">
      <h2 class="section-title">
        Budget Visualizations
      </h2>
      <div
        v-if="netFederalTaxPerPeriod > 0"
        class="charts-wrapper"
      >
        <!-- Render the appropriate chart based on selected year -->
        <FederalBudgetPieChart v-if="yearStore.budgetYear === '2022-2023'" />
        <FederalBudget2024PieChart v-if="yearStore.budgetYear === '2023-2024'" />
        <Budget2024PieChart v-if="yearStore.budgetYear === '2023-2024'" />
      </div>
      <div
        v-else
        class="no-federal-taxes"
      >
        No federal taxes to visualize
      </div>
    </section>
  </section>

  <!-- Combined Total Federal Tax Allocated Section -->
  <section class="allocation-table-section total-federal-tax-allocated">
    <div class="allocation-insulated">
      <h2 class="section-title">
        Total Federal Tax Allocated
      </h2>
      <div class="allocation-total">
        <span>Total Federal Tax Allocated:</span>
        <span>{{ formatCurrency(netFederalTaxPerPeriod) }}</span>
      </div>
      <!-- Normal-sized sort button -->
      <button
        class="sort-button"
        @click="toggleSortAmount"
      >
        Sort by Amount ({{ sortOrder.toUpperCase() }})
      </button>
      <table class="allocation-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in sortedBudgetCategories"
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
import { formatCurrency } from '@/domains/calculator/utils/chartUtils.js'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { useConfigStore } from '@/domains/calculator/store/config.js'
import { useYearStore } from '@/domains/calculator/store/year.js'
import { storeToRefs } from 'pinia'
import FederalBudgetPieChart from '@/domains/calculator/components/FederalBudgetPieChart.vue'
import Budget2024PieChart from '@/domains/calculator/components/Budget2024PieChart.vue'
import FederalBudget2024PieChart from '@/domains/calculator/components/FederalBudget2024PieChart.vue'

const { netFederalTaxPerPeriod, sortedBudgetCategories } = storeToRefs(useCalculatorStore())
const configStore = useConfigStore()
const yearStore = useYearStore()
const { toggleSortAmount } = configStore
const { sortOrder } = storeToRefs(configStore)
</script>

<style scoped>
/* ===== Charts Section Styles ===== */
.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 25px; /* Increased from 20px for better spacing */
  justify-content: center;
  align-items: flex-start; /* Align items at the top */
  margin: 0 auto;
  width: 100%;
  max-width: 770px; /* Increased from 700px to accommodate larger charts */
  overflow: visible !important; /* Ensure content and tooltips are visible */
  position: relative; /* For tooltip positioning */
  z-index: 2; /* Ensure tooltips appear above other elements */
}

/* ===== Federal Budget Section Styles ===== */
.federal-budget-section {
  padding: 20px;
  margin: 20px auto;
  justify-content: center;
  align-items: center;
  position: relative; /* For tooltip positioning */
}

.allocation-description {
  margin-bottom: 20px;
  padding: 0 10px;
  text-align: center;
}

.budget-explanation {
  margin-bottom: 20px;
  padding: 0 10px;
  text-align: center;
}

/* ===== Allocation Table Section Styles ===== */
.allocation-table-section.total-federal-tax-allocated {
  padding: 20px;
  margin: 30px auto 20px; /* Increased top margin to provide space for tooltips */
  background-color: #fff;
  border: 1px solid #ccc;
  overflow: auto;
  position: relative;
  z-index: 1;
  max-width: 900px;
}

.allocation-insulated {
  padding: 10px;
}

.allocation-table-section.total-federal-tax-allocated h2.section-title {
  margin-bottom: 15px;
}

.allocation-total {
  margin-bottom: 15px;
  font-weight: bold;
}

.sort-button {
  padding: 10px 20px;
  background-color: #153bb8;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;  /* Button width fits its content */
  margin-bottom: 15px;
}

.allocation-table {
  width: 100%;
  border-collapse: collapse;
}

.allocation-table th,
.allocation-table td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: left;
}

.charts-section {
  margin-bottom: 40px; /* Increased from 30px to provide more space for tooltips */
  position: relative; /* For tooltip positioning */
}

.no-federal-taxes {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  color: #7f8c8d;
}

/* Ensure tooltips are visible */
:deep(.chartjs-tooltip) {
  z-index: 100;
  pointer-events: none;
  position: absolute;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .charts-wrapper {
    flex-direction: column;
    gap: 20px; /* Increased from 15px for better spacing */
  }
  
  .allocation-table-section.total-federal-tax-allocated {
    padding: 15px;
    margin: 30px auto 20px; /* Increased top margin */
    overflow-x: auto; /* Allow horizontal scrolling for table */
  }
  
  .allocation-table {
    font-size: 12px; /* Smaller font for mobile */
  }
  
  .sort-button {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .allocation-description {
    font-size: 14px;
    padding: 0 5px;
  }
  
  .budget-explanation {
    font-size: 14px;
    padding: 0 5px;
  }
}
</style>