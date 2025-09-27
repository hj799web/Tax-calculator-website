<template>
  <div class="input-group deductions-credits">
    <div class="input-subgroup">
      <label
        class="input-label"
        for="rrspDeduction"
      >
        {{ t('calculator.inputs.deductions.rrsp.label') }}
      </label>
      <input
        id="rrspDeduction"
        :value="rrspDeduction"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.rrspDeduction.$invalid }"
        :placeholder="t('calculator.inputs.deductions.rrsp.placeholder')"
        :aria-label="t('calculator.inputs.deductions.rrsp.aria')"
        autocomplete="off"
        @input="setRrspDeduction"
        @keypress="preventInvalidInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.rrspDeduction.$invalid"
        class="input-error"
      >
        <template v-if="v$.rrspDeduction.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.rrspDeduction.maxValue.$invalid">
          {{ t('calculator.validation.rrspLimit') }}
        </template>
        <template v-else-if="v$.rrspDeduction.maxDecimalPlaces.$invalid">
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
        for="maritalStatus"
      >
        {{ t('calculator.inputs.deductions.maritalStatus.label') }}
      </label>
      <select
        id="maritalStatus"
        v-model="maritalStatus"
        class="input-field"
        :aria-label="t('calculator.inputs.deductions.maritalStatus.aria')"
      >
        <option
          disabled
          value=""
          style="font-style: italic;"
        >
          {{ t('calculator.inputs.deductions.maritalStatus.placeholder') }}
        </option>
        <option value="single">{{ t('calculator.inputs.deductions.maritalStatus.options.single') }}</option>
        <option value="married">{{ t('calculator.inputs.deductions.maritalStatus.options.married') }}</option>
        <option value="separated">{{ t('calculator.inputs.deductions.maritalStatus.options.separated') }}</option>
        <option value="divorced">{{ t('calculator.inputs.deductions.maritalStatus.options.divorced') }}</option>
        <option value="widowed">{{ t('calculator.inputs.deductions.maritalStatus.options.widowed') }}</option>
      </select>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="numberOfDependents"
      >
        {{ t('calculator.inputs.deductions.dependents.label') }}
      </label>
      <input
        id="numberOfDependents"
        :value="numberOfDependents"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfDependents.$invalid }"
        :placeholder="t('calculator.inputs.deductions.dependents.placeholder')"
        :aria-label="t('calculator.inputs.deductions.dependents.aria')"
        autocomplete="off"
        @input="setNumberOfDependents"
        @keypress="preventWholeNumberInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.numberOfDependents.$invalid"
        class="input-error"
      >
        <template v-if="v$.numberOfDependents.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.numberOfDependents.maxValue.$invalid">
          {{ t('calculator.validation.dependentsLimit') }}
        </template>
        <template v-else-if="v$.numberOfDependents.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.wholeNumber') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="numberOfChildrenUnder18"
      >
        {{ t('calculator.inputs.deductions.children.label') }}
      </label>
      <input
        id="numberOfChildrenUnder18"
        :value="numberOfChildrenUnder18"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfChildrenUnder18.$invalid }"
        :placeholder="t('calculator.inputs.deductions.children.placeholder')"
        :aria-label="t('calculator.inputs.deductions.children.aria')"
        autocomplete="off"
        @input="setNumberOfChildrenUnder18"
        @keypress="preventWholeNumberInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.numberOfChildrenUnder18.$invalid"
        class="input-error"
      >
        <template v-if="v$.numberOfChildrenUnder18.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.numberOfChildrenUnder18.maxValue.$invalid">
          {{ t('calculator.validation.dependentsLimit') }}
        </template>
        <template v-else-if="v$.numberOfChildrenUnder18.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.wholeNumber') }}
        </template>
        <template v-else>
          {{ t('calculator.validation.validNumber') }}
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="numberOfDependentsWithDisabilities"
      >
        {{ t('calculator.inputs.deductions.dependentsDisability.label') }}
      </label>
      <input
        id="numberOfDependentsWithDisabilities"
        :value="numberOfDependentsWithDisabilities"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfDependentsWithDisabilities.$invalid }"
        :placeholder="t('calculator.inputs.deductions.dependentsDisability.placeholder')"
        :aria-label="t('calculator.inputs.deductions.dependentsDisability.aria')"
        autocomplete="off"
        @input="setNumberOfDependentsWithDisabilities"
        @keypress="preventWholeNumberInput"
        @paste="handlePaste"
      >
      <div
        v-if="v$.numberOfDependentsWithDisabilities.$invalid"
        class="input-error"
      >
        <template v-if="v$.numberOfDependentsWithDisabilities.minValue.$invalid">
          {{ t('calculator.validation.minValue') }}
        </template>
        <template v-else-if="v$.numberOfDependentsWithDisabilities.maxValue.$invalid">
          {{ t('calculator.validation.dependentsLimit') }}
        </template>
        <template v-else-if="v$.numberOfDependentsWithDisabilities.maxDecimalPlaces.$invalid">
          {{ t('calculator.validation.wholeNumber') }}
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
  maritalStatus,
  rrspDeduction,
  numberOfDependents,
  numberOfChildrenUnder18,
  numberOfDependentsWithDisabilities
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

const preventWholeNumberInput = (event) => {
  const char = String.fromCharCode(event.keyCode);
  const pattern = /[0-9]/;
  if (!pattern.test(char)) {
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

const setRrspDeduction = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setRrspDeduction(sanitizedValue);
  } else {
    calculatorStore.setRrspDeduction(undefined);
  }
}

const setNumberOfDependents = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setNumberOfDependents(sanitizedValue);
  } else {
    calculatorStore.setNumberOfDependents(undefined);
  }
}

const setNumberOfChildrenUnder18 = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setNumberOfChildrenUnder18(sanitizedValue);
  } else {
    calculatorStore.setNumberOfChildrenUnder18(undefined);
  }
}

const setNumberOfDependentsWithDisabilities = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    calculatorStore.setNumberOfDependentsWithDisabilities(sanitizedValue);
  } else {
    calculatorStore.setNumberOfDependentsWithDisabilities(undefined);
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
