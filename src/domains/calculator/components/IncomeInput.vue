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
</template>

<script setup>
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { useSalaryStore } from '@/domains/calculator/store/salary.js'
import { storeToRefs } from 'pinia'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'

const calculatorStore = useCalculatorStore()
const salaryStore = useSalaryStore()
const { selectedSalaryRate } = storeToRefs(salaryStore)
const { income } = storeToRefs(calculatorStore)
const { v$, sanitizeNumericInput } = useCalculator()

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
    income.value = sanitizedValue;
  }
}

const setIncome = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    income.value = sanitizedValue;
  } else {
    income.value = undefined;
  }
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