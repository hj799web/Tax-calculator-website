<template>
  <div class="assumptions-panel">
    <div class="row">
      <label>Base year</label>
      <input type="number" v-model.number="settings.planning.baseYear" min="2020" max="2030" />
    </div>
    <div class="row">
      <label>Horizon (years)</label>
      <input type="number" v-model.number="settings.planning.horizonYears" min="1" max="20" />
    </div>
    <div class="row">
      <label>GDP growth (%)</label>
      <input type="number" step="0.1" v-model.number="settings.economic.gdpReal" min="-5" max="10" />
    </div>
    <div class="row">
      <label>Inflation (%)</label>
      <input type="number" step="0.1" v-model.number="settings.economic.inflation" min="-2" max="10" />
    </div>
    <div class="row">
      <label>Interest rate (%)</label>
      <input type="number" step="0.1" v-model.number="settings.economic.interestRate" min="0" max="15" />
    </div>
    <div class="row preset">
      <label>Preset</label>
      <select v-model="selectedPreset" @change="applyPreset()">
        <option value="">Custom</option>
        <option value="conservative">Conservative</option>
        <option value="moderate">Moderate</option>
        <option value="optimistic">Optimistic</option>
      </select>
      <button class="btn" @click="reset()">Reset</button>
    </div>

    <details class="planning-controls" open>
      <summary>Program Spending Controls</summary>
      <div class="controls-grid">
        <div class="row">
          <label title="One-time adjustment to all program spending levels">Program spending boost (%)
            <span class="info-icon" title="Applies a one-time level change to program spending in the base year (and carried through).">info</span>
          </label>
          <input type="number" step="0.5" :min="-15" :max="15" v-model.number="settings.spendingGlobal.levelPct" />
        </div>
        <div class="row">
          <label title="Adjusts how fast program spending grows each year. +0.5 means all categories grow 0.5 percentage points faster annually.">Speed up spending growth (pp)
            <span class="info-icon" title="Adds or subtracts percentage points to the annual growth rate applied to all categories.">info</span>
          </label>
          <input type="number" step="0.1" v-model.number="settings.spendingGlobal.growthDeltaPct" />
        </div>
      </div>
      <SpendingGrowthControls />
    </details>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import SpendingGrowthControls from '@/domains/budget/components/SpendingGrowthControls.vue';

const settings = useMultiYearSettingsStore();
const selectedPreset = ref('');

function applyPreset() {
  if (selectedPreset.value === 'conservative') {
    settings.economic.gdpReal = 1.5;
    settings.economic.inflation = 1.8;
    settings.economic.interestRate = 3.5;
  } else if (selectedPreset.value === 'moderate') {
    settings.economic.gdpReal = 2.0;
    settings.economic.inflation = 2.0;
    settings.economic.interestRate = 3.0;
  } else if (selectedPreset.value === 'optimistic') {
    settings.economic.gdpReal = 2.8;
    settings.economic.inflation = 2.2;
    settings.economic.interestRate = 2.5;
  }
}

function reset() {
  settings.planning.baseYear = new Date().getFullYear();
  settings.planning.horizonYears = 10;
  settings.economic.gdpReal = 2.0;
  settings.economic.inflation = 2.0;
  settings.economic.interestRate = 3.0;
  selectedPreset.value = '';
}
</script>

<style scoped>
.assumptions-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.row { display: grid; gap: 6px; }
label { font-size: .85rem; color: #6b7280; }
input, select { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; }
.row.preset { grid-template-columns: 1fr 1fr auto; align-items: end; gap: 10px; }

details.planning-controls { grid-column: 1 / -1; border: 1px solid #e5e7eb; border-radius: 12px; background: linear-gradient(180deg, #fafbff 0%, #ffffff 60%); padding: 10px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
details.planning-controls > summary { font-weight: 700; color: #111827; cursor: pointer; }
.controls-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 10px 0 6px; }
.controls-grid input { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; transition: border-color .15s, box-shadow .15s; }
.controls-grid input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); outline: none; }
.info-icon { font-family: 'Material Icons'; font-size: 16px; line-height: 1; color: #6b7280; border: 1px solid #e5e7eb; border-radius: 50%; width: 16px; height: 16px; display: inline-grid; place-items: center; margin-left: 6px; cursor: help; }
.info-icon:hover { color: #1d4ed8; border-color: #c7d2fe; }

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

@media (max-width: 420px) { .assumptions-panel { grid-template-columns: 1fr; } .row.preset { grid-template-columns: 1fr 1fr; } }
</style>
