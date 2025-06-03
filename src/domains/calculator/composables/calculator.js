import { computed } from 'vue'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { storeToRefs } from 'pinia';
import { useVuelidate } from '@vuelidate/core'
import { numeric, minValue, maxValue, helpers } from '@vuelidate/validators'

export const useCalculator = () => {

  const calculatorStore = useCalculatorStore();

  const {
    income,
    selectedRegion,
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
    numberOfDependentsWithDisabilities
  } = storeToRefs(calculatorStore);

  // Helper function to sanitize numeric input
  const sanitizeNumericInput = (value) => {
    if (value === undefined || value === '') return undefined;
    // Remove any non-numeric characters except decimal point
    const sanitized = String(value).replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      return parseFloat(parts[0] + '.' + parts.slice(1).join(''));
    }
    return parseFloat(sanitized);
  };

  // Helper function to validate decimal places
  const maxDecimalPlaces = (maxPlaces) => (value) => {
    if (value === undefined || value === '') return true;
    const decimalStr = String(value).split('.')[1];
    return !decimalStr || decimalStr.length <= maxPlaces;
  };

  // Helper function to check correct type
  const checkCorrectType = (value) => {
    return value === undefined || typeof value === 'number';
  };

  // Maximum values for different inputs
  const MAX_INCOME = 1000000000; // $1 billion
  const MAX_DEPENDENTS = 20;
  const MAX_RRSP = 29210; // 2024 RRSP limit

  const rules = computed(() => ({
    income: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    selfEmploymentIncome: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    capitalGainsBeforeJune25: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    capitalGainsAfterJune25: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    eligibleDividends: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    ineligibleDividends: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    otherIncome: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_INCOME),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    rrspDeduction: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_RRSP),
      maxDecimalPlaces: helpers.withMessage(
        'Maximum 2 decimal places allowed',
        maxDecimalPlaces(2)
      )
    },
    numberOfDependents: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_DEPENDENTS),
      maxDecimalPlaces: helpers.withMessage(
        'Must be a whole number',
        maxDecimalPlaces(0)
      )
    },
    numberOfChildrenUnder18: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_DEPENDENTS),
      maxDecimalPlaces: helpers.withMessage(
        'Must be a whole number',
        maxDecimalPlaces(0)
      )
    },
    numberOfDependentsWithDisabilities: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
      maxValue: maxValue(MAX_DEPENDENTS),
      maxDecimalPlaces: helpers.withMessage(
        'Must be a whole number',
        maxDecimalPlaces(0)
      )
    }
  }))

  const v$ = useVuelidate(rules, {
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
    numberOfDependentsWithDisabilities
  })

  const canCalculate = computed(() => {
    return !!selectedRegion.value && !v$.value.$invalid && !v$.value.$error
      /*(
        (income.value && income.value > 0) ||
        (selfEmploymentIncome.value && selfEmploymentIncome.value > 0) ||
        (capitalGainsBeforeJune25.value && capitalGainsBeforeJune25.value > 0) ||
        (capitalGainsAfterJune25.value && capitalGainsAfterJune25.value > 0) ||
        (eligibleDividends.value && eligibleDividends.value > 0) ||
        (ineligibleDividends.value && ineligibleDividends.value > 0) ||
        (otherIncome.value && otherIncome.value > 0)
      )*/
  });

  return {
    v$,
    sanitizeNumericInput,
    canCalculate
  }
}