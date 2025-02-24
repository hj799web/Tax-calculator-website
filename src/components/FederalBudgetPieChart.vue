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
      text: '2022–2023 Canada Federal Budget Allocation Chart',
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
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pie-chart-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.pie-chart-inner-container {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.legend-container {
  width: 100%;
  max-width: 400px;
  font-size: 12px;
  text-align: left;
  margin: 10px auto;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.legend-container:hover {
  transform: scale(1.02);
}

.no-data {
  padding: 20px;
  color: #7f8c8d;
  font-size: 16px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
