<!--
  RadarSentiment.vue
  
  This component visualizes public sentiment toward budget decisions using a radar chart.
  It shows how different regions, demographics, and sectors respond to fiscal policies.
-->
<template>
  <div class="radar-sentiment-container">
    <div class="radar-header">
      <div class="radar-title-row">
        <h3 class="radar-title">
          {{ t('simulator.sentiment.radar.title') }}
        </h3>
        <div
          v-if="activeScenario"
          class="scenario-badge"
          :title="activeScenarioDescription"
        >
          <span class="scenario-label">{{ t('simulator.sentiment.radar.scenarioImpact', { label: activeScenarioLabel }) }}</span>
          <span class="scenario-icon">{{ activeScenarioIcon }}</span>
        </div>
      </div>
      <div
        v-if="activeScenario"
        class="view-toggle"
      >
        <label class="toggle-switch">
          <input
            v-model="showBaseReactions"
            type="checkbox"
          >
          <span class="toggle-slider" />
        </label>
        <span class="toggle-label">{{ t(showBaseReactions ? 'simulator.sentiment.radar.toggle.base' : 'simulator.sentiment.radar.toggle.scenario') }}</span>
      </div>
      <div class="overall-sentiment">
        <div
          class="sentiment-emoji"
          :style="{ color: overallColor }"
        >
          {{ overallEmoji }}
        </div>
        <div v-if="fiscalChaos" class="fiscal-chaos-indicator" :title="t('sentiment.fiscalChaosDetected', 'Fiscal chaos detected!')" style="margin-left: 0.5em; color: #e53e3e; font-size: 1.4em; display: flex; align-items: center;">
          <span style="margin-right: 0.2em;">!</span>
          <span style="font-size: 0.85em; font-weight: 600;">{{ t('sentiment.fiscalChaos', 'Fiscal Chaos') }}</span>
        </div>
        <div class="sentiment-score">
  <span class="score-value" :style="{ color: overallColor }">
    {{ overallScore.toFixed(1) }}
  </span>
  <span
    v-if="Math.abs(overallDelta) > 0.01"
    :class="['score-delta', overallDelta > 0 ? 'delta-up' : 'delta-down']"
    :title="overallDelta > 0 ? t('simulator.sentiment.radar.delta.increased') : t('simulator.sentiment.radar.delta.decreased')"
    style="margin-left: 0.3em;"
  >
    {{ formatSignedDelta(overallDelta) }}
  </span>
  <span class="score-label">{{ overallLabel }}</span>
</div>
      </div>
    </div>
    
    <div class="radar-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="radar-chart-container">
      <canvas ref="radarChart" />
    </div>
    
    <div class="sentiment-details">
      <!-- Two-column layout for provinces to fit more on screen -->
      <div
        v-if="activeTab === 'provinces'"
        class="provinces-grid"
      >
        <div
          v-for="(score, name) in currentTabEntities"
          :key="name"
          class="entity-row"
          :class="{ 'pulse-animation': isNewlyAffectedByScenario(name) }"
        >
          <div
            class="entity-name"
            :title="formatName(name)"
          >
            {{ formatName(name) }}
          </div>
          <div class="entity-score-bar">
            <div 
              class="score-fill" 
              :style="{ 
                width: `${(score / 5) * 100}%`,
                backgroundColor: getSentimentColor(score)
              }"
            />
            <div 
              v-if="showScenarioImpact(name)" 
              class="scenario-impact-indicator" 
              :class="getScenarioImpactClass(name)"
              :title="getScenarioImpactText(name)"
            />
          </div>
          <div class="entity-score">
            <span :style="{ color: getSentimentColor(score) }">
              {{ score.toFixed(1) }}
            </span>
            <span
              v-if="entityDeltas && Math.abs(entityDeltas[name]) > 0.01"
              :class="['score-delta', entityDeltas[name] > 0 ? 'delta-up' : 'delta-down']"
              :title="entityDeltas[name] > 0 ? t('simulator.sentiment.radar.delta.increased') : t('simulator.sentiment.radar.delta.decreased')"
            >
              {{ formatSignedDelta(entityDeltas[name]) }}
            </span>
            <span class="entity-emoji">{{ getSentimentEmoji(score) }}</span>
          </div>
          <!-- Add impact banner with hover -->
          <div v-if="getEntityImpacts(name)" class="impact-banner">
            <div v-for="(data, category) in getEntityImpacts(name)" :key="category" 
                 class="impact-item">
              <div class="impact-header">
                <span class="impact-category">{{ formatCategoryName(category) }}:</span>
                <span :class="['impact-value', data.impact > 0 ? 'positive' : 'negative']">
                  {{ data.impact > 0 ? '+' : '' }}{{ formatPercentageChange(data.impact * 100) }}
                </span>
              </div>
              <div class="impact-description">{{ data.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Regular layout for demographics and sectors -->
      <div v-else>
        <div
          v-for="(score, name) in currentTabEntities"
          :key="name"
          class="entity-row"
          :class="{ 'pulse-animation': isNewlyAffectedByScenario(name) }"
        >
          <div class="entity-name">
            {{ formatName(name) }}
          </div>
          <div class="entity-score-bar">
            <div 
              class="score-fill" 
              :style="{ 
                width: `${(score / 5) * 100}%`,
                backgroundColor: getSentimentColor(score)
              }"
            />
            <div 
              v-if="showScenarioImpact(name)" 
              class="scenario-impact-indicator" 
              :class="getScenarioImpactClass(name)"
              :title="getScenarioImpactText(name)"
            />
          </div>
          <div class="entity-score">
            <span :style="{ color: getSentimentColor(score) }">
              {{ score.toFixed(1) }}
            </span>
            <span
              v-if="entityDeltas && Math.abs(entityDeltas[name]) > 0.01"
              :class="['score-delta', entityDeltas[name] > 0 ? 'delta-up' : 'delta-down']"
              :title="entityDeltas[name] > 0 ? t('simulator.sentiment.radar.delta.increased') : t('simulator.sentiment.radar.delta.decreased')"
            >
              {{ formatSignedDelta(entityDeltas[name]) }}
            </span>
            <span class="entity-emoji">{{ getSentimentEmoji(score) }}</span>
          </div>
          <!-- Add impact banner with hover -->
          <div v-if="getEntityImpacts(name)" class="impact-banner">
            <div v-for="(data, category) in getEntityImpacts(name)" :key="category" 
                 class="impact-item">
              <div class="impact-header">
                <span class="impact-category">{{ formatCategoryName(category) }}:</span>
                <span :class="['impact-value', data.impact > 0 ? 'positive' : 'negative']">
                  {{ data.impact > 0 ? '+' : '' }}{{ formatPercentageChange(data.impact * 100) }}
                </span>
              </div>
              <div class="impact-description">{{ data.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ref, computed, watch, onMounted, onUnmounted, nextTick, defineProps } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useSentimentSettingsStore } from '@/domains/sentiment/store/sentimentSettings';
import { budgetScenarioModifiers } from '@/domains/budget/config/budgetScenarioModifiers';
import { useI18n } from '@/i18n';

const { t } = useI18n();
import { computeSentimentScores, getSentimentLabel, getSentimentEmoji, getSentimentColor } from '@/domains/sentiment/utils/computeSentimentScores';
import Chart from 'chart.js/auto';
import { entityImpactFactors } from '@/domains/sentiment/config/entityImpactFactors.js';
import { handleError } from '@/utils/errorHandler.js';

// Component props
const props = defineProps({
  // Optional prop to override the budget data (for testing)
  budgetData: {
    type: Object,
    default: null
  }
});

// Store and refs
const store = useBudgetSimulatorStore();
const sentimentSettings = useSentimentSettingsStore();
const radarChart = ref(null);
const chartInstance = ref(null);
const isMounted = ref(false);
const isUpdatingChart = ref(false);
const activeTab = ref('provinces');

watch(() => props.externalTab, (v) => {
  if (!v) return;
  if (v === 'provinces' || v === 'demographics' || v === 'sectors') {
    activeTab.value = v;
  }
});
const errorMessage = ref('');

// Chart lifecycle state
let destroyed = false; // Single source of truth for unmount
let chartUpdateTimeout = null;
let domObserver = null; // DOM mutation observer to detect canvas removal

// Unified cleanup for chart and async updates on unmount
onUnmounted(() => {
  // Set destroyed flag first to prevent any further updates
  destroyed = true;
  isMounted.value = false;
  
  // Clear all timeouts and observers
  if (chartUpdateTimeout) {
    clearTimeout(chartUpdateTimeout);
    chartUpdateTimeout = null;
  }
  
  if (domObserver) {
    domObserver.disconnect();
    domObserver = null;
  }
  
  // Safely destroy chart instance
  safeDestroyChart();
});

// Helper function to safely destroy chart
function safeDestroyChart(context = 'unknown') {
  if (chartInstance.value) {
    try {
      console.log(`[SENTIMENT][${context}] Attempting to destroy chart. radarChart.value:`, radarChart.value);
      chartInstance.value.destroy();
      chartInstance.value = null;
      console.log(`[SENTIMENT][${context}] Chart destroyed safely`);
    } catch (error) {
      console.error(`[SENTIMENT][${context}] Error destroying chart:`, error);
      // Force cleanup
      chartInstance.value = null;
    }
  } else {
    console.log(`[SENTIMENT][${context}] No chartInstance to destroy.`);
  }
}

// Tabs configuration
const tabs = computed(() => [
  { id: 'provinces', label: t('simulator.sentiment.tabs.provinces') },
  { id: 'demographics', label: t('simulator.sentiment.tabs.demographics') },
  { id: 'sectors', label: t('simulator.sentiment.tabs.sectors') }
]);

// Track whether we're showing base reactions or scenario impact
const showBaseReactions = ref(false);

// Get active scenario information
const activeScenario = computed(() => store.activePreset);
const activeScenarioInfo = computed(() => {
  if (!activeScenario.value || !budgetScenarioModifiers[activeScenario.value]) {
    return null;
  }
  return budgetScenarioModifiers[activeScenario.value];
});

const activeScenarioLabel = computed(() => 
  activeScenarioInfo.value ? activeScenarioInfo.value.label : ''
);

const activeScenarioIcon = computed(() => {
  if (!activeScenarioInfo.value) return '';
  // Extract the emoji from the label
  const match = activeScenarioInfo.value.label.match(/^(\S+)/);
  return match ? match[1] : '';
});

const activeScenarioDescription = computed(() => 
  activeScenarioInfo.value ? activeScenarioInfo.value.description : ''
);


// Compute sentiment scores with scenario modifiers if applicable
const sentimentScores = computed(() => {
  // Explicitly create a sensitivity settings object to pass to the compute function
  const sensitivitySettings = {
    overall: sentimentSettings.overall,
    regions: sentimentSettings.regions,
    demographics: sentimentSettings.demographics,
    sectors: sentimentSettings.sectors
  };
  
  console.log('[SENTIMENT] Computing scores with sensitivity settings:', sensitivitySettings);
  
  const budgetData = props.budgetData || store.budgetData;
  if (showBaseReactions.value) {
    return computeSentimentScores(budgetData, store.badges, null, sensitivitySettings);
  }
  return computeSentimentScores(budgetData, store.badges, activeScenario.value, sensitivitySettings);
});

// Create a debounced function to update the chart when sensitivity settings change
const updateChartWithSensitivity = debounce(() => {
  console.log('[SENTIMENT] Sensitivity settings changed, updating chart');
  if (chartInstance.value) {
    updateChart();
  }
}, 100); // 100ms debounce time

// Expose fiscalChaos flag
const fiscalChaos = computed(() => !!sentimentScores.value.fiscalChaos);

// Helper functions for scenario impact visualization
function isNewlyAffectedByScenario(entityName) {
  if (!activeScenarioInfo.value || showBaseReactions.value) return false;
  
  const sectionModifiers = activeScenarioInfo.value[activeTab.value];
  return sectionModifiers && Math.abs(sectionModifiers[entityName] || 0) >= 0.5;
}

function showScenarioImpact(entityName) {
  if (!activeScenarioInfo.value || showBaseReactions.value) return false;
  
  const sectionModifiers = activeScenarioInfo.value[activeTab.value];
  return sectionModifiers && sectionModifiers[entityName] !== undefined;
}

function getScenarioImpactClass(entityName) {
  if (!activeScenarioInfo.value) return '';
  
  const sectionModifiers = activeScenarioInfo.value[activeTab.value];
  if (!sectionModifiers || sectionModifiers[entityName] === undefined) return '';
  
  const modifier = sectionModifiers[entityName];
  if (modifier > 0.5) return 'very-positive';
  if (modifier > 0) return 'positive';
  if (modifier < -0.5) return 'very-negative';
  if (modifier < 0) return 'negative';
  return '';
}

function getScenarioImpactText(entityName) {
  if (!activeScenarioInfo.value) return '';
  
  const sectionModifiers = activeScenarioInfo.value[activeTab.value];
  if (!sectionModifiers || sectionModifiers[entityName] === undefined) return '';
  
  const modifier = sectionModifiers[entityName];
  const directionKey = modifier > 0 ? 'positive' : 'negative';
  const intensityKey = Math.abs(modifier) > 0.5 ? 'strong' : 'moderate';
  const value = `${modifier > 0 ? '+' : ''}${modifier.toFixed(1)}`;
  
  return t('simulator.sentiment.radar.scenarioImpactText', {
    intensity: t(`simulator.sentiment.radar.intensity.${intensityKey}`),
    direction: t(`simulator.sentiment.radar.direction.${directionKey}`),
    value
  });
}

// Watch for changes in the store that should trigger sentiment updates
watch(
  () => [store.lastRevenueSourceUpdate, store.lastTaxExpenditureUpdate, store.lastBadgeUpdate, store.activePreset, store.lastSentimentUpdate],
  () => {
    console.log('%c[SENTIMENT DEBUG] Recalculating sentiment due to store update', 'color: #8e44ad;');
    // Force chart update when store changes
    nextTick(() => {
      updateChart();
      
      // Add animation class to chart container when preset changes
      if (activeScenario.value) {
        const container = document.querySelector('.radar-chart-container');
        if (container) {
          container.classList.add('scenario-change-animation');
          setTimeout(() => {
            container.classList.remove('scenario-change-animation');
          }, 1000);
        }
      }
    });
  }
);



// Watch for changes in sentiment sensitivity settings
watch(
  () => [
    sentimentSettings.overall,
    sentimentSettings.regions,
    sentimentSettings.demographics,
    sentimentSettings.sectors
  ],
  () => {
    console.log('%c[SENTIMENT DEBUG] Sensitivity settings changed, debouncing update', 'color: #2ecc71;');
    updateChartWithSensitivity();
  }
);

// Get entities for the current tab
const currentTabEntities = computed(() => {
  if (!sentimentScores.value || !sentimentScores.value[activeTab.value]) {
    return {};
  }
  
  // Ensure all provinces and territories are displayed
  if (activeTab.value === 'provinces') {
    // Create a mapping between display names and possible config keys
    const provinceMapping = {
      'Alberta': ['Alberta'],
      'British Columbia': ['British Columbia', 'BritishColumbia'],
      'Manitoba': ['Manitoba'],
      'New Brunswick': ['New Brunswick', 'NewBrunswick'],
      'Newfoundland and Labrador': ['Newfoundland and Labrador', 'NewfoundlandAndLabrador'],
      'Northwest Territories': ['Northwest Territories', 'NorthwestTerritories'],
      'Nova Scotia': ['Nova Scotia', 'NovaScotia'],
      'Nunavut': ['Nunavut'],
      'Ontario': ['Ontario'],
      'Prince Edward Island': ['Prince Edward Island'],
      'Quebec': ['Quebec'],
      'Saskatchewan': ['Saskatchewan'],
      'Yukon': ['Yukon']
    };
    
    // Create a new object with all provinces, using existing scores or default to 3.0
    const result = {};
    Object.entries(provinceMapping).forEach(([displayName, possibleKeys]) => {
      // Try to find a matching key in the sentiment scores
      let found = false;
      for (const key of possibleKeys) {
        if (sentimentScores.value[activeTab.value][key] !== undefined) {
          result[displayName] = sentimentScores.value[activeTab.value][key];
          found = true;
          break;
        }
      }
      // If no matching key was found, default to 3.0 (neutral)
      if (!found) {
        result[displayName] = 3.0;
      }
    });
    return result;
  }
  
  return sentimentScores.value[activeTab.value];
});

// Overall sentiment metrics
const overallScore = computed(() => sentimentScores.value.overall);
const overallLabel = computed(() => getSentimentLabel(overallScore.value));
const overallColor = computed(() => getSentimentColor(overallScore.value));
const overallEmoji = computed(() => getSentimentEmoji(overallScore.value));

// Track previous scores for delta display
const previousScores = reactive({
  overall: overallScore.value,
  provinces: {},
  sectors: {},
  demographics: {}
});

const overallDelta = computed(() => {
  const delta = overallScore.value - (previousScores.overall ?? overallScore.value);
  return delta;
});

const entityDeltas = computed(() => {
  const tab = activeTab.value;
  const curr = sentimentScores.value[tab];
  const prev = previousScores[tab] || {};
  const deltas = {};
  for (const key in curr) {
    deltas[key] = curr[key] - (prev[key] ?? curr[key]);
  }
  return deltas;
}); // Used in template for delta display

// Watch for score changes to update previous scores
watch(
  [overallScore, activeTab, sentimentScores],
  (newVals, oldVals) => {
    const [oldOverall, oldTab, oldScores] = oldVals;
    if (typeof oldOverall !== 'undefined') {
      previousScores.overall = oldOverall;
    }
    if (oldTab && oldScores && oldScores[oldTab]) {
      previousScores[oldTab] = { ...oldScores[oldTab] };
    }
  },
  { immediate: true }
);

function formatSignedDelta(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00';
  const magnitude = Math.abs(num).toFixed(digits);
  if (num > 0) return `+${magnitude}`;
  if (num < 0) return `-${magnitude}`;
  return magnitude;
}

// Translate entity names based on tab type
function translateEntityName(tab, name) {
  // For provinces, use the sentiment.provinces translation keys
  if (tab === 'provinces') {
    // Map display names to translation keys
    const provinceKeyMap = {
      'Alberta': 'sentiment.groups.provinces.alberta',
      'British Columbia': 'sentiment.groups.provinces.britishColumbia',
      'Manitoba': 'sentiment.groups.provinces.manitoba',
      'New Brunswick': 'sentiment.groups.provinces.newBrunswick',
      'Newfoundland and Labrador': 'sentiment.groups.provinces.newfoundlandAndLabrador',
      'Northwest Territories': 'sentiment.groups.provinces.northwestTerritories',
      'Nova Scotia': 'sentiment.groups.provinces.novaScotia',
      'Nunavut': 'sentiment.groups.provinces.nunavut',
      'Ontario': 'sentiment.groups.provinces.ontario',
      'Prince Edward Island': 'sentiment.groups.provinces.princeEdwardIsland',
      'Quebec': 'sentiment.groups.provinces.quebec',
      'Saskatchewan': 'sentiment.groups.provinces.saskatchewan',
      'Yukon': 'sentiment.groups.provinces.yukon'
    };
    
    const translationKey = provinceKeyMap[name];
    if (translationKey) {
      const translated = t(translationKey, name);
      if (translated && translated !== translationKey) {
        return translated;
      }
      // Fallback to the original name when translation is missing
      return name;
    }
  }
  
  // For demographics and sectors, try to find translation keys
  if (tab === 'demographics' || tab === 'sectors') {
    // Convert name to camelCase for translation key
    const camelCaseName = name.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
    
    const translationKey = `sentiment.groups.${tab}.${camelCaseName}`;
    const translated = t(translationKey, name);
    if (translated && translated !== translationKey) {
      return translated;
    }
    // Fallback to original when translation missing
    return name;
  }
  
  // Fallback: return the original name
  return name;
}

// Format entity names for display
function formatName(name, tab = activeTab.value) {
  return translateEntityName(tab, name);
}

// Helper function to get the correct entity key
function getEntityKey(displayName, tab) {
  // Special case for Newfoundland and Labrador
  if (displayName === 'Newfoundland and Labrador') {
    return t('sentiment.newfoundlandAndLabrador', 'Newfoundland and Labrador');
  }

  // For provinces, we need to handle both spaced and camelCase names
  if (tab === 'provinces') {
    const provinceMapping = {
      'Alberta': ['Alberta'],
      'British Columbia': ['British Columbia', 'BritishColumbia'],
      'Manitoba': ['Manitoba'],
      'New Brunswick': ['New Brunswick', 'NewBrunswick'],
      'Newfoundland and Labrador': ['Newfoundland and Labrador', 'NewfoundlandAndLabrador'],
      'Northwest Territories': ['Northwest Territories', 'NorthwestTerritories'],
      'Nova Scotia': ['Nova Scotia', 'NovaScotia'],
      'Nunavut': ['Nunavut'],
      'Ontario': ['Ontario'],
      'Prince Edward Island': ['Prince Edward Island'],
      'Quebec': ['Quebec'],
      'Saskatchewan': ['Saskatchewan'],
      'Yukon': ['Yukon']
    };
    
    const possibleKeys = provinceMapping[displayName] || [displayName];
    for (const key of possibleKeys) {
      if (entityImpactFactors[tab]?.[key]?.factors) {
        return key;
      }
    }
  }
  
  // For sectors and demographics, try different naming conventions
  const possibleKeys = [
    // Try the original display name
    displayName,
    // Try camelCase version
    displayName.toLowerCase().replace(/\s+(.)/g, (match, group1) => group1.toUpperCase()),
    // Try removing spaces
    displayName.replace(/\s+/g, ''),
    // Try removing spaces and making first letter lowercase
    displayName.replace(/\s+/g, '').replace(/^./, str => str.toLowerCase())
  ];
  
  // Check each possible key format
  for (const key of possibleKeys) {
    if (entityImpactFactors[tab]?.[key]?.factors) {
      return key;
    }
  }
  
  // If no match found, return the original display name
  return displayName;
}

// 🆕 PERFORMANCE NOTE: Optimized Chart.js update logic: mutate data, do not recreate chart
function updateChart() {
  // If an update is already in progress, skip this update
  if (isUpdatingChart.value) {
    console.warn('[SENTIMENT][updateChart] Update already in progress, skipping');
    return;
  }
  
  // Set the update flag
  isUpdatingChart.value = true;
  
  console.log('[SENTIMENT][updateChart] Updating chart with sensitivity settings:', 
    sentimentSettings.overall, 
    sentimentSettings.regions, 
    sentimentSettings.demographics, 
    sentimentSettings.sectors
  );
  
  // Defensive: If destroyed or canvas is missing, abort
  if (destroyed || !radarChart.value || !isMounted.value) {
    console.warn('[SENTIMENT][updateChart] Component not ready, skipping chart update');
    isUpdatingChart.value = false;
    return;
  }
  
  // Ensure canvas is in DOM
  if (!document.body.contains(radarChart.value)) {
    console.warn('[SENTIMENT][updateChart] Canvas not in DOM, skipping chart update');
    return;
  }

  // Verify the canvas has a valid size
  if (radarChart.value.offsetWidth === 0 || radarChart.value.offsetHeight === 0) {
    console.warn('[SENTIMENT][updateChart] Canvas has zero width or height, skipping chart update');
    return;
  }
  
  // Ensure we have valid sentiment data before updating
  if (!sentimentScores.value || !sentimentScores.value[activeTab.value]) {
    console.warn('[SENTIMENT][updateChart] No valid sentiment data for tab:', activeTab.value);
    return;
  }
  
  // Set up DOM observer if not already done
  setupDomObserver();
  
  // Get the canvas context - declare it in the function scope so it's available throughout
  let ctx;
  try {
    ctx = radarChart.value.getContext('2d');
    if (!ctx) {
      console.warn('[SENTIMENT][updateChart] Could not get canvas context');
      return;
    }
  } catch (error) {
    handleError(error, (msg) => errorMessage.value = msg);
    return;
  }
  
  // First, destroy any existing chart to prevent memory leaks and errors
  if (chartInstance.value) {
    safeDestroyChart('updateChart-before-create');
  }
  
  // Get the data for the chart
  const entities = currentTabEntities.value;
  if (!entities || Object.keys(entities).length === 0) {
    console.warn('[SENTIMENT][updateChart] No entities to display for tab:', activeTab.value);
    return;
  }
  
  // Prepare the data for the chart
  const labels = Object.keys(entities).map(name => formatName(name, activeTab.value));
  const data = Object.values(entities);
  const colors = data.map(score => getSentimentColor(score));
  
  // Define chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // Add defensive event handling to prevent errors
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    // Disable animations for better performance during rapid updates
    animation: {
      duration: 0 // general animation time
    },
    hover: {
      animationDuration: 0 // duration of animations when hovering an item
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    scales: {
      r: {
        beginAtZero: true,
        suggestedMin: 1,
        suggestedMax: 5,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (items) => {
            return items[0].label;
          },
          label: (context) => {
            const score = context.raw;
            const entityName = context.label;
            if (score === undefined || score === null) {
              return t('simulator.sentiment.radar.tooltip.noData');
            }
            try {
              const entityKey = getEntityKey(entityName, activeTab.value);
              const factors = entityImpactFactors[activeTab.value]?.[entityKey]?.factors;
              if (!factors) {
                return t('simulator.sentiment.radar.tooltip.scoreWithLabel', { score: score.toFixed(1), label: getSentimentLabel(score) });
              }

              // Create tooltip content
              const tooltipContent = [
                t('simulator.sentiment.radar.tooltip.scoreWithLabel', { score: score.toFixed(1), label: getSentimentLabel(score) }),
                '',
                t('simulator.sentiment.radar.tooltip.impactFactors')
              ];

              // Add each factor to the tooltip
              factors.forEach(factor => {
                const budgetData = props.budgetData || store.budgetData;
                let value = 0;
                let impact = 0;

                if (factor.category === 'revenue') {
                  value = budgetData?.revenueSources?.[factor.name]?.adjustmentFactor || 1;
                  impact = (value - 1) * 100;
                } else if (factor.category === 'spending') {
                  value = budgetData?.spendingCategories?.[factor.name]?.adjustmentFactor || 1;
                  impact = (value - 1) * 100;
                }

                const impactText = Math.abs(impact) > 0.1 
                  ? ` (${impact > 0 ? '+' : ''}${impact.toFixed(1)}%)`
                  : '';
                
                tooltipContent.push(t('simulator.sentiment.radar.tooltip.factorLine', { name: factor.name, description: factor.description, impact: impactText }));
              });

              return tooltipContent;
            } catch (e) {
              handleError(e, (msg) => errorMessage.value = msg);
              return t('simulator.sentiment.radar.tooltip.scoreOnly', { score: Number(score).toFixed(1) });
            }
          }
        }
      }
    }
  };
  
  // Wait for the next tick to ensure the canvas is ready
  nextTick(() => {
    try {
      // If we don't have a chart instance yet, create one
      if (!chartInstance.value) {
        console.log('[SENTIMENT][updateChart] Creating new chart instance');
        chartInstance.value = new Chart(ctx, {
          type: 'radar',
          data: {
            labels,
            datasets: [{
              label: t('simulator.sentiment.radar.datasetLabel'),
              data,
              backgroundColor: 'rgba(66, 153, 225, 0.2)',
              borderColor: '#4299E1',
              pointBackgroundColor: colors,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: colors,
              pointRadius: 6,
              pointHoverRadius: 10,
              pointHitRadius: 16
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
            animation: {
              duration: 0
            },
            hover: {
              animationDuration: 0,
              mode: 'nearest',
              intersect: true
            },
            responsiveAnimationDuration: 0,
            scales: {
              r: {
                beginAtZero: true,
                suggestedMin: 1,
                suggestedMax: 5,
                ticks: { stepSize: 1 }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: true,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#2d3748',
                bodyColor: '#4a5568',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                  title: (items) => {
                    return items[0].label;
                  },
                  label: (context) => {
                    const score = context.raw;
                    const entityName = context.label;
                    if (score === undefined || score === null) {
                      return t('simulator.sentiment.radar.tooltip.noData');
                    }
                    try {
                      const entityKey = getEntityKey(entityName, activeTab.value);
                      const factors = entityImpactFactors[activeTab.value]?.[entityKey]?.factors;
                      if (!factors) {
                        return t('simulator.sentiment.radar.tooltip.scoreWithLabel', { score: score.toFixed(1), label: getSentimentLabel(score) });
                      }

                      // Create tooltip content
                      const tooltipContent = [
                        t('simulator.sentiment.radar.tooltip.scoreWithLabel', { score: score.toFixed(1), label: getSentimentLabel(score) }),
                        '',
                        t('simulator.sentiment.radar.tooltip.impactFactors')
                      ];

                      // Add each factor to the tooltip
                      factors.forEach(factor => {
                        const budgetData = props.budgetData || store.budgetData;
                        let value = 0;
                        let impact = 0;

                        if (factor.category === 'revenue') {
                          value = budgetData?.revenueSources?.[factor.name]?.adjustmentFactor || 1;
                          impact = (value - 1) * 100;
                        } else if (factor.category === 'spending') {
                          value = budgetData?.spendingCategories?.[factor.name]?.adjustmentFactor || 1;
                          impact = (value - 1) * 100;
                        }

                        const impactText = Math.abs(impact) > 0.1 
                          ? ` (${impact > 0 ? '+' : ''}${impact.toFixed(1)}%)`
                          : '';
                        
                        tooltipContent.push(t('simulator.sentiment.radar.tooltip.factorLine', { name: factor.name, description: factor.description, impact: impactText }));
                      });

                      return tooltipContent;
                    } catch (e) {
                      handleError(e, (msg) => errorMessage.value = msg);
                      return t('simulator.sentiment.radar.tooltip.scoreOnly', { score: Number(score).toFixed(1) });
                    }
                  }
                }
              }
            }
          }
        });
      } else {
        // If we have an existing chart, update its data instead of recreating it
        try {
          // Update the chart data
          chartInstance.value.data.labels = labels;
          chartInstance.value.data.datasets[0].data = data;
          chartInstance.value.data.datasets[0].pointBackgroundColor = colors;
          chartInstance.value.data.datasets[0].pointHoverBorderColor = colors;
          
          // Update chart options
          chartInstance.value.options = chartOptions;
          
          // Update the chart
          chartInstance.value.update('none'); // Use 'none' animation mode for faster updates
          console.log('[SENTIMENT][updateChart] Updated existing chart');
        } catch (error) {
          handleError(error, (msg) => errorMessage.value = msg);
          // If we encounter an error updating the chart, destroy it and recreate it
          safeDestroyChart('error-during-update');
        }
      }
    } catch (error) {
      handleError(error, (msg) => errorMessage.value = msg);
      // If we encounter an error, destroy the chart to prevent future errors
      safeDestroyChart('error-during-update');
    } finally {
      // Reset the update flag
      isUpdatingChart.value = false;
    }
  });
}


// ...

// Watch for changes to the canvas element and always destroy/recreate chart if canvas changes
watch(radarChart, (newCanvas, oldCanvas) => {
  console.log('[SENTIMENT][radarChart watcher] newCanvas:', newCanvas, 'oldCanvas:', oldCanvas);
  if (oldCanvas && oldCanvas !== newCanvas) {
    if (chartInstance.value && document.body.contains(oldCanvas)) {
      chartInstance.value.destroy();
      chartInstance.value = null;
    }
  }
});// Optionally, you could trigger a chart re-creation here if needed

// Setup DOM mutation observer to detect when canvas is removed from DOM
function setupDomObserver() {
  // Only set up once
  if (domObserver || !radarChart.value) return;
  
  // Create a mutation observer to watch for DOM changes
  domObserver = new MutationObserver(() => {
    // If component is destroyed, disconnect observer
    if (destroyed) {
      domObserver.disconnect();
      domObserver = null;
      return;
    }
    
    // Check if our canvas was removed from DOM
    if (radarChart.value && !document.body.contains(radarChart.value)) {
      console.warn('[SENTIMENT] Canvas removed from DOM, cleaning up chart');
      safeDestroyChart();
    }
  });
  
  // Start observing the document body for changes
  domObserver.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
}

// Watch for changes that should trigger chart updates
// Debounce chart updates to avoid rapid-fire updates during slider changes
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

let prevSentiment = null;
const debouncedUpdateChart = debounce(updateChart, 200);

// Watch for tab changes and sentiment updates
watch([activeTab, sentimentScores], ([newTab, newSentiment], [oldTab]) => {
  if (!isMounted.value) {
    prevSentiment = null;
    return;
  }
  
  // Force update when tab changes
  if (newTab !== oldTab) {
    console.log('[SENTIMENT] Tab changed from', oldTab, 'to', newTab);
    updateChart();
    return;
  }
  
  // Only update if sentiment actually changes
  if (!prevSentiment || !isEqual(prevSentiment, newSentiment)) {
    debouncedUpdateChart();
    prevSentiment = JSON.parse(JSON.stringify(newSentiment));
  }
}, { deep: true });

// Initialize the chart when the component is mounted
onMounted(() => {
  // Set a longer delay to ensure the DOM is fully rendered and stable
  setTimeout(() => {
    if (!destroyed) isMounted.value = true;
  });
});

// Watch for the radarChart ref to become available and trigger chart update
watch([radarChart, isMounted], ([chartEl, mounted]) => {
  if (chartEl && mounted && !destroyed) {
    updateChart();
  }
});

// (Removed redundant post-mount update retries)
// Initialization is now handled by watcher and onMounted only.

// Clean up chart instance when component is unmounted
onUnmounted(() => {
  // Set unmounted flag first to prevent any further updates
  isMounted.value = false;
  // Then destroy the chart instance ONLY if canvas is in DOM
  if (chartInstance.value) {
    try {
      if (radarChart.value && document.body.contains(radarChart.value)) {
        chartInstance.value.destroy();
        console.log('[SENTIMENT] Chart destroyed on unmount');
      } else {
        console.warn('[SENTIMENT] Chart destroy skipped: canvas not in DOM');
      }
    } catch (error) {
      handleError(error, (msg) => errorMessage.value = msg);
    }
    chartInstance.value = null;
  }
});

// Helper function to get impacts for an entity
function getEntityImpacts(entityName) {
  const factors = entityImpactFactors[activeTab.value]?.[entityName]?.factors;
  if (!factors) return null;

  const impacts = {};
  const budgetData = props.budgetData || store.budgetData;

  // Get all revenue sources and spending categories
  const revenueSources = budgetData?.revenueSources || {};
  const spendingCategories = budgetData?.spendingCategories || {};

  // Check each factor against current budget values
  for (const factor of factors) {
    let value = 0;
    let impact = 0;

    if (factor.category === 'revenue') {
      value = revenueSources[factor.name]?.adjustmentFactor || 1;
      impact = (value - 1) * 100; // Convert to percentage
    } else if (factor.category === 'spending') {
      value = spendingCategories[factor.name]?.adjustmentFactor || 1;
      impact = (value - 1) * 100; // Convert to percentage
    }

    if (Math.abs(impact) > 0.1) { // Only show significant impacts
      impacts[factor.name] = {
        impact: impact / 100, // Convert back to decimal for display
        description: factor.description
      };
    }
  }
  
  return Object.keys(impacts).length > 0 ? impacts : null;
}

// Helper function to format category names
function formatCategoryName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Helper function to format percentage changes
function formatPercentageChange(value) {
  return `${value.toFixed(1)}%`;
}
</script>

<style scoped>
.radar-sentiment-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.radar-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.radar-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.radar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.scenario-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: #2b6cb0;
  cursor: help;
}

.scenario-icon {
  font-size: 1.25rem;
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-end;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4299e1;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 0.75rem;
  color: #718096;
}

.overall-sentiment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-end;
}

.sentiment-emoji {
  font-size: 1.75rem;
}

.sentiment-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.875rem;
  color: #718096;
}

.radar-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab-button {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: #edf2f7;
}

.tab-button.active {
  background-color: #4299e1;
  color: white;
  border-color: #4299e1;
}

.radar-chart-container {
  height: 300px;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.scenario-change-animation {
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.sentiment-details {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.sentiment-details {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
}

.provinces-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.2rem 0.75rem;
}

.entity-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.35rem;
  padding: 0.15rem 0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  font-size: 0.85rem;
  position: relative;
}

.entity-row:hover {
  background-color: #f7fafc;
}

.entity-name {
  flex: 0 0 110px;
  font-size: 0.8rem;
  color: #4a5568;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entity-score-bar {
  flex: 1;
  height: 6px;
  background-color: #edf2f7;
  border-radius: 4px;
  margin: 0 0.75rem;
  position: relative;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease, background-color 0.5s ease;
}

.scenario-impact-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.scenario-impact-indicator.very-positive {
  background-color: #48bb78;
}

.scenario-impact-indicator.positive {
  background-color: #9ae6b4;
}

.scenario-impact-indicator.negative {
  background-color: #fc8181;
}

.scenario-impact-indicator.very-negative {
  background-color: #e53e3e;
}

.entity-score {
  flex: 0 0 70px;
  text-align: right;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.8rem;
}

.score-delta {
  display: inline-flex;
  align-items: center;
  margin: 0 0.25em;
  font-size: 0.85em;
  font-weight: 700;
  vertical-align: middle;
}
.delta-up {
  color: #22c55e;
}
.delta-down {
  color: #ef4444;
}

.entity-emoji {
  margin-left: 0.25rem;
  font-size: 0.9rem;
}

/* Scrollbar styling */
.sentiment-details::-webkit-scrollbar {
  width: 6px;
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

.impact-banner {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 8px;
  background-color: #f8fafc;
  border-radius: 4px;
  font-size: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  white-space: nowrap;
  min-width: 200px;
}

.entity-row:hover .impact-banner {
  opacity: 1;
  visibility: visible;
}

.impact-item {
  margin-bottom: 6px;
}

.impact-item:last-child {
  margin-bottom: 0;
}

.impact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.impact-category {
  color: #4a5568;
  font-weight: 500;
}

.impact-value {
  font-weight: 600;
}

.impact-value.positive {
  color: #059669;
}

.impact-value.negative {
  color: #dc2626;
}

.impact-description {
  color: #718096;
  font-size: 0.7rem;
  line-height: 1.2;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
