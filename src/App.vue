<template>
  <div id="app">
    <!-- Router View - This is where route components will be rendered -->
    <router-view v-if="$route.path !== '/'" />

    <!-- Main Content (only shown on home route) -->
    <main v-if="$route.path === '/'">
      <div class="main-container">
        <!-- Header Section -->
        <header>
          <div class="logo-container">
            <img
              :src="logoUrl"
              alt="Fiscal Insights Logo"
              class="site-logo"
            >
          </div>
          <h1 class="main-title">
            Canada Tax Calculator
          </h1>
          <nav class="main-navigation">
            <a
              href="welcome.html"
              class="nav-link"
            >Home</a>
            <router-link
              to="/how-it-works"
              class="nav-link"
            >
              How It Works
            </router-link>
            <router-link
              to="/simulator"
              class="nav-link simulator-link"
            >
              Try the Budget Simulator
            </router-link>
            <a
              href="https://www.canada.ca/en/revenue-agency.html"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link"
            >CRA</a>
          </nav>
          <p class="subtitle">
            Get an accurate breakdown of your taxes and see where your money goes with our free calculator.
          </p>
        </header>

        <!-- Year Selector Section -->
        <section class="year-selector-section">
          <div class="year-selector-container">
            <h3 class="year-selector-title">
              Select Tax Year
            </h3>
            <div class="year-selector">
              <button 
                v-for="year in yearStore.taxYears" 
                :key="year.id"
                :class="['year-button', { active: yearStore.selectedTaxYear === year.id }]"
                @click="yearStore.setSelectedTaxYear(year.id)"
              >
                {{ year.label }}
              </button>
            </div>
            <p class="year-selector-note">
              {{ yearStore.selectedTaxYear === '2024' ? 
                'Using 2024 tax rates and budget projections' : 
                `Using ${yearStore.selectedTaxYear} tax rates with 2022-2023 budget data` }}
            </p>
          </div>
        </section>

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

        <!-- Understanding Your Tax Breakdown Section -->
        <section id="how-it-works">
          <h2 class="section-title">
            Understanding Your Tax Breakdown
          </h2>
          <p class="section-description">
            See how your tax dollars are allocated across different government spending categories. This visualization helps you 
            understand exactly where your money goes and how it contributes to various public services.
          </p>
          <FederalBudgetView />
        </section>

        <!-- Budget Categories Section - Now Collapsible -->
        <section class="budget-categories-section">
          <div class="section-header">
            <h2 class="section-title">
              Budget Categories
            </h2>
            <button
              class="toggle-section-button"
              @click="toggleBudgetCategories"
            >
              {{ showBudgetCategories ? 'Hide' : 'Show' }}
            </button>
          </div>
          <transition name="fade">
            <div v-if="showBudgetCategories">
              <p class="section-description">
                These budget categories are for the 2022–2023 fiscal year. Data is sourced from the Public Accounts of Canada offering a view of how federal funds are allocated across key sectors such as healthcare, defense, infrastructure, and more.
              </p>
              <BudgetCategoriesView />
            </div>
          </transition>
        </section>
        <!-- End of budget-categories-section -->

        <!-- FAQ Section - Now Collapsible -->
        <section class="faq-section">
          <div class="section-header">
            <h2 class="section-title">
              Taxpayer FAQs
            </h2>
            <button
              class="toggle-section-button"
              @click="toggleFAQs"
            >
              {{ showFAQs ? 'Hide' : 'Show' }}
            </button>
          </div>
          <transition name="fade">
            <div v-if="showFAQs">
              <FAQSection />
            </div>
          </transition>
        </section>

        <!-- Resources Section -->
        <section class="resources-section">
          <h2 class="section-title">
            Additional Tax Resources
          </h2>
          <p class="resources-description">
            Access these trusted resources to learn more about Canadian taxes, government spending, and financial planning.
          </p>
          <div class="resources-links">
            <router-link
              to="/how-it-works"
              class="resource-link"
            >
              How It Works
            </router-link>
            <a
              href="https://www.canada.ca/en/revenue-agency.html"
              target="_blank"
              rel="noopener noreferrer"
              class="resource-link"
            >Canada Revenue Agency</a>
            <a
              href="https://www.canada.ca/en/department-finance.html"
              target="_blank"
              rel="noopener noreferrer"
              class="resource-link"
            >Department of Finance Canada</a>
            <a
              href="https://www.budget.canada.ca/2024/home-accueil-en.html"
              target="_blank"
              rel="noopener noreferrer"
              class="resource-link"
            >Budget 2024</a>
            <a
              href="https://www.tpsgc-pwgsc.gc.ca/recgen/cpc-pac/index-eng.html"
              target="_blank"
              rel="noopener noreferrer"
              class="resource-link"
            >Public Accounts of Canada</a>
          </div>
        </section>

        <!-- Footer -->
        <footer class="site-footer">
          <div class="footer-content">
            <div class="footer-section">
              <h3>About Us</h3>
              <p>Fiscal Insights provides free tax calculators and financial tools to help Canadians understand their taxes and government spending.</p>
            </div>
            <div class="footer-section">
              <h3>Connect With Us</h3>
              <div class="social-links">
                <a
                  href="mailto:fiscal-insights@outlook.com"
                  class="social-link"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                    alt="Email"
                    class="social-icon"
                  >
                  <span>fiscal-insights@outlook.com</span>
                </a>
                <a
                  href="https://www.instagram.com/fiscal_insights1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
                    alt="Instagram"
                    class="social-icon"
                  >
                  <span>@fiscal_insights1</span>
                </a>
              </div>
            </div>
            <div class="footer-section">
              <h3>Disclaimer</h3>
              <p>This calculator is a simplified estimate. Actual tax amounts may vary.</p>
              <p>Based on 2024 approximate tax rules and brackets.</p>
              <p>Last updated: March 2024</p>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 Fiscal Insights. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
    
    <!-- Beta Testing Button - Visible on all pages -->
    <a
      href="https://forms.gle/Yofdxnr1iLZ5fRJ8A"
      target="_blank"
      rel="noopener noreferrer"
      class="beta-button"
    >
      <span>🔍 Help Us Improve</span>
      <span class="beta-subtext">Take a Quick Survey!</span>
    </a>
  </div>
</template>

<script setup>
import SalaryRateSelector from './components/SalaryRateSelector.vue'
import CalculatorView from './views/CalculatorView.vue'
import ResultView from './views/ResultView.vue'
import FederalBudgetView from './views/FederalBudgetView.vue'
import BudgetCategoriesView from './views/BudgetCategoriesView.vue'
import FAQSection from './components/FAQSection.vue'

import { ref } from 'vue'
import logoImage from '@/assets/fiscal-insights-logo.jpg'
import { useYearStore } from './stores/year.js'
import '@/assets/year-selector.css'

let showBudgetCategories = ref(false)
let showFAQs = ref(false)
const logoUrl = logoImage
const yearStore = useYearStore()

function toggleBudgetCategories() {
  showBudgetCategories.value = !showBudgetCategories.value
}

function toggleFAQs() {
  showFAQs.value = !showFAQs.value
}
</script>

<style>
/* Base styles */
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Import fonts */
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

.logo-container {
  text-align: center;
  margin-bottom: 15px;
}

.site-logo {
  max-width: 180px;
  height: auto;
  transition: transform 0.3s ease;
}

.site-logo:hover {
  transform: scale(1.05);
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
  text-align: center;
  max-width: 800px;
  margin: 0 auto 30px;
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

.section-description {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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

/* Collapsible section styling */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toggle-section-button {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-section-button:hover {
  background-color: #219a52;
  transform: translateY(-2px);
}

.toggle-section-button:active {
  transform: translateY(0);
}

/* Animation for collapsible sections */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, max-height 0.5s;
  max-height: 1000px;
  overflow: hidden;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Footer Styles */
.site-footer {
  background-color: #000000;
  color: #ecf0f1;
  padding: 40px 20px 20px;
  margin-top: 60px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  min-width: 250px;
  margin-bottom: 30px;
  padding: 0 15px;
}

.footer-section h3 {
  color: #27ae60;
  margin-bottom: 20px;
  font-size: 20px;
  position: relative;
  padding-bottom: 10px;
  font-weight: 600;
}

.footer-section h3:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background-color: #27ae60;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 10px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
}

.social-icon {
  width: 32px;
  height: 32px;
  margin-right: 15px;
  object-fit: contain;
  transition: transform 0.3s ease;
  border-radius: 6px;
  padding: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  filter: brightness(0) invert(1);
}

.social-link:hover .social-icon {
  transform: scale(1.2);
  background-color: rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  color: #27ae60;
  transform: translateX(5px);
  background-color: rgba(255, 255, 255, 0.1);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #1a1a1a;
}

.footer-bottom p {
  color: #95a5a6;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
  
  .footer-section {
    margin-bottom: 30px;
  }
  
  .social-link {
    padding: 12px;
  }
  
  .social-icon {
    width: 28px;
    height: 28px;
  }
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

.resources-section {
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
  text-align: center;
}

.resources-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.resource-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ecf0f1;
  color: #34495e;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.resource-link:hover {
  background-color: #27ae60;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.beta-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.beta-subtext {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 3px;
  font-weight: normal;
}

.beta-button:hover {
  background: linear-gradient(135deg, #219a52, #27ae60);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(39, 174, 96, 0.5);
  animation: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(39, 174, 96, 0.5);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
  }
}

.main-navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
}

.nav-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #3498db;
  color: white;
}

.resources-description {
  text-align: center;
  margin-bottom: 20px;
  color: #555;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .main-navigation {
    flex-wrap: wrap;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 4px 8px;
  }
  
  .calculator-section, .faq-section, .budget-categories-section, .resources-section {
    padding: 15px;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .section-description {
    font-size: 0.9rem;
  }
  
  .resources-description {
    font-size: 0.9rem;
  }
  
  .resource-link {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .site-logo {
    max-width: 140px;
  }
  
  .footer-section h3 {
    font-size: 1.1rem;
  }
  
  .footer-section p, .footer-bottom p {
    font-size: 0.85rem;
  }
  
  .social-link {
    font-size: 0.85rem;
  }
  
  .social-icon {
    width: 16px;
    height: 16px;
  }
  
  .beta-button {
    padding: 10px 20px;
    font-size: 14px;
    bottom: 15px;
    right: 15px;
  }
  
  .beta-subtext {
    font-size: 10px;
  }
}
</style>
