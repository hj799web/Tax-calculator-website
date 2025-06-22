import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { createValidatedAction } from '@/utils/storeActionWrapper.js';

export const useYearStore = defineStore('year', () => {
  // Available tax years
  const taxYears = [
    { id: '2023', label: '2022-2023' },
    { id: '2024', label: '2023-2024' },
    { id: '2025', label: '2024-2025' }
  ];
  
  // Default to 2023
  const selectedTaxYear = ref('2023');
  
  // Computed property to determine which budget data to use
  const budgetYear = computed(() => {
    // 2022 and 2023 use the same 2022-2023 budget data
    return selectedTaxYear.value === '2024' ? '2023-2024' : '2022-2023';
  });
  
  // Function to change the selected year
  const setSelectedTaxYear = createValidatedAction('year', 'selectedTaxYear', function(year) {
    selectedTaxYear.value = year;
  });
  
  return {
    taxYears,
    selectedTaxYear,
    budgetYear,
    setSelectedTaxYear
  };
});
