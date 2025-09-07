<template>
  <div class="items-list">
    <div class="search">
      <input type="text" v-model="q" placeholder="Search items..." />
    </div>
    <div class="section">
      <h4>Revenue</h4>
      <ul>
        <li v-for="(src, id) in filteredRevenue" :key="id">
          <span class="name">{{ src.name || id }}</span>
          <span v-if="plannedRevenue[id]" class="badge">Planned</span>
          <button class="btn" @click="$emit('open-plan', 'revenue', id)">Plan</button>
        </li>
      </ul>
    </div>
    <div class="section">
      <h4>Spending</h4>
      <ul>
        <li v-for="(cat, id) in filteredSpending" :key="id">
          <span class="name">{{ cat.name || id }}</span>
          <span v-if="plannedSpending[id]" class="badge">Planned</span>
          <button class="btn" @click="$emit('open-plan', 'spending', id)">Plan</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

defineEmits(['open-plan']);
const q = ref('');
const budget = useBudgetSimulatorStore();
const settings = useMultiYearSettingsStore();

const plannedRevenue = computed(() => settings.multiYearPlans.revenue || {});
const plannedSpending = computed(() => settings.multiYearPlans.spending || {});

const revenue = computed(() => budget.revenueSources || {});
const flatSpending = computed(() => {
  const out = {};
  const cats = budget.spendingCategories || {};
  for (const [id, cat] of Object.entries(cats)) {
    if (cat?.isGroup && cat?.children) {
      for (const [cid, child] of Object.entries(cat.children)) out[cid] = child;
    } else if (cat && !cat.isGroup) out[id] = cat;
  }
  return out;
});

const filteredRevenue = computed(() => filterMap(revenue.value, q.value));
const filteredSpending = computed(() => filterMap(flatSpending.value, q.value));

function filterMap(map, query) {
  if (!query) return map;
  const res = {};
  const lower = query.toLowerCase();
  for (const [id, item] of Object.entries(map)) {
    const name = (item?.name || id).toLowerCase();
    if (name.includes(lower)) res[id] = item;
  }
  return res;
}
</script>

<style scoped>
.items-list { display: grid; gap: 12px; }
.search input { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; }
.section h4 { margin: 2px 0 6px; font-size: .9rem; color: #111827; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
li { display: grid; grid-template-columns: 1fr auto auto; gap: 10px; align-items: center; padding: 8px; border: 1px solid #eef2f7; border-radius: 10px; background: #fff; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { background: #eef2ff; color: #3730a3; padding: 2px 8px; border-radius: 999px; font-size: .75rem; }
.btn { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 10px; background: #f3f4f6; cursor: pointer; }
</style>
