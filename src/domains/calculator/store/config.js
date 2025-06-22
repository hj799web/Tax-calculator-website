import { defineStore } from "pinia";
import { ref } from "vue";
import { budgetCategories2022, budgetCategories2024 } from "@/domains/calculator/constants/taxData.js";
import { createValidatedAction } from '@/utils/storeActionWrapper.js';

export const useConfigStore = defineStore('config', () => {
  const allExpanded = ref(false);
  const sortOrder = ref(localStorage.getItem('sortOrder') || 'desc');
  const selectedAllocationCategories = ref([]);
  const visibleDescriptions = ref([])

  const toggleDescription = function(categoryId) {
    const cat = budgetCategories2022.find((c) => c.id === categoryId) || budgetCategories2024.find((c) => c.id === categoryId);
    if (cat) {
      const idIndex = visibleDescriptions.value.indexOf(cat.id)
      if (idIndex === -1) {
        visibleDescriptions.value.push(cat.id)
      } else {
        visibleDescriptions.value.splice(idIndex, 1)
      }
    }
  }

  const toggleAll = function() {
    visibleDescriptions.value = []
    if (!allExpanded.value) {
      budgetCategories2022.forEach((cat) => {
        visibleDescriptions.value.push(cat.id)
      });
      budgetCategories2024.forEach((cat) => {
        visibleDescriptions.value.push(cat.id)
      });
    }
    allExpanded.value = !allExpanded.value;
  }

  const toggleSortAmount = createValidatedAction('config', 'sortOrder', function() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('sortOrder', sortOrder.value);
  });

  const setAllExpanded = createValidatedAction('config', 'allExpanded', function(value) {
    allExpanded.value = value;
  });

  return {
    allExpanded,
    sortOrder,
    selectedAllocationCategories,
    toggleDescription,
    toggleAll,
    toggleSortAmount,
    setAllExpanded,
    visibleDescriptions
  }
}) 