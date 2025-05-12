<template>
  <div class="budget-sentiment-badge-card">
    <!-- Sentiment Overview -->
    <div class="sentiment-overview">
      <div class="sentiment-header">
        <h4 class="text-lg font-semibold">Public Sentiment</h4>
        <div class="sentiment-score" :class="sentimentClass">
          {{ budgetData.sentiment?.toFixed(1) || 'N/A' }}
        </div>
      </div>
      
      <!-- Top Positive/Negative Segments -->
      <div class="sentiment-segments">
        <div v-if="budgetData.positiveSegments?.length" class="segment positive">
          <span class="material-icons">trending_up</span>
          <span>{{ budgetData.positiveSegments[0]?.name }}</span>
        </div>
        <div v-if="budgetData.negativeSegments?.length" class="segment negative">
          <span class="material-icons">trending_down</span>
          <span>{{ budgetData.negativeSegments[0]?.name }}</span>
        </div>
      </div>
    </div>

    <!-- Badges Section -->
    <div v-if="budgetData.badges?.length" class="badges-section">
      <h4 class="text-lg font-semibold mb-2">Achievements</h4>
      <div class="badges-grid">
        <div v-for="badge in budgetData.badges" :key="badge.name" class="badge-item">
          <span class="badge-icon">{{ badge.icon }}</span>
          <span class="badge-name">{{ badge.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  budgetData: {
    type: Object,
    required: true,
    default: () => ({
      sentiment: 3,
      positiveSegments: [],
      negativeSegments: [],
      badges: []
    })
  }
});

function getSentimentClass(score) {
  if (!score) return 'neutral';
  if (score >= 4) return 'positive';
  if (score >= 3) return 'neutral';
  if (score >= 2) return 'negative';
  return 'very-negative';
}

// Use props in a computed property to ensure it's used
const sentimentClass = computed(() => getSentimentClass(props.budgetData.sentiment));
</script>

<style scoped>
.budget-sentiment-badge-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sentiment-overview {
  margin-bottom: 1rem;
}

.sentiment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.sentiment-score {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.sentiment-score.positive {
  background-color: #dcfce7;
  color: #166534;
}

.sentiment-score.neutral {
  background-color: #f3f4f6;
  color: #374151;
}

.sentiment-score.negative {
  background-color: #fee2e2;
  color: #991b1b;
}

.sentiment-score.very-negative {
  background-color: #fef2f2;
  color: #7f1d1d;
}

.sentiment-segments {
  display: flex;
  gap: 0.5rem;
}

.segment {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.segment.positive {
  background-color: #dcfce7;
  color: #166534;
}

.segment.negative {
  background-color: #fee2e2;
  color: #991b1b;
}

.badges-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-name {
  font-weight: 500;
  color: #374151;
}
</style> 