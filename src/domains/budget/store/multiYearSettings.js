import { defineStore } from 'pinia';
import { ref } from 'vue';

// Pinia store for multi-year planning assumptions and presets
export const useMultiYearSettingsStore = defineStore('multiYearSettings', () => {
  // Planning horizon
  const planning = ref({
    baseYear: 2024,
    horizonYears: 10,
  });

  // Economic assumptions (percent values interpreted as % per year)
  const economic = ref({
    gdpReal: 1.8,       // Real GDP growth (% p.a.)
    inflation: 2.0,     // CPI inflation (% p.a.)
    interestRate: 3.5,  // Avg effective rate on debt (% p.a.)
    population: 1.0,    // Population growth (% p.a.)
  });

  // Revenue elasticities to GDP (unitless)
  const revenueElasticity = ref({
    personalIncomeTax: 1.05,
    corporateIncomeTax: 1.10,
    gst: 1.00,
    exciseTaxes: 0.90,
    carbonPricing: 0.80,
    customsDuties: 0.90,
    eiPremiums: 0.95,
    crownProfits: 0.50,
    resourceRoyalties: 1.20,
    nonTaxRevenue: 0.60,
  });

  // Program spending growth profiles (percentage points added annually)
  const spendingGrowthDefaults = Object.freeze({
    healthcare: { baseline: 3.5, demographic: 1.2 },
    education: { baseline: 2.0, demographic: 0.3 },
    seniors: { baseline: 4.2, demographic: 2.1 },
    childrenFamilies: { baseline: 2.0, demographic: 0.5 },
    indigenousServices: { baseline: 3.0, demographic: 1.0 },
    employmentInsurance: { baseline: 2.0, demographic: 0.5 },
    defensePublicSafety: { baseline: 2.5, demographic: 0.0 },
    transportationInfrastructure: { baseline: 2.5, demographic: 0.0 },
    environmentalPrograms: { baseline: 2.5, demographic: 0.0 },
    publicSafetyEmergency: { baseline: 2.5, demographic: 0.0 },
    governmentBuildings: { baseline: 2.0, demographic: 0.0 },
    researchInnovation: { baseline: 3.0, demographic: 0.0 },
    digitalGovernment: { baseline: 2.0, demographic: 0.0 },
    federalEmployeeSalaries: { baseline: 2.5, demographic: 0.0 },
    legalJusticeSystem: { baseline: 2.0, demographic: 0.0 },
    indigenousServicesOps: { baseline: 3.0, demographic: 0.5 },
    culturalHeritage: { baseline: 2.0, demographic: 0.0 },
    scientificResearch: { baseline: 3.0, demographic: 0.0 },
    diplomaticRepresentation: { baseline: 2.0, demographic: 0.0 },
    // Loans & investments group children can be treated similarly if projected
  });
  const spendingGrowth = ref(JSON.parse(JSON.stringify(spendingGrowthDefaults)));

  // Global across-board program spending adjustments (multi-year only)
  // levelPct: one-time baseline shift applied at base year (excludes interest)
  // growthDeltaPct: additional annual growth (percentage points) applied each projected year
  const spendingGlobal = ref({
    levelPct: 0,
    growthDeltaPct: 0,
  });

  // Year-specific overrides for program spending in projections
  // Example: yearOverrides[2027] = { spending: { levelPct: 2, growthDeltaPct: 0.5 }, applyForward: false }
  const yearOverrides = ref({});

  // User deltas by category (level shift %, growth delta pp, ongoing flag)
  const categoryUserDelta = ref({});

  // Per-item multi-year plans (parallel to existing state; does not mutate budget state)
  const multiYearPlans = ref({
    revenue: {}, // sourceId -> RevenuePlan
    spending: {}, // categoryId -> SpendingPlan
  });

  // Presets for quick scenario selection
  const presets = ref({
    baseline: {
      planning: { baseYear: 2024, horizonYears: 10 },
      economic: { gdpReal: 1.8, inflation: 2.0, interestRate: 3.5, population: 1.0 },
    },
    optimistic: {
      planning: { baseYear: 2024, horizonYears: 10 },
      economic: { gdpReal: 2.3, inflation: 2.0, interestRate: 3.0, population: 1.0 },
    },
    pessimistic: {
      planning: { baseYear: 2024, horizonYears: 10 },
      economic: { gdpReal: 1.0, inflation: 3.0, interestRate: 4.5, population: 0.8 },
    },
  });

  function applyPreset(name) {
    const p = presets.value[name];
    if (!p) return;
    planning.value = { ...planning.value, ...p.planning };
    economic.value = { ...economic.value, ...p.economic };
  }

  function resetSpendingGrowthKey(key) {
    const def = spendingGrowthDefaults[key];
    if (def) spendingGrowth.value[key] = { ...def };
  }

  function resetAllSpendingGrowth() {
    spendingGrowth.value = JSON.parse(JSON.stringify(spendingGrowthDefaults));
  }

  // --- Planning helpers ---
  function setRevenuePlan(sourceId, plan) {
    multiYearPlans.value.revenue = { ...multiYearPlans.value.revenue, [sourceId]: { ...plan } };
  }
  function setSpendingPlan(categoryId, plan) {
    multiYearPlans.value.spending = { ...multiYearPlans.value.spending, [categoryId]: { ...plan } };
  }
  function clearPlan(id, type) {
    if (type === 'revenue') {
      const c = { ...multiYearPlans.value.revenue }; delete c[id]; multiYearPlans.value.revenue = c;
    } else if (type === 'spending') {
      const c = { ...multiYearPlans.value.spending }; delete c[id]; multiYearPlans.value.spending = c;
    }
  }

  function getPlannedRateForYear(sourceId, year, fallbackRate) {
    const p = multiYearPlans.value.revenue?.[sourceId];
    if (!p) return fallbackRate ?? null;
    if (p.points && p.points[year] != null) return Number(p.points[year]);
    if (p.mode === 'rule' && p.rule) {
      const base = Number(p.rule.startRate ?? fallbackRate ?? 0);
      const delta = Number(p.rule.annualDeltaPct ?? 0);
      const years = Math.max(0, year - (planning.value.baseYear || year));
      return Number((base + years * delta).toFixed(4));
    }
    return fallbackRate ?? null;
  }

  function getPlannedFactorForYear(categoryId, year, fallbackFactor) {
    const plan = multiYearPlans.value.spending?.[categoryId];
    if (!plan) return fallbackFactor ?? null;

    if (plan.points && plan.points[year] != null) {
      return Number(plan.points[year]);
    }

    const baseFactor = Number(fallbackFactor ?? 1);
    const startYear = Number(plan.rule?.startYear ?? planning.value.baseYear ?? year);

    if (plan.ongoingLevelPct != null) {
      const level = 1 + Number(plan.ongoingLevelPct) / 100;
      return Number((baseFactor * level).toFixed(4));
    }

    if (!plan.rule) {
      if (typeof plan.levelShiftPct === 'number' && year >= startYear) {
        return Number((baseFactor * (1 + Number(plan.levelShiftPct) / 100)).toFixed(4));
      }
      return baseFactor;
    }

    if (year < startYear) {
      return baseFactor;
    }

    let start = Number(plan.rule.startFactor ?? baseFactor);
    if (typeof plan.levelShiftPct === 'number') {
      start = Number((start * (1 + Number(plan.levelShiftPct) / 100)).toFixed(4));
    }

    const annualGrowth = Number(plan.rule.annualDeltaPct ?? 0) / 100;
    const yearsElapsed = Math.max(0, year - startYear);
    const projected = start * Math.pow(1 + annualGrowth, yearsElapsed);
    return Number(projected.toFixed(4));
  }

  return {
    planning,
    economic,
    revenueElasticity,
    spendingGrowth,
    spendingGlobal,
    categoryUserDelta,
    multiYearPlans,
    yearOverrides,
    presets,
    applyPreset,
    setRevenuePlan,
    setSpendingPlan,
    clearPlan,
    getPlannedRateForYear,
    getPlannedFactorForYear,
    resetSpendingGrowthKey,
    resetAllSpendingGrowth,
  };
});

