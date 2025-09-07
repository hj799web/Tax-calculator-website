<template>
  <div class="panel-host">
    <PanelBanner 
      v-model="panel" 
      :panels="panelDefs" 
      :pinned-keys="pinned"
      :compact="isCompact"
    />

    <div class="panel-body">
      <KeepAlive>
        <component :is="currentComp" @open-plan="openPlan" />
      </KeepAlive>
    </div>

    <MultiYearItemPlanModal
      v-if="modal.open"
      :type="modal.type"
      :id="modal.id"
      :year="planning.baseYear"
      @close="modal.open = false" />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import PanelBanner from '@/domains/budget/components/PanelBanner.vue';
import MultiYearItemPlanModal from '@/domains/budget/components/MultiYearItemPlanModal.vue';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

const planning = computed(() => useMultiYearSettingsStore().planning);

// Pinned tabs and compact mode
const pinned = ['revenue','spending'];
const isCompact = ref(false);
function handleResize() { try { isCompact.value = window.innerWidth < 900; } catch (_) { isCompact.value = false; } }
onMounted(() => { handleResize(); window.addEventListener('resize', handleResize); });
onUnmounted(() => { window.removeEventListener('resize', handleResize); });

const AssumptionsPanel = defineAsyncComponent(() => import('@/domains/budget/components/AssumptionsPanel.vue'));
const ProjectionsPanelLite = defineAsyncComponent(() => import('@/domains/budget/components/ProjectionsPanelLite.vue'));
const OverviewPanel = defineAsyncComponent(() => import('@/domains/budget/components/panels/OverviewPanel.vue'));
const AnalysisPanel = defineAsyncComponent(() => import('@/domains/budget/components/panels/AnalysisPanel.vue'));
const GoalsPanel = defineAsyncComponent(() => import('@/domains/budget/components/panels/GoalsPanel.vue'));
const PresetsPanel = defineAsyncComponent(() => import('@/domains/budget/components/panels/PresetsPanel.vue'));
const ItemsPlanList = defineAsyncComponent(() => import('@/domains/budget/components/ItemsPlanList.vue'));
const BudgetExportPanel = defineAsyncComponent(() => import('@/domains/budget/components/BudgetExportPanel.vue'));
const ResultsPanel = defineAsyncComponent(() => import('@/domains/budget/components/BudgetResults.vue'));
const RevenuePanel = defineAsyncComponent(() => import('@/domains/budget/components/RevenuePanel.vue'));
const SpendingPanel = defineAsyncComponent(() => import('@/domains/budget/components/SpendingPanel.vue'));
const SentimentPanel = defineAsyncComponent(() => import('@/domains/sentiment/components/SentimentPanel.vue'));

// Concise labels + intuitive grouping to reduce overwhelm
const panelDefs = [
  { key: 'overview',    label: 'Overview',   icon: 'dashboard',              comp: OverviewPanel,        group: 'core' },
  { key: 'goals',       label: 'Goals',      icon: 'flag',                   comp: GoalsPanel,           group: 'core' },

  { key: 'revenue',     label: 'Revenue',    icon: 'payments',               comp: RevenuePanel,         group: 'adjust' },
  { key: 'spending',    label: 'Spending',   icon: 'account_balance_wallet', comp: SpendingPanel,        group: 'adjust' },
  { key: 'presets',     label: 'Presets',    icon: 'tune',                   comp: PresetsPanel,         group: 'adjust' },
  { key: 'assumptions', label: 'Assumptions',icon: 'tune',                   comp: AssumptionsPanel,     group: 'adjust' },
  { key: 'items',       label: 'Items',      icon: 'list_alt',               comp: ItemsPlanList,        group: 'adjust' },

  { key: 'results',     label: 'Results',    icon: 'analytics',              comp: ResultsPanel,         group: 'insights' },
  { key: 'analysis',    label: 'Analysis',   icon: 'bar_chart',              comp: AnalysisPanel,        group: 'insights' },
  { key: 'sentiment',   label: 'Sentiment',  icon: 'sentiment_satisfied',    comp: SentimentPanel,       group: 'insights' },

  { key: 'projections', label: 'Projections',icon: 'stacked_line_chart',     comp: ProjectionsPanelLite, group: 'planning' },
  { key: 'export',      label: 'Export',     icon: 'ios_share',              comp: BudgetExportPanel,    group: 'share' },
];

const route = useRoute?.() || null;
const router = useRouter?.() || null;

const panel = ref(resolveInitialPanel());
function resolveInitialPanel() {
  const qp = route?.query?.panel;
  const valid = panelDefs.some(d => d.key === qp);
  return valid ? qp : 'overview';
}

watch(panel, (p) => {
  if (!router || !route) return;
  router.replace({ query: { ...route.query, panel: p } }).catch(() => {});
});

const currentComp = computed(() => (panelDefs.find(d => d.key === panel.value) || panelDefs[0]).comp);

const modal = ref({ open: false, type: 'revenue', id: null });
function openPlan(type, id) { modal.value = { open: true, type, id }; }
</script>

<style scoped>
.panel-host { display: grid; gap: 12px; max-width: 1100px; margin: 0 auto; width: 100%; }
.panel-body { min-height: 320px; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
</style>
