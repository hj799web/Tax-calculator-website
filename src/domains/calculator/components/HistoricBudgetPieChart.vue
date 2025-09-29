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
import { budgetCategories2022 } from '@/domains/calculator/constants/taxData.js'
import { useI18n } from '@/i18n'

ChartJS.register(ArcElement, Tooltip, Legend)

const legendRef = ref(null)

const { netFederalTaxPerPeriod, totalTaxPerPeriod } = storeToRefs(useCalculatorStore())
const { canCalculate } = useCalculator()
const { t } = useI18n()

const getCategoryTranslation = (categoryKey) => {
  return t(`federalBudget.categories.y2022.${categoryKey}`) || categoryKey
}

onMounted(() => {
  console.log('HistoricBudgetPieChart chartData:', chartData.value)
})

const totalBudget = computed(() =>
  budgetCategories2022.reduce((sum, cat) => sum + cat.amount, 0)
)

const chartData = computed(() => {
  const hasTax = Number(netFederalTaxPerPeriod.value) > 0
  const data = budgetCategories2022.map(cat => ({
    category: cat.name,
    categoryKey: cat.key,
    amount: hasTax ? (netFederalTaxPerPeriod.value * cat.amount) / totalBudget.value : 0,
  }))
  return {
    labels: data.map(x => getCategoryTranslation(x.categoryKey || x.category)),
    datasets: [
      {
        label: t('federalBudget.title'),
        data: data.map(x => x.amount),
        backgroundColor: generateColors(data.length),
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    htmlLegend: {
      container: legendRef,
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: t('federalBudget.chartTitles.y2022', "2022–2023 Canada's Federal Budget Allocation Chart"),
      font: { size: 14 }
    },
    tooltip: {
      enabled: true,
      position: 'nearest',
      external: null,
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

.pie-chart-container:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); }

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

.legend-container:hover { transform: scale(1.01); }

.no-data { padding: 15px; color: #7f8c8d; font-size: 14px; text-align: center; background: #f8f9fa; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }

:deep(.chartjs-tooltip) { z-index: 10; pointer-events: none; position: absolute; }

@media (max-width: 600px) {
  .pie-chart-inner-container { height: clamp(200px, 70vw, 300px); }
}
</style>


