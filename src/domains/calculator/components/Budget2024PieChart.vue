<template>
  <div class="budget2024-pie-chart">
    <div
      v-if="canCalculate"
      class="chart-wrapper"
    >
      <!-- Chart Container -->
      <div
        class="pie-chart-container"
        role="img"
        aria-label="Budget 2024 Allocation Chart"
      >
        <div class="pie-chart-inner-container">
          <Pie
            :data="chartData"
            :options="chartOptions"
            :plugins="[htmlLegendPlugin]"
          />
        </div>
      </div>
      <!-- Legend container using a Vue ref -->
      <div
        ref="legendRef"
        class="legend-container"
      />
    </div>
    <div
      v-else
      class="no-data"
    >
      <p>No budget data available to display.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { Pie } from 'vue-chartjs'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { generateColors } from '@/domains/calculator/utils/chartUtils.js'
import { htmlLegendPlugin } from '@/domains/calculator/utils/htmlLegendPlugin.js'
import { budgetCategories2024 } from '@/domains/calculator/constants/taxData.js'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'
import { useYearStore } from '@/domains/calculator/store/year.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// Create a ref for the legend container
const legendRef = ref(null)

// Extract reactive state and flags
const { netFederalTaxPerPeriod } = storeToRefs(useCalculatorStore())
const { canCalculate } = useCalculator()
const yearStore = useYearStore()

// Compute Budget 2024 data based on base data and net federal tax
const budget2024DataComputed = computed(() => {
  const total = budgetCategories2024.reduce((acc, cat) => acc + cat.amount, 0)
  if (total === 0) {
    return budgetCategories2024.map(c => ({
      category: c.name,
      amount: 0,
    }))
  }
  return budgetCategories2024.map(c => ({
    category: c.name,
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
  maintainAspectRatio: true,
  plugins: {
    htmlLegend: {
      container: legendRef, // use the Vue ref
    },
    legend: {
      display: false, // hide default legend
    },
    title: {
      display: true,
      text: `${yearStore.selectedTaxYear} Budget Allocation`,
      font: {
        size: 14
      }
    },
    tooltip: {
      enabled: true,
      position: 'nearest',
      external: null, // Allow tooltip to render outside the canvas
      usePointStyle: true,
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
  max-width: 412px;
  margin: 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

.budget2024-pie-chart:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.chart-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.pie-chart-container {
  width: 100%;
  max-width: 420px;
  height: clamp(220px, 60vw, 360px);
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
  position: relative;
}

.legend-container {
  width: 100%;
  max-width: 420px;
  font-size: clamp(10px, 0.4vw + 9px, 12px);
  text-align: left;
  margin: 5px auto;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  overflow-y: auto;
  max-height: 200px;
}

.legend-container:hover {
  transform: scale(1.01);
}

.no-data {
  padding: 15px;
  color: #7f8c8d;
  font-size: 14px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.chartjs-tooltip) {
  z-index: 10;
  pointer-events: none;
  position: absolute;
}

@media (max-width: 600px) {
  .budget2024-pie-chart {
    max-width: 315px;
  }
  
  .chart-wrapper {
    padding: 8px;
    gap: 8px;
  }
  
  .pie-chart-container { height: clamp(200px, 70vw, 300px); }
  .legend-container { font-size: clamp(9px, 0.5vw + 8px, 11px); }
}
</style> 
