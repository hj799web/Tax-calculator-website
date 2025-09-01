<template>
  <div 
    class="budget-changes-banner"
    :class="{ 'banner-collapsed': isCollapsed, 'no-changes': !hasChanges }"
  >
    <!-- Banner Header -->
    <div class="banner-header" @click="toggleCollapse">
      <div class="banner-title">
        <i class="material-icons">history</i>
        <span>Budget Changes</span>
        <span class="change-count">({{ changeCount }})</span>
      </div>
      <div class="banner-controls">
        <button 
          @click.stop="clearChanges"
          class="clear-btn"
          title="Clear all changes"
        >
          <i class="material-icons">clear_all</i>
        </button>
        <button 
          @click.stop="toggleCollapse"
          class="collapse-btn"
          :title="isCollapsed ? 'Expand' : 'Collapse'"
        >
          <i class="material-icons">{{ isCollapsed ? 'expand_less' : 'expand_more' }}</i>
        </button>
      </div>
    </div>

    <!-- Banner Content -->
    <div v-if="!isCollapsed" class="banner-content">
      
      <!-- No Changes State -->
      <div v-if="!hasChanges" class="no-changes-content">
        <div class="no-changes-icon">
          <i class="material-icons">timeline</i>
        </div>
        <div class="no-changes-message">
          <p>No budget changes yet</p>
          <p class="no-changes-subtitle">Start adjusting taxes and spending to see changes here</p>
        </div>
      </div>

      <!-- Changes Content -->
      <div v-else>
        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            v-for="(changes, category) in changesByCategory"
            :key="category"
            @click="activeCategory = category"
            class="category-tab"
            :class="{ 'active': activeCategory === category }"
          >
            {{ category }}
            <span class="tab-count">({{ changes.length }})</span>
          </button>
        </div>

        <!-- Changes List -->
        <div class="changes-list">
          <div 
            v-for="change in recentChanges" 
            :key="change.id"
            class="change-item"
          >
            <div class="change-header">
              <i 
                class="material-icons change-icon"
                :style="{ color: change.getChangeColor() }"
              >
                {{ change.getChangeIcon() }}
              </i>
              <span class="change-name">{{ change.itemName }}</span>
              <span class="change-time">{{ formatTime(change.timestamp) }}</span>
            </div>
            <div class="change-details">
              <div class="change-description">{{ change.description }}</div>
              <div 
                class="change-amount"
                :class="change.getDisplayAmount() >= 0 ? 'positive-change' : 'negative-change'"
              >
                {{ change.getDisplayAmount() >= 0 ? '+' : '' }}${{ formatAmount(Math.abs(change.getDisplayAmount())) }}B
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="changes-summary">
          <div class="summary-item">
            <span class="summary-label">Revenue:</span>
            <span 
              class="summary-value"
              :class="summary.totalRevenueChange >= 0 ? 'positive' : 'negative'"
            >
              {{ summary.totalRevenueChange >= 0 ? '+' : '' }}${{ formatAmount(Math.abs(summary.totalRevenueChange)) }}B
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Spending:</span>
            <span 
              class="summary-value"
              :class="summary.totalSpendingChange >= 0 ? 'positive' : 'negative'"
            >
              {{ summary.totalSpendingChange >= 0 ? '+' : '' }}${{ formatAmount(Math.abs(summary.totalSpendingChange)) }}B
            </span>
          </div>
        </div>
      </div>

      <!-- Budget Totals Section -->
      <div class="budget-totals">
        <div class="totals-header">
          <i class="material-icons">analytics</i>
          <span>Current Budget Totals</span>
        </div>
        <div class="totals-grid">
          <div class="total-item">
            <span class="total-label">Total Revenue</span>
            <span class="total-value revenue">
              ${{ formatAmount(budgetStore.totalRevenue) }}B
            </span>
          </div>
          <div class="total-item">
            <span class="total-label">Total Spending</span>
            <span class="total-value spending">
              ${{ formatAmount(budgetStore.totalSpending) }}B
            </span>
          </div>
          <div class="total-item">
            <span class="total-label">
              {{ budgetStore.surplus >= 0 ? 'Surplus' : 'Deficit' }}
            </span>
            <span 
              class="total-value"
              :class="budgetStore.surplus >= 0 ? 'surplus' : 'deficit'"
            >
              {{ budgetStore.surplus >= 0 ? '+' : '' }}${{ formatAmount(Math.abs(budgetStore.surplus)) }}B
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useBudgetSimulatorStore } from '../store/budgetSimulator.js';

export default {
  name: 'BudgetChangesBanner',
  props: {
    maxRecentChanges: {
      type: Number,
      default: 10
    }
  },
  setup(props) {
    const budgetStore = useBudgetSimulatorStore();
    const isCollapsed = ref(false);
    const activeCategory = ref('All');

    // Reactive computed properties
    const hasChanges = computed(() => {
      budgetStore.changeHistoryVersion; // Reactive dependency
      const result = budgetStore.changeHistory.length > 0;
      
      console.log('%c[BANNER DEBUG] hasChanges computed:', 'background: #d35400; color: white; padding: 2px 5px;', {
        hasChanges: result,
        historyLength: budgetStore.changeHistory.length,
        historyVersion: budgetStore.changeHistoryVersion
      });
      
      return result;
    });

    const changeCount = computed(() => {
      budgetStore.changeHistoryVersion; // Reactive dependency
      return budgetStore.changeHistory.length;
    });

    const recentChanges = computed(() => {
      // Reactive dependencies
      budgetStore.changeHistoryVersion; 
      const selected = activeCategory.value;

      // Filter by active category (or show all)
      let list = budgetStore.changeHistory;
      if (selected && selected !== 'All') {
        list = list.filter(c => c.category === selected);
      }

      const limited = list.slice(0, props.maxRecentChanges);

      console.log('%c[BANNER DEBUG] Recent changes computed (filtered):', 'background: #1abc9c; color: white; padding: 2px 5px;', {
        activeCategory: selected,
        shownCount: limited.length,
        historyVersion: budgetStore.changeHistoryVersion,
        totalHistory: budgetStore.changeHistory.length
      });

      return limited;
    });

    const changesByCategory = computed(() => {
      budgetStore.changeHistoryVersion; // Reactive dependency
      const grouped = budgetStore.getChangesByCategory();
      const result = { 'All': budgetStore.changeHistory, ...grouped };
      
      console.log('%c[BANNER DEBUG] Changes by category computed:', 'background: #8e44ad; color: white; padding: 2px 5px;', {
        categories: Object.keys(result),
        categoryCounts: Object.entries(result).map(([cat, changes]) => ({
          category: cat,
          count: changes.length
        }))
      });
      
      return result;
    });

    const summary = computed(() => {
      budgetStore.changeHistoryVersion; // Reactive dependency
      return budgetStore.getChangesSummary();
    });

    // Methods
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const clearChanges = () => {
      budgetStore.clearChangeHistory();
    };

    const formatTime = (timestamp) => {
      const now = Date.now();
      const diff = now - timestamp;
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return `${Math.floor(diff / 86400000)}d ago`;
    };

    const formatAmount = (amount) => {
      if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'T';
      }
      return amount.toFixed(1);
    };

    // Lifecycle
    onMounted(() => {
      console.log('%c[BANNER DEBUG] BudgetChangesBanner mounted:', 'background: #2c3e50; color: white; padding: 2px 5px;', {
        budgetStoreExists: !!budgetStore,
        initialHistoryLength: budgetStore.changeHistory.length,
        initialHistoryVersion: budgetStore.changeHistoryVersion
      });
      
      // Set initial active category
      if (Object.keys(changesByCategory.value).length > 0) {
        activeCategory.value = 'All';
      }
    });

    onUnmounted(() => {
      // Cleanup if needed
    });

    return {
      budgetStore,
      isCollapsed,
      activeCategory,
      hasChanges,
      changeCount,
      recentChanges,
      changesByCategory,
      summary,
      toggleCollapse,
      clearChanges,
      formatTime,
      formatAmount
    };
  }
};
</script>

<style scoped>
.budget-changes-banner {
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  width: 320px;
  max-height: 600px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  transition: all 0.3s ease;
  overflow: hidden;
}

.banner-collapsed {
  max-height: 60px;
}

.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  color: var(--fg);
  cursor: pointer;
  user-select: none;
}

.banner-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
}

.banner-title i {
  font-size: 18px;
}

.change-count {
  opacity: 0.8;
  font-size: 12px;
}

.banner-controls {
  display: flex;
  gap: 8px;
}

.clear-btn,
.collapse-btn {
  background: none;
  border: none;
  color: var(--fg);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.clear-btn:hover,
.collapse-btn:hover {
  background: rgba(34, 211, 238, 0.12);
}

.banner-content {
  max-height: 500px;
  overflow-y: auto;
}

.category-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 6px;
  padding: 12px 16px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  max-height: 160px;
  overflow-y: auto;
}

.category-tab {
  background: none;
  border: none;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 24px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-tab:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.category-tab.active {
  background: var(--accent);
  color: #001018;
}

.tab-count {
  opacity: 0.7;
  font-size: 9px;
  margin-left: 3px;
}

.changes-list {
  padding: 8px 16px;
}

.change-item {
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.change-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.change-icon {
  font-size: 16px;
}

.change-name {
  font-weight: 600;
  font-size: 13px;
  color: #333;
  flex: 1;
}

.change-time {
  font-size: 11px;
  color: #999;
}

.change-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-description {
  font-size: 12px;
  color: #666;
  flex: 1;
}

.change-amount {
  font-weight: 600;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.positive-change {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
}

.negative-change {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.changes-summary {
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.02);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.summary-value {
  font-size: 12px;
  font-weight: 600;
}

.summary-value.positive {
  color: #27ae60;
}

.summary-value.negative {
  color: #e74c3c;
}

/* Scrollbar styling */
.banner-content::-webkit-scrollbar {
  width: 6px;
}

.banner-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.banner-content::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.banner-content::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* No Changes State */
.no-changes-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.no-changes-icon {
  margin-bottom: 16px;
}

.no-changes-icon i {
  font-size: 48px;
  color: #ddd;
}

.no-changes-message p {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

.no-changes-subtitle {
  font-size: 12px !important;
  color: #999 !important;
  font-weight: 400 !important;
}

/* Banner state classes */
.no-changes {
  opacity: 0.8;
}

/* Budget Totals Section */
.budget-totals {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px;
  background: rgba(248, 250, 252, 0.8);
}

.totals-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 12px;
  color: #374151;
}

.totals-header i {
  font-size: 16px;
  color: #6b7280;
}

.totals-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.total-label {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
}

.total-value {
  font-size: 12px;
  font-weight: 600;
}

.total-value.revenue {
  color: #059669;
}

.total-value.spending {
  color: #dc2626;
}

.total-value.surplus {
  color: #059669;
}

.total-value.deficit {
  color: #dc2626;
}

/* Responsive design */
@media (max-width: 768px) {
  .budget-changes-banner {
    width: calc(100vw - 40px);
    left: 20px;
    right: 20px;
    top: 20px;
    transform: none;
    position: fixed;
  }
  
  .category-tabs {
    padding: 8px 12px 6px;
    max-height: 120px;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 4px;
  }
  
  .category-tab {
    font-size: 9px;
    padding: 3px 8px;
    min-height: 20px;
  }
  
  .tab-count {
    font-size: 8px;
    margin-left: 2px;
  }
  
  .changes-list {
    padding: 6px 12px;
  }
  
  .change-item {
    padding: 10px;
  }

  .budget-totals {
    padding: 12px;
  }

  .totals-header {
    font-size: 11px;
    margin-bottom: 10px;
  }

  .total-item {
    padding: 6px 10px;
  }

  .total-label {
    font-size: 10px;
  }

  .total-value {
    font-size: 11px;
  }
}
</style>
