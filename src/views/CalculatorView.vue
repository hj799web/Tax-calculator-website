/* eslint-disable */
<template>
  <!-- Calculator Container -->
  <div class="calculator-container">
    <h2 class="title">
      {{ t('calculator.title') }}
    </h2>
    <p class="description">
      {{ t('calculator.description') }}
    </p>
    
    <!-- Budget Simulator Button -->
    <div class="simulator-button-container text-center mb-6">
      <router-link
        to="/simulator"
        class="simulator-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center"
        :aria-label="t('calculator.simulator.aria')"
      >
        {{ t('calculator.simulator.cta') }}
      </router-link>
    </div>

    <!-- Inputs -->
    <div class="input-group">
      <RegionSelector />
      <IncomeInput />
    </div>

    <!-- Additional Income Sources -->
    <h3 class="section-title">
      {{ t('calculator.sections.additionalIncome') }}
    </h3>
    <AdditionalIncomeInputs />

    <!-- Deductions and Credits -->
    <h3 class="section-title">
      {{ t('calculator.sections.deductions') }}
    </h3>
    <DeductionsAndCreditsInputs />
  </div>
</template>

<script setup>
// Import new components
import RegionSelector from '@/domains/calculator/components/RegionSelector.vue'
import IncomeInput from '@/domains/calculator/components/IncomeInput.vue'
import AdditionalIncomeInputs from '@/domains/calculator/components/AdditionalIncomeInputs.vue'
import DeductionsAndCreditsInputs from '@/domains/calculator/components/DeductionsAndCreditsInputs.vue'
import { useI18n } from '@/i18n'
const { t } = useI18n()
</script>

<style scoped>
.calculator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
  transform: scale(0.8);
  transform-origin: top center;
}

.title {
  font-size: clamp(1.6rem, 2.5vw + 1rem, 2.5rem);
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  font-size: clamp(1rem, 0.6vw + 0.9rem, 1.125rem);
  color: #4a5568;
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.8;
}

.section-title {
  font-size: clamp(1.1rem, 1.2vw + 0.9rem, 1.5rem);
  font-weight: 600;
  color: #2d3748;
  margin: 2rem 0 1rem;
  position: relative;
  padding-left: 1rem;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 2px;
}

.simulator-button-container {
  margin: 2rem 0;
}

.simulator-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  will-change: transform, box-shadow;
  border: none;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.simulator-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.simulator-button:hover::before {
  left: 100%;
}

.simulator-button:hover {
  transform: translateY(-3px) translateZ(20px) rotateX(2deg);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
  background: linear-gradient(135deg, #2980b9, #2471a3);
  text-decoration: none;
}

.input-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out forwards;
}

/* Mobile refinements */
@media (max-width: 768px) {
  .calculator-container { padding: 1.25rem; }
  .input-group { grid-template-columns: 1fr; gap: 1rem; }
  .simulator-button { padding: 0.8rem 1.2rem; font-size: 1rem; }
}

@media (max-width: 480px) {
  .calculator-container { padding: 1rem; border-radius: 14px; }
  .input-group { gap: 0.85rem; }
  .simulator-button { padding: 0.7rem 1rem; font-size: 0.95rem; border-radius: 20px; }
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
</style>
