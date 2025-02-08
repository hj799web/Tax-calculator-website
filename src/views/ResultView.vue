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
import TaxPieChart from '../components/TaxPieChart.vue'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  sortedBudgetCategories
} = storeToRefs(useCalculatorStore())

const {
  canCalculate
} = useCalculator()

async function exportToPDF() {
      try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let currentHeight = margin;

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(
          'Canada Income Tax & Federal Budget Breakdown (Approx)',
          pageWidth / 2,
          currentHeight,
          { align: 'center' }
        );
        currentHeight += 12;

        // Date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const exportDate = new Date().toLocaleDateString('en-CA');
        doc.text(`Export Date: ${exportDate}`, margin, currentHeight);
        currentHeight += 8;

        // Divider
        doc.setDrawColor(200);
        doc.line(margin, currentHeight, pageWidth - margin, currentHeight);
        currentHeight += 5;

        // Tax Calculations Table
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tax Calculations', margin, currentHeight);
        currentHeight += 8;

        const taxCalcData = [
          ['Federal Tax Per Period', formatCurrency(netFederalTaxPerPeriod.value)],
          ['Provincial Tax Per Period', formatCurrency(netProvincialTaxPerPeriod.value)],
          ['CPP/QPP Per Period', formatCurrency(pensionPlanContributionPerPeriod.value)],
          ['EI Premium Per Period', formatCurrency(eiPremiumPerPeriod.value)],
          ['Net Income Per Period', formatCurrency(netIncomeAfterCreditsPerPeriod.value)],
        ];

        autoTable(doc, {
          startY: currentHeight,
          head: [['Description', 'Amount']],
          body: taxCalcData,
          theme: 'grid',
          styles: { fontSize: 12, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: margin, right: margin },
        });
        currentHeight = doc.previousAutoTable.finalY + 10;

        // Federal Budget Allocation for Budget Categories
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Federal Tax Allocated', margin, currentHeight);
        currentHeight += 8;

        // We pull from sortedBudgetCategories, which has allocatedAmount & percentage
        const allocatedRows = sortedBudgetCategories.value.map(cat => [
          cat.name,
          formatCurrency(cat.allocatedAmount),
          cat.percentage.toFixed(2) + '%',
        ]);

        autoTable(doc, {
          startY: currentHeight,
          head: [['Category', 'Allocated Amount', 'Percentage']],
          body: allocatedRows,
          theme: 'grid',
          styles: { fontSize: 12, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: margin, right: margin },
        });
        currentHeight = doc.previousAutoTable.finalY + 10;

        doc.save('Tax_and_Budget_Breakdown_Approx.pdf');
      } catch (err) {
        console.error('Error generating PDF:', err);
      }
    }

</script>