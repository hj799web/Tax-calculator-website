<template>
  <div class="sentiment-panel">
    <div class="controls">
      <SentimentSensitivityControl />
    </div>
    <div class="chart">
      <RadarSentiment :external-tab="selectedGroup" />
    </div>
    <div class="group-tabs">
      <button :class="{active: selectedGroup==='provinces'}" @click="selectedGroup='provinces'">Provinces and territories</button>
      <button :class="{active: selectedGroup==='demographics'}" @click="selectedGroup='demographics'">Demographics</button>
      <button :class="{active: selectedGroup==='sectors'}" @click="selectedGroup='sectors'">Sectors</button>
    </div>
    <div class="segments">
      <div class="seg-col" v-show="selectedGroup==='provinces'">
        <h4>Regions</h4>
        <div class="seg-block">
          <div class="seg-subtitle">Top 3</div>
          <ul>
            <li v-for="([k,v]) in topN(sentiment.provinces,3,false)" :key="'p-top-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
        <div class="seg-block">
          <div class="seg-subtitle">Bottom 3</div>
          <ul>
            <li v-for="([k,v]) in topN(sentiment.provinces,3,true)" :key="'p-btm-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
        <div class="seg-block full-list">
          <div class="seg-subtitle">All regions</div>
          <ul>
            <li v-for="([k,v]) in sortedEntries(sentiment.provinces)" :key="'p-all-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="seg-col" v-show="selectedGroup==='demographics'">
        <h4>Demographics</h4>
        <div class="seg-block">
          <div class="seg-subtitle">Top 3</div>
          <ul>
            <li v-for="([k,v]) in topN(sentiment.demographics,3,false)" :key="'d-top-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
        <div class="seg-block">
          <div class="seg-subtitle">Bottom 3</div>
          <ul>
            <li v-for="([k,v]) in topN(sentiment.demographics,3,true)" :key="'d-btm-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
        <div class="seg-block full-list">
          <div class="seg-subtitle">All demographics</div>
          <ul>
            <li v-for="([k,v]) in sortedEntries(sentiment.demographics)" :key="'d-all-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="seg-col" v-show="selectedGroup==='sectors'">
        <h4>Sectors</h4>
        <div class="seg-block">
          <div class="seg-subtitle">Top 3</div>
          <ul>
            <li v-for="([k,v]) in topN(sentiment.sectors,3,false)" :key="'s-top-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
        <div class="seg-block">
          <div class="seg-subtitle">Bottom 3</div>
          <ul>
            <li v-for="([k,v]) in topN(sentiment.sectors,3,true)" :key="'s-btm-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
        <div class="seg-block full-list">
          <div class="seg-subtitle">All sectors</div>
          <ul>
            <li v-for="([k,v]) in sortedEntries(sentiment.sectors)" :key="'s-all-'+k">
              <span class="chip" :style="chipStyle(v)" :title="chipTitle(k,v)">{{ v.toFixed(1) }}</span> {{ k }}
              <span class="delta" :class="deltaClass(v)">{{ formatDelta(v) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import SentimentSensitivityControl from '@/domains/sentiment/components/SentimentSensitivityControl.vue';
import RadarSentiment from '@/domains/sentiment/components/RadarSentiment.vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useSentimentSettingsStore } from '@/domains/sentiment/store/sentimentSettings';
import { computeSentimentScores, getSentimentColor } from '@/domains/sentiment/utils/computeSentimentScores';

const budget = useBudgetSimulatorStore();
const sentimentSettings = useSentimentSettingsStore();
const selectedGroup = ref('provinces');

// Minimal data object for the radar; extend if the component uses more fields

// Build a light budget object for the sentiment model (rates and amounts)
const budgetForSentiment = computed(() => {
  const rs = budget.revenueSources || {};
  const mix = (id, prop) => Number(rs[id]?.[prop] || 0);
  return {
    revenueMix: {
      personalIncomeTax: mix('personalIncomeTax','rate'),
      corporateIncomeTax: mix('corporateIncomeTax','rate'),
      gst: mix('gst','rate'),
      carbonPricing: mix('carbonPricing','rate'),
      exciseTaxes: mix('exciseTaxes','rate'),
      eiPremiums: mix('eiPremiums','rate'),
      customsDuties: mix('customsDuties','rate'),
      crownProfits: mix('crownProfits','rate'),
      nonTaxRevenue: mix('nonTaxRevenue','rate'),
      resourceRoyalties: mix('resourceRoyalties','rate'),
      personalIncomeTaxAmount: mix('personalIncomeTax','adjustedAmount'),
      corporateIncomeTaxAmount: mix('corporateIncomeTax','adjustedAmount'),
      gstAmount: mix('gst','adjustedAmount'),
      carbonPricingAmount: mix('carbonPricing','adjustedAmount'),
      exciseTaxesAmount: mix('exciseTaxes','adjustedAmount'),
      eiPremiumsAmount: mix('eiPremiums','adjustedAmount'),
      customsDutiesAmount: mix('customsDuties','adjustedAmount'),
      crownProfitsAmount: mix('crownProfits','adjustedAmount'),
      nonTaxRevenueAmount: mix('nonTaxRevenue','adjustedAmount'),
      resourceRoyaltiesAmount: mix('resourceRoyalties','adjustedAmount'),
    },
    fiscalIndicators: {
      deficit: Number(budget.totalSpending || 0) - Number(budget.totalRevenue || 0),
      surplus: Number(budget.totalRevenue || 0) - Number(budget.totalSpending || 0),
      debtToGdpRatio: safeRatio(budget.fiscalIndicators?.debt, budget.fiscalIndicators?.gdp) * 100,
    },
  };
});

const sentiment = computed(() => {
  const s = computeSentimentScores(
    budgetForSentiment.value,
    budget.badges || [],
    budget.activePreset || null,
    sentimentSettings.sensitivity
  ) || {};
  return {
    provinces: s.provinces || {},
    demographics: s.demographics || {},
    sectors: s.sectors || {},
    fiscalChaos: s.fiscalChaos || false,
    activeTriggersByGroup: s.activeTriggersByGroup || null,
  };
});


function safeRatio(n, d) {
  const N = Number(n || 0), D = Number(d || 0);
  if (!D) return 0;
  return N / D;
}

// Helpers: top/bottom N and color chips
function topN(group, n = 3, asc = false) {
  const entries = Object.entries(group || {}).filter(([,v]) => typeof v === 'number');
  entries.sort((a,b) => (asc ? a[1]-b[1] : b[1]-a[1]));
  return entries.slice(0, n);
}

function chipStyle(score) {
  const color = getSentimentColor(Number(score) || 0);
  return { '--chip-color': color, color, borderColor: color };
}

function formatDelta(score) {
  const delta = Number(score) - 3;
  const sign = delta > 0 ? '+' : delta < 0 ? '' : '';
  return `${sign}${delta.toFixed(1)}`;
}

function deltaClass(score) {
  const s = Number(score);
  if (s > 3.05) return 'delta-pos';
  if (s < 2.95) return 'delta-neg';
  return 'delta-neutral';
}

function chipTitle(label, score) {
  return `${label}: ${Number(score).toFixed(2)} (Δ ${formatDelta(score)})`;
}

function sortedEntries(group) {
  return Object.entries(group || {}).filter(([,v]) => typeof v === 'number').sort((a,b) => b[1]-a[1]);
}
</script>

<style scoped>
.sentiment-panel { display: grid; gap: 12px; }
.controls { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff; }
.chart { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff; min-height: 360px; display: grid; align-items: center; }
.chart :deep(canvas) { width: 100% !important; height: 320px !important; display: block; }
.segments { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.seg-col { border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px; background: #fff; }
.seg-col h4 { margin: 0 0 6px; font-size: .9rem; color: #111827; }
.seg-block { margin-bottom: 8px; }
.seg-subtitle { font-size: .8rem; color: #6b7280; margin: 2px 0 4px; }
.seg-col ul { margin: 0; padding-left: 0; list-style: none; display: grid; gap: 4px; }
.group-tabs { display: flex; gap: 6px; margin: 6px 0; }
.group-tabs button { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; cursor: pointer; }
.group-tabs button.active { background: #2563eb; border-color: #2563eb; color: #fff; }
.chip { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--chip-color); color: var(--chip-color); font-weight: 600; font-size: .8rem; margin-right: 6px; }
.delta { font-size: .8rem; margin-left: 6px; }
.delta-pos { color: #065f46; }
.delta-neg { color: #7f1d1d; }
.delta-neutral { color: #6b7280; }
</style>
