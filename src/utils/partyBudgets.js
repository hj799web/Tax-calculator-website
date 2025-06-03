// Party Budgets Data & Sharing Functionality
// This file contains data for the 2025 party budgets and functions to generate shareable links

import { handleError } from '@/utils/errorHandler.js';
import { ref } from 'vue';

export const partyBudgetErrorMessage = ref('');

/**
 * Budget data for Canadian political parties (2025 projections)
 */
export const partyBudgets = {
  liberal: {
    id: "liberal",
    name: "Liberal Party Budget 2025",
    description: "This budget represents the Liberal fiscal approach focusing on nation-building investments, moderate deficits, and stabilizing the debt-to-GDP ratio.",
    buttonColor: "#d71920", // Liberal red

    revenues: {
      personalIncomeTax: 22,
      corporateIncomeTax: 14,
      gst: 5,
      carbonPricing: 1.5,
      exciseTaxes: 2,
      eiPremiums: 1.5,
      customsDuties: 1,
      crownProfits: 2,
      nonTaxRevenue: 4,
      resourceRoyalties: 1
    },

    spending: {
      healthcare: 1.2,
      supportForSeniors: 1.1,
      childrenAndFamilies: 1.15,
      indigenousServices: 1.25,
      employmentInsuranceBenefits: 1.1,
      defense: 1.3,
      publicSafetyEmergency: 1.05,
      internationalAffairs: 1.1,
      publicDebtCharges: 1.0,
      loansInvestments: 1.5,
      otherGovernmentOperations: 1.05
    },

    highlights: [
      "Significant infrastructure and defense investments (~C$129B over 4 years)",
      "Moderate deficits averaging ~C$50B/year (~1.6–2% of GDP)",
      "No wealth tax; maintains competitive corporate tax rates",
      "Golden Rule: Borrowing only for capital, not operating expenses by 2028",
      "Healthcare, Indigenous services, and green infrastructure prioritized"
    ]
  },

  conservative: {
    id: "conservative",
    name: "Conservative Party Budget 2025",
    description: "This budget represents the Conservative fiscal approach emphasizing tax cuts, spending restraint, and aggressive deficit reduction.",
    buttonColor: "#0e4883", // Conservative blue

    revenues: {
      personalIncomeTax: 20,
      corporateIncomeTax: 13,
      gst: 5,
      carbonPricing: 0,
      exciseTaxes: 2,
      eiPremiums: 1.4,
      customsDuties: 1,
      crownProfits: 2,
      nonTaxRevenue: 2,
      resourceRoyalties: 1
    },

    spending: {
      healthcare: 1.05,
      supportForSeniors: 1.0,
      childrenAndFamilies: 1.0,
      indigenousServices: 0.95,
      employmentInsuranceBenefits: 1.0,
      defense: 1.15,
      publicSafetyEmergency: 1.1,
      internationalAffairs: 0.9,
      publicDebtCharges: 1.0,
      loansInvestments: 0.8,
      otherGovernmentOperations: 0.9
    },

    highlights: [
      "Sharp cuts to program spending (~C$34B in efficiencies)",
      "Major tax cuts: personal income tax rate dropped by 5%, carbon tax eliminated",
      "Assumes ~C$60B in economic growth dividend from deregulation",
      "Deficit cut by more than 50% over four years",
      "Debt-to-GDP ratio declines steadily without new taxes"
    ]
  },

  ndp: {
    id: "ndp",
    name: "New Democratic Party Budget 2025",
    description: "This budget represents the NDP fiscal approach focused on massive social program expansion, funded by significant new taxes on corporations and wealth.",
    buttonColor: "#f58220", // NDP orange

    revenues: {
      personalIncomeTax: 23,
      corporateIncomeTax: 18,
      gst: 4,
      carbonPricing: 1.5,
      exciseTaxes: 2.5,
      eiPremiums: 1.5,
      customsDuties: 2,
      crownProfits: 2,
      nonTaxRevenue: 3,
      resourceRoyalties: 1
    },

    spending: {
      healthcare: 1.3,
      supportForSeniors: 1.2,
      childrenAndFamilies: 1.3,
      indigenousServices: 1.35,
      employmentInsuranceBenefits: 1.15,
      defense: 0.9,
      publicSafetyEmergency: 1.0,
      internationalAffairs: 1.0,
      publicDebtCharges: 1.1,
      loansInvestments: 1.0,
      otherGovernmentOperations: 1.2
    },

    highlights: [
      "Universal pharmacare, dental care, housing programs massively expanded",
      "1–3% wealth tax introduced on fortunes above C$10M",
      "Corporate tax increased by 2 percentage points",
      "GST eliminated on home heating, essential goods",
      "Moderate ongoing deficits (~C$30–45B/year) but declining debt-to-GDP trend"
    ]
  }
};

/**
 * Apply a party budget to the budget simulator, updating all sliders and values
 * @param {string} partyId - The ID of the party (liberal, conservative, ndp)
 * @param {object} budgetStore - The budget simulator store
 * @returns {boolean} Success status
 */
export function applyPartyBudget(partyId, budgetStore) {
  const partyData = partyBudgets[partyId];
  if (!partyData) {
    handleError(new Error(`Party budget data not found for: ${partyId}`), (msg) => partyBudgetErrorMessage.value = msg);
    return false;
  }

  console.log(`Applying ${partyId} party budget...`);

  // Start batch update to prevent partial sentiment updates
  if (budgetStore.beginBatchUpdate && typeof budgetStore.beginBatchUpdate === 'function') {
    if (!budgetStore.beginBatchUpdate()) {
      handleError(new Error(`Cannot apply party budget "${partyId}" - another batch update is in progress`), (msg) => partyBudgetErrorMessage.value = msg);
      return false;
    }
  }

  try {
    // Set active preset flag to indicate which party budget is active
    // This is used by the sentiment calculation system to apply party-specific modifiers
    if (budgetStore.activePreset !== undefined) {
      budgetStore.activePreset = `party-${partyId}`;
      console.log(`Set active preset to party-${partyId} for sentiment calculation`);
    }

    // Apply revenue settings
    Object.entries(partyData.revenues).forEach(([sourceId, rate]) => {
      if (budgetStore.setRevenueRate && typeof budgetStore.setRevenueRate === 'function') {
        budgetStore.setRevenueRate(sourceId, rate);
      } else if (budgetStore.updateRevenueRate && typeof budgetStore.updateRevenueRate === 'function') {
        budgetStore.updateRevenueRate(sourceId, rate);
      }
    });

    // Apply spending settings
    Object.entries(partyData.spending).forEach(([categoryId, factor]) => {
      if (budgetStore.updateSpendingFactor && typeof budgetStore.updateSpendingFactor === 'function') {
        budgetStore.updateSpendingFactor(categoryId, factor);
      }
    });

    return true;
  } catch (error) {
    handleError(error, (msg) => partyBudgetErrorMessage.value = msg);
    return false;
  } finally {
    // Complete batch update
    if (budgetStore.completeBatchUpdate && typeof budgetStore.completeBatchUpdate === 'function') {
      budgetStore.completeBatchUpdate();
    }
  }
}

/**
 * Generate a shareable URL for a party budget
 * @param {string} partyId - The ID of the party (liberal, conservative, ndp)
 * @param {string} baseUrl - Optional base URL, defaults to current location
 * @returns {string} The full URL with parameters
 */
export function generatePartyBudgetUrl(partyId, baseUrl = null) {
  const partyData = partyBudgets[partyId];
  if (!partyData) {
    console.error(`Party budget data not found for: ${partyId}`);
    return null;
  }

  baseUrl = baseUrl || window.location.origin + window.location.pathname;
  const params = new URLSearchParams();

  params.set('title', partyData.name);
  params.set('description', partyData.description);
  params.set('partyId', partyId);
  params.set('partyColor', partyData.buttonColor || '');

  Object.entries(partyData.revenues).forEach(([key, value]) => {
    params.set(`r_${key}`, value);
  });

  Object.entries(partyData.spending).forEach(([key, value]) => {
    params.set(`s_${key}`, value);
  });

  if (partyData.highlights && partyData.highlights.length) {
    params.set('highlights', partyData.highlights.join('|'));
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Get the list of available party budgets for UI
 * @returns {Array} List of party data objects with id, name, color
 */
export function getAvailablePartyBudgets() {
  return Object.values(partyBudgets).map(party => ({
    id: party.id,
    name: party.name,
    description: party.description,
    buttonColor: party.buttonColor
  }));
}
