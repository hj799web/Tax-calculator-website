// This script adds structured data to the page for better SEO
document.addEventListener('DOMContentLoaded', function() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Canada Tax Calculator",
    "description": "Get an accurate breakdown of your taxes and see where your money goes with our free Canada tax calculator.",
    "url": "https://hj799web.github.io/Tax-calculator-website/",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    },
    "featureList": [
      "Income tax calculation for Canada",
      "Federal and provincial tax breakdown",
      "Government spending visualization",
      "2024 tax rates and brackets"
    ],
    "author": {
      "@type": "Organization",
      "name": "Fiscal Insights"
    },
    "keywords": "Canada tax calculator, income tax breakdown 2024, Canadian government spending, free tax calculator Canada, tax calculator for beginners"
  };

  // Create the script element and append to head
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
});
