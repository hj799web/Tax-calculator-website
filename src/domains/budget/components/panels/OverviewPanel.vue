<template>
  <div class="overview">
    <header class="kpi-header">
      <div class="kpi">
        <span class="label">{{ t('simulator.overview.labels.totalRevenue') }}</span>
        <strong>{{ fmtB(budget.totalRevenue) }}</strong>
      </div>
      <div class="kpi">
        <span class="label">{{ t('simulator.overview.labels.totalSpending') }}</span>
        <strong>{{ fmtB(budget.totalSpending) }}</strong>
      </div>
      <div class="kpi">
        <span class="label">{{ t('simulator.overview.labels.debtServicing') }}</span>
        <strong>{{ fmtB(budget.debtServicing) }}</strong>
      </div>
      <div class="kpi">
        <span class="label">{{ t('simulator.overview.labels.surplusDeficit') }}</span>
        <strong :class="{ neg: deficit > 0, pos: deficit <= 0 }">{{ fmtB(deficit) }}</strong>
      </div>
      <div class="kpi">
        <span class="label">{{ t('simulator.overview.labels.debtToGdp') }}</span>
        <strong>{{ (debtToGdp * 100).toFixed(1) }}%</strong>
      </div>
    </header>

    <section class="mini-projections">
      <ProjectionsPanelLite :show-controls="false" />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '@/i18n';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import ProjectionsPanelLite from '@/domains/budget/components/ProjectionsPanelLite.vue';

const budget = useBudgetSimulatorStore();
const { t } = useI18n();

const deficit = computed(() => Number(budget.totalSpending || 0) - Number(budget.totalRevenue || 0));
const debtToGdp = computed(() => safeRatio(budget.fiscalIndicators?.debt, budget.fiscalIndicators?.gdp));

function fmtB(n) { return `$${Number(n || 0).toFixed(1)}B`; }
function safeRatio(n, d) { const N = Number(n || 0), D = Number(d || 0); return D ? N / D : 0; }
</script>

<style scoped>
.overview { display: grid; gap: 14px; }
.kpi-header { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.kpi { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.kpi .label { display: block; font-size: .8rem; color: #6b7280; margin-bottom: 4px; }
.kpi strong { font-size: 1.05rem; color: #111827; }
.neg { color: #b91c1c; }
.pos { color: #047857; }
.mini-projections { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff; }
</style>
