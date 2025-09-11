<template>
  <div v-if="show" class="modal-backdrop" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="header">
        <h3>Budget Simulator: {{ year }}</h3>
        <button class="icon-btn" @click="emit('close')" aria-label="Close">&times;</button>
      </div>

      <div v-if="!baselineRow" class="body empty">No baseline data for {{ year }}.</div>

      <div v-else class="body">
        <section class="metrics">
          <div class="metric">
            <div class="label">GDP</div>
            <div class="value">{{ fmt(baselineRow.gdp) }}</div>
          </div>
          <div class="metric">
            <div class="label">Revenue</div>
            <div class="value">{{ fmt(adjusted.revenueTotal) }}</div>
          </div>
          <div class="metric">
            <div class="label">Spending</div>
            <div class="value">{{ fmt(adjusted.spendingTotal) }}</div>
          </div>
          <div class="metric" :class="{ pos: adjusted.deficit >= 0, neg: adjusted.deficit < 0 }">
            <div class="label">Surplus/Deficit</div>
            <div class="value">{{ fmt(adjusted.deficit) }}</div>
          </div>
          <div class="metric">
            <div class="label">Debt</div>
            <div class="value">{{ fmt(adjusted.debt) }}</div>
          </div>
          <div class="metric">
            <div class="label">Debt/GDP</div>
            <div class="value">{{ (adjusted.debtToGDP * 100).toFixed(1) }}%</div>
          </div>
        </section>

        <section class="controls">
          <div class="col">
            <h4>Revenue Adjustments</h4>
            <div class="list">
              <div v-for="(amt, key) in baselineRow.revenueBySource" :key="key" class="row">
                <div class="k">{{ prettyKey(key) }}</div>
                <div class="v">{{ fmt(amt) }}</div>
                <input type="range" min="-20" max="20" step="0.5"
                       v-model.number="overlay.revenuePct[key]"
                       @input="updateRevenue(key, overlay.revenuePct[key])"/>
                <div class="pct">{{ (overlay.revenuePct[key] || 0) }}%</div>
              </div>
            </div>
          </div>
          <div class="col">
            <h4>Spending Adjustments</h4>
            <div class="list">
              <div v-for="(amt, key) in baselineRow.spendingByCategory" :key="key" class="row">
                <div class="k">{{ prettyKey(key) }}</div>
                <div class="v">{{ fmt(amt) }}</div>
                <input type="range" min="-20" max="20" step="0.5"
                       v-model.number="overlay.spendingPct[key]"
                       @input="updateSpending(key, overlay.spendingPct[key])"/>
                <div class="pct">{{ (overlay.spendingPct[key] || 0) }}%</div>
              </div>
            </div>
          </div>
        </section>

        <section class="actions">
          <input class="name-input" type="text" v-model="scenarioName" placeholder="Scenario name (optional)"/>
          <div class="spacer"></div>
          <button class="btn" @click="reset">Reset</button>
          <button class="btn primary" @click="save">Save Scenario</button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, ref } from 'vue';
import { useYearSimulationStore } from '@/domains/budget/store/yearSimulation.js';

const props = defineProps({
  show: { type: Boolean, default: false },
  year: { type: Number, required: false },
  baselineRow: { type: Object, required: false },
});

const emit = defineEmits(['close']);
const sim = useYearSimulationStore();
const scenarioName = ref('');

const overlay = reactive({ revenuePct: {}, spendingPct: {} });

watch(() => props.year, (y) => {
  if (!y) return;
  const ov = sim.getOverlay(y);
  overlay.revenuePct = { ...ov.revenuePct };
  overlay.spendingPct = { ...ov.spendingPct };
}, { immediate: true });

function updateRevenue(k, v) {
  sim.setRevenueDelta(props.year, k, v);
}
function updateSpending(k, v) {
  sim.setSpendingDelta(props.year, k, v);
}

const adjusted = computed(() => {
  const base = props.baselineRow;
  if (!base) return { revenueTotal: 0, spendingTotal: 0, deficit: 0, debt: 0, debtToGDP: 0 };

  // Adjusted revenue
  let revTotal = 0;
  for (const [k, amt] of Object.entries(base.revenueBySource || {})) {
    const pct = Number(overlay.revenuePct?.[k] || 0) / 100;
    revTotal += Number(amt || 0) * (1 + pct);
  }

  // Adjusted program spending
  let progSpend = 0;
  for (const [k, amt] of Object.entries(base.spendingByCategory || {})) {
    const pct = Number(overlay.spendingPct?.[k] || 0) / 100;
    progSpend += Number(amt || 0) * (1 + pct);
  }

  // Keep interest from baseline for this year context
  const interest = Number(base.interest || 0);
  const spendingTotal = progSpend + interest;
  const deficit = revTotal - spendingTotal;

  // Recompute debt using baseline BOP debt (approx as debt - baseline deficit)
  const debtBop = Number(base.debt || 0) - Number(base.deficit || 0);
  const debt = debtBop + deficit;
  const debtToGDP = base.gdp ? (debt / Number(base.gdp)) : 0;

  return {
    revenueTotal: round2(revTotal),
    programSpending: round2(progSpend),
    interest: round2(interest),
    spendingTotal: round2(spendingTotal),
    deficit: round2(deficit),
    debt: round2(debt),
    debtToGDP: round4(debtToGDP),
  };
});

function reset() {
  sim.resetYear(props.year);
  overlay.revenuePct = {};
  overlay.spendingPct = {};
}

function save() {
  sim.saveScenario(props.year, scenarioName.value || undefined);
  scenarioName.value = '';
}

function fmt(n) { return `$${Number(n || 0).toFixed(1)}B`; }
function prettyKey(k) { return String(k).replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()); }
function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
function round4(n) { return Math.round((Number(n) + Number.EPSILON) * 10000) / 10000; }
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: grid; place-items: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; width: min(1100px, 96vw); max-height: 90vh; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); display: grid; grid-template-rows: auto 1fr; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
.icon-btn { background: none; border: 1px solid #e5e7eb; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }
.body { padding: 12px; overflow: auto; display: grid; gap: 12px; }
.body.empty { padding: 24px; color: #6b7280; }

.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; }
.metric { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; display: grid; gap: 4px; }
.metric .label { font-size: 0.8rem; color: #6b7280; }
.metric .value { font-weight: 700; color: #111827; }
.metric.pos .value { color: #047857; }
.metric.neg .value { color: #b91c1c; }

.controls { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start; }
.controls .col { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; }
.controls h4 { margin: 0 0 8px 0; font-size: 0.95rem; color: #374151; }
.list { display: grid; gap: 8px; max-height: 48vh; overflow-y: auto; padding-right: 6px; }
.row { display: grid; grid-template-columns: 1.2fr 0.8fr 1fr auto; gap: 8px; align-items: center; }
.row .k { font-size: 0.85rem; color: #374151; }
.row .v { font-size: 0.85rem; color: #6b7280; text-align: right; }
.row input[type='range'] { width: 100%; }
.row .pct { width: 52px; text-align: right; font-variant-numeric: tabular-nums; }

.actions { display: flex; align-items: center; gap: 8px; border-top: 1px solid #e5e7eb; padding-top: 8px; }
.actions .spacer { flex: 1; }
.name-input { min-width: 220px; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; }

.btn { padding: 8px 16px; border: 1px solid #3b82f6; border-radius: 8px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); color: #374151; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(107,114,128,0.15); }
.btn.primary { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #fff; }

@media (max-width: 900px) {
  .controls { grid-template-columns: 1fr; }
}
</style>
