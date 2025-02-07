import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { salaryOptions } from "@/constants";

export const useSalaryStore = defineStore('salary', () => {
  const selectedSalaryRate = ref('Annual')

  const selectSalaryRate = (salaryRate) => {
    selectedSalaryRate.value = salaryRate
  }

  const periodMultiplier = computed(() => {
    return salaryOptions[salaryOptions.findIndex((so) => so.value === selectedSalaryRate.value)].periodMultiplier
  })

  return {
    selectedSalaryRate,
    selectSalaryRate,
    periodMultiplier
  }
})