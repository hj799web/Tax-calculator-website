/* eslint-disable */
<template>
  <ErrorBoundary component-name="App">
    <div id="app">
      <!-- Router View - This is where route components will be rendered -->
      <router-view v-if="$route.path !== '/'" />

      <!-- Main Content (only shown on home route) -->
      <main v-if="$route.path === '/'">
        <div class="main-container">
          <!-- Header Section -->
          <header>
            <div class="logo-container">
              <img
                :src="logoUrl"
                :alt="t('home.alt.logo')"
                class="site-logo"
              >
            </div>
            <h1 class="main-title main-title--highlight">
              {{ t('home.header.title') }}
            </h1>
            <div class="header-actions">
            <nav class="main-navigation">
              <router-link
                to="/welcome"
                class="nav-link"
              >{{ t('home.nav.home') }}</router-link>
              <router-link
                to="/how-it-works"
                class="nav-link"
              >
                {{ t('home.nav.howItWorks') }}
              </router-link>
              <router-link
                to="/simulator"
                class="nav-link simulator-link"
              >
                {{ t('home.nav.simulator') }}
              </router-link>
              <a
                href="https://www.canada.ca/en/revenue-agency.html"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-link"
              >{{ t('home.nav.cra') }}</a>
            </nav>
            <div class="language-switcher" role="group" :aria-label="t('home.language.switchLabel')">
              <button
                v-for="lng in locales"
                :key="lng.code"
                type="button"
                class="language-button"
                :class="{ active: currentLocale === lng.code }"
                @click="setLocale(lng.code)"
              >
                {{ t(lng.labelKey) }}
              </button>
            </div>
          </div>
            <p class="subtitle subtitle--highlight">
              {{ t('home.header.subtitle') }}
            </p>
          </header>

          <!-- Year Selector Section -->
          <section class="year-selector-section">
            <div class="year-selector-container">
              <h3 class="year-selector-title">
                {{ t('home.year.title') }}
              </h3>
              <div class="year-selector">
                <button 
                  v-for="year in yearStore.taxYears" 
                  :key="year.id"
                  :class="['year-button', { active: yearStore.selectedTaxYear === year.id }]"
                  @click="yearStore.setSelectedTaxYear(year.id)"
                >
                  {{ year.label }}
                </button>
              </div>
                            <p class="year-selector-note">
                {{ yearSelectorNote }}
              </p>
            </div>
          </section>

          <!-- Salary Rate Selector Section -->
          <ErrorBoundary component-name="SalaryRateSelector">
            <SalaryRateSelector />
          </ErrorBoundary>

          <Tabs
            class="calculator-tabs"
            variant="primary"
            :items="tabItems"
            v-model="activeTab"
          >
            <template #default="{ activeTab: currentTab, getPanelProps }">
              <section
                v-bind="getPanelProps('calculator')"
                class="calculator-section budget-simulator"
                v-show="currentTab === 'calculator'"
              >
                <div class="calculator-wrapper">
                  <ErrorBoundary component-name="CalculatorView">
                    <CalculatorView />
                  </ErrorBoundary>
                  <ErrorBoundary component-name="ResultView">
                    <ResultView />
                  </ErrorBoundary>
                </div>
              </section>

              <section
                v-bind="getPanelProps('breakdown')"
                class="income-section"
                v-show="currentTab === 'breakdown'"
              >
                <h2 class="section-title section-title--highlight">
                  {{ t('home.sections.breakdown.title') }}
                </h2>
                <p class="section-description section-description--highlight">
                  {{ t('home.sections.breakdown.description') }}
                </p>
                <ErrorBoundary component-name="FederalBudgetView">
                  <FederalBudgetView />
                </ErrorBoundary>
              </section>

              <section
                v-bind="getPanelProps('categories')"
                class="budget-categories-section expenses-section"
                v-show="currentTab === 'categories'"
              >
                <div class="section-header">
                  <h2 class="section-title">
                    {{ t('home.sections.categories.title') }}
                  </h2>
                  <button
                    class="toggle-section-button"
                    @click="toggleBudgetCategories"
                  >
                    {{ t(showBudgetCategories ? 'home.actions.hide' : 'home.actions.show') }}
                  </button>
                </div>
                <transition name="fade">
                  <div v-if="showBudgetCategories">
                    <p class="section-description">
                    <template v-if="yearStore.selectedTaxYear === '2023'">
                      {{ t('home.sections.categories.description.2023') }}
                    </template>
                    <template v-else-if="yearStore.selectedTaxYear === '2024'">
                      {{ t('home.sections.categories.description.2024') }}
                    </template>
                    <template v-else-if="yearStore.selectedTaxYear === '2025'">
                      {{ t('home.sections.categories.description.2025') }}
                    </template>
                    <template v-else>
                      {{ t('home.sections.categories.description.fallback') }}
                    </template>
                  </p>
                    <ErrorBoundary component-name="BudgetCategoriesView">
                      <BudgetCategoriesView />
                    </ErrorBoundary>
                  </div>
                </transition>
              </section>

              <section
                v-bind="getPanelProps('faqs')"
                class="faq-section summary-section"
                v-show="currentTab === 'faqs'"
              >
                <div class="section-header">
                  <h2 class="section-title">
                    {{ t('home.sections.faqs.title') }}
                  </h2>
                  <button
                    class="toggle-section-button"
                    @click="toggleFAQs"
                  >
                    {{ t(showFAQs ? 'home.actions.hide' : 'home.actions.show') }}
                  </button>
                </div>
                <transition name="fade">
                  <div v-if="showFAQs">
                    <ErrorBoundary component-name="FAQSection">
                      <FAQSection />
                    </ErrorBoundary>
                  </div>
                </transition>
              </section>

              <section
                v-bind="getPanelProps('resources')"
                class="resources-section"
                v-show="currentTab === 'resources'"
              >
                <h2 class="section-title">
                  {{ t('home.sections.resources.title') }}
                </h2>
                <p class="resources-description">
                  {{ t('home.sections.resources.description') }}
                </p>
                <div class="resources-links">
                  <router-link
                    to="/how-it-works"
                    class="resource-link"
                  >
                    {{ t('home.sections.resources.links.howItWorks') }}
                  </router-link>
                  <a
                    href="https://www.canada.ca/en/revenue-agency.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="resource-link"
                  >{{ t('home.sections.resources.links.cra') }}</a>
                  <a
                    href="https://www.canada.ca/en/department-finance.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="resource-link"
                  >{{ t('home.sections.resources.links.finance') }}</a>
                  <a
                    href="https://www.budget.canada.ca/2024/home-accueil-en.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="resource-link"
                  >{{ t('home.sections.resources.links.budget') }}</a>
                  <a
                    href="https://www.tpsgc-pwgsc.gc.ca/recgen/cpc-pac/index-eng.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="resource-link"
                  >{{ t('home.sections.resources.links.publicAccounts') }}</a>
                </div>
              </section>
            </template>
          </Tabs>
        </div>
      </main>

      <!-- Footer - Now visible on all pages -->
      <footer class="site-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>{{ t('home.footer.about.title') }}</h3>
            <p>{{ t('home.footer.about.body') }}</p>
          </div>
          <div class="footer-section">
            <h3>{{ t('home.footer.connect.title') }}</h3>
            <div class="social-links">
              <a
                href="mailto:fiscal-insights@outlook.com"
                class="social-link"
              >
                <img
                  src="@/assets/email-icon.svg"
                  :alt="t('home.alt.email')"
                  class="social-icon"
                >
                {{ t('home.footer.connect.contact') }}
              </a>
              <a
                href="https://www.instagram.com/fiscal_insights1/"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
                  :alt="t('home.alt.instagram')"
                  class="social-icon"
                >
                {{ t('home.footer.social.instagram') }}
              </a>
              <a
                href="https://www.linkedin.com/company/fiscal-insights-canada/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  :alt="t('home.alt.linkedin')"
                  class="social-icon"
                >
                {{ t('home.footer.social.linkedin') }}
              </a>
            </div>
          </div>
          <div class="footer-section">
            <h3>{{ t('home.footer.legal.title') }}</h3>
            <div class="legal-links">
              <router-link
                to="/terms-of-service"
                class="legal-link"
              >
                {{ t('home.footer.legal.terms') }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>{{ t('home.footer.bottom.contact') }} <a href="mailto:fiscal-insights@outlook.com" class="text-blue-600 hover:text-blue-800">fiscal-insights@outlook.com</a></p>
          <p>&copy; {{ new Date().getFullYear() }} {{ t('home.footer.bottom.copy') }}</p>
        </div>
      </footer>

      <!-- Beta Testing Button - Visible on all pages -->
      <a
        href="https://forms.gle/Yofdxnr1iLZ5fRJ8A"
        target="_blank"
        rel="noopener noreferrer"
        class="beta-button"
      >
        <span>{{ t('home.beta.cta') }}</span>
      </a>
    </div>
  </ErrorBoundary>
</template>

<script>
import { ref, computed, defineAsyncComponent, watch, onMounted, onBeforeUnmount } from 'vue'
import { useYearStore } from '@/domains/calculator/store/year.js'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import Tabs from '@/components/Tabs.vue'
import { useI18n } from '@/i18n'

// Lazy load heavy components for better initial page load
const CalculatorView = defineAsyncComponent({
  loader: () => import('@/views/CalculatorView.vue'),
  loadingComponent: { template: '<div class="loading-view">Loading calculator...</div>' },
  errorComponent: { template: '<div class="error-view">Failed to load calculator</div>' },
  delay: 200,
  timeout: 10000
})

const ResultView = defineAsyncComponent({
  loader: () => import('@/views/ResultView.vue'),
  loadingComponent: { template: '<div class="loading-view">Loading results...</div>' },
  errorComponent: { template: '<div class="error-view">Failed to load results</div>' },
  delay: 200,
  timeout: 10000
})

const FederalBudgetView = defineAsyncComponent({
  loader: () => import('@/views/FederalBudgetView.vue'),
  loadingComponent: { template: '<div class="loading-view">Loading budget view...</div>' },
  errorComponent: { template: '<div class="error-view">Failed to load budget view</div>' },
  delay: 200,
  timeout: 10000
})

const BudgetCategoriesView = defineAsyncComponent({
  loader: () => import('@/views/BudgetCategoriesView.vue'),
  loadingComponent: { template: '<div class="loading-view">Loading budget categories...</div>' },
  errorComponent: { template: '<div class="error-view">Failed to load budget categories</div>' },
  delay: 200,
  timeout: 10000
})

const FAQSection = defineAsyncComponent({
  loader: () => import('@/domains/faq/components/FAQSection.vue'),
  loadingComponent: { template: '<div class="loading-view">Loading FAQ...</div>' },
  errorComponent: { template: '<div class="error-view">Failed to load FAQ</div>' },
  delay: 200,
  timeout: 10000
})

// Keep lightweight components as regular imports
import SalaryRateSelector from '@/domains/calculator/components/SalaryRateSelector.vue'

export default {
  name: 'App',
  components: {
    Tabs,
    CalculatorView,
    ResultView,
    FederalBudgetView,
    BudgetCategoriesView,
    FAQSection,
    SalaryRateSelector,
    ErrorBoundary
  },
  setup() {
    const yearStore = useYearStore()
    const { t, locale } = useI18n()
    const locales = [
      { code: 'en', labelKey: 'home.language.english' },
      { code: 'fr', labelKey: 'home.language.french' }
    ]
    const currentLocale = computed(() => locale.value)
    const setLocale = (code) => {
      if (locale.value === code) {
        return
      }
      locale.value = code
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('locale', code)
      }
    }

    const showBudgetCategories = ref(false)
    const showFAQs = ref(false)
    const activeTab = ref('calculator')
    const tabItems = computed(() => [
      { id: 'calculator', label: t('home.tabs.calculator'), panelId: 'calculator-panel' },
      { id: 'breakdown', label: t('home.tabs.breakdown'), panelId: 'how-it-works' },
      { id: 'categories', label: t('home.tabs.categories'), panelId: 'budget-categories-section' },
      { id: 'faqs', label: t('home.tabs.faqs'), panelId: 'faq-section' },
      { id: 'resources', label: t('home.tabs.resources'), panelId: 'resources-section' }
    ])

    const logoUrl = computed(() => {
      return new URL('@/assets/fiscal-insights-logo.webp', import.meta.url).href
    })

    const toggleBudgetCategories = () => {
      showBudgetCategories.value = !showBudgetCategories.value
    }

    const toggleFAQs = () => {
      showFAQs.value = !showFAQs.value
    }

    const yearSelectorNote = computed(() => {
      if (yearStore.selectedTaxYear === '2024') {
        return t('home.year.note.2024')
      }
      if (yearStore.selectedTaxYear === '2025') {
        return t('home.year.note.2025')
      }
      return t('home.year.note.default', { year: yearStore.selectedTaxYear })
    })

    watch(activeTab, (value) => {
      if (value === 'categories' && !showBudgetCategories.value) {
        showBudgetCategories.value = true
      }
      if (value === 'faqs' && !showFAQs.value) {
        showFAQs.value = true
      }
    })

    const handleExternalTabNavigate = (event) => {
      const requestedTab = event.detail?.tab
      if (!requestedTab) {
        return
      }

      const target = tabItems.value.find((item) => item.id === requestedTab)
      if (target) {
        activeTab.value = target.id
      }
    }

    onMounted(() => {
      window.addEventListener('tax-tabs:navigate', handleExternalTabNavigate)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('tax-tabs:navigate', handleExternalTabNavigate)
    })

    return {
      yearStore,
      showBudgetCategories,
      showFAQs,
      activeTab,
      tabItems,
      logoUrl,
      locales,
      currentLocale,
      setLocale,
      yearSelectorNote,
      t,
      toggleBudgetCategories,
      toggleFAQs
    }
  }
}
</script>

<style>
/* Theme tokens (light + dark) */
:root {
  --bg: #ffffff;
  --fg: #111827;           /* slate-900 */
  --muted: #6b7280;        /* gray-500 */
  --surface: #ffffff;      /* card surface */
  --surface-muted: #f9fafb;/* subtle background */
  --border: rgba(17, 24, 39, 0.08);
  --accent: #22d3ee;       /* cyan-400 */
  --success: #10b981;      /* emerald-500 */
  --danger: #ef4444;       /* red-500 */
  --radius: 8px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,.08);
  --shadow: 0 8px 24px rgba(0,0,0,.12);
  --nums: tabular-nums;
}

.dark {
  --bg: #0b0f19;
  --fg: #e5e7eb;
  --muted: #9ca3af;
  --surface: #0f1424;
  --surface-muted: #0c1220;
  --border: rgba(255,255,255,0.08);
  --accent: #60a5fa;       /* blue-400 */
  --shadow-sm: 0 2px 8px rgba(0,0,0,.35);
  --shadow: 0 16px 40px rgba(0,0,0,.45);
}
/* Global crisp rendering improvements */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Base styles */
#app {
  font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--fg);
  text-rendering: optimizeLegibility;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Improve crispness for all text elements */
h1, h2, h3, h4, h5, h6, p, span, div, label, input, button, select, textarea {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Improve crispness for icons */
.material-icons, .icon {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'liga' 1;
}

/* Optimize for high DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  * {
    border-width: 0.5px;
  }
}

/* Ensure crisp rendering on all browsers */
@supports (-webkit-appearance: none) {
  .calculator-container,
  .result-box,
  .calculator-section,
  .faq-section,
  .budget-categories-section,
  .resources-section,
  .year-selector-container,
  .simulator-card {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
}

/* Mobile scaling */
@media (max-width: 768px) {
  #app {
    transform: scale(0.9);
    transform-origin: top center;
    width: 111.11%; /* Compensate for the 10% scale down (100/0.9) */
    margin-left: -5.55%; /* Center the scaled content */
  }
}

.main-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.logo-container {
  text-align: center;
  margin-bottom: 15px;
}

.site-logo {
  max-width: 180px;
  height: auto;
  transition: transform 0.3s ease;
}

.site-logo:hover {
  transform: scale(1.05);
}

.main-title {
  font-size: 34px;
  color: var(--fg);
  margin-bottom: 8px;
  font-weight: 700;
  text-align: center;
}

/* Modern navigation */
.main-navigation {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 10px 0 0;
}
.header-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin: 15px 0 0;
}

.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  padding: 4px;
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
}

.language-button {
  border: none;
  background: transparent;
  color: var(--fg);
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.18);
}

.language-button.active {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.35), rgba(59, 130, 246, 0.45));
  color: #0f172a;
  box-shadow: 0 10px 22px rgba(34, 211, 238, 0.35);
}

@media (prefers-color-scheme: dark) {
  .language-switcher {
    background: rgba(15, 23, 42, 0.65);
  }

  .language-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .language-button.active {
    color: #0f172a;
  }
}

.nav-link {
  color: var(--fg);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: background-color .2s ease, color .2s ease, box-shadow .2s ease;
}
.nav-link:hover {
  background: var(--surface-muted);
}
.nav-link.simulator-link {
  background: var(--accent);
  color: #001018;
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}
.nav-link.simulator-link:hover {
  box-shadow: var(--shadow);
}

.welcome-link {
  display: block;
  text-align: center;
  color: #27ae60;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 18px;
  transition: color 0.3s;
}

.welcome-link:hover {
  color: #219a52;
  text-decoration: underline;
}

.subtitle {
  font-size: 18px;
  color: var(--muted);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 30px;
}

.section-title {
  color: #34495e;
  font-size: 24px;
  margin-top: 40px;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.section-title:hover {
  transform: scale(1.02);
}

.section-description {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.salary-option:hover {
  background-color: #27ae60;
  color: #ffffff;
  transform: translateY(-2px) rotateX(5deg);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.salary-option.active {
  background-color: #27ae60;
  color: #ffffff;
  font-weight: 600;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
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
.result-box,
.calculator-section,
.faq-section,
.budget-categories-section,
.resources-section,
.year-selector-container {
  background: var(--surface) !important;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  flex: 1;
  min-width: 300px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.calculator-container:hover,
.result-box:hover {
  transform: translateY(-5px);
  box-shadow:
    0 15px 30px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
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
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.input-group:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.select-region,
.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.select-region:focus,
.input-field:focus {
  border-color: #27ae60;
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.2);
  transform: translateY(-2px);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tax-pie-chart-container:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/*.tax-pie-chart-container canvas {
  max-width: 100%;
  height: 100% !important;
}*/



/*.pie-chart-item {
  flex: 0 0 auto;
  min-width: 500px;
  max-width: 500px;
  height: 500px;
  width: 500px;
  margin: 40px auto;
  position: relative;
}*/

/*.pie-chart-item canvas {
  width: 100% !important;
  height: 100% !important;
}*/

/*.allocation-total {
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
}*/

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

/* Collapsible section styling */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toggle-section-button {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-section-button:hover {
  background-color: #219a52;
  transform: translateY(-2px);
}

.toggle-section-button:active {
  transform: translateY(0);
}

/* Animation for collapsible sections */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, max-height 0.5s;
  max-height: 1000px;
  overflow: hidden;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Footer Styles */
.site-footer {
  background-color: #000000;
  color: #ecf0f1;
  padding: 40px 20px 20px;
  margin-top: 60px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  min-width: 250px;
  margin-bottom: 30px;
  padding: 0 15px;
}

.footer-section h3 {
  color: #27ae60;
  margin-bottom: 20px;
  font-size: 20px;
  position: relative;
  padding-bottom: 10px;
  font-weight: 600;
}

.footer-section h3:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background-color: #27ae60;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 10px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
}

.social-icon {
  width: 32px;
  height: 32px;
  margin-right: 15px;
  object-fit: contain;
  transition: transform 0.3s ease;
  border-radius: 6px;
  padding: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  filter: brightness(0) invert(1);
}

.social-link:hover .social-icon {
  transform: scale(1.2);
  background-color: rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  color: #27ae60;
  transform: translateX(5px);
  background-color: rgba(255, 255, 255, 0.1);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #1a1a1a;
}

.footer-bottom p {
  color: #95a5a6;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
  
  .footer-section {
    margin-bottom: 30px;
  }
  
  .social-link {
    padding: 12px;
  }
  
  .social-icon {
    width: 28px;
    height: 28px;
  }
}

footer {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 60px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

footer:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

footer p {
  color: #7f8c8d;
  margin: 10px 0;
  transition: transform 0.3s ease;
}

footer p:hover {
  transform: translateX(5px);
  color: #34495e;
}

.calculator-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.calculator-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.budget-categories-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.budget-categories-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.faq-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.faq-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.faq-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.resources-section {
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
  text-align: center;
}

.resources-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.resource-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ecf0f1;
  color: #34495e;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.resource-link:hover {
  background-color: #27ae60;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.beta-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.beta-subtext {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 3px;
  font-weight: normal;
}

.beta-button:hover {
  background: linear-gradient(135deg, #219a52, #27ae60);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(39, 174, 96, 0.5);
  animation: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(39, 174, 96, 0.5);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 10px rgba(39, 174, 96, 0.3);
  }
}

.main-navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px 0;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.nav-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  transform: translateZ(0);
  position: relative;
  overflow: hidden;
  min-width: 120px;
  text-align: center;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.nav-link:hover {
  transform: translateY(-2px) translateZ(20px) rotateX(5deg);
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  transform: translateY(-2px) translateZ(30px);
  box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4);
  border: none;
}

.simulator-link {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

.simulator-link:hover {
  background: linear-gradient(135deg, #2980b9, #2471a3);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

/* Touch Device Optimizations */
@media (hover: none) {
  .nav-link:hover {
    transform: none;
  }
  
  .nav-link:active {
    transform: translateY(-2px) translateZ(10px) rotateX(2deg);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .nav-link,
  .nav-link::before {
    transition: none;
    transform: none !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .nav-link {
    border: 2px solid CanvasText;
  }
  
  .nav-link.router-link-active {
    border: 2px solid CanvasText;
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .main-navigation {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .nav-link {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 100px;
  }
}

.resources-description {
  text-align: center;
  margin-bottom: 20px;
  color: #555;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  .main-navigation {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.75rem 1rem;
    margin: 0.25rem;
  }
  
  .calculator-section, .faq-section, .budget-categories-section, .resources-section {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
  
  .section-title {
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
  }
  
  .section-description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .resources-description {
    font-size: 0.9rem;
    margin: 1.5rem auto;
    padding: 0 1rem;
  }
  
  .resource-link {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }
  
  .site-logo {
    max-width: 140px;
    margin: 1rem auto;
  }
  
  .footer-section {
    padding: 1.5rem;
    margin: 1rem 0;
  }
  
  .footer-section h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .footer-section p, .footer-bottom p {
    font-size: 0.85rem;
    margin: 0.75rem 0;
  }
  
  .social-link {
    font-size: 0.85rem;
    padding: 0.5rem;
    margin: 0.25rem;
  }
  
  .social-icon {
    width: 16px;
    height: 16px;
    margin: 0 0.25rem;
  }
  
  .beta-button {
    padding: 0.75rem 1.25rem;
    font-size: 14px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .beta-subtext {
    font-size: 10px;
    margin-top: 0.25rem;
  }
}

/* Global Button Styles */
button, .button {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:hover, .button:hover {
  background: #2980b9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Secondary Button Style */
button.secondary, .button.secondary {
  background: #718096;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button.secondary:hover, .button.secondary:hover {
  background: #4a5568;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Success Button Style */
button.success, .button.success {
  background: #38a169;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button.success:hover, .button.success:hover {
  background: #2f855a;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Danger Button Style */
button.danger, .button.danger {
  background: #e53e3e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button.danger:hover, .button.danger:hover {
  background: #c53030;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Small Button Style */
button.small, .button.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Large Button Style */
button.large, .button.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Disabled Button Style */
button:disabled, .button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #cbd5e0;
  box-shadow: none;
}

/* Remove 3D effects and complex transitions */
button::before, .button::before {
  display: none;
}

/* Touch Device Optimizations */
@media (hover: none) {
  button:hover, .button:hover {
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  button:active, .button:active {
    background: #2980b9;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  button, .button {
    transition: none;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  button, .button {
    border: 2px solid CanvasText;
  }
}

.year-selector-section {
  margin: 2rem 0;
  perspective: 1000px;
}

.year-selector-container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
  transform-style: preserve-3d;
}

.year-selector-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.year-selector-title:hover {
  transform: scale(1.02) translateZ(20px);
}

.year-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  perspective: 1000px;
}

.year-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  transform: translateZ(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 120px;
  text-align: center;
}

.year-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.year-button:hover {
  transform: translateY(-2px) translateZ(20px) rotateX(5deg);
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.year-button:hover::before {
  left: 100%;
}

.year-button.active {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  transform: translateY(-2px) translateZ(30px);
  box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4);
  border: none;
}

.year-selector-note {
  text-align: center;
  color: #4a5568;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.year-selector-note:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}

/* Touch Device Optimizations */
@media (hover: none) {
  .year-button:hover {
    transform: none;
  }
  
  .year-button:active {
    transform: translateY(-2px) translateZ(10px) rotateX(2deg);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .year-button,
  .year-button::before,
  .year-selector-title,
  .year-selector-note {
    transition: none;
    transform: none !important;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .year-button {
    border: 2px solid CanvasText;
  }
  
  .year-button.active {
    border: 2px solid CanvasText;
  }
}

/* 1. Add new highlight classes */
.main-title--highlight {
  color: #fff;
  font-weight: 700;
  text-shadow: 0 4px 18px rgba(0,0,0,0.45), 0 1px 0 #222;
}
.subtitle--highlight {
  color: #f3f6fa;
  text-shadow: 0 3px 12px rgba(0,0,0,0.45), 0 1px 0 #222;
}
.section-title--highlight {
  color: #fff;
  font-weight: 700;
  text-shadow: 0 4px 18px rgba(0,0,0,0.45), 0 1px 0 #222;
}
.section-description--highlight {
  color: #f3f6fa;
  text-shadow: 0 3px 12px rgba(0,0,0,0.45), 0 1px 0 #222;
}

/* Background is handled by public/index.html */

.calculator-tabs {
  margin-top: 2.5rem;
}

.tax-highlight {
  animation: taxHighlightPulse 1.6s ease forwards;
  box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.35);
  border-radius: 20px;
}

@keyframes taxHighlightPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.45);
  }
  55% {
    box-shadow: 0 0 0 18px rgba(34, 211, 238, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0);
  }
}

/* Loading and Error States for Lazy Components */
.loading-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #3498db;
  font-weight: 600;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: loadingPulse 1.5s ease-in-out infinite;
}

.loading-view::before {
  content: "⏳";
  margin-right: 0.75rem;
  font-size: 1.5em;
  animation: spin 2s linear infinite;
}

.error-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #e74c3c;
  font-weight: 600;
  font-size: 1.1rem;
  background: rgba(255, 245, 245, 0.95);
  border: 2px solid #e74c3c;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);
}

.error-view::before {
  content: "⚠️";
  margin-right: 0.75rem;
  font-size: 1.5em;
}

@keyframes loadingPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
