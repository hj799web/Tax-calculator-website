<template>
  <div class="analysis">
    <section class="charts">
      <AsyncChartsPanel />
    </section>
    <section class="projections">
      <MultiYearProjectionsPanel />
    </section>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import MultiYearProjectionsPanel from '@/domains/budget/components/MultiYearProjectionsPanel.vue';

const AsyncChartsPanel = defineAsyncComponent({
  loader: () => import('@/domains/budget/components/BudgetChartsPanel.vue'),
  loadingComponent: { template: '<div style="padding:12px">Loading charts…</div>' },
  errorComponent: { template: '<div style="padding:12px;color:#b91c1c">Failed to load charts</div>' },
});
</script>

<style scoped>
.analysis { display: grid; gap: 12px; }
.charts, .projections { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff; }
</style>
