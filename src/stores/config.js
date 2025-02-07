import { defineStore } from "pinia";
import { ref } from "vue";
import { budgetCategories } from "@/constants";

export const useConfigStore = defineStore('config', () => {

  const allExpanded = ref(false);
  const sortOrder = ref(localStorage.getItem('sortOrder') || 'desc');
  const selectedAllocationCategories = ref([]);

  function toggleDescription(categoryId) {
    const cat = budgetCategories.value.find((c) => c.id === categoryId);
    if (cat) {
      cat.showDescription = !cat.showDescription;
    }
  }

  function toggleAll() {
    allExpanded.value = !allExpanded.value;
    budgetCategories.value.forEach((cat) => {
      cat.showDescription = allExpanded.value;
    });
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
    toggleSortAmount
  }
})