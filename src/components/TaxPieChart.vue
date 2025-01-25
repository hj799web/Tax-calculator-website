<!-- src/components/TaxPieChart.vue -->
<template>
  <div class="pie-chart-container">
    <!-- Canvas Element for the Pie Chart -->
    <canvas
      ref="pieChart"
      width="600"
      height="600"
      role="img"
      aria-label="Your Tax Breakdown Pie Chart"
    />
    
    <!-- Optional: Display a message if there's no data -->
    <div
      v-if="!hasData"
      class="no-data"
    >
      <p>No tax data available to display.</p>
    </div>
  </div>
</template>

<script>
// Import Chart.js
import Chart from 'chart.js/auto';

export default {
  name: 'TaxPieChart',
  
  props: {
    federalTax: {
      type: Number,
      required: true,
      validator: (value) => value >= 0,
    },
    provincialTax: {
      type: Number,
      required: true,
      validator: (value) => value >= 0,
    },
    cppContribution: {
      type: Number,
      required: true,
      validator: (value) => value >= 0,
    },
    eiPremium: {
      type: Number,
      required: true,
      validator: (value) => value >= 0,
    },
    netIncome: {
      type: Number,
      required: true,
      validator: (value) => value >= 0,
    },
  },

  data() {
    return {
      chart: null, // To store the Chart instance
    };
  },

  computed: {
    /**
     * Determines if there's any tax data to display.
     */
    hasData() {
      return (
        this.federalTax > 0 ||
        this.provincialTax > 0 ||
        this.cppContribution > 0 ||
        this.eiPremium > 0 ||
        this.netIncome > 0
      );
    },
  },

  watch: {
    /**
     * Watch for changes in any of the tax-related props and update the chart accordingly.
     */
    federalTax() {
      this.updateChart();
    },
    provincialTax() {
      this.updateChart();
    },
    cppContribution() {
      this.updateChart();
    },
    eiPremium() {
      this.updateChart();
    },
    netIncome() {
      this.updateChart();
    },
  },

  mounted() {
    if (this.hasData) {
      this.renderChart();
    }
  },

  beforeUnmount() { // Updated lifecycle hook for Vue 3
    // Destroy the chart instance to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  },

  methods: {
    /**
     * Utility Method to Generate Distinct Colors
     * Generates a palette of colors based on the number of tax categories.
     * Extends the base colors if there are more categories than colors.
     */
    generateColors(count) {
      const baseColors = [
        '#FF6384', // Federal Tax
        '#36A2EB', // Provincial Tax
        '#FFCE56', // CPP/QPP Contribution
        '#4BC0C0', // EI Premium
        '#9966FF', // Net Income
      ];
      // Extend the color array if needed
      while (baseColors.length < count) {
        baseColors.push(...baseColors);
      }
      return baseColors.slice(0, count);
    },

    /**
     * Render the Chart
     * Initializes the Chart.js pie chart with the provided tax data.
     */
    renderChart() {
      const ctx = this.$refs.pieChart.getContext('2d');
      const labels = ['Federal Tax', 'Provincial Tax', 'CPP/QPP Contribution', 'EI Premium', 'Net Income'];
      const data = [
        this.federalTax || 0,
        this.provincialTax || 0,
        this.cppContribution || 0,
        this.eiPremium || 0,
        this.netIncome || 0
      ];
      const backgroundColors = this.generateColors(labels.length);

      // Sanitize data: Replace NaN or Infinite values with 0
      const sanitizedData = data.map(value => (isNaN(value) || !isFinite(value) ? 0 : value));

      // Validate that labels, data, and backgroundColors have the same length
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
              label: 'Tax Breakdown',
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
              position: 'right',
              labels: {
                color: '#333', // Text color for legend labels
                font: {
                  size: 14, // Font size for legend labels
                },
                boxWidth: 14, // Size of the color box in legend
                padding: 20, // Padding around legend labels
                usePointStyle: true, // Use point style markers
                /**
                 * Custom generateLabels function to include percentages in legend labels.
                 */
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
                      
                      // Access the meta data for the current data point
                      const meta = chart.getDatasetMeta(0);
                      const dataPoint = meta.data[i];
                      const hidden = dataPoint ? dataPoint.hidden : false;

                      return {
                        text: `${label}: ${percentage}%`,
                        fillStyle: dataset.backgroundColor[i],
                        hidden: hidden, // Reflect the actual hidden state
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
                /**
                 * Customizes the tooltip label to include category name, formatted amount, and percentage.
                 * @param {Object} tooltipItem - The tooltip item.
                 * @param {Object} data - The chart data.
                 * @returns {String} - Customized tooltip label.
                 */
                label: (tooltipItem, data) => {
                  const index = tooltipItem.index;
                  const label = data.labels[index];
                  const value = data.datasets[0].data[index];
                  const total = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
                  return `${label}: $${value.toLocaleString('en-CA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} (${percentage}%)`;
                },
              },
            },
            title: {
              display: true,
              text: 'Your Tax Breakdown',
              font: {
                size: 24, // Font size for the chart title
              },
              color: '#333', // Text color for the chart title
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

    /**
     * Updates the chart data and refreshes the chart.
     * Ensures that the chart exists before attempting to update.
     */
    updateChart() {
      if (this.chart) {
        const newData = [
          this.federalTax || 0,
          this.provincialTax || 0,
          this.cppContribution || 0,
          this.eiPremium || 0,
          this.netIncome || 0
        ];
        // Sanitize new data
        const sanitizedNewData = newData.map(value => (isNaN(value) || !isFinite(value) ? 0 : value));

        // Ensure the new data length matches existing labels
        if (sanitizedNewData.length !== this.chart.data.labels.length) {
          console.error('New data length does not match labels length.');
          return;
        }

        // Update the chart's data
        this.chart.data.datasets[0].data = sanitizedNewData;
        this.chart.update();
      } else if (this.hasData) {
        // If the chart hasn't been initialized yet but data is available
        this.renderChart();
      }
    },
  },
};
</script>

<style scoped>
.pie-chart-container {
  max-width: 600px;
  margin: 20px auto;
  position: relative;
  height: 600px;
  width: 600px;
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

















































































  
  
  
  
  
  
  