import { formatCurrency } from '../utils/chartUtils.js'
import { storeToRefs } from 'pinia'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const usePdfGenerator = () => {
  const {
    netFederalTaxPerPeriod,
    netProvincialTaxPerPeriod,
    pensionPlanContributionPerPeriod,
    eiPremiumPerPeriod,
    netIncomeAfterCreditsPerPeriod,
    sortedBudgetCategories
  } = storeToRefs(useCalculatorStore())

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let currentHeight = margin;

      // Header
      doc.setFontSize(6)
      doc.setFont('helvetica', 200);
      doc.text(
        'Exported from: Canada Income Tax Calculator - https://hj799web.github.io/Tax-calculator-website/',
        pageWidth - 4,
        4,
        { align: 'right' }
      )

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(
        'Canada Income Tax',
        pageWidth / 2,
        currentHeight,
        { align: 'center' }
      );
      currentHeight += 6;
      doc.setFontSize(14);
      doc.text(
        '&',
        pageWidth / 2,
        currentHeight,
        { align: 'center' }
      );
      currentHeight += 6;
      doc.setFontSize(20);
      doc.text(
        'Federal Budget Breakdown',
        pageWidth / 2,
        currentHeight,
        { align: 'center' }
      );
      currentHeight += 10;

      // Date
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      const exportDate = new Date().toLocaleDateString('en-CA');
      doc.text(`${exportDate}`, pageWidth / 2, currentHeight, { align: 'center' });
      currentHeight += 10;

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

      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.text('All values presented in this document are approximations', margin, currentHeight)

      // Footer
      doc.setFontSize(6)
      doc.setFont('helvetica', 200);
      doc.text(
        'Exported from: Canada Income Tax Calculator - https://hj799web.github.io/Tax-calculator-website/',
        pageWidth - 4,
        doc.internal.pageSize.getHeight() - 4,
        { align: 'right' }
      )
      doc.save('Tax_and_Budget_Breakdown_Approx.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  }

  return { exportToPDF }
} 