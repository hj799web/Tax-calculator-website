<template>
  <div class="items-plan-list">
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search items..." />
    </div>

    <div class="items-grid">
      <div v-for="item in filteredItems" :key="item.key" :class="['item-card', item.type]">
        <div class="item-header">
          <div class="left">
            <span class="icon material-icons" aria-hidden="true">{{ item.type === 'revenue' ? 'paid' : 'account_balance' }}</span>
            <span class="name">{{ item.name }}</span>
          </div>
          <span class="badge">{{ item.badge }}</span>
        </div>
        <div class="item-controls">
          <label>{{ item.type === 'revenue' ? 'Current rate (%)' : 'Current factor (×)' }}</label>
          <input
            v-if="item.type === 'revenue'"
            type="number"
            step="0.1"
            :value="item.current"
            disabled
          />
          <input
            v-else
            type="number"
            step="0.01"
            :value="item.current"
            disabled
          />
        </div>
        <div class="item-actions">
          <button class="btn" @click="resetItem(item)">Reset</button>
          <button class="btn primary" @click="planItem(item)">Plan</button>
        </div>
      </div>
    </div>

    <div v-if="filteredItems.length === 0" class="empty">
      No items match your search criteria.
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator.js';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

const emit = defineEmits(['open-plan']);

const searchQuery = ref('');
const budget = useBudgetSimulatorStore();
const planning = useMultiYearSettingsStore();

// Build a unified item list from revenue sources and spending categories (including grouped children)
const items = computed(() => {
  const list = [];

  // Revenue items
  Object.values(budget.revenueSources || {}).forEach((src) => {
    if (!src || !src.id || !src.name) return;
    list.push({
      key: `revenue:${src.id}`,
      id: src.id,
      name: src.name,
      badge: 'Revenue',
      type: 'revenue',
      current: Number(src.rate ?? 0),
    });
  });

  // Spending items (flatten groups)
  Object.values(budget.spendingCategories || {}).forEach((cat) => {
    if (!cat) return;
    if (cat.isGroup && cat.children) {
      Object.values(cat.children).forEach((child) => {
        if (!child || !child.id || !child.name) return;
        list.push({
          key: `spending:${child.id}`,
          id: child.id,
          name: child.name,
          badge: cat.name || 'Spending',
          type: 'spending',
          current: Number(child.adjustmentFactor ?? 1),
        });
      });
    } else if (cat.id && cat.name) {
      list.push({
        key: `spending:${cat.id}`,
        id: cat.id,
        name: cat.name,
        badge: 'Spending',
        type: 'spending',
        current: Number(cat.adjustmentFactor ?? 1),
      });
    }
  });

  // Sort by type then name for consistency
  return list.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)));
});

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((i) =>
    i.name.toLowerCase().includes(q) ||
    i.badge.toLowerCase().includes(q) ||
    i.type.toLowerCase().includes(q)
  );
});

function resetItem(item) {
  // Clear any multi-year plan for this item
  planning.clearPlan(item.id, item.type);
}

function planItem(item) {
  // Ask parent host to open the planning modal for this item
  emit('open-plan', item.type, item.id);
}
</script>

<style scoped>
.items-plan-list { display: grid; gap: 12px; }
.search-bar input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 10px; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.item-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
.item-card.revenue { border-left: 4px solid #1d4ed8; }
.item-card.spending { border-left: 4px solid #047857; }

.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.item-header .left { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.icon { font-size: 20px; color: #6b7280; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { background: #eef2ff; color: #3730a3; padding: 2px 8px; border-radius: 999px; font-size: .75rem; }

.item-controls { display: grid; gap: 4px; margin-bottom: 8px; }
.item-controls label { font-size: .85rem; color: #6b7280; }
.item-controls input { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; }

.item-actions { display: flex; gap: 8px; }
.empty { text-align: center; color: #6b7280; font-style: italic; padding: 20px; }

.btn {
  padding: 6px 12px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(107, 114, 128, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
  overflow: hidden;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
  border-color: #1d4ed8;
}

.btn.primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-0.5px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.4s;
}

.btn:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.15);
  transform: translateY(-0.5px);
  border-color: #6b7280;
}

.btn:hover::before {
  left: 100%;
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(107, 114, 128, 0.1);
}
</style>
