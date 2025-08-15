<template>
  <div class="terms-of-service">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">
        Terms of Service
      </h1>
      
      <div class="prose prose-lg max-w-none">
        <h2>1. Introduction</h2>
        <p>Welcome to Fiscal Insights. By accessing and using this website, you agree to be bound by these Terms of Service. Fiscal Insights is a non-commercial educational tool designed to help Canadians understand federal taxation and government spending through interactive simulations and visualizations.</p>

        <h2>2. Accessibility</h2>
        <p>Fiscal Insights is open to users of all ages and is intended for personal and educational use. The tool is designed to be accessible and informative for everyone interested in understanding Canadian fiscal policy.</p>

        <h2>3. Educational Use Disclaimer</h2>
        <p>The information and tools provided on Fiscal Insights are for educational purposes only. This website does not provide official tax, legal, or financial advice. Users should consult qualified professionals for specific tax or financial guidance.</p>

        <h2>4. Intellectual Property</h2>
        <p>All content, design, and functionality of Fiscal Insights are the exclusive property of the site owner, except where explicitly noted. Government of Canada data used in the tool remains the property of the Crown. Users may not copy, modify, or distribute the site's content without permission.</p>

        <h2>5. Acceptable Use Policy</h2>
        <p>Users agree not to:</p>
        <ul>
          <li>Scrape or collect data from the website</li>
          <li>Reverse-engineer the website's functionality</li>
          <li>Frame or host the website elsewhere</li>
          <li>Use automated tools to access the service</li>
        </ul>

        <h2>6. Limitation of Liability</h2>
        <p>The creators of Fiscal Insights are not responsible for how the tool is used or for any decisions made based on the information provided. The tool is provided "as is" without any warranties of any kind.</p>

        <h2>7. Modifications</h2>
        <p>Fiscal Insights reserves the right to modify, suspend, or discontinue the website at any time without notice. We may also update these Terms of Service periodically.</p>

        <h2>8. Governing Law</h2>
        <p>These Terms of Service are governed by the laws of Ontario and the federal laws of Canada. Any disputes shall be resolved in the courts of Ontario.</p>

        <h2>9. Public and Institutional Use</h2>
        <p>Written permission is required for any use of Fiscal Insights in:</p>
        <ul>
          <li>Classrooms or educational institutions</li>
          <li>Government or nonprofit workshops</li>
          <li>Public events or media presentations</li>
          <li>Research or commercial applications</li>
        </ul>
        <p>
          To request permission, please contact: <a
            href="mailto:fiscal-insights@outlook.com"
            class="text-blue-600 hover:text-blue-800"
          >fiscal-insights@outlook.com</a>
        </p>

        <h2>10. Contact</h2>
        <p>
          For any questions or concerns regarding these Terms of Service, please contact us at: <a
            href="mailto:fiscal-insights@outlook.com"
            class="text-blue-600 hover:text-blue-800"
          >fiscal-insights@outlook.com</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsOfServiceView'
}
</script>

<style scoped>
.terms-of-service {
  min-height: 100vh;
  background-color: #f8fafc;
}

.prose h2 {
  color: #1a202c;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.prose ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style> 