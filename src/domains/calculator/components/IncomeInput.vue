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
      type="number"
      class="input-field"
      :class="{ 'input-error-field': v$.income.$invalid }"
      :placeholder="'Enter your ' + selectedSalaryRate.toLowerCase() + ' employment income'"
      aria-label="Employment Income"
      autocomplete="on"
      @input="setIncome"
    >
    <div
      v-if="v$.income.$invalid"
      class="input-error"
    >
      Value must be a number greater than 0
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
const { v$ } = useCalculator()

const setIncome = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      income.value = undefined
    } else {
      income.value = parseFloat($event.target.value)
    }
  } else {
    income.value = $event.target.value
  }
}
</script>

<style scoped>
.input-subgroup {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.input-error-field {
  border-color: #e53e3e;
}

.input-error {
  margin-top: 0.25rem;
  color: #e53e3e;
  font-size: 0.875rem;
}
</style> 