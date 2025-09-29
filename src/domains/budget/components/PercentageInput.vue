<template>
  <div class="w-full">
    <div class="slider-labels">
      <span>{{ min }}%</span>
      <span class="current-rate">Current: {{ modelValue }}%</span>
      <span>{{ max }}%</span>
    </div>
    <input 
      :id="id" 
      type="range" 
      :value="modelValue" 
      :min="min"
      :max="max" 
      :step="step" 
      class="slider"
      :disabled="disabled"
      @input="onSliderInput($event.target.value)"
    >
    <div class="input-controls">
      <div class="input-group">
        <input 
          type="number" 
          v-model="pct"
          :min="min"
          :max="max"
          :step="step"
          class="percentage-input"
          :disabled="disabled"
          inputmode="decimal"
          @focus="focused = 'pct'"
          @blur="commitPct"
          @keyup.enter="commitPct"
          @wheel.prevent
        >
        <span class="input-suffix">%</span>
      </div>
      <div class="input-group">
        <input 
          type="number" 
          v-model="amount"
          class="amount-input"
          :step="0.1"
          :disabled="disabled"
          inputmode="decimal"
          @focus="focused = 'amount'"
          @blur="commitAmount"
          @keyup.enter="commitAmount"
          @wheel.prevent
        >
        <span class="input-suffix">B</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 200
  },
  step: {
    type: Number,
    default: 1
  },
  id: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  baseAmount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue']);

// Local input state to avoid prop-overwrites while typing
const pct = ref(String(typeof props.modelValue === 'number' ? props.modelValue : 0));
const amount = ref(props.baseAmount ? String((props.baseAmount * (props.modelValue || 0)) / 100) : '');
const focused = ref(null); // 'pct' | 'amount' | null

// Keep local state in sync with prop when not focused
watch(() => props.modelValue, (v) => {
  if (focused.value !== 'pct') pct.value = String(v);
  if (focused.value !== 'amount') {
    amount.value = props.baseAmount ? String((props.baseAmount * (v || 0)) / 100) : '';
  }
});

function onSliderInput(value) {
  const numValue = Number(value);
  if (!Number.isFinite(numValue)) return;
  const clamped = Math.min(props.max, Math.max(props.min, numValue));
  emit('update:modelValue', clamped);
}

function commitPct() {
  const n = Number(pct.value);
  if (!Number.isFinite(n)) { focused.value = null; return; }
  const clamped = Math.min(props.max, Math.max(props.min, n));
  emit('update:modelValue', clamped);
  focused.value = null;
}

function commitAmount() {
  const n = Number(amount.value);
  if (!Number.isFinite(n) || props.baseAmount <= 0) { focused.value = null; return; }
  const pctFromAmt = (n / props.baseAmount) * 100;
  const clamped = Math.min(props.max, Math.max(props.min, pctFromAmt));
  emit('update:modelValue', clamped);
  focused.value = null;
}
</script>

<style scoped>
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #718096;
  margin-bottom: 2px;
}

.slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  margin: 5px 0;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--tile-color, #4299E1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--tile-color, #4299E1);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.input-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  gap: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
}

.percentage-input, .amount-input {
  width: 100%;
  padding: 4px 24px 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.percentage-input:focus, .amount-input:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
}

.input-suffix {
  position: absolute;
  right: 8px;
  color: #718096;
  font-size: 0.75rem;
  pointer-events: none;
}

.current-rate {
  font-weight: 500;
}

/* Disabled state */
.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.percentage-input:disabled, .amount-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f7fafc;
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
