<template>
  <transition name="fade">
    <div
      v-if="show"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      @click="handleBackdrop"
    >
      <div
        class="modal"
        @click.stop
      >
        <header class="header">
          <div>
            <h3>{{ itemName || i18nText('multiYearPlan.untitled', 'Untitled item') }}</h3>
            <p class="subtitle">
              {{ i18nText('multiYearPlan.subtitle', 'Saved plans feed directly into the multi-year projections and long-range fiscal calculations.') }}
            </p>
          </div>
          <button
            class="close-btn"
            type="button"
            @click="close"
            :aria-label="i18nText('multiYearPlan.close', 'Close planner')"
          >&times;</button>
        </header>

        <section class="context">
          <span class="badge" v-if="itemBadge">{{ itemBadge }}</span>
          <div class="context-values">
            <span>{{ i18nText('multiYearPlan.baseYear', 'Projection base year:') }} {{ effectiveBaseYear }}</span>
            <span>{{ i18nText('multiYearPlan.currentValue', 'Current value:') }} {{ formatValue(currentValue) }}</span>
          </div>
        </section>

        <section class="form">
          <div class="field">
            <label for="plan-start-year">{{ i18nText('multiYearPlan.startYear', 'Apply changes starting in') }}</label>
            <input
              id="plan-start-year"
              v-model.number="form.startYear"
              type="number"
              :min="effectiveBaseYear"
              :max="effectiveBaseYear + 25"
            >
          </div>

          <div class="grid">
            <div class="field">
              <label for="start-value">{{ startValueLabel }}</label>
              <input
                id="start-value"
                v-model.number="form.startValue"
                type="number"
                :step="type === 'revenue' ? 0.1 : 0.01"
              >
            </div>
            <div
              v-if="type === 'spending'"
              class="field"
            >
              <label for="level-shift">{{ i18nText('multiYearPlan.levelShift', 'Initial level shift (%)') }}</label>
              <input
                id="level-shift"
                v-model.number="form.levelShift"
                type="number"
                step="0.1"
              >
            </div>
            <div class="field">
              <label for="annual-delta">{{ annualDeltaLabel }}</label>
              <input
                id="annual-delta"
                v-model.number="form.annualDelta"
                type="number"
                step="0.1"
              >
            </div>
          </div>
        </section>

        <section class="preview" v-if="previewPoints.length">
          <h4>{{ i18nText('multiYearPlan.previewTitle', 'Preview (next 3 fiscal years)') }}</h4>
          <ul>
            <li v-for="point in previewPoints" :key="point.year">
              <span class="year">{{ point.year }}</span>
              <span class="value">{{ point.value }}</span>
            </li>
          </ul>
        </section>

        <section class="existing" v-if="hasExistingPlan">
          <span class="status-dot"></span>
          <span>{{ i18nText('multiYearPlan.planActive', 'This item already influences projections. Overwrite or remove the plan below.') }}</span>
        </section>

        <footer class="footer">
          <button
            class="btn"
            type="button"
            :disabled="!hasExistingPlan"
            @click="removePlan"
          >
            {{ i18nText('multiYearPlan.remove', 'Remove plan') }}
          </button>
          <div class="spacer"></div>
          <button
            class="btn"
            type="button"
            @click="close"
          >
            {{ i18nText('multiYearPlan.cancel', 'Cancel') }}
          </button>
          <button
            class="btn primary"
            type="button"
            @click="save"
          >
            {{ i18nText('multiYearPlan.save', 'Save plan') }}
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator.js';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';
import { useI18n } from '@/i18n';

const props = defineProps({
  show: { type: Boolean, default: false },
  type: { type: String, default: 'revenue' },
  itemId: { type: String, default: '' },
  itemName: { type: String, default: '' },
  itemBadge: { type: String, default: '' },
  baseYear: { type: Number, default: undefined }
});

const emit = defineEmits(['close']);

const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key);
  return value === key ? fallback : value;
};

const budgetStore = useBudgetSimulatorStore();
const planningStore = useMultiYearSettingsStore();

const fallbackYear = new Date().getFullYear();
const effectiveBaseYear = computed(() => props.baseYear ?? planningStore.planning?.baseYear ?? fallbackYear);

const form = reactive({
  startYear: effectiveBaseYear.value,
  startValue: 0,
  annualDelta: 0,
  levelShift: 0
});

const hasExistingPlan = ref(false);
const previewPoints = ref([]);

const currentValue = computed(() => getCurrentValue());

const startValueLabel = computed(() =>
  props.type === 'revenue'
    ? i18nText('multiYearPlan.startRate', 'Starting rate (%)')
    : i18nText('multiYearPlan.startFactor', 'Starting factor (x)')
);

const annualDeltaLabel = computed(() =>
  props.type === 'revenue'
    ? i18nText('multiYearPlan.annualDeltaRate', 'Annual change (pp / year)')
    : i18nText('multiYearPlan.annualDeltaFactor', 'Annual growth (% / year)')
);

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      loadFromStore();
    }
  }
);

watch(
  () => [props.itemId, props.type],
  () => {
    if (props.show) {
      loadFromStore();
    }
  }
);

watch(
  () => [form.startYear, form.startValue, form.annualDelta, form.levelShift, props.type],
  () => {
    updatePreview();
  },
  { deep: false }
);

function handleBackdrop(event) {
  if (event.target !== event.currentTarget) return;
  close();
}

function close() {
  emit('close');
}

function loadFromStore() {
  const current = currentValue.value;
  form.startYear = effectiveBaseYear.value;
  form.startValue = typeof current === 'number' ? Number(current) : props.type === 'revenue' ? 0 : 1;
  form.annualDelta = 0;
  form.levelShift = 0;

  const existing = planningStore.multiYearPlans?.[props.type]?.[props.itemId];
  hasExistingPlan.value = !!existing;

  if (existing) {
    if (existing.rule) {
      form.startYear = Number(existing.rule.startYear ?? effectiveBaseYear.value);
      if (props.type === 'revenue') {
        form.startValue = Number(existing.rule.startRate ?? form.startValue);
      } else {
        form.startValue = Number(existing.rule.startFactor ?? form.startValue);
      }
      form.annualDelta = Number(existing.rule.annualDeltaPct ?? form.annualDelta);
    }
    if (typeof existing.levelShiftPct === 'number') {
      form.levelShift = Number(existing.levelShiftPct);
    }
  }

  updatePreview();
}

function updatePreview() {
  if (!props.itemId) {
    previewPoints.value = [];
    return;
  }
  const plan = buildPlanPayload();
  const baseline = currentValue.value;
  const years = [effectiveBaseYear.value, effectiveBaseYear.value + 1, effectiveBaseYear.value + 2];
  previewPoints.value = years.map((year) => ({
    year,
    value: formatValue(projectValue(plan, year, baseline))
  }));
}

function save() {
  if (!props.itemId) {
    close();
    return;
  }
  const payload = buildPlanPayload();

  if (!payload) {
    planningStore.clearPlan(props.itemId, props.type);
    close();
    return;
  }

  if (props.type === 'revenue') {
    planningStore.setRevenuePlan(props.itemId, payload);
  } else {
    planningStore.setSpendingPlan(props.itemId, payload);
  }

  close();
}

function removePlan() {
  if (!hasExistingPlan.value || !props.itemId) return;
  planningStore.clearPlan(props.itemId, props.type);
  close();
}

function buildPlanPayload() {
  if (!props.itemId) return null;
  const startYear = Number(form.startYear);
  if (props.type === 'revenue') {
    return {
      mode: 'rule',
      rule: {
        startYear,
        startRate: Number(form.startValue),
        annualDeltaPct: Number(form.annualDelta)
      }
    };
  }
  const payload = {
    mode: 'rule',
    rule: {
      startYear,
      startFactor: Number(form.startValue),
      annualDeltaPct: Number(form.annualDelta)
    }
  };
  if (form.levelShift) {
    payload.levelShiftPct = Number(form.levelShift);
  }
  return payload;
}

function projectValue(plan, year, fallback) {
  const fallbackNumber = Number(fallback ?? (props.type === 'revenue' ? 0 : 1));
  if (!plan) return fallbackNumber;

  if (props.type === 'revenue') {
    if (plan.points && plan.points[year] != null) {
      return Number(plan.points[year]);
    }
    const rule = plan.rule || {};
    const base = Number(rule.startRate ?? fallbackNumber);
    const delta = Number(rule.annualDeltaPct ?? 0);
    const startYear = Number(rule.startYear ?? effectiveBaseYear.value);
    const yearsElapsed = Math.max(0, year - startYear);
    return Number((base + yearsElapsed * delta).toFixed(3));
  }

  const startYear = Number(plan.rule?.startYear ?? effectiveBaseYear.value);
  if (plan.points && plan.points[year] != null) {
    return Number(plan.points[year]);
  }

  let baseFactor = Number(plan.rule?.startFactor ?? fallbackNumber);
  if (typeof plan.levelShiftPct === 'number' && year >= startYear) {
    baseFactor = Number((baseFactor * (1 + Number(plan.levelShiftPct) / 100)).toFixed(4));
  }
  const growth = Number(plan.rule?.annualDeltaPct ?? 0) / 100;
  const yearsElapsed = Math.max(0, year - startYear);
  const projected = baseFactor * Math.pow(1 + growth, yearsElapsed);
  return Number(projected.toFixed(4));
}

function getCurrentValue() {
  if (!props.itemId) return null;
  if (props.type === 'revenue') {
    return Number(budgetStore.revenueSources?.[props.itemId]?.rate ?? 0);
  }
  const categories = budgetStore.spendingCategories || {};
  for (const cat of Object.values(categories)) {
    if (!cat) continue;
    if (cat.isGroup && cat.children) {
      const child = cat.children[props.itemId];
      if (child) {
        return Number(child.adjustmentFactor ?? 1);
      }
    }
    if (cat.id === props.itemId) {
      return Number(cat.adjustmentFactor ?? 1);
    }
  }
  return 1;
}

function formatValue(value) {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }
  if (props.type === 'revenue') {
    return `${Number(value).toFixed(2)}%`;
  }
  return `x${Number(value).toFixed(2)}`;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal { width: min(640px, 100%); background: #ffffff; border-radius: 16px; box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2); display: grid; gap: 16px; max-height: 90vh; overflow-y: auto; padding: 20px 24px 18px; }

.header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.header h3 { margin: 0; font-size: 1.2rem; font-weight: 600; color: #0f172a; }
.subtitle { margin: 4px 0 0; color: #64748b; font-size: 0.9rem; max-width: 420px; }
.close-btn { background: none; border: none; font-size: 1.8rem; line-height: 1; cursor: pointer; color: #475569; }
.close-btn:hover { color: #1f2937; }

.context { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; flex-wrap: wrap; }
.badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; background: #e0f2fe; color: #1d4ed8; padding: 4px 10px; border-radius: 999px; font-weight: 600; }
.context-values { display: flex; gap: 12px; flex-wrap: wrap; font-size: 0.85rem; color: #334155; }

.form { display: grid; gap: 12px; }
.field { display: grid; gap: 6px; }
.field label { font-size: 0.85rem; font-weight: 600; color: #1f2937; }
.field input { padding: 8px 10px; border: 1px solid #cbd5f5; border-radius: 8px; font-size: 0.95rem; }
.field input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }

.preview { border: 1px dashed #bfdbfe; background: #eff6ff; border-radius: 12px; padding: 12px 14px; display: grid; gap: 10px; }
.preview h4 { margin: 0; font-size: 0.9rem; font-weight: 600; color: #1d4ed8; }
.preview ul { margin: 0; padding: 0; list-style: none; display: flex; gap: 12px; flex-wrap: wrap; }
.preview li { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: #dbeafe; color: #1e3a8a; font-size: 0.8rem; }
.preview .year { font-weight: 600; }
.preview .value { font-variant-numeric: tabular-nums; }

.existing { display: flex; align-items: center; gap: 8px; background: #ecfdf5; border: 1px solid #bbf7d0; border-radius: 10px; padding: 8px 12px; font-size: 0.85rem; color: #166534; }
.status-dot { width: 8px; height: 8px; border-radius: 999px; background: #16a34a; }

.footer { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 10px; }
.spacer { height: 1px; }

.btn { padding: 8px 14px; border-radius: 10px; border: 1px solid #cbd5e1; background: #f8fafc; color: #1e293b; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08); }
.btn:hover { border-color: #2563eb; color: #1d4ed8; box-shadow: 0 3px 8px rgba(37, 99, 235, 0.18); transform: translateY(-1px); }
.btn:disabled { cursor: not-allowed; opacity: 0.5; transform: none; box-shadow: none; }
.btn.primary { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-color: #1d4ed8; color: white; box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35); }
.btn.primary:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(37, 99, 235, 0.45); }

@media (max-width: 640px) {
  .footer { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .footer .spacer { display: none; }
  .footer .btn { width: 100%; }
}
</style>



