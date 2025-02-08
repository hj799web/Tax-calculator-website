<template>
  <div
    v-if="canCalculate"
    class="pie-chart-container"
  >
    <div class="pie-chart-inner-container">
      <Pie
        :data="chartData"
        :options="chartOptions"
        :plugins="[htmlLegendPlugin]"
      />
    </div>
    <div id="taxlegend" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { Pie } from 'vue-chartjs';
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '../stores/calculator.js'
import { htmlLegendPlugin } from '../htmlLegendPlugin.js'
import { useCalculator } from '../composables/calculator.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const {
  netFederalTaxPerPeriod,
  netProvincialTaxPerPeriod,
  pensionPlanContributionPerPeriod,
  eiPremiumPerPeriod,
  netIncomeAfterCreditsPerPeriod
} = storeToRefs(useCalculatorStore())

const {
  canCalculate
} = useCalculator()

const chartData = computed(() => {
      if (!canCalculate.value) {
        return { labels: [], datasets: [] };
      }
      return {
        labels: [
          'Federal Tax',
          'Provincial Tax',
          'CPP/QPP',
          'EI',
          'Net Income',
        ],
        datasets: [
          {
            label: 'Tax Breakdown',
            data: [
              netFederalTaxPerPeriod.value,
              netProvincialTaxPerPeriod.value,
              pensionPlanContributionPerPeriod.value,
              eiPremiumPerPeriod.value,
              netIncomeAfterCreditsPerPeriod.value,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderWidth: 1,
          },
        ],
      };
    });

const chartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          htmlLegend: {
            containerID: 'taxlegend'
          },
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (!data || !data.datasets.length) return [];
                const dataset = data.datasets[0];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                return data.labels.map((label, i) => {
                  const val = dataset.data[i];
                  const perc = total ? ((val / total) * 100).toFixed(2) : '0.00';
                  return {
                    text: `${label}: $${val.toLocaleString('en-CA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} (${perc}%)`,
                    fillStyle: dataset.backgroundColor[i],
                    hidden: false,
                    index: i,
                  };
                });
              },
            },
          },
          title: {
            display: true,
            text: 'Tax Breakdown',
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const ds = ctx.dataset.data;
                const total = ds.reduce((a, b) => a + b, 0);
                const perc = total ? ((val / total) * 100).toFixed(2) : '0.00';
                const formattedVal = val.toLocaleString('en-CA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            return `${ctx.label}: $${formattedVal} (${perc}%)`;
              },
            },
          },
        },
      };
    })

</script>

<style scoped>
.pie-chart-container {
  max-width: 400px;
  margin: 20px auto;
  position: relative;
  height: 400px;
  width: 400px;
}

.pie-chart-inner-container {
  height: 300px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

#taxlegend {
  max-width: 400px;
  font-size: 14px;
}

/* Optional: Styling for no data message */
.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7f8c8d;
  font-size: 18px;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pie-chart-container {
    height: 500px;
    width: 500px;
  }
}

@media (max-width: 480px) {
  .pie-chart-container {
    height: 400px;
    width: 400px;
  }
}
</style>

















































































  
  
  
  
  
  
  