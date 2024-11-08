<!-- src/components/TaxPieChart.vue -->
<script>
import { Pie } from 'vue-chartjs';

export default {
  name: 'TaxPieChart',
  extends: Pie,
  props: [
    'federalTax',
    'provincialTax',
    'cppContribution',
    'eiPremium',
    'netIncome',
  ],
  computed: {
    chartData() {
      return {
        labels: [
          'Federal Tax',
          'Provincial Tax',
          'CPP/QPP Contribution',
          'EI Premium',
          'Net Income',
        ],
        datasets: [
          {
            backgroundColor: [
              '#e74c3c', // Federal Tax - Red
              '#3498db', // Provincial Tax - Blue
              '#9b59b6', // CPP/QPP Contribution - Purple
              '#f1c40f', // EI Premium - Yellow
              '#2ecc71', // Net Income - Green
            ],
            data: [
              this.federalTax || 0,
              this.provincialTax || 0,
              this.cppContribution || 0,
              this.eiPremium || 0,
              this.netIncome || 0,
            ],
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 12,
            boxWidth: 12,
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
              const amount = new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'CAD',
              }).format(value);
              return `${label}: ${amount} (${percentage}%)`;
            },
          },
        },
      };
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  },
  watch: {
    federalTax: 'updateChart',
    provincialTax: 'updateChart',
    cppContribution: 'updateChart',
    eiPremium: 'updateChart',
    netIncome: 'updateChart',
  },
  methods: {
    updateChart() {
      this.renderChart(this.chartData, this.chartOptions);
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 400px;
  margin: 0 auto;
}
</style>










































































  
  
  
  
  
  
  