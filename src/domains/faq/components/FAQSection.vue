<!-- FAQSection.vue -->
<template>
  <section class="faq-section">
    <h2 class="section-title">
      Taxpayer FAQs
    </h2>
      
    <div class="faq-item">
      <h3 class="faq-question">
        How does the tax breakdown work?
      </h3>
      <p class="faq-answer">
        Our calculator uses the latest {{ selectedYear }} tax rates and brackets to estimate your income tax. We break down federal and provincial taxes, showing exactly how much you'll pay at each level. The calculator also shows you how your tax dollars are allocated across different government spending categories, giving you a clear picture of where your money goes.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        Is this calculator accurate?
      </h3>
      <p class="faq-answer">
        Our calculator provides a reliable estimate based on the latest available tax rates and government spending data. While it accounts for standard deductions and credits, your actual tax situation may vary depending on specific circumstances like additional deductions, investments, or business income. For personalized tax advice, we recommend consulting with a tax professional.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        What sources are used for tax calculations?
      </h3>
      <p class="faq-answer">
        We use official data from the Canada Revenue Agency (CRA) and Department of Finance Canada. Our tax brackets and rates are updated to reflect the {{ selectedYear }} tax year, and our government spending breakdown is based on the most recent federal budget reports. We regularly review and update our calculator to ensure accuracy as new information becomes available.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        How much tax do I pay in Canada?
      </h3>
      <p class="faq-answer">
        The amount of tax you pay in Canada depends on your income level, province of residence, and eligible deductions. Canada uses a progressive tax system where higher income levels are taxed at higher rates. Our calculator helps you estimate both federal and provincial taxes based on your specific situation, giving you a clear picture of your total tax obligation for {{ selectedYear }}.
      </p>
    </div>
      
    <!-- Year-specific budget overview FAQs -->
    <div
      v-if="budgetYear === '2024'"
      class="faq-item"
    >
      <h3 class="faq-question">
        What was the overall picture of the 2024 Canadian Federal Budget?
      </h3>
      <p class="faq-answer">
        In the 2024 fiscal year, the Canadian federal government projected total revenues of approximately $498 billion and total expenditures of about $538 billion, resulting in a projected deficit of $40 billion.
        <br><br>
      </p>
    </div>
      
    <div
      v-if="budgetYear === '2022-2023'"
      class="faq-item"
    >
      <h3 class="faq-question">
        What was the overall picture of the 2022–2023 Canadian Federal Budget?
      </h3>
      <p class="faq-answer">
        During the 2022–2023 fiscal year, the Canadian federal government reported total revenues of approximately $482.8 billion and total expenditures of about $574.9 billion, resulting in a deficit of $92.1 billion. This represented a significant improvement from the previous year's deficit of $113.8 billion, reflecting Canada's ongoing economic recovery.
      </p>
    </div>
      
    <!-- Year-specific revenue source FAQs -->
    <div
      v-if="budgetYear === '2024'"
      class="faq-item"
    >
      <h3 class="faq-question">
        Where did the money come from?
      </h3>
      <p class="faq-answer">
        The federal revenue primarily came from several sources:
        <br><br>
        <strong>Personal Income Taxes:</strong> Approximately $230 billion.
        <br><br>
        <strong>Corporate Income Taxes:</strong> Around $70 billion.
        <br><br>
        <strong>Goods and Services Tax (GST):</strong> About $50 billion collected on most goods and services.
        <br><br>
        <strong>Other Sources:</strong> Including Employment Insurance premiums, foreign exchange reserves, pollution pricing, and revenues from other programs and Crown corporations, comprising about 17% of total budgetary revenues.
      </p>
    </div>
      
    <!-- Year-specific expenditure FAQs -->
    <div
      v-if="budgetYear === '2024'"
      class="faq-item"
    >
      <h3 class="faq-question">
        Where did the money go?
      </h3>
      <p class="faq-answer">
        The federal expenditures were allocated across various sectors:
        <br><br>
        <strong>Transfers to Persons:</strong> Including support for the elderly, families with children, and workers, accounting for approximately 25% of total budgetary expenses.
        <br><br>
        <strong>Operating Expenses:</strong> Covering expenditures of departments, agencies, and Crown corporations, representing about 23% of total budgetary expenses.
        <br><br>
        <strong>Health Transfers:</strong> Constituting around 10% of total budgetary expenses.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        What are the key highlights of Budget 2024?
      </h3>
      <p class="faq-answer">
        <strong>Economic Growth:</strong> Canada avoided recession in 2023 with 1.1% GDP growth and is projected to hit 3.5% in Q1 2024, alongside over 1.1 million new jobs and notable wage gains for lower‑income earners.<br><br>
        <strong>Housing Initiatives:</strong> Ambitious plans to build 3.87 million homes by 2031 through federal policies, unlocking public lands, and significant investments in affordable housing and rental support.<br><br>
        <strong>Fiscal Strength & Investment:</strong> With low net debt and AAA ratings, the government is investing billions in clean energy (including a $93 billion net‑zero transition), innovation (AI, research programs), and core public services.<br><br>
        <strong>Social & Indigenous Support:</strong> Major funding is dedicated to healthcare, social programs, and targeted Indigenous investments to improve housing, infrastructure, and cultural initiatives.<br><br>
        <strong>Public Safety & Fiscal Responsibility:</strong> Enhanced cybersecurity and public safety measures are supported by fiscal reforms like digital services and capital gains taxes, alongside strategic bond issuances.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        How does the Canadian government spend my taxes?
      </h3>
      <p class="faq-answer">
        Your tax dollars fund a wide range of government services and programs. Major spending categories include healthcare transfers to provinces, social programs like Old Age Security and the Canada Child Benefit, national defense, infrastructure projects, and debt servicing. Our calculator provides a visual breakdown of how your specific tax contribution is distributed across these categories, helping you understand exactly where your money goes.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        How do these budgets affect my community?
      </h3>
      <p class="faq-answer">
        Federal budgets impact local communities by funding improvements in infrastructure, healthcare, housing, and public services. Investments in job creation, local economic development, and regional infrastructure projects directly benefit your community by improving the quality of local services and overall economic stability.
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        How can I stay informed about federal spending and fiscal policies?
      </h3>
      <p class="faq-answer">
        You can stay updated by following official government publications such as the <a
          href="https://www.tpsgc-pwgsc.gc.ca/recgen/cpc-pac/index-eng.html"
          target="_blank"
          rel="noopener noreferrer"
        >Public Accounts of Canada</a>, visiting the Department of Finance website, and monitoring reputable news sources that cover fiscal policies and budget updates. The Public Accounts provide detailed information on government revenues, expenditures, assets, and liabilities. Public consultations and local Member of Parliament (MP) sessions are also good channels for getting involved.
      </p>
    </div>
  </section>
</template>
  
<script>
import { useYearStore } from '@/domains/calculator/store/year.js'
import { computed } from 'vue';

export default {
  name: 'FAQSection',
  setup() {
    const yearStore = useYearStore();
    
    const selectedYear = computed(() => yearStore.selectedTaxYear);
    const budgetYear = computed(() => yearStore.budgetYear);
    
    return {
      selectedYear,
      budgetYear
    };
  }
}
</script>
  
<style scoped>
.faq-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  position: relative;
  padding-left: 1rem;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.faq-item {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out forwards;
}

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
}

.faq-question {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(52, 152, 219, 0.2);
}

.faq-answer {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  padding: 0.5rem 0;
}

.faq-answer strong {
  color: #2c3e50;
  font-weight: 600;
}

.faq-answer br {
  margin: 0.5rem 0;
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