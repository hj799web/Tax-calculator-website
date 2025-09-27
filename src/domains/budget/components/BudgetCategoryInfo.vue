<template>
  <div class="ml-1 relative category-info">
    <span 
      class="info-icon"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >�"~</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '@/i18n';

const { t } = useI18n();

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  baseAmount: {
    type: Number,
    required: true
  },
  currentSetting: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['show-tooltip', 'hide-tooltip']);

const tooltipContent = computed(() => {
  return `${props.name}\n\n${props.description}\n\n${t('tooltips.baseAmount', 'Base Amount:')} $${props.baseAmount ? props.baseAmount.toFixed(1) : '0.0'}B\n${t('tooltips.currentSetting', 'Current Setting:')} ${props.currentSetting || 0}%\n${t('tooltips.adjustedAmount', 'Adjusted Amount:')} $${props.baseAmount && props.currentSetting ? (props.baseAmount * props.currentSetting / 100).toFixed(1) : '0.0'}B`;
});

function showTooltip() {
  emit('show-tooltip', tooltipContent.value);
}

function hideTooltip() {
  emit('hide-tooltip');
}
</script>

<style scoped>
.category-info {
  display: inline-block;
  position: relative;
}

.category-info .info-icon {
  font-size: 0.75rem;
  color: #6c757d;
  cursor: help;
}

.category-info .info-tooltip {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 250px;
  padding: 0.75rem;
  background-color: #343a40;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 9999;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-height: 300px;
  overflow-y: auto;
  transform: translateZ(0);
}

.category-info .info-tooltip::after {
  content: "";
  position: absolute;
  top: -10px;
  left: 20px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #343a40 transparent;
}

.category-info .info-icon:hover + .info-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateZ(0);
}

@media (max-width: 600px) {
  .card-title, .card-content, .summary-card, .main-category-header, .other-category-header, .subcategory-header, .gov-ops-header, .tax-expenditure-header, .tile-title, .tile-amount, .slider-labels {
    writing-mode: initial !important;
    text-orientation: initial !important;
    transform: none !important;
    display: block !important;
    white-space: normal !important;
    word-break: break-word !important;
  }
}
</style>

