import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';
import { useMultiYearSettingsStore } from '@/domains/budget/store/multiYearSettings.js';

// Apply planned values for a specific year to the live budget, using public setters.
// This updates revenue rates and spending factors and triggers a single recomputation via store debounce.
export async function applyPlanForYear(year) {
  const budget = useBudgetSimulatorStore();
  const settings = useMultiYearSettingsStore();

  // Revenue: compute planned target rates
  const revenueSources = budget.revenueSources || {};
  for (const [id, src] of Object.entries(revenueSources)) {
    const current = Number(src?.rate ?? 0);
    const target = settings.getPlannedRateForYear(id, year, current);
    if (typeof target === 'number' && Math.abs(target - current) > 0.0005) {
      budget.setRevenueRate(id, target);
    }
  }

  // Spending: handle top-level and group children
  const cats = budget.spendingCategories || {};
  const updateFactor = (catId, factor) => {
    const f = Number(factor);
    if (!isFinite(f) || f <= 0) return;
    budget.updateSpendingFactor(catId, f);
  };
  for (const [id, cat] of Object.entries(cats)) {
    if (cat?.isGroup && cat?.children) {
      for (const [childId, child] of Object.entries(cat.children)) {
        const currentF = Number(child?.adjustmentFactor ?? 1);
        const planned = settings.getPlannedFactorForYear(childId, year, currentF);
        if (typeof planned === 'number' && Math.abs(planned - currentF) > 1e-4) {
          updateFactor(childId, planned);
        }
      }
    } else if (cat && !cat.isGroup) {
      const currentF = Number(cat?.adjustmentFactor ?? 1);
      const planned = settings.getPlannedFactorForYear(id, year, currentF);
      if (typeof planned === 'number' && Math.abs(planned - currentF) > 1e-4) {
        updateFactor(id, planned);
      }
    }
  }

  // Trigger totals (store debounces internally)
  budget.recalculateTotals();
}

