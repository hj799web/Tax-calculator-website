<template>
  <div class="input-group additional-income">
    <div class="input-subgroup">
      <label
        class="input-label"
        for="selfEmploymentIncome"
      >
        {{ t('calculator.inputs.additionalIncome.selfEmployment.label') }}
      </label>
      <input
        id="selfEmploymentIncome"
        :value="selfEmploymentIncome"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.selfEmploymentIncome.$invalid }"
        :placeholder="t('calculator.inputs.additionalIncome.selfEmployment.placeholder')"
        :aria-label="t('calculator.inputs.additionalIncome.selfEmployment.aria')"
        autocomplete="off"
        @input="setSelfEmploymentIncome"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.selfEmploymentIncome.$invalid"
        class="input-error"
      >
        <template v-if="v$.selfEmploymentIncome.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.selfEmploymentIncome.maxValue.$invalid">
          {{ t('calculator.validation.maxBillion') }}
        </template>
        <template v-else-if="v$.selfEmploymentIncome.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.maxDecimal') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="capitalGainsBeforeJune25"
      >
        {{ t('calculator.inputs.additionalIncome.capitalGainsBefore.label') }}
      </label>
      <input
        id="capitalGainsBeforeJune25"
        :value="capitalGainsBeforeJune25"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.capitalGainsBeforeJune25.$invalid }"
        :placeholder="t('calculator.inputs.additionalIncome.capitalGainsBefore.placeholder')"
        :aria-label="t('calculator.inputs.additionalIncome.capitalGainsBefore.aria')"
        autocomplete="off"
        @input="setCapitalGainsBeforeJune25"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.capitalGainsBeforeJune25.$invalid"
        class="input-error"
      >
        <template v-if="v$.capitalGainsBeforeJune25.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.capitalGainsBeforeJune25.maxValue.$invalid">
          {{ t('calculator.validation.maxBillion') }}
        </template>
        <template v-else-if="v$.capitalGainsBeforeJune25.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.maxDecimal') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="capitalGainsAfterJune25"
      >
        {{ t('calculator.inputs.additionalIncome.capitalGainsAfter.label') }}
      </label>
      <input
        id="capitalGainsAfterJune25"
        :value="capitalGainsAfterJune25"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.capitalGainsAfterJune25.$invalid }"
        :placeholder="t('calculator.inputs.additionalIncome.capitalGainsAfter.placeholder')"
        :aria-label="t('calculator.inputs.additionalIncome.capitalGainsAfter.aria')"
        autocomplete="off"
        @input="setCapitalGainsAfterJune25"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.capitalGainsAfterJune25.$invalid"
        class="input-error"
      >
        <template v-if="v$.capitalGainsAfterJune25.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.capitalGainsAfterJune25.maxValue.$invalid">
          {{ t('calculator.validation.maxBillion') }}
        </template>
        <template v-else-if="v$.capitalGainsAfterJune25.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.maxDecimal') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="eligibleDividends"
      >
        {{ t('calculator.inputs.additionalIncome.eligibleDividends.label') }}
      </label>
      <input
        id="eligibleDividends"
        :value="eligibleDividends"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.eligibleDividends.$invalid }"
        :placeholder="t('calculator.inputs.additionalIncome.eligibleDividends.placeholder')"
        :aria-label="t('calculator.inputs.additionalIncome.eligibleDividends.aria')"
        autocomplete="off"
        @input="setEligibleDividends"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.eligibleDividends.$invalid"
        class="input-error"
      >
        <template v-if="v$.eligibleDividends.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.eligibleDividends.maxValue.$invalid">
          {{ t('calculator.validation.maxBillion') }}
        </template>
        <template v-else-if="v$.eligibleDividends.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.maxDecimal') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="ineligibleDividends"
      >
        {{ t('calculator.inputs.additionalIncome.ineligibleDividends.label') }}
      </label>
      <input
        id="ineligibleDividends"
        :value="ineligibleDividends"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.ineligibleDividends.$invalid }"
        :placeholder="t('calculator.inputs.additionalIncome.ineligibleDividends.placeholder')"
        :aria-label="t('calculator.inputs.additionalIncome.ineligibleDividends.aria')"
        autocomplete="off"
        @input="setIneligibleDividends"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.ineligibleDividends.$invalid"
        class="input-error"
      >
        <template v-if="v$.ineligibleDividends.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.ineligibleDividends.maxValue.$invalid">
          {{ t('calculator.validation.maxBillion') }}
        </template>
        <template v-else-if="v$.ineligibleDividends.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.maxDecimal') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="otherIncome"
      >
        {{ t('calculator.inputs.additionalIncome.otherIncome.label') }}
      </label>
      <input
        id="otherIncome"
        :value="otherIncome"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.otherIncome.$invalid }"
        :placeholder="t('calculator.inputs.additionalIncome.otherIncome.placeholder')"
        :aria-label="t('calculator.inputs.additionalIncome.otherIncome.aria')"
        autocomplete="off"
        @input="setOtherIncome"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.otherIncome.$invalid"
        class="input-error"
      >
        <template v-if="v$.otherIncome.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.otherIncome.maxValue.$invalid">
          {{ t('calculator.validation.maxBillion') }}
        </template>
        <template v-else-if="v$.otherIncome.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.maxDecimal') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { storeToRefs } from 'pinia'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'
import { useI18n } from '@/i18n'

const calculatorStore = useCalculatorStore()
const { v$, sanitizeNumericInput } = useCalculator()

const { t } = useI18n()

const {
  selfEmploymentIncome,
  capitalGainsBeforeJune25,
  capitalGainsAfterJune25,
  eligibleDividends,
  ineligibleDividends,
  otherIncome
} = storeToRefs(calculatorStore)

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

const handlePaste = (event, target) => {
  event.preventDefault();
  const pastedText = event.clipboardData.getData('text');
  const sanitizedValue = sanitizeNumericInput(pastedText);
  if (sanitizedValue !== undefined) {
    target.value = sanitizedValue;
  }
}

const setSelfEmploymentIncome = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setSelfEmploymentIncome(sanitizedValue);
  } else {
    calculatorStore.setSelfEmploymentIncome(undefined);
  }
}

const setCapitalGainsBeforeJune25 = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setCapitalGainsBeforeJune25(sanitizedValue);
  } else {
    calculatorStore.setCapitalGainsBeforeJune25(undefined);
  }
}

const setCapitalGainsAfterJune25 = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setCapitalGainsAfterJune25(sanitizedValue);
  } else {
    calculatorStore.setCapitalGainsAfterJune25(undefined);
  }
}

const setEligibleDividends = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setEligibleDividends(sanitizedValue);
  } else {
    calculatorStore.setEligibleDividends(undefined);
  }
}

const setIneligibleDividends = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setIneligibleDividends(sanitizedValue);
  } else {
    calculatorStore.setIneligibleDividends(undefined);
  }
}

const setOtherIncome = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setOtherIncome(sanitizedValue);
  } else {
    calculatorStore.setOtherIncome(undefined);
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
