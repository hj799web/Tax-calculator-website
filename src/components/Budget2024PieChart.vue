<template>
  <div class="pie-chart-container">
    <canvas
      ref="budget2024PieChartRef"
      width="800"
      height="800"
      role="img"
      aria-label="Budget 2024 Allocation Pie Chart"
    />
    <div
      v-if="!hasData"
      class="no-data"
    >
      <p>No budget data available to display.</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'Budget2024PieChart',
  props: {
    budget2024Data: {
      type: Array,
      required: true,
      default: () => [],
      validator: (data) =>
        data.every(
          (item) =>
            Object.prototype.hasOwnProperty.call(item, 'category') &&
            Object.prototype.hasOwnProperty.call(item, 'amount') &&
            typeof item.amount === 'number'
        ),
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    hasData() {
      return this.budget2024Data.length > 0;
    },
  },
  watch: {
    budget2024Data: {
      handler: 'updateChart',
      deep: true,
    },
  },
  mounted() {
    if (this.hasData) {
      this.renderChart();
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    generateColors(count) {
      const baseColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ];
      while (baseColors.length < count) {
        baseColors.push(...baseColors);
      }
      return baseColors.slice(0, count);
    },
    renderChart() {
      const ctx = this.$refs.budget2024PieChartRef.getContext('2d');
      if (!ctx) {
        console.error(`Canvas context not found for ${this.$refs.budget2024PieChartRef}`);
        return;
      }
      const labels = this.budget2024Data.map((item) => item.category);
      const data = this.budget2024Data.map((item) => item.amount);
      const backgroundColors = this.generateColors(labels.length);
      const sanitizedData = data.map(value => (isNaN(value) || !isFinite(value) ? 0 : value));
      if (labels.length !== sanitizedData.length || sanitizedData.length !== backgroundColors.length) {
        console.error('Labels, data, and backgroundColors must be of the same length.');
        return;
      }
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Budget 2024 Allocation',
              data: sanitizedData,
              backgroundColor: backgroundColors,
              borderColor: '#ffffff',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#333',
                font: {
                  size: 14,
                },
                boxWidth: 14,
                padding: 20,
                usePointStyle: true,
                generateLabels: function (chart) {
                  const data = chart.data;
                  if (data.datasets.length) {
                    return data.labels.map(function (label, i) {
                      const dataset = data.datasets[0];
                      const currentValue = dataset.data[i];
                      const total = dataset.data.reduce(function (acc, curr) {
                        return acc + curr;
                      }, 0);
                      const percentage = total > 0 ? ((currentValue / total) * 100).toFixed(2) : '0.00';
                      const meta = chart.getDatasetMeta(0);
                      const dataPoint = meta.data[i];
                      const hidden = dataPoint ? dataPoint.hidden : false;
                      return {
                        text: `${label}: ${percentage}%`,
                        fillStyle: dataset.backgroundColor[i],
                        hidden: hidden,
                        index: i,
                      };
                    });
                  }
                  return [];
                },
              },
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function (tooltipItem, data) {
                  const label = data.labels[tooltipItem.index] || '';
                  const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                  const total = data.datasets[tooltipItem.datasetIndex].data.reduce((acc, curr) => acc + curr, 0);
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${label}: $${value.toLocaleString('en-CA', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })} (${percentage}%)`;
                },
              },
            },
            title: {
              display: true,
              text: 'Budget 2024 Allocation',
              font: {
                size: 25,
              },
              color: '#333',
              padding: {
                top: 20,
                bottom: 20,
              },
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    },
    updateChart() {
      if (this.chart) {
        const newLabels = this.budget2024Data.map((item) => item.category);
        const newData = this.budget2024Data.map((item) => item.amount);
        const newBackgroundColors = this.generateColors(newLabels.length);
        const sanitizedNewData = newData.map(value => (isNaN(value) || !isFinite(value) ? 0 : value));
        if (newLabels.length !== sanitizedNewData.length || sanitizedNewData.length !== newBackgroundColors.length) {
          console.error('Labels, data, and backgroundColors must be of the same length.');
          return;
        }
        this.chart.data.labels = newLabels;
        this.chart.data.datasets[0].data = sanitizedNewData;
        this.chart.data.datasets[0].backgroundColor = newBackgroundColors;
        this.chart.update();
      }
    },
  },
};
</script>

<style scoped>
.pie-chart-container {
  max-width: 650px;
  margin: 30px auto;
  position: relative;
  height: 600px;
  width: 600px;
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