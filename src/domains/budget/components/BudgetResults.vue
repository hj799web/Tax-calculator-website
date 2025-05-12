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
              @click="downloadChart('revenue')"
            >
              <span class="material-icons">download</span>
            </button>
          </div>
        </div>
        
        <!-- Spending Tab Content -->
        <div
          v-show="activeTab === 'spending' || !isMobileView"
          class="tab-content"
        >
          <!-- Spending -->
          <div class="result-item">
            <span class="result-label">
              <span class="material-icons text-red-500 mr-1 text-xs">trending_down</span>
              Total Spending:
            </span>
            <span class="font-medium text-red-600 text-sm tooltip-container">
              {{ formatCurrency(totalSpendingValue) }}
              <div class="tooltip-text">
                {{ formatPercentage(totalSpendingValue, totalRevenueValue) }} of total revenue
              </div>
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
              :class="{
                'text-green-600': surplusValue > 0,
                'text-red-600': surplusValue < 0,
                'text-gray-600': surplusValue === 0
              }"
            >
              {{ surplusValue > 0 ? 'Surplus: +' : surplusValue < 0 ? 'Deficit: ' : '' }}
              {{ formatCurrency(Math.abs(surplusValue)) }}
              <div class="tooltip-text">
                {{ formatPercentage(Math.abs(surplusValue), totalRevenueValue) }} of total revenue
              </div>
            </span>
          </div>
          
          <div class="toggle-details">
            <button
              class="download-button"
              title="Download as Image"
              @click="downloadChart('spending')"
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
            @click="$emit('share-budget')"
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
            @click="$emit('reset-budget')"
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
              <span class="info-icon">ⓘ</span>
              <div class="info-tooltip">
                When enabled, the system will automatically adjust revenue sources to balance the budget based on your spending choices.
              </div>
            </div>
          </div>
          <button
            class="action-button save-button"
            @click="$emit('save-budget')"
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
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { onUnmounted } from 'vue';
import ExportPanel from './ExportPanel.vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator.js';
import AchievementBadge from '@/domains/badges/components/AchievementBadge.vue';
import html2canvas from 'html2canvas';

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
const emit = defineEmits(['reset-budget', 'toggle-auto-balance', 'save-budget']);

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
</script>

<style scoped>
/* Existing styles... */

/* Mobile Optimization Styles */
.mobile-tabs {
  display: none;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: #4a5568;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.active-tab {
  color: #3182ce;
  border-bottom: 2px solid #3182ce;
}

.mobile-view .tab-content {
  width: 100%;
}

/* Show tabs on mobile */
@media (max-width: 767px) {
  .mobile-tabs {
    display: flex;
    justify-content: space-around;
  }
  
  .budget-results {
    flex-direction: column;
  }
  
  .tab-content {
    margin-bottom: 1rem;
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
  visibility: hidden;
  width: 120px;
  background-color: #2d3748;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 10;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.75rem;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
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
  flex: 1;
}

.warning-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.warning-message {
  font-weight: 600;
  font-size: 0.9rem;
}

.dismiss-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
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
</style>
