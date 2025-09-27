<template>
  <div class="proj-lite">
    <div class="panel-header">
      <h4>{{ t('projectionsPanel.title', 'Projections') }}</h4>
    </div>

    <details v-if="showControls" class="planning-controls" open>
      <summary>{{ t('projectionsPanel.planningControls', 'Planning Controls') }}</summary>
      <div class="controls-grid">
        <div class="row">
          <label :title="t('projectionsPanel.programSpendingBoostTooltip', 'One-time adjustment to all program spending levels')">{{ t('projectionsPanel.programSpendingBoost', 'Program spending boost (%)') }}
            <span class="info-icon" :title="t('projectionsPanel.programSpendingBoostTooltip', 'Applies a one-time level change to program spending in the base year (and carried through).')">info</span>
          </label>
          <input
            type="number"
            step="0.5"
            :min="-15"
            :max="15"
            v-model.number="settings.spendingGlobal.levelPct"
            @change="clampGlobal()"
          />
        </div>
        <div class="row">
          <label :title="t('projectionsPanel.speedUpSpendingGrowthTooltip', 'Adjusts how fast program spending grows each year. +0.5 means all categories grow 0.5 percentage points faster annually.')">{{ t('projectionsPanel.speedUpSpendingGrowth', 'Speed up spending growth (pp)') }}
            <span class="info-icon" :title="t('projectionsPanel.speedUpSpendingGrowthTooltip', 'Adds or subtracts percentage points to the annual growth rate applied to all categories.')">info</span>
          </label>
          <input
            type="number"
            step="0.1"
            v-model.number="settings.spendingGlobal.growthDeltaPct"
            @change="clampGlobal()"
          />
        </div>
      </div>
      <SpendingGrowthControls />
    </details>
    <!-- Interactive multi-series line chart -->
    <div class="interactive-chart">
      <div class="chart-box">
        <Line :data="lineData" :options="lineOptions" />
      </div>
    </div>
    <div class="mini-charts">
      <!-- Deficit chart (historical + projected) using Chart.js for clarity & tooltips -->
      <div class="chart" :aria-label="t('projectionsPanel.charts.deficitChartAria', 'Historical and projected deficit line chart')" ref="defChartEl">
        <div class="chart-title">{{ t('projectionsPanel.charts.deficitChartTitle', 'Deficit: Historical + Projections') }}</div>
        <div class="chart-box-tall">
          <Line :data="defChartData" :options="defChartOptions" />
        </div>
      </div>

      <!-- Debt/GDP chart (historical + projected) using Chart.js -->
      <div class="chart" :aria-label="t('projectionsPanel.charts.debtGdpChartAria', 'Historical and projected debt-to-GDP line chart')">
        <div class="chart-title">{{ t('projectionsPanel.charts.debtGdpChartTitle', 'Debt-to-GDP: Historical + Projections (%)') }}</div>
        <div class="chart-box-tall">
          <Line :data="debtGdpChartData" :options="debtGdpChartOptions" />
        </div>
      </div>
    </div>
    <!-- Removed nested projections table to avoid duplication -->
  </div>
</template>

<script setup>
defineProps({ showControls: { type: Boolean, default: true } });
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { makeBaseSnapshotFromStore } from '@/domains/budget/utils/projectionAdapters.js';
import { useI18n } from '@/i18n';

const { t } = useI18n();
import { projectAll } from '@/domains/budget/utils/projections.js';
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import SpendingGrowthControls from '@/domains/budget/components/SpendingGrowthControls.vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, annotationPlugin)

const budget = useBudgetSimulatorStore();
const settings = useMultiYearSettingsStore();

// Nested table removed; keep charts focused here
// Responsive width for the mini SVG charts
const defChartEl = ref(null);
const width = ref(520);
// height variable removed - Chart.js handles sizing

// ResizeObserver for responsive chart sizing
let resizeObserver = null;

onMounted(() => {
  if (typeof window !== 'undefined' && defChartEl.value) {
    try {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(defChartEl.value);
    } catch (_) {
      // Ignore resize errors in SSR/test environments
    }
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    try {
      resizeObserver.disconnect();
    } catch (_) {
      // Ignore cancellation errors for cleanup safety
    }
  }
});

function handleResize() {
  if (defChartEl.value) {
    width.value = defChartEl.value.clientWidth;
  }
}

// Historical deficit data (2004-05 to 2023-24)
const historicalDeficitData = [
  { year: '2004-05', value: 1.5 },
  { year: '2005-06', value: 13.2 },
  { year: '2006-07', value: 13.8 },
  { year: '2007-08', value: 9.6 },
  { year: '2008-09', value: -9.1 },
  { year: '2009-10', value: -56.4 },
  { year: '2010-11', value: -35.0 },
  { year: '2011-12', value: -28.0 },
  { year: '2012-13', value: -21.3 },
  { year: '2013-14', value: -8.1 },
  { year: '2014-15', value: -0.6 },
  { year: '2015-16', value: -2.9 },
  { year: '2016-17', value: -19.0 },
  { year: '2017-18', value: -19.0 },
  { year: '2018-19', value: -14.0 },
  { year: '2019-20', value: -39.4 },
  { year: '2020-21', value: -327.7 },
  { year: '2021-22', value: -90.3 },
  { year: '2022-23', value: -35.3 },
  { year: '2023-24', value: -61.9 },
];

const rows = computed(() => {
  const base = makeBaseSnapshotFromStore(budget);
  const projectionSettings = {
    planning: settings.planning,
    economic: settings.economic,
    revenueElasticity: settings.revenueElasticity,
    spendingGrowth: settings.spendingGrowth,
    categoryUserDelta: settings.categoryUserDelta,
    spendingGlobal: settings.spendingGlobal,
    yearOverrides: settings.yearOverrides,
  };
  return projectAll({ base, settings: projectionSettings });
});

// Multi-series line chart data
const lineData = computed(() => {
  const labels = rows.value.map(r => r.year.toString());
  return {
    labels,
  datasets: [
      {
        label: 'Revenue',
        data: rows.value.map(r => r.revenueTotal),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Program Spending',
        data: rows.value.map(r => r.programSpending),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Interest',
        data: rows.value.map(r => r.interest),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Deficit',
        data: rows.value.map(r => r.deficit),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };
});

const lineOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Multi-Year Fiscal Projections',
      font: { size: 16, weight: 'bold' },
    },
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: $${value.toFixed(1)}B`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Year',
      },
      grid: {
        color: 'rgba(0,0,0,0.06)',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Billions ($)',
      },
      grid: {
        color: 'rgba(0,0,0,0.06)',
      },
      ticks: {
        callback: (value) => `$${value}B`,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
}));

// Deficit chart data (historical + projected)
const defChartData = computed(() => {
  const historicalLabels = historicalDeficitData.map(d => d.year);
  const projectedLabels = rows.value.map(r => r.year.toString());
  const allLabels = [...historicalLabels, ...projectedLabels];
  
  const historicalValues = historicalDeficitData.map(d => d.value);
  const projectedValues = rows.value.map(r => r.deficit);
  
  // Create separate datasets for historical vs projected
  const historicalData = [...historicalValues, ...new Array(projectedValues.length).fill(null)];
  const projectedData = [...new Array(historicalValues.length).fill(null), ...projectedValues];
  
  return {
    labels: allLabels,
    datasets: [
      {
        label: 'Historical',
        data: historicalData,
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Projected',
        data: projectedData,
        borderColor: (ctx) => {
          const value = ctx.parsed?.y;
          return value >= 0 ? '#10b981' : '#ef4444'; // Green for surplus, red for deficit
        },
        backgroundColor: (ctx) => {
          const value = ctx.parsed?.y;
          return value >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        },
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
});

const defChartOptions = computed(() => {
  const allValues = [
    ...historicalDeficitData.map(d => d.value),
    ...rows.value.map(r => r.deficit)
  ];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const padding = (max - min) * 0.1;
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Deficit: Historical + Projections',
        font: { size: 14, weight: 'bold' },
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed?.y;
            if (value === null) return null;
            const sign = value >= 0 ? '+' : '';
            return `${label}: ${sign}$${value.toFixed(1)}B`;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: '#374151',
            borderWidth: 2,
            borderDash: [3, 3],
            label: {
              content: 'Balanced Budget',
              enabled: true,
              position: 'end',
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
        },
        ticks: {
          maxTicksLimit: Math.max(4, Math.floor(width.value / 80)),
        },
      },
      y: {
        title: {
          display: true,
          text: 'Billions ($)',
        },
        suggestedMin: min - padding,
        suggestedMax: max + padding,
        ticks: {
          callback: (v) => `$${v}B`,
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };
});

// Debt-to-GDP chart data
const debtGdpChartData = computed(() => {
  const labels = rows.value.map(r => r.year.toString());
  return {
    labels,
    datasets: [
      {
        label: 'Debt-to-GDP',
        data: rows.value.map(r => r.debtToGDP * 100),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: false,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
});

const debtGdpChartOptions = computed(() => {
  const values = rows.value.map(r => r.debtToGDP * 100);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Debt-to-GDP: Historical + Projections (%)',
        font: { size: 14, weight: 'bold' },
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `Debt-to-GDP: ${value.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
        },
        ticks: {
          maxTicksLimit: Math.max(4, Math.floor(width.value / 80)),
        },
      },
      y: {
        title: {
          display: true,
          text: '% of GDP',
        },
        suggestedMin: Math.max(0, min - padding),
        suggestedMax: max + padding,
        ticks: {
          callback: (v) => `${v}%`,
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };
});

function clampGlobal() {
  settings.spendingGlobal.levelPct = Math.max(-15, Math.min(15, Number(settings.spendingGlobal.levelPct || 0)));
  settings.spendingGlobal.growthDeltaPct = Number(settings.spendingGlobal.growthDeltaPct || 0);
}
</script>

<style scoped>
.proj-lite { display: grid; gap: 16px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.panel-header h4 { margin: 0; font-size: 1.125rem; color: #111827; }
.actions { display: flex; gap: 8px; }

.btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.interactive-chart {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.chart-box {
  height: clamp(300px, 25vh, 500px);
  position: relative;
}

.mini-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.chart {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
}

.chart-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  text-align: center;
}

.chart-box-tall {
  height: clamp(200px, 20vh, 350px);
  position: relative;
}

.table-wrap {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

details.planning-controls { border: 1px solid #e5e7eb; border-radius: 8px; background: #fafbff; padding: 8px 10px; }
details.planning-controls > summary { font-weight: 600; color: #374151; cursor: pointer; }
.controls-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 8px 0 4px; }
.controls-grid .row { display: flex; flex-direction: column; gap: 4px; }
.controls-grid input { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; }
</style>
