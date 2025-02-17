<template>
  <div class="pie-chart-container">
    <div v-if="canCalculate">
      <div class="pie-chart-inner-container">
        <Pie
          :data="chartData"
          :options="chartOptions"
          :plugins="[htmlLegendPlugin]"
        />
      </div>
      <!-- Legend container using a Vue ref -->
      <div class="legend-container" ref="legendRef"></div>
    </div>
    <div v-else class="no-data">
      <p>No budget data available to display.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { Pie } from 'vue-chartjs'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '../stores/calculator.js'
import { generateColors } from '../utils.js'
import { htmlLegendPlugin } from '../htmlLegendPlugin.js'
import { useCalculator } from '../composables/calculator.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// Create a ref for the legend container
const legendRef = ref(null)

// Extract data and flags
const { federalBudgetData } = storeToRefs(useCalculatorStore())
const { canCalculate } = useCalculator()

// Debug: log chart data on mount
onMounted(() => {
  console.log('FederalBudgetPieChart chartData:', chartData.value)
})

// Prepare chart data
const chartData = computed(() => ({
  labels: federalBudgetData.value.map(x => x.category),
  datasets: [
    {
      label: 'Federal Budget Allocation',
      data: federalBudgetData.value.map(x => x.amount),
      backgroundColor: generateColors(federalBudgetData.value.length),
      borderWidth: 1,
    },
  ],
}))

// Chart options (pass the legend ref to the plugin)
const chartOptions = computed(() => ({
  responsive: true,
  plugins: {
    htmlLegend: {
      container: legendRef, // use the Vue ref here
    },
    legend: {
      display: false, // hide the default legend
    },
    title: {
      display: true,
      text: 'Federal Budget Allocation',
    },
    tooltip: {
      callbacks: {
        label: ({ label, parsed: value, dataset: { data } }) => {
          const total = data.reduce((a, b) => a + b, 0)
          const percentage = total ? ((value / total) * 100).toFixed(2) : '0.00'
          const formattedValue = value.toLocaleString('en-CA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          return `${label}: $${formattedValue} (${percentage}%)`
        },
      },
    },
  },
}))
</script>

<style scoped>
.pie-chart-container {
  width: 100%;
  max-width: 250px;
  margin: 20px auto;
  position: relative;
  display: flex;             /* Added for centering */
  justify-content: center;   /* Centers horizontally */
  align-items: center;       /* Centers vertically */
}

.pie-chart-inner-container {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.legend-container {
  width: 100%;
  max-width: 250px;
  font-size: 10px; /* Legend text size set to 10px */
  text-align: center;
  margin: 5px auto;
  display: block;
}

.no-data {
  padding: 20px;
  color: #7f8c8d;
  font-size: 16px;
  text-align: center;
}
</style>
