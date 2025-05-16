import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { salaryOptions } from "@/domains/calculator/constants/taxData.js";

export const useSalaryStore = defineStore('salary', () => {
  const selectedSalaryRate = ref('Annual')

  const selectSalaryRate = (salaryRate) => {
    selectedSalaryRate.value = salaryRate
  }

  const periodMultiplier = computed(() => {
    if (!salaryOptions) return 1
    const option = salaryOptions.find((so) => so.value === selectedSalaryRate.value)
    return option ? option.periodMultiplier : 1
  })

  return {
    selectedSalaryRate,
    selectSalaryRate,
    periodMultiplier
  }
})