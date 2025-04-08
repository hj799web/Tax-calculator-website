<template>
  <!-- Calculator Container -->
  <div class="calculator-container">
    <h2 class="title">
      Estimate Your Taxes
    </h2>
    <p class="description">
      Calculate your federal and provincial taxes to estimate your net
      income.
    </p>
    
    <!-- Budget Simulator Button -->
    <div class="simulator-button-container text-center mb-6">
      <router-link to="/simulator" class="simulator-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center">
        <span class="mr-2">🏛️</span> Try the Budget Simulator
      </router-link>
    </div>

    <!-- Inputs -->
    <div class="input-group">
      <!-- Select Province or Territory -->
      <select
        v-model="selectedRegion"
        class="select-region"
        aria-label="Select Province or Territory"
      >
        <option
          disabled
          value=""
          style="font-style: italic;"
        >
          Select Your Province or Territory
        </option>
        <option
          v-for="region in regions"
          :key="region"
        >
          {{ region }}
        </option>
      </select>

      <!-- Employment Income Input -->
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
    </div>

    <!-- Additional Income Sources -->
    <h3 class="section-title">
      Additional Income Sources
    </h3>
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

    <!-- Deductions and Credits -->
    <h3 class="section-title">
      Deductions and Credits
    </h3>
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

      <!-- Marital Status -->
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

      <!-- Number of Dependents -->
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

      <!-- Number of Children Under 18 -->
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

      <!-- Dependents with Disabilities -->
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
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculator.js'
import { useSalaryStore } from '../stores/salary.js'
import { regions } from '../constants.js'
import { storeToRefs } from 'pinia';
import { useCalculator } from '../composables/calculator.js'

const calculatorStore = useCalculatorStore();
const { selectedSalaryRate } = storeToRefs(useSalaryStore())

const { v$ } = useCalculator()

const {
  selectedRegion,
  maritalStatus,
  income,
  selfEmploymentIncome,
  capitalGainsBeforeJune25,
  capitalGainsAfterJune25,
  eligibleDividends,
  ineligibleDividends,
  otherIncome,
  rrspDeduction,
  numberOfDependents,
  numberOfChildrenUnder18,
  numberOfDependentsWithDisabilities
} = storeToRefs(calculatorStore);

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

<style lang="css" scoped>
.input-error {
  color: red;
}

.input-error-field {
  background-color: #ffa4a4;
}
</style>