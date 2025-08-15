<template>
  <div class="radar-sentiment">
    <!-- Critical Alerts Section -->
    <div
      v-if="criticalAlerts.length > 0"
      class="critical-alerts"
    >
      <h3 class="critical-alerts-title">
        ⚠️ Critical Alerts
      </h3>
      <ul class="critical-alerts-list">
        <li
          v-for="alert in criticalAlerts"
          :key="alert.group + alert.trigger"
          class="critical-alert-item"
        >
          <span class="alert-group">{{ alert.group }}</span>:
          <span class="alert-trigger">{{ formatTriggerName(alert.trigger) }}</span>
          <span
            class="alert-score"
            :class="getScoreClass(alert.score)"
          >
            {{ formatScore(alert.score) }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Existing Radar Chart -->
    <div class="radar-chart-container">
      <canvas ref="radarChart" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadarSentiment',
  props: {
    budgetData: {
      type: Object,
      required: true
    },
    activeScenario: {
      type: String,
      default: null
    },
    showBaseReactions: {
      type: Boolean,
      default: false
    },
    criticalAlerts: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    formatTriggerName(trigger) {
      // Convert trigger path to readable format
      return trigger
        .split('.')
        .map(part => part
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
        )
        .join(' ');
    },

    formatScore(score) {
      return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
    },

    getScoreClass(score) {
      if (score >= 4) return 'score-very-positive';
      if (score >= 3) return 'score-positive';
      if (score >= 2) return 'score-neutral';
      if (score >= 1) return 'score-negative';
      return 'score-very-negative';
    }
  }
}
</script>

<style scoped>
.radar-sentiment {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.critical-alerts {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.critical-alerts-title {
  color: #856404;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.critical-alerts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.critical-alert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ffeeba;
}

.critical-alert-item:last-child {
  border-bottom: none;
}

.alert-group {
  font-weight: bold;
  color: #856404;
}

.alert-trigger {
  color: #666;
}

.alert-score {
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.score-very-positive {
  background-color: #d4edda;
  color: #155724;
}

.score-positive {
  background-color: #e2f3e5;
  color: #1e7e34;
}

.score-neutral {
  background-color: #e2e3e5;
  color: #383d41;
}

.score-negative {
  background-color: #f8d7da;
  color: #721c24;
}

.score-very-negative {
  background-color: #f5c6cb;
  color: #721c24;
}
</style> 