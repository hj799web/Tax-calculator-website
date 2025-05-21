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
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.select-region:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  transform: translateY(-1px);
}

.select-region:hover {
  border-color: #3498db;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.select-region option {
  padding: 0.75rem;
  background: white;
  color: #2c3e50;
}
</style> 