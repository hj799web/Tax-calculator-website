<template>
  <div class="items-plan-list">
    <header class="intro">
      <div class="intro-text">
        <h2>{{ i18nText('itemsPlanList.title', 'Plan items for multi-year projections') }}</h2>
        <p>{{ i18nText('itemsPlanList.subtitle', 'Every plan you save here flows directly into the Projections tab and long-range fiscal results.') }}</p>
      </div>
      <button
        class="projections-link"
        type="button"
        @click="goToProjections()"
      >
        <span class="material-icons">stacked_line_chart</span>
        {{ i18nText('itemsPlanList.viewProjections', 'Open projections') }}
      </button>
    </header>

    <div class="search-bar">
      <span class="material-icons" aria-hidden="true">search</span>
      <input
        v-model="searchQuery"
        :placeholder="i18nText('itemsPlanList.searchPlaceholder', 'Search items, groups, or types...')"
        @keyup.enter="focusFirstPlannable()"
      >
    </div>

    <section
      v-for="section in groupedSections"
      :key="section.key"
      class="section"
    >
      <div class="section-header">
        <div class="section-copy">
          <h3>{{ section.label }}</h3>
          <p>{{ section.description }}</p>
        </div>
        <span class="section-chip">
          {{ section.plannedCount }} / {{ section.items.length }}
          {{ i18nText('itemsPlanList.plannedLabel', 'planned') }}
        </span>
      </div>

      <div class="items-grid">
        <article
          v-for="item in section.items"
          :key="item.key"
          :class="['item-card', item.type, { 'has-plan': item.hasPlan }]"
        >
          <header class="item-header">
            <div class="left">
              <span class="icon material-icons" aria-hidden="true">{{ item.type === 'revenue' ? 'paid' : 'account_balance' }}</span>
              <div class="title-block">
                <span class="name" :title="item.name">{{ item.name }}</span>
                <span class="badge">{{ item.badge }}</span>
              </div>
            </div>
            <span
              class="plan-status"
              :class="{ planned: item.hasPlan }"
            >
              {{ item.hasPlan ? i18nText('itemsPlanList.status.inPlan', 'In projections') : i18nText('itemsPlanList.status.notPlanned', 'Not planned yet') }}
            </span>
          </header>

          <dl class="current">
            <dt>{{ item.type === 'revenue' ? i18nText('itemsPlanList.labels.currentRate', 'Current rate (%)') : i18nText('itemsPlanList.labels.currentFactor', 'Current factor (x)') }}</dt>
            <dd>{{ formatValue(item, item.current) }}</dd>
          </dl>

          <p
            v-if="item.summary"
            class="summary"
          >
            {{ item.summary }}
          </p>
          <p
            v-else
            class="summary empty"
          >
            {{ i18nText('itemsPlanList.summary.empty', 'No custom projection yet. Create one to see it in the charts.') }}
          </p>

          <ul
            v-if="item.preview && item.preview.length"
            class="preview"
          >
            <li v-for="point in item.preview" :key="point.year">
              <span class="year">{{ point.year }}</span>
              <span class="value">{{ point.value }}</span>
            </li>
          </ul>

          <footer class="item-actions">
            <button
              class="btn"
              type="button"
              :disabled="!item.hasPlan"
              @click="resetItem(item)"
            >
              {{ i18nText('itemsPlanList.buttons.reset', 'Remove plan') }}
            </button>
            <button
              class="btn outline"
              type="button"
              @click="goToProjections(item)"
            >
              {{ i18nText('itemsPlanList.buttons.inspect', 'See impact') }}
            </button>
            <button
              class="btn primary"
              type="button"
              @click="planItem(item)"
            >
              {{ item.hasPlan ? i18nText('itemsPlanList.buttons.editPlan', 'Edit plan') : i18nText('itemsPlanList.buttons.plan', 'Create plan') }}
            </button>
          </footer>
        </article>
      </div>
    </section>

    <div
      v-if="!groupedSections.length"
      class="empty"
    >
      {{ i18nText('itemsPlanList.empty', 'No items match your search criteria.') }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator.js';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { useI18n } from '@/i18n';

const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key);
  return value === key ? fallback : value;
};

const emit = defineEmits(['open-plan']);

const searchQuery = ref('');
const budgetStore = useBudgetSimulatorStore();
const planningStore = useMultiYearSettingsStore();
const route = useRoute?.();
const router = useRouter?.();

const baseYear = computed(() => planningStore.planning?.baseYear ?? new Date().getFullYear());

const items = computed(() => {
  const list = [];

  Object.values(budgetStore.revenueSources || {}).forEach((src) => {
    if (!src?.id || !src?.name) return;
    list.push({
      key: `revenue:${src.id}`,
      id: src.id,
      name: src.name,
      badge: i18nText('itemsPlanList.groups.revenueBadge', 'Revenue source'),
      type: 'revenue',
      current: Number(src.rate ?? 0),
      group: 'revenue'
    });
  });

  Object.values(budgetStore.spendingCategories || {}).forEach((cat) => {
    if (!cat) return;
    if (cat.isGroup && cat.children) {
      Object.values(cat.children).forEach((child) => {
        if (!child?.id || !child?.name) return;
        list.push({
          key: `spending:${child.id}`,
          id: child.id,
          name: child.name,
          badge: cat.name || i18nText('itemsPlanList.groups.spendingBadge', 'Program spending'),
          type: 'spending',
          current: Number(child.adjustmentFactor ?? 1),
          group: `spending:${cat.name || 'other'}`
        });
      });
    } else if (cat.id && cat.name) {
      list.push({
        key: `spending:${cat.id}`,
        id: cat.id,
        name: cat.name,
        badge: i18nText('itemsPlanList.groups.spendingBadge', 'Program spending'),
        type: 'spending',
        current: Number(cat.adjustmentFactor ?? 1),
        group: 'spending:other'
      });
    }
  });

  return list;
});

function getPlan(item) {
  const plans = planningStore.multiYearPlans?.[item.type];
  return plans ? plans[item.id] || null : null;
}

function summarizePlan(item, plan) {
  if (!plan) return '';
  if (plan.summary) return plan.summary;

  const startYear = plan.rule?.startYear ?? baseYear.value;
  if (item.type === 'revenue') {
    const start = plan.rule?.startRate ?? item.current;
    const delta = Number(plan.rule?.annualDeltaPct ?? 0);
    if (Math.abs(delta) < 1e-6) {
      return i18nText('itemsPlanList.summary.revenueHold', 'Hold rate at {rate}% from {year}')
        .replace('{rate}', start.toFixed(2))
        .replace('{year}', startYear);
    }
    const deltaText = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)} pp/yr`;
    return i18nText('itemsPlanList.summary.revenueRule', 'From {year}: start at {rate}% with {delta}')
      .replace('{year}', startYear)
      .replace('{rate}', start.toFixed(2))
      .replace('{delta}', deltaText);
  }

  const startFactor = plan.rule?.startFactor ?? item.current;
  const levelShift = Number(plan.levelShiftPct ?? 0);
  const growth = Number(plan.rule?.annualDeltaPct ?? 0);
  const parts = [];
  parts.push(i18nText('itemsPlanList.summary.spendingStart', 'Start {year}: factor {factor}')
    .replace('{year}', startYear)
    .replace('{factor}', startFactor.toFixed(2)));
  if (Math.abs(levelShift) > 1e-6) {
    parts.push(`${levelShift >= 0 ? '+' : ''}${levelShift.toFixed(2)}% ${i18nText('itemsPlanList.summary.levelShift', 'initial level shift')}`);
  }
  if (Math.abs(growth) > 1e-6) {
    parts.push(`${growth >= 0 ? '+' : ''}${growth.toFixed(2)}% ${i18nText('itemsPlanList.summary.annualGrowth', 'growth per year')}`);
  }
  return parts.join(' - ');
}

function buildPreview(item, plan) {
  if (!plan) return [];
  const years = [baseYear.value, baseYear.value + 1, baseYear.value + 2];
  if (item.type === 'revenue') {
    return years.map((year) => ({
      year,
      value: formatValue(item, planningStore.getPlannedRateForYear(item.id, year, item.current))
    }));
  }
  return years.map((year) => ({
    year,
    value: formatValue(item, planningStore.getPlannedFactorForYear(item.id, year, item.current))
  }));
}

const enrichedItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return items.value
    .map((item) => {
      const plan = getPlan(item);
      return {
        ...item,
        plan,
        hasPlan: !!plan,
        summary: summarizePlan(item, plan),
        preview: buildPreview(item, plan)
      };
    })
    .filter((item) => {
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type.localeCompare(b.type);
    });
});

const groupedSections = computed(() => {
  const sections = [];
  const revenueItems = enrichedItems.value.filter((i) => i.type === 'revenue');
  if (revenueItems.length) {
    sections.push({
      key: 'revenue',
      label: i18nText('itemsPlanList.groups.revenue', 'Revenue sources'),
      description: i18nText('itemsPlanList.groups.revenueDesc', 'Adjust tax rates and other revenues to shape future inflows.'),
      plannedCount: revenueItems.filter((i) => i.hasPlan).length,
      items: revenueItems
    });
  }

  const grouped = new Map();
  enrichedItems.value
    .filter((i) => i.type === 'spending')
    .forEach((item) => {
      const key = item.group || 'spending:other';
      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          label: item.badge,
          description: i18nText('itemsPlanList.groups.spendingDesc', 'Program factors feed directly into projected expenditures.'),
          plannedCount: 0,
          items: []
        });
      }
      const section = grouped.get(key);
      section.items.push(item);
      if (item.hasPlan) section.plannedCount += 1;
    });

  const sortedSpending = Array.from(grouped.values()).sort((a, b) => a.label.localeCompare(b.label));
  sections.push(...sortedSpending);

  return sections;
});

function formatValue(item, value) {
  if (value == null || Number.isNaN(value)) return '-';
  if (item.type === 'revenue') {
    return `${Number(value).toFixed(2)}%`;
  }
  return `x${Number(value).toFixed(2)}`;
}

function resetItem(item) {
  if (!item?.id) return;
  planningStore.clearPlan(item.id, item.type);
}

function planItem(item) {
  emit('open-plan', item);
}

function goToProjections(item) {
  if (!router || !route) return;
  const query = { ...route.query, panel: 'projections' };
  if (item?.id) {
    query.highlight = item.id;
  }
  router.replace({ query }).catch(() => {});
}

function focusFirstPlannable() {
  const first = enrichedItems.value.find((item) => !item.hasPlan);
  if (first) {
    planItem(first);
  }
}
</script>

<style scoped>
.items-plan-list {
  display: grid;
  gap: 20px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto 24px;
  padding: 0 16px 32px;
  box-sizing: border-box;
}

.intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.intro-text h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.intro-text p {
  margin: 4px 0 0;
  color: #4b5563;
  max-width: 540px;
}

.projections-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 8px 14px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.18);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  white-space: nowrap;
}

.projections-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.28);
}

.projections-link .material-icons {
  font-size: 18px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 9px 14px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  min-width: 0;
}

.search-bar .material-icons {
  font-size: 18px;
  color: #9ca3af;
}

.section {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
  flex-wrap: wrap;
}

.section-header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2937;
}

.section-header p {
  margin: 4px 0 0;
  color: #6b7280;
  max-width: 540px;
}

.section-chip {
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.items-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.item-card {
  border: 1px solid #e5e7eb;
  border-left: 4px solid transparent;
  border-radius: 14px;
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
  min-height: 100%;
}

.item-card.revenue { border-left-color: #2563eb; }
.item-card.spending { border-left-color: #047857; }
.item-card.has-plan {
  background: #f0f9ff;
  border-color: #bfdbfe;
}

.item-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.item-header .left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.icon {
  font-size: 22px;
  color: #6b7280;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.name {
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  font-size: 0.75rem;
  color: #4b5563;
  background: #e5e7eb;
  border-radius: 999px;
  padding: 2px 8px;
  align-self: flex-start;
}

.plan-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  white-space: nowrap;
}

.plan-status.planned {
  background: #dcfce7;
  color: #166534;
}

.current {
  margin: 0;
  display: grid;
  gap: 2px;
}

.current dt {
  font-size: 0.75rem;
  color: #6b7280;
}

.current dd {
  margin: 0;
  font-weight: 600;
  color: #111827;
}

.summary {
  margin: 0;
  font-size: 0.85rem;
  color: #1f2937;
  word-break: break-word;
}

.summary.empty {
  color: #6b7280;
  font-style: italic;
}

.preview {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preview li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #374151;
  background: #e0f2fe;
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}

.preview .year { font-weight: 600; }
.preview .value { font-variant-numeric: tabular-nums; }

.item-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: auto;
}

.btn {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4px;
  min-height: 38px;
}

.btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn:disabled {
  background: #f9fafb;
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border-color: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

.btn.outline {
  border-color: #93c5fd;
  background: #e0f2fe;
  color: #1d4ed8;
}

.btn.outline:hover {
  border-color: #2563eb;
}

.empty {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 40px 0;
}

@media (max-width: 960px) {
  .items-plan-list {
    padding: 0 12px 28px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .item-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .intro {
    flex-direction: column;
    align-items: stretch;
  }

  .projections-link {
    width: 100%;
    justify-content: center;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .item-actions {
    grid-template-columns: 1fr;
  }
}
</style>


