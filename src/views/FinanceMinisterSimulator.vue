/* eslint-disable */
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
      @update:selected-groups="selectedGroups = $event"
    />
    
    <!-- Retractable Badge Panel at Top Left with View All button -->
    <div
      class="fixed-badge-container"
      :class="{ 'collapsed': !badgePanelExpanded }"
    >
      <div class="badges-header">
        <div class="badges-title-container">
          <span class="badges-title">{{ t('simulator.header.achievements') }}</span>
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
          {{ t('simulator.header.viewAll') }}
        </button>
      </div>
      <div
        v-show="badgePanelExpanded && budgetStore.badges.length === 0"
        class="no-badges-message"
      >
        {{ t('simulator.header.noBadges') }}
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
          :alt="t('home.alt.logo')"
          class="site-logo"
        >
      </div>
      <div class="flex justify-between items-center mb-0">
        <h1 class="main-title">
          {{ t('simulator.header.title') }}
        </h1>
        <div class="language-switch">
          <label
            class="language-label"
            for="simulator-language-switch"
          >
            {{ t('home.language.label') }}
          </label>
          <select
            id="simulator-language-switch"
            class="language-select"
            :value="locale"
            :aria-label="t('home.language.switchLabel')"
            @change="handleLocaleChange"
          >
            <option
              v-for="option in locales"
              :key="option.code"
              :value="option.code"
            >
              {{ t(option.labelKey) }}
            </option>
          </select>
        </div>
      </div>

      <MainNavigation />

      <p class="description">
        {{ t('simulator.description.intro') }}
        <br>
        <span class="disclaimer">{{ t('simulator.description.disclaimer') }}</span>
      </p>

      <!-- Year Selector -->
      <YearSelector 
        :current-year="currentYear" 
        @year-selected="selectYear" 
      />

      <!-- Panel Navigation (feature-gated) -->
      <div
        v-if="FEATURES.PANEL_NAV"
        class="mb-4"
      >
        <PanelHost />
      </div>

      <!-- Sub Navigation Bar -->
      <nav
        v-if="!FEATURES.PANEL_NAV"
        class="sub-navigation"
      >
        <a
          class="sub-nav-link"
          @click="scrollToSection('budget-goals')"
        >
          <span class="material-icons">flag</span>
          {{ t('simulator.nav.goals') }}
        </a>
        <a
          class="sub-nav-link"
          @click="scrollToSection('budget-results')"
        >
          <span class="material-icons">summarize</span>
          {{ t('simulator.nav.results') }}
        </a>
        <a
          class="sub-nav-link"
          @click="scrollToSection('revenue-sources')"
        >
          <span class="material-icons">payments</span>
          {{ t('simulator.nav.revenue') }}
        </a>
        <a
          class="sub-nav-link"
          @click="scrollToSection('spending-controls')"
        >
          <span class="material-icons">payments</span>
          {{ t('simulator.nav.spending') }}
        </a>
        <a
          class="sub-nav-link"
          @click="scrollToSection('budget-analysis')"
        >
          <span class="material-icons">bar_chart</span>
          {{ t('simulator.nav.analysis') }}
        </a>
        <a
          class="sub-nav-link"
          @click="scrollToSection('public-sentiment')"
        >
          <span class="material-icons">people</span>
          {{ t('simulator.nav.sentiment') }}
        </a>
        <div class="section-controls">
          <button
            class="section-control-btn"
            @click="expandAllSections"
          >
            <span class="material-icons">expand_more</span>
            {{ t('simulator.nav.expandAll') }}
          </button>
          <button
            class="section-control-btn"
            @click="collapseAllSections"
          >
            <span class="material-icons">expand_less</span>
            {{ t('simulator.nav.collapseAll') }}
          </button>
        </div>
      </nav>

      <div
        v-if="!FEATURES.PANEL_NAV"
        class="simulator-grid"
      >
        <!-- Budget Goals Section -->
        <section
          id="budget-goals"
          class="simulator-card goals-card"
        >
          <h2
            class="card-title"
            @click="toggleSection('budgetGoals')"
          >
            <span class="material-icons icon">flag</span>
            {{ t('simulator.nav.goals') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.budgetGoals }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.budgetGoals"
            class="card-content"
          >
            <!-- Budget Goals feature temporarily disabled -->
            <GoalTracker 
              v-if="FEATURES_ENABLED.budgetGoals"
              :current-revenue="budgetStore.totalRevenue"
              :current-spending="budgetStore.totalSpending"
              :initial-goals="budgetStore.budgetGoals"
              :surplus="budgetStore.surplus"
              @update:goals="updateBudgetGoals"
              @goal-status-changed="updateGoalStatus"
              @auto-balance-toggled="toggleAutoBalance"
            />
            
            <!-- Party Budget Comparison Tool -->
            <PartyBudgetSharing v-if="!FEATURES_ENABLED.budgetGoals" />
          </div>
        </section>

        <!-- Budget Results Section -->
        <div
          v-if="fiscalChaos"
          class="budget-chaos-warning"
        >
          <strong>{{ t('simulator.chaosWarning') }}</strong>
        </div>
        <section
          id="budget-results"
          class="simulator-card budget-results-card"
        >
          <h2
            class="card-title"
            @click="toggleSection('budgetResults')"
          >
            <span class="material-icons icon">summarize</span>
            {{ t('simulator.sections.results.title') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.budgetResults }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.budgetResults"
            class="card-content"
          >
            <BudgetResults 
              :total-revenue="budgetStore.totalRevenue"
              :total-spending="budgetStore.totalSpending"
              :surplus="budgetStore.surplus"
              :auto-balance-active="autoBalanceActive"
              :simple-auto-balance-active="budgetStore.simpleAutoBalanceActive"
              :fiscal-chaos="fiscalChaos"
              @reset-budget="resetBudget"
              @toggle-auto-balance="toggleAutoBalance"
              @toggle-simple-auto-balance="toggleSimpleAutoBalance"
              @save-budget="saveBudget"
              @share-budget="openSocialShareModal"
            />
          </div>
        </section>
        
        <!-- Budget Presets Section -->
        <section class="simulator-card preset-panel-container">
          <h2
            class="card-title"
            @click="toggleSection('budgetPresets')"
          >
            <span class="material-icons icon">settings</span>
            {{ t('simulator.sections.presets.title') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.budgetPresets }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.budgetPresets"
            class="card-content"
          >
            <PresetSelector
              @preset-applied="handlePresetApplied"
              @preset-reset="resetBudget"
            />
          </div>
        </section>

        <!-- Revenue Sources Section -->
        <section
          id="revenue-sources"
          class="simulator-card revenue-card"
        >
          <h2
            class="card-title"
            @click="toggleSection('revenueSources')"
          >
            <span class="material-icons icon">payments</span>
            {{ t('simulator.sections.revenue.title') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.revenueSources }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.revenueSources"
            class="card-content"
          >
            <RevenueSliders :auto-balance-active="autoBalanceActive" />
          </div>
        </section>

        <!-- Spending Controls Section -->
        <section
          id="spending-controls"
          class="simulator-card spending-card"
        >
          <h2
            class="card-title"
            @click="toggleSection('spendingControls')"
          >
            <span class="material-icons icon">payments</span>
            {{ t('simulator.sections.spending.title') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.spendingControls }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.spendingControls"
            class="card-content"
          >
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
        <section
          id="budget-analysis"
          class="simulator-card charts-card"
        >
          <h2
            class="card-title"
            @click="toggleSection('budgetAnalysis')"
          >
            <span class="material-icons icon">bar_chart</span>
            {{ t('simulator.sections.analysis.title') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.budgetAnalysis }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.budgetAnalysis"
            class="card-content"
          >
            <ChartsPanel />
          </div>
        </section>
        
        <!-- Public Sentiment Section -->
        <section
          id="public-sentiment"
          class="simulator-card sentiment-card"
        >
          <h2
            class="card-title"
            @click="toggleSection('publicSentiment')"
          >
            <span class="material-icons icon">sentiment_satisfied</span>
            {{ t('simulator.sections.sentiment.title') }}
            <span
              class="material-icons toggle-icon"
              :class="{ 'rotated': !sectionsExpanded.publicSentiment }"
            >expand_more</span>
          </h2>
          <div
            v-show="sectionsExpanded.publicSentiment"
            class="card-content"
          >
            <div class="sentiment-controls-container">
              <SentimentSensitivityControl />
            </div>
            <RadarSentiment />
          </div>
        </section>
      </div>
    </div>
  </div>

  <!-- Budget Changes Banner (hidden on mobile, replaced by bottom sheet) -->
  <BudgetChangesBanner
    v-if="!isMobile"
    :max-recent-changes="10"
  />

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

  <div
    v-if="financeMinisterErrorMessage"
    class="error-message"
  >
    {{ financeMinisterErrorMessage }}
  </div>
  
  <!-- Mobile Dock + Bottom Sheet -->
  <MobileDockBar v-if="isMobile" />
  <MobileBottomSheet v-if="isMobile" />
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick, defineAsyncComponent } from 'vue'
import { useI18n } from '@/i18n'
import { useBudgetSimulatorStore } from '@/domains/budget'
import { computeSentimentScores, getSentimentLabel, getSentimentEmoji } from '@/domains/sentiment/utils/computeSentimentScores'
import MainNavigation from '@/components/MainNavigation.vue'
import logoImage from '@/assets/fiscal-insights-logo.webp'
import OnboardingTour from '@/components/OnboardingTour.vue'
import { FEATURES } from '@/features.js'
import MobileDockBar from '@/components/MobileDockBar.vue'
import MobileBottomSheet from '@/components/MobileBottomSheet.vue'
import PanelHost from '@/domains/budget/components/BudgetPanelHost.vue'
import { useMobileDock } from '@/composables/useMobileDock'

// Lazy load heavy components for better performance
const ChartsPanel = defineAsyncComponent({
  loader: () => import('@/domains/budget/components/BudgetChartsPanel.vue'),
  loadingComponent: { template: '<div class="loading-component">Loading charts...</div>' },
  errorComponent: { template: '<div class="error-component">Failed to load charts</div>' },
  delay: 200,
  timeout: 10000
})

const RadarSentiment = defineAsyncComponent({
  loader: () => import('@/domains/sentiment/components/RadarSentiment.vue'),
  loadingComponent: { template: '<div class="loading-component">Loading sentiment analysis...</div>' },
  errorComponent: { template: '<div class="error-component">Failed to load sentiment analysis</div>' },
  delay: 200,
  timeout: 10000
})

const SocialShareModal = defineAsyncComponent({
  loader: () => import('@/domains/social/components/SocialShareModal.vue'),
  loadingComponent: { template: '<div class="loading-component">Loading share modal...</div>' },
  errorComponent: { template: '<div class="error-component">Failed to load share modal</div>' },
  delay: 200,
  timeout: 10000
})

const BadgeGalleryModal = defineAsyncComponent({
  loader: () => import('@/domains/badges/components/BadgeGalleryModal.vue'),
  loadingComponent: { template: '<div class="loading-component">Loading badge gallery...</div>' },
  errorComponent: { template: '<div class="error-component">Failed to load badge gallery</div>' },
  delay: 200,
  timeout: 10000
})

// Lazy load modal components (only loaded when opened)
const SharedBudgetDetailModal = defineAsyncComponent({
  loader: () => import('@/domains/budget/components/SharedBudgetDetailModal.vue'),
  loadingComponent: { template: '<div class="loading-component">Loading budget details...</div>' },
  errorComponent: { template: '<div class="error-component">Failed to load budget details</div>' },
  delay: 200,
  timeout: 10000
})

// Import lightweight components normally
import CollapsibleSentimentBanner from '@/domains/sentiment/components/CollapsibleSentimentBanner.vue'
import SentimentSensitivityControl from '@/domains/sentiment/components/SentimentSensitivityControl.vue'
import RevenueSliders from '@/domains/budget/components/BudgetRevenueSliders.vue'
import GoalTracker from '@/domains/budget/components/GoalTracker.vue'
import PartyBudgetSharing from '@/domains/social/components/PartyBudgetSharing.vue'
import YearSelector from '@/domains/budget/components/BudgetYearSelector.vue'
import BudgetResults from '@/domains/budget/components/BudgetResults.vue'

// Mobile overlay coordination
const { isMobile } = useMobileDock()
import SpendingControls from '@/domains/budget/components/BudgetSpendingControls.vue'
import PresetSelector from '@/domains/calculator/components/PresetSelector.vue'
import AchievementBadge from '@/domains/badges/components/AchievementBadge.vue'
import BudgetChangesBanner from '@/domains/budget/components/BudgetChangesBanner.vue'
import { setPreset } from '@/presets'

import { parseSharedBudgetParams, applySharedBudgetToStore } from '@/domains/budget/utils/sharedBudget.js'
import { handleError } from '@/utils/errorHandler.js'

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
  const surplusType = surplus > 0 ? t('simulator.shareTitleSurplus') : t('simulator.shareTitleDeficit');
  return `${t('simulator.shareTitle')} ${surplusType} ${t('simulator.shareTitleAmount')} $${Math.abs(surplus).toFixed(1)}B`;
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
  // Also trigger simple auto-balance if active
  if (budgetStore.simpleAutoBalanceActive) {
    budgetStore.autoBalanceBudget();
  }
}

function updateGroupSpendingFactor(groupId, value) {
  const factor = value / 100;
  budgetStore.updateGroupSpendingFactor(groupId, factor);
  if (autoBalanceActive.value) {
    budgetStore.autoBalanceBudget();
  }
  // Also trigger simple auto-balance if active
  if (budgetStore.simpleAutoBalanceActive) {
    budgetStore.autoBalanceBudget();
  }
}

function toggleAutoBalance(isActive) {
  // Update the store's state directly
  budgetStore.toggleAutoBalance(isActive);
  
  console.log('Auto-balance mode:', isActive ? 'enabled' : 'disabled');
}

function toggleSimpleAutoBalance(isActive) {
  // Update the simple auto-balance state
  budgetStore.toggleSimpleAutoBalance(isActive);
  
  console.log('Simple auto-balance mode:', isActive ? 'enabled' : 'disabled');
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

function updateBudgetGoals(goals) {
  const normalize = (value) => (typeof value === 'number' && !Number.isNaN(value) ? value : null);
  const normalizedRevenue = normalize(goals && goals.targetRevenue);
  const normalizedDeficit = normalize(goals && goals.targetDeficit);

  budgetStore.budgetGoals = {
    ...budgetStore.budgetGoals,
    enabled: typeof (goals && goals.enabled) === 'boolean' ? goals.enabled : budgetStore.budgetGoals.enabled,
    targetRevenue: normalizedRevenue,
    revenueTarget: normalizedRevenue,
    targetDeficit: normalizedDeficit,
    deficitTarget: normalizedDeficit
  };

  if (!budgetStore.budgetGoals.enabled && budgetStore.autoBalanceActive) {
    budgetStore.toggleAutoBalance(false);
  } else if (budgetStore.autoBalanceActive) {
    budgetStore.toggleAutoBalance(true);
  }
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
const financeMinisterErrorMessage = ref('');

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

    // Log data for debugging with a snapshot of the latest store values
    const shareSnapshot = {
      surplus: budgetStore.surplus || 0,
      debtToGDP: budgetStore.fiscalIndicators?.debtToGdpRatio || 0,
      revenue: budgetStore.totalRevenue || 0,
      spending: budgetStore.totalSpending || 0,
      sentimentScores: sentimentScores.value,
      fiscalChaos: isFiscalChaos
    };

    console.log("Budget data prepared for social share:", shareSnapshot);
    
    // Artificial delay to ensure all reactive state has updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Then open the modal
    showSocialShareModal.value = true;
  } catch (error) {
    handleError(error, (msg) => financeMinisterErrorMessage.value = msg);
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
  budgetResults: true,
  budgetPresets: true,
  revenueSources: true,
  spendingControls: true,
  budgetAnalysis: true,
  publicSentiment: true
});

// Add toggle function
const toggleSection = (section) => {
  sectionsExpanded.value[section] = !sectionsExpanded.value[section];
};

// Add expandAllSections and collapseAllSections functions
const expandAllSections = () => {
  Object.keys(sectionsExpanded.value).forEach(section => sectionsExpanded.value[section] = true);
};

const collapseAllSections = () => {
  Object.keys(sectionsExpanded.value).forEach(section => sectionsExpanded.value[section] = false);
};

const { t, locale, locales, setLocale } = useI18n()
const handleLocaleChange = (event) => {
  setLocale(event.target.value)
}

</script>

<style scoped>
/* 1. Modern Typography */
  .language-switch {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .language-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--fg);
  }

  .language-select {
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    border: 1px solid rgba(52, 152, 219, 0.35);
    background: #fff;
    color: var(--fg);
    font-weight: 500;
  }

  .language-select:focus {
    outline: none;
    border-color: #27ae60;
    box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.25);
  }

.finance-minister-simulator, .simulator-card, .sentiment-card {
  font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--fg);
}
.main-title, .card-title {
  font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: var(--fg);
  margin-bottom: 0.5rem;
}
.card-title {
  font-size: clamp(1rem, 1.25vw + 0.85rem, 1.35rem);
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 3px solid var(--accent);
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
  color: var(--fg);
}

.card-title:hover {
  background: var(--surface);
  box-shadow: var(--shadow);
}

/* Disable hover effects on touch devices to prevent interference */
@media (hover: none) and (pointer: coarse) {
  .card-title:hover {
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.card-title .icon {
  color: var(--accent);
  font-size: 1.5rem;
}

.card-title .toggle-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
  color: var(--accent);
  font-size: 1.2rem;
}

.card-title .toggle-icon.rotated {
  transform: rotate(-90deg);
}

.card-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Smooth collapse/expand animation */
.card-content[v-show="false"] {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.card-content[v-show="true"] {
  max-height: 2000px;
  opacity: 1;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* 2. Glassmorphism Cards */
.simulator-card, .sentiment-card {
  background: var(--surface) !important;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  padding: 1.5rem 1.25rem;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.25s ease;
}
.simulator-card:hover, .sentiment-card:hover {
  box-shadow: var(--shadow);
}

/* Disable hover transforms on touch devices */
@media (hover: none) and (pointer: coarse) {
  .simulator-card:hover, .sentiment-card:hover {
    transform: none;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  }
}

/* 3. Modern Buttons */
.button, button, .view-all-badges-btn, .toggle-badge-panel-btn {
  background: var(--surface);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.6rem 1.1rem;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: var(--shadow-sm);
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
.button:hover, button:hover, .view-all-badges-btn:hover, .toggle-badge-panel-btn:hover {
  background: rgba(34, 211, 238, 0.12);
  color: var(--fg);
  box-shadow: var(--shadow);
}
/* Emphasize key CTA */
.view-all-badges-btn {
  background: var(--accent);
  border-color: transparent;
  color: #001018;
}
.view-all-badges-btn:hover {
  box-shadow: var(--shadow);
}

/* 4. Sticky/Floating Sub-Navigation */
.sub-navigation {
  position: sticky;
  top: 0.5rem;
  z-index: 10;
  background: var(--surface-muted);
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.sub-nav-link {
  color: var(--fg);
  font-weight: 600;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}
.sub-nav-link:hover {
  background: rgba(34, 211, 238, 0.12);
  color: var(--fg);
}

/* 5. Modern Inputs & Sliders */
input[type="range"], .slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #27ae60 0%, #3498db 100%);
  border-radius: 6px;
  outline: none;
  transition: background 0.2s;
  margin: 0.5rem 0;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #27ae60);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.18);
  cursor: pointer;
  transition: background 0.2s;
}
input[type="range"]:focus::-webkit-slider-thumb {
  background: linear-gradient(135deg, #27ae60, #3498db);
}
input[type="range"]::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #27ae60);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.18);
  cursor: pointer;
  transition: background 0.2s;
}
input[type="range"]:focus::-moz-range-thumb {
  background: linear-gradient(135deg, #27ae60, #3498db);
}
input[type="range"]::-ms-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #27ae60);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.18);
  cursor: pointer;
  transition: background 0.2s;
}
input[type="range"]:focus::-ms-thumb {
  background: linear-gradient(135deg, #27ae60, #3498db);
}
input[type="range"]:focus {
  outline: none;
}

input, select, textarea {
  border-radius: 8px;
  border: 1.5px solid #e0e7ef;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  background: rgba(255,255,255,0.7);
  transition: border 0.2s, box-shadow 0.2s;
}
input:focus, select:focus, textarea:focus {
  border: 1.5px solid #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.12);
  outline: none;
}

/* 6. Section Spacing & Animations */
.simulator-card, .sentiment-card {
  animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 7. Responsive Design */
@media (max-width: 900px) {
  .simulator-card, .sentiment-card {
    padding: 1.2rem 0.7rem;
    margin-bottom: 1.2rem;
  }
  .main-title {
    font-size: 1.3rem;
  }
  .card-title {
    font-size: 1.1rem;
  }
  .sub-navigation {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .finance-minister-simulator {
    /* Remove the problematic scaling that interferes with touch events */
    padding: 1rem;
    width: 100%;
    margin: 0;
  }
  
  .sub-navigation {
    gap: 8px;
    padding: 8px;
  }
  
  .sub-nav-link {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  .section-controls {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    justify-content: center;
  }
  
  .section-control-btn {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
  
  .card-title {
    font-size: 1.1rem;
    padding: 10px 12px;
    margin-bottom: 0.75rem;
    /* Ensure proper touch targets */
    min-height: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
  
  .card-title .icon {
    font-size: 1.3rem;
  }
  
  .card-title .toggle-icon {
    font-size: 1.1rem;
  }
  
  /* Optimize transitions for mobile */
  .card-content {
    transition: all 0.2s ease; /* Faster transition on mobile */
  }
  
  /* Reduce animation complexity on mobile */
  .simulator-card, .sentiment-card {
    animation: none; /* Remove complex animations on mobile */
    transform: none; /* Remove transforms that could interfere */
  }
}

@media (max-width: 600px) {
  .simulator-card, .sentiment-card {
    padding: 0.7rem 0.3rem;
    margin-bottom: 0.7rem;
  }
  .main-title {
    font-size: 1.1rem;
  }
  .card-title {
    font-size: 1rem;
  }
}

.finance-minister-simulator,
.simulator-grid,
.main-container {
  background: transparent !important;
}

.simulator-grid > * {
  background: rgba(255,255,255,0.5) !important;
}

.finance-minister-simulator .calculator-container,
.finance-minister-simulator .result-box,
.finance-minister-simulator .calculator-section,
.finance-minister-simulator .faq-section,
.finance-minister-simulator .budget-categories-section,
.finance-minister-simulator .resources-section,
.finance-minister-simulator .year-selector-container {
  background: rgba(255,255,255,0.5) !important;
}

.finance-minister-simulator {
  background: rgba(255,255,255,0.2);
  position: relative;
  z-index: 1;
  padding: 1rem;
  min-height: 100vh;
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
  transform: scale(0.8);
  transform-origin: top center;
}

.main-title {
  background: rgba(255,255,255,0.92);
  border-radius: 12px;
  padding: 0.7rem 2rem;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.08);
  color: #222;
  font-size: clamp(1.2rem, 2.2vw + 0.8rem, 1.75rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.simulator-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  grid-template-rows: auto auto auto auto;
  gap: 1.5rem;
}

.simulator-card,
.sentiment-card {
  background: rgba(255,255,255,0.75);
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
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sentiment-card:hover {
  transform: translateY(-5px);
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
  transition: color 0.3s ease;
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
  .finance-minister-simulator {
    padding: 1.5rem;
  }
  /* Reserve space for MobileDockBar/BottomSheet so content isn't obscured */
  .finance-minister-simulator,
  .finance-minister-simulator.panel-collapsed {
    padding-bottom: calc(env(safe-area-inset-bottom) + 72px);
  }
  
  .simulator-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .simulator-card {
    width: 100%;
    max-width: 800px;
    margin: 0 auto 1.5rem auto;
    box-sizing: border-box;
    padding: 1.5rem;
  }
  
  .spending-card {
    min-height: auto;
    height: fit-content;
    margin-bottom: 1.5rem;
  }
  
  .card-title {
    font-size: 1.2rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .card-content {
    padding: 1.25rem;
  }
  
  .fixed-badge-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 1.5rem auto;
    border-radius: 12px;
    padding: 1rem;
  }
  
  .finance-minister-simulator.panel-collapsed {
    padding: 1.5rem;
  }
  
  .main-container {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .description {
    margin: 1.5rem auto;
    padding: 1.25rem;
  }
}

@media (max-width: 576px) {
  .simulator-grid {
    gap: 1.25rem;
  }
  
  .simulator-card {
    max-width: 100%;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }
  
  .card-title {
    font-size: 1.1rem;
    padding: 1rem;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .main-container {
    padding: 1.25rem;
  }
  
  .main-title {
    font-size: 1.5rem;
    padding: 0 1rem;
    margin-bottom: 1.25rem;
  }
  
  .fixed-badge-container {
    max-width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.25rem;
  }
  
  .description {
    padding: 1rem;
    margin: 1.25rem auto;
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
    margin-bottom: 1.25rem;
  }
}

.description {
  background: rgba(255,255,255,0.85);
  border-radius: 14px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.08);
  margin: 1rem auto 1.5rem;
  max-width: 800px;
  color: #222;
  font-size: clamp(0.9rem, 0.5vw + 0.85rem, 1rem);
}

.description .disclaimer {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.78em;
  line-height: 1.15;
  color: #666;
}

/* Extra-tight layout on very small screens */
@media (max-width: 480px) {
  .simulator-grid { gap: 0.9rem; }
  .simulator-card, .sentiment-card { padding: 0.6rem 0.5rem; margin-bottom: 0.75rem; }
  .card-title { padding: 0.75rem 0.9rem; margin-bottom: 0.6rem; }
  .sub-navigation { gap: 6px; padding: 6px; }
  .sub-nav-link { font-size: 0.78rem; padding: 5px 10px; }
  .section-control-btn { font-size: 0.7rem; padding: 4px 8px; }
  .badges-title { font-size: clamp(0.95rem, 0.6rem + 1vw, 1.05rem); }
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
  align-items: center;
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

.section-controls {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.section-control-btn {
  background: linear-gradient(135deg, #27ae60, #3498db);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

.section-control-btn:hover {
  background: linear-gradient(135deg, #3498db, #27ae60);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.section-control-btn .material-icons {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .language-switch {
    margin-left: 0;
    margin-top: 0.75rem;
    width: 100%;
    justify-content: flex-end;
  }

  .language-label {
    font-size: 0.8rem;
  }

  .language-select {
    font-size: 0.8rem;
  }

  .sub-navigation {
    gap: 8px;
    padding: 8px;
  }
  
  .sub-nav-link {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
  
  .section-controls {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    justify-content: center;
  }
  
  .section-control-btn {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
}

/* Add solid background to 'Your Achievements' title */
.badges-title {
  background: rgba(255,255,255,0.92);
  border-radius: 8px;
  padding: 0.4rem 1rem;
  box-shadow: 0 1px 4px rgba(52, 152, 219, 0.08);
  color: #27ae60;
  font-weight: 700;
  font-size: 1.1rem;
}

/* Improved badge panel and no-badges-message styling */
.fixed-badge-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 220px;
  max-width: 300px;
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.08);
  padding-bottom: 1rem;
}
.no-badges-message {
  margin: 0.75rem 1rem 0.5rem 1rem;
  background: rgba(255,255,255,0.92);
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  box-shadow: 0 1px 4px rgba(52, 152, 219, 0.08);
  color: #718096;
  font-style: italic;
  text-align: center;
  width: auto;
  max-width: 95%;
  align-self: center;
}

/* Loading and Error States for Lazy Components */
.loading-component {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #3498db;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  /* Avoid backdrop-filter to preserve text AA */
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-component::before {
  content: "⏳";
  margin-right: 0.5rem;
  font-size: 1.2em;
}

.error-component {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #e74c3c;
  font-weight: 500;
  background: rgba(255, 240, 240, 0.9);
  border: 1px solid #e74c3c;
  border-radius: 8px;
  /* Avoid backdrop-filter to preserve text AA */
}

.error-component::before {
  content: "⚠️";
  margin-right: 0.5rem;
  font-size: 1.2em;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>

