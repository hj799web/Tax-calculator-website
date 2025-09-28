<template>
  <div class="sentiment-analysis">
    <div class="demographic-breakdown">
      <h3>Demographic Impact</h3>
      <div class="age-groups">
        <h4>Age Groups</h4>
        <div
          v-for="(impact, group) in demographicSentiment.ageGroups"
          :key="group"
          class="impact-item"
        >
          <span class="group-name">{{ formatGroupName(group) }}</span>
          <div class="impact-bar">
            <div 
              class="impact-fill"
              :style="{ width: `${Math.abs(impact) * 100}%`, backgroundColor: getImpactColor(impact) }"
            />
          </div>
          <span class="impact-value">{{ formatImpact(impact) }}</span>
        </div>
      </div>
      
      <div class="income-levels">
        <h4>Income Levels</h4>
        <div
          v-for="(impact, level) in demographicSentiment.incomeLevels"
          :key="level"
          class="impact-item"
        >
          <span class="group-name">{{ formatGroupName(level) }}</span>
          <div class="impact-bar">
            <div 
              class="impact-fill"
              :style="{ width: `${Math.abs(impact) * 100}%`, backgroundColor: getImpactColor(impact) }"
            />
          </div>
          <span class="impact-value">{{ formatImpact(impact) }}</span>
        </div>
      </div>
    </div>

    <div class="sector-analysis">
      <h3>Sector Analysis</h3>
      <div class="sector-impacts">
        <div
          v-for="(impact, sector) in sectorImpacts"
          :key="sector"
          class="impact-item"
        >
          <span class="sector-name">{{ formatSectorName(sector) }}</span>
          <div class="impact-bar">
            <div 
              class="impact-fill"
              :style="{ width: `${Math.abs(impact) * 100}%`, backgroundColor: getImpactColor(impact) }"
            />
          </div>
          <span class="impact-value">{{ formatImpact(impact) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSentimentCalculatorStore } from '../store/sentimentCalculator';
import { useSentimentSettingsStore } from '../store/sentimentSettings';

const calculatorStore = useSentimentCalculatorStore();
const settingsStore = useSentimentSettingsStore();

// Computed properties
const demographicSentiment = computed(() => calculatorStore.demographicFactors);
const sectorImpacts = computed(() => calculatorStore.baseFactors.value.spending);

// Helper functions
const formatGroupName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const formatSectorName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const formatImpact = (impact) => {
  return `${(impact * 100).toFixed(1)}%`;
};

const getImpactColor = (impact) => {
  if (impact > 0) {
    return `hsl(120, 70%, ${50 + Math.abs(impact) * 25}%)`;
  } else {
    return `hsl(0, 70%, ${50 + Math.abs(impact) * 25}%)`;
  }
};
</script>

<style scoped>
.sentiment-analysis {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demographic-breakdown,
.sector-analysis {
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

h4 {
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 0.5rem;
}

.impact-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.group-name,
.sector-name {
  min-width: 120px;
  font-weight: 500;
}

.impact-bar {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.impact-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.impact-value {
  min-width: 60px;
  text-align: right;
  font-family: monospace;
}

.age-groups,
.income-levels,
.sector-impacts {
  margin-bottom: 1.5rem;
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