// Adapter to create a BaseBudgetSnapshot from the existing budget store

/**
 * Build a base snapshot from the budget store without mutating it.
 * @param {import('pinia').Store} budgetStore
 * @returns {{ gdp: number, debt: number, revenuesBySource: Record<string, number>, spendingByCategory: Record<string, number> }}
 */
export function makeBaseSnapshotFromStore(budgetStore) {
  const gdp = Number(budgetStore?.fiscalIndicators?.gdp ?? 0);
  const debt = Number(budgetStore?.fiscalIndicators?.debt ?? 0);

  // Revenues: use adjustedAmount if available, else fallback to base*rate
  const revenuesBySource = {};
  const revSrc = budgetStore?.revenueSources || {};
  for (const [key, src] of Object.entries(revSrc)) {
    const adj = src?.adjustedAmount ?? (Number(src?.base || 0) * Number(src?.rate || 0));
    revenuesBySource[key] = to2(adj);
  }

  // Spending: fold groups into child categories using baseAmount * adjustmentFactor
  const spendingByCategory = {};
  const cats = budgetStore?.spendingCategories || {};
  for (const [key, cat] of Object.entries(cats)) {
    if (cat?.isGroup && cat?.children) {
      for (const [childKey, child] of Object.entries(cat.children)) {
        // Skip if child is not a plain category
        if (!child || child.isGroup) continue;
        const amt = Number(child?.baseAmount || 0) * Number(child?.adjustmentFactor || 1);
        spendingByCategory[childKey] = to2(amt);
      }
    } else if (cat && !cat.isGroup) {
      const amt = Number(cat?.baseAmount || 0) * Number(cat?.adjustmentFactor || 1);
      spendingByCategory[key] = to2(amt);
    }
  }

  return { gdp: to2(gdp), debt: to2(debt), revenuesBySource, spendingByCategory };
}

function to2(n) { return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100; }

