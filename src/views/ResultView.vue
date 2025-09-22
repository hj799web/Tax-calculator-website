<template>
  <div class="result-box">
    <h2
      v-if="canCalculate"
      class="result-title"
    >
      {{ translate('result.title', 'Your Tax Breakdown') }}
    </h2>
    <div v-if="canCalculate">
      <div class="result-item">
        <span>{{ translate('result.federalTax', 'Federal Tax:') }}</span>
        <span>
          {{ formatCurrency(netFederalTaxPerPeriod) }}
          ({{ federalTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item">
        <span>{{ translate('result.provincialTax', 'Provincial Tax:') }}</span>
        <span>
          {{ formatCurrency(netProvincialTaxPerPeriod) }}
          ({{ provincialTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item">
        <span>{{ translate('result.cppQppContribution', 'CPP/QPP Contribution:') }}</span>
        <span>
          {{ formatCurrency(pensionPlanContributionPerPeriod) }}
          ({{ cppTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item">
        <span>{{ translate('result.eiPremium', 'EI Premium:') }}</span>
        <span>
          {{ formatCurrency(eiPremiumPerPeriod) }}
          ({{ eiTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item total-tax">
        <span>{{ translate('result.totalTax', 'Total Tax:') }}</span>
        <span>
          {{ formatCurrency(totalTaxPerPeriod) }}
        </span>
      </div>
      <div class="result-item net-income">
        <span>{{ translate('result.netIncomeAfterCredits', 'Net Income After Credits:') }}</span>
        <span>
          {{ formatCurrency(netIncomeAfterCreditsPerPeriod) }}
        </span>
      </div>

      <!-- Export to PDF Button -->
      <button
        class="export-button"
        :aria-label="translate('result.exportPdfAria', 'Export tax breakdown as PDF')"
        @click="throttledExportToPDF"
      >
        {{ translate('result.exportPdf', 'Export as PDF') }}
      </button>

      <TaxPieChart />
    </div>
    <div
      v-else
      class="placeholder-text"
    >
      <p>
        {{ translate('result.placeholder', 'Please enter your income and select your province or territory to see the tax breakdown.') }}
      </p>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
  <!-- End of result-box -->
</template>

<script setup>
import { formatCurrency } from '@/domains/calculator/utils/chartUtils.js'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'
import { usePdfGenerator } from '@/domains/calculator/composables/pdfGenerator.js'
import TaxPieChart from '@/domains/calculator/components/TaxPieChart.vue'
import throttle from 'lodash.throttle'
import { handleError } from '@/utils/errorHandler.js'
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const translate = (key, fallback = '', params) => {
  const value = t(key, params)
  return value === key ? fallback : value
}

const {
  netFederalTaxPerPeriod,
  federalTaxPercentage,
  netProvincialTaxPerPeriod,
  provincialTaxPercentage,
  pensionPlanContributionPerPeriod,
  cppTaxPercentage,
  eiPremiumPerPeriod,
  eiTaxPercentage,
  totalTaxPerPeriod,
  netIncomeAfterCreditsPerPeriod
} = storeToRefs(useCalculatorStore())

const {
  canCalculate
} = useCalculator()

const {
  exportToPDF
} = usePdfGenerator()

const errorMessage = ref('')

// Throttle the exportToPDF function
const throttledExportToPDF = throttle(async () => {
  try {
    await exportToPDF()
  } catch (err) {
    handleError(err, (msg) => errorMessage.value = msg)
  }
}, 2000)
</script>

<style scoped>
/* Typography and spacing improvements */
.result-title { font-size: clamp(1.2rem, 1.4vw + 0.9rem, 1.75rem); text-align: center; margin-bottom: 1rem; }
.result-box { background: rgba(255,255,255,0.75); border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; box-shadow: 0 8px 24px rgba(0,0,0,0.05); }
.result-item { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; }
.result-item span { word-break: break-word; }

@media (max-width: 600px) {
  .card-title, .card-content, .summary-card, .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header, .tile-title, .tile-amount, .slider-labels {
    writing-mode: initial !important;
    text-orientation: initial !important;
    transform: none !important;
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
  }
  .result-box { padding: 1rem; }
  .result-item { flex-direction: column; align-items: flex-start; }
}
</style>
