/**
 * Budget Presets for Fiscal Insights Budget Simulator
 * 
 * Each preset contains:
 * - label: Display name with emoji
 * - description: Political/economic philosophy explanation
 * - revenue: Values mapped to revenue categories
 * - spending: Values mapped to spending categories
 * - taxExpenditures: Adjustments for tax expenditures
 */

export const budgetPresets = {
  balancedBudget: {
    label: "⚖️ Balanced Budget",
    description: "A fiscally responsible approach that balances revenues and expenditures while maintaining essential services.",
    revenue: {
      personalIncomeTax: 21, // Maintain current rate
      corporateIncomeTax: 15.5, // Slight increase
      gst: 5, // Maintain current rate
      exciseTaxes: 2.7, // Slight increase
      carbonPricing: 1.2, // Slight increase
      eiPremiums: 1.35, // Maintain current rate
      customsDuties: 1, // Maintain current rate
      crownProfits: 2.8, // Slight increase
      nonTaxRevenue: 3.2, // Slight increase
      resourceRoyalties: 1.1 // Slight increase
    },
    spending: {
      healthcare: 1, // Maintain current level
      seniors: 1, // Maintain current level
      childrenFamilies: 1, // Maintain current level
      indigenousServices: 1, // Maintain current level
      employmentInsurance: 1, // Maintain current level
      defensePublicSafety: 1, // Maintain current level
      debtServicing: 1, // Maintain current level
      loansInvestments: {
        studentLoans: 1,
        agricultureLoans: 1,
        internationalDevelopment: 0.9,
        businessInnovation: 1,
        defenseSector: 1,
        economicDevelopment: 1
      },
      governmentOperations: {
        transportationInfrastructure: 1,
        environmentalPrograms: 1,
        publicSafetyEmergency: 1,
        governmentBuildings: 0.95,
        researchInnovation: 1,
        digitalGovernment: 1,
        federalEmployeeSalaries: 0.95,
        legalJusticeSystem: 1,
        indigenousServicesOps: 1,
        culturalHeritage: 0.95,
        scientificResearch: 1,
        diplomaticRepresentation: 0.95
      }
    },
    taxExpenditures: {
      personalTaxCredits: 0, // Neutral
      corporateTaxExpenditures: 0, // Neutral
      gstExpenditures: 0, // Neutral
      taxDeferrals: 0 // Neutral
    }
  },

  austerityPlan: {
    label: "🔻 Austerity Plan",
    description: "A fiscally conservative approach focused on deficit reduction through spending cuts and moderate tax adjustments.",
    revenue: {
      personalIncomeTax: 20, // Slight decrease
      corporateIncomeTax: 14, // Decrease
      gst: 5, // Maintain current rate
      exciseTaxes: 2.6, // Slight increase
      carbonPricing: 0.8, // Decrease
      eiPremiums: 1.3, // Slight decrease
      customsDuties: 1.1, // Slight increase
      crownProfits: 2.7, // Slight increase
      nonTaxRevenue: 3.5, // Increase (more user fees)
      resourceRoyalties: 1.2 // Increase
    },
    spending: {
      healthcare: 0.9, // Decrease
      seniors: 0.95, // Slight decrease
      childrenFamilies: 0.85, // Significant decrease
      indigenousServices: 0.85, // Significant decrease
      employmentInsurance: 0.8, // Significant decrease
      defensePublicSafety: 0.95, // Slight decrease
      debtServicing: 1, // Maintain (can't easily cut)
      loansInvestments: {
        studentLoans: 0.8,
        agricultureLoans: 0.8,
        internationalDevelopment: 0.7,
        businessInnovation: 0.9,
        defenseSector: 0.9,
        economicDevelopment: 0.8
      },
      governmentOperations: {
        transportationInfrastructure: 0.8,
        environmentalPrograms: 0.7,
        publicSafetyEmergency: 0.9,
        governmentBuildings: 0.8,
        researchInnovation: 0.8,
        digitalGovernment: 0.85,
        federalEmployeeSalaries: 0.8,
        legalJusticeSystem: 0.9,
        indigenousServicesOps: 0.8,
        culturalHeritage: 0.7,
        scientificResearch: 0.8,
        diplomaticRepresentation: 0.8
      }
    },
    taxExpenditures: {
      personalTaxCredits: -20, // Reduce credits to increase revenue
      corporateTaxExpenditures: -10, // Reduce corporate credits
      gstExpenditures: -15, // Reduce GST exemptions
      taxDeferrals: -10 // Reduce tax deferrals
    }
  },

  progressiveExpansion: {
    label: "🌱 Progressive Expansion",
    description: "A social democratic approach that invests in public services and social programs, funded by higher taxes on corporations and high-income earners.",
    revenue: {
      personalIncomeTax: 23, // Increase
      corporateIncomeTax: 18, // Significant increase
      gst: 5, // Maintain current rate
      exciseTaxes: 2.8, // Increase
      carbonPricing: 1.5, // Significant increase
      eiPremiums: 1.4, // Slight increase
      customsDuties: 1, // Maintain current rate
      crownProfits: 2.5, // Maintain current rate
      nonTaxRevenue: 3, // Maintain current rate
      resourceRoyalties: 1.2 // Increase
    },
    spending: {
      healthcare: 1.15, // Significant increase
      seniors: 1.1, // Increase
      childrenFamilies: 1.2, // Significant increase
      indigenousServices: 1.25, // Significant increase
      employmentInsurance: 1.15, // Significant increase
      defensePublicSafety: 0.95, // Slight decrease
      debtServicing: 1, // Maintain current level
      loansInvestments: {
        studentLoans: 1.3,
        agricultureLoans: 1.1,
        internationalDevelopment: 1.2,
        businessInnovation: 1.1,
        defenseSector: 0.9,
        economicDevelopment: 1.15
      },
      governmentOperations: {
        transportationInfrastructure: 1.2,
        environmentalPrograms: 1.3,
        publicSafetyEmergency: 1,
        governmentBuildings: 1,
        researchInnovation: 1.2,
        digitalGovernment: 1.15,
        federalEmployeeSalaries: 1.1,
        legalJusticeSystem: 1.05,
        indigenousServicesOps: 1.2,
        culturalHeritage: 1.15,
        scientificResearch: 1.2,
        diplomaticRepresentation: 1
      }
    },
    taxExpenditures: {
      personalTaxCredits: 20, // Increase credits for low/middle income
      corporateTaxExpenditures: -30, // Significant reduction in corporate credits
      gstExpenditures: 10, // Increase GST exemptions for essentials
      taxDeferrals: 0 // Neutral
    }
  },

  infrastructureBuilder: {
    label: "🏗️ Infrastructure Builder",
    description: "A growth-oriented approach focused on infrastructure investment to boost long-term economic productivity and competitiveness.",
    revenue: {
      personalIncomeTax: 21, // Maintain current rate
      corporateIncomeTax: 16, // Slight increase
      gst: 5.5, // Slight increase
      exciseTaxes: 2.5, // Maintain current rate
      carbonPricing: 1.2, // Increase
      eiPremiums: 1.35, // Maintain current rate
      customsDuties: 0.9, // Slight decrease to promote trade
      crownProfits: 2.5, // Maintain current rate
      nonTaxRevenue: 3.2, // Slight increase
      resourceRoyalties: 1.1 // Slight increase
    },
    spending: {
      healthcare: 1, // Maintain current level
      seniors: 1, // Maintain current level
      childrenFamilies: 1, // Maintain current level
      indigenousServices: 1.1, // Slight increase
      employmentInsurance: 1, // Maintain current level
      defensePublicSafety: 1, // Maintain current level
      debtServicing: 1, // Maintain current level
      loansInvestments: {
        studentLoans: 1.1,
        agricultureLoans: 1,
        internationalDevelopment: 0.9,
        businessInnovation: 1.2,
        defenseSector: 1,
        economicDevelopment: 1.2
      },
      governmentOperations: {
        transportationInfrastructure: 1.4, // Significant increase
        environmentalPrograms: 1.1, // Slight increase
        publicSafetyEmergency: 1,
        governmentBuildings: 1.1, // Slight increase
        researchInnovation: 1.2, // Increase
        digitalGovernment: 1.3, // Significant increase
        federalEmployeeSalaries: 1,
        legalJusticeSystem: 1,
        indigenousServicesOps: 1.1, // Slight increase
        culturalHeritage: 1,
        scientificResearch: 1.2, // Increase
        diplomaticRepresentation: 1
      }
    },
    taxExpenditures: {
      personalTaxCredits: 0, // Neutral
      corporateTaxExpenditures: 15, // Increase for infrastructure investment
      gstExpenditures: 0, // Neutral
      taxDeferrals: 10 // Increase to encourage savings/investment
    }
  },

  businessFriendly: {
    label: "💼 Business-Friendly Budget",
    description: "A pro-business approach that reduces corporate taxes and regulations to stimulate economic growth and job creation.",
    revenue: {
      personalIncomeTax: 19, // Decrease
      corporateIncomeTax: 12, // Significant decrease
      gst: 5, // Maintain current rate
      exciseTaxes: 2.3, // Decrease
      carbonPricing: 0.7, // Significant decrease
      eiPremiums: 1.3, // Slight decrease
      customsDuties: 0.8, // Decrease to promote trade
      crownProfits: 2.3, // Slight decrease
      nonTaxRevenue: 3.2, // Slight increase (more user fees)
      resourceRoyalties: 1.2 // Increase
    },
    spending: {
      healthcare: 0.95, // Slight decrease
      seniors: 0.95, // Slight decrease
      childrenFamilies: 0.9, // Decrease
      indigenousServices: 0.9, // Decrease
      employmentInsurance: 0.9, // Decrease
      defensePublicSafety: 1.05, // Slight increase
      debtServicing: 1, // Maintain current level
      loansInvestments: {
        studentLoans: 0.9,
        agricultureLoans: 1,
        internationalDevelopment: 0.8,
        businessInnovation: 1.3, // Significant increase
        defenseSector: 1.1, // Increase
        economicDevelopment: 1.2 // Increase
      },
      governmentOperations: {
        transportationInfrastructure: 1.1, // Increase
        environmentalPrograms: 0.8, // Decrease
        publicSafetyEmergency: 1,
        governmentBuildings: 0.9, // Decrease
        researchInnovation: 1.1, // Increase
        digitalGovernment: 1.1, // Increase
        federalEmployeeSalaries: 0.9, // Decrease
        legalJusticeSystem: 1,
        indigenousServicesOps: 0.9, // Decrease
        culturalHeritage: 0.8, // Decrease
        scientificResearch: 1.1, // Increase
        diplomaticRepresentation: 1
      }
    },
    taxExpenditures: {
      personalTaxCredits: -10, // Slight reduction
      corporateTaxExpenditures: 40, // Significant increase in corporate credits
      gstExpenditures: 0, // Neutral
      taxDeferrals: 20 // Increase to encourage investment
    }
  },

  greenGrowth: {
    label: "🌿 Green Growth Strategy",
    description: "An environmentally-focused approach that invests in clean energy, conservation, and sustainable development.",
    revenue: {
      personalIncomeTax: 21.5, // Slight increase
      corporateIncomeTax: 16, // Increase
      gst: 5, // Maintain current rate
      exciseTaxes: 3, // Increase (especially on fossil fuels)
      carbonPricing: 2, // Significant increase
      eiPremiums: 1.35, // Maintain current rate
      customsDuties: 1.1, // Slight increase (carbon tariffs)
      crownProfits: 2.5, // Maintain current rate
      nonTaxRevenue: 3, // Maintain current rate
      resourceRoyalties: 1.3 // Increase
    },
    spending: {
      healthcare: 1.05, // Slight increase
      seniors: 1, // Maintain current level
      childrenFamilies: 1.05, // Slight increase
      indigenousServices: 1.1, // Increase
      employmentInsurance: 1.05, // Slight increase
      defensePublicSafety: 0.95, // Slight decrease
      debtServicing: 1, // Maintain current level
      loansInvestments: {
        studentLoans: 1.1,
        agricultureLoans: 1.2, // Increase for sustainable agriculture
        internationalDevelopment: 1.1, // Increase for climate aid
        businessInnovation: 1.2, // Increase for green tech
        defenseSector: 0.9, // Decrease
        economicDevelopment: 1.1 // Increase
      },
      governmentOperations: {
        transportationInfrastructure: 1.2, // Increase for public transit
        environmentalPrograms: 1.5, // Significant increase
        publicSafetyEmergency: 1.1, // Increase for climate disasters
        governmentBuildings: 1.1, // Increase for energy efficiency
        researchInnovation: 1.3, // Significant increase for green tech
        digitalGovernment: 1.1, // Increase
        federalEmployeeSalaries: 1,
        legalJusticeSystem: 1,
        indigenousServicesOps: 1.1, // Increase
        culturalHeritage: 1,
        scientificResearch: 1.3, // Significant increase
        diplomaticRepresentation: 1.1 // Increase for climate diplomacy
      }
    },
    taxExpenditures: {
      personalTaxCredits: 10, // Increase for green incentives
      corporateTaxExpenditures: 10, // Increase for green business incentives
      gstExpenditures: 5, // Slight increase
      taxDeferrals: 0 // Neutral
    }
  },

  securityFirst: {
    label: "🛡️ Security-First Budget",
    description: "A defense and security-oriented approach that prioritizes national security, defense, and public safety.",
    revenue: {
      personalIncomeTax: 21, // Maintain current rate
      corporateIncomeTax: 15, // Maintain current rate
      gst: 5.5, // Slight increase
      exciseTaxes: 2.7, // Increase
      carbonPricing: 0.9, // Decrease
      eiPremiums: 1.35, // Maintain current rate
      customsDuties: 1.2, // Increase
      crownProfits: 2.5, // Maintain current rate
      nonTaxRevenue: 3.2, // Slight increase
      resourceRoyalties: 1.1 // Slight increase
    },
    spending: {
      healthcare: 0.95, // Slight decrease
      seniors: 1, // Maintain current level
      childrenFamilies: 0.95, // Slight decrease
      indigenousServices: 0.95, // Slight decrease
      employmentInsurance: 0.95, // Slight decrease
      defensePublicSafety: 1.3, // Significant increase
      debtServicing: 1, // Maintain current level
      loansInvestments: {
        studentLoans: 0.9,
        agricultureLoans: 0.9,
        internationalDevelopment: 0.8,
        businessInnovation: 1,
        defenseSector: 1.4, // Significant increase
        economicDevelopment: 0.9
      },
      governmentOperations: {
        transportationInfrastructure: 1.1, // Increase for strategic infrastructure
        environmentalPrograms: 0.9, // Decrease
        publicSafetyEmergency: 1.3, // Significant increase
        governmentBuildings: 1, // Maintain current level
        researchInnovation: 1.1, // Increase for defense research
        digitalGovernment: 1.2, // Increase for cybersecurity
        federalEmployeeSalaries: 1.05, // Slight increase for security personnel
        legalJusticeSystem: 1.2, // Increase
        indigenousServicesOps: 0.95, // Slight decrease
        culturalHeritage: 0.9, // Decrease
        scientificResearch: 1.1, // Increase for defense research
        diplomaticRepresentation: 1.1 // Increase
      }
    },
    taxExpenditures: {
      personalTaxCredits: -5, // Slight reduction
      corporateTaxExpenditures: 10, // Increase for defense contractors
      gstExpenditures: -5, // Slight reduction
      taxDeferrals: 0 // Neutral
    }
  }
};

/**
 * Apply a budget preset to the budget simulator
 * @param {string} presetKey - The key of the preset to apply
 * @param {object} store - The budget simulator store instance
 */
export function setPreset(presetKey, store) {
  const preset = budgetPresets[presetKey];
  
  if (!preset) {
    console.error(`Preset "${presetKey}" not found`);
    return;
  }
  
  // Apply revenue settings
  Object.entries(preset.revenue).forEach(([sourceId, rate]) => {
    store.updateRevenueRate(sourceId, rate);
  });
  
  // Apply spending settings for main categories
  Object.entries(preset.spending).forEach(([categoryId, value]) => {
    if (typeof value === 'object') {
      // Handle nested categories (groups)
      Object.entries(value).forEach(([subCategoryId, factor]) => {
        store.updateSpendingFactor(subCategoryId, factor);
      });
    } else {
      // Handle main categories
      store.updateSpendingFactor(categoryId, value);
    }
  });
  
  // Apply tax expenditure adjustments
  Object.entries(preset.taxExpenditures).forEach(([expenditureId, adjustment]) => {
    store.updateTaxExpenditureAdjustment(expenditureId, adjustment);
  });
  
  // Recalculate totals to ensure everything is updated
  store.recalculateTotals();
  
  // Trigger reactive updates
  store.lastTaxExpenditureUpdate = Date.now();
  store.lastRevenueSourceUpdate = Date.now();
  
  console.log(`Applied "${preset.label}" preset`);
}
