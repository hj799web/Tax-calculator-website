<template>
  <div class="ml-1 relative category-info">
    <span class="info-icon">ⓘ</span>
    <div class="info-tooltip">
      <strong>{{ name }}</strong>
      <p>{{ description }}</p>
      <p class="mt-1">
        <strong>Base Amount:</strong> ${{ baseAmount ? baseAmount.toFixed(1) : '0.0' }}B
      </p>
      <p><strong>Current Setting:</strong> {{ currentSetting || 0 }}%</p>
      <p><strong>Adjusted Amount:</strong> ${{ baseAmount && currentSetting ? (baseAmount * currentSetting / 100).toFixed(1) : '0.0' }}B</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
  top: 20px;
  right: 20px;
  width: 250px;
  padding: 0.75rem;
  background-color: #343a40;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-height: 300px;
  overflow-y: auto;
}

.category-info .info-icon:hover + .info-tooltip {
  opacity: 1;
  visibility: visible;
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
