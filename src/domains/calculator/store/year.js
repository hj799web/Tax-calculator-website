import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { createValidatedAction } from '@/utils/storeActionWrapper.js';

export const useYearStore = defineStore('year', () => {
  // Year mapping: filingYear (what users see) → taxYear (what calculations use)
  // Filing year is when you file taxes (e.g., 2026)
  // Tax year is the rate year used for calculations (e.g., 2025)
  const yearMapping = [
    { filingYear: '2024', taxYear: '2023', rateYear: '2022' },
    { filingYear: '2025', taxYear: '2024', rateYear: '2024' },
    { filingYear: '2026', taxYear: '2025', rateYear: '2025' }
  ];
  
  // Available tax years - using taxYear internally for backwards compatibility
  const taxYears = yearMapping.map(mapping => ({
    id: mapping.taxYear,  // Internal ID for calculations (e.g., '2025')
    filingYear: mapping.filingYear,  // Display year (e.g., '2026')
    taxYear: mapping.taxYear,  // Rate year for calculations
    rateYear: mapping.rateYear,  // Explicit rate year
    label: mapping.filingYear  // Show filing year in UI
  }));
  
  // Default to 2025 tax year (2026 filing year)
  const selectedTaxYear = ref('2025');
  
  // Computed: Get the current year mapping object
  const currentYearMapping = computed(() => {
    return yearMapping.find(m => m.taxYear === selectedTaxYear.value) || yearMapping[yearMapping.length - 1];
  });
  
  // Computed: Filing year (what users see - e.g., "2026")
  const filingYear = computed(() => currentYearMapping.value.filingYear);
  
  // Computed: Rate year (for tax calculations - e.g., "2025")
  const rateYear = computed(() => currentYearMapping.value.rateYear);
  
  // Computed property to determine which budget data to use
  // Maps tax year to budget fiscal year
  const budgetYear = computed(() => {
    if (selectedTaxYear.value === '2023') return '2022-2023';
    if (selectedTaxYear.value === '2024') return '2023-2024';
    return '2025-26';
  });
  
  // Function to change the selected year
  const setSelectedTaxYear = createValidatedAction('year', 'selectedTaxYear', function(year) {
    selectedTaxYear.value = year;
  });
  
  return {
    taxYears,
    selectedTaxYear,
    filingYear,
    rateYear,
    budgetYear,
    setSelectedTaxYear
  };
});
