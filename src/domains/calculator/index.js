// Calculator domain exports

// Component exports
export { default as IncomeInput } from './components/IncomeInput.vue'
export { default as AdditionalIncomeInputs } from './components/AdditionalIncomeInputs.vue'
export { default as DeductionsAndCreditsInputs } from './components/DeductionsAndCreditsInputs.vue'
export { default as TaxPieChart } from './components/TaxPieChart.vue'
export { default as Budget2024PieChart } from './components/Budget2024PieChart.vue'
export { default as FederalBudgetPieChart } from './components/FederalBudgetPieChart.vue'
export { default as FederalBudget2024PieChart } from './components/FederalBudget2024PieChart.vue'
export { default as PercentageInput } from './components/PercentageInput.vue'
export { default as YearSelector } from './components/YearSelector.vue'

// Store exports
export { useCalculatorStore } from './store/calculator.js'
export { useYearStore } from './store/year.js'
export * from './store/salary.js'

// Composable exports
export { useCalculator } from './composables/calculator.js'
export { usePdfGenerator } from './composables/pdfGenerator.js'

// Utility exports
export { generateColors, formatCurrency } from './utils/chartUtils.js'
export { htmlLegendPlugin } from './utils/htmlLegendPlugin.js'

// Constants exports
export { baseBudget2024Data, federalBudget2024Data } from './constants/budgetData.js'
