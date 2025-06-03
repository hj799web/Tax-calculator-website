<template>
  <section class="simulator-card results-card">
    <h2 class="card-title">
      <span class="material-icons icon">analytics</span>
      Budget Results
    </h2>
    
    <!-- Deficit Warning Banner -->
    <div
      v-if="deficitWarningLevel !== 'none'" 
      class="deficit-warning-banner" 
      :class="deficitWarningClass"
      aria-live="polite"
    >
      <div class="warning-content">
        <span
          v-if="deficitWarningLevel === 'mild'"
          class="warning-icon"
        >🟡</span>
        <span
          v-if="deficitWarningLevel === 'high'"
          class="warning-icon"
        >🟠</span>
        <span
          v-if="deficitWarningLevel === 'critical'"
          class="warning-icon"
        >🔴</span>
        <span class="warning-message">{{ deficitWarningMessage }}</span>
        <button
          class="dismiss-button"
          aria-label="Dismiss warning"
          @click="dismissWarning"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
      <div
        class="warning-info-button"
        @click="showDeficitInfo = !showDeficitInfo"
      >
        <span class="material-icons">info</span>
      </div>
      
      <!-- Deficit Info Popover -->
      <div
        v-if="showDeficitInfo"
        class="deficit-info-popover"
      >
        <h3>Understanding Budget Deficits</h3>
        <p>Persistent budget deficits can lead to:</p>
        <ul>
          <li>Increased debt servicing costs</li>
          <li>Intergenerational financial burden</li>
          <li>Potential inflation pressure</li>
          <li>Reduced fiscal flexibility during economic downturns</li>
        </ul>
        <p>
          <a
            href="https://www.pbo-dpb.ca/en/research--recherche/research-publications--publications-de-recherche/fiscal-sustainability-report-2023--rapport-sur-la-viabilite-financiere-de-2023" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Learn more about public debt from the PBO
          </a>
        </p>
      </div>
    </div>
    
    <div class="card-content">
      <!-- Mobile Tab Navigation -->
      <div class="mobile-tabs">
        <button 
          :class="{ 'active-tab': activeTab === 'revenue' }" 
          class="tab-button"
          @click="activeTab = 'revenue'"
        >
          Revenue
        </button>
        <button 
          :class="{ 'active-tab': activeTab === 'spending' }" 
          class="tab-button"
          @click="activeTab = 'spending'"
        >
          Spending
        </button>
      </div>
      
      <div
        class="budget-results"
        :class="{ 'mobile-view': isMobileView }"
      >
        <!-- Revenue Tab Content -->
        <div
          v-show="activeTab === 'revenue' || !isMobileView"
          class="tab-content"
        >
          <!-- Revenue -->
          <div class="result-item">
            <span class="result-label">
              <span class="material-icons text-blue-500 mr-1 text-xs">trending_up</span>
              Total Revenue:
            </span>
            <span class="font-medium text-blue-600 text-sm">
              {{ formatCurrency(totalRevenueValue) }}
            </span>
          </div>
          
          <div class="toggle-details">
            <button
              class="download-button"
              title="Download as Image"
              @click="throttledDownloadChart('revenue')"
            >
              <span class="material-icons">download</span>
            </button>
          </div>
        </div>
        
        <!-- Spending Tab Content -->
        <div
          v-show="activeTab === 'spending' || !isMobileView"
          class="tab-content"
          :class="{ 'mobile-view': isMobileView }"
        >
          <!-- Spending -->
          <div class="result-item">
            <span class="result-label">
              <span class="material-icons text-red-500 mr-1 text-xs">trending_down</span>
              Total Spending:
            </span>
            <span class="font-medium text-red-600 text-sm tooltip-container"
              @mouseenter="showTooltip(formatPercentage(totalSpendingValue, totalRevenueValue) + ' of total revenue')"
              @mouseleave="hideTooltip()">
              {{ formatCurrency(totalSpendingValue) }}
            </span>
          </div>
          
          <!-- Surplus/Deficit -->
          <div class="result-item">
            <span class="result-label">
              <span
                class="material-icons mr-1 text-xs"
                :class="{
                  'text-green-500': surplusValue > 0,
                  'text-red-500': surplusValue < 0,
                  'text-gray-500': surplusValue === 0
                }"
              >
                {{ surplusValue > 0 ? 'trending_up' : surplusValue < 0 ? 'trending_down' : 'remove' }}
              </span>
              Surplus/Deficit:
            </span>
            <span
              class="font-medium text-sm tooltip-container"
              @mouseenter="showTooltip(formatPercentage(Math.abs(surplusValue), totalRevenueValue) + ' of total revenue')"
              @mouseleave="hideTooltip()"
              :class="{
                'text-green-600': surplusValue > 0,
                'text-red-600': surplusValue < 0,
                'text-gray-600': surplusValue === 0
              }"
            >
              {{ surplusValue > 0 ? 'Surplus: +' : surplusValue < 0 ? 'Deficit: ' : '' }}
              {{ formatCurrency(Math.abs(surplusValue)) }}
            </span>
          </div>

          <!-- Debt-to-GDP Ratio -->
          <div class="result-item" :class="{ 'mobile-view': isMobileView }">
            <span class="result-label">
              <span class="material-icons text-gray-500 mr-1 text-xs">account_balance</span>
              Debt-to-GDP Ratio:
              <span class="info-icon tooltip-container" 
                @mouseenter="showTooltip('The ratio of total federal debt to the size of the Canadian economy (GDP). Lower is generally better for fiscal health.')"
                @mouseleave="hideTooltip()"
                style="margin-left: 4px; cursor: pointer;">
                ⓘ
              </span>
            </span>
            <span class="font-medium text-gray-700 text-sm">
              {{ budgetStore.debtToGdpRatio.toFixed(1) }}%
            </span>
          </div>
          
          <div class="toggle-details">
            <button
              class="download-button"
              title="Download as Image"
              @click="throttledDownloadChart('spending')"
            >
              <span class="material-icons">download</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-semibold text-gray-800">
            Actions
          </h3>
          <button
            class="share-budget-button"
            @click="throttledShareBudget"
            aria-label="Share your budget on social media"
            style="display: flex; align-items: center; gap: 4px; background: #4263eb; color: #fff; border: none; border-radius: 4px; padding: 6px 14px; font-weight: 500; cursor: pointer; transition: background 0.2s;"
          >
            <span class="material-icons" style="font-size: 18px;">share</span>
            Share Budget
          </button>
        </div>
        <div class="action-buttons mt-2">
          <button
            class="action-button reset-button"
            @click="throttledResetBudget"
          >
            Reset Budget
          </button>
          <div class="auto-balance-container">
            <label class="auto-balance-label">
              <input
                type="checkbox"
                :checked="autoBalanceActive"
                @change="$emit('toggle-auto-balance', $event.target.checked)"
              >
              <span class="auto-balance-text">Auto-Balance Budget</span>
            </label>
            <div class="auto-balance-info">
              <span 
                class="info-icon"
                @mouseenter="showTooltip('When enabled, the system will automatically adjust revenue sources to balance the budget based on your spending choices.')"
                @mouseleave="hideTooltip()"
              >ⓘ</span>
            </div>
          </div>
          <button
            class="action-button save-button"
            @click="throttledSaveBudget"
          >
            Save Budget
          </button>
          
          <!-- Achievement Badges Section -->
          <div class="achievement-badges mt-4 pt-3 border-t border-gray-200">
            <div 
              class="section-header flex items-center justify-between cursor-pointer" 
              @click="showBadges = !showBadges"
            >
              <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span class="material-icons mr-2 text-amber-500 text-sm">emoji_events</span>
                Budget Achievements
              </h3>
              <span class="material-icons text-gray-500 text-sm">
                {{ showBadges ? 'expand_less' : 'expand_more' }}
              </span>
            </div>
            
            <transition name="slide-fade">
              <div
                v-if="showBadges"
                class="badge-container bg-gray-50 rounded-md p-3 shadow-sm"
              >
                <div
                  v-if="earnedBadges.length > 0"
                  class="flex flex-wrap justify-center gap-3"
                >
                  <AchievementBadge 
                    v-for="badge in earnedBadges" 
                    :key="badge.title + '-' + badge.tier" 
                    :badge="badge" 
                    size="medium"
                    :show-tooltip="true"
                  />
                </div>
                <div
                  v-else
                  class="text-center py-3"
                >
                  <p class="text-sm text-gray-500">
                    Make budget adjustments to earn achievement badges!
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <!-- Export Budget PDF Panel -->
    <ExportPanel />
  </section>
  <Teleport to="body">
    <div 
      v-if="activeTooltip"
      class="tooltip-text"
      :style="{ 
        visibility: activeTooltip ? 'visible' : 'hidden',
        opacity: activeTooltip ? 1 : 0
      }"
    >
      {{ activeTooltip }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { onUnmounted } from 'vue';
import ExportPanel from './ExportPanel.vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator.js';
import AchievementBadge from '@/domains/badges/components/AchievementBadge.vue';
import html2canvas from 'html2canvas';
import throttle from 'lodash.throttle';

// State for collapsible sections
const showBadges = ref(true);

const budgetStore = useBudgetSimulatorStore();

// Instead of using storeToRefs which can cause issues if the store is not fully initialized,
// we'll access the reactive properties directly from the store in our computed properties

// Use computed properties instead of refs for better reactivity
// These will automatically update when the store changes
const totalRevenueValue = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const _ = budgetStore.lastRevenueSourceUpdate;
  // eslint-disable-next-line no-unused-vars
  const __ = budgetStore.lastTaxExpenditureUpdate;
  // eslint-disable-next-line no-unused-vars
  const ___ = budgetStore.lastUpdate;
  return budgetStore.totalRevenue;
});

const totalSpendingValue = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const _ = budgetStore.lastUpdate;
  return budgetStore.totalSpending;
});

const surplusValue = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const _ = budgetStore.lastRevenueSourceUpdate;
  // eslint-disable-next-line no-unused-vars
  const __ = budgetStore.lastTaxExpenditureUpdate;
  // eslint-disable-next-line no-unused-vars
  const ___ = budgetStore.lastUpdate;
  return budgetStore.surplus;
});

// Get earned badges from the store with reactive dependency on lastBadgeUpdate
const earnedBadges = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const _ = budgetStore.lastBadgeUpdate;
  // eslint-disable-next-line no-unused-vars
  const __ = budgetStore.lastUpdate;
  return budgetStore.earnedBadges || [];
});





// Mobile view state
const isMobileView = ref(window.innerWidth < 768);
const activeTab = ref('revenue');

// Deficit warning state
const warningDismissed = ref(false);
const showDeficitInfo = ref(false);

// Function to reset warning dismissed state when deficit changes
function checkDeficitWarning() {
  if (surplusValue.value < 0) {
    warningDismissed.value = false;
  }
}

// Watch for changes to deficit to update warning state
watch(surplusValue, () => {
  console.log('Surplus/deficit changed, checking warning state');
  checkDeficitWarning();
});

// Setup on component mount
onMounted(() => {
  // Check deficit warning on initial load
  checkDeficitWarning();
  
  // Add window resize listener for mobile view
  window.addEventListener('resize', handleResize);
  
  // Initial check for mobile view
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Computed properties for deficit warning
const deficitWarningLevel = computed(() => {
  if (warningDismissed.value) return 'none';
  
  // Check if we have a surplus or small deficit (≤ $20B)
  if (surplusValue.value >= 0 || surplusValue.value > -20) {
    return 'none';
  }
  
  // $20B–$39.9B deficit: Mild Warning
  if (surplusValue.value >= -40) {
    return 'mild';
  }
  
  // $40B–$99.9B deficit: High Warning
  if (surplusValue.value >= -100) {
    return 'high';
  }
  
  // ≥ $100B deficit: Critical Deficit Alert
  return 'critical';
});

const deficitWarningMessage = computed(() => {
  switch (deficitWarningLevel.value) {
    case 'mild':
      return "Caution: Your deficit is approaching unsustainable levels.";
    case 'high':
      return "Warning: Large deficit may lead to long-term debt challenges.";
    case 'critical':
      return "Critical: Your deficit exceeds $100B — urgent action required.";
    default:
      return "";
  }
});

const deficitWarningClass = computed(() => {
  return {
    'mild-warning': deficitWarningLevel.value === 'mild',
    'high-warning': deficitWarningLevel.value === 'high',
    'critical-warning': deficitWarningLevel.value === 'critical'
  };
});

function dismissWarning() {
  warningDismissed.value = true;
}

// Handle window resize for responsive design
function handleResize() {
  isMobileView.value = window.innerWidth < 768;
}

// Download chart as image
function downloadChart(chartType) {
  const element = document.querySelector(`.tab-content:nth-child(${chartType === 'revenue' ? 1 : 2})`);
  if (!element) return;
  
  html2canvas(element).then(canvas => {
    const link = document.createElement('a');
    link.download = `budget-${chartType}-chart.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// Format percentage for tooltips
function formatPercentage(value, total) {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  autoBalanceActive: {
    type: Boolean,
    default: false
  }
});

// eslint-disable-next-line no-unused-vars
const emit = defineEmits(['share-budget', 'reset-budget', 'save-budget', 'toggle-auto-balance']);

const throttledShareBudget = throttle(() => {
  emit('share-budget');
}, 2000);

const throttledResetBudget = throttle(() => {
  emit('reset-budget');
}, 2000);

const throttledSaveBudget = throttle(() => {
  emit('save-budget');
}, 2000);

// Format currency for display
function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.0B';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + 'B';
}

const activeTooltip = ref('');

function showTooltip(text) {
  activeTooltip.value = text;
}

function hideTooltip() {
  activeTooltip.value = '';
}

// Throttle the downloadChart function
const throttledDownloadChart = throttle(downloadChart, 2000);
</script>

<style scoped>
/* Existing styles... */

/* Mobile Optimization Styles */
.mobile-tabs {
  display: none;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.mobile-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.tab-button {
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  color: #4a5568;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.active-tab {
  color: #3182ce;
  border-bottom: 2px solid #3182ce;
}

.mobile-view .tab-content {
  width: 100%;
}

/* Show tabs on mobile */
@media (max-width: 1024px) {
  .mobile-tabs {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }
  
  .budget-results {
    flex-direction: column;
    gap: 1rem;
  }
  
  .tab-content {
    margin-bottom: 1rem;
  }
  
  .deficit-warning-banner {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
  
  .warning-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .tab-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .deficit-warning-banner {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  
  .warning-content {
    gap: 0.25rem;
  }
  
  .tooltip-text {
    width: 100px;
    font-size: 0.7rem;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


/* Tooltip Styles */
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  width: 250px;
  background-color: #2d3748;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 8px 12px;
  position: fixed;
  z-index: 9999;
  bottom: 20px;
  left: 20px;
  transition: opacity 0.3s;
  font-size: 0.85rem;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  white-space: pre-line;
  word-wrap: break-word;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: -10px;
  left: 20px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #2d3748 transparent;
}

.tooltip-container:hover {
  cursor: help;
}

/* Download Button */
.download-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #4a5568;
  transition: color 0.2s;
  margin-left: 0.5rem;
}

.download-button:hover {
  color: #2d3748;
}

/* Deficit Warning Banner Styles */
.deficit-warning-banner {
  position: sticky;
  top: 0;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0.95;
  z-index: 100;
}

.mild-warning {
  background-color: rgba(255, 244, 141, 0.9);
  border-left: 4px solid #f6e05e;
}

.high-warning {
  background-color: rgba(255, 213, 170, 0.9);
  border-left: 4px solid #ed8936;
}

.critical-warning {
  background-color: rgba(254, 178, 178, 0.9);
  border-left: 4px solid #e53e3e;
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.warning-icon {
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
  min-width: 0; /* Prevent text from overflowing */
}

.dismiss-button {
  flex-shrink: 0;
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.dismiss-button:hover {
  opacity: 1;
}

.warning-info-button {
  cursor: pointer;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.warning-info-button:hover {
  opacity: 1;
}

.deficit-info-popover {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 10;
  margin-top: 0.5rem;
}

.deficit-info-popover h3 {
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.deficit-info-popover p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.deficit-info-popover ul {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.deficit-info-popover li {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.deficit-info-popover a {
  color: #3182ce;
  text-decoration: none;
  font-size: 0.85rem;
}

.deficit-info-popover a:hover {
  text-decoration: underline;
}

/* Auto-balance tooltip styles */
.auto-balance-container {
  position: relative;
  display: flex;
  align-items: center;
}

.auto-balance-info {
  position: relative;
  margin-left: 8px;
}

.info-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #4a5568;
  font-size: 12px;
  cursor: pointer;
}

.info-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background-color: #2d3748;
  color: white;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 20;
  margin-bottom: 8px;
  pointer-events: none;
}

.info-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #2d3748 transparent transparent transparent;
}

.auto-balance-info:hover .info-tooltip {
  visibility: visible;
  opacity: 1;
}

.budget-results {
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

.budget-results:hover {
  transform: translateY(-5px) translateZ(0);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.result-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
}

.result-card:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 6px 8px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.result-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-title .material-icons {
  color: #4299e1;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: right;
}

.result-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.change-positive {
  color: #38a169;
}

.change-negative {
  color: #e53e3e;
}

.result-description {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
}

.result-chart {
  width: 100%;
  height: 150px;
  margin-top: 1rem;
  transform: translateZ(0);
  will-change: transform;
}

/* Responsive Design */
@container (max-width: 768px) {
  .budget-results {
    padding: 1rem;
  }
  
  .results-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .result-card {
    padding: 1rem;
  }
  
  .result-title {
    font-size: 1rem;
  }
  
  .result-value {
    font-size: 1.25rem;
  }
  
  .result-chart {
    height: 120px;
  }
}

@container (max-width: 480px) {
  .budget-results {
    padding: 0.75rem;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .result-card {
    padding: 0.75rem;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .result-value {
    text-align: left;
  }
  
  .result-chart {
    height: 100px;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .budget-results:hover,
  .result-card:hover {
    transform: none;
  }
  
  .budget-results:active,
  .result-card:active {
    transform: translateY(-2px) translateZ(0);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .budget-results,
  .result-card {
    transition: none;
    transform: none !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .budget-results,
  .result-card {
    border: 2px solid CanvasText;
  }
  
  .result-title .material-icons {
    border: 2px solid CanvasText;
  }
}

/* Print Styles */
@media print {
  .budget-results {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .result-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .result-chart {
    display: none;
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
