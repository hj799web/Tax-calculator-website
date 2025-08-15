<template>
  <div class="story-card">
    <!-- Story Header with Gradient Background -->
    <div class="story-header">
      <div class="logo-container">
        <img
          src="../assets/fiscal-insights-logo.webp"
          alt="Fiscal Insights"
          class="logo-image"
        >
      </div>
      <h2 class="story-title">
        Canadian Budget
      </h2>
    </div>
    
    <!-- Budget Highlight Section -->
    <div class="budget-highlight">
      <div
        class="fiscal-status"
        :class="{ 'surplus': budgetSurplus > 0, 'deficit': budgetSurplus < 0 }"
      >
        <div class="status-label">
          {{ budgetSurplus > 0 ? 'SURPLUS' : 'DEFICIT' }}
        </div>
        <div class="status-value">
          ${{ formatCurrency(Math.abs(budgetSurplus)) }}B
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="key-metrics">
        <div class="metric">
          <div class="metric-label">
            Top Revenue
          </div>
          <div class="metric-value">
            {{ topRevenue.name }}
          </div>
          <div class="metric-amount">
            ${{ formatCurrency(topRevenue.value) }}B
          </div>
        </div>
        <div class="metric">
          <div class="metric-label">
            Top Spending
          </div>
          <div class="metric-value">
            {{ topSpending.name }}
          </div>
          <div class="metric-amount">
            ${{ formatCurrency(topSpending.value) }}B
          </div>
        </div>
      </div>
    </div>
    
    <!-- Badge Highlight (if available) -->
    <div
      v-if="badges && badges.length > 0"
      class="badge-highlight"
    >
      <div class="badge-item">
        <span class="badge-icon">{{ badges[0].icon }}</span>
        <span class="badge-name">{{ badges[0].name }}</span>
      </div>
    </div>
    
    <!-- Most Positive/Negative Segments Section -->
    <div
      v-if="(mostPositiveSegments && mostPositiveSegments.length) || (mostNegativeSegments && mostNegativeSegments.length)"
      class="segments-section"
    >
      <h3 class="section-title">
        Most Positive & Negative Segments
      </h3>
      <div class="segments-list">
        <div
          v-if="mostPositiveSegments && mostPositiveSegments.length"
          class="segment positive-segment"
        >
          <span class="segment-label">Most Positive:</span>
          <span
            v-for="seg in mostPositiveSegments.slice(0, 2)"
            :key="seg.name"
            class="segment-name"
          >
            {{ formatGroupName(seg.name) }}
            <span class="segment-emoji">{{ getSentimentEmoji(seg.score) }}</span>
            <span class="segment-score">{{ typeof seg.score === 'number' ? seg.score.toFixed(1) : '0.0' }}</span>
          </span>
        </div>
        <div
          v-if="mostNegativeSegments && mostNegativeSegments.length"
          class="segment negative-segment"
        >
          <span class="segment-label">Most Negative:</span>
          <span
            v-for="seg in mostNegativeSegments.slice(0, 2)"
            :key="seg.name"
            class="segment-name"
          >
            {{ formatGroupName(seg.name) }}
            <span class="segment-emoji">{{ getSentimentEmoji(seg.score) }}</span>
            <span class="segment-score">{{ typeof seg.score === 'number' ? seg.score.toFixed(1) : '0.0' }}</span>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Website Link -->
    <div class="website-link">
      <div class="link-label">
        Create your own budget at
      </div>
      <div class="link-url">
        hj799web.github.io/Tax-calculator-website
      </div>
    </div>
    
    <!-- Swipe Up Indicator -->
    <div class="swipe-up">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="swipe-icon"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      <div class="swipe-text">
        Swipe Up
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryCard',
  props: {
    budgetSurplus: {
      type: Number,
      default: 0
    },
    badges: {
      type: Array,
      default() {
        return [];
      }
    },
    revenueData: {
      type: Array,
      default() {
        return [];
      }
    },
    spendingData: {
      type: Array,
      default() {
        return [];
      }
    },
    mostPositiveSegments: {
      type: Array,
      default() {
        return [];
      }
    },
    mostNegativeSegments: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    topRevenue() {
      if (!this.revenueData || this.revenueData.length === 0) {
        return { name: 'Personal Income Tax', value: 0 };
      }
      // Sort by value and return the highest
      const sorted = [...this.revenueData].sort((a, b) => b.value - a.value);
      return {
        name: this.formatGroupName(sorted[0].name),
        value: sorted[0].value
      };
    },
    topSpending() {
      if (!this.spendingData || this.spendingData.length === 0) {
        return { name: 'Healthcare', value: 0 };
      }
      // Sort by value and return the highest
      const sorted = [...this.spendingData].sort((a, b) => b.value - a.value);
      return {
        name: this.formatGroupName(sorted[0].name),
        value: sorted[0].value
      };
    }
  },
  methods: {
    formatCurrency(value) {
      if (typeof value !== 'number') return '0.0';
      return Math.abs(value).toFixed(1);
    },
    formatGroupName(name) {
      // Convert camelCase or snake_case to Title Case with spaces
      if (!name) return '';
      // Limit name length
      const shortenedName = name.length > 15 ? name.substring(0, 15) + '...' : name;
      
      return shortenedName
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim();
    },
    getSentimentEmoji(score) {
      if (!score && score !== 0) return '😐';
      if (score > 6) return '😀';
      if (score > 4) return '🙂';
      return '😕';
    }
  }
}
</script>

<style scoped>
/* Story card with 9:16 aspect ratio using CSS variables for maintainability */
:root {
  --story-aspect-width: 9;
  --story-aspect-height: 16;
  --story-padding-standard: 20px;
  --story-font-base: 16px;
}

.story-card {
  width: 100%;
  position: relative;
  aspect-ratio: var(--story-aspect-width) / var(--story-aspect-height);
  background: linear-gradient(135deg, #4a6cf7 0%, #f450c2 100%);
  color: white;
  font-family: 'Inter', 'Helvetica', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--story-padding-standard);
  box-sizing: border-box;
  max-height: 100%;
}

.story-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  width: 100%;
}

.logo-container {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  margin-bottom: 20px;
  border: 4px solid rgba(255, 255, 255, 0.8);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-title {
  font-size: calc(var(--story-font-base) * 2);
  font-weight: 800;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.budget-highlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 80px;
}

.fiscal-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 40px;
  width: 80%;
}

.fiscal-status.surplus {
  background: rgba(39, 174, 96, 0.3);
}

.fiscal-status.deficit {
  background: rgba(231, 76, 60, 0.3);
}

.status-label {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 10px;
}

.status-value {
  font-size: calc(var(--story-font-base) * 3.5);
  font-weight: 800;
  letter-spacing: -1px;
}

.key-metrics {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48%;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
}

.metric-label {
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 10px;
  opacity: 0.9;
}

.metric-value {
  font-size: calc(var(--story-font-base) * 1.5);
  font-weight: 700;
  text-align: center;
  margin-bottom: 5px;
}

.metric-amount {
  font-size: 36px;
  font-weight: 800;
  color: #FFD700;
}

.badge-highlight {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 80px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
}

.badge-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.badge-name {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
}

.website-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: 100px;
}

.link-label {
  font-size: 24px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.link-url {
  font-size: calc(var(--story-font-base) * 1.5);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: calc(var(--story-padding-standard) * 0.5) calc(var(--story-padding-standard));
  border-radius: 30px;
  backdrop-filter: blur(5px);
}

.swipe-up {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
}

.swipe-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.swipe-text {
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* Segments section styles */
.segments-section {
  margin: 20px auto;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 15px 20px;
  max-width: 90%;
  text-align: center;
}

.segments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.segment {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
}

.positive-segment {
  background-color: rgba(72, 187, 120, 0.2);
}

.negative-segment {
  background-color: rgba(245, 101, 101, 0.2);
}

.segment-label {
  font-weight: 600;
  font-size: 16px;
  color: white;
}

.segment-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
}

.segment-emoji {
  font-size: 18px;
}

.segment-score {
  font-weight: 600;
}

/* Mobile optimization through CSS variables */
@media screen and (max-width: 768px) {
  :root {
    --story-padding-standard: 16px;
    --story-font-base: 14px;
  }
  
  .story-card {
    padding: var(--story-padding-standard);
  }
  
  .badge-item, .segment {
    padding: calc(var(--story-padding-standard) * 0.75);
  }
  
  .swipe-text {
    font-size: calc(var(--story-font-base) * 1.2);
  }
  
  .segments-section {
    max-width: 95%;
  }
}
</style>
