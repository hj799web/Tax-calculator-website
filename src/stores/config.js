import { defineStore } from "pinia";
import { ref } from "vue";
import { budgetCategories } from "@/constants";

export const useConfigStore = defineStore('config', () => {

  const allExpanded = ref(false);
  const sortOrder = ref(localStorage.getItem('sortOrder') || 'desc');
  const selectedAllocationCategories = ref([]);

  const visibleDescriptions = ref([])

  function toggleDescription(categoryId) {
    const cat = budgetCategories.find((c) => c.id === categoryId);
    if (cat) {
      const idIndex = visibleDescriptions.value.indexOf(cat.id)
      if (idIndex === -1) {
        visibleDescriptions.value.push(cat.id)
      } else {
        visibleDescriptions.value.splice(idIndex, 1)
      }
    }
  }

  function toggleAll() {
    visibleDescriptions.value = []
    if (!allExpanded.value) {
      budgetCategories.forEach((cat) => {
        visibleDescriptions.value.push(cat.id)
      });
    }
    allExpanded.value = !allExpanded.value;
  }

  function toggleSortAmount() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    localStorage.setItem('sortOrder', sortOrder.value);
  }

  return {
    allExpanded,
    sortOrder,
    selectedAllocationCategories,
    toggleDescription,
    toggleAll,
    toggleSortAmount,
    visibleDescriptions
  }
})