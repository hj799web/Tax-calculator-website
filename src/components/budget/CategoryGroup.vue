<template>
  <div class="mb-4 w-full">
    <div class="group-header" @click="toggleExpansion">
      <h3 class="text-sm font-medium text-gray-700">{{ title }}</h3>
      <div class="toggle-button">
        {{ expanded ? 'Collapse' : 'Expand' }}
        <span class="icon ml-1" :class="{ 'rotated': expanded }">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
    </div>
    <div class="group-summary">
      <span>Total {{ title }}:</span>
      <span>{{ formatCurrency(totalAmount) }}</span>
    </div>
    <div class="group-content w-full" :class="{ 'expanded': expanded }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  },
  groupId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['toggle']);

function toggleExpansion(event) {
  if (event) event.stopPropagation();
  emit('toggle', props.groupId);
}

function formatCurrency(value) {
  return '$' + value.toFixed(1) + 'B';
}
</script>

<style scoped>
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.12rem;
  background-color: #f8f9fa;
  border-radius: 0.05rem;
  cursor: pointer;
  margin-bottom: 0.1rem;
  width: 100%;
}

.group-summary {
  display: flex;
  justify-content: space-between;
  padding: 0.12rem;
  background-color: #f1f3f5;
  border-radius: 0.05rem;
  font-size: 0.55rem;
  font-weight: 500;
  margin-bottom: 0.1rem;
  width: 100%;
}

.group-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  width: 100%;
}

.group-content.expanded {
  max-height: 2000px; /* Increased from 1000px to accommodate more content */
}

.toggle-button {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: #4263eb;
}

.toggle-button .icon {
  transition: transform 0.3s ease;
}

.toggle-button .icon.rotated {
  transform: rotate(180deg);
}
</style>
