<template>
  <div class="multi-year-panel">
    <div class="header-row">
      <h3 class="title">Multi-Year Projections</h3>
      <button class="btn primary" @click="showPlanner = !showPlanner">
        <span class="material-icons" aria-hidden="true">timeline</span>
        {{ showPlanner ? 'Hide Planner' : 'Open Planner' }}
      </button>
    </div>
    <div v-if="!FEATURES.MULTI_YEAR_PLANNING" class="flag-disabled">
      <p>This feature is disabled. Enable MULTI_YEAR_PLANNING to view projections.</p>
    </div>
    <div v-else>
      <div class="assumptions editable">
        <div class="row">
          <label>Base year</label>
          <input type="number" v-model.number="settingsStore.planning.baseYear" @change="normalize()" min="2000" max="2100" />
        </div>
        <div class="row">
          <label>Horizon (years)</label>
          <input type="number" v-model.number="settingsStore.planning.horizonYears" @change="normalize()" min="1" max="50" />
        </div>
        <div class="row">
          <label>Real GDP growth (%)</label>
          <input type="number" step="0.1" v-model.number="settingsStore.economic.gdpReal" @change="normalize()" min="-5" max="10" />
        </div>
        <div class="row">
          <label>Inflation (%)</label>
          <input type="number" step="0.1" v-model.number="settingsStore.economic.inflation" @change="normalize()" min="-2" max="20" />
        </div>
        <div class="row">
          <label>Interest rate (%)</label>
          <input type="number" step="0.1" v-model.number="settingsStore.economic.interestRate" @change="normalize()" min="0" max="20" />
        </div>
        <div class="row preset-row">
          <label>Preset</label>
          <select v-model="selectedPreset" @change="applySelectedPreset">
            <option value="">— Select —</option>
            <option v-for="(val, key) in settingsStore.presets" :key="key" :value="key">{{ key }}</option>
          </select>
          <button class="btn" @click="exportCsv" :disabled="rows.length === 0">Export CSV</button>
        </div>
      </div>

      <div v-if="showPlanner" class="embedded-planner">
        <MultiYearPlanner />
      </div>

      <div v-if="rows.length === 0" class="empty">No projections computed.</div>
      <div v-else class="table-wrapper">
        <table class="proj-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>GDP</th>
              <th>Total Revenue</th>
              <th>Program Spend</th>
              <th>Interest</th>
              <th>Total Spend</th>
              <th>Deficit</th>
              <th>Debt</th>
              <th>Debt/GDP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.year">
              <td>{{ r.year }}</td>
              <td>{{ fmt(r.gdp) }}</td>
              <td>{{ fmt(r.revenueTotal) }}</td>
              <td>{{ fmt(r.programSpending) }}</td>
              <td>{{ fmt(r.interest) }}</td>
              <td>{{ fmt(r.spendingTotal) }}</td>
              <td :class="{ negative: r.deficit > 0, positive: r.deficit <= 0 }">{{ fmt(r.deficit) }}</td>
              <td>{{ fmt(r.debt) }}</td>
              <td>{{ (r.debtToGDP * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { FEATURES } from '@/features.js';
import { projectAll } from '@/domains/budget/utils/projections.js';
import { makeBaseSnapshotFromStore } from '@/domains/budget/utils/projectionAdapters.js';
import MultiYearPlanner from '@/domains/budget/components/MultiYearPlanner.vue';

const budgetStore = useBudgetSimulatorStore();
const settingsStore = useMultiYearSettingsStore();

const planning = computed(() => settingsStore.planning);
const economic = computed(() => settingsStore.economic);

let selectedPreset = '';

const showPlanner = ref(false);

const rows = computed(() => {
  if (!FEATURES.MULTI_YEAR_PLANNING) return [];
  const base = makeBaseSnapshotFromStore(budgetStore);
  const settings = {
    planning: planning.value,
    economic: economic.value,
    revenueElasticity: settingsStore.revenueElasticity,
    spendingGrowth: settingsStore.spendingGrowth,
    categoryUserDelta: settingsStore.categoryUserDelta,
  };
  return projectAll({ base, settings });
});

function fmt(n) {
  // billions, 1 decimal
  return `${Number(n || 0).toFixed(1)}B`;
}

function normalize() {
  // Simple clamps for sanity
  if (settingsStore.planning.horizonYears < 1) settingsStore.planning.horizonYears = 1;
  if (settingsStore.planning.horizonYears > 50) settingsStore.planning.horizonYears = 50;
  if (settingsStore.economic.inflation > 50) settingsStore.economic.inflation = 50;
  if (settingsStore.economic.inflation < -5) settingsStore.economic.inflation = -5;
  if (settingsStore.economic.gdpReal < -10) settingsStore.economic.gdpReal = -10;
  if (settingsStore.economic.gdpReal > 15) settingsStore.economic.gdpReal = 15;
  if (settingsStore.economic.interestRate < 0) settingsStore.economic.interestRate = 0;
  if (settingsStore.economic.interestRate > 50) settingsStore.economic.interestRate = 50;
}

function applySelectedPreset() {
  if (selectedPreset) settingsStore.applyPreset(selectedPreset);
}

function exportCsv() {
  const data = rows.value || [];
  const headers = ['Year','GDP','Total Revenue','Program Spend','Interest','Total Spend','Deficit','Debt','Debt/GDP'];
  const csv = [headers.join(',')]
    .concat(
      data.map(r => [
        r.year,
        num(r.gdp),
        num(r.revenueTotal),
        num(r.programSpending),
        num(r.interest),
        num(r.spendingTotal),
        num(r.deficit),
        num(r.debt),
        (r.debtToGDP * 100).toFixed(2) + '%'
      ].join(','))
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `multi_year_projections_${planning.value.baseYear}_${planning.value.horizonYears}y.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function num(n) { return Number(n || 0).toFixed(2); }

</script>

<style scoped>
.multi-year-panel {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.header-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.title { margin: 0 0 8px 0; }
.assumptions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; font-size: 0.9rem; color: #374151; }
.assumptions.editable { align-items: flex-end; }
.assumptions .row { display: flex; flex-direction: column; gap: 4px; }
.assumptions .row input, .assumptions .row select { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; min-width: 140px; }
.assumptions .row label { font-size: 0.8rem; color: #6b7280; }
.assumptions .preset-row { flex-direction: row; align-items: center; gap: 8px; }
.btn { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; cursor: pointer; }
.btn.primary { background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 3px 10px rgba(37,99,235,.25); display: inline-flex; align-items: center; gap: 6px; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.flag-disabled, .empty { color: #6b7280; font-style: italic; }
.table-wrapper { overflow-x: auto; }
.embedded-planner { margin: 10px 0 16px 0; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: #fafbff; }
.proj-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.proj-table th, .proj-table td { border-bottom: 1px solid #e5e7eb; padding: 6px 8px; text-align: right; }
.proj-table th:first-child, .proj-table td:first-child { text-align: left; }
.negative { color: #b91c1c; }
.positive { color: #047857; }
</style>
