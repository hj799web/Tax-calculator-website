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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

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