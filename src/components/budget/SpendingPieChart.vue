<template>
  <div class="spending-pie-chart" :class="{ 'dark-mode': darkMode }">
    <h3 class="chart-title">Federal Spending Breakdown</h3>
    
    <div v-if="totalSpending === 0" class="no-data-message">
      Adjust spending sliders to view the breakdown.
    </div>
    
    <div v-else class="chart-container">
      <Pie 
        :data="chartData" 
        :options="chartOptions"
        :height="height"
        :width="width"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Props
const props = defineProps({
  darkMode: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 300
  },
  width: {
    type: Number,
    default: 300
  }
});

// Store
const budgetStore = useBudgetSimulatorStore();

// Computed properties
const totalSpending = computed(() => budgetStore.totalSpending);

// Get categories including main categories and group totals for Other Categories and Government Operations
const categories = computed(() => {
  const result = [];
  
  // Add main categories (healthcare, seniors, etc.)
  for (const key in budgetStore.spendingCategories) {
    const category = budgetStore.spendingCategories[key];
    
    // Include direct categories (not groups) and not children of groups
    if (!category.isGroup && category.baseAmount && !key.includes('.')) {
      result.push({
        id: category.id,
        name: category.name,
        amount: category.baseAmount * category.adjustmentFactor,
        color: category.color
      });
    }
  }
  
  // Add Loans, Investments & Advances as a whole section
  if (budgetStore.spendingCategories.loansInvestments) {
    result.push({
      id: 'loansInvestments',
      name: 'Loans, Investments & Advances',
      amount: budgetStore.loansInvestmentsSpending,
      color: '#ECC94B' // yellow-500
    });
  }
  
  // Add Government Operations as a whole section
  if (budgetStore.spendingCategories.governmentOperations) {
    result.push({
      id: 'governmentOperations',
      name: 'Government Operations',
      amount: budgetStore.governmentOperationsSpending,
      color: '#805AD5' // purple-600
    });
  }
  
  return result;
});

// Chart data
const chartData = computed(() => {
  const labels = categories.value.map(cat => cat.name);
  const data = categories.value.map(cat => cat.amount);
  const backgroundColor = categories.value.map(cat => cat.color);
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 1,
        borderColor: props.darkMode ? '#2D3748' : '#FFFFFF'
      }
    ]
  };
});

// Chart options
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800
    },
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? 'bottom' : 'right',
        align: 'center',
        labels: {
          color: props.darkMode ? '#E2E8F0' : '#2D3748',
          font: {
            size: 12
          },
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: $${value.toFixed(1)}B (${percentage}%)`;
          }
        },
        backgroundColor: props.darkMode ? '#4A5568' : '#FFFFFF',
        titleColor: props.darkMode ? '#E2E8F0' : '#2D3748',
        bodyColor: props.darkMode ? '#E2E8F0' : '#2D3748',
        borderColor: props.darkMode ? '#2D3748' : '#E2E8F0',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true
      },
      title: {
        display: false
      }
    }
  };
});

// Handle responsive legend
const updateLegendPosition = () => {
  chartOptions.value.plugins.legend.position = window.innerWidth < 768 ? 'bottom' : 'right';
};

// Watch for spending changes to update the chart
watch(totalSpending, () => {
  // Chart will automatically update due to reactivity
}, { deep: true });

// Watch for dark mode changes
watch(() => props.darkMode, () => {
  // Update chart colors for dark mode
  chartOptions.value.plugins.legend.labels.color = props.darkMode ? '#E2E8F0' : '#2D3748';
  chartOptions.value.plugins.tooltip.backgroundColor = props.darkMode ? '#4A5568' : '#FFFFFF';
  chartOptions.value.plugins.tooltip.titleColor = props.darkMode ? '#E2E8F0' : '#2D3748';
  chartOptions.value.plugins.tooltip.bodyColor = props.darkMode ? '#E2E8F0' : '#2D3748';
  chartOptions.value.plugins.tooltip.borderColor = props.darkMode ? '#2D3748' : '#E2E8F0';
  chartData.value.datasets[0].borderColor = props.darkMode ? '#2D3748' : '#FFFFFF';
}, { immediate: true });

// Set up resize listener for responsive legend
onMounted(() => {
  window.addEventListener('resize', updateLegendPosition);
  updateLegendPosition(); // Initial setup
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', updateLegendPosition);
});
</script>

<style scoped>
.spending-pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dark-mode {
  background-color: #2D3748;
  color: #E2E8F0;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.no-data-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  font-size: 1rem;
  color: #718096;
  text-align: center;
  padding: 1rem;
  border: 1px dashed #CBD5E0;
  border-radius: 0.5rem;
}

.dark-mode .no-data-message {
  color: #A0AEC0;
  border-color: #4A5568;
}

/* Responsive styles */
@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>
