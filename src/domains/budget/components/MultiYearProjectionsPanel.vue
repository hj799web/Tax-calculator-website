<template>
  <div class="multi-year-panel">
    <div class="header-row">
      <h3 class="title">{{ i18nText('multiYearProjections.title', 'Multi-Year Projections') }}</h3>
      <button class="btn primary" @click="showPlanner = !showPlanner">
        <span class="material-icons" aria-hidden="true">timeline</span>
        {{ showPlanner ? i18nText('multiYearProjections.buttons.hideCharts', 'Hide Charts') : i18nText('multiYearProjections.buttons.showCharts', 'Show Charts') }}
      </button>
    </div>
    <div v-if="!FEATURES.MULTI_YEAR_PLANNING" class="flag-disabled">
      <p>{{ i18nText('multiYearProjections.featureDisabled', 'This feature is disabled. Enable MULTI_YEAR_PLANNING to view projections.') }}</p>
    </div>
    <div v-else>
      <div class="assumptions editable">
        <div class="row">
          <label>{{ i18nText('multiYearProjections.labels.baseYear', 'Base year') }}</label>
          <input type="number" v-model.number="settingsStore.planning.baseYear" @change="normalize()" min="2000" max="2100" />
        </div>
        <div class="row">
          <label>{{ i18nText('multiYearProjections.labels.horizon', 'Horizon (years)') }}</label>
          <input type="number" v-model.number="settingsStore.planning.horizonYears" @change="normalize()" min="1" max="50" />
        </div>
        <div class="row">
          <label>{{ i18nText('multiYearProjections.labels.realGdpGrowth', 'Real GDP growth (%)') }}</label>
          <input type="number" step="0.1" v-model.number="settingsStore.economic.gdpReal" @change="normalize()" min="-5" max="10" />
        </div>
        <div class="row">
          <label>{{ i18nText('multiYearProjections.labels.inflation', 'Inflation (%)') }}</label>
          <input type="number" step="0.1" v-model.number="settingsStore.economic.inflation" @change="normalize()" min="-2" max="20" />
        </div>
        <div class="row">
          <label>{{ i18nText('multiYearProjections.labels.interestRate', 'Interest rate (%)') }}</label>
          <input type="number" step="0.1" v-model.number="settingsStore.economic.interestRate" @change="normalize()" min="0" max="20" />
        </div>
        <div class="row">
          <label :title="i18nText('multiYearProjections.tooltips.programSpendingBoost', 'One-time adjustment to all program spending levels')">{{ i18nText('multiYearProjections.labels.programSpendingBoost', 'Program spending boost (%)') }}</label>
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
          <label :title="i18nText('multiYearProjections.tooltips.speedUpSpendingGrowth', 'Adjusts how fast program spending grows each year. +0.5 means all categories grow 0.5 percentage points faster annually.')">{{ i18nText('multiYearProjections.labels.speedUpSpendingGrowth', 'Speed up spending growth (pp)') }}</label>
          <input
            type="number"
            step="0.1"
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
        
        <details class="spend-growth" open>
          <summary>Annual Program Spending Growth Rates (%)</summary>
          
          <div class="growth-explanation">
            <p><strong>How spending grows each year:</strong></p>
            <ul>
              <li><strong>Baseline:</strong> Normal program cost increases (inflation, policy changes, etc.)</li>
              <li><strong>Demographic:</strong> Extra growth due to population aging and demographic changes</li>
              <li><strong>Total Growth = Baseline + Demographic</strong> (e.g., Healthcare: 3.5% + 1.2% = 4.7% per year)</li>
            </ul>
          </div>

          <div class="growth-toolbar">
            <input
              class="filter"
              v-model="growthFilter"
              placeholder="Filter categories (e.g., health, seniors)…"
            />
            <div class="spacer"></div>
            <button class="btn" @click="onResetAll()">Reset all</button>
          </div>

          <div class="growth-head">
            <div class="label">Category</div>
            <div class="inputs-head">
              <span :title="t('simulator.multiYearProjections.tooltips.baseline', 'Normal program cost increases (inflation, policy changes, etc.)')">
                Baseline
                <span class="help-icon">ⓘ</span>
              </span>
              <span :title="t('simulator.multiYearProjections.tooltips.extraGrowth', 'Extra growth due to population aging and demographic changes')">
                Demographic
                <span class="help-icon">ⓘ</span>
              </span>
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
                <label class="sub" :title="t('simulator.multiYearProjections.tooltips.baseline', 'Normal program cost increases')">Baseline</label>
                <input
                  type="number"
                  step="0.1"
                  :min="-10"
                  :max="15"
                  v-model.number="settingsStore.spendingGrowth[key].baseline"
                  :title="`Baseline growth rate for ${prettyKey(key)}`"
                />
                <label class="sub" :title="t('simulator.multiYearProjections.tooltips.demographic', 'Extra growth due to population aging')">Demographic</label>
                <input
                  type="number"
                  step="0.1"
                  :min="-5"
                  :max="10"
                  v-model.number="settingsStore.spendingGrowth[key].demographic"
                  :title="`Demographic growth rate for ${prettyKey(key)}`"
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
      </div>

      <div v-if="showPlanner" class="charts-section">
        <ProjectionsPanelLite :show-controls="false" />
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
        <div class="ye-header">
          <h4>{{ i18nText('projectionsPanel.editYearTitle', 'Edit {year} (program spending)')?.replace('{year}', selectedYear) }}</h4>
          <button class="btn" @click="closeYearEditor">{{ i18nText('common.close', 'Close') }}</button>
        </div>
        <div class="ye-grid">
          <div class="row">
            <label :title="i18nText('projectionsPanel.spendingBoostTooltip', 'One-time adjustment to program spending for this year')">{{ i18nText('projectionsPanel.spendingBoost', 'Program spending boost (%)') }}</label>
            <input type="number" step="0.5" :min="-15" :max="15" v-model.number="yearLevel" />
          </div>
          <div class="row">
            <label :title="i18nText('projectionsPanel.growthRateBoostTooltip', 'Adjusts growth rate for this year and forward. +0.5 means spending grows 0.5 percentage points faster.')">{{ i18nText('projectionsPanel.growthRateBoost', 'Growth rate boost (pp)') }}</label>
            <input type="number" step="0.1" v-model.number="yearGrowth" />
          </div>
          <div class="row">
            <label>{{ i18nText('projectionsPanel.applyForward', 'Apply forward') }}</label>
            <input type="checkbox" v-model="applyForward" />
          </div>
        </div>
        <div class="ye-actions">
          <button class="btn" @click="resetYearOverrides">{{ i18nText('projectionsPanel.resetYear', 'Reset year') }}</button>
          <button class="btn primary" @click="applyYearOverrides">{{ i18nText('common.apply', 'Apply') }}</button>
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
import ProjectionsPanelLite from '@/domains/budget/components/ProjectionsPanelLite.vue';
import { useI18n } from '@/i18n';

// i18n setup
const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key);
  return value === key ? fallback : value;
};

const budget = useBudgetSimulatorStore();
const settingsStore = useMultiYearSettingsStore();
const showPlanner = ref(true); // Changed from false to true - planner open by default
const selectedPreset = ref('');
const showYearModal = ref(false);
const selectedYear = ref(null);
const yearLevel = ref(0);
const yearGrowth = ref(0);
const applyForward = ref(false);
const growthFilter = ref('');

const filteredKeys = computed(() => {
  const q = growthFilter.value.trim().toLowerCase();
  const keys = Object.keys(settingsStore.spendingGrowth || {});
  if (!q) return keys;
  return keys.filter(k => prettyKey(k).toLowerCase().includes(q));
});

function normalize() {
  // Ensure base year is reasonable
  if (settingsStore.planning.baseYear < 2000) settingsStore.planning.baseYear = 2000;
  if (settingsStore.planning.baseYear > 2100) settingsStore.planning.baseYear = 2100;
  
  // Ensure horizon is reasonable
  if (settingsStore.planning.horizonYears < 1) settingsStore.planning.horizonYears = 1;
  if (settingsStore.planning.horizonYears > 50) settingsStore.planning.horizonYears = 50;
  
  // Clamp economic assumptions
  settingsStore.economic.gdpReal = Math.max(-5, Math.min(10, Number(settingsStore.economic.gdpReal || 0)));
  settingsStore.economic.inflation = Math.max(-2, Math.min(20, Number(settingsStore.economic.inflation || 0)));
  settingsStore.economic.interestRate = Math.max(0, Math.min(20, Number(settingsStore.economic.interestRate || 0)));
}

const rows = computed(() => {
  const base = makeBaseSnapshotFromStore(budget);
  const settings = {
    planning: settingsStore.planning,
    economic: settingsStore.economic,
    revenueElasticity: settingsStore.revenueElasticity,
    spendingGrowth: settingsStore.spendingGrowth,
    categoryUserDelta: settingsStore.categoryUserDelta,
    spendingGlobal: settingsStore.spendingGlobal,
    yearOverrides: settingsStore.yearOverrides,
  };
  return projectAll({ base, settings });
});

function applyPreset() {
  if (!selectedPreset.value) return;
  
  const presets = {
    conservative: {
      gdpReal: 1.5,
      inflation: 2.0,
      interestRate: 3.5,
    },
    moderate: {
      gdpReal: 2.0,
      inflation: 2.5,
      interestRate: 4.0,
    },
    optimistic: {
      gdpReal: 2.5,
      inflation: 2.0,
      interestRate: 3.0,
    },
  };
  
  const preset = presets[selectedPreset.value];
  if (preset) {
    settingsStore.economic.gdpReal = preset.gdpReal;
    settingsStore.economic.inflation = preset.inflation;
    settingsStore.economic.interestRate = preset.interestRate;
  }
}

function resetToDefaults() {
  settingsStore.economic.gdpReal = 2.0;
  settingsStore.economic.inflation = 2.0;
  settingsStore.economic.interestRate = 4.0;
  settingsStore.spendingGlobal.levelPct = 0;
  settingsStore.spendingGlobal.growthDeltaPct = 0;
  selectedPreset.value = '';
}

function clampGlobal() {
  settingsStore.spendingGlobal.levelPct = Math.max(-15, Math.min(15, Number(settingsStore.spendingGlobal.levelPct || 0)));
  // Removed growth rate restrictions - users can set any value they want
  settingsStore.spendingGlobal.growthDeltaPct = Number(settingsStore.spendingGlobal.growthDeltaPct || 0);
}

function openYearEditor(year) {
  selectedYear.value = year;
  const ov = settingsStore.yearOverrides[year]?.spending || {};
  yearLevel.value = Number(ov.levelPct || 0);
  yearGrowth.value = Number(ov.growthDeltaPct || 0);
  applyForward.value = Boolean(ov.applyForward);
  showYearModal.value = true;
}

function closeYearEditor() {
  showYearModal.value = false;
  selectedYear.value = null;
  yearLevel.value = 0;
  yearGrowth.value = 0;
  applyForward.value = false;
}

function applyYearOverrides() {
  if (!selectedYear.value) return;
  const yr = Number(selectedYear.value);
  
  const cur = settingsStore.yearOverrides[yr] || {};
  settingsStore.setYearSpendingOverride(yr, {
    spending: {
      ...(cur.spending || {}),
      levelPct: Math.max(-15, Math.min(15, Number(yearLevel.value || 0))),
      // Removed growth rate restrictions - users can set any value they want
      growthDeltaPct: Number(yearGrowth.value || 0),
    },
    applyForward: applyForward.value,
  });
  
  closeYearEditor();
}

function resetYearOverrides() {
  if (!selectedYear.value) return;
  settingsStore.clearYearSpendingOverride(Number(selectedYear.value));
  closeYearEditor();
}

function fmt(n) {
  return typeof n === 'number' ? n.toFixed(1) : '0.0';
}

function prettyKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase());
}

function onResetRow(key) {
  if (settingsStore.resetSpendingGrowthKey) settingsStore.resetSpendingGrowthKey(key);
}

function onResetAll() {
  if (settingsStore.resetAllSpendingGrowth) settingsStore.resetAllSpendingGrowth();
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
.assumptions .row label { 
  font-size: 0.8rem; 
  color: #6b7280; 
  cursor: help;
  position: relative;
}
.assumptions .row label:hover {
  color: #374151;
}
.assumptions .preset-row { flex-direction: row; align-items: center; gap: 8px; }

.growth-toolbar { position: sticky; top: 0; z-index: 1; display: flex; gap: 8px; align-items: center; padding: 8px 6px; margin: 6px -6px 8px; background: rgba(255,255,255,0.92); backdrop-filter: blur(6px); border-bottom: 1px solid #e5e7eb; }
.growth-toolbar .filter { width: min(380px, 50vw); padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 10px; }
.growth-toolbar .spacer { flex: 1 1 auto; }

details.spend-growth { grid-column: 1 / -1; background: linear-gradient(180deg, #fafbff 0%, #ffffff 60%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 8px 10px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
details.spend-growth > summary { font-weight: 700; color: #111827; cursor: pointer; }

.growth-head { display: grid; grid-template-columns: 1fr 2fr auto; gap: 8px; align-items: center; padding: 4px 6px; color: #6b7280; font-size: .75rem; }
.growth-head .inputs-head { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; justify-items: start; }

.growth-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 4px; }
.growth-row { display: grid; grid-template-columns: 1fr 2fr auto; gap: 10px; align-items: center; padding: 10px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; transition: box-shadow .15s ease, border-color .15s ease; }
.growth-row:hover { border-color: #c7d2fe; box-shadow: 0 4px 14px rgba(29,78,216,0.08); }
.growth-row .label { font-size: 0.9rem; color: #111827; font-weight: 600; }
.growth-row .inputs { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 8px; align-items: center; }
.growth-row .inputs input { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; transition: border-color .15s, box-shadow .15s; }
.growth-row .inputs input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); outline: none; }
.growth-row .sub { font-size: 0.75rem; color: #6b7280; }
.actions { display: flex; justify-content: flex-end; }
.icon-btn { border: 1px solid #e5e7eb; background: #f9fafb; color: #374151; border-radius: 8px; width: 36px; height: 32px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-btn:hover { background: #eef2ff; border-color: #c7d2fe; color: #1d4ed8; }

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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #1d4ed8;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn.primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.table-wrapper { overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px; }
.proj-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.proj-table th, .proj-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
.proj-table th { background: #f9fafb; font-weight: 600; color: #374151; }
.proj-table .positive { color: #059669; font-weight: 600; }
.proj-table .negative { color: #dc2626; font-weight: 600; }
.year-link { background: none; border: none; color: #3b82f6; cursor: pointer; text-decoration: underline; }
.year-link:hover { color: #1d4ed8; }

.year-editor {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 1000;
  min-width: 400px;
  max-width: 90vw;
}

.ye-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.ye-header h4 {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.ye-grid {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.ye-grid .row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
}

.ye-grid label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.ye-grid input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.ye-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.charts-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0;
}

.embedded-planner {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fafbff;
}

.flag-disabled {
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;
}

.empty {
  padding: 32px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.growth-explanation {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0 12px 0;
  font-size: 0.875rem;
}

.growth-explanation p {
  margin: 0 0 8px 0;
  color: #0c4a6e;
  font-weight: 600;
}

.growth-explanation ul {
  margin: 0;
  padding-left: 16px;
  color: #0369a1;
}

.growth-explanation li {
  margin-bottom: 4px;
}

.help-icon {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 4px;
  cursor: help;
}
</style>
