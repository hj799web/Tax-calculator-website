<template>
  <div class="pie-chart-container">
    <canvas
      ref="pieChart"
      width="600"
      height="600"
      :aria-label="ariaLabel"
      role="img"
    />
  </div>
</template>

<script>
import Chart from 'chart.js/auto'; // Updated import for Chart.js v3+

export default {
  name: 'GenericPieChart',
  
  props: {
    labels: {
      type: Array,
      required: true,
      validator: (value) => Array.isArray(value) && value.length > 0,
    },
    dataValues: {
      type: Array,
      required: true,
      validator: (value) =>
        Array.isArray(value) &&
        value.every((item) => typeof item === 'number' && item >= 0),
    },
    backgroundColors: {
      type: Array,
      required: true,
      validator: (value) =>
        Array.isArray(value) && value.every((color) => typeof color === 'string'),
    },
    chartLabel: {
      type: String,
      required: true,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      chart: null, // To store the Chart instance
    };
  },

  watch: {
    labels: 'updateChart',
    dataValues: 'updateChart',
    backgroundColors: 'updateChart',
  },

  mounted() {
    this.renderChart();
  },

  beforeUnmount() {
    // Destroy the chart instance to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  },

  methods: {
    /**
     * Render the Chart
     * Initializes the Chart.js pie chart with the provided data.
     */
    renderChart() {
      const ctx = this.$refs.pieChart.getContext('2d');

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: this.chartLabel,
              data: this.dataValues,
              backgroundColor: this.backgroundColors,
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
                fontColor: '#333',
                fontSize: 14,
                boxWidth: 14,
                padding: 20,
                usePointStyle: true,
              },
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const value = this.dataValues[tooltipItem.dataIndex];
                  const total = this.dataValues.reduce((acc, curr) => acc + curr, 0);
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${this.labels[tooltipItem.dataIndex]}: $${value.toLocaleString()} (${percentage}%)`;
                },
              },
            },
            title: {
              display: true,
              text: this.chartLabel,
              fontSize: 18,
              fontColor: '#333',
              padding: 20,
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    },

    /**
     * Update the Chart When Data Changes
     * Updates the chart's labels, data, and colors based on the new props.
     */
    updateChart() {
      if (this.chart) {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets[0].data = this.dataValues;
        this.chart.data.datasets[0].backgroundColor = this.backgroundColors;
        this.chart.update();
      }
    },
  },
};
</script>

<style scoped>
.pie-chart-container {
  max-width: 800px;
  margin: 30px auto;
  position: relative;
  height: 700px;
  width: 700px;
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

  