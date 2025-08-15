<template>
  <Teleport to="body">
    <Transition
      name="notification-slide"
      appear
    >
      <div
        v-if="modelValue"
        class="tax-breakdown-notification"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-title"
        aria-describedby="notification-description"
      >
        <!-- Notification Content -->
        <div 
          class="notification-container"
          :class="{ 'mobile': isMobile, 'desktop': isDesktop }"
        >
          <!-- Close Button -->
          <button
            class="close-button"
            aria-label="Close notification"
            @click="closePopup"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
              />
            </svg>
          </button>
          
          <!-- Content -->
          <div class="notification-content">
            <div class="notification-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                <path d="M10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            
            <div class="notification-text">
              <h3
                id="notification-title"
                class="notification-title"
              >
                {{ popupTitle }}
              </h3>
              
              <p
                id="notification-description"
                class="notification-description"
              >
                {{ popupDescription }}
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div class="notification-actions">
              <button
                class="primary-button"
                @click="navigateToBreakdown"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                  />
                </svg>
                View Breakdown
              </button>
              
              <button
                class="secondary-button"
                @click="closePopup"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDeviceDetection } from '@/utils/deviceDetection.js'
import { useAnalytics } from '@/utils/analytics.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'navigate'])

const { isMobile, isDesktop } = useDeviceDetection()
const { trackPopupShown, trackPopupClicked, trackPopupDismissed } = useAnalytics()
const dontShowAgain = ref(false)

// Computed properties for device-specific content
const popupTitle = computed(() => {
  return isMobile.value 
    ? 'Want to see your tax breakdown?' 
    : 'Want to see where your taxes go?'
})

const popupDescription = computed(() => {
  return isMobile.value
    ? 'View your personalized tax breakdown and see how your income is allocated.'
    : 'View your personalized federal tax breakdown with detailed charts showing exactly where your tax dollars are allocated.'
})

// Track popup shown when it appears
onMounted(() => {
  console.log('TaxBreakdownPopup mounted, modelValue:', props.modelValue)
  if (props.modelValue) {
    const deviceType = isMobile.value ? 'mobile' : 'desktop'
    trackPopupShown(deviceType)
    console.log('Tracking popup shown for device:', deviceType)
  }
})

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  console.log('TaxBreakdownPopup modelValue changed:', newValue)
})

// Methods
const closePopup = () => {
  const deviceType = isMobile.value ? 'mobile' : 'desktop'
  
  if (dontShowAgain.value) {
    // Store in localStorage to persist across sessions
    localStorage.setItem('taxBreakdownPopupDismissed', 'true')
    trackPopupDismissed(deviceType, true)
  } else {
    // Store in sessionStorage for current session only
    sessionStorage.setItem('taxBreakdownPopupShown', 'true')
    trackPopupDismissed(deviceType, false)
  }
  
  emit('update:modelValue', false)
}

const navigateToBreakdown = () => {
  const deviceType = isMobile.value ? 'mobile' : 'desktop'
  trackPopupClicked(deviceType)
  emit('navigate')
  closePopup()
}

// Watch for changes to save preference
watch(dontShowAgain, (newValue) => {
  if (newValue) {
    localStorage.setItem('taxBreakdownPopupDismissed', 'true')
  }
})
</script>

<style scoped>
.tax-breakdown-notification {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  pointer-events: none;
  width: 100%;
}

.notification-container {
  position: relative;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 -4px 6px -1px rgba(0, 0, 0, 0.3),
    0 -2px 4px -1px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform;
  pointer-events: auto;
  padding: 8px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.notification-container.mobile {
  padding: 6px 16px;
}

.notification-container.desktop {
  padding: 8px 20px;
}

.close-button {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #9ca3af;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #d1d5db;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 18px;
  max-width: 800px;
  margin: 0 auto;
}

.notification-icon {
  flex-shrink: 0;
}

.notification-icon svg {
  color: #60a5fa;
  stroke: currentColor;
  width: 16px;
  height: 16px;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 12px;
  font-weight: 600;
  color: #f9fafb;
  margin-bottom: 1px;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.notification-description {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.01em;
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.primary-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.primary-button:hover {
  background: rgba(59, 130, 246, 1);
  transform: translateY(-1px);
}

.primary-button svg {
  stroke: currentColor;
  width: 12px;
  height: 12px;
}

.secondary-button {
  padding: 4px 8px;
  background: transparent;
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
  border-radius: 4px;
  font-weight: 500;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(156, 163, 175, 0.5);
  color: #d1d5db;
}

/* Animations */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.notification-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .notification-container {
    padding: 6px 16px;
  }
  
  .notification-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding-right: 0;
  }
  
  .notification-text {
    width: 100%;
  }
  
  .notification-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .notification-title {
    font-size: 11px;
  }
  
  .notification-description {
    font-size: 10px;
  }
  
  .primary-button {
    padding: 3px 10px;
    font-size: 10px;
  }
  
  .secondary-button {
    padding: 3px 6px;
    font-size: 10px;
  }
}

/* Touch Device Optimizations */
@media (hover: none) {
  .primary-button:hover {
    transform: none;
  }
  
  .primary-button:active {
    transform: translateY(-1px);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .notification-slide-enter-active,
  .notification-slide-leave-active {
    transition: none;
  }
  
  .primary-button,
  .secondary-button {
    transition: none;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .notification-container {
    border: 2px solid CanvasText;
  }
  
  .primary-button {
    border: 2px solid CanvasText;
  }
  
  .secondary-button {
    border: 2px solid CanvasText;
  }
}
</style> 