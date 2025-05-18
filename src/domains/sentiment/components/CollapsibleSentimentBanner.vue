<template>
  <div
    :class="['sentiment-banner', bannerClass, { expanded: isExpanded && !collapsed, collapsed, 'fiscal-warning': fiscalChaosFlag }]"
    tabindex="0"
    @keyup.enter="toggle"
    @click="toggleCollapse"
    role="button"
    aria-label="Show public sentiment details"
  >
    <span class="pill-content">
      <span v-if="fiscalChaosFlag" class="emoji" :aria-label="label">🚨</span>
      <span v-if="!collapsed">
        <span class="score-label">
          <span v-if="fiscalChaosFlag" class="fiscal-warning-text">FISCAL CHAOS WARNING!</span>
          <transition name="score-fade" mode="out-in">
            <span class="score" :key="animatedScore">{{ animatedScore.toFixed(1) }}</span>
          </transition>
          <transition name="delta-fade">
            <span v-if="showDelta" :class="['score-delta', delta > 0 ? 'delta-up' : 'delta-down']" :key="delta">
              <span v-if="delta > 0">▲ +{{ delta.toFixed(1) }}</span>
              <span v-else-if="delta < 0">▼ {{ delta.toFixed(1) }}</span>
            </span>
          </transition>
          <span class="label">{{ label }}</span>
        </span>
        <span v-if="!isExpanded" class="hint">Click to personalize</span>
      </span>
      <span v-else class="collapsed-indicator">Show</span>
    </span>
    <transition name="fade-expand">
      <div v-if="isExpanded && !collapsed" class="expanded-content" @click.stop>
        <SentimentGroupSelector
          :provinces="selectedGroups.provinces"
          :sectors="selectedGroups.sectors"
          :demographics="selectedGroups.demographics"
          @update="handleSelectionUpdate"
          style="margin-top: 0.7em;"
        />
        <span v-if="selectionSummary" class="selection-summary">{{ selectionSummary }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import SentimentGroupSelector from './SentimentGroupSelector.vue'
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator'

// Get access to the budget store
const budgetStore = useBudgetSimulatorStore()

const props = defineProps({
  emoji: { type: String, default: '😊' },
  score: { type: [Number, String], default: 3 },
  label: { type: String, default: 'Neutral' },
  selectedGroups: {
    type: Object,
    default: () => ({ provinces: [], sectors: [], demographics: [] })
  },
  fiscalChaos: { type: Boolean, default: false }
})
const emit = defineEmits(['update:selectedGroups'])
const isExpanded = ref(false)
const collapsed = ref(false)

const animatedScore = ref(Number(props.score))
const delta = ref(0)
const showDelta = ref(false)
let deltaTimeout = null

// Animate the score and show delta when score changes
watch(
  () => Number(props.score),
  (newScore, oldScore) => {
    if (isNaN(newScore)) return
    // Animate score
    animateScore(oldScore, newScore)
    // Show delta
    delta.value = +(newScore - oldScore).toFixed(1)
    if (delta.value !== 0) {
      showDelta.value = true
      // Pulse effect
      pulseBanner(delta.value > 0 ? 'up' : 'down')
      if (deltaTimeout) clearTimeout(deltaTimeout)
      deltaTimeout = setTimeout(() => { showDelta.value = false }, 1500)
    }
  }
)

function animateScore(from, to) {
  const duration = 500
  const frameRate = 30
  const steps = Math.round(duration / (1000 / frameRate))
  let current = from
  let step = 0
  const increment = (to - from) / steps
  function stepFn() {
    step++
    current += increment
    if ((increment > 0 && current >= to) || (increment < 0 && current <= to) || step >= steps) {
      animatedScore.value = to
      return
    }
    animatedScore.value = current
    requestAnimationFrame(stepFn)
  }
  stepFn()
}

const bannerClass = ref('')
function pulseBanner(type) {
  if (type === 'warning') {
    bannerClass.value = 'banner-pulse-warning'
  } else {
    bannerClass.value = type === 'up' ? 'banner-pulse-up' : 'banner-pulse-down'
  }
  setTimeout(() => { bannerClass.value = '' }, 600)
}

const toggle = () => { isExpanded.value = !isExpanded.value }

// Use a simple reference to the props for the selector
const selectedGroups = computed(() => props.selectedGroups)

// Direct fiscal chaos detection using revenue amounts
const fiscalChaosFlag = computed(() => {
  const rev = budgetStore.revenueSources;
  // Bounds from computeSentimentScores.js
  if (!rev) return false;
  
  // Personal Income Tax: $90B-$315B
  if (rev.personalIncomeTax?.adjustedAmount > 315 || rev.personalIncomeTax?.adjustedAmount < 90) {
    console.log('[FiscalChaos] Direct detection: Personal Income Tax out of bounds', rev.personalIncomeTax?.adjustedAmount);
    return true;
  }
  
  // Corporate Income Tax: $36B-$135B
  if (rev.corporateIncomeTax?.adjustedAmount > 135 || rev.corporateIncomeTax?.adjustedAmount < 36) {
    console.log('[FiscalChaos] Direct detection: Corporate Income Tax out of bounds', rev.corporateIncomeTax?.adjustedAmount);
    return true;
  }
  
  // GST: $27B-$90B
  if (rev.gst?.adjustedAmount > 90 || rev.gst?.adjustedAmount < 27) {
    console.log('[FiscalChaos] Direct detection: GST out of bounds', rev.gst?.adjustedAmount);
    return true;
  }
  
  console.log('[FiscalChaos] Direct detection: No fiscal chaos detected');
  return false;
})

// Collapsible logic: toggle collapse/expand
function toggleCollapse() {
  // On first click, always expand and show options
  if (collapsed.value || !isExpanded.value) {
    collapsed.value = false;
    isExpanded.value = true;
  } else {
    // If already expanded, collapse everything
    collapsed.value = true;
    isExpanded.value = false;
  }
}

// Only auto-expand on first detection of fiscal chaos, otherwise preserve collapsed state
watch(fiscalChaosFlag, (isChaos, oldValue) => {
  if (isChaos && !oldValue) {
    // Only on initial fiscal chaos detection, expand it (but don't change collapsed state)
    console.log('[FiscalChaos] Initial detection, ensuring visibility');
    // We don't modify collapsed.value here to maintain user preference
  }
  // We don't reset collapsed state when fiscal chaos is gone, preserving user preference
})

// Watch for fiscal chaos and ensure the banner is expanded when it's detected
watch(
  fiscalChaosFlag,
  (isFiscalChaos) => {
    console.log(`[FiscalChaos] Direct detection state: ${isFiscalChaos}`);
    
    if (isFiscalChaos) {
      // Force the banner to expand when fiscal chaos is detected
      isExpanded.value = true;
      // Add an extra pulse effect to draw attention
      pulseBanner('warning');
      console.log('[FiscalChaos] Warning banner expanded due to direct fiscal chaos detection');
      
      // Force update the DOM to ensure the warning is displayed
      nextTick(() => {
        console.log('[FiscalChaos] DOM updated after nextTick');
      });
    }
  },
  { immediate: true } // Check on component initialization
)

// Keep the original watcher as a fallback
watch(
  () => props.fiscalChaos,
  (isFiscalChaos) => {
    console.log(`[FiscalChaos] Banner received fiscal chaos state from props: ${isFiscalChaos}`);
    
    if (isFiscalChaos === true) {
      // Force the banner to expand when fiscal chaos is detected
      isExpanded.value = true;
      // Add an extra pulse effect to draw attention
      pulseBanner('warning');
    }
  },
  { immediate: true } // Check on component initialization
)

// Handle selection updates from the selector component
function handleSelectionUpdate(newSelection) {
  emit('update:selectedGroups', newSelection)
}

const selectionSummary = computed(() => {
  const p = props.selectedGroups.provinces
  const s = props.selectedGroups.sectors
  const d = props.selectedGroups.demographics
  let out = []
  if (p.length) out.push(`Provinces: ${p.join(', ')}`)
  if (s.length) out.push(`Sectors: ${s.join(', ')}`)
  if (d.length) out.push(`Demographics: ${d.join(', ')}`)
  return out.length ? out.join(' | ') : ''
})
</script>

<style scoped>
.sentiment-banner {
  position: fixed;
  top: 18px;
  right: 32px;
  z-index: 1002;
  min-width: 60px;
  min-height: 40px;
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #f0f0f3 60%, #e0e0e0 100%);
  border-radius: 28px;
  box-shadow: 0 4px 18px 0 #0001, 0 1.5px 0 #fff inset, 0 2px 8px #9993 inset;
  border: 1.5px solid #e8e8ef;
  transition: min-width 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.18s, background 0.18s;
  cursor: pointer;
  outline: none;
  padding: 0 18px;
  user-select: none;
}

.fade-expand-enter-active, .fade-expand-leave-active {
  transition: opacity 0.25s cubic-bezier(.4,2,.6,1), max-height 0.25s cubic-bezier(.4,2,.6,1);
}
.fade-expand-enter-from, .fade-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-expand-enter-to, .fade-expand-leave-from {
  opacity: 1;
  max-height: 400px;
}
.sentiment-banner:focus {
  box-shadow: 0 0 0 3px #8bc6ec88, 0 4px 18px 0 #0001;
}
.sentiment-banner .pill-content {
  display: flex;
  align-items: center;
  gap: 1.1em;
  font-size: 1.25em;
}
.sentiment-banner .score-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0.2em;
}
.sentiment-banner .score {
  font-size: 1.25em;
  font-weight: bold;
  color: #3a7bd5;
  letter-spacing: 1px;
  margin-bottom: 0.1em;
}
.sentiment-banner .label {
  font-size: 1em;
  color: #333;
  opacity: 0.85;
}
.sentiment-banner .hint {
  margin-left: 1.2em;
  font-size: 0.98em;
  color: #888;
  font-style: italic;
  opacity: 0.8;
  letter-spacing: 0.03em;
}
.sentiment-banner .expanded-content {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin-top: 0.7em;
  padding-top: 0.7em;
  border-top: 1px solid #e2e8f0;
}
.sentiment-banner .selection-summary {
  font-size: 0.98em;
  color: #5c6bc0;
  margin-top: 0.2em;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.sentiment-banner .emoji {
  font-size: 1.6em;
  filter: drop-shadow(0 1px 2px #0002);
}
.sentiment-banner .details {
  display: flex;
  flex-direction: column;
  margin-left: 0.4em;
  font-size: 1em;
  font-weight: 600;
  color: #333;
  text-shadow: 0 1px 0 #fff, 0 0.5px 2px #0001;
}
.sentiment-banner:not(.expanded) .details {
  display: none;
}
.sentiment-banner.expanded {
  min-width: 200px;
  background: linear-gradient(145deg, #f8fafc 60%, #e6e9f0 100%);
  box-shadow: 0 8px 32px 0 #0002, 0 2.5px 0 #fff7 inset, 0 3px 16px #9991 inset;
  border-color: #d1d5db;
}

/* Fiscal warning styles */
.sentiment-banner.fiscal-warning {
  background: linear-gradient(145deg, #fff0f0 60%, #ffdddd 100%);
  border-color: #ff0000;
  border-width: 2px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
  animation: fiscal-pulse 1.2s infinite alternate;
  z-index: 1100; /* Ensure it's above other elements - increased z-index */
  /* position: relative removed to maintain fixed positioning */
}

@keyframes fiscal-pulse {
  0% {
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
    transform: scale(1);
    background: linear-gradient(145deg, #fff0f0 60%, #ffdddd 100%);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.7), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
    transform: scale(1.02);
    background: linear-gradient(145deg, #fff5f5 60%, #ffe0e0 100%);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
    transform: scale(1);
    background: linear-gradient(145deg, #fff0f0 60%, #ffdddd 100%);
  }
}

.fiscal-warning-text {
  color: #ff0000;
  font-size: 1.1em;
  font-weight: 800;
  margin-right: 0.5em;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  animation: warning-blink 1s infinite alternate;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.7);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
}

@keyframes warning-blink {
  0% {
    opacity: 0.8;
    transform: scale(1);
    text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4);
  }
  100% {
    opacity: 0.9;
    transform: scale(1);
    text-shadow: 0 0 8px rgba(255, 0, 0, 0.7);
  }
}

/* Banner pulse animations */
.banner-pulse-up {
  animation: banner-pulse-up 0.6s;
}
.banner-pulse-down {
  animation: banner-pulse-down 0.6s;
}
.banner-pulse-warning {
  animation: banner-pulse-warning 0.8s ease-in-out 3;
}

@keyframes banner-pulse-up {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); background-color: #e6ffed; }
  100% { transform: scale(1); }
}

@keyframes banner-pulse-down {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); background-color: #fff0f0; }
  100% { transform: scale(1); }
}

@keyframes banner-pulse-warning {
  0% { 
    transform: scale(1); 
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
  }
  25% { 
    transform: scale(1.05); 
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.8), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
  }
  50% { 
    transform: scale(1.02); 
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.7), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
  }
  75% { 
    transform: scale(1.04); 
    box-shadow: 0 0 35px rgba(255, 0, 0, 0.9), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
  }
  100% { 
    transform: scale(1); 
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 2.5px 0 #fff7 inset, 0 3px 16px #f991 inset;
  }
}
.fade-expand-enter-active, .fade-expand-leave-active {
  transition: opacity 0.2s, transform 0.25s cubic-bezier(.4,2,.6,1);
}
.fade-expand-enter-from, .fade-expand-leave-to {
  opacity: 0;
  transform: scaleX(0.7) scaleY(0.7);
}
@media (max-width: 600px) {
  .sentiment-banner {
    top: 8px;
    min-width: 44px;
    min-height: 32px;
    font-size: 0.96em;
    padding: 0 10px;
  }
  .sentiment-banner.expanded {
    min-width: 120px;
  }
  .card-title, .card-content, .summary-card, .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header, .tile-title, .tile-amount, .slider-labels {
    writing-mode: initial !important;
    text-orientation: initial !important;
    transform: none !important;
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
  }
}
.sentiment-banner.collapsed {
  min-width: 48px;
  min-height: 40px;
  max-width: 60px;
  padding: 0 8px;
  overflow: hidden;
  justify-content: center;
  cursor: pointer;
}
.collapsed-indicator {
  font-size: 0.95em;
  color: #c00;
  font-weight: 600;
  margin-left: 0.5em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
