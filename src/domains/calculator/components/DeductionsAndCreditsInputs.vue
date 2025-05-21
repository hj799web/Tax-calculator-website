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