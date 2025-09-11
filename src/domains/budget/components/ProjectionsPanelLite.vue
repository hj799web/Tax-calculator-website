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

      <!-- Debt/GDP chart (historical + projected) using Chart.js -->
      <div class="chart" aria-label="Historical and projected debt-to-GDP line chart">
        <div class="chart-title">Debt-to-GDP: Historical + Projections (%)</div>
        <div class="chart-box-tall">
          <Line :data="debtGdpChartData" :options="debtGdpChartOptions" />
        </div>
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
import annotationPlugin from 'chartjs-plugin-annotation'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, annotationPlugin)

const budget = useBudgetSimulatorStore();
const settings = useMultiYearSettingsStore();

const expanded = ref(false);
// Responsive width for the mini SVG charts
const defChartEl = ref(null);
const width = ref(520);
// height variable removed - Chart.js handles sizing
// pad variable removed - Chart.js handles spacing

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

// Historical debt-to-GDP series (%)
const historicalDebtGdp = [
  { label: '2004', value: 46.80 },
  { label: '2005', value: 46.06 },
  { label: '2006', value: 43.29 },
  { label: '2007', value: 39.16 },
  { label: '2008', value: 45.32 },
  { label: '2009', value: 53.19 },
  { label: '2010', value: 53.15 },
  { label: '2011', value: 54.12 },
  { label: '2012', value: 55.73 },
  { label: '2013', value: 53.20 },
  { label: '2014', value: 51.48 },
  { label: '2015', value: 55.99 },
  { label: '2016', value: 56.02 },
  { label: '2017', value: 54.46 },
  { label: '2018', value: 53.15 },
  { label: '2019', value: 53.36 },
  { label: '2020', value: 74.55 },
  { label: '2021', value: 70.55 },
  { label: '2022', value: 60.61 },
  { label: '2023', value: 61.34 },
];
const histDebtGdpLabels = computed(() => historicalDebtGdp.map(d => d.label));
const histDebtGdpValues = computed(() => historicalDebtGdp.map(d => d.value));

const deficitValues = computed(() => (rows.value || []).map(r => r.deficit));
const debtGdpValues = computed(() => (rows.value || []).map(r => r.debtToGDP * 100));

// Combined deficit values (historical + projected)
const combinedDefValues = computed(() => [...histDefValues.value, ...deficitValues.value]);

// Combined debt-to-GDP values (historical + projected)
const combinedDebtGdpValues = computed(() => [...histDebtGdpValues.value, ...debtGdpValues.value]);
const combinedDebtGdpLabels = computed(() => [...histDebtGdpLabels.value, ...years.value.map(y => String(y))]);

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
    borderColor: (ctx) => {
      const value = ctx.parsed?.y ?? ctx.raw;
      return value >= 0 ? '#16a34a' : '#dc2626'; // Green for surplus, red for deficit
    },
    backgroundColor: (ctx) => {
      const value = ctx.parsed?.y ?? ctx.raw;
      return value >= 0 ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)';
    },
    segment: {
      borderColor: (ctx) => {
        const current = ctx.p1.parsed.y;
        return current >= 0 ? '#16a34a' : '#dc2626'; // Green for surplus, red for deficit
      }
    },
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
      },
      annotation: {
        annotations: {
          zeroLine: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: '#6b7280',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'Balanced Budget',
              enabled: true,
              position: 'end',
              backgroundColor: 'rgba(107, 114, 128, 0.8)',
              color: 'white',
              font: { size: 10 }
            }
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          maxRotation: 45, 
          autoSkip: false, 
          color: '#374151', 
          font: { size: 11 },
          callback: function(value, index, ticks) {
            const label = this.getLabelForValue(value);
            const totalTicks = ticks.length;
            
            // Always show first and last
            if (index === 0 || index === totalTicks - 1) return label;
            
            // Show every 3rd tick for better spacing
            if (index % 3 === 0) return label;
            
            // Show key transition years (2020-21 for COVID, first projection year)
            if (label === '2020-21' || label === '2024') return label;
            
            return '';
          }
        },
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

// Chart.js dataset for debt-to-GDP (historical + projected)
const debtGdpChartData = computed(() => ({
  labels: combinedDebtGdpLabels.value,
  datasets: [{
    label: 'Debt-to-GDP Ratio',
    data: combinedDebtGdpValues.value,
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37,99,235,0.12)',
    tension: 0.35,
    cubicInterpolationMode: 'monotone',
    borderWidth: 3,
    pointRadius: 0,
    pointHoverRadius: 6,
    hitRadius: 12,
    fill: false,
  }]
}))

const debtGdpChartOptions = computed(() => {
  const { min, max } = minMax(combinedDebtGdpValues.value, 5);
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          maxRotation: 45, 
          autoSkip: false, 
          color: '#374151', 
          font: { size: 11 },
          callback: function(value, index, ticks) {
            const label = this.getLabelForValue(value);
            const totalTicks = ticks.length;
            
            // Always show first and last
            if (index === 0 || index === totalTicks - 1) return label;
            
            // Show every 3rd tick for better spacing
            if (index % 3 === 0) return label;
            
            // Show key transition years (2020 for COVID, first projection year)
            if (label === '2020' || label === '2024') return label;
            
            return '';
          }
        },
        grid: { color: 'rgba(0,0,0,0.06)' }
      },
      y: {
        title: { display: true, text: '% of GDP' },
        suggestedMin: min,
        suggestedMax: max,
        ticks: { color: '#374151', font: { size: 12 }, callback: (v) => v.toFixed(1) + "%" },
        grid: { color: 'rgba(0,0,0,0.06)' }
      }
    }
  }
})

// SVG-related computeds removed - now using Chart.js

// generateTicks function removed - Chart.js handles tick generation

// (Deficit Chart.js) labels for tooltip/use
// const defXTickLabels = computed(() => [...histDefLabels.value, ...years.value.map(y => String(y))]);

// makeTickIndices function removed - Chart.js handles tick positioning

// Responsive tick density computeds removed - Chart.js handles responsive ticks

// SVG tick computeds removed - Chart.js handles axes

// linePoints function removed - Chart.js handles rendering

// lastPoint function removed - Chart.js handles rendering

// yFor and yForPct functions removed - Chart.js handles positioning

// SVG drawing functions removed - Chart.js handles rendering

// function fmtB(n) { return `${Number(n || 0).toFixed(1)}B`; }

function exportCsv() {
  const data = rows.value || [];
  const headers = ['Year','GDP','Total Revenue','Program Spend','Interest','Total Spend','Deficit','Debt','Debt/GDP'];
  const csv = [headers.join(',')]
    .concat(
      data.map(r => [
        r.year,
        r.gdp.toFixed(1),
        r.revenueTotal.toFixed(1),
        r.programSpending.toFixed(1),
        r.interest.toFixed(1),
        r.spendingTotal.toFixed(1),
        r.deficit.toFixed(1),
        r.debt.toFixed(1),
        (r.debtToGDP * 100).toFixed(1)
      ].join(','))
    ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'budget_projections.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

</script>

<style scoped>
.proj-lite { display: grid; gap: 12px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; }
.panel-header h4 { margin: 0; font-size: .95rem; color: #111827; }
.actions { display: flex; gap: 8px; }

.btn {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
  border-color: #2563eb;
}

.btn:hover::before {
  left: 100%;
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn:disabled {
  background: #6b7280;
  border-color: #6b7280;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

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