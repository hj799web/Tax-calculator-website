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
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.rrspDeduction.$invalid }"
        placeholder="Enter your RRSP deduction"
        aria-label="RRSP Deduction"
        autocomplete="on"
        @input="setRrspDeduction"
      >
      <div
        v-if="v$.rrspDeduction.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
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
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfDependents.$invalid }"
        placeholder="Enter number of dependents"
        aria-label="Number of Dependents"
        autocomplete="on"
        @input="setNumberOfDependents"
      >
      <div
        v-if="v$.numberOfDependents.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
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
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfChildrenUnder18.$invalid }"
        placeholder="Enter number of children under 18"
        aria-label="Number of Children Under 18"
        autocomplete="on"
        @input="setNumberOfChildrenUnder18"
      >
      <div
        v-if="v$.numberOfChildrenUnder18.$invalid"
        class="input-error"
      >
        Value must be a number greater than 0
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
        type="number"
        class="input-field"
        :class="{ 'input-error-field': v$.numberOfDependentsWithDisabilities.$invalid }"
        placeholder="Enter number of dependents with disabilities"
        aria-label="Dependents with Disabilities"
        autocomplete="on"
        @input="setNumberOfDependentsWithDisabilities"
      >
      <div
        v-if="v$.numberOfDependentsWithDisabilities.$invalid"
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
  maritalStatus,
  rrspDeduction,
  numberOfDependents,
  numberOfChildrenUnder18,
  numberOfDependentsWithDisabilities
} = storeToRefs(calculatorStore)

const setRrspDeduction = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      rrspDeduction.value = undefined
    } else {
      rrspDeduction.value = parseFloat($event.target.value)
    }
  } else {
    rrspDeduction.value = $event.target.value
  }
}

const setNumberOfDependents = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      numberOfDependents.value = undefined
    } else {
      numberOfDependents.value = parseFloat($event.target.value)
    }
  } else {
    numberOfDependents.value = $event.target.value
  }
}

const setNumberOfChildrenUnder18 = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      numberOfChildrenUnder18.value = undefined
    } else {
      numberOfChildrenUnder18.value = parseFloat($event.target.value)
    }
  } else {
    numberOfChildrenUnder18.value = $event.target.value
  }
}

const setNumberOfDependentsWithDisabilities = ($event) => {
  if ($event.target.validity.valid) {
    if ($event.target.value.length === 0) {
      numberOfDependentsWithDisabilities.value = undefined
    } else {
      numberOfDependentsWithDisabilities.value = parseFloat($event.target.value)
    }
  } else {
    numberOfDependentsWithDisabilities.value = $event.target.value
  }
}
</script>

<style scoped>
.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

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