// Pure projection helpers for multi-year fiscal planning.
// These functions are side-effect free and do not touch existing store state.

/**
 * @typedef {Object} BaseBudgetSnapshot
 * @property {number} gdp - Nominal GDP (billions)
 * @property {number} debt - Gross federal debt at BOP (billions)
 * @property {Record<string, number>} revenuesBySource - Adjusted revenue by source (billions)
 * @property {Record<string, number>} spendingByCategory - Program spending by category (billions)
 */

/**
 * @typedef {Object} ProjectionYear
 * @property {number} year
 * @property {number} gdp
 * @property {Record<string, number>} revenueBySource
 * @property {number} revenueTotal
 * @property {Record<string, number>} spendingByCategory
 * @property {number} programSpending
 * @property {number} interest
 * @property {number} spendingTotal
 * @property {number} deficit
 * @property {number} debt
 * @property {number} debtToGDP
 */

/** Calculate nominal GDP given previous GDP and economic settings. */
export function calcNominalGDP(prevGDP, economic) {
  const real = Number(economic?.gdpReal ?? 0) / 100;
  const infl = Number(economic?.inflation ?? 0) / 100;
  const growth = 1 + Math.max(-0.99, real + infl);
  return round2(prevGDP * growth);
}

/** Compute revenue by source using GDP elasticity. */
export function calcRevenue(prev, nextGDP, elasticityMap, inflationPct) {
  const bySource = {};
  let total = 0;
  const prevGDP = prev.gdp > 0 ? prev.gdp : nextGDP; // fallback
  const gdpRatio = prevGDP > 0 ? nextGDP / prevGDP : 1;
  const inflation = 1 + Math.max(-0.99, (inflationPct ?? 0) / 100);
  for (const [k, v] of Object.entries(prev.revenueBySource)) {
    const eps = Number(elasticityMap?.[k] ?? 1);
    const projected = round2(v * inflation * Math.pow(gdpRatio || 1, eps));
    bySource[k] = projected;
    total += projected;
  }
  return { total: round2(total), bySource };
}

/** Compute program spending by category using growth profiles and user deltas. */
export function calcProgramSpending(prev, profiles, userDeltaMap) {
  const byCategory = {};
  let total = 0;
  for (const [k, v] of Object.entries(prev.spendingByCategory)) {
    const prof = profiles?.[k] || { baseline: 0, demographic: 0 };
    const delta = userDeltaMap?.[k] || { level: 0, growthDelta: 0, ongoing: true };
    const growPct = Math.max(-90, (prof.baseline || 0) + (prof.demographic || 0) + (delta.growthDelta || 0));
    const factor = 1 + growPct / 100;
    const levelAdj = (delta.ongoing ? (1 + (delta.level || 0) / 100) : 1);
    const projected = round2(v * factor * levelAdj);
    byCategory[k] = projected;
    total += projected;
  }
  return { total: round2(total), byCategory };
}

/** Simple interest cost given beginning-of-period debt and average rate. */
export function calcInterest(debtBop, avgRatePct) {
  const rate = Math.max(0, Number(avgRatePct ?? 0) / 100);
  return round2(debtBop * rate);
}

/** Update debt with deficit (positive deficit increases debt). */
export function calcDebt(debtBop, deficit) {
  return round2(debtBop + deficit);
}

/**
 * Project all years using base snapshot and settings.
 * @param {{ base: BaseBudgetSnapshot, settings: {
 *   planning: { baseYear: number, horizonYears: number },
 *   economic: { gdpReal: number, inflation: number, interestRate: number },
 *   revenueElasticity?: Record<string, number>,
 *   spendingGrowth?: Record<string, { baseline: number, demographic: number }>,
 *   categoryUserDelta?: Record<string, { level: number, growthDelta: number, ongoing: boolean }>
 * }}} args
 * @returns {ProjectionYear[]}
 */
export function projectAll(args) {
  const { base, settings } = args || {};
  if (!base || !settings) return [];
  const horizon = Math.max(1, Number(settings?.planning?.horizonYears ?? 10));
  const startYear = Number(settings?.planning?.baseYear ?? new Date().getFullYear());

  const first = /** @type {ProjectionYear} */ ({
    year: startYear,
    gdp: round2(base.gdp),
    revenueBySource: { ...base.revenuesBySource },
    revenueTotal: sumValues(base.revenuesBySource),
    spendingByCategory: { ...base.spendingByCategory },
    programSpending: sumValues(base.spendingByCategory),
    interest: calcInterest(base.debt, settings?.economic?.interestRate),
    spendingTotal: 0, // to be set
    deficit: 0,       // to be set
    debt: round2(base.debt),
    debtToGDP: 0,     // to be set
  });
  first.spendingTotal = round2(first.programSpending + first.interest);
  first.deficit = round2(first.spendingTotal - first.revenueTotal);
  first.debt = calcDebt(base.debt, first.deficit);
  first.debtToGDP = safeRatio(first.debt, first.gdp);

  const out = [first];
  for (let i = 1; i < horizon; i++) {
    const prev = out[i - 1];
    const nextYear = startYear + i;
    const gdp = calcNominalGDP(prev.gdp, settings?.economic);
    const rev = calcRevenue(prev, gdp, settings?.revenueElasticity, settings?.economic?.inflation);
    const spend = calcProgramSpending(prev, settings?.spendingGrowth, settings?.categoryUserDelta);
    const interest = calcInterest(prev.debt, settings?.economic?.interestRate);
    const spendingTotal = round2(spend.total + interest);
    const deficit = round2(spendingTotal - rev.total);
    const debt = calcDebt(prev.debt, deficit);
    const debtToGDP = safeRatio(debt, gdp);

    out.push({
      year: nextYear,
      gdp,
      revenueBySource: rev.bySource,
      revenueTotal: rev.total,
      spendingByCategory: spend.byCategory,
      programSpending: spend.total,
      interest,
      spendingTotal,
      deficit,
      debt,
      debtToGDP,
    });
  }
  return out;
}

// Utilities
function sumValues(obj) {
  if (!obj) return 0;
  return Object.values(obj).reduce((a, b) => a + Number(b || 0), 0);
}

function safeRatio(n, d) {
  if (!d || d === 0) return 0;
  return round4(n / d);
}

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

function round4(n) {
  return Math.round((Number(n) + Number.EPSILON) * 10000) / 10000;
}

