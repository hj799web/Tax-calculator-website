<template>
  <div
    class="spending-tile w-full"
    :style="{ '--tile-color': category.color || parentColor }"
  >
    <div class="tile-header w-full">
      <div class="flex items-center flex-grow overflow-hidden">
        <div 
          class="w-2 h-2 rounded-full mr-1 flex-shrink-0" 
          :style="{ backgroundColor: category.color || parentColor }"
        />
        <label
          :for="`spending-${category.id}`"
          class="block text-sm font-medium text-gray-700 truncate"
        >
          {{ getCategoryName(category.id, 'spending') }}
        </label>
      </div>
      <div
        class="text-sm font-medium text-gray-700 text-right"
        style="min-width: 95px;"
      >
        {{ formatCurrency(category.baseAmount * spendingFactor / 100) }}
        <span 
          class="text-xs ml-1" 
          :class="spendingFactor > 100 ? 'text-green-600' : spendingFactor < 100 ? 'text-red-600' : 'text-gray-600'"
        >
          ({{ spendingFactor > 100 ? '+' : '' }}{{ (spendingFactor - 100).toFixed(0) }}%)
        </span>
      </div>
    </div>
    <div class="tile-content w-full">
      <PercentageInput
        :id="`spending-${category.id}`"
        v-model="localSpendingFactor"
        :disabled="disabled"
        class="w-full"
        :base-amount="category.baseAmount"
      />
      <div class="mt-2 flex justify-end w-full">
        <CategoryInfo
          :name="getCategoryName(category.id, 'spending')"
          :description="category.description"
          :base-amount="category.baseAmount"
          :current-setting="spendingFactor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import PercentageInput from './PercentageInput.vue';
import CategoryInfo from './BudgetCategoryInfo.vue';
import { getCategoryName } from '@/i18n';

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  spendingFactor: {
    type: Number,
    required: true
  },
  parentColor: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:spendingFactor']);

const localSpendingFactor = ref(props.spendingFactor);

watch(() => props.spendingFactor, (newValue) => {
  localSpendingFactor.value = newValue;
});

watch(localSpendingFactor, (newValue) => {
  emit('update:spendingFactor', newValue);
});

function formatCurrency(value) {
  return '$' + value.toFixed(1) + 'B';
}
</script>

<style scoped>
.spending-tile {
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
  border-left: 1px solid var(--tile-color);
  font-size: 0.6em;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 0.5rem;
}

.tile-content {
  width: 100%;
  padding-top: 0.05rem;
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
