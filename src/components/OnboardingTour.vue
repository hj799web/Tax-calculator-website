<template>
  <div>
    <button 
      v-if="!isTourActive" 
      class="tour-button"
      :aria-label="t('tour.buttons.open')"
      @click="openOptions"
    >
      <span class="material-icons">lightbulb</span>
      {{ t('tour.buttons.open') }}
    </button>
    <button 
      v-if="!isTourActive"
      class="tour-reset-button"
      :title="t('tour.buttons.resetTooltip')"
      :aria-label="t('tour.buttons.resetTooltip')"
      @click="resetTour"
    >
      <span class="material-icons">restart_alt</span>
    </button>

    <div
      v-if="showOptions"
      class="tour-options-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div class="tour-options">
        <div class="tour-header">
          <span class="material-icons">explore</span>
          <h3 id="tour-title">
            {{ t('tour.options.title') }}
          </h3>
        </div>
        <p class="tour-sub">
          {{ t('tour.options.subtitle') }}
        </p>
        <div class="tour-actions">
          <button
            class="tour-action primary"
            @click="startTour('quick')"
          >
            <span class="material-icons">bolt</span>
            {{ t('tour.options.quick') }}
          </button>
          <button
            class="tour-action"
            @click="startTour('full')"
          >
            <span class="material-icons">tour</span>
            {{ t('tour.options.full') }}
          </button>
        </div>
        <button
          class="tour-skip"
          @click="dismissOptions"
        >
          {{ t('tour.options.skip') }}
        </button>
      </div>
    </div>

    <div
      v-if="onboardingTourErrorMessage"
      class="error-message"
    >
      {{ onboardingTourErrorMessage }}
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/i18n'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
import { handleError } from '@/utils/errorHandler.js';

export default {
  name: 'OnboardingTour',
  setup() {
    const { t } = useI18n()
    const tour = ref(null)
    const isTourActive = ref(false)
    const isInitialized = ref(false)
    const onboardingTourErrorMessage = ref('');
    const showOptions = ref(false)
    const selectedMode = ref('quick')

    const STORAGE_COMPLETED = 'fis.tour.completed.v1'
    const STORAGE_PROMPTED = 'fis.tour.prompted.v1'

    const initTour = () => {
      if (isInitialized.value) return

      tour.value = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shepherd-theme-custom',
          scrollTo: {
            behavior: 'smooth',
            block: 'center'
          },
          cancelIcon: {
            enabled: true
          },
          highlightClass: 'shepherd-highlight',
          // Make the spotlight opening a bit larger/rounder for clarity
          modalOverlayOpeningPadding: 40,
          modalOverlayOpeningRadius: 16,
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
                  gpuAcceleration: true
                }
              }
            ]
          }
        }
      })

      // Helpers to focus specific tabs
      const clickTab = (key) => {
        const el = document.querySelector(`[data-panel-key="${key}"]`)
        if (el) el.click()
      }

      const ensureExpandedMobile = () => {
        const more = document.querySelector('.panel-banner .more-toggle')
        if (more && more.querySelector('.label')?.textContent?.trim() === 'More') {
          more.click()
        }
      }

      // Tab-focused tour steps
      tour.value.addStep({
        id: 'welcome',
        text: `<div class="tour-head">${t('tour.steps.welcome.title')}</div><div>${t('tour.steps.welcome.body')}</div>`,
        classes: 'shepherd-welcome-step',
        attachTo: { element: '.panel-banner', on: 'bottom' },
        buttons: [
          { text: t('tour.actions.skip'), action: tour.value.cancel },
          { text: t('tour.actions.next'), action: tour.value.next }
        ]
      })

      tour.value.addStep({
        id: 'pinned',
        text: `<div class="tour-head">${t('tour.steps.pinned.title')}</div><div>${t('tour.steps.pinned.body')}</div>`,
        attachTo: { element: '[data-panel-group="pinned"]', on: 'right' },
        popperOptions: {
          placement: 'right',
          modifiers: [
            { name: 'offset', options: { offset: [16, 12] } },
            { name: 'preventOverflow', options: { padding: 16, boundary: 'viewport', altAxis: true } },
            { name: 'flip', options: { fallbackPlacements: ['left','bottom','top'], padding: 16 } }
          ]
        },
        when: { show() { ensureExpandedMobile() } },
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'revenue',
        text: `<div class="tour-head">${t('tour.steps.revenue.title')}</div><div>${t('tour.steps.revenue.body')}</div><div class="wiggle-arrow"/>`,
        attachTo: { element: '[data-panel-key="revenue"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('revenue'); setTimeout(res, 150); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })

      // Full: Revenue details
      tour.value.addStep({
        id: 'revenue-explainer',
        text: `<div class="tour-head">${t('tour.steps.revenueExplainer.title')}</div><div>${t('tour.steps.revenueExplainer.body')}</div>`,
        attachTo: { element: '.revenue-explanation', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('revenue'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'revenue-controls',
        text: `<div class="tour-head">${t('tour.steps.revenueControls.title')}</div><div>${t('tour.steps.revenueControls.body')}</div>`,
        attachTo: { element: '.revenue-controls', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('revenue'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'spending',
        text: `<div class="tour-head">${t('tour.steps.spending.title')}</div><div>${t('tour.steps.spending.body')}</div><div class="wiggle-arrow"/>`,
        attachTo: { element: '[data-panel-key="spending"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('spending'); setTimeout(res, 150); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })

      // Full: Spending details
      tour.value.addStep({
        id: 'spending-main',
        text: `<div class="tour-head">${t('tour.steps.spendingMain.title')}</div><div>${t('tour.steps.spendingMain.body')}</div>`,
        attachTo: { element: '.main-categories-grid', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('spending'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'spending-taxexp',
        text: `<div class="tour-head">${t('tour.steps.spendingTaxExp.title')}</div><div>${t('tour.steps.spendingTaxExp.body')}</div>`,
        attachTo: { element: '.tax-expenditures-grid', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('spending'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'spending-reset',
        text: `<div class="tour-head">${t('tour.steps.spendingReset.title')}</div><div>${t('tour.steps.spendingReset.body')}</div>`,
        attachTo: { element: '.reset-button', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('spending'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'results',
        text: `<div class="tour-head">${t('tour.steps.results.title')}</div><div>${t('tour.steps.results.body')}</div><div class="wiggle-arrow"/>`,
        attachTo: { element: '[data-panel-key="results"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('results'); setTimeout(res, 150); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'results-deficit',
        text: `<div class="tour-head">${t('tour.steps.resultsDeficit.title')}</div><div>${t('tour.steps.resultsDeficit.body')}</div>`,
        attachTo: { element: '.deficit-warning-banner', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('results'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'results-download',
        text: `<div class="tour-head">${t('tour.steps.resultsDownload.title')}</div><div>${t('tour.steps.resultsDownload.body')}</div>`,
        attachTo: { element: '.download-button', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('results'); setTimeout(res, 120); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })

      // Projections: Multi-year planning lives here
      tour.value.addStep({
        id: 'projections',
        text: `<div class="tour-head">${t('tour.steps.projectionsOverview.title')}</div><div>${t('tour.steps.projectionsOverview.body')}</div><div class="wiggle-arrow"/>`,
        attachTo: { element: '[data-panel-key="projections"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 150); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'proj-controls',
        text: '<div class="tour-head">Planning controls</div><div>Edit base year, horizon, economic assumptions, and per‑category growth. Use tooltips for guidance.</div>',
        attachTo: { element: '.assumptions.editable', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 140); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'proj-growth',
        text: '<div class="tour-head">Program Spending Growth</div><div>Filter categories and tweak Baseline vs Demographic growth.</div>',
        attachTo: { element: 'details.spend-growth', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 140); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'proj-table',
        text: '<div class="tour-head">Projection table</div><div>Click a year to open the year editor and apply overrides.</div>',
        attachTo: { element: '.proj-table', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 140); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })

      // Assumptions: mirrors key planning controls
      tour.value.addStep({
        id: 'assumptions',
        text: '<div class="tour-head">Assumptions</div><div>Adjust global program spending controls and the same per‑category growth.</div><div class="wiggle-arrow"/>',
        attachTo: { element: '[data-panel-key="assumptions"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('assumptions'); setTimeout(res, 150); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'assumptions-controls',
        text: '<div class="tour-head">Program Spending Controls</div><div>Use Boost for a one‑time level change; Growth (pp) speeds or slows annual growth across categories.</div>',
        attachTo: { element: 'details.planning-controls', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('assumptions'); setTimeout(res, 140); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'sentiment',
        text: `<div class=\"tour-head\">${t('tour.steps.sentiment.title')}</div><div>${t('tour.steps.sentiment.body')}</div><div class=\"wiggle-arrow\"/>`,
        attachTo: { element: '[data-panel-key="sentiment"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('sentiment'); setTimeout(res, 150); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'sentiment-control',
        text: `<div class=\"tour-head\">${t('tour.steps.sentimentControl.title')}</div><div>${t('tour.steps.sentimentControl.body')}</div>`,
        attachTo: { element: '.sentiment-panel .controls', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('sentiment'); setTimeout(res, 120); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'sentiment-groups',
        text: `<div class=\"tour-head\">${t('tour.steps.sentimentGroups.title')}</div><div>${t('tour.steps.sentimentGroups.body')}</div>`,
        attachTo: { element: '.sentiment-panel .group-tabs', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('sentiment'); setTimeout(res, 120); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'projections',
        text: `<div class=\"tour-head\">${t('tour.steps.projectionsShort.title')}</div><div>${t('tour.steps.projectionsShort.body')}</div><div class=\"wiggle-arrow\"/>`,
        attachTo: { element: '[data-panel-key="projections"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 150); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'projections-assumptions',
        text: `<div class=\"tour-head\">${t('tour.steps.projectionsAssumptions.title')}</div><div>${t('tour.steps.projectionsAssumptions.body')}</div>`,
        attachTo: { element: '.multi-year-panel .assumptions', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 120); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })
      tour.value.addStep({
        id: 'projections-table',
        text: `<div class=\"tour-head\">${t('tour.steps.projectionsTable.title')}</div><div>${t('tour.steps.projectionsTable.body')}</div>`,
        attachTo: { element: '.multi-year-panel .proj-table', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('projections'); setTimeout(res, 120); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'more-mobile',
        text: '<div class="tour-head">More</div><div>On mobile, additional tabs live under More.</div><div class="wiggle-arrow"/>',
        attachTo: { element: '.panel-banner .more-toggle', on: 'bottom' },
        when: { show() { /* only show on small screens */ if (window.innerWidth > 640) tour.value.next() } },
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Next', action: tour.value.next } ]
      })

      tour.value.addStep({
        id: 'export',
        text: `<div class="tour-head">${t('tour.steps.export.title')}</div><div>${t('tour.steps.export.body')}</div><div class="wiggle-arrow"/>`,
        attachTo: { element: '[data-panel-key="export"]', on: 'bottom' },
        beforeShowPromise: () => new Promise((res) => { clickTab('export'); setTimeout(res, 150); }),
        buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.finish'), action: tour.value.complete } ]
      })
      tour.value.addStep({
        id: 'export-options',
        text: '<div class="tour-head">Export options</div><div>Use “Include Full Breakdown” for detailed sections; then Download PDF.</div>',
        attachTo: { element: '.btn.btn-primary.mt-4', on: 'top' },
        beforeShowPromise: () => new Promise((res) => { clickTab('export'); setTimeout(res, 150); }),
        buttons: [ { text: 'Back', action: tour.value.back }, { text: 'Finish', action: tour.value.complete } ]
      })

      tour.value.addStep({
        id: 'revenue-sources',
        text: t('tour.steps.revenueSources.body'),
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
            text: t('tour.actions.back'),
            action: tour.value.back
          },
          {
            text: t('tour.actions.next'),
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'spending-controls',
        text: t('tour.steps.spendingControls.body'),
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
            text: t('tour.actions.back'),
            action: tour.value.back
          },
          {
            text: t('tour.actions.next'),
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'budget-results',
        text: t('tour.steps.budgetResults.body'),
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
            text: t('tour.actions.back'),
            action: tour.value.back
          },
          {
            text: t('tour.actions.next'),
            action: tour.value.next
          }
        ]
      })

      tour.value.addStep({
        id: 'public-sentiment',
        text: t('tour.steps.publicSentiment.body'),
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
            text: t('tour.actions.back'),
            action: tour.value.back
          },
          {
            text: t('tour.actions.finish'),
            action: tour.value.complete
          }
        ]
      })

      // Add event listeners
      tour.value.on('complete', () => {
        isTourActive.value = false
        try { localStorage.setItem(STORAGE_COMPLETED, '1') } catch (e) { void e }
      })

      tour.value.on('cancel', () => {
        isTourActive.value = false
        try { localStorage.setItem(STORAGE_COMPLETED, '1') } catch (e) { void e }
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
        // Generic i18n relabel for legacy button texts
        try {
          const btns = event?.step?.options?.buttons
          if (Array.isArray(btns)) {
            const relabeled = btns.map((b) => {
              const txt = typeof b.text === 'string' ? b.text : ''
              if (txt === 'Back') return { ...b, text: t('tour.actions.back') }
              if (txt === 'Next') return { ...b, text: t('tour.actions.next') }
              if (txt === 'Finish') return { ...b, text: t('tour.actions.finish') }
              if (txt === 'Skip') return { ...b, text: t('tour.actions.skip') }
              return b
            })
            event.step.updateStepOptions({ buttons: relabeled })
          }
        } catch (e) { void e }

        // Skip non-quick steps if user chose Quick Tour
        const id = event?.step?.id
        // Patch any legacy hard-coded steps at runtime to i18n
        if (id === 'proj-controls') {
          try {
            event.step.updateStepOptions({
              text: `<div class=\"tour-head\">${t('tour.steps.projControls.title')}</div><div>${t('tour.steps.projControls.body')}</div>`,
              buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.next'), action: tour.value.next } ]
            })
          } catch (e) { void e }
        }
        if (id === 'export-options') {
          try {
            event.step.updateStepOptions({
              text: `<div class=\"tour-head\">${t('tour.steps.exportOptions.title')}</div><div>${t('tour.steps.exportOptions.body')}</div>`,
              buttons: [ { text: t('tour.actions.back'), action: tour.value.back }, { text: t('tour.actions.finish'), action: tour.value.complete } ]
            })
          } catch (e) { void e }
        }
        const quickAllowed = new Set(['welcome','pinned','revenue','spending','projections','results'])
        if (selectedMode.value === 'quick' && id && !quickAllowed.has(id)) {
          setTimeout(() => { try { tour.value.next() } catch (e) { void e } }, 0)
        }
      })

      isInitialized.value = true
    }

    const openOptions = () => { showOptions.value = true }
    const dismissOptions = () => { showOptions.value = false }

    const startTour = (mode = 'quick') => {
      selectedMode.value = mode
      if (!isInitialized.value) {
        initTour()
        isInitialized.value = true
      }
      if (tour.value) {
        showOptions.value = false
        isTourActive.value = true
        tour.value.start()
      }
    }

    const resetTour = () => {
      try {
        localStorage.removeItem(STORAGE_COMPLETED)
        localStorage.removeItem(STORAGE_PROMPTED)
      } catch (e) { void e }
      showOptions.value = true
    }

    onMounted(() => {
      // Add custom styles
      const style = document.createElement('style')
      style.textContent = `
        .shepherd-theme-custom {
          --shepherd-theme-primary: #111827;
          --shepherd-text-color: #111827;
          --shepherd-bg: #ffffff;
          --shepherd-border-radius: 12px;
          --shepherd-element-border-radius: 12px;
        }
        
        /* Card/tooltip modern glass look */
        .shepherd-element {
          background: #ffffff;
          border: 1px solid rgba(229,231,235,0.8);
          box-shadow: 0 12px 32px rgba(2,6,23,0.18);
          border-radius: 12px;
        }

        .shepherd-text {
          font-size: 0.9rem;
          line-height: 1.4;
          padding: 0.9rem 1rem;
          max-width: 280px;
          color: #111827;
        }
        
        /* Primary button with subtle depth */
        .shepherd-button {
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          background: linear-gradient(180deg, #111827 0%, #0b1220 100%);
          color: #ffffff;
          border: none;
        }
        .shepherd-button:not(:disabled):hover { filter: brightness(1.05); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(2,6,23,0.25); }
        .shepherd-button:focus-visible { outline: 2px solid #14b8a6; outline-offset: 2px; }

        /* Crisp spotlight ring; do not alter target colors/brightness.
           Use outline so it's less likely to be clipped by overflow. */
        .shepherd-highlight { position: relative; z-index: 10003; border-radius: 14px; box-shadow: none !important; outline: 4px solid #ffffff; outline-offset: 6px; filter: none !important; transform: translateZ(0); }

        .shepherd-modal-overlay-container {
          transition: opacity 0.3s ease;
        }

        /* Use true cut-out: container stays transparent; opening element casts the dark mask */
        .shepherd-modal-overlay-container.shepherd-modal-is-visible { background: transparent !important; }
        .shepherd-modal-overlay-opening { box-shadow: 0 0 0 9999px rgba(0,0,0,0.9) !important; border-radius: 20px !important; }

        
        /* Disable bouncing/halo completely */
        .shepherd-highlight::before, .shepherd-highlight::after { content: none !important; display: none !important; }
        .wiggle-arrow {
          width: 42px; height: 42px; margin: 6px auto 0; position: relative;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%233498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>') center/contain no-repeat;
          animation: wiggle 1.2s ease-in-out infinite;
        }
        @keyframes wiggle { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(2px) rotate(-2deg); } }

        /* Welcome step specific styles */
        .shepherd-welcome-step .shepherd-element { background: #ffffff; box-shadow: 0 16px 48px rgba(2,6,23,0.22); border: 1px solid rgba(229,231,235,.9); z-index: 10000; border-radius: 12px; }

        .shepherd-welcome-step .shepherd-text { font-size: 1rem; line-height: 1.5; max-width: 300px; color: #111827; font-weight: 600; }

        .shepherd-welcome-step .shepherd-button { font-size: 0.875rem; padding: 0.6rem 1rem; border-radius: 8px; }

        .shepherd-element { transition: transform 0.3s ease, opacity 0.3s ease; opacity: 0; max-width: 320px; margin-top: 20px; will-change: transform, opacity; }

        .shepherd-element.shepherd-enabled { opacity: 1; transform: translateY(0) scale(1); }

        .shepherd-element[data-popper-placement^='top'] {
          transform: translateY(12px);
        }

        .shepherd-element[data-popper-placement^='bottom'] {
          transform: translateY(-12px);
        }
        
        .tour-button { position: fixed; bottom: 20px; left: 20px; padding: 10px 16px; background: #111827; color: #fff; border: none; border-radius: 9999px; cursor: pointer; font-weight: 700; font-size: 0.92rem; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 1000; display: flex; align-items: center; gap: 8px; }
        .tour-button:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(0,0,0,0.28); }

        .tour-button i {
          font-size: 0.9rem;
        }

        .tour-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `
      document.head.appendChild(style)

      // Auto-prompt once per user
      try {
        const completed = localStorage.getItem(STORAGE_COMPLETED)
        const prompted = localStorage.getItem(STORAGE_PROMPTED)
        if (!completed && !prompted) {
          setTimeout(() => {
            showOptions.value = true
            localStorage.setItem(STORAGE_PROMPTED, '1')
          }, 800)
        }
      } catch (e) { void e }
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
      openOptions,
      dismissOptions,
      startTour,
      resetTour,
      isTourActive,
      onboardingTourErrorMessage,
      showOptions
    }
  }
}
</script>

<style scoped>
.tour-button {
  transition: background-color 0.3s ease;
}
.tour-reset-button { position: fixed; bottom: 20px; left: 170px; padding: 8px; border-radius: 50%; border: 1px solid #e5e7eb; background: #ffffff; color: #374151; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; }
.tour-reset-button .material-icons { font-size: 18px; }
.tour-reset-button:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(0,0,0,0.12); }
/* Options modal styles */
.tour-options-overlay { position: fixed; inset: 0; background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(2px); display: grid; place-items: center; z-index: 10000; }
.tour-options { width: 320px; max-width: 90vw; background: #fff; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); padding: 16px; }
.tour-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.tour-header .material-icons { color: #1f2937; }
.tour-header h3 { margin: 0; font-size: 1.05rem; color: #111827; }
.tour-sub { margin: 4px 0 12px; font-size: .9rem; color: #4b5563; }
.tour-actions { display: flex; gap: 10px; }
.tour-action { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f9fafb; color: #111827; font-weight: 600; cursor: pointer; }
.tour-action.primary { background: #111827; color: #fff; border-color: #111827; }
.tour-action:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,.08); }
.tour-skip { margin-top: 10px; width: 100%; background: transparent; border: none; color: #6b7280; cursor: pointer; font-weight: 600; }
</style> 



