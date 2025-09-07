<template>
  <div class="planner">
    <header class="summary">
      <div class="row">
        <label>Preview year</label>
        <input type="number" v-model.number="previewYear" :min="planning.baseYear" :max="planning.baseYear + planning.horizonYears - 1" />
      </div>
      <div class="kpis" v-if="row">
        <div class="kpi"><span>Revenue</span><strong>{{ fmtB(row.revenueTotal) }}</strong></div>
        <div class="kpi"><span>Program</span><strong>{{ fmtB(row.programSpending) }}</strong></div>
        <div class="kpi"><span>Interest</span><strong>{{ fmtB(row.interest) }}</strong></div>
        <div class="kpi"><span>Deficit</span><strong :class="{neg: row.deficit>0, pos: row.deficit<=0}">{{ fmtB(row.deficit) }}</strong></div>
        <div class="kpi"><span>Debt/GDP</span><strong>{{ (row.debtToGDP*100).toFixed(1) }}%</strong></div>
      </div>
    </header>

    <nav class="tabs">
      <button :class="{active: tab==='assumptions'}" @click="tab='assumptions'">Assumptions</button>
      <button :class="{active: tab==='projections'}" @click="tab='projections'">Projections</button>
      <button :class="{active: tab==='items'}" @click="tab='items'">Items</button>
    </nav>

    <section class="tab-body">
      <AssumptionsPanel v-if="tab==='assumptions'" />
      <ProjectionsPanelLite v-else-if="tab==='projections'" />
      <ItemsPlanList v-else @open-plan="openPlan" />
    </section>

    <footer class="apply-bar">
      <button class="btn primary" @click="apply">Apply Preview Year</button>
      <label class="toggle"><input type="checkbox" v-model="liveSync" /> Live sync</label>
    </footer>

    <MultiYearItemPlanModal
      v-if="modal.open"
      :type="modal.type"
      :id="modal.id"
      :year="previewYear"
      @close="modal.open = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { makeBaseSnapshotFromStore } from '@/domains/budget/utils/projectionAdapters.js';
import { projectAll } from '@/domains/budget/utils/projections.js';
import { applyPlanForYear } from '@/domains/budget/utils/applyMultiYearPlan.js';
import AssumptionsPanel from '@/domains/budget/components/AssumptionsPanel.vue';
import ProjectionsPanelLite from '@/domains/budget/components/ProjectionsPanelLite.vue';
import ItemsPlanList from '@/domains/budget/components/ItemsPlanList.vue';
import MultiYearItemPlanModal from '@/domains/budget/components/MultiYearItemPlanModal.vue';

const budget = useBudgetSimulatorStore();
const settings = useMultiYearSettingsStore();

const planning = computed(() => settings.planning);
const previewYear = ref(settings.planning.baseYear);
const tab = ref('assumptions');
const liveSync = ref(false);

const rows = computed(() => {
  const base = makeBaseSnapshotFromStore(budget);
  return projectAll({ base, settings: {
    planning: settings.planning,
    economic: settings.economic,
    revenueElasticity: settings.revenueElasticity,
    spendingGrowth: settings.spendingGrowth,
    categoryUserDelta: settings.categoryUserDelta,
  }});
});
const row = computed(() => rows.value.find(r => r.year === previewYear.value));

function fmtB(n) { return `$${Number(n||0).toFixed(1)}B`; }

async function apply() { await applyPlanForYear(previewYear.value); }

let t;
watch([previewYear, liveSync], async ([y, on]) => {
  if (!on) return;
  clearTimeout(t);
  t = setTimeout(() => applyPlanForYear(y), 250);
});

const modal = ref({ open: false, type: 'revenue', id: null });
function openPlan(type, id) { modal.value = { open: true, type, id }; }
</script>

<style scoped>
.planner { display: grid; grid-template-rows: auto auto 1fr auto; row-gap: 10px; min-height: 0; height: 100%; }
.summary { position: sticky; top: 0; z-index: 1; padding-bottom: 4px; background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7)); backdrop-filter: blur(6px); }
.summary .row { display: grid; gap: 6px; grid-template-columns: 1fr; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(112px, 1fr)); gap: 8px; }
.kpi { background: #fff; border: 1px solid #eef2f7; border-radius: 10px; padding: 10px 8px; display: grid; gap: 2px; text-align: left; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.kpi span { font-size: .76rem; color: #6b7280; }
.kpi strong { font-size: 0.98rem; color: #111827; }
.neg { color: #dc2626; } .pos { color: #047857; }
.tabs { display: flex; gap: 6px; border-bottom: 1px solid #e5e7eb; position: sticky; top: 64px; background: rgba(255,255,255,0.8); z-index: 1; backdrop-filter: blur(6px); }
.tabs button { padding: 8px 10px; font-weight: 600; border: 1px solid transparent; border-radius: 8px 8px 0 0; background: transparent; color: #374151; cursor: pointer; }
.tabs button.active { border-color: #e5e7eb; background: #fff; color: #111827; }
.tab-body { min-height: 0; height: 100%; overflow: auto; padding-right: 4px; }
.apply-bar { position: sticky; bottom: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 8px; background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.8)); border-top: 1px solid #e5e7eb; backdrop-filter: blur(6px); }
.btn { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 10px; background: #f3f4f6; cursor: pointer; font-weight: 600; }
.btn.primary { background: #2563eb; border-color: #2563eb; color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,.25); }
.toggle { display: flex; align-items: center; gap: 8px; }
label { font-size: .85rem; color: #6b7280; }
input, select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; width: 100%; }
</style>
