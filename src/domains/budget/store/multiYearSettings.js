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
  const spendingGrowth = ref({
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
    const p = multiYearPlans.value.spending?.[categoryId];
    if (!p) return fallbackFactor ?? null;
    if (p.points && p.points[year] != null) return Number(p.points[year]);
    // Ongoing level + growth delta are projection concepts; for apply to a given year, we treat ongoing level as multiplier
    if (p.ongoingLevelPct != null) {
      const base = Number(fallbackFactor ?? 1);
      const level = 1 + Number(p.ongoingLevelPct) / 100;
      return Number((base * level).toFixed(4));
    }
    return fallbackFactor ?? null;
  }

  return {
    planning,
    economic,
    revenueElasticity,
    spendingGrowth,
    categoryUserDelta,
    multiYearPlans,
    presets,
    applyPreset,
    setRevenuePlan,
    setSpendingPlan,
    clearPlan,
    getPlannedRateForYear,
    getPlannedFactorForYear,
  };
});
