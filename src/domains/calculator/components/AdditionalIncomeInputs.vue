<template>
  <div class="input-group additional-income">
    <div class="input-subgroup">
      <label
        class="input-label"
        for="selfEmploymentIncome"
      >
        Self-Employment Income
      </label>
      <input
        id="selfEmploymentIncome"
        :value="selfEmploymentIncome"
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.selfEmploymentIncome.$invalid }"
        placeholder="Enter your self-employment income"
        aria-label="Self-Employment Income"
        autocomplete="on"
        @input="setSelfEmploymentIncome"
      >
      <div
        v-if="v$.selfEmploymentIncome.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="capitalGainsBeforeJune25"
      >
        Capital Gains Before June 25, 2024
      </label>
      <input
        id="capitalGainsBeforeJune25"
        :value="capitalGainsBeforeJune25"
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.capitalGainsBeforeJune25.$invalid }"
        placeholder="Enter your capital gains before June 25, 2024"
        aria-label="Capital Gains Before June 25, 2024"
        autocomplete="on"
        @input="setCapitalGainsBeforeJune25"
      >
      <div
        v-if="v$.capitalGainsBeforeJune25.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="capitalGainsAfterJune25"
      >
        Capital Gains On/After June 25, 2024
      </label>
      <input
        id="capitalGainsAfterJune25"
        :value="capitalGainsAfterJune25"
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.capitalGainsAfterJune25.$invalid }"
        placeholder="Enter your capital gains on/after June 25, 2024"
        aria-label="Capital Gains On/After June 25, 2024"
        autocomplete="on"
        @input="setCapitalGainsAfterJune25"
      >
      <div
        v-if="v$.capitalGainsAfterJune25.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="eligibleDividends"
      >
        Eligible Dividends
      </label>
      <input
        id="eligibleDividends"
        :value="eligibleDividends"
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.eligibleDividends.$invalid }"
        placeholder="Enter your eligible dividends"
        aria-label="Eligible Dividends"
        autocomplete="on"
        @input="setEligibleDividends"
      >
      <div
        v-if="v$.eligibleDividends.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="ineligibleDividends"
      >
        Ineligible Dividends
      </label>
      <input
        id="ineligibleDividends"
        :value="ineligibleDividends"
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.ineligibleDividends.$invalid }"
        placeholder="Enter your ineligible dividends"
        aria-label="Ineligible Dividends"
        autocomplete="on"
        @input="setIneligibleDividends"
      >
      <div
        v-if="v$.ineligibleDividends.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="otherIncome"
      >
        Other Income
      </label>
      <input
        id="otherIncome"
        :value="otherIncome"
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.otherIncome.$invalid }"
        placeholder="Enter your other income"
        aria-label="Other Income"
        autocomplete="on"
        @input="setOtherIncome"
      >
      <div
        v-if="v$.otherIncome.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { storeToRefs } from 'pinia'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'

const calculatorStore = useCalculatorStore()
const { v$ } = useCalculator()

const {
  selfEmploymentIncome,
  capitalGainsBeforeJune25,
  capitalGainsAfterJune25,
  eligibleDividends,
  ineligibleDividends,
  otherIncome
} = storeToRefs(calculatorStore)

const setSelfEmploymentIncome = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      selfEmploymentIncome.value = undefined
    } else {
      selfEmploymentIncome.value = parseFloat($event.target.value)
    }
  } else {
    selfEmploymentIncome.value = $event.target.value
  }
}

const setCapitalGainsBeforeJune25 = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      capitalGainsBeforeJune25.value = undefined
    } else {
      capitalGainsBeforeJune25.value = parseFloat($event.target.value)
    }
  } else {
    capitalGainsBeforeJune25.value = $event.target.value
  }
}

const setCapitalGainsAfterJune25 = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      capitalGainsAfterJune25.value = undefined
    } else {
      capitalGainsAfterJune25.value = parseFloat($event.target.value)
    }
  } else {
    capitalGainsAfterJune25.value = $event.target.value
  }
}

const setEligibleDividends = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      eligibleDividends.value = undefined
    } else {
      eligibleDividends.value = parseFloat($event.target.value)
    }
  } else {
    eligibleDividends.value = $event.target.value
  }
}

const setIneligibleDividends = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      ineligibleDividends.value = undefined
    } else {
      ineligibleDividends.value = parseFloat($event.target.value)
    }
  } else {
    ineligibleDividends.value = $event.target.value
  }
}

const setOtherIncome = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      otherIncome.value = undefined
    } else {
      otherIncome.value = parseFloat($event.target.value)
    }
  } else {
    otherIncome.value = $event.target.value
  }
}
</script>

<style scoped>
.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out forwards;
}

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