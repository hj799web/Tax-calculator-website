<template>
  <div class="w-full">
    <div class="slider-labels">
      <span>{{ min }}%</span>
      <span class="current-rate">Current: {{ modelValue }}%</span>
      <span>{{ max }}%</span>
    </div>
    <input 
      type="range" 
      :id="id" 
      :value="modelValue" 
      @input="updateValue($event.target.value)"
      :min="min" 
      :max="max" 
      :step="step"
      class="slider"
      :disabled="disabled"
    >
    <div class="input-controls">
      <div class="input-group">
        <input 
          type="number" 
          :value="modelValue"
          @input="updateValue($event.target.value)"
          :min="min"
          :max="max"
          :step="step"
          class="percentage-input"
          :disabled="disabled"
        >
        <span class="input-suffix">%</span>
      </div>
      <div class="input-group">
        <input 
          type="number" 
          :value="amountValue"
          @input="updateAmountValue($event.target.value)"
          class="amount-input"
          :step="0.1"
          :disabled="disabled"
        >
        <span class="input-suffix">B</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

function updateValue(value) {
  console.log('PercentageInput: updateValue called with', value);
  const numValue = Number(value);
  if (numValue >= props.min && numValue <= props.max) {
    console.log('PercentageInput: emitting update:modelValue with', numValue);
    emit('update:modelValue', numValue);
  }
}

// Calculate the amount based on the percentage
const amountValue = computed(() => {
  return (props.baseAmount * props.modelValue / 100).toFixed(1);
});

// Update the percentage based on the amount input
function updateAmountValue(value) {
  console.log('PercentageInput: updateAmountValue called with', value);
  const numValue = Number(value);
  if (props.baseAmount > 0) {
    const newPercentage = (numValue / props.baseAmount) * 100;
    if (newPercentage >= props.min && newPercentage <= props.max) {
      console.log('PercentageInput: emitting update:modelValue with', newPercentage);
      emit('update:modelValue', newPercentage);
    }
  }
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
  font-size: 0.85rem;
  color: #2d3748;
  background-color: white;
  transition: border-color 0.2s ease;
  -webkit-appearance: textfield; /* For WebKit browsers */
  -moz-appearance: textfield; /* For Mozilla browsers */
  appearance: textfield; /* Standard property for compatibility */
}

.percentage-input::-webkit-inner-spin-button, 
.percentage-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button,
.amount-input::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0;
}

.percentage-input:focus, .amount-input:focus {
  border-color: var(--tile-color, #4299E1);
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.input-suffix {
  position: absolute;
  right: 8px;
  color: #718096;
  font-size: 0.85rem;
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
</style>
