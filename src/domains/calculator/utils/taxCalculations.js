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

/**
 * Calculate EI premium with year-aware rates
 * @param {number} income - Employment income
 * @param {string} provinceCode - Province code (for Quebec-specific rate)
 * @param {string} year - Tax year
 * @returns {number} EI premium amount
 */
export function calculateEiPremiumYearAware(income, provinceCode, year) {
  const y = EI_TABLE[String(year)] || EI_TABLE['2024'];
  const isQC = provinceCode === 'QC';
  const { rate, max } = isQC ? y.QC : y.nonQC;
  return Math.min(income * rate, max);
}

/**
 * Calculate CPP contributions (base + additional) with year-aware rates
 * @param {number} income - Employment income
 * @param {boolean} isSelfEmployed - Whether the income is from self-employment
 * @param {string} year - Tax year
 * @returns {number} CPP contribution amount
 */
export function calculateCppContributions(income, isSelfEmployed, year) {
  const y = CPP_TABLE[String(year)] || CPP_TABLE['2024'];
  const basePensionable = Math.max(0, Math.min(income, y.ympe) - y.ybe);
  const base = Math.min(basePensionable * y.baseRate, y.baseMax);
  const addBase = Math.max(0, Math.min(income, y.yampe) - y.ympe);
  const add = Math.min(addBase * y.addRate, y.addMax);
  const employee = base + add;
  return isSelfEmployed ? employee * 2 : employee;
}

/**
 * Calculate QPP contributions (base + additional) with year-aware rates
 * @param {number} income - Employment income
 * @param {boolean} isSelfEmployed - Whether the income is from self-employment
 * @param {string} year - Tax year
 * @returns {number} QPP contribution amount
 */
export function calculateQppContributions(income, isSelfEmployed, year) {
  const y = QPP_TABLE[String(year)] || QPP_TABLE['2024'];
  const basePensionable = Math.max(0, Math.min(income, y.mpe) - y.ybe);
  const base = Math.min(basePensionable * y.baseRate, y.baseMax);
  const addBase = Math.max(0, Math.min(income, y.ampe) - y.mpe);
  const add = addBase * y.addRate;
  const employee = base + add;
  return isSelfEmployed ? employee * 2 : employee;
}

/**
 * Calculate QPIP contribution with year-aware rates
 * @param {number} income - Employment income
 * @param {string} year - Tax year
 * @returns {number} QPIP contribution amount
 */
export function calculateQpipContributionYearAware(income, year) {
  const y = QPIP_TABLE[String(year)] || QPIP_TABLE['2024'];
  return Math.min(income * y.rate, y.max);
}

/**
 * Calculate federal BPA with phase-out for high income
 * @param {number} baseEnhanced - Base BPA amount
 * @param {number} baseFloor - Minimum BPA after phase-out
 * @param {number} income - Income for phase-out calculation
 * @param {string} year - Tax year
 * @returns {number} Effective BPA amount
 */
export function computeFederalBPAForIncome(baseEnhanced, baseFloor, income, year) {
  // Normalize inputs and provide safe defaults to avoid NaN propagation
  const enhanced = Number(baseEnhanced) || 0;
  const floor = (baseFloor === undefined || baseFloor === null)
    ? enhanced
    : Number(baseFloor);
  const taxableIncome = Number(income) || 0;

  const ranges = {
    '2024': { start: 173205, end: 246752 },
    '2025': { start: 177882, end: 253414 },
  };
  const r = ranges[String(year)] || ranges['2024'];
  if (taxableIncome <= r.start) return enhanced;
  if (taxableIncome >= r.end) return floor;
  if (enhanced === floor) return enhanced;
  const frac = (taxableIncome - r.start) / (r.end - r.start);
  return enhanced - (enhanced - floor) * frac;
} 