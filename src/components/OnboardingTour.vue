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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'

export default {
  name: 'OnboardingTour',
  setup() {
    const tour = ref(null)
    const isTourActive = ref(false)

    const initTour = () => {
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
    }

    const startTour = () => {
      if (!tour.value) {
        initTour()
      }
      isTourActive.value = true
      tour.value.start()
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
          opacity: 0.7;
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
          padding: 12px 24px;
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
          letter-spacing: 0.5px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .tour-button:hover {
          background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tour-button .material-icons {
          font-size: 18px;
          opacity: 0.9;
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
        tour.value.destroy()
      }
    })

    return {
      startTour,
      isTourActive
    }
  }
}
</script>

<style scoped>
.tour-button {
  transition: background-color 0.3s ease;
}
</style> 