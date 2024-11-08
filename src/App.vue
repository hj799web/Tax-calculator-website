<!-- src/App.vue -->
<template>
  <div class="main-container">
    <h1 class="main-title">Canada Income Tax Calculator</h1>
    <p class="subtitle">
      Just enter a few numbers, and we'll quickly show you your tax rates, deductions, and estimate your 2024 refund or taxes owed!
    </p>

    <!-- Salary Rate Selector Section -->
    <h3 class="section-title">Salary Rate Selector</h3>
    <div class="salary-selector-wrapper">
      <div class="salary-selector">
        <div
          v-for="option in salaryOptions"
          :key="option.value"
          :class="['salary-option', { active: salaryRate === option.value }]"
          @click="selectSalaryRate(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>

    <div class="calculator-wrapper">
      <div class="calculator-container">
        <h2 class="title">Estimate Your Taxes</h2>
        <p class="description">
          Calculate your federal and provincial taxes to estimate your net income.
        </p>
        <div class="input-group">
          <select class="select-region" v-model="selectedRegion">
            <option disabled value="">Select Your Province or Territory</option>
            <option v-for="region in regions" :key="region">{{ region }}</option>
          </select>
          <input
            class="input-field"
            v-model.number="income"
            :placeholder="`Enter your ${salaryRate.toLowerCase()} employment income`"
            type="number"
            min="0"
          />
        </div>

        <!-- Additional Income Sources -->
        <h3 class="section-title">Additional Income Sources</h3>
        <div class="input-group additional-income">
          <label class="input-label">Self-Employment Income:</label>
          <input
            class="input-field"
            v-model.number="selfEmploymentIncome"
            type="number"
            min="0"
            placeholder="Enter self-employment income"
          />
          <label class="input-label">Capital Gains Before June 25, 2024:</label>
          <input
            class="input-field"
            v-model.number="capitalGainsBeforeJune25"
            type="number"
            min="0"
            placeholder="Enter capital gains before June 25, 2024"
          />
          <label class="input-label">Capital Gains On/After June 25, 2024:</label>
          <input
            class="input-field"
            v-model.number="capitalGainsAfterJune25"
            type="number"
            min="0"
            placeholder="Enter capital gains on/after June 25, 2024"
          />
          <label class="input-label">Eligible Dividends:</label>
          <input
            class="input-field"
            v-model.number="eligibleDividends"
            type="number"
            min="0"
            placeholder="Enter eligible dividends"
          />
          <label class="input-label">Ineligible Dividends:</label>
          <input
            class="input-field"
            v-model.number="ineligibleDividends"
            type="number"
            min="0"
            placeholder="Enter ineligible dividends"
          />
          <label class="input-label">Other Income:</label>
          <input
            class="input-field"
            v-model.number="otherIncome"
            type="number"
            min="0"
            placeholder="Enter other income"
          />
        </div>

        <!-- Deductions and Credits -->
        <h3 class="section-title">Deductions and Credits</h3>
        <div class="input-group">
          <label class="input-label">RRSP and FHSA Deductions:</label>
          <input
            class="input-field"
            v-model.number="rrspDeduction"
            type="number"
            min="0"
            placeholder="Enter RRSP and FHSA deductions"
          />
          <label class="input-label">Marital Status:</label>
          <select class="input-field" v-model="maritalStatus">
            <option disabled value="">Select your marital status</option>
            <option value="Single">Single</option>
            <option value="Married or Common-Law">Married or Common-Law</option>
          </select>
          <label class="input-label">Number of Dependents:</label>
          <input
            class="input-field"
            v-model.number="numberOfDependents"
            type="number"
            min="0"
            placeholder="Enter number of dependents"
          />
          <label class="input-label">Number of Children Under 18:</label>
          <input
            class="input-field"
            v-model.number="numberOfChildrenUnder18"
            type="number"
            min="0"
            placeholder="Enter number of children under 18"
          />
          <label class="input-label">Dependents with Disabilities:</label>
          <input
            class="input-field"
            v-model.number="numberOfDependentsWithDisabilities"
            type="number"
            min="0"
            placeholder="Enter number of dependents with disabilities"
          />
        </div>
      </div>

      <div class="result-box">
        <h2 class="result-title">Your Tax Breakdown</h2>
        <div v-if="canCalculate" ref="taxBreakdown">
          <div class="result-item">
            <span>Federal Tax:</span>
            <strong>{{ formatCurrency(netFederalTax) }} ({{ federalTaxPercentage }}%)</strong>
          </div>
          <div class="result-item">
            <span>Provincial Tax:</span>
            <strong>{{ formatCurrency(netProvincialTax) }} ({{ provincialTaxPercentage }}%)</strong>
          </div>
          <div class="result-item">
            <span>CPP/QPP Contribution:</span>
            <strong>{{ formatCurrency(pensionPlanContribution) }} ({{ cppTaxPercentage }}%)</strong>
          </div>
          <div class="result-item">
            <span>EI Premium:</span>
            <strong>{{ formatCurrency(eiPremium) }} ({{ eiTaxPercentage }}%)</strong>
          </div>
          <div class="result-item total-tax">
            <span>Total Deductions:</span>
            <strong>{{ formatCurrency(totalDeductions) }}</strong>
          </div>
          <div class="result-item">
            <span>Canada Child Benefit (Estimated):</span>
            <strong>{{ formatCurrency(canadaChildBenefit) }}</strong>
          </div>
          <div class="result-item">
            <span>Total Non-Refundable Credits:</span>
            <strong>{{ formatCurrency(totalNonRefundableCredits) }}</strong>
          </div>
          <div class="result-item net-income">
            <span>Net Income After Credits:</span>
            <strong>{{ formatCurrency(netIncomeAfterCredits) }}</strong>
          </div>

          <!-- Export to PDF Button -->
          <button @click="exportToPDF" class="export-button">
            Export as PDF
          </button>

          <!-- Tax Pie Chart with Dynamic Data -->
          <TaxPieChart
            ref="taxPieChart"
            :federalTax="netFederalTax"
            :provincialTax="netProvincialTax"
            :cppContribution="pensionPlanContribution"
            :eiPremium="eiPremium"
            :netIncome="netIncomeAfterCredits"
          />
        </div>
        <div v-else class="placeholder-text">
          <p>Please enter your income and select your province or territory to see the tax breakdown.</p>
        </div>
      </div>
    </div>


    <!-- Federal Budget Breakdown Section -->
    <div class="federal-budget-section">
      <h2 class="section-title">Federal Budget Breakdown</h2>
      <p class="budget-overview">
        The following charts and table illustrate where your tax dollars go in real terms, based on data from the 2022–2023 Canadian federal budget. This fiscal year was focused on stabilizing public finances after the fiscal challenges of the COVID-19 pandemic. Despite economic recovery and increased revenues—driven by higher personal, corporate income taxes, and GST—the government faced a deficit of $35.3 billion. These visuals break down how federal revenues, which totaled $379 billion, were allocated across key spending areas.
      </p>

      
      <!-- Federal Budget Pie Chart placed directly after the paragraph -->
      <FederalBudgetPieChart :budgetData="budgetData" />

       <!-- Allocation of Your Federal Taxes -->
<div v-if="netFederalTax > 0" class="federal-tax-allocation">
  <h2 class="section-title">Allocation of Your Federal Taxes 2022-2023</h2>
  <p class="allocation-description">
    The accompanying charts and tables display how your federal taxes are allocated to various government programs and initiatives, showcasing the tangible financial impact of your contributions. This information is based on the "Public Accounts of Canada 2023" report, which includes the Government of Canada's audited consolidated financial statements for the 2022-2023 fiscal year.
  </p>
  <div class="allocation-total">
    <span>Total Federal Tax Paid:</span>
    <strong>{{ formatCurrency(netFederalTax) }}</strong>
  </div>
  <div class="allocation-filters">
    <label v-for="item in budgetData" :key="item.category" class="filter-label">
      <input
        type="checkbox"
        v-model="selectedAllocationCategories"
        :value="item.category"
      />
      {{ item.category }}
    </label>
  </div>
  <transition-group name="list" tag="div" class="allocation-items">
    <div class="allocation-item" v-for="item in filteredBudgetData" :key="item.category">
      <div class="allocation-info">
        <!-- Removed the icon image -->
        <span>{{ item.category }}:</span>
      </div>
      <div class="allocation-details">
        <strong>{{ formatCurrency(item.amount) }}</strong>
        <span class="allocation-percentage">({{ calculatePercentage(item.amount, netFederalTax) }}%)</span>
      </div>
    </div>
  </transition-group>
</div>
 <!-- Sorting Controls -->
 <div class="sorting-controls">
    <label for="sort-option" class="sorting-label">Sort By:</label>
    <select id="sort-option" v-model="sortOption" class="sorting-select">
      <option value="amount_desc">Amount: High to Low</option>
      <option value="amount_asc">Amount: Low to High</option>
      <option value="percentage_desc">Percentage: High to Low</option>
      <option value="percentage_asc">Percentage: Low to High</option>
    </select>
  </div>
  
  <div class="allocation-total">
    <span>Total Federal Tax Paid:</span>
    <strong>{{ formatCurrency(netFederalTax) }}</strong>
  </div>
  <div class="allocation-filters">
    <label v-for="item in budgetData" :key="item.category" class="filter-label">
      <input
        type="checkbox"
        v-model="selectedAllocationCategories"
        :value="item.category"
      />
      {{ item.category }}
    </label>
  </div>
  <transition-group name="list" tag="div" class="allocation-items">
    <div class="allocation-item" v-for="item in sortedBudgetData" :key="item.category">
      <div class="allocation-info">
        <span>{{ item.category }}:</span>
      </div>
      <div class="allocation-details">
        <strong>{{ formatCurrency(item.amount) }}</strong>
        <span class="allocation-percentage">({{ calculatePercentage(item.amount, netFederalTax) }}%)</span>
      </div>
    </div>
  </transition-group>

  <!-- Display Current Sorting Option -->
<div class="current-sorting">
  <span>Currently Sorted By:</span>
  <strong>{{ getSortingDescription }}</strong>
</div>


  <!-- Budget Categories Title and Explanation -->
  <div class="budget-categories-header">
    <h2 class="budget-categories-title">Detailed Budget Allocation</h2>
    <p class="budget-categories-description">
      Explore how the federal government allocates its budget across various sectors and programs. Click on "Show Details" to learn more about each category and its subcomponents.
    </p>
  </div>

   <!-- Action Buttons: Expand All / Hide All -->
   <div class="budget-action-buttons">
    <button @click="toggleAll" class="toggle-all-button">
      {{ allExpanded ? 'Hide All' : 'Expand All' }}
    </button>
  </div>
  
  
  <!-- Budget Categories -->
  <div class="budget-categories">
    <div class="budget-category" v-for="category in budgetCategories" :key="category.id">
      <h3>{{ category.name }} ({{ formatBudget(category.amount) }})</h3>
      <button @click="toggleDescription(category.id)" class="toggle-description-button">
        {{ category.showDescription ? 'Hide Details' : 'Show Details' }}
      </button>
      <p v-if="category.showDescription">{{ category.description }}</p>
      
      <div v-if="category.subsections && category.showDescription">
        <div v-for="sub in category.subsections" :key="sub.id" class="subsection">
          <h4>{{ sub.name }} – {{ formatBudget(sub.amount) }}</h4>
          <p>{{ sub.description }}</p>
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- Disclaimer -->
    <p class="disclaimer">
      Please note that this tax calculator provides estimates based on the information provided and simplified calculations. Tax laws are complex and subject to change. For accurate and personalized tax advice, users should consult the Canada Revenue Agency (CRA) or a certified tax professional.
    </p>
  </div>
</template>

<script>
import TaxPieChart from './components/TaxPieChart.vue';
import FederalBudgetPieChart from './components/FederalBudgetPieChart.vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'App',
  components: {
    TaxPieChart,
    FederalBudgetPieChart,
  },
  data() {
    return {
      income: null, // Employment income
      selfEmploymentIncome: null,
      rrspDeduction: null,
      capitalGainsBeforeJune25: null,
      capitalGainsAfterJune25: null,
      eligibleDividends: null,
      ineligibleDividends: null,
      otherIncome: null,
      selectedRegion: '',
      salaryRate: 'Annual',
      maritalStatus: '',
      numberOfDependents: 0,
      numberOfChildrenUnder18: 0,
      numberOfDependentsWithDisabilities: 0,
      allExpanded: false,
      sortOption: localStorage.getItem('sortOption') || 'amount_desc',
      selectedAllocationCategories: [],
      salaryOptions: [
        { label: 'Annual', value: 'Annual' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Bi-weekly', value: 'Bi-weekly' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Daily', value: 'Daily' },
        { label: 'Hourly', value: 'Hourly' },
      ],
      regions: [
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
      ],
      federalTaxBrackets: [
        { rate: 0.15, upTo: 53359 },
        { rate: 0.205, upTo: 106717 },
        { rate: 0.26, upTo: 165430 },
        { rate: 0.29, upTo: 235675 },
        { rate: 0.33, upTo: Infinity },
      ],
      provincialTaxBrackets: {
        Alberta: [
          { rate: 0.10, upTo: 142292 },
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
      },
      federalBasicPersonalAmount: 15000,
      provincialBasicPersonalAmounts: {
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
      },
      federalEligibleDependentAmount: 15000,
      provincialEligibleDependentAmounts: {
        Alberta: 21003,
        'British Columbia': 9627,
        Manitoba: 9367,
        'New Brunswick': 9310,
        'Newfoundland and Labrador': 8977,
        'Northwest Territories': 14618,
        'Nova Scotia': 8481,
        Nunavut: 14698,
        Ontario: 9519,
        'Prince Edward Island': 9550,
        Quebec: 0,
        Saskatchewan: 17225,
        Yukon: 15000,
      },
      taxCredits: {
        Canada_Child_Benefit: {},
        Eligible_Dependant_Amount: {
          amounts: {
            single: 496,
            married_or_common_law: 650,
            per_child_under_19: 171,
          },
        },
        Caregiver_Amount: {
          calculation: {
            base_amount: 7500,
            additional_amount_per_dependent: 2500,
            max_dependents: 2,
          },
        },
        Disability_Amount: {
          calculation: {
            base_amount: 8500,
            additional_amount_per_dependent: 3000,
            max_dependents: 2,
          },
        },
      },
      // Budget Categories with Detailed Explanations
      budgetCategories: [
        {
          id: 1,
          name: 'Healthcare',
          amount: 50000000000, // $50 billion
          description:
            'The federal government contributes to provincial and territorial healthcare systems through the Canada Health Transfer (CHT). This supports universal healthcare in Canada, funding hospitals, healthcare workers, and public health services like mental health programs and pandemic response measures. Healthcare represents around 12% of total federal spending.',
          showDescription: false,
        },
        {
          id: 2,
          name: 'Support for Seniors',
          amount: 63000000000, // $63 billion
          description:
            'A major component of the budget, driven by Canada’s aging population. This supports programs like Old Age Security (OAS) and the Guaranteed Income Supplement (GIS), which ensure basic income for seniors. These programs account for around 15% of total federal spending.',
          showDescription: false,
        },
        {
          id: 3,
          name: 'Children and Families',
          amount: 28000000000, // $28 billion
          description:
            'The Canada Child Benefit (CCB) offers income support to low- and middle-income families to help cover the costs of raising children. This benefit plays a crucial role in reducing child poverty and represents about 7% of federal spending.',
          showDescription: false,
        },
        {
          id: 4,
          name: 'Indigenous Services and Reconciliation',
          amount: 26000000000, // $26 billion
          description:
            'This allocation supports Indigenous services, including clean drinking water, housing, healthcare, and educational programs for Indigenous communities. It also funds reconciliation efforts, including land claim settlements and reparations for past injustices. Indigenous services represent around 6% of the total federal budget.',
          showDescription: false,
        },
        {
          id: 5,
          name: 'Employment Insurance and Other Benefits',
          amount: 30000000000, // $30 billion
          description:
            'Funding for Employment Insurance (EI), providing income support to temporarily unemployed workers, new parents, and seasonal employees. This category also includes retraining and skill development programs, making up around 7% of federal spending.',
          showDescription: false,
        },
        {
          id: 6,
          name: 'Defense and Public Safety',
          amount: 35000000000, // $35 billion
          description:
            'Covers spending on the Canadian Armed Forces, military procurement (e.g., ships, aircraft), and public safety programs like border security and cybersecurity. It reflects Canada\'s geopolitical concerns and military commitments, representing about 8% of the total budget.',
          showDescription: false,
        },
        {
          id: 7,
          name: 'Debt Servicing',
          amount: 44000000000, // $44 billion
          description:
            'Payments for the interest on Canada’s national debt, which totaled $1.173 trillion by the end of the fiscal year. The rising cost of debt servicing reflects increasing interest rates, making up around 11% of total spending.',
          showDescription: false,
        },
        {
          id: 8,
          name: 'Public Debt Charges',
          amount: 34900000000, // $34.9 billion
          description:
            'Interest payments on public debt ensure that federal borrowing from previous years is properly managed. This is a non-discretionary part of the budget and represents around 8% of total federal spending.',
          showDescription: false,
        },
        {
          id: 9,
          name: 'Loans, Investments, and Advances',
          amount: 100000000000, // $100 billion
          description:
            'This category can be broken down into various subsections, covering different sectors and financial assistance programs.',
          showDescription: false,
          subsections: [
            {
              id: '9.1',
              name: 'Student Loans',
              amount: 24000000000, // $24 billion
              description:
                'The Canada Student Financial Assistance Program provides student loans to make post-secondary education more accessible. The government helps students manage educational costs, and these loans often come with favorable repayment terms. While total loans exceed $24 billion, annual allocations reflect the government’s commitment to improving education access.',
            },
            {
              id: '9.2',
              name: 'Agriculture Loans',
              amount: 162000000, // $162 million
              description:
                'Through programs like the Agri-Recovery Program, the government provides loans to farmers affected by disasters. This support helps stabilize the agricultural sector, especially in the wake of unforeseen events like natural disasters, droughts, or market disruptions.',
            },
            {
              id: '9.3',
              name: 'International Development and Loans',
              amount: 53000000000, // $53 billion
              description:
                'Canada contributes significantly to international development through loans and grants to various global organizations and developing countries. This includes:\n' +
                '• Asian Infrastructure Investment Bank (AIIB): Canada’s subscription to AIIB amounts to $995.4 million USD, with $199.1 million USD in paid-in capital.\n' +
                '• European Bank for Reconstruction and Development (EBRD): Canada has subscribed to 1.02 billion EUR in the EBRD, with about 21% paid in.\n' +
                '• World Bank and International Development Association (IDA): Canada has subscribed to $8.5 billion USD in the World Bank and has committed $14.7 billion CAD to the International Development Association (IDA), supporting development projects in low-income countries.\n' +
                'This funding supports global development, infrastructure projects, and poverty reduction in developing nations.',
            },
            {
              id: '9.4',
              name: 'Business and Innovation Loans',
              amount: 600000000, // $600 million
              description:
                'The government provides financial backing to innovation and infrastructure projects through loans and investments in Canadian businesses. For instance, funding through the Universal Broadband Fund and investments in companies like Telesat support technological advancements and economic growth.',
            },
            {
              id: '9.5',
              name: 'Defense Sector Loans and Investments',
              amount: 473249317, // 473 million
              description:
                'Loans and financial advances in the defense sector support the procurement of military equipment and technology. This investment is crucial for maintaining and upgrading Canada\'s defense capabilities in line with modern standards and commitments.',
            },
            {
              id: '9.6',
              name: 'Economic Development Loans – Miscellaneous',
              amount:  3688695017, // 3.68 billion
              description:
                'These loans and advances support various economic development projects across Canada, including regional development programs, small business loans, and investments in innovation. Specific examples include funding for Natural Products Canada and Pratt & Whitney Canada Corp, contributing to industrial growth. ',
            },
          ],
        },
        {
          id: 10,
          name: 'Other Government Operations',
          amount: 100000000000, // ~$100 billion
          description:
            'This category includes the operational spending necessary to maintain the day-to-day functions of the federal government. It can be broken down into several specific subsections.',
          showDescription: false,
          subsections: [
            {
              id: '10.1',
              name: 'Transportation Infrastructure',
              amount: 15000000000, // $15 billion
              description:
                'This covers investments in national transportation infrastructure, including roadways, bridges, ports, and rail systems. It supports trade routes, safe transportation, and infrastructure expansion, ensuring efficient mobility for goods and people.',
            },
            {
              id: '10.2',
              name: 'Environmental Programs',
              amount: 8000000000, // $8 billion
              description:
                'Funds dedicated to climate change initiatives, conservation efforts, and environmental protection. This includes clean energy programs, nature conservation, and efforts to reduce greenhouse gas emissions in line with international commitments.',
            },
            {
              id: '10.3',
              name: 'Public Safety and Emergency Preparedness',
              amount: 9000000000, // $9 billion
              description:
                'This includes funding for national security agencies like the RCMP and Canada Border Services Agency (CBSA). It ensures Canada’s ability to respond to emergencies, disasters, and public safety threats.',
            },
            {
              id: '10.4',
              name: 'Government Buildings and Properties',
              amount: 7000000000, // $7 billion
              description:
                'The maintenance, repair, and construction of government buildings, federal offices, military bases, and parliamentary buildings fall under this category. These properties support essential government services and public sector functions.',
            },
            {
              id: '10.5',
              name: 'Research and Innovation',
              amount: 10000000000, // $10 billion
              description:
                'Investments in research and development across various sectors, including healthcare, aerospace, and technology. Funding goes to programs like the Innovation Superclusters and partnerships with universities, contributing to scientific and technological advances.',
            },
            {
              id: '10.6',
              name: 'Digital Government and IT Infrastructure',
              amount: 5000000000, // $5 billion
              description:
                'This investment modernizes federal government digital services and IT infrastructure. It enhances cybersecurity, improves digital public services (e.g., tax filing, immigration services), and strengthens inter-departmental communications.',
            },
            {
              id: '10.7',
              name: 'Federal Employee Salaries and Benefits',
              amount: 35000000000, // $35 billion
              description:
                'This category funds the salaries, pensions, and benefits of over 300,000 federal employees, including civil servants and military personnel, ensuring the government operates smoothly across departments and agencies.',
            },
            {
              id: '10.8',
              name: 'Legal and Justice System',
              amount: 5000000000, // $5 billion
              description:
                'Supports the functioning of the national legal and justice system, including federal courts, legal aid, and justice reform programs. The Department of Justice Canada ensures access to justice for all Canadians.',
            },
            {
              id: '10.9',
              name: 'Indigenous Services Operational Expenses',
              amount: 4000000000, // $4 billion
              description:
                'Operational costs for Indigenous Services Canada, which oversees the administration of programs such as healthcare, education, and infrastructure for Indigenous communities.',
            },
            {
              id: '10.10',
              name: 'Cultural and Heritage Programs',
              amount: 2000000000, // $2 billion
              description:
                'Funding for national cultural institutions like the Canada Council for the Arts, Canadian Broadcasting Corporation (CBC), and National Film Board. This category supports Canada’s arts, culture, and heritage preservation efforts.',
            },
            {
              id: '10.11',
              name: 'Scientific Research and Development (R&D)',
              amount: 5000000000, // $5 billion
              description:
                'Funding for scientific research, including agriculture, biotechnology, healthcare, and environmental sustainability. The government supports research through agencies like the National Research Council (NRC).',
            },
            {
              id: '10.12',
              name: 'Diplomatic and International Representation',
              amount: 5000000000, // $5 billion
              description:
                'This covers the operational costs of Global Affairs Canada, including embassies, consulates, and diplomatic missions. It supports Canada’s global diplomatic presence and international relations.',
            },
          ],
        },
        // ... other budget categories ...
      ],
    };
  },
  computed: {
    canCalculate() {
      return (
        this.selectedRegion &&
        (this.income !== null ||
          this.selfEmploymentIncome !== null ||
          this.capitalGainsBeforeJune25 !== null ||
          this.capitalGainsAfterJune25 !== null ||
          this.eligibleDividends !== null ||
          this.ineligibleDividends !== null ||
          this.otherIncome !== null)
      );
    },
    totalIncome() {
      const incomeValue = this.income || 0;
      const employmentIncome =
        this.salaryRate === 'Annual'
          ? incomeValue
          : this.salaryRate === 'Monthly'
          ? incomeValue * 12
          : this.salaryRate === 'Bi-weekly'
          ? incomeValue * 26
          : this.salaryRate === 'Weekly'
          ? incomeValue * 52
          : this.salaryRate === 'Daily'
          ? incomeValue * 260
          : this.salaryRate === 'Hourly'
          ? incomeValue * 2080
          : 0;

      return (
        employmentIncome +
        (this.selfEmploymentIncome || 0) +
        (this.capitalGainsBeforeJune25 || 0) +
        (this.capitalGainsAfterJune25 || 0) +
        (this.eligibleDividends || 0) +
        (this.ineligibleDividends || 0) +
        (this.otherIncome || 0)
      );
    },
    totalDeductions() {
      return this.rrspDeduction || 0;
    },
    taxableIncome() {
      const income = this.totalIncome - this.totalDeductions;
      return income > 0 ? income : 0;
    },
    netFederalTax() {
      const tax = this.calculateFederalTax(this.taxableIncome);
      return isNaN(tax) ? 0 : tax;
    },
    netProvincialTax() {
      const tax = this.calculateProvincialTax(this.taxableIncome);
      return isNaN(tax) ? 0 : tax;
    },
    pensionPlanContribution() {
      const contribution = this.totalIncome * 0.057;
      const maxContribution = 3754.45;
      const value = Math.min(contribution, maxContribution);
      return isNaN(value) ? 0 : value;
    },
    eiPremium() {
      const premium = this.totalIncome * 0.0158;
      const maxPremium = 889.54;
      const value = Math.min(premium, maxPremium);
      return isNaN(value) ? 0 : value;
    },
    netIncome() {
      const income =
        this.taxableIncome -
        this.netFederalTax -
        this.netProvincialTax -
        this.pensionPlanContribution -
        this.eiPremium;
      return income > 0 ? income : 0;
    },
    federalTaxPercentage() {
      if (this.taxableIncome === 0) return 0;
      return ((this.netFederalTax / this.taxableIncome) * 100).toFixed(1);
    },
    provincialTaxPercentage() {
      if (this.taxableIncome === 0) return 0;
      return ((this.netProvincialTax / this.taxableIncome) * 100).toFixed(1);
    },
    cppTaxPercentage() {
      if (this.taxableIncome === 0) return 0;
      return ((this.pensionPlanContribution / this.taxableIncome) * 100).toFixed(1);
    },
    eiTaxPercentage() {
      if (this.taxableIncome === 0) return 0;
      return ((this.eiPremium / this.taxableIncome) * 100).toFixed(1);
    },
    canadaChildBenefit() {
      if (this.numberOfChildrenUnder18 === 0) return 0;
      const baseAmountPerChild = 6800;
      const familyNetIncome = this.totalIncome - this.totalDeductions;
      const reductionThreshold = 34000;
      let ccb = baseAmountPerChild * this.numberOfChildrenUnder18;
      if (familyNetIncome > reductionThreshold) {
        const excessIncome = familyNetIncome - reductionThreshold;
        const reductionRate = 0.07;
        const reduction = excessIncome * reductionRate;
        ccb -= reduction;
      }
      return ccb > 0 ? ccb : 0;
    },
    totalNonRefundableCredits() {
      let totalCredits = 0;
      if (this.numberOfDependents > 0) {
        const amount =
          this.maritalStatus === 'Single'
            ? this.taxCredits.Eligible_Dependant_Amount.amounts.single
            : this.taxCredits.Eligible_Dependant_Amount.amounts.married_or_common_law;
        totalCredits += amount;
        totalCredits +=
          this.numberOfDependents * this.taxCredits.Eligible_Dependant_Amount.amounts.per_child_under_19;
      }
      if (this.numberOfDependentsWithDisabilities > 0) {
        const caregiver = this.taxCredits.Caregiver_Amount.calculation;
        const dependents = Math.min(
          this.numberOfDependentsWithDisabilities,
          caregiver.max_dependents
        );
        totalCredits += caregiver.base_amount;
        totalCredits += caregiver.additional_amount_per_dependent * dependents;
      }
      if (this.numberOfDependentsWithDisabilities > 0) {
        const disability = this.taxCredits.Disability_Amount.calculation;
        const dependents = Math.min(
          this.numberOfDependentsWithDisabilities,
          disability.max_dependents
        );
        totalCredits += disability.base_amount;
        totalCredits += disability.additional_amount_per_dependent * dependents;
      }
      return totalCredits;
    },
    netIncomeAfterCredits() {
      const totalTax =
        this.netFederalTax +
        this.netProvincialTax +
        this.pensionPlanContribution +
        this.eiPremium -
        this.totalNonRefundableCredits;
      const income = this.taxableIncome - totalTax;
      return income > 0 ? income : 0;
    },
    // Computed property for budgetData based on netFederalTax
    budgetData() {
      const totalBudget = this.budgetCategories.reduce((sum, cat) => sum + cat.amount, 0);
      if (this.netFederalTax === 0) {
        return this.budgetCategories.map(cat => ({
          category: cat.name,
          amount: 0,
        }));
      }
      return this.budgetCategories.map(cat => ({
        category: cat.name,
        amount: (this.netFederalTax * cat.amount) / totalBudget,
      }));
    },
    filteredBudgetData() {
      if (this.selectedAllocationCategories.length === 0) {
        return this.budgetData;
      }
      return this.budgetData.filter(item => this.selectedAllocationCategories.includes(item.category));
    },
  },

  sortedBudgetData() {
    // Clone the filteredBudgetData to avoid mutating the original array
    let sortedData = [...this.filteredBudgetData];
    
    switch(this.sortOption) {
      case 'amount_desc':
        sortedData.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount_asc':
        sortedData.sort((a, b) => a.amount - b.amount);
        break;
      case 'percentage_desc':
        sortedData.sort((a, b) => {
          let percA = this.calculatePercentage(a.amount, this.netFederalTax);
          let percB = this.calculatePercentage(b.amount, this.netFederalTax);
          return percB - percA;
        });
        break;
      case 'percentage_asc':
        sortedData.sort((a, b) => {
          let percA = this.calculatePercentage(a.amount, this.netFederalTax);
          let percB = this.calculatePercentage(b.amount, this.netFederalTax);
          return percA - percB;
        });
        break;
      default:
        // Default to amount descending if sortOption is unrecognized
        sortedData.sort((a, b) => b.amount - a.amount);
    }

    return sortedData;
  },
  getSortingDescription() {
    switch(this.sortOption) {
      case 'amount_desc':
        return 'Amount: High to Low';
      case 'amount_asc':
        return 'Amount: Low to High';
      case 'percentage_desc':
        return 'Percentage: High to Low';
      case 'percentage_asc':
        return 'Percentage: Low to High';
      default:
        return 'Amount: High to Low';
    }
  },
  watch: {
    budgetData: {
      handler() {
        this.updateChart();
      },
      deep: true, // Watch for deep changes in the budgetData array
    },
  },

  methods: {
    selectSalaryRate(rate) {
      this.salaryRate = rate;
    },
    formatCurrency(value) {
      if (typeof value !== 'number' || isNaN(value)) {
        return '$0.00';
      }
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0, // Remove decimals
        maximumFractionDigits: 0,
      }).format(value);
    },
    formatBudget(value) {
      if (typeof value !== 'number' || isNaN(value)) {
        return '$0';
      }
      if (value >= 1e9) {
        return `${(value / 1e9).toFixed(1)}B`;
      } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(1)}M`;
      }
      return this.formatCurrency(value);
    },
    calculateFederalTax(taxableIncome) {
      let tax = 0;
      let previousUpTo = 0;
      let adjustedTaxableIncome = taxableIncome - this.federalBasicPersonalAmount;
      if (this.numberOfDependents > 0) {
        adjustedTaxableIncome -= this.federalEligibleDependentAmount;
      }
      adjustedTaxableIncome = adjustedTaxableIncome > 0 ? adjustedTaxableIncome : 0;
      for (const bracket of this.federalTaxBrackets) {
        if (adjustedTaxableIncome > bracket.upTo) {
          const incomeInBracket = bracket.upTo - previousUpTo;
          tax += incomeInBracket * bracket.rate;
          previousUpTo = bracket.upTo;
        } else {
          const incomeInBracket = adjustedTaxableIncome - previousUpTo;
          tax += incomeInBracket * bracket.rate;
          break;
        }
      }
      return tax > 0 ? tax : 0;
    },
    calculateProvincialTax(taxableIncome) {
      let tax = 0;
      let previousUpTo = 0;
      const brackets = this.provincialTaxBrackets[this.selectedRegion] || [];
      const provincialPersonalAmount =
        this.provincialBasicPersonalAmounts[this.selectedRegion] || 0;
      let adjustedTaxableIncome = taxableIncome - provincialPersonalAmount;
      if (this.numberOfDependents > 0) {
        const provincialDependentAmount =
          this.provincialEligibleDependentAmounts[this.selectedRegion] || 0;
        adjustedTaxableIncome -= provincialDependentAmount;
      }
      adjustedTaxableIncome = adjustedTaxableIncome > 0 ? adjustedTaxableIncome : 0;
      for (const bracket of brackets) {
        if (adjustedTaxableIncome > bracket.upTo) {
          const incomeInBracket = bracket.upTo - previousUpTo;
          tax += incomeInBracket * bracket.rate;
          previousUpTo = bracket.upTo;
        } else {
          const incomeInBracket = adjustedTaxableIncome - previousUpTo;
          tax += incomeInBracket * bracket.rate;
          break;
        }
      }
      return tax > 0 ? tax : 0;
    },
    toggleDescription(categoryId) {
      const category = this.budgetCategories.find(cat => cat.id === categoryId);
      if (category) {
        category.showDescription = !category.showDescription;
      }
    },
    toggleAll() {
      this.allExpanded = !this.allExpanded;
      this.budgetCategories.forEach(cat => {
        cat.showDescription = this.allExpanded;
      });
    },
    calculatePercentage(amount, total) {
      if (total === 0) return '0.0';
      return ((amount / total) * 100).toFixed(1);
    },
    async exportToPDF() {
      try {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let currentHeight = margin;
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Canada Income Tax Calculator', pageWidth / 2, currentHeight, {
          align: 'center',
        });
        currentHeight += 12;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const exportDate = new Date().toLocaleDateString('en-CA');
        doc.text(`Export Date: ${exportDate}`, margin, currentHeight);
        currentHeight += 10;
        doc.setDrawColor(200);
        doc.line(margin, currentHeight, pageWidth - margin, currentHeight);
        currentHeight += 5;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('User Information', margin, currentHeight);
        currentHeight += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const userInfo = [
          { label: 'Selected Province/Territory:', value: this.selectedRegion },
          { label: 'Salary Rate:', value: this.salaryRate },
          { label: 'Total Income:', value: this.formatCurrency(this.totalIncome) },
          { label: 'Total Deductions:', value: this.formatCurrency(this.totalDeductions) },
          { label: 'Taxable Income:', value: this.formatCurrency(this.taxableIncome) },
          { label: 'Marital Status:', value: this.maritalStatus },
          { label: 'Number of Dependents:', value: this.numberOfDependents },
          { label: 'Number of Children Under 18:', value: this.numberOfChildrenUnder18 },
          { label: 'Dependents with Disabilities:', value: this.numberOfDependentsWithDisabilities },
        ];
        userInfo.forEach((item) => {
          doc.text(`${item.label} ${item.value}`, margin, currentHeight);
          currentHeight += 6;
        });
        currentHeight += 5;
        doc.setDrawColor(200);
        doc.line(margin, currentHeight, pageWidth - margin, currentHeight);
        currentHeight += 5;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Detailed Income Breakdown', margin, currentHeight);
        currentHeight += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const incomeBreakdown = [
          { label: 'Employment Income:', value: this.formatCurrency(this.income) },
          { label: 'Self-Employment Income:', value: this.formatCurrency(this.selfEmploymentIncome) },
          { label: 'Capital Gains Before June 25, 2024:', value: this.formatCurrency(this.capitalGainsBeforeJune25) },
          { label: 'Capital Gains On/After June 25, 2024:', value: this.formatCurrency(this.capitalGainsAfterJune25) },
          { label: 'Eligible Dividends:', value: this.formatCurrency(this.eligibleDividends) },
          { label: 'Ineligible Dividends:', value: this.formatCurrency(this.ineligibleDividends) },
          { label: 'Other Income:', value: this.formatCurrency(this.otherIncome) },
        ];
        incomeBreakdown.forEach((item) => {
          doc.text(`${item.label} ${item.value}`, margin, currentHeight);
          currentHeight += 6;
        });
        currentHeight += 5;
        doc.setDrawColor(200);
        doc.line(margin, currentHeight, pageWidth - margin, currentHeight);
        currentHeight += 5;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Tax Breakdown', margin, currentHeight);
        currentHeight += 8;
        const taxData = [
          ['Description', 'Amount', 'Percentage'],
          ['Federal Tax', this.formatCurrency(this.netFederalTax), `${this.federalTaxPercentage}%`],
          ['Provincial Tax', this.formatCurrency(this.netProvincialTax), `${this.provincialTaxPercentage}%`],
          ['CPP/QPP Contribution', this.formatCurrency(this.pensionPlanContribution), `${this.cppTaxPercentage}%`],
          ['EI Premium', this.formatCurrency(this.eiPremium), `${this.eiTaxPercentage}%`],
          ['Total Deductions', this.formatCurrency(this.totalDeductions), ''],
          ['Total Non-Refundable Credits', this.formatCurrency(this.totalNonRefundableCredits), ''],
          ['Net Income After Credits', this.formatCurrency(this.netIncomeAfterCredits), ''],
        ];
        autoTable(doc, {
          startY: currentHeight,
          head: [taxData[0]],
          body: taxData.slice(1),
          theme: 'grid',
          styles: { fontSize: 12, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], halign: 'center' },
          bodyStyles: { halign: 'center' },
          columnStyles: {
            0: { cellWidth: 70, halign: 'left' },
            1: { cellWidth: 40, halign: 'right' },
            2: { cellWidth: 30, halign: 'right' },
          },
          margin: { left: margin, right: margin },
        });
        currentHeight = doc.previousAutoTable.finalY + 10;
        doc.save('Tax_Breakdown.pdf');
      } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
      }
    },
  },
};
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

/* Salary Rate Selector Section */
.section-title {
  color: #34495e;
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: 600;
  text-align: center;
}

/* Salary Selector Wrapper */
.salary-selector-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

/* Salary Selector Styles */
.salary-selector {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.salary-selector::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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
  transform: translateZ(0);
  transition: transform 0.3s, box-shadow 0.3s;
  flex: 1;
  min-width: 300px;
}

.calculator-container:hover,
.result-box:hover {
  transform: translateY(-10px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.19),
    0 12px 12px rgba(0, 0, 0, 0.23);
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

.result-box {
  color: #2c3e50;
  position: relative;
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

/* Export Button Styles */
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

/* Toggle Button for Description */
.toggle-description-button {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #2980b9;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.toggle-description-button:hover {
  background-color: #1c5980;
}

/* Toggle All Button Styles */
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

/* Federal Tax Allocation Section */
.federal-tax-allocation {
  margin-top: 40px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
  perspective: 1000px; /* Enables 3D transforms */
  transition: transform 0.5s, box-shadow 0.5s; /* Smooth transitions */
}

.federal-tax-allocation:hover {
  transform: rotateY(5deg); /* Subtle 3D tilt on hover */
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 12px 12px rgba(0, 0, 0, 0.25);
}

.federal-tax-allocation .section-title {
  font-size: 22px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.allocation-description {
  font-size: 18px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 20px;
}

.allocation-total {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Centers content vertically */
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(135deg, #f8f9fa, #e0e0e0); /* Gradient background */
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* Inset shadow for depth */
  transition: background 0.3s, box-shadow 0.3s;
}

.allocation-total:hover {
  background: linear-gradient(135deg, #e0e0e0, #f8f9fa); /* Reverse gradient on hover */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.15);
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

.allocation-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.allocation-item {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Centers content vertically */
  font-size: 18px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
  transition: transform 0.3s, background-color 0.3s;
}

.allocation-item:hover {
  transform: translateY(-5px);
  background-color: #e2e6ea;
}

.allocation-info {
  /* Removed flex alignment for icons */
  display: flex;
  align-items: center;
}

.allocation-details {
  display: flex;
  align-items: center;
  gap: 10px;
}

.allocation-percentage {
  background-color: #27ae60;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .allocation-total {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .allocation-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .allocation-details {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .allocation-percentage {
    margin-top: 5px;
  }
  
  .filter-label {
    justify-content: center;
  }
}


/* Federal Budget Section */
.federal-budget-section {
  margin-top: 40px;
}

.budget-overview {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.budget-action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.budget-category {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
}

.budget-category h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #34495e;
}

.budget-category p {
  margin: 10px 0 0;
  font-size: 16px;
  color: #2c3e50;
}

/* Subsection Styles */
.subsection {
  margin-left: 20px;
  margin-top: 10px;
  padding-left: 10px;
  border-left: 2px solid #bdc3c7;
}

.subsection h4 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.subsection p {
  font-size: 16px;
  color: #7f8c8d;
}

/* Federal Budget Pie Chart */
.federal-budget-section .pie-chart-container {
  max-width: 800px;
  margin: 30px auto;
  position: relative;
  height: 600px;
  width: 600px;
}

/* Disclaimer */
.disclaimer {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  border-top: 1px solid #bdc3c7;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calculator-wrapper {
    flex-direction: column;
  }
  .salary-selector-wrapper {
    flex-direction: column;
  }
  .allocation-filters {
    flex-direction: column;
    align-items: center;
  }
}
/* Budget Categories Header */
.budget-categories-header {
  margin-top: 40px;
  text-align: center;
}

.budget-categories-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.budget-categories-description {
  font-size: 18px;
  color: #7f8c8d;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 30px;
}

/* Container for all budget categories */
.budget-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Individual budget category box */
.budget-category {
  background-color: #f0f4f8;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.budget-category:hover {
  background-color: #e6eef5;
}

/* Category title styling */
.category-title {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

/* Toggle button styling */
.toggle-description-button {
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

/* Description container */
.category-description {
  margin-top: 15px;
}

/* Subsections container */
.subsections {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 3px solid #bdc3c7;
}

/* Subsection title styling */
.subsection-title {
  font-size: 18px;
  color: #34495e;
  margin-bottom: 5px;
  font-weight: 500;
}

/* Subsection description styling */
.subsection-description {
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .budget-category {
    padding: 15px;
  }
  
  .category-title {
    font-size: 18px;
  }
  
  .subsection-title {
    font-size: 16px;
  }
  
  .toggle-description-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}

.category-description {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out;
}

.budget-category .category-description {
  max-height: 1000px; /* A large enough value to accommodate content */
}

/* Sorting Controls */
.sorting-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.sorting-label {
  font-size: 16px;
  color: #2c3e50;
}

.sorting-select {
  padding: 8px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.sorting-select:hover {
  border-color: #2980b9;
  box-shadow: 0 0 5px rgba(41, 128, 185, 0.5);
}

.sorting-select:focus {
  outline: none;
  border-color: #2980b9;
  box-shadow: 0 0 5px rgba(41, 128, 185, 0.5);
}

/* Current Sorting Display */
.current-sorting {
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #2c3e50;
}

.current-sorting strong {
  color: #2980b9;
}


</style>






