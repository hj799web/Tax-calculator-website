<template>
  <div
    class="finance-minister-simulator"
    :class="{ 'panel-collapsed': !badgePanelExpanded }"
  >
    <OnboardingTour />
    <!-- Public Sentiment Banner (includes fiscal chaos warning when needed) -->
    <CollapsibleSentimentBanner
      :emoji="groupSentimentEmoji"
      :score="groupSentimentScore"
      :label="groupSentimentLabel"
      :selected-groups="selectedGroups"
      :fiscal-chaos="fiscalChaos"
      @update:selectedGroups="selectedGroups = $event"
    />
    
    <!-- Retractable Badge Panel at Top Left with View All button -->
    <div
      class="fixed-badge-container"
      :class="{ 'collapsed': !badgePanelExpanded }"
    >
      <div class="badges-header">
        <div class="badges-title-container">
          <span class="badges-title">Your Achievements</span>
          <button
            class="toggle-badge-panel-btn"
            @click="toggleBadgePanel"
          >
            <span class="material-icons">{{ badgePanelExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</span>
          </button>
        </div>
        <button
          class="view-all-badges-btn"
          @click="showBadgeGallery = true"
        >
          <span class="material-icons">emoji_events</span>
          View All Badges
        </button>
      </div>
      <div
        v-show="badgePanelExpanded"
        class="badges-display"
      >
        <AchievementBadge
          v-for="badge in budgetStore.badges"
          :key="badge.title"
          :badge="badge"
          size="medium"
          :show-tooltip="true"
        />
        <div
          v-if="budgetStore.badges.length === 0"
          class="no-badges-message"
        >
          Make budget decisions to earn badges!
        </div>
      </div>
    </div>
    
    <!-- Badge Gallery Modal -->
    <BadgeGalleryModal 
      :is-open="showBadgeGallery" 
      @close="showBadgeGallery = false" 
    />

    <div class="main-container">
      <div class="logo-container">
        <img
          :src="logoUrl"
          alt="Fiscal Insights Logo"
          class="site-logo"
        >
      </div>
      <div class="flex justify-between items-center mb-0">
        <h1 class="main-title">Budget Simulator: Be the Finance Minister</h1>
      </div>

      <MainNavigation />

      <!-- Sub Navigation Bar -->
      <nav class="sub-navigation">
        <a @click="scrollToSection('budget-goals')" class="sub-nav-link">
          <span class="material-icons">flag</span>
          Budget Goals
        </a>
        <a @click="scrollToSection('budget-results')" class="sub-nav-link">
          <span class="material-icons">summarize</span>
          Budget Results
        </a>
        <a @click="scrollToSection('revenue-sources')" class="sub-nav-link">
          <span class="material-icons">payments</span>
          Revenue Sources
        </a>
        <a @click="scrollToSection('spending-controls')" class="sub-nav-link">
          <span class="material-icons">payments</span>
          Spending Controls
        </a>
        <a @click="scrollToSection('budget-analysis')" class="sub-nav-link">
          <span class="material-icons">bar_chart</span>
          Budget Analysis
        </a>
        <a @click="scrollToSection('public-sentiment')" class="sub-nav-link">
          <span class="material-icons">people</span>
          Public Sentiment
        </a>
      </nav>

      <p class="description">Experience what it's like to manage Canada's federal budget. Adjust revenue sources and spending priorities to balance the budget while considering public sentiment across different regions and sectors.</p>

      <!-- Year Selector -->
      <YearSelector 
        :current-year="currentYear" 
        @year-selected="selectYear" 
      />

      <div class="simulator-grid">
        <!-- Budget Goals Section -->
        <section id="budget-goals" class="simulator-card goals-card">
          <h2 class="card-title" @click="toggleSection('budgetGoals')">
            <span class="material-icons icon">flag</span>
            Budget Goals
            <span class="material-icons toggle-icon" :class="{ 'rotated': !sectionsExpanded.budgetGoals }">expand_more</span>
          </h2>
          <div class="card-content" v-show="sectionsExpanded.budgetGoals">
            <!-- Budget Goals feature temporarily disabled -->
            <GoalTracker 
              v-if="FEATURES_ENABLED.budgetGoals"
              :current-revenue="budgetStore.totalRevenue"
              :current-spending="budgetStore.totalSpending"
              :initial-goals="budgetStore.budgetGoals"
              :surplus="budgetStore.surplus"
              @goal-status-changed="updateGoalStatus"
              @auto-balance-toggled="toggleAutoBalance"
            />
            
            <!-- Party Budget Comparison Tool -->
            <PartyBudgetSharing v-if="!FEATURES_ENABLED.budgetGoals" />
          </div>
        </section>

        <!-- Budget Results Section -->
        <div v-if="fiscalChaos" class="budget-chaos-warning">
          <strong>⚠️ Public outrage: Revenue system in chaos! ⚠️</strong>
        </div>
        <BudgetResults 
          id="budget-results"
          :total-revenue="budgetStore.totalRevenue"
          :total-spending="budgetStore.totalSpending"
          :surplus="budgetStore.surplus"
          :auto-balance-active="autoBalanceActive"
          :fiscal-chaos="fiscalChaos"
          @reset-budget="resetBudget"
          @toggle-auto-balance="toggleAutoBalance"
          @save-budget="saveBudget"
          @share-budget="openSocialShareModal"
        />
        
        <!-- Budget Presets Section -->
        <section class="simulator-card preset-panel-container">
          <PresetSelector
            @preset-applied="handlePresetApplied"
            @preset-reset="resetBudget"
          />
        </section>

        <!-- Revenue Sources Section -->
        <section id="revenue-sources" class="simulator-card revenue-card">
          <h2 class="card-title" @click="toggleSection('revenueSources')">
            <span class="material-icons icon">payments</span>
            Revenue Sources
            <span class="material-icons toggle-icon" :class="{ 'rotated': !sectionsExpanded.revenueSources }">expand_more</span>
          </h2>
          <div class="card-content" v-show="sectionsExpanded.revenueSources">
            <RevenueSliders :auto-balance-active="autoBalanceActive" />
          </div>
        </section>

        <!-- Spending Controls Section -->
        <section id="spending-controls" class="simulator-card spending-card">
          <h2 class="card-title" @click="toggleSection('spendingControls')">
            <span class="material-icons icon">payments</span>
            Spending Controls
            <span class="material-icons toggle-icon" :class="{ 'rotated': !sectionsExpanded.spendingControls }">expand_more</span>
          </h2>
          <div class="card-content" v-show="sectionsExpanded.spendingControls">
            <SpendingControls 
              :main-categories="mainCategories"
              :other-categories-groups="otherCategoriesGroups"
              :sorted-gov-ops-children="sortedGovOpsChildren"
              :spending-factors="spendingFactors"
              :auto-balance-active="autoBalanceActive"
              :expanded-groups="expandedGroups"
              :total-main-categories="budgetStore.mainCategoriesSpending"
              :total-other-categories="budgetStore.otherCategoriesTotal"
              :total-gov-ops="budgetStore.governmentOperationsSpending"
              :total-spending="budgetStore.totalSpending"
              :get-group-children="budgetStore.getGroupChildren"
              @update-spending-factor="updateSpendingFactor"
              @update-group-spending-factor="updateGroupSpendingFactor"
              @toggle-group-expansion="toggleGroupExpansion"
              @reset-gov-ops="resetGovOpsSubcategories"
              @reset-other-categories="resetOtherCategoriesSubcategories"
            />
          </div>
        </section>

        <!-- Charts Panel -->
        <section id="budget-analysis" class="simulator-card charts-card">
          <ChartsPanel />
        </section>
        
        <!-- Public Sentiment Section -->
        <section id="public-sentiment" class="simulator-card sentiment-card">
          <h2 class="card-title" @click="toggleSection('publicSentiment')">
            <span class="material-icons icon">sentiment_satisfied</span>
            Public Sentiment
            <span class="material-icons toggle-icon" :class="{ 'rotated': !sectionsExpanded.publicSentiment }">expand_more</span>
          </h2>
          <div class="card-content" v-show="sectionsExpanded.publicSentiment">
            <div class="sentiment-controls-container">
              <SentimentSensitivityControl />
            </div>
            <RadarSentiment />
          </div>
        </section>
      </div>
    </div>
  </div>

  <!-- Social Share Modal -->
  <SocialShareModal
    v-model="showSocialShareModal"
    :budget-surplus="budgetSurplus"
    :debt-to-gdp-ratio="debtToGdpRatio"
    :total-revenue="totalRevenue"
    :total-spending="totalSpending"
    :sentiment-scores="sentimentScores"
    :earned-badges="budgetStore.badges"
    :share-title="shareTitle"
    :fiscal-chaos="sentimentScores?.fiscalChaos || false"
    :is-loading="isModalDataLoading"
  />

  <!-- Shared Budget Detail Modal -->
  <SharedBudgetDetailModal
    v-model="showSharedBudgetModal"
    :budget-data="sharedBudgetData"
    @apply-budget="handleApplySharedBudget"
  />
</template>

<script setup>
import CollapsibleSentimentBanner from '@/domains/sentiment/components/CollapsibleSentimentBanner.vue'
import SentimentSensitivityControl from '@/domains/sentiment/components/SentimentSensitivityControl.vue'
import SharedBudgetDetailModal from '@/domains/budget/components/SharedBudgetDetailModal.vue'
import { SocialShareModal } from '@/domains/social'
import MainNavigation from '@/components/MainNavigation.vue'
import logoImage from '@/assets/fiscal-insights-logo.jpg'
import OnboardingTour from '@/components/OnboardingTour.vue'

import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useBudgetSimulatorStore } from '@/domains/budget'
import { computeSentimentScores, getSentimentLabel, getSentimentEmoji } from '@/domains/sentiment/utils/computeSentimentScores'
// Import scenario logic if needed
import RevenueSliders from '@/domains/budget/components/RevenueSliders.vue'
import GoalTracker from '@/domains/budget/components/GoalTracker.vue'
import PartyBudgetSharing from '@/domains/social/components/PartyBudgetSharing.vue'
import ChartsPanel from '@/domains/budget/components/ChartsPanel.vue'
import YearSelector from '@/domains/budget/components/YearSelector.vue'
import BudgetResults from '@/domains/budget/components/BudgetResults.vue'
import SpendingControls from '@/domains/budget/components/SpendingControls.vue'
import PresetSelector from '@/domains/calculator/components/PresetSelector.vue'
import AchievementBadge from '@/domains/badges/components/AchievementBadge.vue'
import BadgeGalleryModal from '@/domains/badges/components/BadgeGalleryModal.vue'
import RadarSentiment from '@/domains/sentiment/components/RadarSentiment.vue'
import { setPreset } from '@/presets'

import { parseSharedBudgetParams, applySharedBudgetToStore } from '@/domains/budget/utils/sharedBudget.js'

const budgetStore = useBudgetSimulatorStore();
const currentYear = ref(budgetStore.currentYear);
const expandedGroups = ref({
  mainCategories: false,
  otherCategories: false,
  governmentOperations: false
});
const spendingFactors = ref({});
const autoBalanceActive = computed(() => budgetStore.autoBalanceActive);
const showBadgeGallery = ref(false); // Controls the badge gallery modal
const badgePanelExpanded = ref(true); // Controls whether the badge panel is expanded or collapsed

// Social share modal state
const showSocialShareModal = ref(false);

// Computed properties for social share modal with null checks
const budgetSurplus = computed(() => budgetStore.fiscalIndicators?.surplus || 0);
const debtToGdpRatio = computed(() => budgetStore.fiscalIndicators?.debtToGdpRatio || 0);
const totalRevenue = computed(() => budgetStore.fiscalIndicators?.totalRevenue || 0);
const totalSpending = computed(() => budgetStore.fiscalIndicators?.totalSpending || 0);
const shareTitle = computed(() => {
  const surplus = budgetSurplus.value;
  return `My budget as Finance Minister has a ${surplus > 0 ? 'surplus' : 'deficit'} of $${Math.abs(surplus).toFixed(1)}B`;
});

const sentimentScores = computed(() => {
  // Robust validation for budgetData and revenueMix
  const data = budgetStore.budgetData;
  if (!data || typeof data !== 'object' || !data.revenueMix || typeof data.revenueMix !== 'object') {
    console.error('[FinanceMinisterSimulator] Error: budgetData or revenueMix is missing or malformed.', data);
    alert('Unable to update sentiment scores: The budget data is missing or incomplete.');
    // Return a fallback neutral sentiment structure to prevent runtime errors
    return {
      overall: 3,
      provinces: {},
      sectors: {},
      demographics: {},
      fiscalChaos: false
    };
  }
  return computeSentimentScores(
    data,
    budgetStore.badges,
    budgetStore.activePreset // Pass scenario/preset for correct calculation
  );
});
// Fiscal chaos flag for warnings
const fiscalChaos = computed(() => sentimentScores.value.fiscalChaos);
// Track which groups are selected for sentiment
const selectedGroups = ref({
  provinces: [],
  sectors: [],
  demographics: []
});

// Compute the sentiment score for the selected group, or overall if none
const groupSentimentScore = computed(() => {
  const scores = sentimentScores.value;
  if (selectedGroups.value.provinces.length)
    return scores.provinces[selectedGroups.value.provinces[0]] ?? scores.overall;
  if (selectedGroups.value.sectors.length)
    return scores.sectors[selectedGroups.value.sectors[0]] ?? scores.overall;
  if (selectedGroups.value.demographics.length)
    return scores.demographics[selectedGroups.value.demographics[0]] ?? scores.overall;
  return scores.overall;
});
const groupSentimentLabel = computed(() => getSentimentLabel(groupSentimentScore.value));
const groupSentimentEmoji = computed(() => getSentimentEmoji(groupSentimentScore.value));

function selectYear(year) {
  currentYear.value = year;
  budgetStore.setCurrentYear(year);
  initializeLocalValues();
}

const mainCategories = computed(() => {
  return Object.values(budgetStore.spendingCategories)
    .filter(category => !category.isGroup)
    .sort((a, b) => a.id - b.id);
});

const otherCategoriesGroups = computed(() => {
  return Object.values(budgetStore.spendingCategories)
    .filter(category => category.isGroup && category.id !== 9)
    .sort((a, b) => a.id - b.id);
});

const sortedGovOpsChildren = computed(() => {
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    // Use a more reliable sorting method for decimal IDs
    return Object.values(govOps.children).sort((a, b) => {
      // First convert to string and split by decimal point
      const aParts = a.id.toString().split('.');
      const bParts = b.id.toString().split('.');
      
      // Compare the integer part first
      const aInt = parseInt(aParts[0]);
      const bInt = parseInt(bParts[0]);
      if (aInt !== bInt) return aInt - bInt;
      
      // If integer parts are the same, compare decimal parts
      const aDecimal = aParts.length > 1 ? parseInt(aParts[1]) : 0;
      const bDecimal = bParts.length > 1 ? parseInt(bParts[1]) : 0;
      return aDecimal - bDecimal;
    });
  }
  return [];
});

function initializeLocalValues() {
  Object.values(budgetStore.spendingCategories).forEach(category => {
    if (!category.isGroup) {
      spendingFactors.value[category.id] = Math.round((category.adjustmentFactor || 1) * 100) || 100;
    } else if (category.children) {
      spendingFactors.value[category.id] = Math.round(budgetStore.getGroupFactor(category.id) * 100) || 100;
      Object.values(category.children).forEach(child => {
        spendingFactors.value[child.id] = Math.round((child.adjustmentFactor || 1) * 100) || 100;
      });
    }
  });
  // Ensure Government Operations subcategories are initialized
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    Object.values(govOps.children).forEach(child => {
      if (spendingFactors.value[child.id] === undefined) {
        spendingFactors.value[child.id] = 100;
      }
    });
  }
}

function toggleGroupExpansion(groupId) {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId];
}

function updateSpendingFactor(categoryId, value) {
  const factor = value / 100;
  budgetStore.updateSpendingFactor(categoryId, factor);
  if (autoBalanceActive.value) {
    budgetStore.autoBalanceBudget();
  }
}

function updateGroupSpendingFactor(groupId, value) {
  const factor = value / 100;
  budgetStore.updateGroupSpendingFactor(groupId, factor);
  if (autoBalanceActive.value) {
    budgetStore.autoBalanceBudget();
  }
}

function toggleAutoBalance(isActive) {
  // Update the store's state directly
  budgetStore.toggleAutoBalance(isActive);
  
  console.log('Auto-balance mode:', isActive ? 'enabled' : 'disabled');
}

function resetBudget() {
  budgetStore.resetBudget();
  initializeLocalValues();
}

function handlePresetApplied(presetKey) {
  console.log(`%c[PRESET DEBUG] Applying preset: ${presetKey}`, 'background: #9b59b6; color: white; padding: 2px 5px; border-radius: 3px;');
  
  // Set the active preset first
  budgetStore.activePreset = presetKey;
  
  // Apply the preset settings (this call internally recalculates totals and updates badges)
  setPreset(presetKey, budgetStore);
  
  // Update local values to reflect the preset changes
  initializeLocalValues();
  
  console.log('%c[PRESET DEBUG] Final Active Preset:', 'color: teal; font-weight: bold;', budgetStore.activePreset);
  console.log('Badges updated, current badges:', budgetStore.badges.map(b => b.title));
}

function saveBudget() {
  budgetStore.syncToLocalStorage();
  alert('Budget saved successfully!');
}

function updateGoalStatus(statusData) {
  budgetStore.updateGoalStatus(statusData);
}

function resetGovOpsSubcategories() {
  const govOps = budgetStore.spendingCategories.governmentOperations;
  if (govOps && govOps.children) {
    Object.values(govOps.children).forEach(child => {
      spendingFactors.value[child.id] = 100;
      budgetStore.updateSpendingFactor(child.id, 1);
    });
  }
}

function resetOtherCategoriesSubcategories() {
  const otherCategoriesIds = otherCategoriesGroups.value.map(group => group.id);
  
  otherCategoriesIds.forEach(groupId => {
    const children = budgetStore.getGroupChildren(groupId);
    children.forEach(child => {
      budgetStore.updateSpendingFactor(child.id, 1);
    });
  });
}

function toggleBadgePanel() {
  badgePanelExpanded.value = !badgePanelExpanded.value;
}

// Feature flags for enabling/disabling features
const FEATURES_ENABLED = {
  budgetGoals: true, // Set to false to temporarily disable Budget Goals feature
};

// Add refs for loading state and shared budget modal
const isModalDataLoading = ref(false);
const showSharedBudgetModal = ref(false);
const sharedBudgetData = ref({}); // will hold the parsed shared budget data
const isSharedBudget = ref(false);

import { useRoute } from 'vue-router';

// Get the current route
const route = useRoute();

// ...

// Parse shared budget parameters from the URL and apply them to the store
const parseAndApplySharedBudget = async () => {
  // Get query parameters from the router
  const query = route.query;
  
  // Only proceed if this is a shared budget link
  if ('surplus' in query || 'revenue' in query || 'debt' in query) {
    isSharedBudget.value = true;
    console.log('Detected shared budget link with query params:', query);
    
    // Parse all shared data from URL
    const sharedData = parseSharedBudgetParams(query);
    sharedBudgetData.value = sharedData;
    
    // Sync sliders to store (sets revenue/spending factors)
    await applySharedBudgetToStore(sharedData, budgetStore);
    
    // Show the shared budget detail modal immediately
    showSharedBudgetModal.value = true;
  }
};

// Call this on mount if on a shared budget route
onMounted(() => {
  parseAndApplySharedBudget();
});

// These functions are no longer needed with the new shared budget utility
// but we'll keep them commented in case they're needed in the future
/* 
// Function to get badge icon by name
const getBadgeIconByName = (name) => {
  // Find the badge in the badge config by name
  const badge = budgetStore.badges.find(b => b.name === name);
  return badge?.icon || '🏆';
};

// Function to get badge explanation by name
const getBadgeExplanationByName = (name) => {
  // Find the badge in the badge config by name
  const badge = budgetStore.badges.find(b => b.name === name);
  return badge?.explanation || 'Achievement earned through your budget choices';
};
*/

// No longer needed, logic replaced by sharedBudget.js utility

// Handle applying a shared budget from the modal
const handleApplySharedBudget = async () => {
  // Re-apply the shared budget data to the store (in case user wants to make it active)
  if (sharedBudgetData.value) {
    await applySharedBudgetToStore(sharedBudgetData.value, budgetStore);
    // Optionally recalculate badges, sentiment, etc.
    budgetStore.recalculateTotals();
    budgetStore.updateBadges();
  }
  showSharedBudgetModal.value = false;
};

// Improved function to ensure budget data is loaded before showing the social share modal
async function openSocialShareModal() {
  try {
    // Set loading state
    isModalDataLoading.value = true;
    
    // Force a recalculation of budget totals to ensure fresh data
    budgetStore.recalculateTotals();
    
    // Update badges to ensure we have the latest earned badges
    budgetStore.updateBadges();
    
    // Ensure sentiment scores are updated
    budgetStore.triggerSentimentUpdate();
    
    // Extra validation to ensure we have valid budget data
    if (!budgetStore.totalRevenue || budgetStore.totalRevenue <= 0) {
      console.warn("Invalid total revenue detected. Budget data may not be complete.");
    }
    
    if (!budgetStore.totalSpending || budgetStore.totalSpending <= 0) {
      console.warn("Invalid total spending detected. Budget data may not be complete.");
    }
    
    // Check for fiscal chaos
    const isFiscalChaos = sentimentScores.value?.fiscalChaos || false;
    
    // Force update of fiscal indicators
    // This ensures the values are up-to-date from the store before opening the modal
    budgetSurplus.value = budgetStore.surplus || 0;
    debtToGdpRatio.value = budgetStore.fiscalIndicators?.debtToGdpRatio || 0;
    totalRevenue.value = budgetStore.totalRevenue || 0;
    totalSpending.value = budgetStore.totalSpending || 0;
    
    // Log data for debugging
    console.log("Budget data prepared for social share:", {
      surplus: budgetSurplus.value,
      debtToGDP: debtToGdpRatio.value,
      revenue: totalRevenue.value,
      spending: totalSpending.value,
      sentimentScores: sentimentScores.value,
      fiscalChaos: isFiscalChaos
    });
    
    // Artificial delay to ensure all reactive state has updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Then open the modal
    showSocialShareModal.value = true;
  } catch (error) {
    console.error("Error preparing budget data for social share:", error);
    alert("There was a problem preparing your budget data. Please try again.");
  } finally {
    // Clear loading state whether successful or not
    isModalDataLoading.value = false;
  }
}

watch(() => budgetStore.spendingCategories, () => {
  initializeLocalValues();
}, { deep: true });

onMounted(() => {
  initializeLocalValues();
});

const logoUrl = logoImage

// Update scrollToSection function with better handling
function scrollToSection(sectionId) {
  // Use nextTick to ensure DOM is updated
  nextTick(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Add a small offset to account for any fixed headers
      const offset = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// Add sections expanded state
const sectionsExpanded = ref({
  budgetGoals: true,
  revenueSources: true,
  spendingControls: true,
  publicSentiment: true
});

// Add toggle function
const toggleSection = (section) => {
  sectionsExpanded.value[section] = !sectionsExpanded.value[section];
};
</script>

<style scoped>
.budget-chaos-warning {
  background: #fff3cd;
  color: #856404;
  border: 2px solid #ffeeba;
  padding: 14px 24px;
  margin-bottom: 18px;
  border-radius: 8px;
  font-size: 1.13em;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.finance-minister-simulator {
  padding: 1rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
}

/* Badge Container Styles */
.fixed-badge-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 250px; /* Limit width to left side instead of full width */
  padding: 1rem;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  border-bottom-right-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

/* Collapsed state */
.fixed-badge-container.collapsed {
  padding: 0.5rem 1rem;
  width: 200px; /* Even narrower when collapsed */
}

.badges-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badges-title-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badges-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2d3748;
}

.toggle-badge-panel-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5568;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.toggle-badge-panel-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.view-all-badges-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(145deg, #4263eb, #3b82f6);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
}

.view-all-badges-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.badges-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.no-badges-message {
  font-style: italic;
  color: #718096;
  padding: 0.5rem;
}

.finance-minister-simulator {
  padding: 1rem;
  padding-left: 270px; /* Add space for the badge panel */
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
  transition: padding-left 0.3s ease;
}

/* Use a class instead of :has() selector for better browser compatibility */
.finance-minister-simulator.panel-collapsed {
  padding-left: 220px; /* Adjust padding when badge panel is collapsed */
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 10px;
  box-sizing: border-box;
  width: 100%;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 0;
}

.simulator-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  grid-template-rows: auto auto auto auto;
  gap: 1.5rem;
}

.simulator-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.goals-card {
  grid-column: 1;
  grid-row: 1;
}

.results-card {
  grid-column: 1;
  grid-row: 2;
}

/* Budget Presets Panel */
.preset-panel-container {
  grid-column: 1;
  grid-row: 3;
}

.revenue-card {
  grid-column: 1;
  grid-row: 4;
}

.spending-card {
  grid-column: 2;
  grid-row: 1 / span 4;
  min-height: 1200px;
  display: flex;
  flex-direction: column;
}

.charts-card {
  grid-column: 1;
  grid-row: 5;
}

.sentiment-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  overflow: hidden;
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  perspective: 1000px;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
}

.sentiment-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.sentiment-card .card-title {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem 1rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  transform: translateZ(30px);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
  margin-top: 0;
  margin-bottom: 0.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  box-shadow: none;
}

.sentiment-card .card-title .icon {
  margin-right: 0.75rem;
  font-size: 1.5rem;
  color: #4263eb;
}

.sentiment-card .card-content {
  padding: 1rem;
  transform: translateZ(10px);
  transition: transform 0.3s ease;
  flex-grow: 1;
  position: relative;
  z-index: 0;
}

/* Touch Device Optimizations */
@media (hover: none) {
  .sentiment-card:hover {
    transform: none;
    box-shadow: 
      0 10px 20px rgba(0, 0, 0, 0.19),
      0 6px 6px rgba(0, 0, 0, 0.23);
  }
  .sentiment-card:active {
    transform: translateY(-2px) translateZ(10px) rotateX(1deg);
    box-shadow: 
      0 12px 24px rgba(0, 0, 0, 0.2),
      0 8px 8px rgba(0, 0, 0, 0.15);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .sentiment-card,
  .sentiment-card .card-title,
  .sentiment-card .card-content {
    transition: none;
    transform: none !important;
  }
}

.card-title, .card-content, .simulator-card, .sentiment-controls-container, .summary-card {
  word-break: break-word;
  white-space: normal;
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
  .simulator-card, .sentiment-controls-container {
    padding: 0.5rem 0.5rem;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  padding: 16px;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.card-title:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.toggle-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(-90deg);
}

.card-content {
  padding: 16px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .simulator-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 1rem;
  }
  .simulator-card {
    width: 100%;
    min-width: 0;
    margin: 0 auto 1rem auto;
    box-sizing: border-box;
  }
}

/* Sentiment Controls Styling */
.sentiment-controls-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sentiment-controls-container h2 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #2c3e50;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .simulator-grid {
    grid-template-columns: 1fr 1.4fr;
    gap: 1.25rem;
  }
  
  .main-container {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .simulator-grid {
    grid-template-columns: 1fr 1.2fr;
    gap: 1rem;
  }
  
  .main-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .finance-minister-simulator {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .simulator-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .simulator-card {
    width: 100%;
    max-width: 800px;
    margin: 0 auto 1rem auto;
    box-sizing: border-box;
  }
  
  .spending-card {
    min-height: auto;
    height: fit-content;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .fixed-badge-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 1rem auto;
    border-radius: 8px;
  }
  
  .finance-minister-simulator.panel-collapsed {
    padding-left: 1rem;
  }
}

@media (max-width: 576px) {
  .simulator-grid {
    gap: 0.75rem;
  }
  
  .simulator-card {
    max-width: 100%;
    padding: 0.75rem;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .main-container {
    padding: 10px;
  }
  
  .main-title {
    font-size: 1.5rem;
    padding: 0 10px;
  }
  
  .fixed-badge-container {
    max-width: 100%;
  }
  
  /* Prevent vertical stretching of content */
  .card-content {
    min-height: auto;
    height: fit-content;
  }
  
  /* Maintain aspect ratios for charts and visual elements */
  .charts-card,
  .sentiment-card {
    aspect-ratio: auto;
    height: fit-content;
  }
}

.description {
  text-align: center;
  color: #4a5568;
  font-size: 0.95rem;
  margin: 1rem auto 1.5rem;
  max-width: 800px;
  line-height: 1.5;
}

.main-navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.logo-container {
  text-align: center;
  margin-bottom: 15px;
}

.site-logo {
  max-width: 180px;
  height: auto;
  transition: transform 0.3s ease;
}

.site-logo:hover {
  transform: scale(1.05);
}

/* Sub Navigation Styles */
.sub-navigation {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
}

.sub-nav-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer; /* Add cursor pointer to show it's clickable */
}

.sub-nav-link:hover {
  background-color: #3498db;
  color: white;
}

.sub-nav-link .material-icons {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .sub-navigation {
    gap: 8px;
    padding: 8px;
  }
  
  .sub-nav-link {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}
</style>
