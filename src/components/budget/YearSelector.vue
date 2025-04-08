<template>
  <div class="year-selector" role="radiogroup" aria-label="Fiscal Year Selector">
    <button 
      role="radio"
      :aria-checked="currentYear === 2024"
      class="year-button" 
      :class="{ active: currentYear === 2024 }"
      @click="selectYear(2024)"
    >
      2023-2024
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentYear: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['year-selected']);

function selectYear(year) {
  emit('year-selected', year);
}
</script>

<style scoped>
.year-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.year-button {
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-button:hover {
  background-color: #dee2e6;
}

.year-button.active {
  background-color: #4263eb;
  color: white;
  border: 2px solid #2948c7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style>
