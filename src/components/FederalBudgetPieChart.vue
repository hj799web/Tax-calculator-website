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
      <div id="federallegend" />
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
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { Pie } from 'vue-chartjs';
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '../stores/calculator.js'
import { generateColors } from '../utils.js'
import { htmlLegendPlugin } from '../htmlLegendPlugin.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const {
  federalBudgetData,
  canCalculate
} = storeToRefs(useCalculatorStore())

const chartData = computed(() => ({
      labels: federalBudgetData.value.map((x) => x.category),
      datasets: [
        {
          label: 'Federal Budget Allocation',
          data: federalBudgetData.value.map((x) => x.amount),
          backgroundColor: generateColors(federalBudgetData.value.length),
          borderWidth: 1,
        },
      ],
    }));

const chartOptions = computed(() => {
      return {
        responsive: true,
        plugins: {
          htmlLegend: {
            containerID: 'federallegend'
          },
          legend: {
            display: false,
            fullSize: false,
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
            text: 'Federal Budget Allocation',
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
    }
  )
</script>

<style scoped>
.pie-chart-container {
  max-width: 500px;
  margin: 30px auto;
  position: relative;
  width: 500px;
}

.pie-chart-inner-container {
  height: 400px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

#federallegend {
  max-width: 500px;
  font-size: 14px;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7f8c8d;
  font-size: 18px;
  text-align: center;
}

@media (max-width: 768px) {
  .pie-chart-container {
    height: 600px;
    width: 600px;
  }
}

@media (max-width: 680px) {
  .pie-chart-container {
    height: 600px;
    width: 600px;
  }
}
</style>