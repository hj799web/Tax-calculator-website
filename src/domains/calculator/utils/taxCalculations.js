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
  const fedEligibleCredit = 0.1502 * grossedUpEligible;
  const fedIneligibleCredit = 0.09 * grossedUpIneligible;
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
 * @returns {number} EI premium amount
 */
export function calculateEiPremium(income) {
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
export function calculateEffectiveBPA(baseAmount, maritalStatus) {
  if (maritalStatus === 'Married or Common-Law') {
    return baseAmount + 12500;
  }
  return baseAmount;
} 