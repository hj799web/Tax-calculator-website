<template>
  <div class="terms-of-service">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">
        {{ t('terms.title') }}
      </h1>
      
      <div class="prose prose-lg max-w-none">
        <h2>{{ t('terms.sections.introduction.title') }}</h2>
        <p>{{ t('terms.sections.introduction.body') }}</p>

        <h2>{{ t('terms.sections.accessibility.title') }}</h2>
        <p>{{ t('terms.sections.accessibility.body') }}</p>

        <h2>{{ t('terms.sections.educational.title') }}</h2>
        <p>{{ t('terms.sections.educational.body') }}</p>

        <h2>{{ t('terms.sections.ip.title') }}</h2>
        <p>{{ t('terms.sections.ip.body') }}</p>

        <h2>{{ t('terms.sections.acceptable.title') }}</h2>
        <p>{{ t('terms.sections.acceptable.body') }}</p>
        <ul>
          <li
            v-for="itemKey in acceptableUseItems"
            :key="itemKey"
          >
            {{ t(itemKey) }}
          </li>
        </ul>

        <h2>{{ t('terms.sections.liability.title') }}</h2>
        <p>{{ t('terms.sections.liability.body') }}</p>

        <h2>{{ t('terms.sections.modifications.title') }}</h2>
        <p>{{ t('terms.sections.modifications.body') }}</p>

        <h2>{{ t('terms.sections.law.title') }}</h2>
        <p>{{ t('terms.sections.law.body') }}</p>

        <h2>{{ t('terms.sections.publicUse.title') }}</h2>
        <p>{{ t('terms.sections.publicUse.body') }}</p>
        <ul>
          <li
            v-for="itemKey in publicUseItems"
            :key="itemKey"
          >
            {{ t(itemKey) }}
          </li>
        </ul>
        <p>
          {{ t('terms.sections.publicUse.permissionIntro') }}
          <a
            :href="mailtoLink"
            class="text-blue-600 hover:text-blue-800"
          >{{ contactEmail }}</a>
        </p>

        <h2>{{ t('terms.sections.contact.title') }}</h2>
        <p>
          {{ t('terms.sections.contact.body') }}
          <a
            :href="mailtoLink"
            class="text-blue-600 hover:text-blue-800"
          >{{ contactEmail }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from '@/i18n'

export default {
  name: 'TermsOfServiceView',
  setup() {
    const { t } = useI18n()
    const contactEmail = 'fiscal-insights@outlook.com'
    const mailtoLink = `mailto:${contactEmail}`
    const acceptableUseItems = [
      'terms.sections.acceptable.items.scrape',
      'terms.sections.acceptable.items.reverse',
      'terms.sections.acceptable.items.frame',
      'terms.sections.acceptable.items.automated'
    ]
    const publicUseItems = [
      'terms.sections.publicUse.items.classrooms',
      'terms.sections.publicUse.items.workshops',
      'terms.sections.publicUse.items.events',
      'terms.sections.publicUse.items.research'
    ]

    return {
      t,
      contactEmail,
      mailtoLink,
      acceptableUseItems,
      publicUseItems
    }
  }
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
