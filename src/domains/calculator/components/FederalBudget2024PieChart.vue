<template>
  <div class="federal-budget-2024-pie-chart">
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
  import { budgetCategories2024 } from '@/domains/calculator/constants/taxData.js'
  import { useCalculator } from '../composables/calculator.js'
  import { useI18n } from '@/i18n'
  
  // Register Chart.js components
  ChartJS.register(ArcElement, Tooltip, Legend)
  
  // Create a ref for the legend container
  const legendRef = ref(null)
  
  // Extract data and flags
  const { netFederalTaxPerPeriod } = storeToRefs(useCalculatorStore())
  const { canCalculate } = useCalculator()
  const { t } = useI18n()

  // Helper function to get translated category name
  const getCategoryTranslation = (categoryKey) => {
    return t(`federalBudget.categories.y2024.${categoryKey}`) || categoryKey
  }
  
  // Compute 2024 federal budget data
  const federalBudget2024DataComputed = computed(() => {
    const totalBudget = budgetCategories2024.reduce((sum, cat) => sum + cat.amount, 0)
    
    if (netFederalTaxPerPeriod.value === 0) {
      return budgetCategories2024.map((cat) => ({
        category: getCategoryTranslation(cat.key || cat.name),
        amount: 0,
      }))
    }
    
    return budgetCategories2024.map((cat) => ({
      category: getCategoryTranslation(cat.key || cat.name),
      amount: (netFederalTaxPerPeriod.value * cat.amount) / totalBudget,
    }))
  })
  
  // Debug: log chart data on mount
  onMounted(() => {
    console.log('FederalBudget2024PieChart chartData:', chartData.value)
  })
  
  // Prepare chart data
  const chartData = computed(() => ({
    labels: federalBudget2024DataComputed.value.map(x => x.category),
    datasets: [
      {
        label: t('federalBudget.title'),
        data: federalBudget2024DataComputed.value.map(x => x.amount),
        backgroundColor: generateColors(federalBudget2024DataComputed.value.length),
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
        text: t('federalBudget.shortTitles.y2024Comprehensive'),
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
            return `${ctx.label}: ${formatCurrency(val)} (${perc}%)`
          },
        },
      },
    },
  }))
  </script>
  
  <style scoped>
  .federal-budget-2024-pie-chart {
    width: 100%;
    max-width: 412px;
    margin: 10px auto;
    padding: 10px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    z-index: 1;
  }
  
  .federal-budget-2024-pie-chart:hover {
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
  
  /* Ensure tooltips are not constrained */
  :deep(.chartjs-tooltip) {
    z-index: 10;
    pointer-events: none;
    position: absolute;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 600px) {
    .federal-budget-2024-pie-chart {
      max-width: 362px;
      padding: 8px;
    }
    
  .pie-chart-inner-container { height: clamp(200px, 70vw, 300px); }
  .legend-container { font-size: clamp(9px, 0.5vw + 8px, 11px); }
}
  </style>
  
