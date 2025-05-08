<template>
  <div class="social-card social-card-container" :style="{ width: width + 'px' }">
    <!-- Card Header with Title -->
    <div class="card-header">
      <div class="logo-container">
        <img src="../assets/fiscal-insights-logo.jpg" alt="Fiscal Insights" class="logo-image" />
      </div>
      <h2 class="card-title">My Budget as Finance Minister</h2>
      <div class="card-subtitle">Canadian Tax Calculator</div>
    </div>
    
    <!-- Budget Summary Section -->
    <div class="budget-summary">
      <div class="fiscal-indicator" :class="{ 'surplus': budgetSurplus > 0, 'deficit': budgetSurplus < 0 }">
        <span class="indicator-label">{{ budgetSurplus > 0 ? 'Surplus' : 'Deficit' }}</span>
        <span class="indicator-value">${{ formatCurrency(Math.abs(budgetSurplus)) }}B</span>
      </div>
      
      <!-- Fiscal Chaos Warning -->
      <div v-if="fiscalChaos" class="fiscal-chaos-warning">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">FISCAL CHAOS WARNING!</span>
        <p class="warning-desc">Extreme tax rates have destabilized the economy</p>
      </div>
      
      <div class="key-metrics">
        <div class="metric">
          <span class="metric-label">Debt-to-GDP</span>
          <span class="metric-value">{{ debtToGdpRatio }}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">Revenue</span>
          <span class="metric-value">${{ formatCurrency(totalRevenue) }}B</span>
        </div>
        <div class="metric">
          <span class="metric-label">Spending</span>
          <span class="metric-value">${{ formatCurrency(totalSpending) }}B</span>
        </div>
      </div>
    </div>
    
    <!-- Mini Chart Section -->
    <div class="chart-section">
      <div class="chart-container">
        <slot name="chart">
          <!-- Placeholder for chart -->
          <div class="chart-placeholder">
            <span>Budget visualization will appear here</span>
          </div>
        </slot>
      </div>
    </div>
    
    <!-- Badges Earned Section -->
    <div v-if="badges && badges.length" class="badges-section">
      <h3 class="section-title" id="badges-title">Badges Earned</h3>
      <div class="badges-list" role="list" aria-labelledby="badges-title">
        <div v-for="badge in badges" :key="badge.id" class="badge-item" role="listitem" :title="badge.explanation || 'Badge earned through your budget choices'">
          <div class="badge-content">
            <span class="badge-icon" v-if="badge.icon" aria-hidden="true">{{ badge.icon }}</span>
            <span class="badge-name">{{ badge.name }}</span>
          </div>
          <div class="badge-description" v-if="badge.explanation">{{ badge.explanation }}</div>
          <div class="badge-description" v-else>Achievement earned through your budget choices</div>
        </div>
      </div>
    </div>

    <!-- Most Positive/Negative Segments Section -->
    <div class="segments-section">
      <h3 class="section-title">Most Positive & Negative Segments</h3>
      <div class="segments-list">
        <div class="segment positive-segment" v-if="mostPositiveSegments && mostPositiveSegments.length">
          <span class="segment-label">Most Positive:</span>
          <span v-for="seg in mostPositiveSegments" :key="seg.name" class="segment-name">
            {{ formatGroupName(seg.name) }}
            <span class="segment-emoji">{{ getSentimentEmoji(seg.score) }}</span>
            <span class="segment-score">{{ typeof seg.score === 'number' ? seg.score.toFixed(1) : '0.0' }}</span>
          </span>
        </div>
        <div class="segment negative-segment" v-if="mostNegativeSegments && mostNegativeSegments.length">
          <span class="segment-label">Most Negative:</span>
          <span v-for="seg in mostNegativeSegments" :key="seg.name" class="segment-name">
            {{ formatGroupName(seg.name) }}
            <span class="segment-emoji">{{ getSentimentEmoji(seg.score) }}</span>
            <span class="segment-score">{{ typeof seg.score === 'number' ? seg.score.toFixed(1) : '0.0' }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Footer with URL and Timestamp -->
    <div class="card-footer">
      <span class="website-url">canadiantaxcalculator.ca</span>
      <span class="timestamp">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  badges: {
    type: Array,
    default: () => []
  },
  mostPositiveSegments: {
    type: Array,
    default: () => []
  },
  mostNegativeSegments: {
    type: Array,
    default: () => []
  },
  width: {
    type: Number,
    default: 600
  },
  height: {
    type: Number,
    default: 800
  },
  budgetSurplus: {
    type: Number,
    default: 0
  },
  debtToGdpRatio: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalSpending: {
    type: Number,
    default: 0
  },
  sentimentScores: {
    type: Object,
    default: () => ({
      provinces: {},
      demographics: {},
      sectors: {},
      overall: 3
    })
  },
  fiscalChaos: {
    type: Boolean,
    default: false
  }
});

// Format currency for display
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

// Format group names for display
const formatGroupName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Get sentiment emoji based on score
const getSentimentEmoji = (score) => {
  if (score >= 4.5) return '😄';
  if (score >= 3.5) return '🙂';
  if (score >= 2.5) return '😐';
  if (score >= 1.5) return '😠';
  return '😡';
};


// Format current date
const formattedDate = computed(() => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(now);
});
</script>

<style scoped>
.social-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.fiscal-chaos-warning {
  background-color: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: pulse 1.5s infinite;
}

.warning-icon {
  font-size: 1.5rem;
  margin-right: 8px;
}

.warning-text {
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.warning-desc {
  font-size: 0.9rem;
  margin-top: 4px;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; box-shadow: 0 0 12px rgba(220, 38, 38, 0.9); }
  100% { opacity: 0.8; }
}

.card-header {
  background: linear-gradient(135deg, var(--color-primary, #2563eb) 0%, #1e40af 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.card-header::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==');
  opacity: 0.4;
  z-index: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
  letter-spacing: 0.5px;
  margin-left: auto;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  position: relative;
  z-index: 1;
}

.logo-image {
  height: 40px;
  width: auto;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.budget-summary {
  padding: 1.5rem;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
}

.fiscal-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.fiscal-indicator:hover {
  transform: translateY(-2px);
}

.fiscal-indicator.surplus {
  background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2));
  color: #065f46;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.fiscal-indicator.deficit {
  background: linear-gradient(to bottom right, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2));
  color: #b91c1c;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.indicator-label {
  font-weight: 600;
  font-size: 1rem;
}

.indicator-value {
  font-weight: 700;
  font-size: 2rem;
}

.key-metrics {
  display: flex;
  justify-content: space-between;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-weight: 600;
  font-size: 1.125rem;
}

.chart-section {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-placeholder {
  width: 100%;
  height: 200px;
  background-color: #f1f5f9;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #64748b;
}

.sentiment-section {
  padding: 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #0f172a;
}

.sentiment-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.sentiment-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.group-name {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-align: center;
}

.sentiment-score {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sentiment-emoji {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.score-value {
  font-weight: 600;
  font-size: 1rem;
}

.badges-section {
  padding: 1.5rem;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border-top: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: '🏆';
  font-size: 1.125rem;
}

.badges-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  background: white;
  padding: 0.75rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  width: calc(50% - 0.375rem);
  cursor: default;
}

/* Responsive adjustments for badges */
@media (max-width: 500px) {
  .badge-item {
    width: 100%;
  }
}

.badge-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #f1f5f9;
  border-radius: 50%;
}

.badge-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #334155;
}

.badge-description {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
}

.segments-section {
  padding: 1rem 1.5rem;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border-top: 1px solid #e2e8f0;
}

.segments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.segment {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.positive-segment {
  background-color: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.negative-segment {
  background-color: rgba(239, 68, 68, 0.1);
  color: #b91c1c;
}

.segment-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.segment-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.segment-emoji {
  font-size: 1.2rem;
}

.segment-score {
  font-weight: 600;
}

.card-footer {
  padding: 0.75rem 1.5rem;
  background-color: #f1f5f9;
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 0.875rem;
}
</style>
