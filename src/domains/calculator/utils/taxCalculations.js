/**
 * Tax calculation utilities for the calculator domain
 */

/**
 * Calculate tax based on progressive tax brackets
 * @param {number} taxable - The taxable amount
 * @param {Array<{rate: number, upTo: number}>} brackets - Array of tax brackets
 * @returns {number} The calculated tax amount
 */
export function calculateBracketTax(taxable, brackets) {
  let tax = 0;
  let previousUpTo = 0;
  for (const bracket of brackets) {
    if (taxable > bracket.upTo) {
      const slice = bracket.upTo - previousUpTo;
      tax += slice * bracket.rate;
      previousUpTo = bracket.upTo;
    } else {
      const slice = taxable - previousUpTo;
      tax += slice * bracket.rate;
      break;
    }
  }
  return Math.max(tax, 0);
}

/**
 * Calculate dividend tax credits
 * @param {number} eligibleDividends - Amount of eligible dividends
 * @param {number} ineligibleDividends - Amount of ineligible dividends
 * @returns {number} Total dividend tax credit
 */
export function calculateDividendTaxCredit(eligibleDividends, ineligibleDividends) {
  const grossedUpEligible = eligibleDividends * 1.38;
  const grossedUpIneligible = ineligibleDividends * 1.15;
  const fedEligibleCredit = 0.150198 * grossedUpEligible;
  const fedIneligibleCredit = 0.090301 * grossedUpIneligible;
  return fedEligibleCredit + fedIneligibleCredit;
}

/**
 * Calculate CPP/QPP contributions
 * @param {number} income - Employment income
 * @param {boolean} isSelfEmployed - Whether the income is from self-employment
 * @returns {number} CPP/QPP contribution amount
 */
export function calculatePensionPlanContribution(income, isSelfEmployed) {
  const annualCppMax = 3754.45;
  const annualCppMaxSelfEmployed = 3754.45 * 2;
  const rate = isSelfEmployed ? 0.114 : 0.057;
  const maxContrib = isSelfEmployed ? annualCppMaxSelfEmployed : annualCppMax;
  return Math.min(income * rate, maxContrib);
}

/**
 * Calculate EI premiums
 * @param {number} income - Employment income
 * @param {string} province - Province code (for Quebec-specific rate)
 * @returns {number} EI premium amount
 */
export function calculateEiPremium(income, province = null) {
  // Quebec has a lower EI rate
  if (province === 'QC') {
    const annualEiMax = 834; // Quebec max
    return Math.min(income * 0.0132, annualEiMax);
  }
  
  // Federal rate for other provinces
  const annualEiMax = 1002.45;
  return Math.min(income * 0.0163, annualEiMax);
}

/**
 * Calculate child tax credit
 * @param {number} numberOfChildren - Number of children under 18
 * @returns {number} Child tax credit amount
 */
export function calculateChildCredit(numberOfChildren) {
  return 2000 * (numberOfChildren || 0);
}

/**
 * Calculate effective basic personal amount based on marital status
 * @param {number} baseAmount - Base basic personal amount
 * @param {string} maritalStatus - Marital status
 * @returns {number} Effective basic personal amount
 */
export function calculateEffectiveBPA(baseAmount) {
  return baseAmount;
}

/**
 * Calculate QPIP (Québec Parental Insurance Plan) contribution
 * @param {number} income - Employment income
 * @returns {number} QPIP contribution amount
 */
export function calculateQpipContribution(income) {
  const qpipRate = 0.00494; // 0.494%
  const maxContribution = 449; // 91000 * 0.00494
  return Math.min(income * qpipRate, maxContribution);
}

/**
 * Calculate Quebec abatement (reduces federal tax)
 * @param {number} federalBasicTax - Federal basic tax before credits
 * @returns {number} Quebec abatement amount
 */
export function calculateQuebecAbatement(federalBasicTax) {
  return federalBasicTax * 0.165; // 16.5% reduction
}

/**
 * Calculate QPP contribution (Quebec-specific)
 * @param {number} income - Employment income
 * @param {boolean} isSelfEmployed - Whether the income is from self-employment
 * @returns {number} QPP contribution amount
 */
export function calculateQppContribution(income, isSelfEmployed) {
  const qppRate = 0.064; // 6.4%
  const basicExemption = 3500;
  const maxContribution = 4160; // (68500 - 3500) * 0.064
  
  if (isSelfEmployed) {
    // Self-employed pays both employee and employer portions
    return Math.min(income * qppRate * 2, maxContribution * 2);
  }
  
  const pensionableIncome = Math.max(0, income - basicExemption);
  return Math.min(pensionableIncome * qppRate, maxContribution);
}

// Year-aware contribution tables
const EI_TABLE = {
  '2024': { 
    nonQC: { rate: 0.0166, mie: 63200, max: 1049.12 }, 
    QC: { rate: 0.0132, mie: 63200, max: 834.24 } 
  },
  '2025': { 
    nonQC: { rate: 0.0164, mie: 65700, max: 1077.48 }, 
    QC: { rate: 0.0131, mie: 65700, max: 860.67 } 
  },
};

const CPP_TABLE = {
  '2024': { 
    ybe: 3500, 
    ympe: 68500, 
    yampe: 73200, 
    baseRate: 0.0595, 
    baseMax: 3867.50, 
    addRate: 0.04, 
    addMax: 188.00 
  },
  '2025': { 
    ybe: 3500, 
    ympe: 71300, 
    yampe: 81200, 
    baseRate: 0.0595, 
    baseMax: 4034.10, 
    addRate: 0.04, 
    addMax: 396.00 
  },
};

const QPP_TABLE = {
  '2024': { 
    ybe: 3500, 
    mpe: 68500, 
    ampe: 73200, 
    baseRate: 0.064, 
    baseMax: 4160.00, 
    addRate: 0.04 
  },
  '2025': { 
    ybe: 3500, 
    mpe: 71300, 
    ampe: 81200, 
    baseRate: 0.064, 
    baseMax: 4339.20, 
    addRate: 0.04 
  },
};

const QPIP_TABLE = {
  '2024': { rate: 0.00494, mie: 94000, max: 464.36 },
  '2025': { rate: 0.00494, mie: 98000, max: 484.12 },
};

const isContributionObject = (val) => val && typeof val === 'object';

const resolveEiParams = (provinceOrContrib, year) => {
  if (isContributionObject(provinceOrContrib) && 'rate' in provinceOrContrib && 'max' in provinceOrContrib) {
    return provinceOrContrib;
  }
  const provinceCode = typeof provinceOrContrib === 'string' ? provinceOrContrib : null;
  const y = EI_TABLE[String(year)] || EI_TABLE['2024'];
  const isQC = provinceCode === 'QC';
  return isQC ? y.QC : y.nonQC;
};

const resolveCppParams = (paramsOrYear) => {
  if (isContributionObject(paramsOrYear)) {
    const p = paramsOrYear.pensionPlan || paramsOrYear;
    const base = p.base || {};
    const add = p.add || {};
    return {
      ybe: base.ybe ?? base.basicExemption ?? 0,
      ceiling: base.ympe ?? base.mpe ?? 0,
      baseRate: base.rate ?? 0,
      baseMax: base.max ?? Infinity,
      addRate: add.rate ?? 0,
      addMin: add.min ?? add.minPensionableEarnings ?? add.minPensionable ?? base.ympe ?? base.mpe ?? 0,
      addCeiling: add.maxPensionableEarnings ?? add.max ?? add.maxCeiling ?? base.ympe ?? base.mpe ?? 0,
      addMax: add.max ?? add.maxContribution ?? Infinity,
    };
  }
  const y = CPP_TABLE[String(paramsOrYear)] || CPP_TABLE['2024'];
  return {
    ybe: y.ybe,
    ceiling: y.ympe,
    baseRate: y.baseRate,
    baseMax: y.baseMax,
    addRate: y.addRate,
    addMin: y.ympe,
    addCeiling: y.yampe,
    addMax: y.addMax,
  };
};

const resolveQppParams = (paramsOrYear) => {
  if (isContributionObject(paramsOrYear)) {
    const p = paramsOrYear.pensionPlan || paramsOrYear;
    const base = p.base || {};
    const add = p.add || {};
    return {
      ybe: base.ybe ?? base.basicExemption ?? 0,
      ceiling: base.mpe ?? base.ympe ?? 0,
      baseRate: base.rate ?? 0,
      baseMax: base.max ?? Infinity,
      addRate: add.rate ?? 0,
      addMin: add.min ?? add.minPensionableEarnings ?? add.minPensionable ?? base.mpe ?? 0,
      addCeiling: add.maxPensionableEarnings ?? add.max ?? add.maxCeiling ?? base.mpe ?? 0,
      addMax: add.max ?? add.maxContribution ?? Infinity,
    };
  }
  const y = QPP_TABLE[String(paramsOrYear)] || QPP_TABLE['2024'];
  return {
    ybe: y.ybe,
    ceiling: y.mpe,
    baseRate: y.baseRate,
    baseMax: y.baseMax,
    addRate: y.addRate,
    addMin: y.mpe,
    addCeiling: y.ampe,
    addMax: Infinity,
  };
};

const resolveQpipParams = (paramsOrYear) => {
  if (isContributionObject(paramsOrYear) && paramsOrYear.qpip) {
    return paramsOrYear.qpip;
  }
  if (isContributionObject(paramsOrYear) && 'rate' in paramsOrYear && 'max' in paramsOrYear) {
    return paramsOrYear;
  }
  return QPIP_TABLE[String(paramsOrYear)] || QPIP_TABLE['2024'];
};

/**
 * Calculate EI premium using provided contributions (preferred) or legacy year fallback.
 * @param {number} income - Employment income
 * @param {object|string} provinceOrContrib - Either province code (legacy) or EI contribution params {rate,max}
 * @param {string} year - Tax year (legacy fallback)
 * @returns {number} EI premium amount
 */
export function calculateEiPremiumYearAware(income, provinceOrContrib, year) {
  const { rate, max } = resolveEiParams(provinceOrContrib, year);
  return Math.min(income * rate, max);
}

/**
 * Calculate CPP contributions (base + additional) with year-aware rates
 * @param {number} income - Employment income
 * @param {boolean} isSelfEmployed - Whether the income is from self-employment
 * @param {object|string} paramsOrYear - Contribution params {pensionPlan:{base,add}} or legacy tax year
 * @returns {number} CPP contribution amount
 */
export function calculateCppContributions(income, isSelfEmployed, paramsOrYear) {
  const p = resolveCppParams(paramsOrYear);
  const basePensionable = Math.max(0, Math.min(income, p.ceiling) - p.ybe);
  const base = Math.min(basePensionable * p.baseRate, p.baseMax);
  const addBase = Math.max(0, Math.min(income, p.addCeiling) - p.addMin);
  const add = Math.min(addBase * p.addRate, p.addMax);
  const employee = base + add;
  return isSelfEmployed ? employee * 2 : employee;
}

/**
 * Calculate QPP contributions (base + additional) with year-aware rates
 * @param {number} income - Employment income
 * @param {boolean} isSelfEmployed - Whether the income is from self-employment
 * @param {object|string} paramsOrYear - Contribution params {pensionPlan:{base,add}} or legacy tax year
 * @returns {number} QPP contribution amount
 */
export function calculateQppContributions(income, isSelfEmployed, paramsOrYear) {
  const p = resolveQppParams(paramsOrYear);
  const basePensionable = Math.max(0, Math.min(income, p.ceiling) - p.ybe);
  const base = Math.min(basePensionable * p.baseRate, p.baseMax);
  const addBase = Math.max(0, Math.min(income, p.addCeiling) - p.addMin);
  const add = Math.min(addBase * p.addRate, p.addMax);
  const employee = base + add;
  return isSelfEmployed ? employee * 2 : employee;
}

/**
 * Calculate QPIP contribution with year-aware rates
 * @param {number} income - Employment income
 * @param {object|string} paramsOrYear - QPIP params {rate,max} or legacy tax year
 * @returns {number} QPIP contribution amount
 */
export function calculateQpipContributionYearAware(income, paramsOrYear) {
  const y = resolveQpipParams(paramsOrYear);
  return Math.min(income * y.rate, y.max);
}

/**
 * Calculate federal BPA with phase-out for high income (CRA worksheet)
 * @param {number} baseEnhanced - Base BPA amount
 * @param {{start:number, end:number, floor:number}} phaseOut - Phase-out parameters
 * @param {number} income - Income for phase-out calculation
 * @returns {number} Effective BPA amount
 */
export function computeFederalBPAForIncome(baseEnhanced, phaseOut, income) {
  const enhanced = Number(baseEnhanced) || 0;
  const taxableIncome = Number(income) || 0;

  if (!phaseOut || typeof phaseOut !== 'object') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Missing BPA phase-out parameters; using base amount.');
    }
    return enhanced;
  }

  const start = Number(phaseOut.start);
  const end = Number(phaseOut.end);
  const floor = Number(phaseOut.floor);

  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(floor) || end <= start) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Invalid BPA phase-out parameters; using base amount.', phaseOut);
    }
    return enhanced;
  }

  if (taxableIncome <= start) return enhanced;
  if (taxableIncome >= end) return floor;

  const reduction = ((taxableIncome - start) * (enhanced - floor)) / (end - start);
  const phased = enhanced - reduction;
  if (!Number.isFinite(phased)) return enhanced;
  return Math.max(floor, Math.min(enhanced, phased));
}

/**
 * Compute the medical expenses threshold per CRA rule: min(indexed fixed amount, 3% of net income)
 *
 * This helper intentionally takes the fixed threshold as a parameter so callers can
 * supply the year-indexed amount from configuration/constants.
 *
 * @param {number} netIncome - Net income for the year
 * @param {number} fixedThreshold - Year-indexed fixed threshold amount
 * @returns {number} Threshold to compare against eligible medical expenses
 */
export function computeMedicalExpensesThreshold(netIncome, fixedThreshold) {
  const income = Number(netIncome) || 0;
  const fixed = Number(fixedThreshold) || 0;
  return Math.min(fixed, income * 0.03);
}