<template>
  <div class="sentiment-sensitivity-control">
    <LoadingIndicator 
      :show="isUpdating" 
      :message="t('simulator.sentiment.sensitivity.loading')"
      size="small"
      variant="inline"
    />
    
    <h3>{{ t('simulator.sentiment.sensitivity.title') }}</h3>
    <div class="slider-group">
      <label for="overall-sensitivity">{{ t('simulator.sentiment.sensitivity.overall') }}</label>
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
    <button @click="resetAll">{{ t('simulator.sentiment.sensitivity.reset') }}</button>
    <div class="category-sliders">
      <div class="slider-group">
        <label for="regions-sensitivity">{{ t('simulator.sentiment.sensitivity.regions') }}</label>
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
        <label for="demographics-sensitivity">{{ t('simulator.sentiment.sensitivity.demographics') }}</label>
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
        <label for="sectors-sensitivity">{{ t('simulator.sentiment.sensitivity.sectors') }}</label>
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
import { computed, ref } from 'vue';
import { useI18n } from '@/i18n';
import { useSentimentSettingsStore } from '@/domains/sentiment/store/sentimentSettings';
import { createDebouncedFunction } from '@/utils/debounceUtils';
import LoadingIndicator from '@/components/LoadingIndicator.vue';

const sentimentSettings = useSentimentSettingsStore();
const { t } = useI18n();
const isUpdating = ref(false);

const debouncedUpdateOverall = createDebouncedFunction((value) => {
  isUpdating.value = true;
  try {
    sentimentSettings.setSensitivity('overall', value);
  } finally {
    isUpdating.value = false;
  }
}, 200);

const debouncedUpdateRegions = createDebouncedFunction((value) => {
  isUpdating.value = true;
  try {
    sentimentSettings.setSensitivity('regions', value);
  } finally {
    isUpdating.value = false;
  }
}, 200);

const debouncedUpdateDemographics = createDebouncedFunction((value) => {
  isUpdating.value = true;
  try {
    sentimentSettings.setSensitivity('demographics', value);
  } finally {
    isUpdating.value = false;
  }
}, 200);

const debouncedUpdateSectors = createDebouncedFunction((value) => {
  isUpdating.value = true;
  try {
    sentimentSettings.setSensitivity('sectors', value);
  } finally {
    isUpdating.value = false;
  }
}, 200);

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
  debouncedUpdateOverall(overall.value);
}

function updateRegions() {
  console.log('[SENSITIVITY DEBUG] Setting regions to:', regions.value);
  debouncedUpdateRegions(regions.value);
}

function updateDemographics() {
  console.log('[SENSITIVITY DEBUG] Setting demographics to:', demographics.value);
  debouncedUpdateDemographics(demographics.value);
}

function updateSectors() {
  console.log('[SENSITIVITY DEBUG] Setting sectors to:', sectors.value);
  debouncedUpdateSectors(sectors.value);
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
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4299e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4299e1;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

button {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #3182ce;
}

span {
  min-width: 40px;
  text-align: right;
  font-family: monospace;
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
