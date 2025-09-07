<template>
  <div class="spending-panel">
    <SpendingControls
      :main-categories="mainCategories"
      :other-categories-groups="otherCategoriesGroups"
      :sorted-gov-ops-children="sortedGovOpsChildren"
      :spending-factors="spendingFactors"
      :auto-balance-active="budget.autoBalanceActive"
      :expanded-groups="expandedGroups"
      :total-main-categories="budget.mainCategoriesSpending"
      :total-other-categories="budget.otherCategoriesTotal"
      :total-gov-ops="budget.governmentOperationsSpending"
      :total-spending="budget.totalSpending"
      :tax-expenditures="budget.taxExpenditures"
      :total-tax-expenditures="totalTaxExpenditures"
      :tax-expenditure-revenue-impact="budget.taxExpenditureRevenueImpact"
      :get-group-children="getGroupChildren"
      @update-spending-factor="onUpdateSpendingFactor"
      @update-group-spending-factor="onUpdateGroupSpendingFactor"
      @toggle-group-expansion="budget.toggleGroupExpansion"
      @reset-gov-ops="resetGovOpsSubcategories"
      @reset-other-categories="resetOtherCategoriesSubcategories"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import SpendingControls from '@/domains/budget/components/BudgetSpendingControls.vue';

const budget = useBudgetSimulatorStore();

// Ensure key sections are visible by default inside the panel
const expandedGroups = computed(() => ({
  ...budget.expandedGroups,
  otherCategories: true,
  governmentOperations: true,
}));

const mainCategoryIds = ['healthcare','education','seniors','childrenFamilies','indigenousServices','employmentInsurance','defensePublicSafety'];

const mainCategories = computed(() => mainCategoryIds
  .map(id => budget.spendingCategories[id])
  .filter(Boolean)
);

const otherCategoriesGroups = computed(() => {
  const out = [];
  const gov = budget.spendingCategories.governmentOperations;
  const loans = budget.spendingCategories.loansInvestments;
  if (gov?.isGroup) out.push({ id: gov.id, name: gov.name, description: gov.description, baseAmount: sumBase(gov) });
  if (loans?.isGroup) out.push({ id: loans.id, name: loans.name, description: loans.description, baseAmount: sumBase(loans) });
  return out;
});

const sortedGovOpsChildren = computed(() => {
  const g = budget.spendingCategories.governmentOperations;
  if (!g || !g.children) return [];
  return Object.values(g.children).slice().sort((a,b) => (a.name||'').localeCompare(b.name||''));
});

const spendingFactors = computed(() => {
  const map = {};
  const pushCat = (c) => { map[c.id] = Number((c.adjustmentFactor || 1) * 100); };
  for (const [, cat] of Object.entries(budget.spendingCategories)) {
    if (cat?.isGroup && cat?.children) {
      for (const child of Object.values(cat.children)) pushCat(child);
    } else if (cat && !cat.isGroup) pushCat(cat);
  }
  return map;
});

function getGroupChildren(groupId) {
  const g = budget.spendingCategories[groupId];
  if (!g || !g.children) return [];
  return Object.values(g.children);
}

function sumBase(group) {
  if (!group?.children) return 0;
  return Object.values(group.children).reduce((t,c)=> t + Number(c.baseAmount||0), 0);
}

// Total of Tax Expenditures (use netAmount if present)
const totalTaxExpenditures = computed(() => {
  const exp = budget.taxExpenditures || {};
  return Object.values(exp).reduce((t, e) => t + Number(e?.netAmount ?? e?.baseAmount ?? 0), 0);
});

// Event wrappers convert percent → factor
function onUpdateSpendingFactor(id, percent) {
  const factor = Number(percent) / 100;
  if (!isFinite(factor)) return;
  budget.updateSpendingFactor(id, factor);
}

function onUpdateGroupSpendingFactor(groupId, percent) {
  const factor = Number(percent) / 100;
  if (!isFinite(factor)) return;
  budget.updateGroupSpendingFactor(groupId, factor);
}

function resetGovOpsSubcategories() {
  const gov = budget.spendingCategories.governmentOperations;
  if (!gov?.children) return;
  for (const child of Object.values(gov.children)) {
    budget.updateSpendingFactor(child.id, 1);
  }
}

function resetOtherCategoriesSubcategories() {
  const loans = budget.spendingCategories.loansInvestments;
  if (!loans?.children) return;
  for (const child of Object.values(loans.children)) {
    budget.updateSpendingFactor(child.id, 1);
  }
}
</script>

<style scoped>
.spending-panel { display: block; }
/* Ensure embedded simulator-card within panel doesn't force tall height */
.spending-panel :deep(.simulator-card) { min-height: auto; }
</style>
