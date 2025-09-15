<template>
  <details class="spend-growth" :open="openByDefault">
    <summary>
      <span class="summary-title">
        Program Spending Growth (%)
        <span
          class="info-icon"
          title="Set annual growth rates for each program spending category. Baseline is underlying growth; Demographic adds growth from population/aging."
          aria-label="About Program Spending Growth"
        >info</span>
      </span>
    </summary>

    <div class="growth-toolbar">
      <div class="search">
        <span class="material-icons" aria-hidden="true">search</span>
        <input
          class="filter"
          v-model="growthFilter"
          placeholder="Filter categories (e.g., health, seniors)"
        />
      </div>
      <div class="spacer"></div>
      <button class="btn subtle" @click="onResetAll">
        <span class="material-icons" aria-hidden="true">restart_alt</span>
        Reset all
      </button>
    </div>

    <div class="growth-head">
      <div class="label" title="Spending categories used in the projections">Category</div>
      <div class="inputs-head">
        <span title="Underlying per‑year growth rate for this category">Baseline</span>
        <span title="Additional per‑year growth from demographics (aging, population)">Demographic</span>
      </div>
      <div class="actions"></div>
    </div>

    <div class="growth-grid">
      <div
        v-for="key in filteredKeys"
        :key="key"
        class="growth-row"
      >
        <div class="label">{{ prettyKey(key) }}</div>
        <div class="inputs">
          <label class="sub" title="Underlying per‑year growth rate for this category">Baseline</label>
          <input
            type="number"
            step="0.1"
            :min="-10"
            :max="15"
            v-model.number="settingsStore.spendingGrowth[key].baseline"
          />
          <label class="sub" title="Additional per‑year growth from demographics">Demographic</label>
          <input
            type="number"
            step="0.1"
            :min="-5"
            :max="10"
            v-model.number="settingsStore.spendingGrowth[key].demographic"
          />
        </div>
        <div class="actions">
          <button class="icon-btn" :title="`Reset ${prettyKey(key)}`" @click="onResetRow(key)">
            <span class="material-icons" aria-hidden="true">restart_alt</span>
          </button>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

defineProps({ openByDefault: { type: Boolean, default: false } });

const settingsStore = useMultiYearSettingsStore();
const growthFilter = ref('');

const filteredKeys = computed(() => {
  const q = growthFilter.value.trim().toLowerCase();
  const keys = Object.keys(settingsStore.spendingGrowth || {});
  if (!q) return keys;
  return keys.filter(k => prettyKey(k).toLowerCase().includes(q));
});

function prettyKey(key) {
  return String(key).replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}

function onResetRow(key) {
  if (settingsStore.resetSpendingGrowthKey) settingsStore.resetSpendingGrowthKey(key);
}

function onResetAll() {
  if (settingsStore.resetAllSpendingGrowth) settingsStore.resetAllSpendingGrowth();
}
</script>

<style scoped>
details.spend-growth {
  grid-column: 1 / -1;
  background: linear-gradient(180deg, #fafbff 0%, #ffffff 60%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 10px 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
details.spend-growth > summary {
  font-weight: 700;
  color: #111827;
  cursor: pointer;
  list-style: none;
}
details.spend-growth > summary::-webkit-details-marker { display: none; }
.summary-title { display: inline-flex; align-items: center; gap: 6px; }
.info-icon { font-family: 'Material Icons'; font-size: 18px; line-height: 1; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 50%; width: 18px; height: 18px; display: inline-grid; place-items: center; cursor: help; }
.info-icon:hover { color: #1d4ed8; border-color: #c7d2fe; }

.growth-toolbar {
  position: sticky; top: 0; z-index: 1;
  display: flex; gap: 8px; align-items: center;
  padding: 8px 6px; margin: 6px -6px 8px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid #e5e7eb;
}
.growth-toolbar .search { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
.growth-toolbar .filter { width: min(380px, 50vw); border: none; outline: none; }
.growth-toolbar .spacer { flex: 1 1 auto; }

.growth-head { display: grid; grid-template-columns: 1fr 2fr auto; gap: 8px; align-items: center; padding: 4px 6px; color: #6b7280; font-size: .75rem; }
.growth-head .inputs-head { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; justify-items: start; }

.growth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 4px; }
.growth-row {
  display: grid; grid-template-columns: 1fr 2fr auto; gap: 10px; align-items: center;
  padding: 10px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff;
  transition: box-shadow .15s ease, border-color .15s ease;
}
.growth-row:hover { border-color: #c7d2fe; box-shadow: 0 4px 14px rgba(29,78,216,0.08); }
.growth-row .label { font-size: 0.9rem; color: #111827; font-weight: 600; }
.growth-row .inputs { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 8px; align-items: center; }
.growth-row .inputs input { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; transition: border-color .15s, box-shadow .15s; }
.growth-row .inputs input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); outline: none; }
.growth-row .sub { font-size: 0.75rem; color: #6b7280; }

.btn { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 10px; background: #fff; color: #374151; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.btn.subtle { border-color: #e5e7eb; background: #f9fafb; }
.btn:hover { background: #f3f4f6; border-color: #9ca3af; }
.icon-btn { border: 1px solid #e5e7eb; background: #f9fafb; color: #374151; border-radius: 10px; width: 36px; height: 34px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.icon-btn:hover { background: #eef2ff; border-color: #c7d2fe; color: #1d4ed8; box-shadow: 0 4px 10px rgba(29,78,216,0.12); }
</style>
