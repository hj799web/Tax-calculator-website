<template>
  <div class="main-container">
    <!-- Header Section -->
    <header>
      <h1 class="main-title">Canada Income Tax Calculator</h1>
      <p class="subtitle">
        Enter your details to approximate your 2024 taxes. Note: This is still a
        simplified model!
      </p>
    </header>

    <!-- Salary Rate Selector Section -->
    <section class="salary-selector-section">
      <h3 class="section-title">Salary Rate Selector</h3>
      <div class="salary-selector-wrapper">
        <div class="salary-selector">
          <div
            v-for="option in salaryOptions"
            :key="option.value"
            :class="['salary-option', { active: salaryRate === option.value }]"
            role="button"
            tabindex="0"
            :aria-pressed="salaryRate === option.value"
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

    <!-- Calculator and Results Section -->
    <section class="calculator-section">
      <div class="calculator-wrapper">
        <!-- Calculator Container -->
        <div class="calculator-container">
          <h2 class="title">Estimate Your Taxes</h2>
          <p class="description">
            Calculate your federal and provincial taxes to estimate your net
            income.
          </p>

          <!-- Inputs -->
          <div class="input-group">
            <!-- Select Province or Territory -->
            <select
              v-model="selectedRegion"
              class="select-region"
              aria-label="Select Province or Territory"
            >
              <option disabled value="" style="font-style: italic;">
                Select Your Province or Territory
              </option>
              <option
                v-for="region in regions"
                :key="region"
              >
                {{ region }}
              </option>
            </select>

            <!-- Employment Income Input -->
            <input
              v-model.number="income"
              class="input-field"
              :placeholder="'Enter your ' + salaryRate.toLowerCase() + ' employment income'"
              type="number"
              min="0"
              aria-label="Employment Income"
              autocomplete="on"
            >
          </div>

          <!-- Additional Income Sources -->
          <h3 class="section-title">Additional Income Sources</h3>
          <div class="input-group additional-income">
            <div class="input-subgroup">
              <label class="input-label" for="selfEmploymentIncome">
                Self-Employment Income
              </label>
              <input
                id="selfEmploymentIncome"
                v-model.number="selfEmploymentIncome"
                class="input-field"
                placeholder="Enter your self-employment income"
                type="number"
                min="0"
                aria-label="Self-Employment Income"
                autocomplete="on"
              >
            </div>
            <div class="input-subgroup">
              <label class="input-label" for="capitalGainsBeforeJune25">
                Capital Gains Before June 25, 2024
              </label>
              <input
                id="capitalGainsBeforeJune25"
                v-model.number="capitalGainsBeforeJune25"
                class="input-field"
                placeholder="Enter your capital gains before June 25, 2024"
                type="number"
                min="0"
                aria-label="Capital Gains Before June 25, 2024"
                autocomplete="on"
              >
            </div>
            <div class="input-subgroup">
              <label class="input-label" for="capitalGainsAfterJune25">
                Capital Gains On/After June 25, 2024
              </label>
              <input
                id="capitalGainsAfterJune25"
                v-model.number="capitalGainsAfterJune25"
                class="input-field"
                placeholder="Enter your capital gains on/after June 25, 2024"
                type="number"
                min="0"
                aria-label="Capital Gains On/After June 25, 2024"
                autocomplete="on"
              >
            </div>
            <div class="input-subgroup">
              <label class="input-label" for="eligibleDividends">
                Eligible Dividends
              </label>
              <input
                id="eligibleDividends"
                v-model.number="eligibleDividends"
                class="input-field"
                placeholder="Enter your eligible dividends"
                type="number"
                min="0"
                aria-label="Eligible Dividends"
                autocomplete="on"
              >
            </div>
            <div class="input-subgroup">
              <label class="input-label" for="ineligibleDividends">
                Ineligible Dividends
              </label>
              <input
                id="ineligibleDividends"
                v-model.number="ineligibleDividends"
                class="input-field"
                placeholder="Enter your ineligible dividends"
                type="number"
                min="0"
                aria-label="Ineligible Dividends"
                autocomplete="on"
              >
            </div>
            <div class="input-subgroup">
              <label class="input-label" for="otherIncome">
                Other Income
              </label>
              <input
                id="otherIncome"
                v-model.number="otherIncome"
                class="input-field"
                placeholder="Enter your other income"
                type="number"
                min="0"
                aria-label="Other Income"
                autocomplete="on"
              >
            </div>
          </div>

          <!-- Deductions and Credits -->
          <h3 class="section-title">Deductions and Credits</h3>
          <div class="input-group deductions-credits">
            <div class="input-subgroup">
              <label class="input-label" for="rrspDeduction">
                RRSP Deduction
              </label>
              <input
                id="rrspDeduction"
                v-model.number="rrspDeduction"
                class="input-field"
                placeholder="Enter your RRSP deduction"
                type="number"
                min="0"
                aria-label="RRSP Deduction"
                autocomplete="on"
              >
            </div>

            <!-- Marital Status -->
            <div class="input-subgroup">
              <label class="input-label" for="maritalStatus">
                Marital Status
              </label>
              <select
                id="maritalStatus"
                v-model="maritalStatus"
                class="input-field"
                aria-label="Select Marital Status"
              >
                <option disabled value="" style="font-style: italic;">
                  Select Marital Status
                </option>
                <option>Single</option>
                <option>Married or Common-Law</option>
                <option>Separated</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </div>

            <!-- Number of Dependents -->
            <div class="input-subgroup">
              <label class="input-label" for="numberOfDependents">
                Number of Dependents
              </label>
              <input
                id="numberOfDependents"
                v-model.number="numberOfDependents"
                class="input-field"
                placeholder="Enter number of dependents"
                type="number"
                min="0"
                aria-label="Number of Dependents"
                autocomplete="on"
              >
            </div>

            <!-- Number of Children Under 18 -->
            <div class="input-subgroup">
              <label class="input-label" for="numberOfChildrenUnder18">
                Number of Children Under 18
              </label>
              <input
                id="numberOfChildrenUnder18"
                v-model.number="numberOfChildrenUnder18"
                class="input-field"
                placeholder="Enter number of children under 18"
                type="number"
                min="0"
                aria-label="Number of Children Under 18"
                autocomplete="on"
              >
            </div>

            <!-- Dependents with Disabilities -->
            <div class="input-subgroup">
              <label class="input-label" for="numberOfDependentsWithDisabilities">
                Dependents with Disabilities
              </label>
              <input
                id="numberOfDependentsWithDisabilities"
                v-model.number="numberOfDependentsWithDisabilities"
                class="input-field"
                placeholder="Enter number of dependents with disabilities"
                type="number"
                min="0"
                aria-label="Dependents with Disabilities"
                autocomplete="on"
              >
            </div>
          </div>
        </div>
        <!-- End of calculator-container -->

        <!-- Results Box -->
        <div class="result-box">
          <h2 v-if="canCalculate" class="result-title">
            Your Tax Breakdown
          </h2>
          <div v-if="canCalculate">
            <div class="result-item">
              <span>Federal Tax:</span>
              <span>
                {{ formatCurrency(netFederalTaxPerPeriod) }}
                ({{ federalTaxPercentage }}%)
              </span>
            </div>
            <div class="result-item">
              <span>Provincial Tax:</span>
              <span>
                {{ formatCurrency(netProvincialTaxPerPeriod) }}
                ({{ provincialTaxPercentage }}%)
              </span>
            </div>
            <div class="result-item">
              <span>CPP/QPP Contribution:</span>
              <span>
                {{ formatCurrency(pensionPlanContributionPerPeriod) }}
                ({{ cppTaxPercentage }}%)
              </span>
            </div>
            <div class="result-item">
              <span>EI Premium:</span>
              <span>
                {{ formatCurrency(eiPremiumPerPeriod) }}
                ({{ eiTaxPercentage }}%)
              </span>
            </div>
            <div class="result-item total-tax">
              <span>Total Tax:</span>
              <span>
                {{ formatCurrency(totalTaxPerPeriod) }}
              </span>
            </div>
            <div class="result-item net-income">
              <span>Net Income After Credits:</span>
              <span>
                {{ formatCurrency(netIncomeAfterCreditsPerPeriod) }}
              </span>
            </div>

            <!-- Export to PDF Button -->
            <button
              class="export-button"
              aria-label="Export tax breakdown as PDF"
              @click="exportToPDF"
            >
              Export as PDF
            </button>

            <!-- Tax Pie Chart -->
            <div
              class="tax-pie-chart-container"
              role="img"
              aria-label="Tax breakdown pie chart"
            >
              <canvas ref="taxPieChartRef" width="400" height="400"></canvas>
            </div>
          </div>
          <div v-else class="placeholder-text">
            <p>
              Please enter your income and select your province or territory to see
              the tax breakdown.
            </p>
          </div>
        </div>
        <!-- End of result-box -->
      </div>
      <!-- End of calculator-wrapper -->
    </section>
    <!-- End of calculator-section -->

    <!-- Federal Budget Breakdown Section -->
    <section class="federal-budget-section">
      <h2 class="section-title">
        Federal Budget Allocation
      </h2>
      <p class="allocation-description">
        See how your federal taxes are allocated across different sectors and
        programs.
      </p>

      <!-- Charts Section -->
      <section class="charts-section">
        <h2 class="section-title">Budget Visualizations</h2>
        <div class="budget-pie-charts-wrapper">
          <!-- Federal Budget Pie Chart -->
          <div
            class="pie-chart-item"
            role="img"
            aria-label="2022-2023 Federal budget allocation chart"
          >
            <canvas ref="federalBudgetPieChartRef"></canvas>
          </div>

          <!-- Budget 2024 Pie Chart -->
          <div
            class="pie-chart-item"
            role="img"
            aria-label="Federal Budget 2024 allocation chart"
          >
            <canvas ref="budget2024PieChartRef"></canvas>
          </div>
        </div>
      </section>
    </section>

    <!-- Combined Total Federal Tax Allocated Section -->
    <section class="allocation-table-section total-federal-tax-allocated">
      <h2 class="section-title">Total Federal Tax Allocated</h2>
      <div class="allocation-total">
        <span>Total Federal Tax Allocated:</span>
        <span>{{ formatCurrency(netFederalTaxPerPeriod) }}</span>
      </div>
      <!-- Keep the sort button for THIS table only -->
      <button class="sort-button" @click="toggleSortAmount">
        Sort by Amount ({{ sortOrder.toUpperCase() }})
      </button>
      <table class="allocation-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in sortedBudgetCategories"
            :key="category.id"
          >
            <td>{{ category.name }}</td>
            <td>{{ formatCurrency(category.allocatedAmount) }}</td>
            <td>{{ category.percentage.toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Budget Categories Section -->
    <section class="budget-categories-section">
      <h2 class="section-title">Budget Categories</h2>

      <!-- Allocation Filters -->
      <div class="allocation-filters">
        <label
          v-for="cat in allocationCategories"
          :key="cat.value"
          class="filter-label"
        >
          <input
            v-model="selectedAllocationCategories"
            type="checkbox"
            :value="cat.value"
          >
          {{ cat.label }}
        </label>
      </div>

      <!--
        Remove the 'sort by amount' button block from this section
        per your request. We also removed the "Currently Sorted By" to avoid confusion.
      -->

      <!-- Action Buttons: Expand All / Hide All -->
      <div class="budget-action-buttons">
        <button
          class="toggle-all-button"
          aria-label="Toggle all budget category details"
          @click="toggleAll"
        >
          {{ allExpanded ? 'Hide All' : 'Expand All' }}
        </button>
      </div>

      <!-- Budget Categories (Detailed) -->
      <div class="budget-categories">
        <div
          v-for="category in sortedBudgetData"
          :key="category.uniqueId"
          class="budget-category"
        >
          <h3>
            {{ category.category }} ({{ formatBudget(category.amount) }})
          </h3>
          <button
            class="toggle-description-button"
            :aria-label="'Toggle details for ' + category.category"
            @click="toggleDescription(category.id)"
          >
            {{ category.showDescription ? 'Hide Details' : 'Show Details' }}
          </button>
          <transition name="fade">
            <div
              v-if="category.showDescription"
              class="category-description"
            >
              <p>{{ category.description }}</p>
              <!-- Subsections (if any) -->
              <div
                v-if="category.subsections"
                class="subsections"
              >
                <div
                  v-for="sub in category.subsections"
                  :key="sub.id"
                  class="subsection"
                >
                  <h4>
                    {{ sub.name }} – {{ formatBudget(sub.amount) }}
                  </h4>
                  <p>{{ sub.description }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </section>
    <!-- End of budget-categories-section -->

    <!-- Footer -->
    <footer>
      <p>Note: This calculator is a simplified estimate. Actual tax amounts may vary.</p>
      <p>Based on 2024 approximate tax rules and brackets.</p>
    </footer>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default defineComponent({
  name: 'App',
  setup() {
    /***************************************
     *        TEMPLATE REFS (Canvas)
     ***************************************/
    const taxPieChartRef = ref(null);
    const federalBudgetPieChartRef = ref(null);
    const budget2024PieChartRef = ref(null);

    /***************************************
     *             REACTIVE STATE
     ***************************************/
    // Basic Inputs
    const income = ref(null);
    const selfEmploymentIncome = ref(null);
    const rrspDeduction = ref(null);
    const capitalGainsBeforeJune25 = ref(null);
    const capitalGainsAfterJune25 = ref(null);
    const eligibleDividends = ref(null);
    const ineligibleDividends = ref(null);
    const otherIncome = ref(null);

    // Personal Info
    const selectedRegion = ref('');
    const salaryRate = ref('Annual');
    const maritalStatus = ref('');
    const numberOfDependents = ref(null);
    const numberOfChildrenUnder18 = ref(null);
    const numberOfDependentsWithDisabilities = ref(null);

    // Sorting & Allocation
    const allExpanded = ref(false);
    const sortOrder = ref(localStorage.getItem('sortOrder') || 'desc');
    const selectedAllocationCategories = ref([]);

    // Salary Options
    const salaryOptions = ref([
      { label: 'Annual', value: 'Annual' },
      { label: 'Monthly', value: 'Monthly' },
      { label: 'Bi-weekly', value: 'Bi-weekly' },
      { label: 'Weekly', value: 'Weekly' },
      { label: 'Daily', value: 'Daily' },
      { label: 'Hourly', value: 'Hourly' },
    ]);

    // Regions
    const regions = ref([
      'Alberta',
      'British Columbia',
      'Manitoba',
      'New Brunswick',
      'Newfoundland and Labrador',
      'Nova Scotia',
      'Ontario',
      'Prince Edward Island',
      'Quebec',
      'Saskatchewan',
      'Northwest Territories',
      'Nunavut',
      'Yukon',
    ]);

    // Allocation Categories for the checkbox filters
    const allocationCategories = ref([
      { label: 'Healthcare', value: 'Healthcare' },
      { label: 'Support for Seniors', value: 'Support for Seniors' },
      { label: 'Children and Families', value: 'Children and Families' },
      {
        label: 'Indigenous Services and Reconciliation',
        value: 'Indigenous Services and Reconciliation',
      },
      {
        label: 'Employment Insurance and Other Benefits',
        value: 'Employment Insurance and Other Benefits',
      },
      { label: 'Defense and Public Safety', value: 'Defense and Public Safety' },
      { label: 'Debt Servicing', value: 'Debt Servicing' },
      { label: 'Public Debt Charges', value: 'Public Debt Charges' },
      { label: 'Loans, Investments, and Advances', value: 'Loans, Investments, and Advances' },
      { label: 'Government Operations', value: 'Government Operations' },
    ]);

    /***************************************
     *       TAX BRACKETS & AMOUNTS
     ***************************************/
    // Federal Tax Brackets (2024 approximate)
    const federalTaxBrackets = ref([
      { rate: 0.15, upTo: 53359 },
      { rate: 0.205, upTo: 106717 },
      { rate: 0.26, upTo: 165430 },
      { rate: 0.29, upTo: 235675 },
      { rate: 0.33, upTo: Infinity },
    ]);

    // Provincial Tax Brackets (approximate)
    const provincialTaxBrackets = ref({
      Alberta: [
        { rate: 0.1, upTo: 142292 },
        { rate: 0.12, upTo: 170751 },
        { rate: 0.13, upTo: 227668 },
        { rate: 0.14, upTo: 341502 },
        { rate: 0.15, upTo: Infinity },
      ],
      'British Columbia': [
        { rate: 0.0506, upTo: 43070 },
        { rate: 0.077, upTo: 86141 },
        { rate: 0.105, upTo: 98901 },
        { rate: 0.1229, upTo: 120094 },
        { rate: 0.147, upTo: 162832 },
        { rate: 0.168, upTo: 227091 },
        { rate: 0.205, upTo: Infinity },
      ],
      Manitoba: [
        { rate: 0.108, upTo: 33723 },
        { rate: 0.1275, upTo: 72885 },
        { rate: 0.174, upTo: Infinity },
      ],
      'New Brunswick': [
        { rate: 0.0968, upTo: 43835 },
        { rate: 0.1482, upTo: 87671 },
        { rate: 0.1652, upTo: 142534 },
        { rate: 0.1784, upTo: 162383 },
        { rate: 0.203, upTo: Infinity },
      ],
      'Newfoundland and Labrador': [
        { rate: 0.087, upTo: 39157 },
        { rate: 0.145, upTo: 78315 },
        { rate: 0.158, upTo: 139780 },
        { rate: 0.173, upTo: 195693 },
        { rate: 0.183, upTo: Infinity },
      ],
      'Nova Scotia': [
        { rate: 0.0879, upTo: 29590 },
        { rate: 0.1495, upTo: 59180 },
        { rate: 0.1667, upTo: 93000 },
        { rate: 0.175, upTo: 150000 },
        { rate: 0.21, upTo: Infinity },
      ],
      Ontario: [
        { rate: 0.0505, upTo: 46226 },
        { rate: 0.0915, upTo: 92454 },
        { rate: 0.1116, upTo: 150000 },
        { rate: 0.1216, upTo: 220000 },
        { rate: 0.1316, upTo: Infinity },
      ],
      'Prince Edward Island': [
        { rate: 0.0985, upTo: 31984 },
        { rate: 0.138, upTo: 63969 },
        { rate: 0.167, upTo: Infinity },
      ],
      Quebec: [
        { rate: 0.15, upTo: 45545 },
        { rate: 0.20, upTo: 91105 },
        { rate: 0.24, upTo: 112655 },
        { rate: 0.2575, upTo: Infinity },
      ],
      Saskatchewan: [
        { rate: 0.105, upTo: 47677 },
        { rate: 0.125, upTo: 136385 },
        { rate: 0.145, upTo: Infinity },
      ],
      'Northwest Territories': [
        { rate: 0.059, upTo: 44437 },
        { rate: 0.086, upTo: 88874 },
        { rate: 0.122, upTo: 144362 },
        { rate: 0.1405, upTo: Infinity },
      ],
      Nunavut: [
        { rate: 0.04, upTo: 45462 },
        { rate: 0.07, upTo: 90925 },
        { rate: 0.09, upTo: 147692 },
        { rate: 0.115, upTo: Infinity },
      ],
      Yukon: [
        { rate: 0.064, upTo: 50197 },
        { rate: 0.09, upTo: 100392 },
        { rate: 0.109, upTo: 155625 },
        { rate: 0.128, upTo: 500000 },
        { rate: 0.15, upTo: Infinity },
      ],
    });

    // Basic Personal Amount
    const federalBasicPersonalAmount = ref(15000);
    // Approx provincial personal amounts
    const provincialBasicPersonalAmounts = ref({
      Alberta: 21003,
      'British Columbia': 11881,
      Manitoba: 10386,
      'New Brunswick': 12081,
      'Newfoundland and Labrador': 10150,
      'Northwest Territories': 16593,
      'Nova Scotia': 8481,
      Nunavut: 16962,
      Ontario: 11281,
      'Prince Edward Island': 11250,
      Quebec: 17283,
      Saskatchewan: 17225,
      Yukon: 15000,
    });

    /***************************************
     *        BUDGET CATEGORIES
     ***************************************/
    const budgetCategories = ref([
      {
        id: 1,
        name: 'Healthcare',
        amount: 50000000000,
        description: 'Funds the Canada Health Transfer, etc.',
        showDescription: false,
      },
      {
        id: 2,
        name: 'Support for Seniors',
        amount: 63000000000,
        description: 'Old Age Security, GIS, etc.',
        showDescription: false,
      },
      {
        id: 3,
        name: 'Children and Families',
        amount: 28000000000,
        description: 'Canada Child Benefit, child/family programs.',
        showDescription: false,
      },
      {
        id: 4,
        name: 'Indigenous Services and Reconciliation',
        amount: 26000000000,
        description: 'Services, reconciliation efforts, etc.',
        showDescription: false,
      },
      {
        id: 5,
        name: 'Employment Insurance and Other Benefits',
        amount: 30000000000,
        description: 'EI, job retraining, etc.',
        showDescription: false,
      },
      {
        id: 6,
        name: 'Defense and Public Safety',
        amount: 35000000000,
        description: 'Canadian Armed Forces, border security.',
        showDescription: false,
      },
      {
        id: 7,
        name: 'Debt Servicing',
        amount: 44000000000,
        description: 'Interest on Canada’s national debt.',
        showDescription: false,
      },
      {
        id: 8,
        name: 'Public Debt Charges',
        amount: 34900000000,
        description: 'Additional public debt interest.',
        showDescription: false,
      },
      {
        id: 9,
        name: 'Loans, Investments, and Advances',
        amount: 100000000000,
        description: 'Student loans, global loans, etc.',
        showDescription: false,
        subsections: [
          {
            id: '9.1',
            name: 'Student Loans',
            amount: 24000000000,
            description:
              'Financial assistance for post-secondary students.',
          },
          {
            id: '9.2',
            name: 'International Development Loans',
            amount: 53000000000,
            description: 'World Bank, AIIB, IDA commitments.',
          },
        ],
      },
      {
        id: 10,
        name: 'Government Operations',
        amount: 100000000000,
        description:
          'Day-to-day operations, salaries, infrastructure, etc.',
        showDescription: false,
        subsections: [
          {
            id: '10.1',
            name: 'Transportation Infrastructure',
            amount: 15000000000,
            description: 'Roads, bridges, ports, etc.',
          },
          {
            id: '10.2',
            name: 'Environmental Programs',
            amount: 8000000000,
            description: 'Clean energy, climate initiatives, etc.',
          },
        ],
      },
    ]);

    // Budget 2024 Data (approx)
    const baseBudget2024Data = ref([
      { category: 'Economic Growth and Tax Policies', amount: 233.06 },
      { category: 'Housing and Affordability', amount: 18.9 },
      { category: 'Green Energy and Sustainability', amount: 4.6079 },
      { category: 'Social Programs and Indigenous Communities', amount: 0.5061 },
      { category: 'Defence and Public Safety', amount: 2.2687 },
      { category: 'Public Debt and Fiscal Stability', amount: 55.15 },
    ]);

    /***************************************
     *          CHART INSTANCES
     ***************************************/
    let federalBudgetChart = null;
    let budget2024Chart = null;
    let taxPieChart = null;

    /***************************************
     *            COMPUTED PROPS
     ***************************************/
    // (Same general logic from previous code for capital gains, dividends, tax brackets, etc.)

    // ... same as previous code ...
    // For brevity, the same approximate logic for income, capital gains, dividends, etc. is retained:

    const periodMultiplier = computed(() => {
      switch (salaryRate.value) {
        case 'Annual': return 1;
        case 'Monthly': return 12;
        case 'Bi-weekly': return 26;
        case 'Weekly': return 52;
        case 'Daily': return 260;
        case 'Hourly': return 2080;
        default: return 1;
      }
    });

    const totalCapitalGains = computed(() =>
      (capitalGainsBeforeJune25.value || 0) + (capitalGainsAfterJune25.value || 0)
    );
    const taxableCapitalGains = computed(() => 0.5 * totalCapitalGains.value);

    const grossedUpEligibleDividends = computed(() =>
      (eligibleDividends.value || 0) * 1.38
    );
    const grossedUpIneligibleDividends = computed(() =>
      (ineligibleDividends.value || 0) * 1.15
    );

    const federalDividendTaxCredit = computed(() => {
      const fedEligibleCredit = 0.1502 * grossedUpEligibleDividends.value;
      const fedIneligibleCredit = 0.09 * grossedUpIneligibleDividends.value;
      return fedEligibleCredit + fedIneligibleCredit;
    });

    const regularIncome = computed(() =>
      (income.value || 0) +
      (selfEmploymentIncome.value || 0) +
      (otherIncome.value || 0)
    );

    const annualRegularIncome = computed(() => regularIncome.value * periodMultiplier.value);
    const annualTaxableCapitalGains = computed(() => taxableCapitalGains.value * periodMultiplier.value);
    const annualRrspDeduction = computed(() => (rrspDeduction.value || 0) * periodMultiplier.value);

    function calculateBracketTax(taxable, brackets) {
      let tax = 0;
      let previousUpTo = 0;
      for (const bracket of brackets) {
        if (taxable > bracket.upTo) {
          const slice = bracket.upTo - previousUpTo;
          tax += slice * bracket.rate;
          previousUpTo = bracket.upTo;
        } else {
          const slice = taxable - previousUpTo;
          tax += slice * bracket.rate;
          break;
        }
      }
      return Math.max(tax, 0);
    }

    // Federal + Provincial BPA
    const effectiveFederalBPA = computed(() => {
      if (maritalStatus.value === 'Married or Common-Law') {
        return federalBasicPersonalAmount.value + 12500;
      }
      return federalBasicPersonalAmount.value;
    });
    const effectiveProvincialBPA = computed(() => {
      if (!selectedRegion.value) return 0;
      const basePA = provincialBasicPersonalAmounts.value[selectedRegion.value] || 0;
      if (maritalStatus.value === 'Married or Common-Law') {
        return basePA + 9000; // approximate
      }
      return basePA;
    });

    // Simple child credit
    const childCredit = computed(() => {
      const numKids = numberOfChildrenUnder18.value || 0;
      return 2000 * numKids;
    });

    // Full Fed Taxable
    const totalFederalTaxableIncome = computed(() => {
      let base = annualRegularIncome.value +
        annualTaxableCapitalGains.value +
        (grossedUpEligibleDividends.value * periodMultiplier.value) +
        (grossedUpIneligibleDividends.value * periodMultiplier.value);
      base -= annualRrspDeduction.value;
      return Math.max(0, base);
    });

    // Fed Tax
    const netFederalTaxAnnual = computed(() => {
      if (totalFederalTaxableIncome.value <= 0) return 0;
      let fedTaxable = totalFederalTaxableIncome.value - effectiveFederalBPA.value;
      fedTaxable = Math.max(fedTaxable, 0);
      let fedTax = calculateBracketTax(fedTaxable, federalTaxBrackets.value);
      fedTax -= federalDividendTaxCredit.value * periodMultiplier.value;
      fedTax -= childCredit.value;
      return Math.max(fedTax, 0);
    });

    // Provincial
    const netProvincialTaxAnnual = computed(() => {
      if (!selectedRegion.value || totalFederalTaxableIncome.value <= 0) return 0;
      const brackets = provincialTaxBrackets.value[selectedRegion.value];
      if (!brackets) return 0;
      let provTaxable = totalFederalTaxableIncome.value - effectiveProvincialBPA.value;
      provTaxable = Math.max(provTaxable, 0);
      let provTax = calculateBracketTax(provTaxable, brackets);
      return Math.max(provTax, 0);
    });

    // CPP/QPP
    const annualCppMax = 3754.45;
    const annualCppMaxSelfEmployed = 3754.45 * 2;
    const pensionPlanContributionAnnual = computed(() => {
      const baseIncome = annualRegularIncome.value;
      const isSelfEmployed = (selfEmploymentIncome.value || 0) > 0;
      const rate = isSelfEmployed ? 0.114 : 0.057;
      const maxContrib = isSelfEmployed ? annualCppMaxSelfEmployed : annualCppMax;
      return Math.min(baseIncome * rate, maxContrib);
    });

    // EI
    const annualEiMax = 1002.45;
    const eiPremiumAnnual = computed(() => {
      return Math.min(annualRegularIncome.value * 0.0163, annualEiMax);
    });

    // Net Income
    const netIncomeAfterCreditsAnnual = computed(() => {
      const totalTax = netFederalTaxAnnual.value + netProvincialTaxAnnual.value
        + pensionPlanContributionAnnual.value + eiPremiumAnnual.value;
      // For net, approximate using the sum of actual (non-grossed) dividends + half CG + T4.
      const totalGrossAnnual =
        annualRegularIncome.value +
        annualTaxableCapitalGains.value +
        (eligibleDividends.value || 0) * periodMultiplier.value +
        (ineligibleDividends.value || 0) * periodMultiplier.value;
      const net = totalGrossAnnual - totalTax;
      return Math.max(net, 0);
    });

    // Per-period
    const netFederalTaxPerPeriod = computed(() => netFederalTaxAnnual.value / periodMultiplier.value);
    const netProvincialTaxPerPeriod = computed(() => netProvincialTaxAnnual.value / periodMultiplier.value);
    const pensionPlanContributionPerPeriod = computed(() =>
      pensionPlanContributionAnnual.value / periodMultiplier.value
    );
    const eiPremiumPerPeriod = computed(() => eiPremiumAnnual.value / periodMultiplier.value);
    const netIncomeAfterCreditsPerPeriod = computed(() =>
      netIncomeAfterCreditsAnnual.value / periodMultiplier.value
    );

    const totalTaxPerPeriod = computed(() =>
      netFederalTaxPerPeriod.value +
      netProvincialTaxPerPeriod.value +
      pensionPlanContributionPerPeriod.value +
      eiPremiumPerPeriod.value
    );

    // % breakdown
    const baseForPercent = computed(() => {
      return (
        annualRegularIncome.value +
        annualTaxableCapitalGains.value +
        (eligibleDividends.value || 0) * periodMultiplier.value +
        (ineligibleDividends.value || 0) * periodMultiplier.value
      );
    });
    const federalTaxPercentage = computed(() => {
      if (baseForPercent.value <= 0) return '0.0';
      return ((netFederalTaxAnnual.value / baseForPercent.value) * 100).toFixed(1);
    });
    const provincialTaxPercentage = computed(() => {
      if (baseForPercent.value <= 0) return '0.0';
      return ((netProvincialTaxAnnual.value / baseForPercent.value) * 100).toFixed(1);
    });
    const cppTaxPercentage = computed(() => {
      if (baseForPercent.value <= 0) return '0.0';
      return ((pensionPlanContributionAnnual.value / baseForPercent.value) * 100).toFixed(1);
    });
    const eiTaxPercentage = computed(() => {
      if (baseForPercent.value <= 0) return '0.0';
      return ((eiPremiumAnnual.value / baseForPercent.value) * 100).toFixed(1);
    });

    const canCalculate = computed(() => {
      return !!selectedRegion.value &&
        (
          (income.value && income.value > 0) ||
          (selfEmploymentIncome.value && selfEmploymentIncome.value > 0) ||
          (capitalGainsBeforeJune25.value && capitalGainsBeforeJune25.value > 0) ||
          (capitalGainsAfterJune25.value && capitalGainsAfterJune25.value > 0) ||
          (eligibleDividends.value && eligibleDividends.value > 0) ||
          (ineligibleDividends.value && ineligibleDividends.value > 0) ||
          (otherIncome.value && otherIncome.value > 0)
        );
    });

    const getSortingDescription = computed(() => {
      if (!sortOrder.value) return 'None';
      return sortOrder.value === 'asc' ? 'Ascending' : 'Descending';
    });

    /***************************************
     *  FEDERAL BUDGET ALLOCATION FOR CHART
     ***************************************/
    const totalBudget = computed(() =>
      budgetCategories.value.reduce((sum, cat) => sum + cat.amount, 0)
    );
    const federalBudgetData = computed(() => {
      if (netFederalTaxPerPeriod.value === 0) {
        return budgetCategories.value.map((cat) => ({
          category: cat.name,
          amount: 0,
        }));
      }
      return budgetCategories.value.map((cat) => ({
        category: cat.name,
        amount: (netFederalTaxPerPeriod.value * cat.amount) / totalBudget.value,
      }));
    });

    // Filtered
    const filteredBudgetData = computed(() => {
      if (!selectedAllocationCategories.value.length) {
        return federalBudgetData.value;
      }
      return federalBudgetData.value.filter(item =>
        selectedAllocationCategories.value.includes(item.category)
      );
    });

    // Sorted for "Budget Categories" display
    const sortedBudgetData = computed(() => {
      const data = [...filteredBudgetData.value];
      data.sort((a, b) => {
        return sortOrder.value === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      });
      return data.map((item, index) => ({
        ...item,
        ...budgetCategories.value.find((c) => c.name === item.category),
        uniqueId: `${item.category}-${index}`,
      }));
    });

    // Table for "Total Federal Tax Allocated"
    const sortedBudgetCategories = computed(() => {
      const categoriesCopy = [...budgetCategories.value];
      categoriesCopy.forEach(cat => {
        const allocated = (netFederalTaxPerPeriod.value * cat.amount) / totalBudget.value;
        cat.allocatedAmount = allocated || 0;
        cat.percentage = netFederalTaxPerPeriod.value
          ? (allocated / netFederalTaxPerPeriod.value) * 100
          : 0;
      });
      return categoriesCopy.sort((a, b) =>
        sortOrder.value === 'asc'
          ? a.allocatedAmount - b.allocatedAmount
          : b.allocatedAmount - a.allocatedAmount
      );
    });

    /***************************************
     *   BUDGET 2024 PIE CHART
     ***************************************/
    const budget2024DataComputed = computed(() => {
      const total = baseBudget2024Data.value.reduce((acc, cat) => acc + cat.amount, 0);
      if (total === 0) {
        return baseBudget2024Data.value.map((c) => ({
          category: c.category,
          amount: 0,
        }));
      }
      return baseBudget2024Data.value.map((c) => ({
        category: c.category,
        amount: (c.amount / total) * netFederalTaxPerPeriod.value,
      }));
    });

    /***************************************
     *             CHART DATA
     ***************************************/
    const taxPieChartData = computed(() => {
      if (!canCalculate.value) {
        return { labels: [], datasets: [] };
      }
      return {
        labels: [
          'Federal Tax',
          'Provincial Tax',
          'CPP/QPP',
          'EI',
          'Net Income',
        ],
        datasets: [
          {
            label: 'Tax Breakdown',
            data: [
              netFederalTaxPerPeriod.value,
              netProvincialTaxPerPeriod.value,
              pensionPlanContributionPerPeriod.value,
              eiPremiumPerPeriod.value,
              netIncomeAfterCreditsPerPeriod.value,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderWidth: 1,
          },
        ],
      };
    });

    const federalBudgetPieChartData = computed(() => ({
      labels: federalBudgetData.value.map((x) => x.category),
      datasets: [
        {
          label: 'Federal Budget Allocation',
          data: federalBudgetData.value.map((x) => x.amount),
          backgroundColor: generateColors(federalBudgetData.value.length),
          borderWidth: 1,
        },
      ],
    }));

    const budget2024PieChartData = computed(() => ({
      labels: budget2024DataComputed.value.map((x) => x.category),
      datasets: [
        {
          label: 'Budget 2024 Allocation',
          data: budget2024DataComputed.value.map((x) => x.amount),
          backgroundColor: generateColors(budget2024DataComputed.value.length),
          borderWidth: 1,
        },
      ],
    }));

    /***************************************
     *            LIFE CYCLE
     ***************************************/
    onMounted(() => {
      updateAllCharts();
    });

    onBeforeUnmount(() => {
      if (federalBudgetChart) federalBudgetChart.destroy();
      if (budget2024Chart) budget2024Chart.destroy();
      if (taxPieChart) taxPieChart.destroy();
    });

    /***************************************
     *             WATCHERS
     ***************************************/
    watch(
      [
        taxPieChartData,
        federalBudgetPieChartData,
        budget2024PieChartData,
        canCalculate,
      ],
      () => {
        nextTick(() => {
          updateAllCharts();
        });
      }
    );

    /***************************************
     *             METHODS
     ***************************************/
    function selectSalaryRate(value) {
      salaryRate.value = value;
    }

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

    function formatCurrency(value) {
      const number = Number(value);
      if (isNaN(number)) {
        return '$0.00';
      }
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    }

    function formatBudget(value) {
      if (typeof value !== 'number' || isNaN(value)) {
        return '$0';
      }
      if (value >= 1e9) {
        return `${(value / 1e9).toFixed(0)}B`;
      } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(0)}M`;
      }
      return formatCurrency(value);
    }

    function generateColors(count) {
      const predefinedColors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#E7E9ED',
        '#76A346',
        '#F4C430',
        '#D2691E',
      ];
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(predefinedColors[i % predefinedColors.length]);
      }
      return colors;
    }

    // Reusable callbacks for pie chart labels & tooltips (show $ and %).
    function createPieChartOptions(titleText) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (!data || !data.datasets.length) return [];
                const dataset = data.datasets[0];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                return data.labels.map((label, i) => {
                  const val = dataset.data[i];
                  const perc = total ? ((val / total) * 100).toFixed(2) : '0.00';
                  return {
                    text: `${label}: $${val.toLocaleString('en-CA', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} (${perc}%)`,
                    fillStyle: dataset.backgroundColor[i],
                    hidden: false,
                    index: i,
                  };
                });
              },
            },
          },
          title: {
            display: true,
            text: titleText,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const ds = ctx.dataset.data;
                const total = ds.reduce((a, b) => a + b, 0);
                const perc = total ? ((val / total) * 100).toFixed(2) : '0.00';
                const formattedVal = val.toLocaleString('en-CA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            return `${ctx.label}: $${formattedVal} (${perc}%)`;
              },
            },
          },
        },
      };
    }

    function updateAllCharts() {
      updateTaxChart();
      updateFederalBudgetChart();
      updateBudget2024Chart();
    }

    function updateTaxChart() {
      if (!taxPieChartRef.value) return;
      if (taxPieChart) {
        taxPieChart.destroy();
        taxPieChart = null;
      }
      if (!canCalculate.value || !taxPieChartData.value.datasets?.length) return;
      const ctx = taxPieChartRef.value.getContext('2d');
      taxPieChart = new Chart(ctx, {
        type: 'pie',
        data: taxPieChartData.value,
        options: createPieChartOptions('Tax Breakdown'),
      });
    }

    function updateFederalBudgetChart() {
      if (!federalBudgetPieChartRef.value) return;
      if (federalBudgetChart) {
        federalBudgetChart.destroy();
        federalBudgetChart = null;
      }
      const data = federalBudgetPieChartData.value;
      if (!data.datasets?.length) return;
      const ctx = federalBudgetPieChartRef.value.getContext('2d');
      federalBudgetChart = new Chart(ctx, {
        type: 'pie',
        data,
        options: createPieChartOptions('Federal Budget Allocation'),
      });
    }

    function updateBudget2024Chart() {
      if (!budget2024PieChartRef.value) return;
      if (budget2024Chart) {
        budget2024Chart.destroy();
        budget2024Chart = null;
      }
      const data = budget2024PieChartData.value;
      if (!data.datasets?.length) return;
      const ctx = budget2024PieChartRef.value.getContext('2d');
      budget2024Chart = new Chart(ctx, {
        type: 'pie',
        data,
        options: createPieChartOptions('Budget 2024 Allocation'),
      });
    }

    // PDF Export
    async function exportToPDF() {
      try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let currentHeight = margin;

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(
          'Canada Income Tax & Federal Budget Breakdown (Approx)',
          pageWidth / 2,
          currentHeight,
          { align: 'center' }
        );
        currentHeight += 12;

        // Date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const exportDate = new Date().toLocaleDateString('en-CA');
        doc.text(`Export Date: ${exportDate}`, margin, currentHeight);
        currentHeight += 8;

        // Divider
        doc.setDrawColor(200);
        doc.line(margin, currentHeight, pageWidth - margin, currentHeight);
        currentHeight += 5;

        // Tax Calculations Table
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tax Calculations', margin, currentHeight);
        currentHeight += 8;

        const taxCalcData = [
          ['Federal Tax Per Period', formatCurrency(netFederalTaxPerPeriod.value)],
          ['Provincial Tax Per Period', formatCurrency(netProvincialTaxPerPeriod.value)],
          ['CPP/QPP Per Period', formatCurrency(pensionPlanContributionPerPeriod.value)],
          ['EI Premium Per Period', formatCurrency(eiPremiumPerPeriod.value)],
          ['Net Income Per Period', formatCurrency(netIncomeAfterCreditsPerPeriod.value)],
        ];

        autoTable(doc, {
          startY: currentHeight,
          head: [['Description', 'Amount']],
          body: taxCalcData,
          theme: 'grid',
          styles: { fontSize: 12, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: margin, right: margin },
        });
        currentHeight = doc.previousAutoTable.finalY + 10;

        // Federal Budget Allocation for Budget Categories
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Federal Tax Allocated', margin, currentHeight);
        currentHeight += 8;

        // We pull from sortedBudgetCategories, which has allocatedAmount & percentage
        const allocatedRows = sortedBudgetCategories.value.map(cat => [
          cat.name,
          formatCurrency(cat.allocatedAmount),
          cat.percentage.toFixed(2) + '%',
        ]);

        autoTable(doc, {
          startY: currentHeight,
          head: [['Category', 'Allocated Amount', 'Percentage']],
          body: allocatedRows,
          theme: 'grid',
          styles: { fontSize: 12, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: margin, right: margin },
        });
        currentHeight = doc.previousAutoTable.finalY + 10;

        doc.save('Tax_and_Budget_Breakdown_Approx.pdf');
      } catch (err) {
        console.error('Error generating PDF:', err);
      }
    }

    /***************************************
     *         RETURN TO TEMPLATE
     ***************************************/
    return {
      // Refs
      taxPieChartRef,
      federalBudgetPieChartRef,
      budget2024PieChartRef,

      // Basic Inputs
      income,
      selfEmploymentIncome,
      rrspDeduction,
      capitalGainsBeforeJune25,
      capitalGainsAfterJune25,
      eligibleDividends,
      ineligibleDividends,
      otherIncome,

      // Personal Info
      selectedRegion,
      salaryRate,
      maritalStatus,
      numberOfDependents,
      numberOfChildrenUnder18,
      numberOfDependentsWithDisabilities,

      // Sorting & Allocation
      allExpanded,
      sortOrder,
      selectedAllocationCategories,

      // Arrays & Data
      salaryOptions,
      regions,
      allocationCategories,
      budgetCategories,
      baseBudget2024Data,

      // Computed
      canCalculate,
      netFederalTaxPerPeriod,
      netProvincialTaxPerPeriod,
      pensionPlanContributionPerPeriod,
      eiPremiumPerPeriod,
      netIncomeAfterCreditsPerPeriod,
      totalTaxPerPeriod,
      federalTaxPercentage,
      provincialTaxPercentage,
      cppTaxPercentage,
      eiTaxPercentage,
      getSortingDescription,
      filteredBudgetData,
      sortedBudgetData,
      sortedBudgetCategories,

      // Methods
      selectSalaryRate,
      toggleDescription,
      toggleAll,
      toggleSortAmount,
      exportToPDF,
      formatCurrency,
      formatBudget,
    };
  },
});
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
  margin-bottom: 10px;
  font-weight: 600;
  text-align: center;
}

.subtitle {
  font-size: 18px;
  color: #7f8c8d;
  margin-bottom: 20px;
  text-align: center;
}

.section-title {
  color: #34495e;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: 600;
  text-align: center;
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
  transition: background-color 0.3s, color 0.3s;
  font-weight: 500;
}

.salary-option.active {
  background-color: #27ae60;
  color: #ffffff;
  font-weight: 600;
}

.salary-option:hover {
  background-color: #27ae60;
  color: #ffffff;
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
}

.select-region,
.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
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
}

.tax-pie-chart-container canvas {
  max-width: 100%;
  height: 100% !important;
}

.federal-budget-section .pie-chart-item,
.budget-pie-charts-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.pie-chart-item {
  flex: 0 0 auto;
  min-width: 500px;
  max-width: 500px;
  height: 500px;
  width: 500px;
  margin: 40px auto;
  position: relative;
}

.pie-chart-item canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 992px) {
  .pie-chart-item {
    min-width: 400px;
    max-width: 400px;
    height: 400px;
    width: 400px;
  }
}

@media (max-width: 768px) {
  .pie-chart-item {
    min-width: 300px;
    max-width: 300px;
    height: 300px;
    width: 300px;
  }
}

.allocation-total {
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
}

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
  font-style: italic;
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  border-top: 1px solid #bdc3c7;
}
</style>


