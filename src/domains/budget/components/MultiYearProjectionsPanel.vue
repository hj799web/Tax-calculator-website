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
        <div class="row">
          <label>Program spending (level %)</label>
          <input
            type="number"
            step="0.5"
            :min="-15"
            :max="15"
            v-model.number="settingsStore.spendingGlobal.levelPct"
            @change="clampGlobal()"
          />
        </div>
        <div class="row">
          <label>Program spending (growth ±pp)</label>
          <input
            type="number"
            step="0.1"
            :min="-2"
            :max="2"
            v-model.number="settingsStore.spendingGlobal.growthDeltaPct"
            @change="clampGlobal()"
          />
        </div>
        <div class="row preset-row">
          <label>Preset</label>
          <select v-model="selectedPreset" @change="applyPreset()">
            <option value="">Custom</option>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="optimistic">Optimistic</option>
          </select>
        </div>
        <div class="row">
          <button class="btn" @click="resetToDefaults()">Reset to defaults</button>
        </div>
        
        <details class="spend-growth">
          <summary>Program Spending Growth (%)</summary>
          <div class="growth-grid">
            <div
              v-for="(profile, key) in settingsStore.spendingGrowth"
              :key="key"
              class="growth-row"
            >
              <div class="label">{{ prettyKey(key) }}</div>
              <div class="inputs">
                <label class="sub">Baseline</label>
                <input
                  type="number"
                  step="0.1"
                  :min="-10"
                  :max="15"
                  v-model.number="settingsStore.spendingGrowth[key].baseline"
                />
                <label class="sub">Demographic</label>
                <input
                  type="number"
                  step="0.1"
                  :min="-5"
                  :max="10"
                  v-model.number="settingsStore.spendingGrowth[key].demographic"
                />
              </div>
            </div>
          </div>
        </details>
      </div>

      <div v-if="showPlanner" class="embedded-planner">
        <MultiYearPlanner />
      </div>

      <div class="table-wrapper">
        <table class="proj-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>GDP (B$)</th>
              <th>Revenue (B$)</th>
              <th>Spending (B$)</th>
              <th>Surplus/Deficit (B$)</th>
              <th>Debt (B$)</th>
              <th>Debt/GDP (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.year">
              <td>
                <button class="year-link" @click="openYearEditor(r.year)">{{ r.year }}</button>
              </td>
              <td>{{ fmt(r.gdp) }}</td>
              <td>{{ fmt(r.revenueTotal) }}</td>
              <td>{{ fmt(r.spendingTotal) }}</td>
              <td :class="{ positive: r.deficit >= 0, negative: r.deficit < 0 }">{{ fmt(r.deficit) }}</td>
              <td>{{ fmt(r.debt) }}</td>
              <td>{{ (r.debtToGDP * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
        <div v-if="rows.length === 0" class="empty">
          No projection data available. Check settings.
        </div>
      </div>
      <div v-if="showYearModal" class="year-editor">
        <div class="year-editor-card">
          <div class="ye-header">
            <h4>Edit {{ selectedYear }} (program spending)</h4>
            <button class="btn" @click="closeYearEditor">Close</button>
          </div>
          <div class="ye-grid">
            <div class="row">
              <label>Level (one-time, %)</label>
              <input type="number" step="0.5" :min="-15" :max="15" v-model.number="yearLevel" />
            </div>
            <div class="row">
              <label>Growth (±pp per year)</label>
              <input type="number" step="0.1" :min="-2" :max="2" v-model.number="yearGrowth" />
            </div>
            <div class="row">
              <label>Apply forward</label>
              <input type="checkbox" v-model="applyForward" />
            </div>
          </div>
          <div class="ye-actions">
            <button class="btn" @click="resetYearOverrides">Reset year</button>
            <button class="btn primary" @click="applyYearOverrides">Apply</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { makeBaseSnapshotFromStore } from '@/domains/budget/utils/projectionAdapters.js';
import { projectAll } from '@/domains/budget/utils/projections.js';
import { FEATURES } from '@/features.js';
import MultiYearPlanner from '@/domains/budget/components/MultiYearPlanner.vue';

const budget = useBudgetSimulatorStore();
const settingsStore = useMultiYearSettingsStore();
const showPlanner = ref(false);
const selectedPreset = ref('');
const showYearModal = ref(false);
const selectedYear = ref(null);
const yearLevel = ref(0);
const yearGrowth = ref(0);
const applyForward = ref(false);

function normalize() {
  settingsStore.planning.baseYear = Math.max(2000, Math.min(2100, settingsStore.planning.baseYear || new Date().getFullYear()));
  settingsStore.planning.horizonYears = Math.max(1, Math.min(50, settingsStore.planning.horizonYears || 10));
  settingsStore.economic.gdpReal = Math.max(-5, Math.min(10, settingsStore.economic.gdpReal || 2));
  settingsStore.economic.inflation = Math.max(-2, Math.min(20, settingsStore.economic.inflation || 2));
  settingsStore.economic.interestRate = Math.max(0, Math.min(20, settingsStore.economic.interestRate || 3));
}

const rows = computed(() => {
  const base = makeBaseSnapshotFromStore(budget);
  return projectAll({ base, settings: {
    planning: settingsStore.planning,
    economic: settingsStore.economic,
    revenueElasticity: settingsStore.revenueElasticity,
    spendingGrowth: settingsStore.spendingGrowth,
    categoryUserDelta: settingsStore.categoryUserDelta,
    spendingGlobal: settingsStore.spendingGlobal,
    yearOverrides: settingsStore.yearOverrides,
  }});
});

function fmt(n) {
  return `$${Number(n || 0).toFixed(1)}B`;
}

function resetToDefaults() {
  settingsStore.planning.baseYear = new Date().getFullYear();
  settingsStore.planning.horizonYears = 10;
  settingsStore.economic.gdpReal = 2.0;
  settingsStore.economic.inflation = 2.0;
  settingsStore.economic.interestRate = 3.0;
  selectedPreset.value = '';
}

function applyPreset() {
  if (selectedPreset.value === 'conservative') {
    settingsStore.economic.gdpReal = 1.5;
    settingsStore.economic.inflation = 1.8;
    settingsStore.economic.interestRate = 3.5;
  } else if (selectedPreset.value === 'moderate') {
    settingsStore.economic.gdpReal = 2.0;
    settingsStore.economic.inflation = 2.0;
    settingsStore.economic.interestRate = 3.0;
  } else if (selectedPreset.value === 'optimistic') {
    settingsStore.economic.gdpReal = 2.5;
    settingsStore.economic.inflation = 2.2;
    settingsStore.economic.interestRate = 2.5;
  }
}

function openYearEditor(year) {
  selectedYear.value = year;
  const ov = settingsStore.yearOverrides?.[year]?.spending || {};
  yearLevel.value = Number(ov.levelPct || 0);
  yearGrowth.value = Number(ov.growthDeltaPct || 0);
  applyForward.value = !!(settingsStore.yearOverrides?.[year]?.applyForward);
  showYearModal.value = true;
}

function closeYearEditor() {
  showYearModal.value = false;
}

function clampGlobal() {
  settingsStore.spendingGlobal.levelPct = Math.max(-15, Math.min(15, Number(settingsStore.spendingGlobal.levelPct || 0)));
  settingsStore.spendingGlobal.growthDeltaPct = Math.max(-2, Math.min(2, Number(settingsStore.spendingGlobal.growthDeltaPct || 0)));
}

function applyYearOverrides() {
  if (!selectedYear.value) return;
  const yr = Number(selectedYear.value);
  const baseYear = Number(settingsStore.planning.baseYear || yr);
  const horizon = Number(settingsStore.planning.horizonYears || 10);
  const lastYear = baseYear + horizon - 1;
  const applyToYears = applyForward.value ? Array.from({ length: lastYear - yr + 1 }, (_, i) => yr + i) : [yr];
  applyToYears.forEach(y => {
    const cur = settingsStore.yearOverrides[y] || {};
    settingsStore.yearOverrides[y] = {
      ...cur,
      spending: {
        ...(cur.spending || {}),
        levelPct: Math.max(-15, Math.min(15, Number(yearLevel.value || 0))),
        growthDeltaPct: Math.max(-2, Math.min(2, Number(yearGrowth.value || 0))),
      },
      applyForward: applyForward.value,
    };
  });
  showYearModal.value = false;
}

function resetYearOverrides() {
  if (!selectedYear.value) return;
  const yr = Number(selectedYear.value);
  const cur = settingsStore.yearOverrides[yr] || {};
  // Remove only spending overrides; keep other potential future fields
  settingsStore.yearOverrides[yr] = { ...cur, spending: undefined };
  yearLevel.value = 0;
  yearGrowth.value = 0;
}

function prettyKey(k) {
  return String(k)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase());
}
</script>

<style scoped>
.multi-year-panel { display: grid; gap: 12px; }
.header-row { display: flex; align-items: center; justify-content: space-between; }
.title { margin: 0; font-size: 1rem; color: #111827; }
.assumptions { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 16px; }
.assumptions.editable { align-items: flex-end; }
.assumptions .row { display: flex; flex-direction: column; gap: 4px; }
.assumptions .row input, .assumptions .row select { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; min-width: 140px; }
.assumptions .row label { font-size: 0.8rem; color: #6b7280; }
.assumptions .preset-row { flex-direction: row; align-items: center; gap: 8px; }

details.spend-growth { grid-column: 1 / -1; background: #fafbff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; }
details.spend-growth > summary { font-weight: 600; color: #374151; cursor: pointer; }
.growth-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; margin-top: 8px; }
.growth-row { display: grid; grid-template-columns: 1fr 2fr; gap: 8px; align-items: center; padding: 6px; border: 1px dashed #e5e7eb; border-radius: 8px; background: #fff; }
.growth-row .label { font-size: 0.85rem; color: #374151; }
.growth-row .inputs { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 6px; align-items: center; }
.growth-row .sub { font-size: 0.75rem; color: #6b7280; }

.btn {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  box-shadow: 0 4px 16px rgba(107, 114, 128, 0.2);
  transform: translateY(-1px);
  border-color: #6b7280;
}

.btn:hover::before {
  left: 100%;
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.15);
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn.primary::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  border-color: #2563eb;
}

.btn:disabled {
  background: #6b7280;
  border-color: #6b7280;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.flag-disabled, .empty { color: #6b7280; font-style: italic; }
.table-wrapper { overflow-x: auto; }
.embedded-planner { margin: 10px 0 16px 0; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: #fafbff; }
.proj-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.proj-table th, .proj-table td { border-bottom: 1px solid #e5e7eb; padding: 6px 8px; text-align: right; }
.proj-table th:first-child, .proj-table td:first-child { text-align: left; }
.negative { color: #b91c1c; }
.positive { color: #047857; }

.year-link { background: none; border: none; color: #2563eb; cursor: pointer; padding: 0; font-weight: 600; }
.year-link:hover { text-decoration: underline; }

.year-editor { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: grid; place-items: center; z-index: 2000; }
.year-editor-card { width: min(520px, 94vw); background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: grid; gap: 10px; }
.ye-header { display: flex; justify-content: space-between; align-items: center; }
.ye-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.ye-actions { display: flex; justify-content: flex-end; gap: 8px; }
</style>
