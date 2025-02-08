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
          v-model="v$.income.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.income.$invalid }"
          :placeholder="'Enter your ' + selectedSalaryRate.toLowerCase() + ' employment income'"
          aria-label="Employment Income"
          autocomplete="on"
        >
        {{ canCalculate }}
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
          v-model="v$.selfEmploymentIncome.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.selfEmploymentIncome.$invalid }"
          placeholder="Enter your self-employment income"
          aria-label="Self-Employment Income"
          autocomplete="on"
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
          v-model="v$.capitalGainsBeforeJune25.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.capitalGainsBeforeJune25.$invalid }"
          placeholder="Enter your capital gains before June 25, 2024"
          aria-label="Capital Gains Before June 25, 2024"
          autocomplete="on"
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
          v-model="v$.capitalGainsAfterJune25.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.capitalGainsAfterJune25.$invalid }"
          placeholder="Enter your capital gains on/after June 25, 2024"
          aria-label="Capital Gains On/After June 25, 2024"
          autocomplete="on"
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
          v-model="v$.eligibleDividends.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.eligibleDividends.$invalid }"
          placeholder="Enter your eligible dividends"
          aria-label="Eligible Dividends"
          autocomplete="on"
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
          v-model="v$.ineligibleDividends.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.ineligibleDividends.$invalid }"
          placeholder="Enter your ineligible dividends"
          aria-label="Ineligible Dividends"
          autocomplete="on"
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
          v-model="v$.otherIncome.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.otherIncome.$invalid }"
          placeholder="Enter your other income"
          aria-label="Other Income"
          autocomplete="on"
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
          v-model="v$.rrspDeduction.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.rrspDeduction.$invalid }"
          placeholder="Enter your RRSP deduction"
          aria-label="RRSP Deduction"
          autocomplete="on"
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
          v-model="v$.numberOfDependents.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.numberOfDependents.$invalid }"
          placeholder="Enter number of dependents"
          aria-label="Number of Dependents"
          autocomplete="on"
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
          v-model="v$.numberOfChildrenUnder18.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.numberOfChildrenUnder18.$invalid }"
          placeholder="Enter number of children under 18"
          aria-label="Number of Children Under 18"
          autocomplete="on"
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
          v-model="v$.numberOfDependentsWithDisabilities.$model"
          class="input-field"
          :class="{ 'input-error-field': v$.numberOfDependentsWithDisabilities.$invalid }"
          placeholder="Enter number of dependents with disabilities"
          aria-label="Dependents with Disabilities"
          autocomplete="on"
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

const { v$, canCalculate } = useCalculator()

const {
  selectedRegion,
  maritalStatus,
} = storeToRefs(calculatorStore);

</script>

<style lang="css" scoped>
.input-error {
  color: red;
}

.input-error-field {
  background-color: #ffa4a4;
}
</style>