<template>
  <div>
    <button 
      @click="startTour" 
      class="tour-button"
      v-if="!isTourActive"
    >
      <span class="material-icons">lightbulb</span>
      Interactive Tour
    </button>
    <div v-if="onboardingTourErrorMessage" class="error-message">{{ onboardingTourErrorMessage }}</div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
import { handleError } from '@/utils/errorHandler.js';

export default {
  name: 'OnboardingTour',
  setup() {
    const tour = ref(null)
    const isTourActive = ref(false)
    const isInitialized = ref(false)
    const onboardingTourErrorMessage = ref('');

    const initTour = () => {
      if (isInitialized.value) return

      tour.value = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shepherd-theme-custom',
          scrollTo: {
            behavior: 'smooth',
            block: 'start'
          },
          cancelIcon: {
            enabled: true
          },
          highlightClass: 'shepherd-highlight',
          modalOverlayOpeningPadding: 4,
          modalOverlayOpeningRadius: 4,
          popperOptions: {
            placement: 'top',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 64]
                }
              },
              {
                name: 'preventOverflow',
                options: {
                  padding: 16,
                  boundary: 'viewport',
                  altAxis: true
                }
              },
              {
                name: 'flip',
                options: {
                  fallbackPlacements: ['bottom'],
                  padding: 16
                }
              },
              {
                name: 'computeStyles',
                options: {
                  adaptive: true,
                  gpuAcceleration: false
                }
              }
            ]
          }
        }
      })

      // Add steps
      tour.value.addStep({
        id: 'welcome',
        text: 'Welcome to the Budget Simulator! Let\'s take a quick tour of the key features.',
        classes: 'shepherd-welcome-step',
        attachTo: {
          element: '.finance-minister-simulator',
          on: 'bottom'
        },
        scrollTo: {
          behavior: 'smooth',
          block: 'start'
        },
        buttons: [
          {
            text: 'Skip',
            action: tour.value.cancel
          },
          {
            text: 'Next',
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'budget-goals',
        text: 'Set your budget goals and track your progress towards achieving them.',
        attachTo: {
          element: '#budget-goals',
          on: 'top'
        },
        scrollTo: {
          behavior: 'smooth',
          block: 'start'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.value.back
          },
          {
            text: 'Next',
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'revenue-sources',
        text: 'Adjust revenue sources like taxes and fees to generate income for the government.',
        attachTo: {
          element: '#revenue-sources',
          on: 'top'
        },
        scrollTo: {
          behavior: 'smooth',
          block: 'start'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.value.back
          },
          {
            text: 'Next',
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'spending-controls',
        text: 'Manage government spending across different sectors and programs.',
        attachTo: {
          element: '#spending-controls',
          on: 'top'
        },
        scrollTo: {
          behavior: 'smooth',
          block: 'start'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.value.back
          },
          {
            text: 'Next',
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'budget-results',
        text: 'View your budget results and see how your decisions affect the overall financial picture.',
        attachTo: {
          element: '#budget-results',
          on: 'top'
        },
        scrollTo: {
          behavior: 'smooth',
          block: 'start'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.value.back
          },
          {
            text: 'Next',
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'public-sentiment',
        text: 'Monitor public sentiment to understand how your budget decisions are received by different groups.',
        attachTo: {
          element: '#public-sentiment',
          on: 'top'
        },
        scrollTo: {
          behavior: 'smooth',
          block: 'start'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.value.back
          },
          {
            text: 'Finish',
            action: tour.value.complete
          }
        ]
      })

      // Add event listeners
      tour.value.on('complete', () => {
        isTourActive.value = false
      })

      tour.value.on('cancel', () => {
        isTourActive.value = false
      })

      // Add smooth transitions between steps
      tour.value.on('show', (event) => {
        if (event.step && event.step.el) {
          requestAnimationFrame(() => {
            event.step.el.style.transition = 'opacity 0.3s ease-in-out'
            event.step.el.style.opacity = '0'
            requestAnimationFrame(() => {
              event.step.el.style.opacity = '1'
            })
          })
        }
      })

      isInitialized.value = true
    }

    const startTour = () => {
      if (!isInitialized.value) {
        initTour()
      }
      if (tour.value) {
      isTourActive.value = true
      tour.value.start()
      }
    }

    onMounted(() => {
      // Add custom styles
      const style = document.createElement('style')
      style.textContent = `
        .shepherd-theme-custom {
          --shepherd-theme-primary: #1a1a1a;
          --shepherd-text-color: #333;
          --shepherd-bg: #fff;
          --shepherd-border-radius: 8px;
          --shepherd-element-border-radius: 8px;
        }
        
        .shepherd-text {
          font-size: 0.75rem;
          line-height: 1.3;
          padding: 0.75rem;
          max-width: 212px;
        }
        
        .shepherd-button {
          padding: 0.25rem 0.625rem;
          border-radius: 3px;
          font-weight: 500;
          transition: all 0.2s ease;
          font-size: 0.75rem;
        }
        
        .shepherd-button:not(:disabled):hover {
          background: #2d2d2d;
          color: white;
        }

        .shepherd-highlight {
          transition: all 0.3s ease;
          box-shadow: 0 0 0 4px rgba(26, 26, 26, 0.2);
        }

        .shepherd-modal-overlay-container {
          transition: opacity 0.3s ease;
        }

        .shepherd-modal-overlay-container.shepherd-modal-is-visible {
          opacity: 0.9;
          background-color: rgba(0, 0, 0, 0.9);
        }

        /* Welcome step specific styles */
        .shepherd-welcome-step .shepherd-element {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          z-index: 10000;
        }

        .shepherd-welcome-step .shepherd-text {
          font-size: 1rem;
          line-height: 1.5;
          max-width: 300px;
          color: #1a1a1a;
          font-weight: 500;
        }

        .shepherd-welcome-step .shepherd-button {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          background: #1a1a1a;
          color: white;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .shepherd-welcome-step .shepherd-button:hover {
          background: #2d2d2d;
          transform: translateY(-1px);
        }

        .shepherd-element {
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0;
          max-width: 238px;
          margin-top: 20px;
          will-change: transform, opacity;
        }

        .shepherd-element.shepherd-enabled {
          opacity: 1;
          transform: translateY(0);
        }

        .shepherd-element[data-popper-placement^='top'] {
          transform: translateY(12px);
        }

        .shepherd-element[data-popper-placement^='bottom'] {
          transform: translateY(-12px);
        }
        
        .tour-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tour-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
        }

        .tour-button i {
          font-size: 0.9rem;
        }

        .tour-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `
      document.head.appendChild(style)

      // Start the tour automatically after a short delay
      setTimeout(() => {
        startTour()
      }, 1000) // 1 second delay to ensure the page is fully loaded
    })

    onUnmounted(() => {
      if (tour.value) {
        try {
          tour.value.complete()
          tour.value.destroy()
          tour.value = null
          isInitialized.value = false
        } catch (error) {
          handleError(error, (msg) => onboardingTourErrorMessage.value = msg)
        }
      }
    })

    return {
      startTour,
      isTourActive,
      onboardingTourErrorMessage
    }
  }
}
</script>

<style scoped>
.tour-button {
  transition: background-color 0.3s ease;
}
</style> 