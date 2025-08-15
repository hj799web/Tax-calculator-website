<template>
  <div 
    class="change-notification"
    :class="[change.type, { 'preset-change': isPreset }]"
    role="alert"
    aria-live="polite"
  >
    <div class="notification-content">
      <div class="notification-icon">
        <span class="material-icons">{{ changeIcon }}</span>
        <span v-if="isPreset" class="preset-badge" title="Preset change">
          <span class="material-icons">auto_awesome</span>
        </span>
      </div>
      
      <div class="notification-info">
        <div class="notification-title">
          {{ change.itemName }}
          <span v-if="isPreset" class="preset-indicator">Preset</span>
        </div>
        <div class="notification-summary">{{ changeSummary }}</div>
        <div class="notification-meta">
          <span class="change-time">{{ timeAgo }}</span>
          <span v-if="change.metadata.source !== 'user'" class="change-source">
            {{ sourceText }}
          </span>
        </div>
      </div>
      
      <button 
        class="dismiss-btn"
        @click="$emit('dismiss', change.id)"
        aria-label="Dismiss notification"
      >
        <span class="material-icons">close</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  change: {
    type: Object,
    required: true
  },
  isPreset: {
    type: Boolean,
    default: false
  }
});

defineEmits(['dismiss']);

const changeIcon = computed(() => {
  const { type, changeAmount } = props.change;
  
  if (type === 'revenue') {
    return changeAmount > 0 ? 'trending_up' : 'trending_down';
  } else if (type === 'spending') {
    return changeAmount > 0 ? 'expand_less' : 'expand_more';
  } else {
    return changeAmount > 0 ? 'add_circle' : 'remove_circle';
  }
});

const changeSummary = computed(() => {
  const { changeAmount, percentageChange } = props.change;
  const direction = changeAmount > 0 ? 'increased' : 'decreased';
  const amount = formatCurrency(Math.abs(changeAmount));
  const percentage = Math.abs(percentageChange).toFixed(1);
  
  return `${direction} by ${amount} (${percentage}%)`;
});

const timeAgo = computed(() => {
  const now = Date.now();
  const diff = now - props.change.timestamp;
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 120) return '1 minute ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  return `${Math.floor(seconds / 3600)} hours ago`;
});

const sourceText = computed(() => {
  const { source } = props.change.metadata;
  switch (source) {
    case 'preset': return 'Preset applied';
    case 'auto-balance': return 'Auto-balanced';
    default: return '';
  }
});

function formatCurrency(value) {
  if (value === undefined || value === null || isNaN(value)) return '$0.0B';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value) + 'B';
}
</script>

<style scoped>
.change-notification {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.3s ease-out;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.change-notification.preset-change {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.15);
}

.change-notification.revenue {
  border-left: 4px solid #2563eb;
}

.change-notification.spending {
  border-left: 4px solid #dc2626;
}

.change-notification.taxExpenditure {
  border-left: 4px solid #059669;
}

/* Colour overrides removed – preset notifications will use their base revenue/spending colours */

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.change-notification.revenue .notification-icon {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.change-notification.spending .notification-icon {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.change-notification.taxExpenditure .notification-icon {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
}

.change-notification.preset-change .notification-icon {
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.preset-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  border: 1px solid white;
}

.notification-info {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preset-indicator {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.notification-summary {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.notification-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.625rem;
  color: #9ca3af;
}

.change-time {
  font-weight: 500;
}

.change-source {
  padding: 0.125rem 0.25rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  font-size: 0.6rem;
}

.dismiss-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s;
  flex-shrink: 0;
}

.dismiss-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .change-notification {
    padding: 0.75rem;
  }
  
  .notification-content {
    gap: 0.5rem;
  }
  
  .notification-icon {
    width: 36px;
    height: 36px;
  }
  
  .notification-title {
    font-size: 0.8rem;
  }
  
  .notification-summary {
    font-size: 0.7rem;
  }
}
</style> 