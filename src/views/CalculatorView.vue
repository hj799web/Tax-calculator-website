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
      <input
        v-model.number="income"
        class="input-field"
        :placeholder="'Enter your ' + selectedSalaryRate.toLowerCase() + ' employment income'"
        type="number"
        min="0"
        aria-label="Employment Income"
        autocomplete="on"
      >
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
          v-model.number="selfEmploymentIncome"
          class="input-field"
          placeholder="Enter your self-employment income"
          type="number"
          min="0"
          aria-label="Self-Employment Income"
          autocomplete="on"
        >
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
          v-model.number="capitalGainsBeforeJune25"
          class="input-field"
          placeholder="Enter your capital gains before June 25, 2024"
          type="number"
          min="0"
          aria-label="Capital Gains Before June 25, 2024"
          autocomplete="on"
        >
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
          v-model.number="capitalGainsAfterJune25"
          class="input-field"
          placeholder="Enter your capital gains on/after June 25, 2024"
          type="number"
          min="0"
          aria-label="Capital Gains On/After June 25, 2024"
          autocomplete="on"
        >
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
          v-model.number="eligibleDividends"
          class="input-field"
          placeholder="Enter your eligible dividends"
          type="number"
          min="0"
          aria-label="Eligible Dividends"
          autocomplete="on"
        >
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
          v-model.number="ineligibleDividends"
          class="input-field"
          placeholder="Enter your ineligible dividends"
          type="number"
          min="0"
          aria-label="Ineligible Dividends"
          autocomplete="on"
        >
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
          v-model.number="otherIncome"
          class="input-field"
          placeholder="Enter your other income"
          type="number"
          min="0"
          aria-label="Other Income"
          autocomplete="on"
        >
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
          v-model.number="rrspDeduction"
          class="input-field"
          placeholder="Enter your RRSP deduction"
          type="number"
          min="0"
          aria-label="RRSP Deduction"
          autocomplete="on"
        >
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
          v-model.number="numberOfDependents"
          class="input-field"
          placeholder="Enter number of dependents"
          type="number"
          min="0"
          aria-label="Number of Dependents"
          autocomplete="on"
        >
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
          v-model.number="numberOfChildrenUnder18"
          class="input-field"
          placeholder="Enter number of children under 18"
          type="number"
          min="0"
          aria-label="Number of Children Under 18"
          autocomplete="on"
        >
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
          v-model.number="numberOfDependentsWithDisabilities"
          class="input-field"
          placeholder="Enter number of dependents with disabilities"
          type="number"
          min="0"
          aria-label="Dependents with Disabilities"
          autocomplete="on"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '../stores/calculator.js'
import { useSalaryStore } from '../stores/salary.js'
import { regions } from '../constants.js'
import { storeToRefs } from 'pinia';

const calculatorStore = useCalculatorStore();
const { selectedSalaryRate } = storeToRefs(useSalaryStore())

const {
  selectedRegion,
  income,
  selfEmploymentIncome,
  capitalGainsBeforeJune25,
  capitalGainsAfterJune25,
  eligibleDividends,
  ineligibleDividends,
  otherIncome,
  rrspDeduction,
  maritalStatus,
  numberOfDependents,
  numberOfChildrenUnder18,
  numberOfDependentsWithDisabilities
} = storeToRefs(calculatorStore);
</script>