<template>
  <div class="backdrop" @click.self="$emit('close')">
    <div class="modal">
      <header class="header">
        <h3 class="title">Edit {{ typeLabel }} Plan — {{ itemName }}</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <div class="content">
        <div v-if="type==='revenue'" class="section">
          <label class="field-label">Mode</label>
          <select v-model="rev.mode">
            <option value="points">Explicit points</option>
            <option value="rule">Simple growth rule</option>
          </select>
          <div v-if="rev.mode==='points'" class="points">
            <div class="row" v-for="(val, y) in rev.points" :key="y">
              <input type="number" v-model.number="rev.points[y]" step="0.1" />
              <span>@</span>
              <input type="number" v-model.number="yearKeysMap[y]" @change="renameYear(y, yearKeysMap[y])" />
              <button class="btn" @click="delPoint(y)">Delete</button>
            </div>
            <div class="row">
              <input type="number" v-model.number="newPoint.rate" placeholder="rate %" step="0.1" />
              <span>@</span>
              <input type="number" v-model.number="newPoint.year" placeholder="year" />
              <button class="btn" @click="addPoint()">Add</button>
            </div>
          </div>
          <div v-else class="rule">
            <label class="field-label">Start rate (%)</label>
            <input type="number" v-model.number="rev.rule.startRate" step="0.1" />
            <label class="field-label">Annual delta (pp)</label>
            <input type="number" v-model.number="rev.rule.annualDeltaPct" step="0.1" />
          </div>
        </div>

        <div v-else class="section">
          <label class="field-label">Explicit points (factor = 1.00 base)</label>
          <div class="points">
            <div class="row" v-for="(val, y) in spend.points" :key="y">
              <input type="number" v-model.number="spend.points[y]" step="0.01" />
              <span>@</span>
              <input type="number" v-model.number="yearKeysMap[y]" @change="renameYear(y, yearKeysMap[y])" />
              <button class="btn" @click="delPoint(y)">Delete</button>
            </div>
            <div class="row">
              <input type="number" v-model.number="newPoint.factor" placeholder="factor" step="0.01" />
              <span>@</span>
              <input type="number" v-model.number="newPoint.year" placeholder="year" />
              <button class="btn" @click="addPoint()">Add</button>
            </div>
          </div>
          <label class="field-label">Ongoing level shift (%)</label>
          <input type="number" v-model.number="spend.ongoingLevelPct" step="0.1" />
          <label class="field-label">Growth delta (pp)</label>
          <input type="number" v-model.number="spend.growthDeltaPp" step="0.1" />
        </div>
      </div>
      <footer class="footer">
        <button class="btn" @click="onClear">Clear Plan</button>
        <button class="btn primary" @click="onSave">Save</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

const props = defineProps({ type: { type: String, required: true }, id: { type: String, required: true }, year: { type: Number, required: true } });
const emit = defineEmits(['close']);

const budget = useBudgetSimulatorStore();
const settings = useMultiYearSettingsStore();

const typeLabel = computed(() => props.type === 'revenue' ? 'Revenue' : 'Spending');
const itemName = computed(() => props.type === 'revenue' ? (budget.revenueSources[props.id]?.name || props.id) : (findSpending(props.id)?.name || props.id));

function findSpending(id) {
  const cats = budget.spendingCategories || {};
  if (cats[id]) return cats[id];
  for (const g of Object.values(cats)) {
    if (g?.isGroup && g.children && g.children[id]) return g.children[id];
  }
  return null;
}

// local editable copies
const rev = reactive({ mode: 'points', points: {}, rule: { startRate: undefined, annualDeltaPct: 0 } });
const spend = reactive({ points: {}, ongoingLevelPct: 0, growthDeltaPp: 0 });
const yearKeysMap = reactive({});
const newPoint = reactive({ year: props.year, rate: undefined, factor: undefined });

// load existing plan
if (props.type === 'revenue') {
  const p = settings.multiYearPlans.revenue[props.id] || {};
  rev.mode = p.mode || 'points';
  rev.points = { ...(p.points || {}) };
  rev.rule = { ...(p.rule || { startRate: undefined, annualDeltaPct: 0 }) };
  for (const y of Object.keys(rev.points)) yearKeysMap[y] = Number(y);
} else {
  const p = settings.multiYearPlans.spending[props.id] || {};
  spend.points = { ...(p.points || {}) };
  spend.ongoingLevelPct = p.ongoingLevelPct || 0;
  spend.growthDeltaPp = p.growthDeltaPp || 0;
  for (const y of Object.keys(spend.points)) yearKeysMap[y] = Number(y);
}

function renameYear(oldY, newY) {
  if (props.type === 'revenue') {
    const val = rev.points[oldY]; delete rev.points[oldY]; rev.points[newY] = val;
  } else { const val = spend.points[oldY]; delete spend.points[oldY]; spend.points[newY] = val; }
}
function delPoint(y) { if (props.type === 'revenue') delete rev.points[y]; else delete spend.points[y]; }
function addPoint() {
  if (props.type === 'revenue') {
    if (newPoint.year != null && newPoint.rate != null) rev.points[newPoint.year] = Number(newPoint.rate);
  } else {
    if (newPoint.year != null && newPoint.factor != null) spend.points[newPoint.year] = Number(newPoint.factor);
  }
}

function onClear() { settings.clearPlan(props.id, props.type); emit('close'); }
function onSave() {
  if (props.type === 'revenue') {
    settings.setRevenuePlan(props.id, { mode: rev.mode, points: rev.points, rule: rev.rule });
  } else {
    settings.setSpendingPlan(props.id, { points: spend.points, ongoingLevelPct: spend.ongoingLevelPct, growthDeltaPp: spend.growthDeltaPp });
  }
  emit('close');
}
</script>

<style scoped>
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 60; }
.modal { width: min(720px, 92vw); background: #fff; border-radius: 12px; box-shadow: 0 24px 48px rgba(0,0,0,0.2); overflow: hidden; }
.header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
.title { margin: 0; font-size: 1rem; }
.close { background: transparent; border: none; font-size: 1.4rem; cursor: pointer; }
.content { padding: 12px; display: grid; gap: 12px; }
.section { display: grid; gap: 8px; }
.field-label { font-size: .85rem; color: #6b7280; }
.row { display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 6px; align-items: center; }
input, select { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; }
.footer { display: flex; justify-content: end; gap: 8px; padding: 10px 12px; border-top: 1px solid #e5e7eb; }
.btn { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; cursor: pointer; }
.btn.primary { background: #2563eb; border-color: #2563eb; color: #fff; }
</style>

