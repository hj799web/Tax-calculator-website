<template>
  <div>
    <!-- Main Export Button -->
    <button
      class="btn btn-primary mt-4"
      @click="throttledDownloadBudgetPDF(includeFullBreakdown)"
    >
       {{ i18nText('budgetExportPanel.buttons.downloadPdf', 'Download as PDF') }}
    </button>

    <!-- Toggle for Full Breakdown -->
    <label class="text-sm flex items-center gap-2 mt-2">
      <input
        v-model="includeFullBreakdown"
        type="checkbox"
      >
      {{ i18nText('budgetExportPanel.labels.includeFullBreakdown', 'Include Full Budget Breakdown') }}
    </label>
    
    <!-- Export Card for PDF Generation - Hidden off-screen -->
    <div style="position: fixed; top: -9999px; left: -9999px; width: 800px; height: auto; overflow: visible; visibility: hidden;">
      <ExportCard 
        id="export-summary"
        :budget-title="budgetTitle"
        :badges="budgetStore.badges || []"
        :narrative="narrative"
        :total-revenue="budgetStore.totalRevenue"
        :total-spending="budgetStore.totalSpending"
        :surplus="budgetStore.surplus"
        :sentiment-scores="sentimentScores"
        :include-full-breakdown="includeFullBreakdown"
        :budget="{
          revenueSources: budgetStore.revenueSources,
          spendingCategories: budgetStore.spendingCategories
        }"
        :format-currency="formatCurrency"
        :format-percentage-change="formatPercentageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator.js'
import { downloadBudgetPDF } from '@/domains/budget/utils/generateExportPDF'
import { computeSentimentScores } from '@/domains/sentiment/utils/computeSentimentScores'
import ExportCard from './ExportCard.vue'
import throttle from 'lodash.throttle'
import { useI18n } from '@/i18n';

// i18n setup
const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key);
  return value === key ? fallback : value;
};

const budgetStore = useBudgetSimulatorStore()
const includeFullBreakdown = ref(true)

// Format currency for display
const formatCurrency = (value) => {
  const absValue = Math.abs(value)
  const prefix = value < 0 ? '-$' : '$'
  return `${prefix}${absValue.toFixed(1)}B`
}

// Format percentage change with plus/minus sign
const formatPercentageChange = (value) => {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

// Get budget title
const budgetTitle = computed(() => {
  if (budgetStore.activePreset && budgetStore.activePreset.name) {
    return `${budgetStore.activePreset.name} Budget`
  }
  return 'Federal Budget Summary'
})

// Calculate accurate sentiment scores directly using the computeSentimentScores function
const sentimentScores = computed(() => {
  // Get the current budget data from the store
  const budgetData = budgetStore.budgetData || {};
  
  // Calculate sentiment scores using the same function used by the radar component
  // This ensures the PDF shows the exact same sentiment data as the application
  const scores = computeSentimentScores(budgetData, budgetStore.badges, budgetStore.activePreset);
  
  // Log the scores for debugging
  console.log('[PDF Export] Calculated sentiment scores:', scores);
  
  return scores;
})

// Get narrative
const narrative = computed(() => {
  // Get budget data for analysis
  const surplus = budgetStore.totalRevenue - budgetStore.totalSpending;
  const totalRevenue = budgetStore.totalRevenue || 0;
  const totalSpending = budgetStore.totalSpending || 0;
  
  // Analyze spending patterns to create an accurate description
  let spendingDescription = '';
  
  // Check if there are significant spending cuts
  const hasSpendingCuts = budgetStore.spendingCategories && 
    Object.values(budgetStore.spendingCategories).some(category => 
      category.adjustmentFactor < 0.95 && !category.isGroup);
  
  // Check if there are significant spending increases
  const hasSpendingIncreases = budgetStore.spendingCategories && 
    Object.values(budgetStore.spendingCategories).some(category => 
      category.adjustmentFactor > 1.05 && !category.isGroup);
  
  // Create an honest description based on actual budget decisions
  if (hasSpendingCuts && hasSpendingIncreases) {
    spendingDescription = 'reallocating funds between departments';
  } else if (hasSpendingCuts) {
    spendingDescription = 'implementing spending cuts across departments';
  } else if (hasSpendingIncreases) {
    spendingDescription = 'increasing investments in government programs';
  } else {
    spendingDescription = 'maintaining current spending levels';
  }
  
  // Generate the final narrative
  if (surplus > 0) {
    return `This budget achieves a surplus of ${formatCurrency(surplus)} by ${spendingDescription}. Total revenue is ${formatCurrency(totalRevenue)} against expenditures of ${formatCurrency(totalSpending)}.`;
  } else if (surplus < 0) {
    return `This budget runs a deficit of ${formatCurrency(Math.abs(surplus))} while ${spendingDescription}. Total revenue is ${formatCurrency(totalRevenue)} against expenditures of ${formatCurrency(totalSpending)}.`;
  } else {
    return `This budget is balanced at ${formatCurrency(totalRevenue)} by ${spendingDescription}.`;
  }
})

// Throttle the downloadBudgetPDF function
const throttledDownloadBudgetPDF = throttle(downloadBudgetPDF, 2000);
</script>

<style scoped>
.hidden-export-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 800px;
  height: auto;
  overflow: hidden;
  visibility: hidden;
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

