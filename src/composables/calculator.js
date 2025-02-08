import { computed } from 'vue'
import { useCalculatorStore } from '../stores/calculator.js'
import { storeToRefs } from 'pinia';
import { useVuelidate } from '@vuelidate/core'
import { numeric, minValue } from '@vuelidate/validators'

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

  const checkCorrectType = (value) => {
    console.log(typeof value)
    return value === undefined || typeof value === 'number'
  }

  const rules = computed(() => ({
    income: {
      numeric,
      checkCorrectType,
      minValue: minValue(0),
    },
    selfEmploymentIncome: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    capitalGainsBeforeJune25: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    capitalGainsAfterJune25: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    eligibleDividends: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    ineligibleDividends: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    otherIncome: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    rrspDeduction: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    numberOfDependents: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    numberOfChildrenUnder18: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
    },
    numberOfDependentsWithDisabilities: {
      numeric,
      checkCorrectType,
      minValue: minValue(0)
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

  return { v$, canCalculate }
}