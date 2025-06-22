<template>
  <div class="input-subgroup">
    <label
      class="input-label"
      for="employmentIncome"
    >
      Employment Income
    </label>
    <input
      id="employmentIncome"
      :value="income"
      type="text"
      inputmode="decimal"
      pattern="[0-9]*\.?[0-9]*"
      class="input-field"
      :class="{ 'input-error-field': v$.income.$invalid }"
      :placeholder="'Enter your ' + selectedSalaryRate.toLowerCase() + ' employment income'"
      aria-label="Employment Income"
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
        Value must be greater than 0
      </template>
      <template v-else-if="v$.income.maxValue.$invalid">
        Value cannot exceed $1 billion
      </template>
      <template v-else-if="v$.income.maxDecimalPlaces.$invalid">
        Maximum 2 decimal places allowed
      </template>
      <template v-else>
        Please enter a valid number
      </template>
    </div>
  </div>

  <!-- Tax Breakdown Popup -->
  <TaxBreakdownPopup
    v-model="showTaxBreakdownPopup"
    @navigate="handleNavigateToBreakdown"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { useSalaryStore } from '@/domains/calculator/store/salary.js'
import { storeToRefs } from 'pinia'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'
import { useTaxBreakdownPopup } from '@/utils/taxBreakdownPopup.js'
import TaxBreakdownPopup from '@/components/TaxBreakdownPopup.vue'

const calculatorStore = useCalculatorStore()
const salaryStore = useSalaryStore()
const { selectedSalaryRate } = storeToRefs(salaryStore)
const { income } = storeToRefs(calculatorStore)
const { v$, sanitizeNumericInput } = useCalculator()

// Popup state
const showTaxBreakdownPopup = ref(false)
const hasShownPopup = ref(false)

const popupUtils = useTaxBreakdownPopup()

// Watch for income changes to trigger popup
watch(income, (newIncome, oldIncome) => {
  console.log('Income changed:', { newIncome, oldIncome, hasShownPopup: hasShownPopup.value })
  console.log('Should show popup:', popupUtils.shouldShowPopup())
  
  // TEMPORARY: Force show notification for testing
  if (newIncome && newIncome > 0) {
    console.log('Forcing notification to show for testing')
    setTimeout(() => {
      showTaxBreakdownPopup.value = true
      console.log('Notification should be visible now')
    }, 1000)
    return
  }
  
  // Only show popup if:
  // 1. User hasn't seen it yet in this session
  // 2. Income changed from empty/undefined to a valid number
  // 3. Popup should be shown according to storage preferences
  if (
    !hasShownPopup.value &&
    popupUtils.shouldShowPopup() &&
    (!oldIncome || oldIncome === 0) &&
    newIncome && newIncome > 0
  ) {
    // Small delay to ensure the input is processed
    setTimeout(() => {
      showTaxBreakdownPopup.value = true
      hasShownPopup.value = true
      popupUtils.markPopupShown()
    }, 500)
  }
})

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

const handleNavigateToBreakdown = () => {
  popupUtils.navigateToTaxBreakdown()
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