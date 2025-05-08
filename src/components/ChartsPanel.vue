<template>
  <div class="charts-panel">
    <!-- Revenue Sources Chart Section -->
    <div class="chart-section mb-6">
      <div class="section-header flex justify-between items-center mb-3">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
          <span class="material-icons mr-2 text-blue-500 text-sm">bar_chart</span>
          Revenue Sources
        </h2>
        <button 
          class="toggle-button flex items-center text-gray-500 hover:text-gray-700" 
          :aria-expanded="isRevenueExpanded"
          aria-controls="revenue-chart-content"
          @click="isRevenueExpanded = !isRevenueExpanded"
        >
          <span class="material-icons text-sm">{{ isRevenueExpanded ? 'expand_less' : 'expand_more' }}</span>
          <span class="text-xs ml-1">{{ isRevenueExpanded ? 'Collapse' : 'Expand' }}</span>
        </button>
      </div>
      
      <div 
        v-show="isRevenueExpanded"
        id="revenue-chart-content"
        class="border-t border-gray-200 pt-3 transition-all duration-300"
        :class="{ 'h-0 overflow-hidden pt-0 border-t-0': !isRevenueExpanded }"
      >
        <!-- Display Toggle -->
        <div class="flex justify-end mb-3">
          <div
            class="inline-flex rounded-md shadow-sm"
            role="group"
          >
            <button 
              type="button" 
              class="px-3 py-1 text-xs font-medium rounded-l-md" 
              :class="displayMode === 'amount' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
              @click="displayMode = 'amount'"
            >
              Amount
            </button>
            <button 
              type="button" 
              class="px-3 py-1 text-xs font-medium rounded-r-md" 
              :class="displayMode === 'percentage' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
              @click="displayMode = 'percentage'"
            >
              Percentage
            </button>
          </div>
        </div>
        
        <!-- Revenue Chart -->
        <div
          class="chart-container"
          :class="{ 'overflow-x-auto': isMobile }"
        >
          <div :style="{ height: chartHeight, minWidth: isMobile ? '600px' : 'auto' }">
            <Bar
              :key="chartUpdateKey"
              :data="revenueChartData"
              :options="revenueChartOptions"
            />
          </div>
        </div>

        <!-- Categories Legend -->
        <div class="chart-legend mt-4 flex flex-col gap-4">
          <!-- Income Tax Category -->
          <div class="category-group">
            <div class="category-header flex items-center mb-2">
              <span
                class="legend-color"
                style="background-color: #2B6CB0"
              />
              <span class="legend-label font-semibold">Income Tax</span>
              <span class="ml-auto font-semibold">
                <template v-if="displayMode === 'amount'">
                  ${{ (getIncomeTaxTotal() || 0).toFixed(1) }}B
                </template>
                <template v-else>
                  {{ ((getIncomeTaxTotal() || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                </template>
              </span>
            </div>
            
            <!-- Income Tax Items -->
            <div class="category-items grid grid-cols-2 gap-2 pl-6">
              <div
                v-for="source in incomeTaxSources"
                :key="source.id"
                class="legend-item"
              >
                <span
                  class="legend-color"
                  :style="{ backgroundColor: source.color }"
                />
                <span class="legend-label">{{ source.name }}</span>
                <span class="ml-auto">
                  <template v-if="displayMode === 'amount'">
                    ${{ (Number(source.adjustedAmount) || 0).toFixed(1) }}B
                  </template>
                  <template v-else>
                    {{ ((Number(source.adjustedAmount) || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                  </template>
                </span>
              </div>
            </div>
          </div>
          
          <!-- Consumption Tax Category -->
          <div class="category-group">
            <div class="category-header flex items-center mb-2">
              <span
                class="legend-color"
                style="background-color: #2F855A"
              />
              <span class="legend-label font-semibold">Consumption Tax</span>
              <span class="ml-auto font-semibold">
                <template v-if="displayMode === 'amount'">
                  ${{ (getConsumptionTaxTotal() || 0).toFixed(1) }}B
                </template>
                <template v-else>
                  {{ ((getConsumptionTaxTotal() || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                </template>
              </span>
            </div>
            
            <!-- Consumption Tax Items -->
            <div class="category-items grid grid-cols-2 gap-2 pl-6">
              <div
                v-for="source in consumptionTaxSources"
                :key="source.id"
                class="legend-item"
              >
                <span
                  class="legend-color"
                  :style="{ backgroundColor: source.color }"
                />
                <span class="legend-label">{{ source.name }}</span>
                <span class="ml-auto">
                  <template v-if="displayMode === 'amount'">
                    ${{ (Number(source.adjustedAmount) || 0).toFixed(1) }}B
                  </template>
                  <template v-else>
                    {{ ((Number(source.adjustedAmount) || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                  </template>
                </span>
              </div>
            </div>
          </div>
          
          <!-- Other Revenue Category -->
          <div class="category-group">
            <div class="category-header flex items-center mb-2">
              <span
                class="legend-color"
                style="background-color: #C05621"
              />
              <span class="legend-label font-semibold">Other Revenue Sources</span>
              <span class="ml-auto font-semibold">
                <template v-if="displayMode === 'amount'">
                  ${{ (getOtherRevenueTotal() || 0).toFixed(1) }}B
                </template>
                <template v-else>
                  {{ ((getOtherRevenueTotal() || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                </template>
              </span>
            </div>
            
            <!-- Other Revenue Items -->
            <div class="category-items grid grid-cols-2 gap-2 pl-6">
              <div
                v-for="source in otherRevenueSources"
                :key="source.id"
                class="legend-item"
              >
                <span
                  class="legend-color"
                  :style="{ backgroundColor: source.color }"
                />
                <span class="legend-label">{{ source.name }}</span>
                <span class="ml-auto">
                  <template v-if="displayMode === 'amount'">
                    ${{ (Number(source.adjustedAmount) || 0).toFixed(1) }}B
                  </template>
                  <template v-else>
                    {{ ((Number(source.adjustedAmount) || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Spending Breakdown Section -->
    <div class="chart-section">
      <div class="section-header flex justify-between items-center mb-3">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
          <span class="material-icons mr-2 text-green-500 text-sm">donut_large</span>
          Spending Breakdown
        </h2>
        <button 
          class="toggle-button flex items-center text-gray-500 hover:text-gray-700" 
          :aria-expanded="isSpendingExpanded"
          aria-controls="spending-chart-content"
          @click="isSpendingExpanded = !isSpendingExpanded"
        >
          <span class="material-icons text-sm">{{ isSpendingExpanded ? 'expand_less' : 'expand_more' }}</span>
          <span class="text-xs ml-1">{{ isSpendingExpanded ? 'Collapse' : 'Expand' }}</span>
        </button>
      </div>
      
      <div 
        v-show="isSpendingExpanded"
        id="spending-chart-content"
        class="border-t border-gray-200 pt-3 transition-all duration-300"
        :class="{ 'h-0 overflow-hidden pt-0 border-t-0': !isSpendingExpanded }"
      >
        <!-- Spending Pie Chart -->
        <SpendingPieChart 
          :dark-mode="false" 
          :height="300" 
          :width="isMobile ? 600 : 800"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useBudgetSimulatorStore } from '../stores/budgetSimulator.js';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SpendingPieChart from './budget/SpendingPieChart.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const budgetStore = useBudgetSimulatorStore();

// UI state
const isRevenueExpanded = ref(true);
const isSpendingExpanded = ref(true);
const displayMode = ref('amount'); // 'amount' or 'percentage'
const chartUpdateKey = ref(0);
const isMobile = ref(window.innerWidth < 768);
const chartHeight = computed(() => (isMobile.value ? '400px' : '350px'));

// Get revenue sources data and ensure valid numeric adjustedAmount
const revenueSources = computed(() => {
  return Object.values(budgetStore.revenueSources || {})
    .filter(
      source =>
        source &&
        source.id &&
        source.name &&
        !isNaN(Number(source.adjustedAmount))
    )
    .sort((a, b) => (Number(b.adjustedAmount) || 0) - (Number(a.adjustedAmount) || 0));
});

// Direct methods for calculating category totals with explicit conversion
function getIncomeTaxTotal() {
  try {
    const personal = Number(budgetStore.revenueSources?.personalIncomeTax?.adjustedAmount) || 0;
    const corporate = Number(budgetStore.revenueSources?.corporateIncomeTax?.adjustedAmount) || 0;
    const total = personal + corporate;
    return isNaN(total) ? 0 : total;
  } catch (e) {
    console.error('Error calculating income tax total:', e);
    return 0;
  }
}

function getConsumptionTaxTotal() {
  try {
    const gst = Number(budgetStore.revenueSources?.gst?.adjustedAmount) || 0;
    const excise = Number(budgetStore.revenueSources?.exciseTaxes?.adjustedAmount) || 0;
    const total = gst + excise;
    return isNaN(total) ? 0 : total;
  } catch (e) {
    console.error('Error calculating consumption tax total:', e);
    return 0;
  }
}

function getOtherRevenueTotal() {
  try {
    const otherSources = Object.values(budgetStore.revenueSources || {})
      .filter(s => s && s.id && !['personalIncomeTax', 'corporateIncomeTax', 'gst', 'exciseTaxes'].includes(s.id));
    const total = otherSources.reduce((sum, source) => {
      const amt = Number(source.adjustedAmount) || 0;
      return sum + amt;
    }, 0);
    return isNaN(total) ? 0 : total;
  } catch (e) {
    console.error('Error calculating other revenue total:', e);
    return 0;
  }
}

function getTotalRevenue() {
  try {
    const total = Number(budgetStore.totalRevenue) || 0;
    return total > 0 ? total : 1;
  } catch (e) {
    console.error('Error getting total revenue:', e);
    return 1;
  }
}

// Filtered revenue sources for categories
const incomeTaxSources = computed(() => {
  return revenueSources.value.filter(s =>
    ['personalIncomeTax', 'corporateIncomeTax'].includes(s.id)
  );
});

const consumptionTaxSources = computed(() => {
  return revenueSources.value.filter(s =>
    ['gst', 'exciseTaxes'].includes(s.id)
  );
});

const otherRevenueSources = computed(() => {
  return revenueSources.value.filter(s =>
    !['personalIncomeTax', 'corporateIncomeTax', 'gst', 'exciseTaxes'].includes(s.id)
  );
});

// Chart data
const revenueChartData = computed(() => {
  const sources = revenueSources.value;
  const labels = sources.map(source => source.name);
  const total = getTotalRevenue();
  
  let data;
  if (displayMode.value === 'amount') {
    data = sources.map(source => Number(source.adjustedAmount) || 0);
  } else {
    data = sources.map(source =>
      Number(source.adjustedAmount) && total ? (Number(source.adjustedAmount) / total) * 100 : 0
    );
  }
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: sources.map(source => source.color || '#cccccc'),
        borderColor: sources.map(source => source.color || '#cccccc'),
        borderWidth: 1,
      }
    ]
  };
});

// Chart options
const revenueChartOptions = computed(() => {
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const source = revenueSources.value[context.dataIndex];
            if (!source) return '';
            const amt = Number(source.adjustedAmount) || 0;
            const total = getTotalRevenue();
            const value = (Number(amt) || 0).toFixed(1);
            const percentage = total ? ((amt / total) * 100).toFixed(1) : 0;
            
            return displayMode.value === 'amount'
              ? `$${value}B (${percentage}% of total)`
              : `${percentage}% ($${value}B)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: true, drawBorder: true, drawOnChartArea: true, drawTicks: true },
        ticks: {
          callback: function(value) {
            return displayMode.value === 'amount' ? `$${value}B` : `${value}%`;
          },
          font: { size: 10 }
        },
        title: {
          display: true,
          text: displayMode.value === 'amount' ? 'Billions of Dollars' : 'Percentage of Total Revenue',
          font: { size: 11 }
        }
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };
});

// Watchers to update chart on relevant changes
watch(displayMode, () => {
  chartUpdateKey.value += 1;
});

// Watch for changes in revenue sources to update chart
watch(() => budgetStore.revenueSources, () => {
  chartUpdateKey.value += 1;
}, { deep: true });

// Responsive behavior
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.chart-section {
  @apply bg-white rounded-lg shadow-sm p-4;
}

.legend-item {
  @apply flex items-center gap-2;
}

.legend-color {
  @apply w-3 h-3 rounded-full flex-shrink-0;
}

.legend-label {
  @apply text-xs;
}

.legend-value {
  @apply text-xs text-gray-800 font-medium;
}

.category-header .legend-label {
  @apply text-sm;
}

.category-header .legend-value {
  @apply text-sm;
}

.category-header .legend-color {
  @apply w-4 h-4;
}

.charts-panel {
  padding: 1rem;
}

.chart-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.section-header {
  cursor: pointer;
}

.toggle-button {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.chart-container {
  transition: all 0.3s ease;
}

/* Animation for collapsible content */
.h-0 {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Ensure charts don't overflow when expanded */
#revenue-chart-content, #spending-chart-content {
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-container {
  position: relative;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
