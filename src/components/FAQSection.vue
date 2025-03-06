<!-- FAQSection.vue -->
<template>
    <section class="faq-section">
      <h2 class="section-title">Taxpayer FAQs</h2>
      
      <div class="faq-item">
        <h3 class="faq-question">How does the tax breakdown work?</h3>
        <p class="faq-answer">
          Our calculator uses the latest 2024 tax rates and brackets to estimate your income tax. We break down federal and provincial taxes, showing exactly how much you'll pay at each level. The calculator also shows you how your tax dollars are allocated across different government spending categories, giving you a clear picture of where your money goes.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">Is this calculator accurate?</h3>
        <p class="faq-answer">
          Our calculator provides a reliable estimate based on the latest available tax rates and government spending data. While it accounts for standard deductions and credits, your actual tax situation may vary depending on specific circumstances like additional deductions, investments, or business income. For personalized tax advice, we recommend consulting with a tax professional.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">What sources are used for tax calculations?</h3>
        <p class="faq-answer">
          We use official data from the Canada Revenue Agency (CRA) and Department of Finance Canada. Our tax brackets and rates are updated to reflect the 2024 tax year, and our government spending breakdown is based on the most recent federal budget reports. We regularly review and update our calculator to ensure accuracy as new information becomes available.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">How much tax do I pay in Canada?</h3>
        <p class="faq-answer">
          The amount of tax you pay in Canada depends on your income level, province of residence, and eligible deductions. Canada uses a progressive tax system where higher income levels are taxed at higher rates. Our calculator helps you estimate both federal and provincial taxes based on your specific situation, giving you a clear picture of your total tax obligation for 2024.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">What was the overall picture of the 2022–2023 Canadian Federal Budget?</h3>
        <p class="faq-answer">
          During the 2022–2023 fiscal year, the government focused on stabilizing public finances after the COVID-19 pandemic. Total revenues reached approximately $379 billion—boosted by personal and corporate income taxes and GST—while spending on essential services led to a deficit of around $35.3 billion and a national debt of about $1.173 trillion.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">Where did the money come from?</h3>
        <p class="faq-answer">
          The federal revenue primarily came from several sources:
          <br /><strong>Personal Income Taxes:</strong> About $217 billion.
          <br /><strong>Corporate Income Taxes:</strong> Approximately $68 billion, especially from sectors like natural resources and energy.
          <br /><strong>GST:</strong> Around $43.5 billion collected on most goods and services.
          <br /><strong>Other Sources:</strong> Including customs duties, non‑tax revenues, and profits from government enterprises.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">What are the key highlights of Budget 2024?</h3>
        <p class="faq-answer">
          <strong>Economic Growth:</strong> Canada avoided recession in 2023 with 1.1% GDP growth and is projected to hit 3.5% in Q1 2024, alongside over 1.1 million new jobs and notable wage gains for lower‑income earners.<br /><br />
          <strong>Housing Initiatives:</strong> Ambitious plans to build 3.87 million homes by 2031 through federal policies, unlocking public lands, and significant investments in affordable housing and rental support.<br /><br />
          <strong>Fiscal Strength & Investment:</strong> With low net debt and AAA ratings, the government is investing billions in clean energy (including a $93 billion net‑zero transition), innovation (AI, research programs), and core public services.<br /><br />
          <strong>Social & Indigenous Support:</strong> Major funding is dedicated to healthcare, social programs, and targeted Indigenous investments to improve housing, infrastructure, and cultural initiatives.<br /><br />
          <strong>Public Safety & Fiscal Responsibility:</strong> Enhanced cybersecurity and public safety measures are supported by fiscal reforms like digital services and capital gains taxes, alongside strategic bond issuances.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">How does the Canadian government spend my taxes?</h3>
        <p class="faq-answer">
          Your tax dollars fund a wide range of government services and programs. Major spending categories include healthcare transfers to provinces, social programs like Old Age Security and the Canada Child Benefit, national defense, infrastructure projects, and debt servicing. Our calculator provides a visual breakdown of how your specific tax contribution is distributed across these categories, helping you understand exactly where your money goes.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">How do these budgets affect my community?</h3>
        <p class="faq-answer">
          Federal budgets impact local communities by funding improvements in infrastructure, healthcare, housing, and public services. Investments in job creation, local economic development, and regional infrastructure projects directly benefit your community by improving the quality of local services and overall economic stability.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">How can I stay informed about federal spending and fiscal policies?</h3>
        <p class="faq-answer">
          You can stay updated by following official government publications such as the <a href="https://www.tpsgc-pwgsc.gc.ca/recgen/cpc-pac/index-eng.html" target="_blank" rel="noopener noreferrer">Public Accounts of Canada</a>, visiting the Department of Finance website, and monitoring reputable news sources that cover fiscal policies and budget updates. The Public Accounts provide detailed information on government revenues, expenditures, assets, and liabilities. Public consultations and local Member of Parliament (MP) sessions are also good channels for getting involved.
        </p>
      </div>
      
    </section>
  </template>
  
  <script>
  export default {
    name: 'FAQSection'
  }
  </script>
  
  <style scoped>
  .faq-section {
    margin: 40px auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
  }
  
  .section-title {
    text-align: center;
    color: #000000; /* Dark text for maximum readability */
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
  }
  
  .faq-item {
    margin-bottom: 15px;
  }
  
  .faq-question {
    font-weight: 600;
    color: #000000; /* Dark text for questions */
  }
  
  .faq-answer {
    padding: 10px 20px;
    color: #222222; /* Dark gray text for readability */
    border-left: 3px solid #bdc3c7;
    margin-top: 5px;
    white-space: pre-line; /* Preserve line breaks */
  }
  </style>