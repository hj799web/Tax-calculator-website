/* eslint-disable */
<template>
  <select
    v-model="selectedRegion"
    class="select-region"
    :aria-label="t('calculator.regionSelector.aria')"
  >
    <option
      disabled
      value=""
      style="font-style: italic;"
    >
      {{ t('calculator.regionSelector.placeholder') }}
    </option>
    <option
      v-for="option in regionOptions"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup>
import { useCalculatorStore } from '@/domains/calculator/store/calculator';
import { storeToRefs } from 'pinia'
import { regions } from '../constants/taxData';
import { computed } from 'vue'
import { useI18n } from '@/i18n'

const calculatorStore = useCalculatorStore()
const { selectedRegion } = storeToRefs(calculatorStore)

const { t } = useI18n()

const provinceCodeMap = {
  'Alberta': 'AB',
  'British Columbia': 'BC',
  'Manitoba': 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  'Ontario': 'ON',
  'Prince Edward Island': 'PE',
  'Quebec': 'QC',
  'Saskatchewan': 'SK',
  'Northwest Territories': 'NT',
  'Nunavut': 'NU',
  'Yukon': 'YT'
}

const regionOptions = computed(() =>
  regions.map((region) => ({
    value: region,
    label: t(`calculator.regionSelector.options.${provinceCodeMap[region] ?? region}`)
  }))
)
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
