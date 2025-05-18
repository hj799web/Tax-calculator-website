<template>
  <div class="sentiment-sensitivity-control">
    <h3>Public Sentiment Sensitivity</h3>
    <div class="slider-group">
      <label for="overall-sensitivity">Overall Sensitivity</label>
      <input
        id="overall-sensitivity"
        type="range"
        min="0.5"
        max="2"
        step="0.01"
        v-model.number="overall"
        @input="updateOverall"
      />
      <span>{{ overall.toFixed(2) }}</span>
    </div>
    <button @click="resetAll">Reset to Default</button>
    <div class="category-sliders">
      <div class="slider-group">
        <label for="regions-sensitivity">Provinces and territories Multiplier</label>
        <input
          id="regions-sensitivity"
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          v-model.number="regions"
          @input="updateRegions"
        />
        <span>{{ regions.toFixed(2) }}</span>
      </div>
      
      <div class="slider-group">
        <label for="demographics-sensitivity">Demographics Multiplier</label>
        <input
          id="demographics-sensitivity"
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          v-model.number="demographics"
          @input="updateDemographics"
        />
        <span>{{ demographics.toFixed(2) }}</span>
      </div>
      
      <div class="slider-group">
        <label for="sectors-sensitivity">Sectors Multiplier</label>
        <input
          id="sectors-sensitivity"
          type="range"
          min="0.5"
          max="2"
          step="0.01"
          v-model.number="sectors"
          @input="updateSectors"
        />
        <span>{{ sectors.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSentimentSettingsStore } from '@/domains/sentiment/store/sentimentSettings';

const sentimentSettings = useSentimentSettingsStore();

const overall = computed({
  get: () => sentimentSettings.sensitivity.overall,
  set: (val) => sentimentSettings.setSensitivity('overall', val)
});

const regions = computed({
  get: () => sentimentSettings.sensitivity.regions,
  set: (val) => sentimentSettings.setSensitivity('regions', val)
});

const demographics = computed({
  get: () => sentimentSettings.sensitivity.demographics,
  set: (val) => sentimentSettings.setSensitivity('demographics', val)
});

const sectors = computed({
  get: () => sentimentSettings.sensitivity.sectors,
  set: (val) => sentimentSettings.setSensitivity('sectors', val)
});

function updateOverall() {
  console.log('[SENSITIVITY DEBUG] Setting overall to:', overall.value);
  sentimentSettings.setSensitivity('overall', overall.value);
}

function updateRegions() {
  console.log('[SENSITIVITY DEBUG] Setting regions to:', regions.value);
  sentimentSettings.setSensitivity('regions', regions.value);
}

function updateDemographics() {
  console.log('[SENSITIVITY DEBUG] Setting demographics to:', demographics.value);
  sentimentSettings.setSensitivity('demographics', demographics.value);
}

function updateSectors() {
  console.log('[SENSITIVITY DEBUG] Setting sectors to:', sectors.value);
  sentimentSettings.setSensitivity('sectors', sectors.value);
}

function resetAll() {
  sentimentSettings.resetAll();
}
</script>

<style scoped>
.sentiment-sensitivity-control {
  padding: 1em;
  border: 1px solid #cfd8dc;
  border-radius: 8px;
  background: #f9fafb;
  width: 100%;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
}

.category-sliders {
  margin-top: 1.5em;
  border-top: 1px solid #e2e8f0;
  padding-top: 1em;
}

label {
  min-width: 150px;
  margin-right: 0.5em;
}

input[type="range"] {
  flex: 1;
  min-width: 150px;
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
