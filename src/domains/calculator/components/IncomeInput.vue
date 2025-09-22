<template>
  <div class="input-subgroup">
    <label
      class="input-label"
      for="employmentIncome"
    >
      {{ t('calculator.inputs.employment.label') }}
    </label>
    <input
      id="employmentIncome"
      :value="income"
      type="text"
      inputmode="decimal"
      pattern="[0-9]*\.?[0-9]*"
      class="input-field"
      :class="{ 'input-error-field': v$.income.$invalid }"
      :placeholder="employmentPlaceholder"
      :aria-label="t('calculator.inputs.employment.aria')"
      autocomplete="off"
      @input="setIncome"
      @keypress="preventInvalidInput"
      @paste="handlePaste"
    >
    <div
      v-if="v$.income.$invalid"
      class="input-error"
    >
      <template v-if="v$.income.minValue.$invalid">
        {{ t('calculator.validation.minValue') }}
      </template>
      <template v-else-if="v$.income.maxValue.$invalid">
        {{ t('calculator.validation.maxBillion') }}
      </template>
      <template v-else-if="v$.income.maxDecimalPlaces.$invalid">
        {{ t('calculator.validation.maxDecimal') }}
      </template>
      <template v-else>
        {{ t('calculator.validation.validNumber') }}
      </template>
    </div>
  </div>

  <!-- Tax Breakdown Popup -->
  <TaxBreakdownPopup
    v-model="showTaxBreakdownPopup"
    :tax-amount="netFederalTaxAnnual"
    @navigate="handleNavigateToBreakdown"
  />
</template>

<script setup>
/* eslint-disable */
import { ref, watch, computed } from 'vue'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { useSalaryStore } from '@/domains/calculator/store/salary.js'
import { storeToRefs } from 'pinia'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'
import { useTaxBreakdownPopup } from '@/utils/taxBreakdownPopup.js'
import TaxBreakdownPopup from '@/components/TaxBreakdownPopup.vue'
import { useI18n } from '@/i18n'

const calculatorStore = useCalculatorStore()
const salaryStore = useSalaryStore()
const { selectedSalaryRate } = storeToRefs(salaryStore)
const { income, selectedRegion, netFederalTaxAnnual } = storeToRefs(calculatorStore)
const { v$, sanitizeNumericInput } = useCalculator()
const { t } = useI18n()

const salaryKeyMap = {
  Annual: 'annual',
  Monthly: 'monthly',
  'Bi-weekly': 'biweekly',
  Weekly: 'weekly',
  Daily: 'daily',
  Hourly: 'hourly'
}

const salaryLabel = computed(() => {
  const key = salaryKeyMap[selectedSalaryRate.value]
  return key ? t(`calculator.salary.options.${key}`) : (selectedSalaryRate.value || '')
})

const employmentPlaceholder = computed(() => {
  const rate = salaryLabel.value ? salaryLabel.value.toLowerCase() : ''
  return t('calculator.inputs.employment.placeholder', { rate })
})

// Popup state
const showTaxBreakdownPopup = ref(false)

const popupUtils = useTaxBreakdownPopup()

// Watch for key calculator inputs to trigger popup
watch(
  [income, selectedRegion, netFederalTaxAnnual],
  ([newIncome, newRegion, newFederalTax], [, _prevRegion, prevFederalTax]) => {
    const incomeValue = Number(newIncome)
    const regionValue = typeof newRegion === 'string' ? newRegion.trim() : ''
    const federalTaxValue = Number(newFederalTax)

    if (!Number.isFinite(incomeValue) || incomeValue <= 0) {
      return
    }

    if (!regionValue) {
      return
    }

    // Check if region has been set (any non-empty value)
    const regionChanged = Boolean(regionValue)

    if (!Number.isFinite(federalTaxValue) || federalTaxValue <= 0) {
      return
    }

    if (!popupUtils.shouldShowPopup()) {
      return
    }

    const previousTax = Number(prevFederalTax)
    const taxChanged = !Number.isFinite(previousTax) || Math.abs(previousTax - federalTaxValue) > 0.009

    if (!taxChanged && !regionChanged) {
      return
    }

    setTimeout(() => {
      showTaxBreakdownPopup.value = true
      popupUtils.markPopupShown()
    }, 350)
  }
)

const preventInvalidInput = (event) => {
  const char = String.fromCharCode(event.keyCode);
  const pattern = /[0-9.]/;
  if (!pattern.test(char)) {
    event.preventDefault();
  }
  // Prevent multiple decimal points
  if (char === '.' && event.target.value.includes('.')) {
    event.preventDefault();
  }
}

const handlePaste = (event) => {
  event.preventDefault();
  const pastedText = event.clipboardData.getData('text');
  const sanitizedValue = sanitizeNumericInput(pastedText);
  if (sanitizedValue !== undefined) {
    calculatorStore.setIncome(sanitizedValue);
  }
}

const setIncome = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setIncome(sanitizedValue);
  } else {
    calculatorStore.setIncome(undefined);
  }
}

const handleNavigateToBreakdown = (targetTab = 'breakdown') => {
  popupUtils.navigateToTaxBreakdown(targetTab)
}
</script>

<style scoped>
.input-subgroup {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.6s ease-out forwards;
}

.input-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 1.1rem;
}

.input-field {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  color: #2c3e50;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.input-field:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  transform: translateY(-1px);
}

.input-field:hover {
  border-color: #3498db;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.input-error-field {
  border-color: #e53e3e;
  background: rgba(229, 62, 62, 0.05);
}

.input-error {
  margin-top: 0.5rem;
  color: #e53e3e;
  font-size: 0.875rem;
  padding: 0.5rem;
  background: rgba(229, 62, 62, 0.1);
  border-radius: 0.5rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
