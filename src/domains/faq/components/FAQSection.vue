<!-- FAQSection.vue -->
<template>
  <section class="faq-section">
    <h2 class="section-title">
      {{ translate('faq.title', 'Taxpayer FAQs') }}
    </h2>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q1', 'How does the tax breakdown work?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a1', 'Our calculator uses the latest {year} tax rates and brackets to estimate your income tax. We break down federal and provincial taxes, showing exactly how much you\'ll pay at each level. The calculator also shows you how your tax dollars are allocated across different government spending categories, giving you a clear picture of where your money goes.', { year: selectedYear }) }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q2', 'Is this calculator accurate?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a2', 'Our calculator provides a reliable estimate based on the latest available tax rates and government spending data. While it accounts for standard deductions and credits, your actual tax situation may vary depending on specific circumstances like additional deductions, investments, or business income. For personalized tax advice, we recommend consulting with a tax professional.') }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q3', 'What sources are used for tax calculations?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a3', 'We use official data from the Canada Revenue Agency (CRA) and Department of Finance Canada. Our tax brackets and rates are updated to reflect the {year} tax year, and our government spending breakdown is based on the most recent federal budget reports. We regularly review and update our calculator to ensure accuracy as new information becomes available.', { year: selectedYear }) }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q4', 'How much tax do I pay in Canada?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a4', 'The amount of tax you pay in Canada depends on your income level, province of residence, and eligible deductions. Canada uses a progressive tax system where higher income levels are taxed at higher rates. Our calculator helps you estimate both federal and provincial taxes based on your specific situation, giving you a clear picture of your total tax obligation for {year}.', { year: selectedYear }) }}
      </p>
    </div>
      
    <!-- Year-specific budget overview FAQs -->
    <div
      v-if="budgetYear === '2023-2024'"
      class="faq-item"
    >
      <h3 class="faq-question">
        {{ translate('faq.q5_2024', 'What was the overall picture of the 2024 Canadian Federal Budget?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a5_2024', 'In the 2024 fiscal year, the Canadian federal government projected total revenues of approximately $498 billion and total expenditures of about $538 billion, resulting in a projected deficit of $40 billion.') }}
        <br><br>
      </p>
    </div>
      
    <div
      v-if="budgetYear === '2022-2023'"
      class="faq-item"
    >
      <h3 class="faq-question">
        {{ translate('faq.q5_2022', 'What was the overall picture of the 2022–2023 Canadian Federal Budget?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a5_2022', 'During the 2022–2023 fiscal year, the Canadian federal government reported total revenues of approximately $482.8 billion and total expenditures of about $574.9 billion, resulting in a deficit of $92.1 billion. This represented a significant improvement from the previous year\'s deficit of $113.8 billion, reflecting Canada\'s ongoing economic recovery.') }}
      </p>
    </div>
      
    <!-- Year-specific revenue source FAQs -->
    <div
      v-if="budgetYear === '2023-2024'"
      class="faq-item"
    >
      <h3 class="faq-question">
        {{ translate('faq.q6_2024', 'Where did the money come from?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a6_2024', 'The federal revenue primarily came from several sources:') }}
        <br><br>
        <strong>{{ translate('faq.a6_2024_personal', 'Personal Income Taxes:') }}</strong> {{ translate('faq.a6_2024_personal_amount', 'Approximately $230 billion.') }}
        <br><br>
        <strong>{{ translate('faq.a6_2024_corporate', 'Corporate Income Taxes:') }}</strong> {{ translate('faq.a6_2024_corporate_amount', 'Around $70 billion.') }}
        <br><br>
        <strong>{{ translate('faq.a6_2024_gst', 'Goods and Services Tax (GST):') }}</strong> {{ translate('faq.a6_2024_gst_amount', 'About $50 billion collected on most goods and services.') }}
        <br><br>
        <strong>{{ translate('faq.a6_2024_other', 'Other Sources:') }}</strong> {{ translate('faq.a6_2024_other_amount', 'Including Employment Insurance premiums, foreign exchange reserves, pollution pricing, and revenues from other programs and Crown corporations, comprising about 17% of total budgetary revenues.') }}
      </p>
    </div>
      
    <!-- Year-specific expenditure FAQs -->
    <div
      v-if="budgetYear === '2023-2024'"
      class="faq-item"
    >
      <h3 class="faq-question">
        {{ translate('faq.q7_2024', 'Where did the money go?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a7_2024', 'The federal expenditures were allocated across various sectors:') }}
        <br><br>
        <strong>{{ translate('faq.a7_2024_transfers', 'Transfers to Persons:') }}</strong> {{ translate('faq.a7_2024_transfers_amount', 'Including support for the elderly, families with children, and workers, accounting for approximately 25% of total budgetary expenses.') }}
        <br><br>
        <strong>{{ translate('faq.a7_2024_operating', 'Operating Expenses:') }}</strong> {{ translate('faq.a7_2024_operating_amount', 'Covering expenditures of departments, agencies, and Crown corporations, representing about 23% of total budgetary expenses.') }}
        <br><br>
        <strong>{{ translate('faq.a7_2024_health', 'Health Transfers:') }}</strong> {{ translate('faq.a7_2024_health_amount', 'Constituting around 10% of total budgetary expenses.') }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q8', 'What are the key highlights of Budget 2024?') }}
      </h3>
      <p class="faq-answer">
        <strong>{{ translate('faq.a8_economic', 'Economic Growth:') }}</strong> {{ translate('faq.a8_economic_text', 'Canada avoided recession in 2023 with 1.1% GDP growth and is projected to hit 3.5% in Q1 2024, alongside over 1.1 million new jobs and notable wage gains for lower‑income earners.') }}<br><br>
        <strong>{{ translate('faq.a8_housing', 'Housing Initiatives:') }}</strong> {{ translate('faq.a8_housing_text', 'Ambitious plans to build 3.87 million homes by 2031 through federal policies, unlocking public lands, and significant investments in affordable housing and rental support.') }}<br><br>
        <strong>{{ translate('faq.a8_fiscal', 'Fiscal Strength & Investment:') }}</strong> {{ translate('faq.a8_fiscal_text', 'With low net debt and AAA ratings, the government is investing billions in clean energy (including a $93 billion net‑zero transition), innovation (AI, research programs), and core public services.') }}<br><br>
        <strong>{{ translate('faq.a8_social', 'Social & Indigenous Support:') }}</strong> {{ translate('faq.a8_social_text', 'Major funding is dedicated to healthcare, social programs, and targeted Indigenous investments to improve housing, infrastructure, and cultural initiatives.') }}<br><br>
        <strong>{{ translate('faq.a8_safety', 'Public Safety & Fiscal Responsibility:') }}</strong> {{ translate('faq.a8_safety_text', 'Enhanced cybersecurity and public safety measures are supported by fiscal reforms like digital services and capital gains taxes, alongside strategic bond issuances.') }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q9', 'How does the Canadian government spend my taxes?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a9', 'Your tax dollars fund a wide range of government services and programs. Major spending categories include healthcare transfers to provinces, social programs like Old Age Security and the Canada Child Benefit, national defense, infrastructure projects, and debt servicing. Our calculator provides a visual breakdown of how your specific tax contribution is distributed across these categories, helping you understand exactly where your money goes.') }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q10', 'How do these budgets affect my community?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a10', 'Federal budgets impact local communities by funding improvements in infrastructure, healthcare, housing, and public services. Investments in job creation, local economic development, and regional infrastructure projects directly benefit your community by improving the quality of local services and overall economic stability.') }}
      </p>
    </div>
      
    <div class="faq-item">
      <h3 class="faq-question">
        {{ translate('faq.q11', 'How can I stay informed about federal spending and fiscal policies?') }}
      </h3>
      <p class="faq-answer">
        {{ translate('faq.a11', 'You can stay updated by following official government publications such as the') }} <a
          href="https://www.tpsgc-pwgsc.gc.ca/recgen/cpc-pac/index-eng.html"
          target="_blank"
          rel="noopener noreferrer"
        >{{ translate('faq.a11_link', 'Public Accounts of Canada') }}</a>, {{ translate('faq.a11_rest', 'visiting the Department of Finance website, and monitoring reputable news sources that cover fiscal policies and budget updates. The Public Accounts provide detailed information on government revenues, expenditures, assets, and liabilities. Public consultations and local Member of Parliament (MP) sessions are also good channels for getting involved.') }}
      </p>
    </div>
  </section>
</template>
  
<script>
import { useYearStore } from '@/domains/calculator/store/year.js'
import { computed } from 'vue';
import { useI18n } from '@/i18n'

const { t } = useI18n()
const translate = (key, fallback = '', params) => {
  const value = t(key, params)
  return value === key ? fallback : value
}

export default {
  name: 'FAQSection',
  setup() {
    const yearStore = useYearStore();
    
    const selectedYear = computed(() => yearStore.selectedTaxYear);
    const budgetYear = computed(() => yearStore.budgetYear);
    
    return {
      selectedYear,
      budgetYear,
      translate
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