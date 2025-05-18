<template>
  <div class="charts-panel">
    <!-- Revenue Sources Chart Section -->
    <div class="chart-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="material-icons icon">bar_chart</span>
          Revenue Sources
        </h2>
        <button 
          class="toggle-button" 
          :aria-expanded="isRevenueExpanded"
          aria-controls="revenue-chart-content"
          @click="isRevenueExpanded = !isRevenueExpanded"
        >
          <span class="material-icons">{{ isRevenueExpanded ? 'expand_less' : 'expand_more' }}</span>
          <span class="toggle-text">{{ isRevenueExpanded ? 'Collapse' : 'Expand' }}</span>
        </button>
      </div>
      
      <div 
        v-show="isRevenueExpanded"
        id="revenue-chart-content"
        class="chart-content"
        :class="{ 'collapsed': !isRevenueExpanded }"
      >
        <!-- Display Toggle -->
        <div class="display-toggle">
          <div class="toggle-group" role="group" aria-label="Display mode">
            <button 
              type="button" 
              class="toggle-option"
              :class="{ 'active': displayMode === 'amount' }"
              @click="displayMode = 'amount'"
              aria-pressed="displayMode === 'amount'"
            >
              Amount
            </button>
            <button 
              type="button" 
              class="toggle-option"
              :class="{ 'active': displayMode === 'percentage' }"
              @click="displayMode = 'percentage'"
              aria-pressed="displayMode === 'percentage'"
            >
              Percentage
            </button>
          </div>
        </div>
        
        <!-- Revenue Chart -->
        <div class="chart-wrapper">
          <div class="chart-container">
            <Bar
              :key="chartUpdateKey"
              :data="revenueChartData"
              :options="revenueChartOptions"
            />
          </div>
        </div>

        <!-- Categories Legend -->
        <div class="chart-legend">
          <!-- Income Tax Category -->
          <div class="category-group">
            <div class="category-header">
              <span class="legend-color" style="background-color: #2B6CB0" aria-hidden="true" />
              <span class="legend-label">Income Tax</span>
              <span class="legend-value">
                <template v-if="displayMode === 'amount'">
                  ${{ (getIncomeTaxTotal() || 0).toFixed(1) }}B
                </template>
                <template v-else>
                  {{ ((getIncomeTaxTotal() || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                </template>
              </span>
            </div>
            
            <!-- Income Tax Items -->
            <div class="category-items">
              <div
                v-for="source in incomeTaxSources"
                :key="source.id"
                class="legend-item"
              >
                <span class="legend-color" :style="{ backgroundColor: source.color }" aria-hidden="true" />
                <span class="legend-label" :title="source.name">{{ source.name }}</span>
                <span class="legend-value">
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
            <div class="category-header">
              <span class="legend-color" style="background-color: #2F855A" aria-hidden="true" />
              <span class="legend-label">Consumption Tax</span>
              <span class="legend-value">
                <template v-if="displayMode === 'amount'">
                  ${{ (getConsumptionTaxTotal() || 0).toFixed(1) }}B
                </template>
                <template v-else>
                  {{ ((getConsumptionTaxTotal() || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                </template>
              </span>
            </div>
            
            <!-- Consumption Tax Items -->
            <div class="category-items">
              <div
                v-for="source in consumptionTaxSources"
                :key="source.id"
                class="legend-item"
              >
                <span class="legend-color" :style="{ backgroundColor: source.color }" aria-hidden="true" />
                <span class="legend-label" :title="source.name">{{ source.name }}</span>
                <span class="legend-value">
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
            <div class="category-header">
              <span class="legend-color" style="background-color: #C05621" aria-hidden="true" />
              <span class="legend-label">Other Revenue Sources</span>
              <span class="legend-value">
                <template v-if="displayMode === 'amount'">
                  ${{ (getOtherRevenueTotal() || 0).toFixed(1) }}B
                </template>
                <template v-else>
                  {{ ((getOtherRevenueTotal() || 0) / (getTotalRevenue() || 1) * 100).toFixed(1) }}%
                </template>
              </span>
            </div>
            
            <!-- Other Revenue Items -->
            <div class="category-items">
              <div
                v-for="source in otherRevenueSources"
                :key="source.id"
                class="legend-item"
              >
                <span class="legend-color" :style="{ backgroundColor: source.color }" aria-hidden="true" />
                <span class="legend-label" :title="source.name">{{ source.name }}</span>
                <span class="legend-value">
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
      <div class="section-header">
        <h2 class="section-title">
          <span class="material-icons icon">donut_large</span>
          Spending Breakdown
        </h2>
        <button 
          class="toggle-button" 
          :aria-expanded="isSpendingExpanded"
          aria-controls="spending-chart-content"
          @click="isSpendingExpanded = !isSpendingExpanded"
        >
          <span class="material-icons">{{ isSpendingExpanded ? 'expand_less' : 'expand_more' }}</span>
          <span class="toggle-text">{{ isSpendingExpanded ? 'Collapse' : 'Expand' }}</span>
        </button>
      </div>
      
      <div 
        v-show="isSpendingExpanded"
        id="spending-chart-content"
        class="chart-content"
        :class="{ 'collapsed': !isSpendingExpanded }"
      >
        <!-- Spending Pie Chart -->
        <div class="chart-wrapper">
          <div class="chart-container">
            <SpendingPieChart 
              :dark-mode="false" 
              :height="chartHeight"
              :width="chartWidth"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useBudgetSimulatorStore } from '../store/budgetSimulator';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SpendingPieChart from '@/domains/budget/components/SpendingPieChart.vue';
import { debounce } from 'lodash-es';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const budgetStore = useBudgetSimulatorStore();

// UI state
const isRevenueExpanded = ref(true);
const isSpendingExpanded = ref(true);
const displayMode = ref('amount');
const chartUpdateKey = ref(0);
const isMobile = ref(window.innerWidth < 768);
const chartHeight = computed(() => (isMobile.value ? '300px' : '350px'));
const chartWidth = computed(() => '100%');

// Watch for changes in revenue sources to update chart
watch(() => budgetStore.revenueSources, () => {
  chartUpdateKey.value += 1;
}, { deep: true });

// Watch for display mode changes
watch(displayMode, () => {
  chartUpdateKey.value += 1;
});

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

// Chart options with improved accessibility and responsiveness
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
        grid: { 
          display: true, 
          drawBorder: true, 
          drawOnChartArea: true, 
          drawTicks: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return displayMode.value === 'amount' ? `$${value}B` : `${value}%`;
          },
          font: { 
            size: isMobile.value ? 10 : 11,
            family: "'Inter', sans-serif"
          },
          maxRotation: 0,
          padding: 10,
          color: '#4A5568'
        },
        title: {
          display: true,
          text: displayMode.value === 'amount' ? 'Billions of Dollars' : 'Percentage of Total Revenue',
          font: { 
            size: isMobile.value ? 11 : 12,
            family: "'Inter', sans-serif"
          },
          padding: { top: 10, bottom: 10 },
          color: '#4A5568'
        }
      },
      y: {
        grid: { display: false },
        ticks: { 
          font: { 
            size: isMobile.value ? 10 : 11,
            family: "'Inter', sans-serif"
          },
          padding: 10,
          color: '#4A5568',
          callback: function(value, index) {
            const label = this.getLabelForValue(index);
            return label.length > 25 ? label.substring(0, 22) + '...' : label;
          }
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  };
});

// Debounced resize handler
const handleResize = debounce(() => {
  isMobile.value = window.innerWidth < 768;
  chartUpdateKey.value += 1;
}, 250);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.charts-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  backdrop-filter: blur(10px);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  contain: content;
}

.charts-panel:hover {
  transform: translateY(-5px) translateZ(0);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.chart-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.chart-section:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.section-title .icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
  color: #4263eb;
}

.toggle-button {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #4a5568;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toggle-button:hover {
  color: #2d3748;
}

.toggle-button .material-icons {
  font-size: 1.25rem;
}

.toggle-text {
  font-size: 0.875rem;
  margin-left: 0.25rem;
}

.chart-content {
  padding: 1rem;
  transition: all 0.3s ease;
}

.chart-content.collapsed {
  height: 0;
  padding: 0;
  overflow: hidden;
}

.display-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.toggle-group {
  display: inline-flex;
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toggle-option {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  background-color: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-option:first-child {
  border-right: none;
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.toggle-option:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.toggle-option:hover {
  background-color: #f7fafc;
}

.toggle-option.active {
  background-color: #4299e1;
  color: white;
  border-color: #4299e1;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.chart-legend {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  padding-left: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.legend-color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 0.875rem;
  color: #4a5568;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #2d3748;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.category-header .legend-label {
  font-weight: 600;
  font-size: 1rem;
}

.category-header .legend-color {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .chart-section {
    border-radius: 0.5rem;
  }
  
  .section-header {
    padding: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .chart-content {
    padding: 0.75rem;
  }
  
  .category-items {
    grid-template-columns: 1fr;
  }
  
  .legend-label {
    font-size: 0.8125rem;
  }
  
  .legend-value {
    font-size: 0.8125rem;
  }
  
  .category-header .legend-label {
    font-size: 0.9375rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chart-content,
  .toggle-button,
  .toggle-option {
    transition: none;
  }
}

@media (forced-colors: active) {
  .chart-section {
    border: 1px solid CanvasText;
  }
  
  .section-header {
    border-bottom: 1px solid CanvasText;
  }
  
  .toggle-option {
    border: 1px solid CanvasText;
  }
  
  .legend-color {
    border: 1px solid CanvasText;
  }
}

@media (max-width: 600px) {
  .card-title, .card-content, .summary-card, .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header, .tile-title, .tile-amount, .slider-labels {
    writing-mode: initial !important;
    text-orientation: initial !important;
    transform: none !important;
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
  }
}
</style>
