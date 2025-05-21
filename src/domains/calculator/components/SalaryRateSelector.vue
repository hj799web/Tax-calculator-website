<template>
  <section class="salary-selector-section">
    <h3 class="section-title">
      Salary Rate Selector
    </h3>
    <div class="salary-selector-wrapper">
      <div class="salary-selector">
        <div
          v-for="option in salaryOptions"
          :key="option.value"
          :class="['salary-option', { active: selectedSalaryRate === option.value }]"
          role="button"
          tabindex="0"
          :aria-pressed="selectedSalaryRate === option.value"
          :aria-label="'Select ' + option.label + ' salary rate'"
          @click="selectSalaryRate(option.value)"
          @keydown.enter.prevent="selectSalaryRate(option.value)"
          @keydown.space.prevent="selectSalaryRate(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSalaryStore } from '@/domains/calculator/store/salary.js'
import { salaryOptions } from '@/domains/calculator/constants/taxData.js'
import { storeToRefs } from 'pinia';

const salaryStore = useSalaryStore();

const { selectSalaryRate } = salaryStore;
const { selectedSalaryRate } = storeToRefs(salaryStore);
</script>

<style scoped>
.salary-selector-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
  perspective: 1000px;
}

.section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-title:hover {
  transform: scale(1.02) translateZ(20px);
}

.salary-selector-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  perspective: 1000px;
  position: relative;
}

.salary-selector {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(52, 152, 219, 0.5) transparent;
  transform-style: preserve-3d;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.salary-selector::-webkit-scrollbar {
  height: 6px;
}

.salary-selector::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.salary-selector::-webkit-scrollbar-thumb {
  background: rgba(52, 152, 219, 0.5);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.salary-selector::-webkit-scrollbar-thumb:hover {
  background: rgba(52, 152, 219, 0.7);
}

.salary-option {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  color: #2c3e50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  transform: translateZ(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 120px;
  text-align: center;
}

.salary-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.salary-option:hover {
  transform: translateY(-2px) translateZ(20px) rotateX(5deg);
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.salary-option:hover::before {
  left: 100%;
}

.salary-option.active {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  transform: translateY(-2px) translateZ(30px);
  box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4);
  border: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .salary-option:hover {
    transform: none;
  }
  
  .salary-option:active {
    transform: translateY(-2px) translateZ(10px) rotateX(2deg);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .salary-option,
  .salary-option::before,
  .section-title {
    transition: none;
    transform: none !important;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .salary-option {
    border: 2px solid CanvasText;
  }
  
  .salary-option.active {
    border: 2px solid CanvasText;
  }
}
</style>