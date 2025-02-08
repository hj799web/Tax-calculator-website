<template>
  <div class="result-box">
    <h2
      v-if="canCalculate"
      class="result-title"
    >
      Your Tax Breakdown
    </h2>
    <div v-if="canCalculate">
      <div class="result-item">
        <span>Federal Tax:</span>
        <span>
          {{ formatCurrency(netFederalTaxPerPeriod) }}
          ({{ federalTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item">
        <span>Provincial Tax:</span>
        <span>
          {{ formatCurrency(netProvincialTaxPerPeriod) }}
          ({{ provincialTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item">
        <span>CPP/QPP Contribution:</span>
        <span>
          {{ formatCurrency(pensionPlanContributionPerPeriod) }}
          ({{ cppTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item">
        <span>EI Premium:</span>
        <span>
          {{ formatCurrency(eiPremiumPerPeriod) }}
          ({{ eiTaxPercentage }}%)
        </span>
      </div>
      <div class="result-item total-tax">
        <span>Total Tax:</span>
        <span>
          {{ formatCurrency(totalTaxPerPeriod) }}
        </span>
      </div>
      <div class="result-item net-income">
        <span>Net Income After Credits:</span>
        <span>
          {{ formatCurrency(netIncomeAfterCreditsPerPeriod) }}
        </span>
      </div>

      <!-- Export to PDF Button -->
      <button
        class="export-button"
        aria-label="Export tax breakdown as PDF"
        @click="exportToPDF"
      >
        Export as PDF
      </button>

      <TaxPieChart />
    </div>
    <div
      v-else
      class="placeholder-text"
    >
      <p>
        Please enter your income and select your province or territory to see
        the tax breakdown.
      </p>
    </div>
  </div>
  <!-- End of result-box -->
</template>

<script setup>
import { formatCurrency } from '../utils.js'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '../stores/calculator.js'
import { useCalculator } from '../composables/calculator.js'
import { usePdfGenerator } from '../composables/pdfGenerator.js'
import TaxPieChart from '../components/TaxPieChart.vue'

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
  netIncomeAfterCreditsPerPeriod,
} = storeToRefs(useCalculatorStore())

const {
  canCalculate
} = useCalculator()

const {
  exportToPDF
} = usePdfGenerator()


</script>