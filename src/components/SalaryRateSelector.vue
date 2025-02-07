<template>
  <section class="salary-selector-section">
    <h3 class="section-title">
      Salary Rate Selector
    </h3>
    <div class="salary-selector-wrapper">
      <div class="salary-selector">
        <div
          v-for="option in salaryOptions"
          :key="option.value"
          :class="['salary-option', { active: selectedSalaryRate === option.value }]"
          role="button"
          tabindex="0"
          :aria-pressed="selectedSalaryRate === option.value"
          :aria-label="'Select ' + option.label + ' salary rate'"
          @click="selectSalaryRate(option.value)"
          @keydown.enter.prevent="selectSalaryRate(option.value)"
          @keydown.space.prevent="selectSalaryRate(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSalaryStore } from '../stores/salary'
import { salaryOptions } from '../constants.js'
import { storeToRefs } from 'pinia';

const salaryStore = useSalaryStore();

const { selectSalaryRate } = salaryStore;
const { selectedSalaryRate } = storeToRefs(salaryStore);
</script>