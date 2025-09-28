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
        {{ t('how.title') }}
      </h1>

      <!-- Main Navigation -->
      <MainNavigation />
      
      <div class="toc animate-in">
        <h2>{{ t('how.toc.title') }}</h2>
        <ol>
          <li>
            <a
              href="#calculator-methodology"
              @click.prevent="scrollToSection('calculator-methodology')"
            >{{ t('how.toc.items.calculatorMethodology') }}</a>
          </li>
          <li>
            <a
              href="#tax-calculation-process"
              @click.prevent="scrollToSection('tax-calculation-process')"
            >{{ t('how.toc.items.taxCalculationProcess') }}</a>
          </li>
          <li>
            <a
              href="#income-types-and-deductions"
              @click.prevent="scrollToSection('income-types-and-deductions')"
            >{{ t('how.toc.items.incomeTypesAndDeductions') }}</a>
          </li>
          <li>
            <a
              href="#government-spending-visualization"
              @click.prevent="scrollToSection('government-spending-visualization')"
            >{{ t('how.toc.items.governmentSpendingVisualization') }}</a>
          </li>
          <li>
            <a
              href="#benefits-of-using-the-calculator"
              @click.prevent="scrollToSection('benefits-of-using-the-calculator')"
            >{{ t('how.toc.items.benefits') }}</a>
          </li>
          <li>
            <a
              href="#technical-implementation"
              @click.prevent="scrollToSection('technical-implementation')"
            >{{ t('how.toc.items.technicalImplementation') }}</a>
          </li>
          <li>
            <a
              href="#data-sources-and-accuracy"
              @click.prevent="scrollToSection('data-sources-and-accuracy')"
            >{{ t('how.toc.items.dataSourcesAndAccuracy') }}</a>
          </li>
          <li>
            <a
              href="#budget-simulator"
              @click.prevent="scrollToSection('budget-simulator')"
            >{{ t('how.toc.items.budgetSimulator') }}</a>
          </li>
          <li>
            <a
              href="#faq"
              @click.prevent="scrollToSection('faq')"
            >{{ t('how.toc.items.faq') }}</a>
          </li>
        </ol>
      </div>
      
      <div class="section animate-in">
        <p>{{ t('how.intro') }}</p>
      </div>
      
      <div
        id="calculator-methodology"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.calculatorMethodology.title') }}</h2>
        
        <h3>{{ t('how.sections.calculatorMethodology.taxRates.title') }}</h3>
        <p>{{ t('how.sections.calculatorMethodology.taxRates.body') }}</p>
        <ul>
          <li>{{ t('how.sections.calculatorMethodology.taxRates.items.federal') }}</li>
          <li>{{ t('how.sections.calculatorMethodology.taxRates.items.provincial') }}</li>
          <li>{{ t('how.sections.calculatorMethodology.taxRates.items.cppqpp') }}</li>
          <li>{{ t('how.sections.calculatorMethodology.taxRates.items.ei') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.calculatorMethodology.bpa.title') }}</h3>
        <p>{{ t('how.sections.calculatorMethodology.bpa.body') }}</p>
        <ul>
          <li>{{ t('how.sections.calculatorMethodology.bpa.items.federal') }}</li>
          <li>{{ t('how.sections.calculatorMethodology.bpa.items.provincial') }}</li>
          <li>{{ t('how.sections.calculatorMethodology.bpa.items.marital') }}</li>
        </ul>
      </div>
      
      <div
        id="tax-calculation-process"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.taxProcess.title') }}</h2>
        <p>{{ t('how.sections.taxProcess.body') }}</p>
        
        <h3>{{ t('how.sections.taxProcess.steps.collect.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.taxProcess.steps.collect.items.employment') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.collect.items.self') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.collect.items.gains') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.collect.items.dividends') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.collect.items.other') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.taxProcess.steps.apply.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.taxProcess.steps.apply.items.rrsp') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.apply.items.bpa') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.apply.items.dependents') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.apply.items.childCredits') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.apply.items.dividendCredits') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.taxProcess.steps.federal.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.taxProcess.steps.federal.items.determineTaxable') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.federal.items.applyRates') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.federal.items.subtractCredits') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.taxProcess.steps.provincial.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.taxProcess.steps.provincial.items.applyRates') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.provincial.items.subtractCredits') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.taxProcess.steps.payroll.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.taxProcess.steps.payroll.items.cppqpp') }}</li>
          <li>{{ t('how.sections.taxProcess.steps.payroll.items.ei') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.taxProcess.steps.net.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.taxProcess.steps.net.items.subtractTotal') }}</li>
        </ul>
      </div>
      
      <div
        id="income-types-and-deductions"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.income.title') }}</h2>
        <p>{{ t('how.sections.income.body') }}</p>
        
        <h3>{{ t('how.sections.income.employment.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.income.employment.items.taxed') }}</li>
          <li>{{ t('how.sections.income.employment.items.cppEi') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.income.self.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.income.self.items.taxed') }}</li>
          <li>{{ t('how.sections.income.self.items.bothCpp') }}</li>
          <li>{{ t('how.sections.income.self.items.noEi') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.income.gains.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.income.gains.items.halfTaxable') }}</li>
          <li>{{ t('how.sections.income.gains.items.dateTreatment') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.income.dividends.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.income.dividends.items.eligible') }}</li>
          <li>{{ t('how.sections.income.dividends.items.ineligible') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.income.rrsp.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.income.rrsp.items.reduces') }}</li>
        </ul>
      </div>
      
      <div
        id="government-spending-visualization"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.spendingViz.title') }}</h2>
        <p>{{ t('how.sections.spendingViz.body') }}</p>
        
        <h3>{{ t('how.sections.spendingViz.federal.title') }}</h3>
        <p>{{ t('how.sections.spendingViz.federal.body') }}</p>
        <ul>
          <li>{{ t('how.sections.spendingViz.federal.items.health') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.seniors') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.families') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.indigenous') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.ei') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.defense') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.debtService') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.publicDebt') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.operations') }}</li>
          <li>{{ t('how.sections.spendingViz.federal.items.other') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.spendingViz.visualization.title') }}</h3>
        <p>{{ t('how.sections.spendingViz.visualization.body') }}</p>
        <ul>
          <li>{{ t('how.sections.spendingViz.visualization.items.y2023') }}</li>
          <li>{{ t('how.sections.spendingViz.visualization.items.y2024') }}</li>
          <li>{{ t('how.sections.spendingViz.visualization.items.y2026') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.spendingViz.personal.title') }}</h3>
        <p>{{ t('how.sections.spendingViz.personal.body') }}</p>
      </div>
      
      <div
        id="benefits-of-using-the-calculator"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.benefits.title') }}</h2>
        
        <h3>{{ t('how.sections.benefits.accuracy.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.benefits.accuracy.items.upToDate') }}</li>
          <li>{{ t('how.sections.benefits.accuracy.items.incomeTypes') }}</li>
          <li>{{ t('how.sections.benefits.accuracy.items.credits') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.benefits.planning.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.benefits.planning.items.rate') }}</li>
          <li>{{ t('how.sections.benefits.planning.items.periods') }}</li>
          <li>{{ t('how.sections.benefits.planning.items.rrsp') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.benefits.transparency.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.benefits.transparency.items.allocation') }}</li>
          <li>{{ t('how.sections.benefits.transparency.items.priorities') }}</li>
          <li>{{ t('how.sections.benefits.transparency.items.connection') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.benefits.education.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.benefits.education.items.literacy') }}</li>
          <li>{{ t('how.sections.benefits.education.items.demystify') }}</li>
          <li>{{ t('how.sections.benefits.education.items.decisions') }}</li>
        </ul>
        
        <h3>{{ t('how.sections.benefits.accessibility.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.benefits.accessibility.items.free') }}</li>
          <li>{{ t('how.sections.benefits.accessibility.items.noReg') }}</li>
          <li>{{ t('how.sections.benefits.accessibility.items.mobile') }}</li>
          <li>{{ t('how.sections.benefits.accessibility.items.export') }}</li>
        </ul>
      </div>
      
      <div
        id="technical-implementation"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.tech.title') }}</h2>
        <p>{{ t('how.sections.tech.body') }}</p>
        <ul>
          <li>{{ t('how.sections.tech.items.frontend') }}</li>
          <li>{{ t('how.sections.tech.items.state') }}</li>
          <li>{{ t('how.sections.tech.items.viz') }}</li>
          <li>{{ t('how.sections.tech.items.styling') }}</li>
          <li>{{ t('how.sections.tech.items.validation') }}</li>
          <li>{{ t('how.sections.tech.items.export') }}</li>
          <li>{{ t('how.sections.tech.items.realtime') }}</li>
          <li>{{ t('how.sections.tech.items.controls') }}</li>
          <li>{{ t('how.sections.tech.items.tooltips') }}</li>
          <li>{{ t('how.sections.tech.items.autobalance') }}</li>
        </ul>
      </div>
      
      <div
        id="data-sources-and-accuracy"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.data.title') }}</h2>
        <p>{{ t('how.sections.data.body') }}</p>
        <ul>
          <li>{{ t('how.sections.data.items.rates') }}</li>
          <li>{{ t('how.sections.data.items.publicAccounts') }}</li>
          <li>{{ t('how.sections.data.items.budget2024') }}</li>
        </ul>
        <p>{{ t('how.sections.data.note') }}</p>
      </div>
      
      <div
        id="budget-simulator"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.simulator.title') }}</h2>
        <p>{{ t('how.sections.simulator.body') }}</p>

        <h3>{{ t('how.sections.simulator.features.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.simulator.features.items.controls') }}</li>
          <li>{{ t('how.sections.simulator.features.items.realtime') }}</li>
          <li>{{ t('how.sections.simulator.features.items.viz') }}</li>
          <li>{{ t('how.sections.simulator.features.items.autobalance') }}</li>
          <li>{{ t('how.sections.simulator.features.items.tooltips') }}</li>
        </ul>

        <h3>{{ t('how.sections.simulator.mainCats.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.simulator.mainCats.items.social') }}</li>
          <li>{{ t('how.sections.simulator.mainCats.items.economic') }}</li>
          <li>{{ t('how.sections.simulator.mainCats.items.security') }}</li>
          <li>{{ t('how.sections.simulator.mainCats.items.environment') }}</li>
          <li>{{ t('how.sections.simulator.mainCats.items.international') }}</li>
        </ul>

        <h3>{{ t('how.sections.simulator.howTo.title') }}</h3>
        <ol>
          <li>{{ t('how.sections.simulator.howTo.items.adjust') }}</li>
          <li>{{ t('how.sections.simulator.howTo.items.monitor') }}</li>
          <li>{{ t('how.sections.simulator.howTo.items.autobalance') }}</li>
          <li>{{ t('how.sections.simulator.howTo.items.details') }}</li>
          <li>{{ t('how.sections.simulator.howTo.items.export') }}</li>
        </ol>

        <h3>{{ t('how.sections.simulator.results.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.simulator.results.items.totalRevenue') }}</li>
          <li>{{ t('how.sections.simulator.results.items.totalSpending') }}</li>
          <li>{{ t('how.sections.simulator.results.items.surplusDeficit') }}</li>
          <li>{{ t('how.sections.simulator.results.items.debtToGdp') }}</li>
          <li>{{ t('how.sections.simulator.results.items.categoryImpacts') }}</li>
        </ul>

        <h3>{{ t('how.sections.simulator.tips.title') }}</h3>
        <ul>
          <li>{{ t('how.sections.simulator.tips.items.startSmall') }}</li>
          <li>{{ t('how.sections.simulator.tips.items.autoBalance') }}</li>
          <li>{{ t('how.sections.simulator.tips.items.watchDeficit') }}</li>
          <li>{{ t('how.sections.simulator.tips.items.interconnected') }}</li>
          <li>{{ t('how.sections.simulator.tips.items.reviewTooltips') }}</li>
        </ul>

        <h3>{{ t('how.sections.simulator.taxCalc.title') }}</h3>
        <p>{{ t('how.sections.simulator.taxCalc.body') }}</p>
        
        <h4>{{ t('how.sections.simulator.personal.title') }}</h4>
        <ul>
          <li>{{ t('how.sections.simulator.personal.items.method') }}</li>
          <li>{{ t('how.sections.simulator.personal.items.baseRate') }}</li>
          <li>{{ t('how.sections.simulator.personal.items.baseAmount') }}</li>
          <li>{{ t('how.sections.simulator.personal.items.totalRevenue') }}</li>
          <li>{{ t('how.sections.simulator.personal.items.range') }}</li>
          <li>{{ t('how.sections.simulator.personal.items.credits') }}</li>
        </ul>

        <h4>{{ t('how.sections.simulator.corporate.title') }}</h4>
        <ul>
          <li>{{ t('how.sections.simulator.corporate.items.method') }}</li>
          <li>{{ t('how.sections.simulator.corporate.items.baseRate') }}</li>
          <li>{{ t('how.sections.simulator.corporate.items.baseAmount') }}</li>
          <li>{{ t('how.sections.simulator.corporate.items.totalRevenue') }}</li>
          <li>{{ t('how.sections.simulator.corporate.items.range') }}</li>
          <li>{{ t('how.sections.simulator.corporate.items.expenditures') }}</li>
        </ul>

        <h4>{{ t('how.sections.simulator.taxExpenditures.title') }}</h4>
        <ul>
          <li>
            <strong>{{ t('how.sections.simulator.taxExpenditures.personal.title') }}</strong>
            <ul>
              <li>{{ t('how.sections.simulator.taxExpenditures.personal.items.baseAmount') }}</li>
              <li>{{ t('how.sections.simulator.taxExpenditures.personal.items.netAmount') }}</li>
              <li>{{ t('how.sections.simulator.taxExpenditures.personal.items.impact') }}</li>
            </ul>
          </li>
          <li>
            <strong>{{ t('how.sections.simulator.taxExpenditures.corporate.title') }}</strong>
            <ul>
              <li>{{ t('how.sections.simulator.taxExpenditures.corporate.items.baseAmount') }}</li>
              <li>{{ t('how.sections.simulator.taxExpenditures.corporate.items.netAmount') }}</li>
              <li>{{ t('how.sections.simulator.taxExpenditures.corporate.items.impact') }}</li>
            </ul>
          </li>
        </ul>

        <p>{{ t('how.sections.simulator.summary') }}</p>
      </div>
      
      <div
        id="faq"
        class="section animate-in"
      >
        <h2>{{ t('how.sections.faq.title') }}</h2>
        
        <h3>{{ t('how.sections.faq.q1') }}</h3>
        <p>{{ t('how.sections.faq.a1') }}</p>
        
        <h3>{{ t('how.sections.faq.q2') }}</h3>
        <p>{{ t('how.sections.faq.a2') }}</p>
        
        <h3>{{ t('how.sections.faq.q3') }}</h3>
        <p>{{ t('how.sections.faq.a3') }}</p>
        
        <h3>{{ t('how.sections.faq.q4') }}</h3>
        <p>{{ t('how.sections.faq.a4') }}</p>
        
        <h3>{{ t('how.sections.faq.q5') }}</h3>
        <p>{{ t('how.sections.faq.a5') }}</p>
        
        <h3>{{ t('how.sections.faq.q6') }}</h3>
        <p>{{ t('how.sections.faq.a6') }}</p>

        <h3>{{ t('how.sections.faq.q7') }}</h3>
        <p>{{ t('how.sections.faq.a7') }}</p>

        <h3>{{ t('how.sections.faq.q8') }}</h3>
        <p>{{ t('how.sections.faq.a8') }}</p>

        <h3>{{ t('how.sections.faq.q9') }}</h3>
        <p>{{ t('how.sections.faq.a9') }}</p>

        <h3>{{ t('how.sections.faq.q10') }}</h3>
        <p>{{ t('how.sections.faq.a10') }}</p>

        <h3>{{ t('how.sections.faq.q11') }}</h3>
        <p>{{ t('how.sections.faq.a11') }}</p>

        <h3>{{ t('how.sections.faq.q12') }}</h3>
        <p>{{ t('how.sections.faq.a12') }}</p>
      </div>
      
      <div class="footer">
        <p>{{ t('how.footer.updated') }}</p>
        <p>{{ t('how.footer.contact') }} <a href="mailto:fiscal-insights@outlook.com">fiscal-insights@outlook.com</a></p>
        <router-link
          to="/"
          class="back-link"
        >
          {{ t('how.footer.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import initAllAnimations from '../assets/howItWorksAnimations.js';
import '../assets/decorativeElements.css'; // Import decorative elements CSS file
import MainNavigation from '@/components/MainNavigation.vue';
import { useI18n } from '@/i18n'

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
  setup() {
    const { t } = useI18n()
    return { t }
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
  font-size: clamp(1.4rem, 2.2vw + 1rem, 2rem);
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
  font-size: clamp(1.1rem, 1.6vw + 0.9rem, 1.5rem);
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
  font-size: clamp(1rem, 1.2vw + 0.85rem, 1.25rem);
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

/* Mobile refinements */
@media (max-width: 768px) {
  .how-it-works-container { padding: 16px; }
  .section { padding: 16px; margin-bottom: 24px; border-radius: 12px; }
  .toc { padding: 14px; }
}

@media (max-width: 480px) {
  .how-it-works-container { padding: 12px; }
  .section { padding: 14px; margin-bottom: 20px; }
  .toc { padding: 12px; }
}

/* Disable hover transforms on touch devices */
@media (hover: none) and (pointer: coarse) {
  h2:hover, h3:hover, .toc:hover, .section:hover, p:hover, li:hover { transform: none; box-shadow: none; }
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
