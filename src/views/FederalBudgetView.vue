<template>
  <!-- Federal Budget Breakdown Section -->
  <section class="federal-budget-section">
    <h2 class="section-title">
      Federal Budget Allocation
    </h2>
    <p class="allocation-description">
      See how your federal taxes are allocated across different sectors and
      programs.
    </p>

    <!-- Charts Section -->
    <section class="charts-section">
      <h2 class="section-title">
        Budget Visualizations
      </h2>
      <div
        v-if="netFederalTaxPerPeriod > 0"
        class="budget-pie-charts-wrapper"
      >
        <!-- Federal Budget Pie Chart -->
        <div
          class="pie-chart-item"
          role="img"
          aria-label="2022-2023 Federal budget allocation chart"
        >
          <FederalBudgetPieChart />
        </div>

        <!-- Budget 2024 Pie Chart -->
        <div
          class="pie-chart-item"
          role="img"
          aria-label="Federal Budget 2024 allocation chart"
        >
          <Budget2024PieChart />
        </div>
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
    <h2 class="section-title">
      Total Federal Tax Allocated
    </h2>
    <div class="allocation-total">
      <span>Total Federal Tax Allocated:</span>
      <span>{{ formatCurrency(netFederalTaxPerPeriod) }}</span>
    </div>
    <!-- Keep the sort button for THIS table only -->
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
  </section>
</template>

<script setup lang="js">
import { formatCurrency } from '../utils.js'
import { useCalculatorStore } from '../stores/calculator.js'
import { useConfigStore } from '../stores/config.js'
import { storeToRefs } from 'pinia'
import FederalBudgetPieChart from '../components/FederalBudgetPieChart'
import Budget2024PieChart from '../components/Budget2024PieChart'

const {
  netFederalTaxPerPeriod,
  sortedBudgetCategories
} = storeToRefs(useCalculatorStore())

const configStore = useConfigStore()

const {
  sortOrder
} = storeToRefs(configStore)

// Table for "Total Federal Tax Allocated"

</script>

<style lang="css" scoped>
.no-federal-taxes {
  text-align: center;
}


.federal-budget-section .pie-chart-item,
.budget-pie-charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: start;
}
</style>