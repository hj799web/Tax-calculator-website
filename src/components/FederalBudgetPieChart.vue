<!-- src/components/FederalBudgetPieChart.vue -->
<template>
  <div class="pie-chart-container">
    <canvas
      ref="pieChart"
      width="600"
      height="600"
      role="img"
      aria-label="Federal Budget Allocation Pie Chart"
    ></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'; // Import Chart.js v2

export default {
  name: 'FederalBudgetPieChart',
  props: {
    budgetData: {
      type: Array,
      required: true,
      // Expected format:
      // [
      //   { category: 'Healthcare', amount: 50000000000 },
      //   { category: 'Support for Seniors', amount: 63000000000 },
      //   ...
      // ]
    },
  },
  data() {
    return {
      chart: null, // To store the Chart instance
    };
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    budgetData: {
      handler() {
        this.updateChart();
      },
      deep: true, // Watch for deep changes in the budgetData array
    },
  },
  methods: {
    formatNumber(value) {
      if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(1)}B`;
      } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(1)}M`;
      } else {
        return `$${value.toLocaleString('en-CA')}`;
      }
    },
    renderChart() {
      const ctx = this.$refs.pieChart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.budgetData.map((item) => item.category),
          datasets: [
            {
              data: this.budgetData.map((item) => item.amount),
              backgroundColor: [
                '#3498db', // Healthcare
                '#e74c3c', // Support for Seniors
                '#2ecc71', // Children and Families
                '#9b59b6', // Indigenous Services and Reconciliation
                '#f1c40f', // Employment Insurance and Other Benefits
                '#e67e22', // Defense and Public Safety
                '#1abc9c', // Debt Servicing
                '#95a5a6', // Public Debt Charges
                '#8e44ad', // Loans, Investments, and Advances
                '#f39c12', // Other Government Operations
                '#d35400', // International Financial Commitments
              ],
              borderColor: '#ffffff',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'right', // Changed from 'bottom' to 'right'
            labels: {
              fontSize: 14,
              boxWidth: 14,
              fontColor: '#333',
              padding: 20, // Adds space between legend items and chart
            },
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const index = tooltipItem.index;
                const label = data.labels[index];
                const value = data.datasets[0].data[index];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${this.formatNumber(value)} (${percentage}%)`;
              },
            },
          },
          title: {
            display: true,
            text: 'Federal Budget Allocation',
            fontSize: 24, // Increased font size for better visibility
            fontColor: '#333',
            position: 'top', // Ensures the title is at the top
            padding: 20, // Adds space around the title
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
        this.chart.data.labels = this.budgetData.map((item) => item.category);
        this.chart.data.datasets[0].data = this.budgetData.map(
          (item) => item.amount
        );
        this.chart.update();
      }
    },
  },
  beforeDestroy() {
    // Destroy the chart instance to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  },
};
</script>

<style scoped>
.pie-chart-container {
  max-width: 800px;
  margin: 30px auto;
  position: relative; /* Ensure proper positioning */
  height: 600px; /* Increased height for a larger chart */
  width: 600px; /* Increased width for a larger chart */
}
</style>








  
