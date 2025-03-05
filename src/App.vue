<template>
  <div class="main-container">
    <!-- Header Section -->
    <header>
      <h1 class="main-title">
        Canada Income Tax Calculator
      </h1>
      <a href="https://hj799web.github.io/fiscal-insights-welcome-pg/" class="welcome-link">Welcome Page</a>
      <p class="subtitle">
        Enter your details to approximate your 2024 taxes.
      </p>
    </header>

    <!-- Salary Rate Selector Section -->
    <SalaryRateSelector />
    <section class="calculator-section">
      <div class="calculator-wrapper">
        <!-- Calculator and Results Section -->
        <CalculatorView />
        <!-- End of calculator-section -->

        <ResultView />
        <!-- End of calculator-container -->
      </div>
    <!-- End of calculator-wrapper -->
    </section>

    <!-- Federal Budget Breakdown Section -->
    <FederalBudgetView />



    <!-- Budget Categories Section -->
    <section class="budget-categories-section">
      <BudgetCategoriesView />
    </section>
    <!-- End of budget-categories-section -->



    <!-- FAQ Section -->
    <section class="faq-section">
      <FAQSection />
    </section>

    <!-- Footer -->
    <footer>
      <p>Note: This calculator is a simplified estimate. Actual tax amounts may vary.</p>
      <p>Based on 2024 approximate tax rules and brackets.</p>
    </footer>
  </div>
</template>

<script setup>
import SalaryRateSelector from './components/SalaryRateSelector.vue'
import CalculatorView from './views/CalculatorView.vue'
import ResultView from './views/ResultView.vue'
import FederalBudgetView from './views/FederalBudgetView.vue'
import BudgetCategoriesView from './views/BudgetCategoriesView.vue'
import FAQSection from './components/FAQSection.vue'


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f7f9fa;
  margin: 0;
  padding: 0;
}

.main-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.main-title {
  font-size: 36px;
  color: #34495e;
  margin-bottom: 5px;
  font-weight: 600;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.main-title:hover {
  transform: scale(1.02);
}

.welcome-link {
  display: block;
  text-align: center;
  color: #27ae60;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 18px;
  transition: color 0.3s;
}

.welcome-link:hover {
  color: #219a52;
  text-decoration: underline;
}

.subtitle {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 20px;
  text-align: center;
}

.section-title {
  color: #34495e;
  font-size: 24px;
  margin-top: 40px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.section-title:hover {
  transform: scale(1.02);
}

.salary-selector-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.salary-selector {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
}

.salary-selector::-webkit-scrollbar {
  display: none;
}

.salary-option {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #ecf0f1;
  border-radius: 30px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.salary-option:hover {
  background-color: #27ae60;
  color: #ffffff;
  transform: translateY(-2px) rotateX(5deg);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.salary-option.active {
  background-color: #27ae60;
  color: #ffffff;
  font-weight: 600;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.input-field::placeholder {
  font-style: italic;
  color: #7f8c8d;
}

.select-region option[disabled],
#maritalStatus option[disabled] {
  font-style: italic;
  color: #7f8c8d;
}

.calculator-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.calculator-container,
.result-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  flex: 1;
  min-width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.calculator-container:hover,
.result-box:hover {
  transform: translateY(-5px);
  box-shadow:
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}

.title {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 600;
}

.description {
  color: #7f8c8d;
  font-size: 18px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.input-group:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.select-region,
.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.select-region:focus,
.input-field:focus {
  border-color: #27ae60;
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.2);
  transform: translateY(-2px);
}

.input-label {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.result-title {
  font-size: 22px;
  margin-bottom: 15px;
  font-weight: 600;
}

.result-item {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 10px;
}

.total-tax {
  border-top: 1px solid #bdc3c7;
  padding-top: 10px;
  font-weight: bold;
}

.net-income {
  border-top: 2px solid #27ae60;
  padding-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #27ae60;
}

.placeholder-text {
  font-size: 16px;
  color: #e74c3c;
  text-align: center;
  margin-top: 50px;
}

.allocation-description {
  display: block;  
  text-align: center;
  margin: 0 auto 20px; 
  width: 100%; 
}


.export-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #27ae60;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.export-button:hover {
  background-color: #1e8449;
}

.tax-pie-chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tax-pie-chart-container:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/*.tax-pie-chart-container canvas {
  max-width: 100%;
  height: 100% !important;
}*/



/*.pie-chart-item {
  flex: 0 0 auto;
  min-width: 500px;
  max-width: 500px;
  height: 500px;
  width: 500px;
  margin: 40px auto;
  position: relative;
}*/

/*.pie-chart-item canvas {
  width: 100% !important;
  height: 100% !important;
}*/

/*.allocation-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(135deg, #f8f9fa, #e0e0e0);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}*/

.allocation-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-label {
  font-size: 16px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: color 0.3s;
}

.filter-label:hover {
  color: #2980b9;
}

.sort-button {
  background-color: #2980b9;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 10px;
}

.sort-button:hover {
  background-color: #1f6391;
}

.sort-button.asc {
  background-color: #27ae60;
}

.sort-button.desc {
  background-color: #c0392b;
}

.allocation-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.allocation-table th,
.allocation-table td {
  border: 1px solid #bdc3c7;
  padding: 10px;
  text-align: left;
}

.allocation-table th {
  background-color: #34495e;
  color: #ffffff;
}

.allocation-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.allocation-table tbody tr:hover {
  background-color: #e0e0e0;
}

.toggle-all-button {
  padding: 8px 16px;
  background-color: #8e44ad;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.toggle-all-button:hover {
  background-color: #732d91;
}

.toggle-description-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.toggle-description-button:hover {
  background-color: #2980b9;
}

.budget-category {
  margin-bottom: 20px;
}

.category-description {
  margin-top: 15px;
}

.subsections {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 3px solid #bdc3c7;
}

.subsection {
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

footer {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 60px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

footer:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

footer p {
  color: #7f8c8d;
  margin: 10px 0;
  transition: transform 0.3s ease;
}

footer p:hover {
  transform: translateX(5px);
  color: #34495e;
}

.calculator-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.calculator-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.budget-categories-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.budget-categories-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.faq-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.faq-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.faq-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
</style>
