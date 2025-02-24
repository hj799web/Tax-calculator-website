<template>
  <div class="budget2024-pie-chart">
    <div v-if="canCalculate" class="chart-wrapper">
      <!-- Chart Container -->
      <div class="pie-chart-container" role="img" aria-label="Budget 2024 Allocation Chart">
        <div class="pie-chart-inner-container">
          <Pie
            :data="chartData"
            :options="chartOptions"
            :plugins="[htmlLegendPlugin]"
          />
        </div>
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
import { baseBudget2024Data } from '../constants.js'
import { useCalculator } from '../composables/calculator.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// Create a ref for the legend container
const legendRef = ref(null)

// Extract reactive state and flags
const { netFederalTaxPerPeriod } = storeToRefs(useCalculatorStore())
const { canCalculate } = useCalculator()

// Compute Budget 2024 data based on base data and net federal tax
const budget2024DataComputed = computed(() => {
  const total = baseBudget2024Data.reduce((acc, cat) => acc + cat.amount, 0)
  if (total === 0) {
    return baseBudget2024Data.map(c => ({
      category: c.category,
      amount: 0,
    }))
  }
  return baseBudget2024Data.map(c => ({
    category: c.category,
    amount: (c.amount / total) * netFederalTaxPerPeriod.value,
  }))
})

// Debug: log chart data on mount
onMounted(() => {
  console.log('Budget2024PieChart chartData:', chartData.value)
})

// Prepare chart data
const chartData = computed(() => ({
  labels: budget2024DataComputed.value.map(x => x.category),
  datasets: [
    {
      label: 'Budget 2024 Allocation',
      data: budget2024DataComputed.value.map(x => x.amount),
      backgroundColor: generateColors(budget2024DataComputed.value.length),
      borderWidth: 1,
    },
  ],
}))

// Chart options (pass the legend ref to the plugin)
const chartOptions = computed(() => ({
  responsive: true,
  plugins: {
    htmlLegend: {
      container: legendRef, // use the Vue ref
    },
    legend: {
      display: false, // hide default legend
    },
    title: {
      display: true,
      text: 'Budget 2024 Allocation',
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = ctx.parsed
          const ds = ctx.dataset.data
          const total = ds.reduce((a, b) => a + b, 0)
          const perc = total ? ((val / total) * 100).toFixed(2) : '0.00'
          const formattedVal = val.toLocaleString('en-CA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          return `${ctx.label}: $${formattedVal} (${perc}%)`
        },
      },
    },
  },
}))
</script>

<style scoped>
.budget2024-pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.budget2024-pie-chart:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.pie-chart-container {
  width: 400px;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.pie-chart-inner-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
