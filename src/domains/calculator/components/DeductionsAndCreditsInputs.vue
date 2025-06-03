<template>
  <div class="input-group deductions-credits">
    <div class="input-subgroup">
      <label
        class="input-label"
        for="rrspDeduction"
      >
        RRSP Deduction
      </label>
      <input
        id="rrspDeduction"
        :value="rrspDeduction"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*\.?[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.rrspDeduction.$invalid }"
        placeholder="Enter your RRSP deduction"
        aria-label="RRSP Deduction"
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
          Value must be greater than 0
        </template>
        <template v-else-if="v$.rrspDeduction.maxValue.$invalid">
          Value cannot exceed $29,210 (2024 RRSP limit)
        </template>
        <template v-else-if="v$.rrspDeduction.maxDecimalPlaces.$invalid">
          Maximum 2 decimal places allowed
        </template>
        <template v-else>
          Please enter a valid number
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="maritalStatus"
      >
        Marital Status
      </label>
      <select
        id="maritalStatus"
        v-model="maritalStatus"
        class="input-field"
        aria-label="Select Marital Status"
      >
        <option
          disabled
          value=""
          style="font-style: italic;"
        >
          Select Marital Status
        </option>
        <option>Single</option>
        <option>Married or Common-Law</option>
        <option>Separated</option>
        <option>Divorced</option>
        <option>Widowed</option>
      </select>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="numberOfDependents"
      >
        Number of Dependents
      </label>
      <input
        id="numberOfDependents"
        :value="numberOfDependents"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfDependents.$invalid }"
        placeholder="Enter number of dependents"
        aria-label="Number of Dependents"
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
          Value must be greater than 0
        </template>
        <template v-else-if="v$.numberOfDependents.maxValue.$invalid">
          Value cannot exceed 20
        </template>
        <template v-else-if="v$.numberOfDependents.maxDecimalPlaces.$invalid">
          Must be a whole number
        </template>
        <template v-else>
          Please enter a valid number
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="numberOfChildrenUnder18"
      >
        Number of Children Under 18
      </label>
      <input
        id="numberOfChildrenUnder18"
        :value="numberOfChildrenUnder18"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfChildrenUnder18.$invalid }"
        placeholder="Enter number of children under 18"
        aria-label="Number of Children Under 18"
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
          Value must be greater than 0
        </template>
        <template v-else-if="v$.numberOfChildrenUnder18.maxValue.$invalid">
          Value cannot exceed 20
        </template>
        <template v-else-if="v$.numberOfChildrenUnder18.maxDecimalPlaces.$invalid">
          Must be a whole number
        </template>
        <template v-else>
          Please enter a valid number
        </template>
      </div>
    </div>

    <div class="input-subgroup">
      <label
        class="input-label"
        for="numberOfDependentsWithDisabilities"
      >
        Dependents with Disabilities
      </label>
      <input
        id="numberOfDependentsWithDisabilities"
        :value="numberOfDependentsWithDisabilities"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfDependentsWithDisabilities.$invalid }"
        placeholder="Enter number of dependents with disabilities"
        aria-label="Dependents with Disabilities"
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
          Value must be greater than 0
        </template>
        <template v-else-if="v$.numberOfDependentsWithDisabilities.maxValue.$invalid">
          Value cannot exceed 20
        </template>
        <template v-else-if="v$.numberOfDependentsWithDisabilities.maxDecimalPlaces.$invalid">
          Must be a whole number
        </template>
        <template v-else>
          Please enter a valid number
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '@/domains/calculator/store/calculator.js'
import { storeToRefs } from 'pinia'
import { useCalculator } from '@/domains/calculator/composables/calculator.js'

const calculatorStore = useCalculatorStore()
const { v$, sanitizeNumericInput } = useCalculator()

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
    rrspDeduction.value = sanitizedValue;
  } else {
    rrspDeduction.value = undefined;
  }
}

const setNumberOfDependents = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    numberOfDependents.value = sanitizedValue;
  } else {
    numberOfDependents.value = undefined;
  }
}

const setNumberOfChildrenUnder18 = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    numberOfChildrenUnder18.value = sanitizedValue;
  } else {
    numberOfChildrenUnder18.value = undefined;
  }
}

const setNumberOfDependentsWithDisabilities = ($event) => {
  const sanitizedValue = sanitizeNumericInput($event.target.value);
  if (sanitizedValue !== undefined) {
    numberOfDependentsWithDisabilities.value = sanitizedValue;
  } else {
    numberOfDependentsWithDisabilities.value = undefined;
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