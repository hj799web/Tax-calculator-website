<template>
  <!-- Federal Budget Breakdown Section -->
  <section class="federal-budget-section">
    <h2 class="section-title">
      Federal Budget Allocation
    </h2>
    <p class="allocation-description">
      The <strong>2022–2023 Canada’s Federal Budget Allocation Chart</strong> offers a detailed yet simplified breakdown of how the Canadian federal government spent its money during the 2022–2023 fiscal year—data sourced from the Public Accounts of Canada financial report. In contrast, the <strong>Budget 2024 Pie Chart</strong> represents the proposed spending allocations presented by the Canadian federal government for 2024.
    </p>

    <!-- Charts Section -->
    <section class="charts-section">
      <h2 class="section-title">
        Budget Visualizations
      </h2>
      <div v-if="netFederalTaxPerPeriod > 0" class="charts-wrapper">
        <!-- Wrapper for Federal Budget Pie Chart and its legend -->
        <div class="pie-chart-wrapper">
          <div
            class="pie-chart-container"
            role="img"
            aria-label="2022-2023 Federal budget allocation chart"
          >
            <div class="pie-chart-inner-container">
              <FederalBudgetPieChart />
            </div>
          </div>
          <div id="federallegend" class="legend-container"></div>
        </div>

        <!-- Wrapper for Budget 2024 Pie Chart and its legend -->
        <div class="pie-chart-wrapper">
          <div
            class="pie-chart-container"
            role="img"
            aria-label="Federal Budget 2024 allocation chart"
          >
            <div class="pie-chart-inner-container">
              <Budget2024PieChart />
            </div>
          </div>
          <div id="budget2024legend" class="legend-container"></div>
        </div>
      </div>
      <div v-else class="no-federal-taxes">
        No federal taxes to visualize
      </div>
    </section>
  </section>

  <!-- Combined Total Federal Tax Allocated Section -->
  <section class="allocation-table-section total-federal-tax-allocated">
    <!-- Isolation wrapper to prevent overlapping -->
    <div class="allocation-insulated">
      <h2 class="section-title">
        Total Federal Tax Allocated
      </h2>
      <div class="allocation-total">
        <span>Total Federal Tax Allocated:</span>
        <span>{{ formatCurrency(netFederalTaxPerPeriod) }}</span>
      </div>
      <!-- Sort button at a normal size -->
      <button class="sort-button" @click="toggleSortAmount">
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
          <tr v-for="category in sortedBudgetCategories" :key="category.id">
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
  toggleSortAmount
} = configStore

const {
  sortOrder
} = storeToRefs(configStore)

// Table for "Total Federal Tax Allocated"

</script>

<style scoped>
/* ===== Pie Chart & Legend Section ===== */
/* Wrapper for a single pie chart and its legend */
.pie-chart-wrapper {
  width: 100%;
  max-width: 250px;       /* Maximum width on larger screens */
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 50px;              /* Space between the chart and the legend */
}

/* Container for the pie chart */
.pie-chart-container {
  width: 100%;
  height: 250px;          /* Fixed height for the chart area */
  position: relative;
  background: #f9f9f9;    /* Optional: For visual debugging */
}

/* Inner container to center the chart */
.pie-chart-inner-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Legend container */
#federallegend {
  width: 100%;
  max-width: 500px;       /* Matches the container's max-width */
  font-size: 10px;        /* Smaller font size */
  text-align: center;
  margin: 5px auto 100px; /* Increased bottom margin for extra space */
  display: block;
  overflow: visible;
  padding: 5px;
}

/* Wrapper for multiple pie charts */
.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;              /* Increased gap between charts */
  justify-content: center;
}

/* Responsive adjustments for pie charts */
@media (max-width: 768px) {
  .pie-chart-wrapper {
    max-width: 200px;
  }
  .pie-chart-container {
    height: 200px;
  }
  #federallegend {
    max-width: 400px;
    margin: 5px auto 70px;
  }
}

@media (max-width: 480px) {
  .pie-chart-wrapper {
    max-width: 180px;
  }
  .pie-chart-container {
    height: 180px;
  }
  #federallegend {
    max-width: 180px;
    margin: 5px auto 50px;
  }
}

/* ===== Allocation Table Section ===== */
.allocation-table-section.total-federal-tax-allocated {
  padding: 20px;
  margin: 350px auto 20px;  /* Significantly increased top margin for extra space */
  background-color: #fff;   /* Solid background for isolation */
  border: 1px solid #ccc;   /* Border to visually separate the section */
  overflow: auto;           /* Prevents content from spilling out */
  position: relative;
  z-index: 1;
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
  display: inline-block;  /* Only as wide as its content */
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

/* Responsive adjustments for the allocation section */
@media (max-width: 600px) {
  .allocation-table-section.total-federal-tax-allocated {
    padding: 15px;
    margin: 150px 0 20px; /* Reduced top margin slightly on small screens */
  }
  .sort-button {
    padding: 8px 16px;
  }
}
</style>




