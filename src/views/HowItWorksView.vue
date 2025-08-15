<template>
  <div class="how-it-works-container">
    <!-- Decorative 3D elements -->
    <div class="floating-shape shape-1" />
    <div class="floating-shape shape-2" />
    <div class="floating-shape shape-3" />
    <div class="floating-shape shape-4" />
    
    <div class="cube-container">
      <div class="cube">
        <div class="cube-face front" />
        <div class="cube-face back" />
        <div class="cube-face right" />
        <div class="cube-face left" />
        <div class="cube-face top" />
        <div class="cube-face bottom" />
      </div>
    </div>
    
    <div class="pyramid-container">
      <div class="pyramid">
        <div class="pyramid-face pyramid-front" />
        <div class="pyramid-face pyramid-right" />
        <div class="pyramid-face pyramid-back" />
        <div class="pyramid-face pyramid-left" />
      </div>
    </div>
    
    <div class="content-wrapper">
      <!-- Main title -->
      <h1 class="main-title">
        How It Works
      </h1>

      <!-- Main Navigation -->
      <MainNavigation />
      
      <div class="toc animate-in">
        <h2>Table of Contents</h2>
        <ol>
          <li>
            <a
              href="#calculator-methodology"
              @click.prevent="scrollToSection('calculator-methodology')"
            >Calculator Methodology</a>
          </li>
          <li>
            <a
              href="#tax-calculation-process"
              @click.prevent="scrollToSection('tax-calculation-process')"
            >Tax Calculation Process</a>
          </li>
          <li>
            <a
              href="#income-types-and-deductions"
              @click.prevent="scrollToSection('income-types-and-deductions')"
            >Income Types and Deductions</a>
          </li>
          <li>
            <a
              href="#government-spending-visualization"
              @click.prevent="scrollToSection('government-spending-visualization')"
            >Government Spending Visualization</a>
          </li>
          <li>
            <a
              href="#benefits-of-using-the-calculator"
              @click.prevent="scrollToSection('benefits-of-using-the-calculator')"
            >Benefits of Using the Calculator</a>
          </li>
          <li>
            <a
              href="#technical-implementation"
              @click.prevent="scrollToSection('technical-implementation')"
            >Technical Implementation</a>
          </li>
          <li>
            <a
              href="#data-sources-and-accuracy"
              @click.prevent="scrollToSection('data-sources-and-accuracy')"
            >Data Sources and Accuracy</a>
          </li>
          <li>
            <a
              href="#budget-simulator"
              @click.prevent="scrollToSection('budget-simulator')"
            >Budget Simulator</a>
          </li>
          <li>
            <a
              href="#faq"
              @click.prevent="scrollToSection('faq')"
            >FAQ</a>
          </li>
        </ol>
      </div>
      
      <div class="section animate-in">
        <p>The Canada Tax Calculator is a comprehensive, user-friendly tool designed to help Canadians understand their tax obligations and see how their tax dollars contribute to government spending. This documentation explains the calculator's methodology, features, and benefits.</p>
      </div>
      
      <div
        id="calculator-methodology"
        class="section animate-in"
      >
        <h2>Calculator Methodology</h2>
        
        <h3>Tax Rates and Brackets</h3>
        <p>The Canada Tax Calculator uses the latest 2025 federal and provincial tax rates and brackets to provide accurate tax estimates. The calculator includes:</p>
        <ul>
          <li>Federal Tax Brackets: Five progressive tax brackets ranging from 15% to 33%</li>
          <li>Provincial/Territorial Tax Brackets: Specific brackets for all 13 provinces and territories</li>
          <li>CPP/QPP Contributions: Calculated based on employment income with appropriate maximums</li>
          <li>EI Premiums: Calculated based on employment income with appropriate maximums</li>
        </ul>
        
        <h3>Basic Personal Amounts</h3>
        <p>The calculator accounts for both federal and provincial basic personal amounts (BPA), which are non-refundable tax credits that reduce the amount of tax you pay:</p>
        <ul>
          <li>Federal Basic Personal Amount: $15,705 (2025)</li>
          <li>Provincial Basic Personal Amounts: Vary by province/territory</li>
          <li>Adjusted BPA for Marital Status: Increased BPA for individuals who are married or in common-law relationships</li>
        </ul>
      </div>
      
      <div
        id="tax-calculation-process"
        class="section animate-in"
      >
        <h2>Tax Calculation Process</h2>
        <p>The calculator follows these steps to determine your tax obligations:</p>
        
        <h3>1. Collect Income Information</h3>
        <ul>
          <li>Employment income</li>
          <li>Self-employment income</li>
          <li>Capital gains (before and after June 25, 2024)</li>
          <li>Eligible and ineligible dividends</li>
          <li>Other income sources</li>
        </ul>
        
        <h3>2. Apply Deductions and Credits</h3>
        <ul>
          <li>RRSP deductions</li>
          <li>Basic personal amounts</li>
          <li>Dependent credits</li>
          <li>Child credits</li>
          <li>Dividend tax credits</li>
        </ul>
        
        <h3>3. Calculate Federal Tax</h3>
        <ul>
          <li>Determine taxable income</li>
          <li>Apply federal tax rates to appropriate income brackets</li>
          <li>Subtract applicable tax credits</li>
        </ul>
        
        <h3>4. Calculate Provincial/Territorial Tax</h3>
        <ul>
          <li>Apply provincial/territorial tax rates to appropriate income brackets</li>
          <li>Subtract applicable provincial tax credits</li>
        </ul>
        
        <h3>5. Calculate CPP/QPP and EI Contributions</h3>
        <ul>
          <li>CPP/QPP: 5.7% of employment income (11.4% for self-employed) up to maximum</li>
          <li>EI: 1.63% of employment income up to maximum</li>
        </ul>
        
        <h3>6. Determine Net Income</h3>
        <ul>
          <li>Subtract total tax (federal + provincial + CPP/QPP + EI) from gross income</li>
        </ul>
      </div>
      
      <div
        id="income-types-and-deductions"
        class="section animate-in"
      >
        <h2>Income Types and Deductions</h2>
        <p>The calculator handles various income types differently, reflecting Canada's tax system:</p>
        
        <h3>Employment Income</h3>
        <ul>
          <li>Taxed at regular rates</li>
          <li>Subject to CPP/QPP and EI premiums</li>
        </ul>
        
        <h3>Self-Employment Income</h3>
        <ul>
          <li>Taxed at regular rates</li>
          <li>Subject to both employer and employee portions of CPP/QPP</li>
          <li>Not subject to EI premiums (unless opted in)</li>
        </ul>
        
        <h3>Capital Gains</h3>
        <ul>
          <li>50% of capital gains are taxable</li>
          <li>Different treatment for gains before and after June 25, 2024</li>
        </ul>
        
        <h3>Dividends</h3>
        <ul>
          <li>Eligible dividends are grossed up by 38% with a 15.02% federal dividend tax credit</li>
          <li>Ineligible dividends are grossed up by 15% with a 9% federal dividend tax credit</li>
        </ul>
        
        <h3>RRSP Deductions</h3>
        <ul>
          <li>Directly reduce taxable income</li>
        </ul>
      </div>
      
      <div
        id="government-spending-visualization"
        class="section animate-in"
      >
        <h2>Government Spending Visualization</h2>
        <p>A unique feature of our calculator is the visualization of how your tax dollars are allocated across different government spending categories:</p>
        
        <h3>Federal Budget Allocation</h3>
        <p>The calculator shows the breakdown of federal spending, including:</p>
        <ul>
          <li>Healthcare</li>
          <li>Support for Seniors</li>
          <li>Children and Families</li>
          <li>Indigenous Services and Reconciliation</li>
          <li>Employment Insurance and Other Benefits</li>
          <li>Defense and Public Safety</li>
          <li>Debt Servicing</li>
          <li>Public Debt Charges</li>
          <li>Government Operations</li>
          <li>Other categories</li>
        </ul>
        
        <h3>Budget Visualization</h3>
        <p>The calculator provides three different budget views:</p>
        <ul>
          <li>2022-2023: Historical spending data from the Public Accounts of Canada</li>
          <li>2023-2024: Proposed spending allocations from Budget 2024</li>
          <li>2025-2026: Projected spending estimates based on current economic forecasts and government projections</li>
        </ul>
        
        <h3>Personal Tax Allocation</h3>
        <p>Based on your federal tax amount, the calculator shows exactly how much of your personal tax contribution goes to each spending category, helping you understand the direct impact of your tax dollars.</p>
      </div>
      
      <div
        id="benefits-of-using-the-calculator"
        class="section animate-in"
      >
        <h2>Benefits of Using the Calculator</h2>
        
        <h3>Accurate Tax Estimation</h3>
        <ul>
          <li>Up-to-date tax brackets and rates for all provinces and territories</li>
          <li>Comprehensive handling of various income types</li>
          <li>Inclusion of major deductions and credits</li>
        </ul>
        
        <h3>Financial Planning</h3>
        <ul>
          <li>Helps users understand their effective tax rate</li>
          <li>Allows for income planning across different payment periods (annual, monthly, bi-weekly, etc.)</li>
          <li>Supports retirement planning through RRSP contribution visualization</li>
        </ul>
        
        <h3>Tax Transparency</h3>
        <ul>
          <li>Clearly shows how tax dollars are allocated</li>
          <li>Helps citizens understand government spending priorities</li>
          <li>Connects personal contributions to public services</li>
        </ul>
        
        <h3>Educational Value</h3>
        <ul>
          <li>Improves financial literacy</li>
          <li>Demystifies the Canadian tax system</li>
          <li>Helps users make informed financial decisions</li>
        </ul>
        
        <h3>Accessibility</h3>
        <ul>
          <li>Free to use</li>
          <li>No registration required</li>
          <li>Mobile-friendly design</li>
          <li>Exportable results (PDF format)</li>
        </ul>
      </div>
      
      <div
        id="technical-implementation"
        class="section animate-in"
      >
        <h2>Technical Implementation</h2>
        <p>The Canada Tax Calculator and Budget Simulator are built using modern web technologies:</p>
        <ul>
          <li>Frontend Framework: Vue.js for reactive, component-based UI</li>
          <li>State Management: Pinia for efficient state management</li>
          <li>Visualization: Chart.js for interactive data visualization</li>
          <li>Styling: CSS with responsive design principles</li>
          <li>Validation: Form validation to ensure accurate inputs</li>
          <li>PDF Export: Capability to export results as PDF documents</li>
          <li>Real-time Calculations: Efficient algorithms for instant budget updates</li>
          <li>Interactive Controls: Custom slider components for budget adjustments</li>
          <li>Tooltip System: Dynamic tooltips for detailed information display</li>
          <li>Auto-balance Feature: Smart algorithms for budget optimization</li>
        </ul>
      </div>
      
      <div
        id="data-sources-and-accuracy"
        class="section animate-in"
      >
        <h2>Data Sources and Accuracy</h2>
        <p>The calculator uses data from authoritative sources:</p>
        <ul>
          <li>Tax Rates and Brackets: Canada Revenue Agency (CRA) and provincial tax authorities</li>
          <li>Budget Allocation: Public Accounts of Canada financial report</li>
          <li>Budget 2024: Official Budget 2024 documentation</li>
        </ul>
        <p>While the calculator provides accurate estimates based on the information provided, it is designed for educational and planning purposes. Individual tax situations may vary, and users should consult with a tax professional for personalized advice.</p>
      </div>
      
      <div
        id="budget-simulator"
        class="section animate-in"
      >
        <h2>Budget Simulator</h2>
        <p>The Budget Simulator is an interactive tool that allows you to explore and understand how federal budget allocations work. Here's how it functions:</p>

        <h3>Key Features</h3>
        <ul>
          <li>Interactive spending controls for major budget categories</li>
          <li>Real-time deficit/surplus calculations</li>
          <li>Visual representation of budget impacts</li>
          <li>Auto-balance functionality for budget optimization</li>
          <li>Detailed tooltips explaining each category</li>
        </ul>

        <h3>Main Categories</h3>
        <ul>
          <li>Social Programs: Healthcare, education, and social services</li>
          <li>Economic Development: Infrastructure, business support, and innovation</li>
          <li>Defense and Security: Military, policing, and border security</li>
          <li>Environmental Protection: Climate action and conservation</li>
          <li>International Affairs: Foreign aid and diplomatic relations</li>
        </ul>

        <h3>How to Use the Simulator</h3>
        <ol>
          <li>Adjust spending percentages for different categories using the sliders</li>
          <li>Monitor the real-time impact on total spending and deficit/surplus</li>
          <li>Use the auto-balance feature to automatically adjust revenue sources</li>
          <li>View detailed information about each category by hovering over the info icons</li>
          <li>Export your budget plan or share it with others</li>
        </ol>

        <h3>Understanding the Results</h3>
        <ul>
          <li>Total Revenue: Shows the sum of all revenue sources</li>
          <li>Total Spending: Displays the combined spending across all categories</li>
          <li>Surplus/Deficit: Indicates whether your budget is balanced</li>
          <li>Debt-to-GDP Ratio: Shows the impact on national debt levels</li>
          <li>Category Impacts: Displays how changes affect individual programs</li>
        </ul>

        <h3>Tips for Effective Use</h3>
        <ul>
          <li>Start with small adjustments to understand the impact</li>
          <li>Use the auto-balance feature to maintain fiscal responsibility</li>
          <li>Pay attention to the deficit warnings for sustainable budgeting</li>
          <li>Consider the interconnected nature of different spending categories</li>
          <li>Review the tooltips for detailed information about each category</li>
        </ul>

        <h3>Understanding Tax Calculations</h3>
        <p>The Budget Simulator uses a simplified approach to tax calculations to help users understand the broad fiscal impact of tax changes:</p>
        
        <h4>Personal Income Tax</h4>
        <ul>
          <li>Uses an average effective tax rate approach rather than detailed tax brackets</li>
          <li>Base rate: 21% (2024)</li>
          <li>Base amount: $10 billion per 1% change</li>
          <li>Total revenue: $210 billion</li>
          <li>Adjustable range: 0% to 50%</li>
          <li>Includes tax credits and deferrals that can be adjusted separately</li>
        </ul>

        <h4>Corporate Income Tax</h4>
        <ul>
          <li>Uses a simplified rate structure rather than detailed brackets</li>
          <li>Base rate: 15% (2024)</li>
          <li>Base amount: $5.33 billion per 1% change</li>
          <li>Total revenue: $80 billion</li>
          <li>Adjustable range: 0% to 40%</li>
          <li>Includes corporate tax expenditures that can be adjusted separately</li>
        </ul>

        <h4>Tax Expenditures and Credits</h4>
        <ul>
          <li>
            <strong>Personal Tax Credits:</strong>
            <ul>
              <li>Base amount: $120 billion gross</li>
              <li>Net amount: $102 billion (adjusted for interactions)</li>
              <li>Can be adjusted to impact personal income tax revenue</li>
            </ul>
          </li>
          <li>
            <strong>Corporate Tax Expenditures:</strong>
            <ul>
              <li>Base amount: $25 billion gross</li>
              <li>Net amount: $23.75 billion (adjusted for interactions)</li>
              <li>Can be adjusted to impact corporate income tax revenue</li>
            </ul>
          </li>
        </ul>

        <p>This simplified approach allows users to understand the broad fiscal impact of tax changes without getting lost in the complexity of detailed tax brackets and calculations. The simulator focuses on the overall revenue impact rather than individual taxpayer scenarios.</p>
      </div>
      
      <div
        id="faq"
        class="section animate-in"
      >
        <h2>FAQ</h2>
        
        <h3>How accurate is the calculator?</h3>
        <p>The calculator provides a close estimate based on the information you provide and the latest tax rates. However, it's a simplified model and doesn't account for all possible deductions, credits, or special situations.</p>
        
        <h3>Does the calculator store my data?</h3>
        <p>No, all calculations are performed in your browser. No personal or financial information is stored on our servers.</p>
        
        <h3>How often is the calculator updated?</h3>
        <p>We update the calculator annually to reflect changes in tax rates, brackets, and government spending allocations. The current version uses 2024 tax rates.</p>
        
        <h3>Can I use the calculator for business taxes?</h3>
        <p>The calculator is designed for personal income taxes. Business taxes involve different rules and considerations.</p>
        
        <h3>How are the government spending allocations determined?</h3>
        <p>The spending allocations are based on the Public Accounts of Canada and Budget 2024 documents, which provide detailed breakdowns of federal government expenditures.</p>
        
        <h3>Does the calculator account for all possible tax credits?</h3>
        <p>The calculator includes major credits like the basic personal amount and simplified child credits, but doesn't account for all possible credits like medical expenses, tuition, or charitable donations.</p>

        <h3>How does the Budget Simulator work?</h3>
        <p>The Budget Simulator uses approximate federal budget data from Public Accounts of Canada and Budget 2024 documents to allow you to experiment with different spending allocations. It calculates the impact of your changes on the overall budget, including effects on deficit/surplus and debt-to-GDP ratio.</p>

        <h3>What is the auto-balance feature?</h3>
        <p>The auto-balance feature automatically adjusts revenue sources to maintain a balanced budget when you make spending changes. It helps you understand the trade-offs between different fiscal policies.</p>

        <h3>Can I save my budget simulations?</h3>
        <p>Yes, you can export your budget plan as a PDF document, which includes all your spending allocations and their impacts. This allows you to save and share your budget scenarios.</p>

        <h3>How accurate are the budget impact calculations?</h3>
        <p>The budget impact calculations are based on current federal budget data and economic models. While they provide a good approximation of the effects of spending changes, they are simplified models and don't account for all possible economic interactions.</p>

        <h3>What do the tooltips show?</h3>
        <p>The tooltips provide detailed information about each budget category, including current spending levels, program descriptions, and potential impacts of changes. They help you make informed decisions about budget allocations.</p>

        <h3>How are tax rates and revenue calculated in the Budget Simulator?</h3>
        <p>The Budget Simulator uses a simplified approach to tax calculations to make it easier to understand the fiscal impact of tax changes. Instead of detailed tax brackets, it uses average effective rates. For Personal Income Tax, the base rate is 21% (2024) with $10 billion in revenue per percentage point. Corporate Income Tax uses a base rate of 15% (2024) with $5.33 billion in revenue per percentage point. Tax credits and expenditures can be adjusted separately to see their impact on revenue. The simulator focuses on overall revenue impact rather than individual taxpayer scenarios, helping users understand the broad fiscal implications of tax changes while maintaining a manageable level of complexity.</p>
      </div>
      
      <div class="footer">
        <p>This documentation was last updated: May 2025</p>
        <p>For questions or feedback, please contact: <a href="mailto:fiscal-insights@outlook.com">fiscal-insights@outlook.com</a></p>
        <router-link
          to="/"
          class="back-link"
        >
          ← Back to Calculator
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import initAllAnimations from '../assets/howItWorksAnimations.js';
import '../assets/decorativeElements.css'; // Import decorative elements CSS file
import MainNavigation from '@/components/MainNavigation.vue';

export default {
  name: 'HowItWorksView',
  components: {
    MainNavigation
  },
  metaInfo: {
    title: 'How It Works | Canada Tax Calculator Methodology and Features',
    meta: [
      { 
        name: 'description', 
        content: 'Learn how the Canada Tax Calculator works, its methodology, and benefits. Understand tax calculations, income types, and government spending visualization.' 
      }
    ]
  },
  mounted() {
    // Initialize all 3D animations and effects
    initAllAnimations();
  },
  methods: {
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
/* Remove the custom navigation styles and adjust the container padding */
.how-it-works-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  color: #333;
  perspective: 1000px;
  background-image: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), 
                    url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="%23f0f4f8"/></svg>');
  background-size: 20px 20px;
  transform-style: preserve-3d;
}

.main-title {
  color: #34495e;
  font-size: 32px;
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotateX(0deg);
  }
  50% {
    transform: translateY(-10px) rotateX(5deg);
  }
  100% {
    transform: translateY(0px) rotateX(0deg);
  }
}

h2 {
  color: #27ae60;
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  position: relative;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #27ae60, #2980b9);
  transition: width 0.5s ease;
}

h2:hover::after {
  width: 100%;
}

h2:hover {
  transform: translateZ(10px);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

h3 {
  color: #2980b9;
  font-size: 20px;
  margin-top: 25px;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}

h3:hover {
  transform: translateZ(5px) translateX(10px);
  color: #3498db;
}

p, li {
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

p:hover, li:hover {
  transform: scale(1.02) translateZ(5px);
}

ul, ol {
  padding-left: 25px;
  margin-bottom: 20px;
}

.toc {
  background-color: #f0f4f8;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: perspective(1000px) rotateX(2deg);
  transition: all 0.5s ease;
  transform-style: preserve-3d;
}

.toc:hover {
  transform: perspective(1000px) rotateX(0deg) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.toc h2 {
  margin-top: 0;
}

.toc ol {
  margin-bottom: 0;
  counter-reset: item;
  list-style-type: none;
}

.toc ol li {
  counter-increment: item;
  margin-bottom: 10px;
  position: relative;
  padding-left: 30px;
  transition: all 0.3s ease;
}

.toc ol li::before {
  content: counter(item);
  background: linear-gradient(135deg, #27ae60, #2980b9);
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  transition: all 0.3s ease;
}

.toc ol li:hover::before {
  transform: scale(1.2) rotate(10deg);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.toc a {
  color: #2980b9;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.toc a:hover {
  text-decoration: none;
  transform: translateX(5px) translateZ(10px);
  color: #3498db;
}

.toc a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #2980b9, #3498db);
  transition: width 0.3s ease;
}

.toc a:hover::after {
  width: 100%;
}

.section {
  margin-bottom: 40px;
  background-color: #ffffff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  transform: perspective(1000px) rotateY(0deg);
  transform-style: preserve-3d;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: perspective(1000px) rotateY(5deg) translateY(20px);
  }
  to {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg) translateY(0);
  }
}

.section:hover {
  transform: perspective(1000px) rotateY(-2deg) translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.footer {
  margin-top: 60px;
  padding: 30px 0;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-link:hover {
  background-color: #219a52;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Animation for sections to appear with a staggered effect */
.section:nth-child(odd) {
  animation-delay: 0.2s;
}

.section:nth-child(even) {
  animation-delay: 0.4s;
}

/* 3D card effect for list items */
ul li, ol li {
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  position: relative;
  padding-left: 5px;
}

ul li:hover, ol li:hover {
  transform: translateX(10px) translateZ(5px);
  color: #34495e;
}

ul li::before {
  content: '•';
  position: absolute;
  left: -15px;
  color: #27ae60;
  transition: all 0.3s ease;
}

ul li:hover::before {
  transform: scale(1.5);
  color: #2ecc71;
}

/* Add scroll reveal animation */
@keyframes revealFromBottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add animation for headings */
@keyframes animateHeading {
  0% {
    opacity: 0;
    transform: translateY(-20px) translateZ(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

.animate-heading {
  animation: animateHeading 0.5s ease-out forwards;
  opacity: 0;
}

/* Add animation for sections coming into view */
.animate-in {
  animation: revealFromBottom 0.7s ease-out forwards;
}

/* Add 3D depth to images if any are added later */
img {
  transition: all 0.5s ease;
  transform-style: preserve-3d;
}

img:hover {
  transform: scale(1.05) translateZ(20px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Add 3D effect to FAQ items */
#faq h3 {
  cursor: pointer;
  position: relative;
}

#faq h3.active {
  background-color: #e9f7ef;
  transform: translateY(-5px) translateZ(15px) rotateX(0deg);
}

#faq h3.active::after {
  content: '-';
  transform: translateY(-50%) rotate(0deg);
}

#faq p {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.5s ease;
  opacity: 0;
  margin-left: 20px;
  border-left: 3px solid #27ae60;
  padding-left: 15px;
}

/* 3D flip card effect */
.flip-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #27ae60, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.flip-icon:hover {
  transform: scale(1.2) rotate(180deg);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

#calculator-methodology {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

#calculator-methodology.flipped {
  transform: rotateY(180deg);
}

#calculator-methodology.flipped h2,
#calculator-methodology.flipped h3,
#calculator-methodology.flipped p,
#calculator-methodology.flipped ul {
  transform: rotateY(180deg);
  backface-visibility: visible;
}

/* Add 3D depth to the page title */
.main-title {
  position: relative;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, #27ae60, #2980b9);
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(39, 174, 96, 0.5);
}

/* Enhanced 3D effect for section titles - making them more static */
h2 {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  transform: translateZ(5px); /* Subtle 3D effect */
  transform-style: preserve-3d;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(39, 174, 96, 0.3);
}

/* Remove the sliding animation effect */
h2::before {
  display: none;
}

/* Replace hover effect with a more subtle one */
h2:hover {
  transform: translateZ(8px); /* Slightly more pronounced on hover, but still subtle */
  color: #27ae60;
}

/* Make the animate-heading class more subtle */
.animate-heading {
  animation: none; /* Remove the floating animation */
  position: relative;
}

.animate-heading::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #27ae60, transparent);
}

/* FAQ accordion styling */
#faq h3 {
  cursor: pointer;
  position: relative;
}

#faq h3.active {
  background-color: #e9f7ef;
  transform: translateY(-5px) translateZ(15px) rotateX(0deg);
}

#faq h3.active::after {
  content: '-';
  transform: translateY(-50%) rotate(0deg);
}

#faq p {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.5s ease;
  opacity: 0;
  margin-left: 20px;
  border-left: 3px solid #27ae60;
  padding-left: 15px;
}

/* 3D flip card effect */
.flip-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #27ae60, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.flip-icon:hover {
  transform: scale(1.2) rotate(180deg);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

#calculator-methodology {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s;
}

#calculator-methodology.flipped {
  transform: rotateY(180deg);
}

#calculator-methodology.flipped h2,
#calculator-methodology.flipped h3,
#calculator-methodology.flipped p,
#calculator-methodology.flipped ul {
  transform: rotateY(180deg);
  backface-visibility: visible;
}

/* Add 3D depth to the page title */
.main-title {
  position: relative;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, #27ae60, #2980b9);
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(39, 174, 96, 0.5);
}

/* Enhanced 3D effect for section titles */
h2 {
  position: relative;
  overflow: hidden;
}

h2::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0), 
    rgba(255,255,255,0.2), 
    rgba(255,255,255,0));
  transform: skewX(-25deg);
  transition: all 0.7s ease;
}

h2:hover::before {
  left: 100%;
}

/* Add 3D effect to the footer links */
.footer a {
  color: #27ae60;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.footer a:hover {
  color: #219a52;
  transform: translateZ(5px);
}

.footer a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #27ae60, #2980b9);
  transition: width 0.3s ease;
}

.footer a:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .how-it-works-container {
    padding: 15px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  h2 {
    font-size: 22px;
  }
  
  h3 {
    font-size: 18px;
  }
  
  .section {
    padding: 15px;
  }
  
  /* Reduce 3D effects on mobile for better performance */
  .section:hover,
  .toc:hover,
  h2:hover,
  h3:hover,
  p:hover,
  li:hover {
    transform: translateY(-3px);
  }
}
</style>
