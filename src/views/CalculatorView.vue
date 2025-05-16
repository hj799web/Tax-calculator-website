<template>
  <!-- Calculator Container -->
  <div class="calculator-container">
    <h2 class="title">
      Estimate Your Taxes
    </h2>
    <p class="description">
      Calculate your federal and provincial taxes to estimate your net
      income.
    </p>
    
    <!-- Budget Simulator Button -->
    <div class="simulator-button-container text-center mb-6">
      <router-link
        to="/simulator"
        class="simulator-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center"
      >
        <span class="mr-2">🏛️</span> Try the Budget Simulator
      </router-link>
    </div>

    <!-- Inputs -->
    <div class="input-group">
      <RegionSelector />
      <IncomeInput />
    </div>

    <!-- Additional Income Sources -->
    <h3 class="section-title">
      Additional Income Sources
    </h3>
    <AdditionalIncomeInputs />

    <!-- Deductions and Credits -->
    <h3 class="section-title">
      Deductions and Credits
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
</script>

<style scoped>
.calculator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
  text-align: center;
}

.description {
  font-size: 1.125rem;
  color: #4a5568;
  margin-bottom: 2rem;
  text-align: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2rem 0 1rem;
}

.simulator-button {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.simulator-button:hover {
  text-decoration: none;
}
</style>