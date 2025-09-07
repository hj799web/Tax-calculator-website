<template>
  <div class="assumptions-panel">
    <div class="row">
      <label>Base year</label>
      <input type="number" v-model.number="settings.planning.baseYear" min="2000" max="2100" @change="normalize()" />
    </div>
    <div class="row">
      <label>Horizon (years)</label>
      <input type="number" v-model.number="settings.planning.horizonYears" min="1" max="50" @change="normalize()" />
    </div>
    <div class="row">
      <label>Real GDP growth (%)</label>
      <input type="number" step="0.1" v-model.number="settings.economic.gdpReal" min="-5" max="10" @change="normalize()" />
    </div>
    <div class="row">
      <label>Inflation (%)</label>
      <input type="number" step="0.1" v-model.number="settings.economic.inflation" min="-2" max="20" @change="normalize()" />
    </div>
    <div class="row">
      <label>Interest rate (%)</label>
      <input type="number" step="0.1" v-model.number="settings.economic.interestRate" min="0" max="20" @change="normalize()" />
    </div>
    <div class="row preset">
      <label>Preset</label>
      <select v-model="preset" @change="applyPreset">
        <option value="">— Select —</option>
        <option v-for="(val, key) in settings.presets" :key="key" :value="key">{{ key }}</option>
      </select>
      <button class="btn" @click="resetDefaults">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

const settings = useMultiYearSettingsStore();
const preset = ref('');

function normalize() {
  if (settings.planning.horizonYears < 1) settings.planning.horizonYears = 1;
  if (settings.planning.horizonYears > 50) settings.planning.horizonYears = 50;
  settings.economic.inflation = Math.min(50, Math.max(-5, settings.economic.inflation));
  settings.economic.gdpReal = Math.min(15, Math.max(-10, settings.economic.gdpReal));
  settings.economic.interestRate = Math.min(50, Math.max(0, settings.economic.interestRate));
}

function applyPreset() { if (preset.value) settings.applyPreset(preset.value); }
function resetDefaults() { settings.applyPreset('baseline'); }
</script>

<style scoped>
.assumptions-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.row { display: grid; gap: 6px; }
label { font-size: .85rem; color: #6b7280; }
input, select { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; }
.row.preset { grid-template-columns: 1fr 1fr auto; align-items: end; gap: 10px; }
.btn { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 10px; background: #f3f4f6; cursor: pointer; }
@media (max-width: 420px) { .assumptions-panel { grid-template-columns: 1fr; } .row.preset { grid-template-columns: 1fr 1fr; } }
</style>
