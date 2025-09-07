<template>
  <div class="proj-lite">
    <div class="panel-header">
      <h4>Projections</h4>
      <div class="actions">
        <button class="btn" @click="expanded = !expanded">{{ expanded ? 'Hide Table' : 'Expand Table' }}</button>
        <button class="btn" @click="exportCsv" :disabled="rows.length === 0">Export CSV</button>
      </div>
    </div>
    <!-- Interactive multi-series line chart -->
    <div class="interactive-chart">
      <div class="chart-box">
        <Line :data="lineData" :options="lineOptions" />
      </div>
    </div>
    <div class="mini-charts">
      <!-- Deficit chart (historical + projected) using Chart.js for clarity & tooltips -->
      <div class="chart" aria-label="Historical and projected deficit line chart" ref="defChartEl">
        <div class="chart-title">Deficit: Historical + Projections</div>
        <div class="chart-box-tall">
          <Line :data="defChartData" :options="defChartOptions" />
        </div>
      </div>

      <!-- Debt/GDP chart -->
      <div class="chart" aria-label="Projected debt-to-GDP line chart">
        <div class="chart-title">Debt-to-GDP (%)</div>
        <svg :width="width" :height="height" role="img">
          <!-- axes -->
          <line :x1="pad" :y1="height - pad" :x2="width - pad" :y2="height - pad" class="axis" />
          <line :x1="pad" :y1="pad" :x2="pad" :y2="height - pad" class="axis" />
          <!-- Y ticks + horizontal gridlines -->
          <template v-for="t in pctYTicks" :key="`py-${t}`">
            <line :x1="pad" :x2="width - pad" :y1="yForPct(t)" :y2="yForPct(t)" class="grid" />
            <line :x1="pad-4" :x2="pad" :y1="yForPct(t)" :y2="yForPct(t)" class="axis" />
            <text class="tick y" :x="pad - 6" :y="yForPct(t) + 3" text-anchor="end">{{ t.toFixed(1) }}%</text>
          </template>
          <!-- X ticks (years for projections) + vertical gridlines -->
          <template v-for="i in gdpXTickIndices" :key="`gx-${i}`">
            <line :x1="xForIndex(i, years.length)" :x2="xForIndex(i, years.length)" :y1="pad" :y2="height - pad" class="grid" />
            <line :x1="xForIndex(i, years.length)" :x2="xForIndex(i, years.length)" :y1="height - pad" :y2="height - pad + 4" class="axis" />
            <text class="tick x" :x="xForIndex(i, years.length)" :y="height - 2" text-anchor="middle">{{ years[i] }}</text>
          </template>

          <!-- data line -->
          <polyline :points="debtGdpPoints" fill="none" stroke="#2563eb" stroke-width="2" />
          <!-- last point marker and value -->
          <circle :cx="lastDebtGdpPoint.x" :cy="lastDebtGdpPoint.y" r="3" fill="#2563eb" />
                    <!-- axis titles -->
          <text class="axis-title x" :x="(width/2)" :y="height" text-anchor="middle">Years</text>
          <text class="axis-title y" :x="0" :y="height/2" :transform="`rotate(-90, 0, 0) translate(-${height/2}, 16)`">% of GDP</text>
        </svg>
      </div>
    </div>
    <div v-if="expanded" class="table-wrap">
      <MultiYearProjectionsPanel />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { makeBaseSnapshotFromStore } from '@/domains/budget/utils/projectionAdapters.js';
import { projectAll } from '@/domains/budget/utils/projections.js';
import MultiYearProjectionsPanel from '@/domains/budget/components/MultiYearProjectionsPanel.vue';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const budget = useBudgetSimulatorStore();
const settings = useMultiYearSettingsStore();

const expanded = ref(false);
// Responsive width for the mini SVG charts
const defChartEl = ref(null);
const width = ref(520);
const height = 260;
const pad = 32;

// Throttled width updates to avoid ResizeObserver loop warnings
let lastWidth = 0;
let rafId = 0;

function updateMiniChartWidth() {
  try {
    const el = defChartEl.value;
    if (!el) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const w = el.clientWidth || 520;
      const next = Math.max(320, Math.floor(w - 16)); // subtract padding
      if (Math.abs(next - lastWidth) > 2) {
        lastWidth = next;
        width.value = next;
      }
    });
  } catch (e) {
    // Non-fatal: some browsers fire ResizeObserver during layout; ignore
  }
}

let ro;
onMounted(async () => {
  await nextTick();
  updateMiniChartWidth();
  try {
    ro = new ResizeObserver(() => updateMiniChartWidth());
    if (defChartEl.value) ro.observe(defChartEl.value);
  } catch (e) {
    console.debug('[ProjectionsPanelLite] ResizeObserver not available', e);
  }
  try {
    window.addEventListener('resize', updateMiniChartWidth);
  } catch (e) {
    console.debug('[ProjectionsPanelLite] Failed to add resize listener', e);
  }
});
onUnmounted(() => {
  try { if (ro && defChartEl.value) ro.unobserve(defChartEl.value); } catch (e) {
    console.debug('[ProjectionsPanelLite] Failed to unobserve', e);
  }
  try { if (ro) ro.disconnect(); } catch (e) {
    console.debug('[ProjectionsPanelLite] Failed to disconnect observer', e);
  }
  try { window.removeEventListener('resize', updateMiniChartWidth); } catch (e) {
    console.debug('[ProjectionsPanelLite] Failed to remove resize listener', e);
  }
  try { 
    cancelAnimationFrame(rafId); 
  } catch (_) {
    // Ignore cancellation errors for cleanup safety
  }
});

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

// Interactive chart data & options
const labels = computed(() => (rows.value || []).map(r => r.year))
function fmtBillions(n){ return `$${Number(n||0).toFixed(1)}B` }
const lineData = computed(() => ({
  labels: labels.value,
  datasets: [
    { label: 'Revenue', data: (rows.value || []).map(r => r.revenueTotal), borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.15)', tension: 0.25, borderWidth: 2, fill: false, pointRadius: 2 },
    { label: 'Program Spending', data: (rows.value || []).map(r => r.programSpending), borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.15)', tension: 0.25, borderWidth: 2, fill: false, pointRadius: 2 },
    { label: 'Interest', data: (rows.value || []).map(r => r.interest), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.15)', tension: 0.25, borderWidth: 2, fill: false, pointRadius: 2 },
    { label: 'Deficit', data: (rows.value || []).map(r => r.deficit), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)', tension: 0.25, borderWidth: 2, fill: true, pointRadius: 2 },
  ]
}))

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'nearest', intersect: false },
  plugins: {
    title: { display: true, text: 'Fiscal Projections (Billions $)', color: '#111827', font: { size: 16, weight: '700' } },
    legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } },
    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtBillions(ctx.parsed.y)}` } }
  },
  scales: {
    x: { title: { display: true, text: 'Year' } },
    y: { title: { display: true, text: 'Billions ($)' }, ticks: { callback: (v) => "$" + v + "B" } }
  }
}

const years = computed(() => (rows.value || []).map(r => r.year));

// Historical deficit series (C$ Billions)
const historicalDeficits = [
  { label: '2004-05', value: 1.5 },
  { label: '2005-06', value: 13.2 },
  { label: '2006-07', value: 13.8 },
  { label: '2007-08', value: 9.6 },
  { label: '2008-09', value: -9.1 },
  { label: '2009-10', value: -56.4 },
  { label: '2010-11', value: -35.0 },
  { label: '2011-12', value: -28.0 },
  { label: '2012-13', value: -21.3 },
  { label: '2013-14', value: -8.1 },
  { label: '2014-15', value: -0.6 },
  { label: '2015-16', value: -2.9 },
  { label: '2016-17', value: -19.0 },
  { label: '2017-18', value: -19.0 },
  { label: '2018-19', value: -14.0 },
  { label: '2019-20', value: -39.4 },
  { label: '2020-21', value: -327.7 },
  { label: '2021-22', value: -90.3 },
  { label: '2022-23', value: -35.3 },
  { label: '2023-24', value: -61.9 },
];
const histDefLabels = computed(() => historicalDeficits.map(d => d.label));
const histDefValues = computed(() => historicalDeficits.map(d => d.value));

const deficitValues = computed(() => (rows.value || []).map(r => r.deficit));
const debtGdpValues = computed(() => (rows.value || []).map(r => r.debtToGDP * 100));

// Combined deficit values (historical + projected)
const combinedDefValues = computed(() => [...histDefValues.value, ...deficitValues.value]);

// Stats helpers are not used in Chart.js rendering; omit to satisfy lint

// X labels for deficit chart timeline
const combinedDefLabels = computed(() => [...histDefLabels.value, ...years.value.map(y => String(y))]);

// Chart.js dataset for deficit (historical + projected)
function minMax(arr, pad = 5) {
  if (!arr || !arr.length) return { min: -1, max: 1 };
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  return { min: mn - pad, max: mx + pad };
}
const defChartData = computed(() => ({
  labels: combinedDefLabels.value,
  datasets: [{
    label: 'Surplus / Deficit',
    data: combinedDefValues.value,
    borderColor: '#dc2626',
    backgroundColor: 'rgba(220,38,38,0.12)',
    tension: 0.35,
    cubicInterpolationMode: 'monotone',
    borderWidth: 3,
    pointRadius: 0,
    pointHoverRadius: 6,
    hitRadius: 12,
    fill: false,
  }]
}))
const defChartOptions = computed(() => {
  const { min, max } = minMax(combinedDefValues.value, 8);
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${fmtBillions(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 16, color: '#374151', font: { size: 12 } },
        grid: { color: 'rgba(0,0,0,0.06)' }
      },
      y: {
        title: { display: true, text: 'Billions ($)' },
        suggestedMin: min,
        suggestedMax: max,
        ticks: { color: '#374151', font: { size: 12 }, callback: (v) => "$" + v + "B" },
        grid: { color: 'rgba(0,0,0,0.06)' }
      }
    }
  }
})

const debtGdpPoints = computed(() => linePoints(debtGdpValues.value));

// const debtGdpStats = computed(() => stats(debtGdpValues.value));

const lastDebtGdpPoint = computed(() => lastPoint(debtGdpValues.value));

// Axis tick helpers and x positions
function generateTicks(min, max, count = 7) {
  const span = (max - min) || 1;
  const out = [];
  for (let i = 0; i < count; i++) out.push(min + (span * i) / (count - 1));
  return out;
}
function xForIndex(i, total) {
  if (!total || total < 2) return pad;
  return pad + (i / (total - 1)) * (width.value - pad * 2);
}

// (Deficit Chart.js) labels for tooltip/use
// const defXTickLabels = computed(() => [...histDefLabels.value, ...years.value.map(y => String(y))]);

function makeTickIndices(total, desired = 8) {
  if (!total || total < 2) return [];
  const count = Math.min(desired, total);
  const step = (total - 1) / (count - 1);
  const idx = [];
  for (let i = 0; i < count; i++) idx.push(Math.round(i * step));
  return Array.from(new Set(idx));
}

// Responsive tick density based on chart width
const desiredXAxisTicks = computed(() => {
  const w = width.value || 520;
  if (w >= 900) return 12;
  if (w >= 700) return 10;
  if (w >= 520) return 8;
  if (w >= 380) return 6;
  return 4;
});
const desiredYTicks = computed(() => {
  const h = height || 180;
  if (h >= 220) return 9;
  if (h >= 180) return 7;
  return 5;
});

// No SVG ticks for deficit now (Chart.js handles axes)
const pctYTicks = computed(() => {
  const min = Math.min(...debtGdpValues.value);
  const max = Math.max(...debtGdpValues.value);
  return generateTicks(min, max, desiredYTicks.value);
});
const gdpXTickIndices = computed(() => makeTickIndices(years.value.length, desiredXAxisTicks.value));

function linePoints(values) {
  if (!values || values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width.value - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');
}



function lastPoint(values) {
  if (!values || values.length === 0) return { x: pad, y: height - pad };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const i = values.length - 1;
  const x = pad + (i / (values.length - 1)) * (width.value - pad * 2);
  const y = pad + (1 - (values[i] - min) / span) * (height - pad * 2);
  return { x, y };
}

function yFor(v, values = deficitValues.value) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return pad + (1 - (v - min) / span) * (height - pad * 2);
}

function yForPct(v) { return yFor(v, debtGdpValues.value); }

// function fmtB(n) { return `${Number(n || 0).toFixed(1)}B`; }

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
  a.download = `multi_year_projections_${settings.planning.baseYear}_${settings.planning.horizonYears}y.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function num(n) { return Number(n || 0).toFixed(2); }
</script>

<style scoped>
.proj-lite { display: grid; gap: 12px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; }
.panel-header h4 { margin: 0; font-size: .95rem; color: #111827; }
.actions { display: flex; gap: 8px; }
.btn { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 10px; background: #f3f4f6; cursor: pointer; }
.interactive-chart { background: #fff; border: 1px solid #eef2f7; border-radius: 10px; padding: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.chart-box { height: 420px; }
.chart-box-tall { height: 520px; }

.mini-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.chart { background: #fff; border: 1px solid #eef2f7; border-radius: 10px; padding: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.chart-title { font-size: .95rem; color: #111827; margin-bottom: 4px; font-weight: 800; }
.label { font-size: .85rem; color: #111827; margin-bottom: 4px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.legend { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.legend-row { display: flex; gap: 12px; align-items: center; color: #6b7280; font-size: 12px; margin: 2px 0 6px; }
.swatch { width: 12px; height: 3px; display: inline-block; border-radius: 2px; margin-right: 6px; background: #6b7280; }
.swatch.proj { background: #ef4444; }
.swatch.hist { background: #6b7280; }
.axis { stroke: #e5e7eb; stroke-width: 1; }
.grid { stroke: #e5e7eb; stroke-width: 1; opacity: 0.5; }
.tick { font-size: 10px; fill: #6b7280; }
.axis-title { font-size: 10px; fill: #6b7280; }
.point-label { font-size: 10px; fill: #111827; font-weight: 600; }
.table-wrap { border-top: 1px solid #e5e7eb; padding-top: 8px; max-height: 40vh; overflow: auto; }
</style>










