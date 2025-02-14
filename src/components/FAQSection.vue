<!-- FAQSection.vue -->
<template>
    <section class="faq-section">
      <h2 class="section-title">Taxpayer FAQs</h2>
      
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
        <h3 class="faq-question">How do these budgets affect my community?</h3>
        <p class="faq-answer">
          Federal budgets impact local communities by funding improvements in infrastructure, healthcare, housing, and public services. Investments in job creation, local economic development, and regional infrastructure projects directly benefit your community by improving the quality of local services and overall economic stability.
        </p>
      </div>
      
      <div class="faq-item">
        <h3 class="faq-question">How can I stay informed about federal spending and fiscal policies?</h3>
        <p class="faq-answer">
          You can stay updated by following official government publications such as the Public Accounts of Canada, visiting the Department of Finance website, and monitoring reputable news sources that cover fiscal policies and budget updates. Public consultations and local Member of Parliament (MP) sessions are also good channels for getting involved.
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
  
  