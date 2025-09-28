<template>
  <div class="budget-detail-card">
    <!-- Budget Summary -->
    <div class="budget-summary">
      <h3 class="section-title">
        Budget Overview
      </h3>
      <div class="metrics-grid">
        <div
          class="metric-card"
          :class="budgetData.surplus >= 0 ? 'positive' : 'negative'"
        >
          <div class="metric-icon">
            <span class="material-icons">{{ budgetData.surplus >= 0 ? 'trending_up' : 'trending_down' }}</span>
          </div>
          <div class="metric-content">
            <div class="metric-label">
              {{ budgetData.surplus >= 0 ? 'Surplus' : 'Deficit' }}
            </div>
            <div class="metric-value">
              {{ budgetData.surplus >= 0 ? '+' : '' }}${{ formatCurrency(budgetData.surplus) }}B
            </div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">
            <span class="material-icons">payments</span>
          </div>
          <div class="metric-content">
            <div class="metric-label">
              Revenue
            </div>
            <div class="metric-value">
              ${{ formatCurrency(budgetData.revenue) }}B
            </div>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">
            <span class="material-icons">account_balance</span>
          </div>
          <div class="metric-content">
            <div class="metric-label">
              Debt-to-GDP
            </div>
            <div class="metric-value">
              {{ budgetData.debt.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sentiment Analysis Section -->
    <div class="sentiment-section">
      <h3 class="section-title">
        Budget Impact Analysis
      </h3>
      <!-- Positive Segments -->
      <div
        v-if="budgetData.positiveSegments && budgetData.positiveSegments.length > 0"
        class="sentiment-group"
      >
        <div class="sentiment-header positive">
          <span class="material-icons">trending_up</span>
          <h4>Most Positive Impact</h4>
        </div>
        <div class="segments-grid">
          <div
            v-for="segment in budgetData.positiveSegments"
            :key="segment.name"
            class="segment-card positive"
          >
            <div class="segment-score">
              +{{ formatSegmentScore(segment.score) }}
            </div>
            <div class="segment-name">
              {{ segment.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- Negative Segments -->
      <div
        v-if="budgetData.negativeSegments && budgetData.negativeSegments.length > 0"
        class="sentiment-group"
      >
        <div class="sentiment-header negative">
          <span class="material-icons">trending_down</span>
          <h4>Most Negative Impact</h4>
        </div>
        <div class="segments-grid">
          <div
            v-for="segment in budgetData.negativeSegments"
            :key="segment.name"
            class="segment-card negative"
          >
            <div class="segment-score">
              {{ formatSegmentScore(segment.score) }}
            </div>
            <div class="segment-name">
              {{ segment.name }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="(!budgetData.positiveSegments || budgetData.positiveSegments.length === 0) && (!budgetData.negativeSegments || budgetData.negativeSegments.length === 0)"
        class="no-data-message"
      >
        No sentiment data available for this budget.
      </div>
    </div>

    <!-- Badges Section -->
    <div class="badges-section">
      <h3 class="section-title">
        Achievements Earned
      </h3>
      <div
        v-if="budgetData.badges && budgetData.badges.length > 0"
        class="badges-grid"
      >
        <div
          v-for="badge in budgetData.badges"
          :key="badge.name"
          class="badge-card"
        >
          <div class="badge-icon">
            {{ badge.icon }}
          </div>
          <div class="badge-content">
            <div class="badge-name">
              {{ badge.name }}
            </div>
            <div class="badge-description">
              {{ badge.explanation || 'Achievement earned through budget choices' }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!budgetData.badges || budgetData.badges.length === 0"
        class="no-data-message"
      >
        No badges earned with this budget yet.
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
defineProps({
  budgetData: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  return Math.abs(value).toFixed(1);
};
const formatSegmentScore = (score) => {
  if (typeof score !== 'number' || isNaN(score)) return '0.0';
  return score.toFixed(1);
};
</script>

<style scoped>
/* Card styles copied from SharedBudgetDetailModal.vue for standalone use */
.budget-detail-card {
  padding: 1.5rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.metric-card {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.metric-card.positive {
  background-color: #f0fff4;
  border-left: 4px solid #48bb78;
}
.metric-card.negative {
  background-color: #fff5f5;
  border-left: 4px solid #f56565;
}
.metric-icon {
  margin-right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.metric-card.positive .metric-icon {
  background-color: #c6f6d5;
  color: #38a169;
}
.metric-card.negative .metric-icon {
  background-color: #fed7d7;
  color: #e53e3e;
}
.metric-content {
  flex: 1;
}
.metric-label {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
}
.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}
.metric-card.positive .metric-value {
  color: #38a169;
}
.metric-card.negative .metric-value {
  color: #e53e3e;
}
.sentiment-section {
  margin-bottom: 2rem;
}
.sentiment-group {
  margin-bottom: 1.5rem;
}
.sentiment-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
.sentiment-header.positive {
  color: #38a169;
}
.sentiment-header.negative {
  color: #e53e3e;
}
.sentiment-header .material-icons {
  margin-right: 0.5rem;
}
.sentiment-header h4 {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
}
.segments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}
.segment-card {
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
}
.segment-card.positive {
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
}
.segment-card.negative {
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
}
.segment-score {
  font-weight: 600;
  margin-right: 0.75rem;
  min-width: 3rem;
  text-align: center;
}
.segment-card.positive .segment-score {
  color: #38a169;
}
.segment-card.negative .segment-score {
  color: #e53e3e;
}
.segment-name {
  font-size: 0.875rem;
  color: #4a5568;
}
.badges-section {
  margin-bottom: 2rem;
}
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
.badge-card {
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.badge-icon {
  font-size: 2rem;
  margin-right: 1rem;
}
.badge-content {
  flex: 1;
}
.badge-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1a202c;
}
.badge-description {
  font-size: 0.875rem;
  color: #4a5568;
}
.no-data-message {
  text-align: center;
  padding: 1.5rem;
  color: #718096;
  font-style: italic;
  background-color: #f7fafc;
  border-radius: 8px;
}
</style>
