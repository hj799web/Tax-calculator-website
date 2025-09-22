<!-- eslint-disable -->
<template>
  <div class="welcome-page">
    <div class="background-image" :style="{ backgroundImage: `url('${backgroundImageUrl}')` }"></div>
    <div class="background-overlay"></div>
    
    <div class="container">
      <header>
        <div class="logo">
          <img :src="logoUrl" :alt="t('home.alt.logo')" />
        </div>
        <h1>{{ t('welcome.header.title') }}</h1>
        <p class="subtitle">{{ t('welcome.header.subtitle') }}</p>
        
        <div class="nav-menu">
          <router-link to="/how-it-works" class="nav-link">
            <span class="material-icons">info</span> {{ t('welcome.nav.howItWorks') }}
          </router-link>
          <a 
            href="https://www.canada.ca/en/revenue-agency.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="nav-link"
          >
            <span class="material-icons">open_in_new</span> {{ t('welcome.nav.cra') }}
          </a>
        </div>
        
        <router-link to="/" class="cta-button">
          <span class="material-icons">calculate</span> {{ t('welcome.header.cta') }}
        </router-link>
      </header>
      
      <!-- Navigation Banner - Identical to main app -->
      <div class="header-actions">
        <nav class="main-navigation">
          <router-link
            to="/"
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
      
      <section class="features">
        <div class="feature-card">
          <div class="feature-icon"><span class="material-icons">bar_chart</span></div>
          <h3 class="feature-title">{{ t('welcome.features.accurate.title') }}</h3>
          <p class="feature-description">{{ t('welcome.features.accurate.description') }}</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon"><span class="material-icons">account_balance</span></div>
          <h3 class="feature-title">{{ t('welcome.features.spending.title') }}</h3>
          <p class="feature-description">{{ t('welcome.features.spending.description') }}</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon"><span class="material-icons">swap_horiz</span></div>
          <h3 class="feature-title">{{ t('welcome.features.income.title') }}</h3>
          <p class="feature-description">{{ t('welcome.features.income.description') }}</p>
        </div>
      </section>

      <section class="about-section">
        <h2>{{ t('welcome.about.title') }}</h2>
        <p>{{ t('welcome.about.intro') }}</p>
        
        <div class="tax-info">
          <div class="tax-info-card">
            <h3>{{ t('welcome.about.federal.title') }}</h3>
            <p v-for="bracket in federalBrackets" :key="bracket">• {{ bracket }}</p>
          </div>
          
          <div class="tax-info-card">
            <h3>{{ t('welcome.about.credits.title') }}</h3>
            <p v-for="item in creditItems" :key="item">• {{ item }}</p>
          </div>
        </div>
        
        <p>{{ t('welcome.about.conclusion') }}</p>
      </section>
      
      <section class="faq">
        <h2 class="faq-heading">{{ t('welcome.faq.title') }}</h2>
        
        <div 
          v-for="faqItem in faqItems" 
          :key="faqItem.question"
          class="faq-item"
        >
          <h3 class="faq-question">{{ faqItem.question }}</h3>
          <p class="faq-answer">{{ faqItem.answer }}</p>
        </div>
      </section>
      
      <!-- Finance Minister Budget Simulator Section -->
      <section class="simulator-section">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2rem; margin-bottom: 20px;">{{ t('welcome.simulator.title') }}</h2>
          <p style="font-size: 1.1rem; margin-bottom: 30px; opacity: 0.9;">
            {{ t('welcome.simulator.description') }}
          </p>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <router-link 
              to="/simulator" 
              class="cta-button" 
              style="background: linear-gradient(135deg, #e74c3c, #c0392b); box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);"
            >
              <span class="material-icons">balance</span> {{ t('welcome.simulator.cta') }}
            </router-link>
          </div>
          <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
             <div 
               v-for="feature in simulatorFeatures" 
               :key="feature.title"
               style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px;"
             >
              <span class="material-icons" style="font-size: 2rem; margin-bottom: 10px;">{{ feature.icon }}</span>
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">{{ feature.title }}</h3>
              <p style="opacity: 0.9;">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <router-link to="/" class="cta-button">
        <span class="material-icons">arrow_forward</span> {{ t('welcome.footer.cta') }}
      </router-link>
      
      <footer>
        <div class="footer-links">
          <router-link to="/how-it-works" class="footer-link">
            <span class="material-icons">info</span> {{ t('welcome.footer.links.howItWorks') }}
          </router-link>
          <a href="mailto:fiscal-insights@outlook.com" class="footer-link">
            <span class="material-icons">email</span> {{ t('welcome.footer.links.contact') }}
          </a>
          <a 
            href="https://forms.gle/Yofdxnr1iLZ5fRJ8A" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="footer-link"
          >
            <span class="material-icons">feedback</span> {{ t('welcome.footer.links.feedback') }}
          </a>
          <a 
            href="https://www.canada.ca/en/revenue-agency.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="footer-link"
          >
            <span class="material-icons">open_in_new</span> {{ t('welcome.footer.links.cra') }}
          </a>
        </div>
        <p class="copyright">{{ t('welcome.footer.copyright') }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n'

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

const logoUrl = computed(() => {
  return new URL('@/assets/fiscal-insights-logo.webp', import.meta.url).href
})

const backgroundImageUrl = computed(() => {
  return '/img/parliament.webp'
})

// Access arrays directly from the translation object
import en from '@/i18n/en.json'
import fr from '@/i18n/fr.json'

const federalBrackets = computed(() => {
  const current = locale.value === 'fr' ? fr : en
  return current.welcome?.about?.federal?.brackets || []
})

const creditItems = computed(() => {
  const current = locale.value === 'fr' ? fr : en
  return current.welcome?.about?.credits?.items || []
})

const faqItems = computed(() => {
  const current = locale.value === 'fr' ? fr : en
  return current.welcome?.faq?.items || []
})

const simulatorFeatures = computed(() => {
  const current = locale.value === 'fr' ? fr : en
  return current.welcome?.simulator?.features || []
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.welcome-page {
  font-family: 'Poppins', sans-serif;
  background: none;
  color: #222831;
  line-height: 1.6;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
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
  color: #2c3e50;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-button.active {
  background: #3498db;
  color: white;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: brightness(0.4) blur(1px);
  pointer-events: none;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 1;
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 2;
}

header {
  text-align: center;
  margin-bottom: 50px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
}

.logo {
  margin-bottom: 20px;
}

.logo img {
  max-width: 180px;
  height: auto;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  will-change: transform;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.logo img:hover {
  transform: translateZ(20px) scale(1.05);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

h1, h2, h3, h4, h5, h6, p, .subtitle, .feature-title, .feature-description, .faq-question, .faq-answer, .tax-info-card h3, .tax-info-card p, .footer-link, .copyright, .nav-link {
  color: #181c22 !important;
  text-shadow: 0 1px 4px rgba(0,0,0,0.10);
}

.cta-button {
  color: #fff !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.subtitle {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.8;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #3498db, #2980b9);
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  margin-top: 20px;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  will-change: transform, box-shadow;
  border: none;
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-3px) translateZ(20px) rotateX(2deg);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 60px 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  will-change: transform, box-shadow;
  animation: fadeIn 0.6s ease-out forwards;
}

.feature-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #3498db;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(52, 152, 219, 0.1);
  margin-left: auto;
  margin-right: auto;
  transform: translateZ(30px);
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.feature-card:hover .feature-icon {
  transform: translateZ(50px) scale(1.1);
  background: rgba(52, 152, 219, 0.2);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

.feature-icon .material-icons {
  font-size: 2.5rem;
  color: #3498db;
}

.feature-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-description {
  line-height: 1.8;
}

.faq {
  margin: 60px 0;
}

.faq-heading {
  text-align: center;
  margin-bottom: 40px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out forwards;
}

.faq-item:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.faq-question {
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  transition: transform 0.3s ease;
  will-change: transform;
}

.faq-question:hover {
  transform: translateZ(10px) rotateX(2deg);
}

.faq-answer {
  line-height: 1.8;
}

.about-section {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin: 60px 0;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out forwards;
}

.about-section:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.about-section h2 {
  margin-bottom: 20px;
  text-align: center;
}

.about-section p {
  margin-bottom: 15px;
}

.tax-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.tax-info-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  border-left: 4px solid #3498db;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out forwards;
}

.tax-info-card:hover {
  transform: translateY(-5px) translateZ(20px) rotateX(2deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.tax-info-card h3 {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.tax-info-card p {
  font-size: 0.95rem;
}

footer {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin-top: 60px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.6s ease-out forwards;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.footer-link {
  color: #3498db;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.footer-link:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.copyright {
  font-size: 0.9rem;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.nav-link {
  color: #3498db;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 15px rgba(31, 38, 135, 0.1);
}

.nav-link:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.language-switcher {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}


@media (max-width: 768px) {
  h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .features, .testimonial-cards, .tax-info {
    grid-template-columns: 1fr;
  }

  .nav-menu {
    flex-direction: column;
    gap: 10px;
  }
  
  
  .header-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .main-navigation {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .nav-link {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 100px;
  }
  
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

/* Mobile scaling for all components */
.welcome-page {
  font-size: 0.9rem;
}

.container {
  padding: 25px 15px;
  margin: 20px auto;
}

.feature-card, .tax-info-card, .faq-item, .about-section {
  padding: 20px;
  margin-bottom: 15px;
}

.feature-title, .faq-question {
  font-size: 1.1rem;
}

.feature-description, .faq-answer, .tax-info-card p {
  font-size: 0.85rem;
}

.cta-button {
  padding: 10px 20px;
  font-size: 0.95rem;
}

.about-section h2, .faq-heading {
  font-size: 1.4rem;
}

.feature-icon {
  width: 40px;
  height: 40px;
  font-size: 1.4rem;
}

.logo img {
  max-width: 140px;
}

.footer-links {
  flex-wrap: wrap;
  gap: 10px;
}

.footer-link {
  font-size: 0.85rem;
}

.simulator-section {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  padding: 40px;
  border-radius: 20px;
  margin: 60px 0;
  color: white;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  transition: all 0.3s ease;
  will-change: transform, box-shadow;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.6s ease-out forwards;
}

.simulator-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  z-index: 1;
}

.simulator-section > * {
  position: relative;
  z-index: 2;
}

.simulator-section:hover {
  transform: translateY(-5px) translateZ(30px) rotateX(2deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.simulator-section .feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
}

.simulator-section .feature-card:hover {
  transform: translateY(-5px) translateZ(30px) rotateX(2deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.simulator-section .feature-card i {
  transform: translateZ(20px);
  transition: transform 0.3s ease;
}

.simulator-section .feature-card:hover i {
  transform: translateZ(40px) scale(1.1);
}

/* Add smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Add modern scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}

/* Add loading animation */
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

.feature-card:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-card:nth-child(3) {
  animation-delay: 0.4s;
}
</style>
