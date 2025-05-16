<template>
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
</template>

<script setup>
import { useCalculatorStore } from '@/domains/calculator/store/calculator';
import { storeToRefs } from 'pinia'
import { regions } from '../constants/taxData';

const calculatorStore = useCalculatorStore()
const { selectedRegion } = storeToRefs(calculatorStore)
</script>

<style scoped>
.select-region {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 1rem;
  color: #1a202c;
  transition: border-color 0.2s;
}

.select-region:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.select-region option {
  padding: 0.5rem;
}
</style> 