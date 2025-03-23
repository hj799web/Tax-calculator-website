import { defineStore, storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { useSalaryStore } from '../stores/salary.js'
import { useYearStore } from '../stores/year.js'
import { useConfigStore } from "./config.js";
import {
  federalBasicPersonalAmount2022,
  federalBasicPersonalAmount2023,
  federalBasicPersonalAmount2024,
  provincialBasicPersonalAmounts2022,
  provincialBasicPersonalAmounts2023,
  provincialBasicPersonalAmounts2024,
  federalTaxBrackets2022,
  federalTaxBrackets2023,
  federalTaxBrackets2024,
  provincialTaxBrackets2022,
  provincialTaxBrackets2023,
  provincialTaxBrackets2024,
  budgetCategories2022,
  budgetCategories2024
} from "../constants.js";

export const useCalculatorStore = defineStore('calculator', () => {

  const {
      periodMultiplier
    } = storeToRefs(useSalaryStore())

  const {
    selectedAllocationCategories,
    sortOrder
  } = storeToRefs(useConfigStore())
  
  const yearStore = useYearStore();

  const selectedRegion = ref('')
  const income = ref(undefined)
  const selfEmploymentIncome = ref(undefined)
  const capitalGainsBeforeJune25 = ref(undefined)
  const capitalGainsAfterJune25 = ref(undefined)
  const eligibleDividends = ref(undefined)
  const ineligibleDividends = ref(undefined)
  const otherIncome = ref(undefined)
  const rrspDeduction = ref(undefined)
  const maritalStatus = ref('')
  const numberOfDependents = ref(undefined)
  const numberOfChildrenUnder18 = ref(undefined)
  const numberOfDependentsWithDisabilities = ref(undefined)

  const federalDividendTaxCredit = computed(() => {
    const fedEligibleCredit = 0.1502 * grossedUpEligibleDividends.value;
    const fedIneligibleCredit = 0.09 * grossedUpIneligibleDividends.value;
    return fedEligibleCredit + fedIneligibleCredit;
  });

  const regularIncome = computed(() =>
    (income.value || 0) +
    (selfEmploymentIncome.value || 0) +
    (otherIncome.value || 0)
  );

  const totalCapitalGains = computed(() =>
    (capitalGainsBeforeJune25.value || 0) + (capitalGainsAfterJune25.value || 0)
  );

  const grossedUpEligibleDividends = computed(() =>
    (eligibleDividends.value || 0) * 1.38
  );
  const grossedUpIneligibleDividends = computed(() =>
    (ineligibleDividends.value || 0) * 1.15
  );

  const taxableCapitalGains = computed(() => 0.5 * totalCapitalGains.value);

  const annualRegularIncome = computed(() => regularIncome.value * periodMultiplier.value);
  const annualTaxableCapitalGains = computed(() => taxableCapitalGains.value * periodMultiplier.value);
  const annualRrspDeduction = computed(() => (rrspDeduction.value || 0) * periodMultiplier.value);

  function calculateBracketTax(taxable, brackets) {
    let tax = 0;
    let previousUpTo = 0;
    for (const bracket of brackets) {
      if (taxable > bracket.upTo) {
        const slice = bracket.upTo - previousUpTo;
        tax += slice * bracket.rate;
        previousUpTo = bracket.upTo;
      } else {
        const slice = taxable - previousUpTo;
        tax += slice * bracket.rate;
        break;
      }
    }
    return Math.max(tax, 0);
  }

  // Get the appropriate tax brackets and basic personal amount based on selected year
  const currentFederalTaxBrackets = computed(() => {
    switch(yearStore.selectedTaxYear) {
      case '2022': return federalTaxBrackets2022;
      case '2023': return federalTaxBrackets2023;
      case '2024': return federalTaxBrackets2024;
      default: return federalTaxBrackets2023;
    }
  });

  const currentFederalBasicPersonalAmount = computed(() => {
    switch(yearStore.selectedTaxYear) {
      case '2022': return federalBasicPersonalAmount2022;
      case '2023': return federalBasicPersonalAmount2023;
      case '2024': return federalBasicPersonalAmount2024;
      default: return federalBasicPersonalAmount2023;
    }
  });

  const currentProvincialBasicPersonalAmounts = computed(() => {
    switch(yearStore.selectedTaxYear) {
      case '2022': return provincialBasicPersonalAmounts2022;
      case '2023': return provincialBasicPersonalAmounts2023;
      case '2024': return provincialBasicPersonalAmounts2024;
      default: return provincialBasicPersonalAmounts2023;
    }
  });

  const currentProvincialTaxBrackets = computed(() => {
    switch(yearStore.selectedTaxYear) {
      case '2022': return provincialTaxBrackets2022;
      case '2023': return provincialTaxBrackets2023;
      case '2024': return provincialTaxBrackets2024;
      default: return provincialTaxBrackets2023;
    }
  });

  // Federal + Provincial BPA
  const effectiveFederalBPA = computed(() => {
    if (maritalStatus.value === 'Married or Common-Law') {
      return currentFederalBasicPersonalAmount.value + 12500;
    }
    return currentFederalBasicPersonalAmount.value;
  });
  const effectiveProvincialBPA = computed(() => {
    if (!selectedRegion.value) return 0;
    const basePA = currentProvincialBasicPersonalAmounts.value[selectedRegion.value] || 0;
    if (maritalStatus.value === 'Married or Common-Law') {
      return basePA + 9000; // approximate
    }
    return basePA;
  });

  // Simple child credit
  const childCredit = computed(() => {
    const numKids = numberOfChildrenUnder18.value || 0;
    return 2000 * numKids;
  });

  // Full Fed Taxable
  const totalFederalTaxableIncome = computed(() => {
    let base = annualRegularIncome.value +
      annualTaxableCapitalGains.value +
      (grossedUpEligibleDividends.value * periodMultiplier.value) +
      (grossedUpIneligibleDividends.value * periodMultiplier.value);
    base -= annualRrspDeduction.value;
    return Math.max(0, base);
  });

  // Fed Tax
  const netFederalTaxAnnual = computed(() => {
    if (totalFederalTaxableIncome.value <= 0) return 0;
    let fedTaxable = totalFederalTaxableIncome.value - effectiveFederalBPA.value;
    fedTaxable = Math.max(fedTaxable, 0);
    let fedTax = calculateBracketTax(fedTaxable, currentFederalTaxBrackets.value);
    fedTax -= federalDividendTaxCredit.value * periodMultiplier.value;
    fedTax -= childCredit.value;
    return Math.max(fedTax, 0);
  });

  // Provincial
  const netProvincialTaxAnnual = computed(() => {
    if (!selectedRegion.value || totalFederalTaxableIncome.value <= 0) return 0;
    const brackets = currentProvincialTaxBrackets.value[selectedRegion.value];
    if (!brackets) return 0;
    let provTaxable = totalFederalTaxableIncome.value - effectiveProvincialBPA.value;
    provTaxable = Math.max(provTaxable, 0);
    let provTax = calculateBracketTax(provTaxable, brackets);
    return Math.max(provTax, 0);
  });

  // CPP/QPP
  const annualCppMax = 3754.45;
  const annualCppMaxSelfEmployed = 3754.45 * 2;
  const pensionPlanContributionAnnual = computed(() => {
    const baseIncome = annualRegularIncome.value;
    const isSelfEmployed = (selfEmploymentIncome.value || 0) > 0;
    const rate = isSelfEmployed ? 0.114 : 0.057;
    const maxContrib = isSelfEmployed ? annualCppMaxSelfEmployed : annualCppMax;
    return Math.min(baseIncome * rate, maxContrib);
  });

  // EI
  const annualEiMax = 1002.45;
  const eiPremiumAnnual = computed(() => {
    return Math.min(annualRegularIncome.value * 0.0163, annualEiMax);
  });

  // Net Income
  const netIncomeAfterCreditsAnnual = computed(() => {
    const totalTax = netFederalTaxAnnual.value + netProvincialTaxAnnual.value
      + pensionPlanContributionAnnual.value + eiPremiumAnnual.value;
    // For net, approximate using the sum of actual (non-grossed) dividends + half CG + T4.
    const totalGrossAnnual =
      annualRegularIncome.value +
      annualTaxableCapitalGains.value +
      (eligibleDividends.value || 0) * periodMultiplier.value +
      (ineligibleDividends.value || 0) * periodMultiplier.value;
    const net = totalGrossAnnual - totalTax;
    return Math.max(net, 0);
  });

  // Per-period
  const netFederalTaxPerPeriod = computed(() => netFederalTaxAnnual.value / periodMultiplier.value);
  const netProvincialTaxPerPeriod = computed(() => netProvincialTaxAnnual.value / periodMultiplier.value);
  const pensionPlanContributionPerPeriod = computed(() =>
    pensionPlanContributionAnnual.value / periodMultiplier.value
  );
  const eiPremiumPerPeriod = computed(() => eiPremiumAnnual.value / periodMultiplier.value);
  const netIncomeAfterCreditsPerPeriod = computed(() =>
    netIncomeAfterCreditsAnnual.value / periodMultiplier.value
  );

  const totalTaxPerPeriod = computed(() =>
    netFederalTaxPerPeriod.value +
    netProvincialTaxPerPeriod.value +
    pensionPlanContributionPerPeriod.value +
    eiPremiumPerPeriod.value
  );

  // % breakdown
  const baseForPercent = computed(() => {
    return (
      annualRegularIncome.value +
      annualTaxableCapitalGains.value +
      (eligibleDividends.value || 0) * periodMultiplier.value +
      (ineligibleDividends.value || 0) * periodMultiplier.value
    );
  });
  const federalTaxPercentage = computed(() => {
    if (baseForPercent.value <= 0) return '0.0';
    return ((netFederalTaxAnnual.value / baseForPercent.value) * 100).toFixed(1);
  });
  const provincialTaxPercentage = computed(() => {
    if (baseForPercent.value <= 0) return '0.0';
    return ((netProvincialTaxAnnual.value / baseForPercent.value) * 100).toFixed(1);
  });
  const cppTaxPercentage = computed(() => {
    if (baseForPercent.value <= 0) return '0.0';
    return ((pensionPlanContributionAnnual.value / baseForPercent.value) * 100).toFixed(1);
  });
  const eiTaxPercentage = computed(() => {
    if (baseForPercent.value <= 0) return '0.0';
    return ((eiPremiumAnnual.value / baseForPercent.value) * 100).toFixed(1);
  });

  const totalBudget = computed(() => {
    const budgetCats = yearStore.budgetYear === '2024' ? budgetCategories2024 : budgetCategories2022;
    return budgetCats.reduce((sum, cat) => sum + cat.amount, 0);
  });

  const federalBudgetData = computed(() => {
    const budgetCats = yearStore.budgetYear === '2024' ? budgetCategories2024 : budgetCategories2022;
    
    if (netFederalTaxPerPeriod.value === 0) {
      return budgetCats.map((cat) => ({
        category: cat.name,
        amount: 0,
      }));
    }
    return budgetCats.map((cat) => ({
      category: cat.name,
      amount: (netFederalTaxPerPeriod.value * cat.amount) / totalBudget.value,
    }));
  });

  const filteredBudgetData = computed(() => {
    if (!selectedAllocationCategories.value.length) {
      return federalBudgetData.value;
    }
    return federalBudgetData.value.filter(item =>
      selectedAllocationCategories.value.includes(item.category)
    );
  });

  // Sorted for "Budget Categories" display
  const sortedBudgetData = computed(() => {
    const data = [...filteredBudgetData.value];
    data.sort((a, b) => {
      return sortOrder.value === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    });
    const budgetCats = yearStore.budgetYear === '2024' ? budgetCategories2024 : budgetCategories2022;
    return data.map((item, index) => ({
      ...item,
      ...budgetCats.find((c) => c.name === item.category),
      uniqueId: `${item.category}-${index}`,
    }));
  });

  const sortedBudgetCategories = computed(() => {
    const budgetCats = yearStore.budgetYear === '2024' ? budgetCategories2024 : budgetCategories2022;
    const categoriesCopy = budgetCats;
    categoriesCopy.forEach(cat => {
      const allocated = (netFederalTaxPerPeriod.value * cat.amount) / totalBudget.value;
      cat.allocatedAmount = allocated || 0;
      cat.percentage = netFederalTaxPerPeriod.value
        ? (allocated / netFederalTaxPerPeriod.value) * 100
        : 0;
    });
    return categoriesCopy.sort((a, b) =>
      sortOrder.value === 'asc'
        ? a.allocatedAmount - b.allocatedAmount
        : b.allocatedAmount - a.allocatedAmount
    );
  });

  return {
    selectedRegion,
    income,
    selfEmploymentIncome,
    capitalGainsBeforeJune25,
    capitalGainsAfterJune25,
    eligibleDividends,
    ineligibleDividends,
    otherIncome,
    rrspDeduction,
    maritalStatus,
    numberOfDependents,
    numberOfChildrenUnder18,
    numberOfDependentsWithDisabilities,
    regularIncome,
    totalCapitalGains,
    grossedUpEligibleDividends,
    grossedUpIneligibleDividends,
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
    totalBudget,
    federalBudgetData,
    sortedBudgetData,
    sortedBudgetCategories
  }
})