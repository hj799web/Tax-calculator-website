<template>
  <Teleport to="body">
    <Transition name="notification-slide" appear>
      <div
        v-if="shouldRender"
        class="tax-breakdown-notification"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-title"
        aria-describedby="notification-description"
      >
        <div
          class="notification-container"
          :class="{ mobile: isMobile, desktop: isDesktop }"
        >
          <button
            class="close-button"
            type="button"
            @click="closePopup"
            :aria-label="t('taxPopup.close')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="notification-content">
            <div class="notification-visual" aria-hidden="true">
              <span class="visual-orb"></span>
              <span class="visual-orb visual-orb--secondary"></span>
              <span class="visual-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M4 18c4-6.5 9.5-9.8 14-9.8S28.5 11.5 32 18c-4 6.5-9.5 9.8-14 9.8S8 24.5 4 18z" opacity="0.45" />
                  <path d="M18 8.2c3.3 0 6 3.8 6 9.8s-2.7 9.8-6 9.8" />
                  <circle cx="18" cy="18" r="3.4" />
                </svg>
              </span>
            </div>

            <div class="notification-body">
              <span class="notification-tag">{{ popupTag }}</span>

              <h3 id="notification-title" class="notification-title">
                {{ popupTitle }}
              </h3>

              <p id="notification-description" class="notification-description">
                {{ popupDescription }}
              </p>

              <div class="tab-chip-group" role="group" :aria-label="t('taxPopup.tabs.aria')">
                <button
                  v-for="destination in tabDestinations"
                  :key="destination.id"
                  class="tab-chip"
                  type="button"
                  @click="navigateToBreakdown(destination.id)"
                >
                  <div class="tab-chip__text">
                    <span class="tab-chip__label">{{ destination.label }}</span>
                    <span class="tab-chip__teaser">{{ destination.teaser }}</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div class="notification-actions">
                <button
                  class="primary-button"
                  type="button"
                  @click="navigateToBreakdown('breakdown')"
                >
                  {{ t('taxPopup.actions.openBreakdown') }}
                </button>

                <button
                  class="secondary-button"
                  type="button"
                  @click="closePopup"
                >
                  {{ t('taxPopup.actions.maybeLater') }}
                </button>
              </div>

              <label class="preference-toggle">
                <input
                  type="checkbox"
                  v-model="dontShowAgain"
                  :aria-label="t('taxPopup.preferences.aria')"
                />
                <span>{{ t('taxPopup.preferences.label') }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from '@/i18n'
import { useDeviceDetection } from '@/utils/deviceDetection.js'
import { useAnalytics } from '@/utils/analytics.js'

const STORAGE_KEY = 'taxBreakdownPopupDismissed'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  taxAmount: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'navigate'])

const { t, locale } = useI18n()
const { isMobile, isDesktop } = useDeviceDetection()
const { trackPopupShown, trackPopupClicked, trackPopupDismissed } = useAnalytics()

const dontShowAgain = ref(false)

const formattedFederalTax = computed(() => {
  const value = Number(props.taxAmount)
  if (!Number.isFinite(value) || value <= 0) {
    return null
  }
  const formatterLocale = locale.value === 'fr' ? 'fr-CA' : 'en-CA'
  return new Intl.NumberFormat(formatterLocale, {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: value >= 10000 ? 0 : 2
  }).format(value)
})

const popupTag = computed(() => {
  if (formattedFederalTax.value) {
    return t('taxPopup.tagWithAmount', { amount: formattedFederalTax.value })
  }
  return t('taxPopup.tagFallback')
})

const popupTitle = computed(() => {
  if (formattedFederalTax.value) {
    return isMobile.value
      ? t('taxPopup.title.mobileWithAmount', { amount: formattedFederalTax.value })
      : t('taxPopup.title.desktopWithAmount', { amount: formattedFederalTax.value })
  }
  return isMobile.value
    ? t('taxPopup.title.mobile')
    : t('taxPopup.title.desktop')
})

const popupDescription = computed(() => {
  if (formattedFederalTax.value) {
    return isMobile.value
      ? t('taxPopup.description.mobileWithAmount', { amount: formattedFederalTax.value })
      : t('taxPopup.description.desktopWithAmount', { amount: formattedFederalTax.value })
  }
  return isMobile.value
    ? t('taxPopup.description.mobileBase')
    : t('taxPopup.description.desktopBase')
})

const tabDestinations = computed(() => [
  { id: 'breakdown', label: t('taxPopup.tabs.breakdown.label'), teaser: t('taxPopup.tabs.breakdown.teaser') },
  { id: 'categories', label: t('taxPopup.tabs.categories.label'), teaser: t('taxPopup.tabs.categories.teaser') },
  { id: 'faqs', label: t('taxPopup.tabs.faqs.label'), teaser: t('taxPopup.tabs.faqs.teaser') },
  { id: 'resources', label: t('taxPopup.tabs.resources.label'), teaser: t('taxPopup.tabs.resources.teaser') }
])

const shouldRender = computed(() => props.modelValue && !dontShowAgain.value)

const closePopup = () => {
  const deviceType = isMobile.value ? 'mobile' : 'desktop'
  trackPopupDismissed(deviceType)
  emit('update:modelValue', false)
}

const navigateToBreakdown = (target = 'breakdown') => {
  const deviceType = isMobile.value ? 'mobile' : 'desktop'
  trackPopupClicked(deviceType, target)
  emit('navigate', target)
  closePopup()
}

onMounted(() => {
  dontShowAgain.value = localStorage.getItem(STORAGE_KEY) === 'true'
  if (props.modelValue && !dontShowAgain.value) {
    const deviceType = isMobile.value ? 'mobile' : 'desktop'
    trackPopupShown(deviceType)
  }
})

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      if (dontShowAgain.value) {
        emit('update:modelValue', false)
        return
      }
      const deviceType = isMobile.value ? 'mobile' : 'desktop'
      trackPopupShown(deviceType)
    }
  }
)

watch(dontShowAgain, (value) => {
  if (value) {
    localStorage.setItem(STORAGE_KEY, 'true')
    if (props.modelValue) {
      emit('update:modelValue', false)
    }
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
})
</script>

<style scoped>
.tax-breakdown-notification {
  position: fixed;
  inset: auto 16px 16px 16px;
  z-index: 10000;
  pointer-events: none;
}

.notification-container {
  pointer-events: auto;
  backdrop-filter: blur(16px);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 197, 255, 0.35);
  border-radius: 20px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.45);
  padding: 18px 22px;
  color: #e0e7ff;
  display: flex;
  position: relative;
  overflow: hidden;
}

.notification-container.mobile {
  flex-direction: column;
  gap: 18px;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: none;
  background: rgba(15, 23, 42, 0.6);
  color: rgba(226, 232, 240, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.close-button:hover {
  background: rgba(30, 41, 59, 0.9);
  color: #fff;
}

.notification-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: flex-start;
}

.notification-container.mobile .notification-content {
  grid-template-columns: 1fr;
  gap: 16px;
}

.notification-visual {
  position: relative;
  width: 72px;
  height: 72px;
}

.visual-orb,
.visual-orb--secondary {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.55), rgba(34, 211, 238, 0.4));
  filter: blur(0.5px);
  animation: orbPulse 6s ease-in-out infinite;
}

.visual-orb--secondary {
  inset: 4px;
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.5), rgba(59, 130, 246, 0.4));
  animation-delay: -2s;
}

.visual-icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #c7d2fe;
}

.notification-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.notification-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(30, 64, 175, 0.35);
  border: 1px solid rgba(129, 140, 248, 0.4);
  color: rgba(224, 231, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.notification-title {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.03em;
  margin: 0;
}

.notification-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(226, 232, 240, 0.85);
}

.tab-chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tab-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 16px;
  border: 1px solid rgba(148, 197, 255, 0.35);
  background: rgba(15, 23, 42, 0.45);
  color: rgba(224, 231, 255, 0.88);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  min-width: 220px;
}

.tab-chip__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.tab-chip__label {
  font-weight: 600;
  font-size: 13px;
  letter-spacing: -0.01em;
}

.tab-chip__teaser {
  font-size: 12px;
  color: rgba(191, 219, 254, 0.75);
  letter-spacing: -0.01em;
}

.tab-chip svg {
  stroke: currentColor;
  flex-shrink: 0;
}

.tab-chip:hover,
.tab-chip:focus-visible {
  outline: none;
  border-color: rgba(59, 130, 246, 0.7);
  color: #f8fafc;
  box-shadow: 0 10px 22px rgba(59, 130, 246, 0.35);
  transform: translateY(-1px);
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.primary-button {
  padding: 10px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(34, 211, 238, 0.9));
  color: white;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 16px rgba(14, 116, 200, 0.35);
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(14, 116, 200, 0.4);
}

.secondary-button {
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: transparent;
  color: rgba(226, 232, 240, 0.75);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  color: rgba(255, 255, 255, 0.92);
  border-color: rgba(148, 163, 184, 0.65);
  background: rgba(255, 255, 255, 0.08);
}

.preference-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(148, 163, 184, 0.9);
  margin-top: 4px;
}

.preference-toggle input {
  width: 16px;
  height: 16px;
  accent-color: rgba(59, 130, 246, 0.9);
}

@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.08); opacity: 0.65; }
}

/* Responsive */
@media (max-width: 768px) {
  .notification-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .notification-visual {
    width: 56px;
    height: 56px;
  }

  .notification-title {
    font-size: 18px;
  }

  .notification-description {
    font-size: 13px;
  }

  .tab-chip {
    width: 100%;
    min-width: 0;
  }

  .tab-chip__label {
    font-size: 13px;
  }

  .tab-chip__teaser {
    font-size: 12px;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    justify-content: center;
  }
}

@media (hover: none) {
  .primary-button:hover {
    transform: none;
  }

  .primary-button:active {
    transform: translateY(-1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .notification-slide-enter-active,
  .notification-slide-leave-active,
  .primary-button,
  .secondary-button,
  .tab-chip {
    transition: none;
  }

  .visual-orb,
  .visual-orb--secondary {
    animation: none;
  }
}

@media (forced-colors: active) {
  .notification-container {
    border: 2px solid CanvasText;
  }

  .primary-button,
  .secondary-button,
  .tab-chip {
    border: 2px solid CanvasText;
  }
}
</style>


