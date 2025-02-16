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
import { useCalculator } from '../composables/calculator.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const {
  federalBudgetData
} = storeToRefs(useCalculatorStore())

const {
  canCalculate
} = useCalculator()

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
/* Container for individual pie charts */
.pie-chart-container {
  width: 100%;
  max-width: 250px;  /* Reduced maximum size on larger screens */
  margin: 20px auto;
  position: relative;
  /* Removed aspect-ratio to allow the height to be determined by content */
}

/* Inner container to center the chart */
.pie-chart-inner-container {
  width: 100%;
  height: 250px;  /* Fixed height for the chart area */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;  /* Reduced margin */
}

/* Legend container - adjusted to match container width */
#federallegend {
  width: 100%;
  max-width: 550px;    /* Adjusted to match the container */
  font-size: 10px;     /* Smaller font size */
  text-align: center;
  margin: 5px auto;
  display: block;
}

/* No data overlay */
.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7f8c8d;
  font-size: 16px;     /* Reduced font size */
  text-align: center;
}

/* Wrapper for multiple pie charts to avoid overlap */
.charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;  /* Increased gap to avoid overlapping */
  justify-content: center;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .pie-chart-container {
    max-width: 220px;
  }
}

@media (max-width: 480px) {
  .pie-chart-container {
    max-width: 180px;
  }
  .charts-wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>

