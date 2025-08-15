<template>
  <div class="batch-summary" :class="[batchType, { 'preset-batch': isPreset }]">
    <div class="batch-header">
      <div class="batch-icon">
        <span class="material-icons">{{ getBatchIcon() }}</span>
        <span v-if="isPreset" class="preset-badge" title="Preset batch">
          <span class="material-icons">auto_awesome</span>
        </span>
      </div>
      
      <div class="batch-info">
        <div class="batch-title">
          {{ getBatchTitle() }}
          <span v-if="isPreset" class="preset-indicator">Preset</span>
        </div>
        <div class="batch-summary">{{ getBatchSummary() }}</div>
      </div>
      
      <button 
        class="dismiss-btn"
        @click="$emit('dismiss', changes.batchId)"
        aria-label="Dismiss batch summary"
      >
        <span class="material-icons">close</span>
      </button>
    </div>
    
    <div class="batch-details">
      <div 
        v-for="change in changes.changes.slice(0, 3)" 
        :key="change.id"
        class="batch-item"
      >
        <span class="item-name">{{ change.itemName }}</span>
        <span class="item-change">{{ formatChange(change) }}</span>
      </div>
      
      <div v-if="changes.changes.length > 3" class="batch-more">
        +{{ changes.changes.length - 3 }} more changes
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  changes: {
    type: Object,
    required: true
  },
  isPreset: {
    type: Boolean,
    default: false
  }
});

defineEmits(['dismiss']);

const batchType = computed(() => {
  const types = props.changes.changes.map(c => c.type);
  if (types.every(t => t === 'revenue')) return 'revenue';
  if (types.every(t => t === 'spending')) return 'spending';
  return 'mixed';
});

function getBatchIcon() {
  switch (batchType.value) {
    case 'revenue': return 'account_balance';
    case 'spending': return 'payments';
    default: return 'settings';
  }
}

function getBatchTitle() {
  const count = props.changes.changes.length;
  switch (batchType.value) {
    case 'revenue': return `${count} Revenue Changes`;
    case 'spending': return `${count} Spending Changes`;
    default: return `${count} Budget Changes`;
  }
}

function getBatchSummary() {
  const { totalChange } = props.changes;
  const direction = totalChange > 0 ? 'increased' : 'decreased';
  const amount = formatCurrency(Math.abs(totalChange));
  
  return `Net ${direction} by ${amount}`;
}

function formatChange(change) {
  const direction = change.changeAmount > 0 ? '+' : '';
  const amount = formatCurrency(Math.abs(change.changeAmount));
  return `${direction}${amount}`;
}

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
.batch-summary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.3s ease-out;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.batch-summary.preset-batch {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.15);
}

.batch-summary.revenue {
  border-left: 4px solid #2563eb;
}

.batch-summary.spending {
  border-left: 4px solid #dc2626;
}

.batch-summary.mixed {
  border-left: 4px solid #7c3aed;
}

.batch-summary.preset-batch.revenue {
  border-left: 4px solid #4f46e5;
}

.batch-summary.preset-batch.spending {
  border-left: 4px solid #7c3aed;
}

.batch-summary.preset-batch.mixed {
  border-left: 4px solid #6366f1;
}

.batch-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.batch-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.batch-summary.revenue .batch-icon {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.batch-summary.spending .batch-icon {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.batch-summary.mixed .batch-icon {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.batch-summary.preset-batch .batch-icon {
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
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  border: 1px solid white;
}

.batch-info {
  flex: 1;
  min-width: 0;
}

.batch-title {
  font-weight: 700;
  font-size: 1rem;
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

.batch-summary {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.3;
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

.batch-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.batch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  font-size: 0.875rem;
}

.item-name {
  color: #374151;
  font-weight: 500;
}

.item-change {
  font-weight: 600;
}

.batch-summary.revenue .item-change {
  color: #2563eb;
}

.batch-summary.spending .item-change {
  color: #dc2626;
}

.batch-summary.mixed .item-change {
  color: #7c3aed;
}

.batch-summary.preset-batch .item-change {
  color: #4f46e5;
}

.batch-more {
  text-align: center;
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
  padding: 0.25rem;
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
  .batch-summary {
    padding: 1rem;
  }
  
  .batch-header {
    gap: 0.5rem;
  }
  
  .batch-icon {
    width: 40px;
    height: 40px;
  }
  
  .batch-title {
    font-size: 0.9rem;
  }
  
  .batch-summary {
    font-size: 0.8rem;
  }
  
  .batch-item {
    padding: 0.375rem;
    font-size: 0.8rem;
  }
}
</style> 