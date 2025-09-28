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
import { formatCurrency, generateColors } from '@/domains/calculator/utils/chartUtils.js'
import { htmlLegendPlugin } from '@/domains/calculator/utils/htmlLegendPlugin.js'
import { useCalculator } from '../composables/calculator.js'
import { useYearStore } from '@/domains/calculator/store/year.js'
import { useI18n } from '@/i18n'
  
  // Register Chart.js components
  ChartJS.register(ArcElement, Tooltip, Legend)
  
  // Create a ref for the legend container
  const legendRef = ref(null)
  
// Extract data and flags
const { federalBudgetData } = storeToRefs(useCalculatorStore())
const { canCalculate } = useCalculator()
const yearStore = useYearStore()
const { t } = useI18n()

// Helper function to get translated category name
const getCategoryTranslation = (categoryKey, year) => {
  const yearKey = year === '2024' ? 'y2024' : 'y2022'
  return t(`federalBudget.categories.${yearKey}.${categoryKey}`) || categoryKey
}
  
  // Debug: log chart data on mount
  onMounted(() => {
    console.log('FederalBudgetPieChart chartData:', chartData.value)
  })
  
// Prepare chart data
const chartData = computed(() => ({
  labels: federalBudgetData.value.map(x => getCategoryTranslation(x.categoryKey || x.category, yearStore.selectedTaxYear)),
  datasets: [
    {
      label: t('federalBudget.title'),
      data: federalBudgetData.value.map(x => x.amount),
      backgroundColor: generateColors(federalBudgetData.value.length),
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
        container: legendRef, // use the Vue ref here
      },
      legend: {
        display: false, // hide the default legend
      },
      title: {
        display: true,
        text: yearStore.selectedTaxYear === '2025'
          ? t('federalBudget.shortTitles.y2025')
          : t('federalBudget.shortTitles.y2024'),
        font: { size: 14 }
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
        external: null, // Allow tooltip to render outside the canvas
        usePointStyle: true,
        callbacks: {
          label: ({ label, parsed: value, dataset: { data } }) => {
            const total = data.reduce((a, b) => a + b, 0)
            const percentage = total ? ((value / total) * 100).toFixed(2) : '0.00'
            return `${label}: ${formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
  }))
  </script>
  
  <style scoped>
  .pie-chart-container {
    width: 100%;
    max-width: 412px; /* Increased by 15% from 358px */
    margin: 10px auto;
    padding: 10px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative; /* Added for tooltip positioning context */
    z-index: 1; /* Ensure proper stacking */
  }
  
  .pie-chart-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  
.pie-chart-inner-container {
  width: 100%;
  height: clamp(220px, 60vw, 360px);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  position: relative; /* Added for tooltip positioning */
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
  overflow-y: auto; /* Allow vertical scrolling if needed */
  max-height: 200px; /* Limit height and enable scrolling if needed */
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
  
  /* Ensure tooltips are not constrained */
  :deep(.chartjs-tooltip) {
    z-index: 10;
    pointer-events: none;
    position: absolute;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 600px) {
  .pie-chart-inner-container { height: clamp(200px, 70vw, 300px); }
}
  </style>
  
