// Household tax projection utilities kept separate from the single-year calculator.

/**
 * Project household taxes across years given a schedule map and income path.
 * The schedule entry per year may be either:
 *  - a function: (incomes) => { tax, avgRate, mtr }
 *  - an object with a `compute` function of the same signature.
 *
 * @param {Record<number, Function|{compute: Function}>} scheduleByYear
 * @param {Record<number, { employment: number, selfEmployment?: number, capitalGains?: number, other?: number }>} incomePath
 * @returns {Array<{ year: number, tax: number, avgRate: number, mtr: number }>}
 */
export function projectHouseholdTaxes(scheduleByYear, incomePath) {
  const years = Object.keys(incomePath || {}).map((y) => Number(y)).sort();
  const out = [];
  for (const year of years) {
    const schedule = scheduleByYear?.[year];
    const incomes = incomePath[year] || {};
    const compute = typeof schedule === 'function' ? schedule : schedule?.compute;
    if (typeof compute !== 'function') {
      out.push({ year, tax: 0, avgRate: 0, mtr: 0 });
      continue;
    }
    const res = compute(incomes) || {};
    out.push({
      year,
      tax: to2(res.tax),
      avgRate: to4(res.avgRate),
      mtr: to4(res.mtr),
    });
  }
  return out;
}

function to2(n) { return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100; }
function to4(n) { return Math.round((Number(n || 0) + Number.EPSILON) * 10000) / 10000; }

