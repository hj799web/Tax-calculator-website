<template>
  <div
    ref="onboardingRoot"
    class="budget-onboarding"
    tabindex="-1"
  >
    <header class="onboarding-header">
      <div class="headline-group">
        <h1>{{ t('quiz.title') }}</h1>
        <p class="subtitle">{{ t('quiz.subtitle') }}</p>
      </div>
      <button
        class="skip-button"
        type="button"
        @click="openSkipDialog"
      >
        {{ t('quiz.actions.skip') }}
      </button>
    </header>

    <div class="progress-container" role="presentation">
      <div class="progress-label">
        {{ t('quiz.progress', { current: currentStepDisplay, total: totalSteps }) }}
      </div>
      <div
        class="progress-track"
        role="progressbar"
        :aria-valuenow="currentStepDisplay"
        :aria-valuemin="1"
        :aria-valuemax="totalSteps"
      >
        <div
          class="progress-fill"
          :class="{ pulsing: isPulsing }"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
    </div>

    <div class="quiz-body">
      <form
        class="question-card"
        @submit.prevent="handleSubmit"
      >
        <Transition name="fade" mode="out-in">
          <div :key="currentStep" class="question-content">
            <h2
              :id="questionTitleId"
              class="question-title"
            >
              {{ t(activeQuestion.labelKey) }}
            </h2>
            <p class="scale-hint">{{ t('quiz.scale.hint') }}</p>
            <div
              class="scale-options"
              role="radiogroup"
              :aria-labelledby="questionTitleId"
              @keydown="handleScaleKeydown"
            >
              <label
                v-for="value in PRIORITY_SCALE"
                :key="value"
                class="scale-option"
              >
                <input
                  :ref="(el) => registerScaleInput(el, value)"
                  type="radio"
                  :name="activeQuestion.id"
                  :value="value"
                  :checked="responses[activeQuestion.id] === value"
                  @change="setResponse(activeQuestion.id, value)"
                >
                <span class="option-visual" aria-hidden="true">{{ value }}</span>
                <span class="option-label">{{ t(`quiz.scale.${value}`) }}</span>
              </label>
            </div>
          </div>
        </Transition>

        <footer class="onboarding-footer">
          <div class="footer-actions">
            <button
              type="button"
              class="secondary"
              :disabled="currentStep === 0"
              @click="goBack"
            >
              {{ t('quiz.actions.back') }}
            </button>
            <button
              v-if="!isLastStep"
              type="button"
              class="primary"
              @click="goNext"
            >
              {{ t('quiz.actions.next') }}
            </button>
            <button
              v-else
              type="submit"
              class="primary"
            >
              {{ t('quiz.actions.submit') }}
            </button>
          </div>
          <button
            v-if="preferences.hasPriorityWeights"
            type="button"
            class="reset-link"
            @click="resetPreferences"
          >
            {{ t('quiz.actions.reset') }}
          </button>
        </footer>
      </form>
      <aside
        class="priority-preview"
        aria-live="polite"
      >
        <header class="preview-header">
          <h3>{{ t('quiz.preview.title') }}</h3>
          <p class="preview-subtitle">{{ t('quiz.preview.subtitle') }}</p>
        </header>
        
        <!-- Philosophy Preview (text-only) -->
        <div v-if="philosophyPreview.length > 0" class="philosophy-preview-section">
          <h4 class="philosophy-title">Budget Philosophy</h4>
          <div class="philosophy-items">
            <div
              v-for="item in philosophyPreview"
              :key="item.id"
              class="philosophy-item"
              :class="{ active: item.id === activeQuestion.id }"
            >
              <span class="philosophy-label">{{ t(item.labelKey) }}</span>
              <span class="philosophy-value">{{ item.preference }}</span>
            </div>
          </div>
        </div>
        
        <!-- Spending Preview (with dollar amounts) -->
        <div class="preview-controls" role="tablist">
          <button
            v-for="option in previewFilterOptions"
            :key="option.value"
            type="button"
            class="preview-filter"
            :class="{ active: previewFilter === option.value }"
            role="tab"
            :aria-selected="previewFilter === option.value"
            @click="setPreviewFilter(option.value)"
          >
            {{ t(option.labelKey) }}
          </button>
        </div>
        <div
          v-if="previewHasChanges"
          class="preview-list-container"
        >
          <ul
            class="preview-list interactive"
            role="listbox"
            :aria-activedescendant="activePreviewEntry ? `preview-item-${activePreviewEntry.id}` : undefined"
          >
            <li
              v-for="entry in filteredPreviewEntries"
              :key="entry.id"
              :id="`preview-item-${entry.id}`"
              class="preview-item"
              :class="{ up: entry.percent > 0, down: entry.percent < 0, active: entry.id === activeQuestion.id }"
            >
              <button
                type="button"
                class="preview-item-button"
                @click="handlePreviewSelect(entry.id)"
              >
                <div class="preview-item-row">
                  <span class="preview-name">{{ t(entry.labelKey) }}</span>
                  <span class="preview-tag" :class="{ up: entry.percent > 0, down: entry.percent < 0 }">{{ entry.percent > 0 ? t('quiz.preview.tags.increase') : entry.percent < 0 ? t('quiz.preview.tags.decrease') : t('quiz.preview.tags.neutral') }}</span>
                </div>
                <div class="preview-metrics">
                  <div class="metric">
                    <span class="metric-label">{{ t('quiz.preview.percentLabel') }}</span>
                    <span class="metric-value">{{ formatPercent(entry.percent) }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">{{ t('quiz.preview.dollarsLabel') }}</span>
                    <span class="metric-value">{{ formatBillions(entry.deltaBillions) }}</span>
                  </div>
                </div>
                <div class="preview-bar-track">
                  <div
                    class="preview-bar"
                    :class="{ up: entry.percent > 0, down: entry.percent < 0 }"
                    :style="{ width: barWidth(entry.percent) }"
                  />
                </div>
              </button>
            </li>
          </ul>
        </div>
        <div
          v-else
          class="preview-placeholder"
        >
          {{ t('quiz.preview.noChanges') }}
        </div>
      </aside>
    </div>

    <Transition name="modal">
      <div
        v-if="showSkipConfirm"
        class="modal-backdrop"
        role="presentation"
      >
        <div
          class="skip-dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="skipDialogTitleId"
        >
          <h2 :id="skipDialogTitleId">{{ t('quiz.skipConfirm.title') }}</h2>
          <p>{{ t('quiz.skipConfirm.body') }}</p>
          <div class="dialog-actions">
            <button
              type="button"
              class="secondary"
              @click="closeSkipDialog"
            >
              {{ t('quiz.skipConfirm.cancel') }}
            </button>
            <button
              type="button"
              class="primary"
              @click="confirmSkip"
            >
              {{ t('quiz.skipConfirm.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from '@/i18n';
import { useUserPreferences } from '@/stores/userPreferences.js';
import { PRIORITY_QUESTIONS, PRIORITY_SCALE, responsesToWeights, recommendPreset } from '@/domains/budget/utils/userPriorities.js';

const PREVIEW_MAX_SHIFT = 0.18;
const PREVIEW_AVERAGE_WEIGHT = 1 / PRIORITY_QUESTIONS.length;
const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const preferences = useUserPreferences();

const onboardingRoot = ref(null);
const currentStep = ref(0);
const responses = reactive({});
const scaleInputs = ref([]);
const showSkipConfirm = ref(false);
const skipDialogTitleId = 'skip-dialog-title';

const totalSteps = PRIORITY_QUESTIONS.length;
const currentStepDisplay = computed(() => currentStep.value + 1);
const progressPercent = computed(() => (currentStepDisplay.value / totalSteps) * 100);
const isLastStep = computed(() => currentStepDisplay.value === totalSteps);
const activeQuestion = computed(() => PRIORITY_QUESTIONS[currentStep.value]);
const questionTitleId = computed(() => `quiz-question-${activeQuestion.value.id}`);
const isPulsing = ref(false);

const defaultResponseValue = 3;

const buildPlainResponses = () => Object.fromEntries(
  PRIORITY_QUESTIONS.map(({ id }) => [id, responses[id] ?? defaultResponseValue])
);

const previewWeights = computed(() => responsesToWeights(buildPlainResponses()));

const CATEGORY_BASE_AMOUNTS = {
  healthcare: 50.4,
  education: 12.0,
  seniors: 76.0,
  childrenFamilies: 26.3,
  indigenousServices: 35.5,
  employmentInsurance: 23.1,
  defensePublicSafety: 32.6,
  environmentalPrograms: 8.0,
  transportationInfrastructure: 15.0,
  researchInnovation: 10.0,
  publicSafetyEmergency: 9.0,
  internationalDevelopment: 53.0,
};

// Separate spending and philosophy questions for preview
const spendingQuestions = computed(() => 
  PRIORITY_QUESTIONS.filter(q => q.category === 'spending')
);

const philosophyQuestions = computed(() => 
  PRIORITY_QUESTIONS.filter(q => q.category === 'philosophy')
);

const previewEntries = computed(() => {
  const weights = previewWeights.value;
  // Only show spending questions with dollar amounts
  return spendingQuestions.value.map(({ id, labelKey }) => {
    const weight = weights[id] ?? 0;
    const relative = weight - PREVIEW_AVERAGE_WEIGHT;
    const adjustment = clampValue(relative / Math.max(PREVIEW_AVERAGE_WEIGHT, 1e-4), -1, 1) * PREVIEW_MAX_SHIFT;
    const percent = Math.round(adjustment * 1000) / 10;
    const baseAmount = CATEGORY_BASE_AMOUNTS[id] ?? 0;
    const deltaBillions = Math.round(baseAmount * adjustment * 10) / 10;
    return {
      id,
      labelKey,
      weight,
      adjustment,
      percent,
      deltaBillions,
      absolutePercent: Math.abs(percent),
    };
  }).sort((a, b) => b.absolutePercent - a.absolutePercent);
});

// Philosophy preview (text-only, no dollar amounts)
const philosophyPreview = computed(() => {
  const weights = previewWeights.value;
  return philosophyQuestions.value.map(({ id, labelKey }) => {
    const weight = weights[id] ?? 0.5;
    let preference = 'Neutral';
    if (id === 'balancedBudget') {
      preference = weight < 0.33 ? 'Accept deficits' : weight > 0.67 ? 'Must balance' : 'Moderate';
    } else if (id === 'taxLevel') {
      preference = weight < 0.33 ? 'Support higher taxes' : weight > 0.67 ? 'Keep taxes low' : 'Moderate';
    }
    return { id, labelKey, preference, weight };
  });
});

const previewFilter = ref('focus');
const previewFilterOptions = [
  { value: 'focus', labelKey: 'quiz.preview.filters.focus' },
  { value: 'raises', labelKey: 'quiz.preview.filters.raises' },
  { value: 'cuts', labelKey: 'quiz.preview.filters.cuts' },
  { value: 'all', labelKey: 'quiz.preview.filters.all' },
];

const activePreviewEntry = computed(() => {
  const id = activeQuestion.value?.id;
  return previewEntries.value.find((entry) => entry.id === id) || null;
});

const filteredPreviewEntries = computed(() => {
  const entries = previewEntries.value;
  const filter = previewFilter.value;

  if (filter === 'raises') {
    return entries.filter((entry) => entry.percent > 0);
  }

  if (filter === 'cuts') {
    return entries.filter((entry) => entry.percent < 0);
  }

  if (filter === 'focus') {
    const focusEntry = activePreviewEntry.value;
    if (focusEntry) {
      const others = entries.filter((entry) => entry.id !== focusEntry.id);
      return [focusEntry, ...others];
    }
  }

  return entries;
});

const previewHasChanges = computed(() => filteredPreviewEntries.value.length > 0);

const formatPercent = (value) => `${value > 0 ? '+' : ''}${value}%`;
const barWidth = (value) => `${Math.min(Math.abs(value), 100)}%`;
const formatBillions = (value) => {
  if (!value) {
    return '±$0B';
  }
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const absolute = Math.abs(value);
  const decimals = absolute >= 10 ? 0 : 1;
  return `${sign}$${absolute.toFixed(decimals)}B`;
};

const setPreviewFilter = (value) => {
  previewFilter.value = value;
};

const handlePreviewSelect = (entryId) => {
  const targetIndex = PRIORITY_QUESTIONS.findIndex(({ id }) => id === entryId);
  if (targetIndex !== -1) {
    currentStep.value = targetIndex;
    previewFilter.value = 'focus';
    
    // Smooth scroll to question card on mobile
    nextTick(() => {
      const card = document.querySelector('.question-card');
      if (card && window.innerWidth < 1024) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      focusCurrentScale();
    });
  }
};

const initialiseResponses = () => {
  PRIORITY_QUESTIONS.forEach(({ id }) => {
    responses[id] = defaultResponseValue;
  });
};

const hydrateResponsesFromStore = () => {
  if (!preferences.rawResponses || Object.keys(preferences.rawResponses.value || {}).length === 0) {
    return;
  }
  PRIORITY_QUESTIONS.forEach(({ id }) => {
    const stored = preferences.rawResponses.value?.[id];
    if (stored !== undefined) {
      const clamped = Math.min(Math.max(Number(stored), PRIORITY_SCALE[0]), PRIORITY_SCALE[PRIORITY_SCALE.length - 1]);
      responses[id] = clamped;
    }
  });
};

const focusCurrentScale = () => {
  nextTick(() => {
    const selectedValue = responses[activeQuestion.value.id] ?? defaultResponseValue;
    const target = scaleInputs.value[selectedValue - 1];
    if (target) {
      target.focus();
    }
  });
};

const registerScaleInput = (el, value) => {
  if (!el) {
    return;
  }
  scaleInputs.value[value - 1] = el;
};

const handleScaleKeydown = (event) => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const inputs = scaleInputs.value.filter(Boolean);
  if (!inputs.length) {
    return;
  }
  const currentIndex = inputs.indexOf(document.activeElement);
  if (currentIndex === -1) {
    inputs[0].focus();
    return;
  }
  const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
  const nextIndex = (currentIndex + delta + inputs.length) % inputs.length;
  inputs[nextIndex].focus();
  const value = Number(inputs[nextIndex].value);
  setResponse(activeQuestion.value.id, value);
};

const goNext = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value += 1;
  }
};

const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  }
};

const setResponse = (questionId, value) => {
  responses[questionId] = Number(value);
};

const resolveDestination = () => {
  const rawReturn = route.query.return;
  if (typeof rawReturn === 'string' && rawReturn.startsWith('/')) {
    try {
      const decoded = decodeURIComponent(rawReturn);
      return decoded.startsWith('/') ? decoded : rawReturn;
    } catch (error) {
      console.warn('[BudgetOnboarding] Failed to decode return path:', error);
      return rawReturn;
    }
  }
  return { name: 'finance-minister-simulator' };
};

const navigateToSimulator = () => {
  const destination = resolveDestination();
  if (typeof destination === 'string') {
    const separator = destination.includes('?') ? '&' : '?';
    router.replace(`${destination}${separator}skipOnboarding=1`);
  } else {
    const query = { ...(destination.query || {}), skipOnboarding: '1' };
    router.replace({ ...destination, query });
  }
};

const handleSubmit = () => {
  const plainResponses = buildPlainResponses();
  const weights = responsesToWeights(plainResponses);
  const presetKey = recommendPreset(weights);
  preferences.save(weights, presetKey, plainResponses);
  navigateToSimulator();
};

const openSkipDialog = () => {
  showSkipConfirm.value = true;
  nextTick(() => {
    const dialog = onboardingRoot.value?.querySelector('.skip-dialog');
    dialog?.focus();
  });
};

const closeSkipDialog = () => {
  showSkipConfirm.value = false;
  focusContainer();
};

const confirmSkip = () => {
  preferences.reset();
  preferences.markCompleted();
  previewFilter.value = 'focus';
  navigateToSimulator();
};

const resetPreferences = () => {
  preferences.reset();
  initialiseResponses();
  previewFilter.value = 'focus';
  focusCurrentScale();
};

const focusContainer = () => {
  nextTick(() => onboardingRoot.value?.focus());
};

const handleGlobalKeydown = (event) => {
  if (event.key === 'Escape' && !showSkipConfirm.value) {
    openSkipDialog();
  }
};

const handleFocusTrap = (event) => {
  if (event.key !== 'Tab' || !onboardingRoot.value) {
    return;
  }

  const focusableSelectors = [
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])'
  ];
  const focusable = Array.from(onboardingRoot.value.querySelectorAll(focusableSelectors.join(',')))
    .filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

  if (!focusable.length) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(currentStep, () => {
  scaleInputs.value = [];
  previewFilter.value = 'focus';
  focusCurrentScale();
  
  // Trigger progress pulse animation
  isPulsing.value = true;
  setTimeout(() => { isPulsing.value = false; }, 400);
});

onMounted(() => {
  initialiseResponses();
  hydrateResponsesFromStore();
  focusContainer();
  focusCurrentScale();
  window.addEventListener('keydown', handleGlobalKeydown);
  onboardingRoot.value?.addEventListener('keydown', handleFocusTrap);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  onboardingRoot.value?.removeEventListener('keydown', handleFocusTrap);
});
</script>

<style scoped>
.budget-onboarding {
  min-height: 100vh;
  background: linear-gradient(180deg, #0c1c3d 0%, #112d5f 40%, #fff 100%);
  color: #0f172a;
  padding: clamp(1.5rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.onboarding-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  color: #f8fafc;
}

.headline-group h1 {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin: 0 0 0.5rem;
}

.subtitle {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.1rem);
  max-width: 32rem;
  opacity: 0.9;
}

.skip-button {
  background: transparent;
  border: 2px solid rgba(248, 250, 252, 0.8);
  color: #f8fafc;
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.skip-button:hover,
.skip-button:focus-visible {
  background: #f8fafc;
  color: #0c1c3d;
}

.skip-button:focus-visible {
  outline: 2px solid rgba(248, 250, 252, 0.8);
  outline-offset: 2px;
  transition: outline-offset 0.2s ease;
}

.skip-button:active {
  transform: scale(0.98);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-label {
  font-weight: 600;
  color: #0f172a;
}

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.1);
  overflow: hidden;
}

.progress-fill {
  height: 8px;
  background: linear-gradient(90deg, #2563eb, #22d3ee);
  transition: width 0.25s ease;
  position: relative;
}

.progress-fill.pulsing::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  border-radius: inherit;
  animation: progress-pulse 0.4s ease-out;
}

@keyframes progress-pulse {
  0% {
    transform: scaleX(1);
    opacity: 1;
  }
  100% {
    transform: scaleX(1.02);
    opacity: 0;
  }
}

.question-card {
  background: rgba(248, 250, 252, 0.92);
  border-radius: 24px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-title {
  font-size: clamp(1.4rem, 3vw, 1.75rem);
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.scale-hint {
  margin: 0 0 1.5rem;
  color: rgba(15, 23, 42, 0.7);
}

.scale-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.scale-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(37, 99, 235, 0.08);
  border: 2px solid transparent;
  transition: border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.scale-option:focus-within,
.scale-option:hover {
  border-color: rgba(37, 99, 235, 0.7);
  transform: translateY(-2px);
  outline: 3px solid rgba(37, 99, 235, 0.3);
  outline-offset: 2px;
}

.scale-option:focus-within {
  outline-color: rgba(37, 99, 235, 0.6);
  outline-offset: 4px;
  transition: outline-offset 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.scale-option input {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

.option-visual {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1d4ed8;
}

.option-label {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: rgba(15, 23, 42, 0.8);
  text-align: center;
}

.quiz-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 360px);
  gap: clamp(1.5rem, 4vw, 2.4rem);
  align-items: start;
  margin-top: clamp(1rem, 3vw, 2rem);
}

.priority-preview {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.35rem, 3vw, 2rem);
  border-radius: 26px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.88));
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(10px);
}

.preview-header h3 {
  margin: 0;
  font-size: 1.12rem;
  font-weight: 700;
  color: #0f172a;
}

.preview-subtitle {
  margin: 0;
  color: rgba(15, 23, 42, 0.62);
  font-size: 0.9rem;
}

.preview-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.preview-filter {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(241, 245, 249, 0.78);
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.7);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.preview-filter:hover,
.preview-filter:focus-visible {
  border-color: rgba(37, 99, 235, 0.5);
  color: #1d4ed8;
}

.preview-filter:focus-visible {
  outline: 2px solid rgba(37, 99, 235, 0.6);
  outline-offset: 2px;
  transition: outline-offset 0.2s ease;
}

.preview-filter.active {
  background: rgba(37, 99, 235, 0.16);
  border-color: rgba(37, 99, 235, 0.5);
  color: #1d4ed8;
  transform: translateY(-1px);
}

.preview-list-container {
  margin-top: 0.75rem;
}

.preview-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}

.preview-item {
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.16);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: preview-card-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.preview-item:nth-child(1) { animation-delay: 0ms; }
.preview-item:nth-child(2) { animation-delay: 50ms; }
.preview-item:nth-child(3) { animation-delay: 100ms; }
.preview-item:nth-child(4) { animation-delay: 150ms; }
.preview-item:nth-child(5) { animation-delay: 200ms; }
.preview-item:nth-child(6) { animation-delay: 250ms; }
.preview-item:nth-child(7) { animation-delay: 300ms; }
.preview-item:nth-child(8) { animation-delay: 350ms; }
.preview-item:nth-child(9) { animation-delay: 400ms; }
.preview-item:nth-child(10) { animation-delay: 450ms; }
.preview-item:nth-child(11) { animation-delay: 500ms; }
.preview-item:nth-child(12) { animation-delay: 550ms; }

@keyframes preview-card-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-item.up {
  border-left: 5px solid #22c55e;
}

.preview-item.down {
  border-left: 5px solid #ef4444;
}

.preview-item.active {
  box-shadow: 0 24px 48px rgba(37, 99, 235, 0.24);
}

.preview-item-button {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.85rem 1rem 1rem;
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
}

.preview-item-button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.6);
  outline-offset: 2px;
  transition: outline-offset 0.2s ease;
}

.preview-item-button:focus-visible {
  outline-offset: 4px;
}

.preview-item-button:hover .preview-name,
.preview-item-button:hover .metric-value,
.preview-item.active .preview-name,
.preview-item.active .metric-value {
  color: #1d4ed8;
}

.preview-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.preview-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.preview-tag {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.65);
}

.preview-tag.up {
  background: rgba(34, 197, 94, 0.14);
  color: #166534;
}

.preview-tag.down {
  background: rgba(239, 68, 68, 0.16);
  color: #991b1b;
}

.preview-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 96px;
}

.metric-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(15, 23, 42, 0.5);
}

.metric-value {
  font-size: 1.02rem;
  font-weight: 700;
  color: #0f172a;
}

.preview-bar-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.25);
  overflow: hidden;
}

.preview-bar {
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s ease;
}

.preview-bar.up {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.preview-bar.down {
  background: linear-gradient(90deg, #f87171, #ef4444);
}

.preview-placeholder {
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.6);
  background: rgba(15, 23, 42, 0.05);
  border-radius: 18px;
  padding: 1rem;
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  z-index: 10;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .skip-dialog,
.modal-leave-active .skip-dialog {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.modal-enter-from .skip-dialog,
.modal-leave-to .skip-dialog {
  transform: scale(0.95);
  opacity: 0;
}

.skip-dialog {
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 32px rgba(15, 23, 42, 0.25);
  outline: none;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .quiz-body {
    grid-template-columns: 1fr;
  }

  .priority-preview {
    padding: 1.25rem;
  }

  .preview-list-container {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .budget-onboarding {
    padding: 1.25rem;
  }

  .onboarding-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .quiz-body {
    gap: 1.15rem;
  }

  .priority-preview {
    padding: 1.1rem 1.3rem;
    border-radius: 24px;
  }

  .preview-controls {
    gap: 0.35rem;
  }

  .preview-filter {
    padding: 0.35rem 0.75rem;
    font-size: 0.78rem;
  }

  .preview-metrics {
    grid-template-columns: 1fr;
  }

  .metric-value {
    font-size: 0.95rem;
  }

  .preview-list-container {
    max-height: none;
  }

  .scale-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .question-card {
    padding: 1.5rem;
  }

  button.primary,
  button.secondary {
    width: 100%;
    justify-content: center;
  }

  .footer-actions {
    width: 100%;
    flex-direction: column;
  }
}

/* Fade transition for question content */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Philosophy preview section styles */
.philosophy-preview-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(241, 245, 249, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.philosophy-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.philosophy-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.philosophy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.15);
  transition: border-color 0.2s ease;
}

.philosophy-item.active {
  border-color: rgba(37, 99, 235, 0.4);
  background: rgba(37, 99, 235, 0.05);
}

.philosophy-label {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.7);
  font-weight: 500;
}

.philosophy-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1d4ed8;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active, .fade-leave-active,
  .modal-enter-active, .modal-leave-active {
    transition: none;
  }
  
  .modal-enter-active .skip-dialog,
  .modal-leave-active .skip-dialog {
    transition: none;
  }
  
  .preview-item {
    animation: none;
  }
  
  .progress-fill.pulsing::after {
    animation: none;
  }
  
  button.primary:active::after {
    animation: none;
  }
  
  .progress-fill,
  .scale-option,
  .preview-bar,
  button.primary,
  button.secondary,
  .skip-button,
  .philosophy-item {
    transition: none;
  }
}
</style>




