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
      v-else-if="yearStore.selectedTaxYear === '2025'"
      class="allocation-description"
    >
      The <strong>2025-2026 Federal Estimates Allocation Chart</strong> shows the projected breakdown of major allocations for the 2025-2026 fiscal year, based on current economic forecasts and government projections.
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
    <p
      v-else-if="yearStore.selectedTaxYear === '2025'"
      class="budget-explanation"
    >
      <!-- Removed duplicate description -->
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
  font-size: 2rem;
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
  font-size: 1.1rem;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
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
  font-size: 1.2rem;
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
  padding: 1rem;
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
</style>