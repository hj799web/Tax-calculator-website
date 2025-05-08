/**
 * Budget Presets for Fiscal Insights Budget Simulator
 * 
 * Each preset contains:
 * - label: Display name with emoji
 * - description: Political/economic philosophy explanation
 * - revenue: Values mapped to revenue categories
 * - spending: Values mapped to spending categories (keys standardized)
 * - taxExpenditures: Adjustments for tax expenditures
 */
export const budgetPresets = {
  balancedBudget: {
    label: "⚖️ Balanced Budget",
    description:
      "A fiscally responsible approach that balances revenues and expenditures while maintaining essential services. This preset is designed to earn the 'Fiscal Hawk' and 'Centrist Pragmatist' badges.",
    revenue: {
      personalIncomeTax: 21, // Optionally adjust to 21.5 if needed
      corporateIncomeTax: 15,
      gst: 5,
      exciseTaxes: 2.7,
      carbonPricing: 1.2,
      eiPremiums: 1.35,
      customsDuties: 1,
      crownProfits: 2.8,
      nonTaxRevenue: 3.2,
      resourceRoyalties: 1.1
    },
    spending: {
      healthcare: 1, // Optionally reduce to 0.95 if a slight deficit is detected
      education: 1,
      childrenAndFamilies: 1,
      supportForSeniors: 1,
      indigenousServices: 1,
      defense: 1,
      scienceAndInnovation: 1,
      infrastructure: 1,
      digitalGovernment: 1,
      environmentAndClimateChange: 1,
      carbonPricing: 1,
      agriculture: 1,
      internationalDevelopment: 1,
      culturalPrograms: 1,
      transit: 1,
      economicDevelopment: 1,
      indigenousOperations: 1,
      diplomaticRepresentation: 1,
      loansInvestments: {
        studentLoans: 1,
        agricultureLoans: 1,
        internationalDevelopment: 1,
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
        culturalPrograms: 0.95,
        scientificResearch: 1,
        diplomaticRepresentation: 0.95
      }
    },
    taxExpenditures: {
      personalTaxCredits: 0,
      corporateTaxExpenditures: 0,
      gstExpenditures: 0,
      taxDeferrals: 0
    }
  },

  austerityPlan: {
    label: "🔻 Austerity Plan",
    description:
      "A fiscally conservative approach focused on deficit reduction through spending cuts and moderate tax adjustments. This preset is designed to earn the 'Austerity Champion' and 'Surplus Architect' badges.",
    revenue: {
      personalIncomeTax: 20.5, // Increased from 20 (+0.5)
      corporateIncomeTax: 14.5, // Increased from 14 (+0.5)
      gst: 5,
      exciseTaxes: 2.6,
      carbonPricing: 0.8,
      eiPremiums: 1.3,
      customsDuties: 1.1,
      crownProfits: 2.7,
      nonTaxRevenue: 3.5,
      resourceRoyalties: 1.2
    },
    spending: {
      healthcare: 0.8,
      education: 0.85,
      childrenAndFamilies: 0.75,
      supportForSeniors: 0.9,
      indigenousServices: 0.85,
      defense: 0.95,
      scienceAndInnovation: 0.9,
      infrastructure: 0.9,
      digitalGovernment: 0.85,
      environmentAndClimateChange: 0.9,
      carbonPricing: 0.9,
      agriculture: 0.8,
      internationalDevelopment: 0.7,
      culturalPrograms: 0.9,
      transit: 0.9,
      economicDevelopment: 0.8,
      indigenousOperations: 0.8,
      diplomaticRepresentation: 0.8,
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
        culturalPrograms: 0.7,
        scientificResearch: 0.8,
        diplomaticRepresentation: 0.8
      }
    },
    taxExpenditures: {
      personalTaxCredits: -20,
      corporateTaxExpenditures: -10,
      gstExpenditures: -15,
      taxDeferrals: -10
    }
  },

  progressiveExpansion: {
    label: "🌿 Green Growth Stimulus",
    description:
      "An economic growth-focused approach that uses strategic deficits to stimulate the economy while staying under the $60B deficit threshold. This preset is designed to earn the 'Stimulus Commander' and 'Stimulus Engineer' badges.",
    revenue: {
      personalIncomeTax: 23, // Increased from 22.5 (+0.5)
      corporateIncomeTax: 17, // Increased from 16.5 (+0.5)
      gst: 5.2,
      exciseTaxes: 3.3, // Increased from 3.2 (+0.1)
      carbonPricing: 2.3, // Increased from 2.2 (+0.1)
      eiPremiums: 1.45,
      customsDuties: 1.2,
      crownProfits: 2.7,
      nonTaxRevenue: 3.2,
      resourceRoyalties: 1.4
    },
    spending: {
      healthcare: 1.05,
      education: 1.05,
      childrenAndFamilies: 1.05,
      supportForSeniors: 1,
      indigenousServices: 1.1,
      defense: 1,
      scienceAndInnovation: 1.05,
      infrastructure: 1.25, // Reduced from 1.3 (-0.05)
      digitalGovernment: 1.1,
      environmentAndClimateChange: 1.1,
      carbonPricing: 1.05,
      agriculture: 1.05,
      internationalDevelopment: 1.1,
      culturalPrograms: 1.05,
      transit: 1.05,
      economicDevelopment: 1.1,
      indigenousOperations: 1.05,
      diplomaticRepresentation: 1.05,
      loansInvestments: {
        studentLoans: 1.1,
        agricultureLoans: 1.2,
        internationalDevelopment: 1.1,
        businessInnovation: 1.2,
        defenseSector: 0.9,
        economicDevelopment: 1.1
      },
      governmentOperations: {
        transportationInfrastructure: 1.2,
        environmentalPrograms: 1.4, // Reduced from 1.5 (-0.1)
        publicSafetyEmergency: 1.1,
        governmentBuildings: 1.1,
        researchInnovation: 1.2, // Reduced from 1.3 (-0.1)
        digitalGovernment: 1.1,
        federalEmployeeSalaries: 1,
        legalJusticeSystem: 1,
        indigenousServicesOps: 1.1,
        culturalPrograms: 1,
        scientificResearch: 1.3,
        diplomaticRepresentation: 1.1
      }
    },
    taxExpenditures: {
      personalTaxCredits: 8,
      corporateTaxExpenditures: -8,
      gstExpenditures: 3,
      taxDeferrals: -8
    }
  },

  businessFriendly: {
    label: "💼 Business-Friendly Budget",
    description:
      "A pro-business approach that reduces corporate taxes and regulations to stimulate economic growth and job creation. This preset is designed to earn the 'Corporate Catalyst' and 'Business Friendly' badges.",
    revenue: {
      personalIncomeTax: 20,
      corporateIncomeTax: 13.5, // Increased from 13 (+0.5)
      gst: 5,
      exciseTaxes: 2.5,
      carbonPricing: 0, // Eliminated carbon tax to be truly business-friendly
      eiPremiums: 1.4,
      customsDuties: 0.9,
      crownProfits: 2.5,
      nonTaxRevenue: 3.4, // Optionally increase to 3.5 if needed
      resourceRoyalties: 1.3
    },
    spending: {
      healthcare: 0.95,
      education: 0.95,
      childrenAndFamilies: 0.9,
      supportForSeniors: 0.95,
      indigenousServices: 0.9,
      defense: 1,
      scienceAndInnovation: 0.95,
      infrastructure: 0.95,
      digitalGovernment: 0.9,
      environmentAndClimateChange: 0.9,
      carbonPricing: 0.9,
      agriculture: 0.9,
      internationalDevelopment: 0.8,
      culturalPrograms: 0.9,
      transit: 0.9,
      economicDevelopment: 1.1, // Reduced from 1.2 (-0.1)
      indigenousOperations: 0.9,
      diplomaticRepresentation: 1,
      loansInvestments: {
        studentLoans: 0.9,
        agricultureLoans: 1,
        internationalDevelopment: 0.8,
        businessInnovation: 1.3,
        defenseSector: 1.1,
        economicDevelopment: 1.2
      },
      governmentOperations: {
        transportationInfrastructure: 1.1,
        environmentalPrograms: 0.8,
        publicSafetyEmergency: 1,
        governmentBuildings: 0.9,
        researchInnovation: 1.1,
        digitalGovernment: 1.1,
        federalEmployeeSalaries: 0.9,
        legalJusticeSystem: 1,
        indigenousServicesOps: 0.9,
        culturalPrograms: 0.8,
        scientificResearch: 1.1,
        diplomaticRepresentation: 1
      }
    },
    taxExpenditures: {
      personalTaxCredits: -10,
      corporateTaxExpenditures: -15,
      gstExpenditures: 0,
      taxDeferrals: 20
    }
  },

  infrastructureBuilder: {
    label: "🏗️ Infrastructure Builder",
    description:
      "A budget focused on major investments in physical infrastructure, transit, roads, bridges, broadband, water systems, and climate-resilient infrastructure, funded through moderate deficits and reallocated tax expenditures.",
    revenue: {
      personalIncomeTax: 21,
      corporateIncomeTax: 15.5, // Increased from 15 (+0.5)
      gst: 5,
      exciseTaxes: 2.6,
      carbonPricing: 1.2,
      eiPremiums: 1.4,
      customsDuties: 1.1,
      crownProfits: 2.6,
      nonTaxRevenue: 3.4, // Increased from 3.3 (+0.1)
      resourceRoyalties: 1.2
    },
    spending: {
      healthcare: 1.0,
      education: 1.0,
      childrenAndFamilies: 1.0,
      supportForSeniors: 1.0,
      indigenousServices: 1.1,
      defense: 1.0,
      scienceAndInnovation: 1.1,
      infrastructure: 1.4, // Reduced from 1.5 (-0.1)
      digitalGovernment: 1.2,
      environmentAndClimateChange: 1.2,
      carbonPricing: 1.0,
      agriculture: 1.1,
      internationalDevelopment: 1.0,
      culturalPrograms: 1.0,
      transit: 1.3, // Reduced from 1.4 (-0.1)
      economicDevelopment: 1.2,
      indigenousOperations: 1.1,
      diplomaticRepresentation: 1.0,
      loansInvestments: {
        studentLoans: 1.0,
        agricultureLoans: 1.1,
        internationalDevelopment: 1.0,
        businessInnovation: 1.2,
        defenseSector: 1.0,
        economicDevelopment: 1.2
      },
      governmentOperations: {
        transportationInfrastructure: 1.5, // Reduced from 1.6 (-0.1)
        environmentalPrograms: 1.3,
        publicSafetyEmergency: 1.1,
        governmentBuildings: 1.2,
        researchInnovation: 1.2,
        digitalGovernment: 1.3,
        federalEmployeeSalaries: 1.0,
        legalJusticeSystem: 1.0,
        indigenousServicesOps: 1.1,
        culturalPrograms: 1.0,
        scientificResearch: 1.2,
        diplomaticRepresentation: 1.0
      }
    },
    taxExpenditures: {
      personalTaxCredits: 5,
      corporateTaxExpenditures: 5,
      gstExpenditures: 0,
      taxDeferrals: 0
    }
  },

  greenGrowthStimulus: {
    label: "🌱 Progressive Expansion",
    description:
      "A social democratic approach that invests in public services and social programs, funded by higher taxes on corporations and high-income earners. This preset is tailored to trigger key social and balanced badges including Progressive Moderate, Urban Optimizer, Welfare Architect, Senior Ally, Family Champion, Equity Champion, and Social Safety Weaver.",
    revenue: {
      personalIncomeTax: 24.5, // Increased from 24 (+0.5)
      corporateIncomeTax: 19.5, // Increased from 19 (+0.5)
      gst: 5.2,
      exciseTaxes: 3.1, // Increased from 3.0 (+0.1)
      carbonPricing: 2.0, // Increased from 1.8 (+0.2)
      eiPremiums: 1.5,
      customsDuties: 1.2,
      crownProfits: 2.7,
      nonTaxRevenue: 3.2,
      resourceRoyalties: 1.3
    },
    spending: {
      healthcare: 1.15, // Reduced from 1.25 (-0.10)
      education: 1.1, // Reduced from 1.2 (-0.10)
      childrenAndFamilies: 1.2, // Reduced from 1.3 (-0.10)
      supportForSeniors: 1.1, // Reduced from 1.2 (-0.10)
      indigenousServices: 1.25,
      defense: 1,
      scienceAndInnovation: 1.05,
      infrastructure: 1.05,
      digitalGovernment: 1.15,
      environmentAndClimateChange: 1.05,
      carbonPricing: 1,
      agriculture: 1,
      internationalDevelopment: 1.2,
      culturalPrograms: 1.15,
      transit: 1.1,
      economicDevelopment: 1.15,
      indigenousOperations: 1,
      diplomaticRepresentation: 1,
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
        culturalPrograms: 1.15,
        scientificResearch: 1.2,
        diplomaticRepresentation: 1
      }
    },
    taxExpenditures: {
      personalTaxCredits: 20,
      corporateTaxExpenditures: 10,
      gstExpenditures: 10,
      taxDeferrals: 0
    }
  },

  securityFirst: {
    label: "🛡️ Security-First Budget",
    description:
      "A defense and security-oriented approach that prioritizes national security, defense, and public safety. This preset is designed to earn the 'National Security Guardian' and 'Peace Through Strength' badges.",
    revenue: {
      personalIncomeTax: 21,
      corporateIncomeTax: 15.5, // Increased from 15 (+0.5)
      gst: 5.6, // Increased from 5.5 (+0.1)
      exciseTaxes: 2.7,
      carbonPricing: 0.9,
      eiPremiums: 1.35,
      customsDuties: 1.2,
      crownProfits: 2.5,
      nonTaxRevenue: 3.2,
      resourceRoyalties: 1.1
    },
    spending: {
      healthcare: 0.95,
      education: 0.95,
      childrenAndFamilies: 0.95,
      supportForSeniors: 1,
      indigenousServices: 0.95,
      defense: 1.35, // Reduced from 1.4 (-0.05)
      scienceAndInnovation: 1,
      infrastructure: 1,
      digitalGovernment: 1.05,
      environmentAndClimateChange: 0.95,
      carbonPricing: 0.95,
      agriculture: 0.95,
      internationalDevelopment: 0.95,
      culturalPrograms: 1.0, // Reduced from 1.1 (-0.1)
      transit: 0.95,
      economicDevelopment: 1,
      indigenousOperations: 0.95,
      diplomaticRepresentation: 1.1, // Reduced from 1.2 (-0.1)
      loansInvestments: {
        studentLoans: 0.9,
        agricultureLoans: 0.9,
        internationalDevelopment: 0.8,
        businessInnovation: 1,
        defenseSector: 1.4,
        economicDevelopment: 0.9
      },
      governmentOperations: {
        transportationInfrastructure: 1.1,
        environmentalPrograms: 0.9,
        publicSafetyEmergency: 1.3,
        governmentBuildings: 1,
        researchInnovation: 1.1,
        digitalGovernment: 1.2,
        federalEmployeeSalaries: 1.05,
        legalJusticeSystem: 1.2,
        indigenousServicesOps: 0.95,
        culturalPrograms: 0.9,
        scientificResearch: 1.1,
        diplomaticRepresentation: 1.1
      }
    },
    taxExpenditures: {
      personalTaxCredits: -5,
      corporateTaxExpenditures: 10,
      gstExpenditures: -5,
      taxDeferrals: 0
    }
  }
};

/**
 * Apply a budget preset to the budget simulator.
 * @param {string} presetKey - The key of the preset to apply.
 * @param {object} store - The budget simulator store instance.
 */
export function setPreset(presetKey, store) {
  console.log(
    '%c[PRESET DEBUG] setPreset called with:',
    'background: #e74c3c; color: white; padding: 2px 5px; border-radius: 3px;',
    presetKey
  );

  const preset = budgetPresets[presetKey];

  if (!preset) {
    console.error(`Preset "${presetKey}" not found`);
    return;
  }

  // --- DEBUG LOG for preset application ---
  if (presetKey === 'businessFriendly') {
    console.log('%c[PRESET][DEBUG] Applying Business-Friendly preset', 'background: #2ecc40; color: white; padding: 2px 5px; border-radius: 3px;');
  } else {
    console.log(`%c[PRESET][DEBUG] Applying preset: ${presetKey}`, 'background: #3498db; color: white; padding: 2px 5px; border-radius: 3px;');
  }

  // Start batch update - this prevents partial sentiment updates
  if (!store.beginBatchUpdate()) {
    console.error(`Cannot apply preset "${presetKey}" - another batch update is in progress`);
    return;
  }

  try {
    // Log the initial state before applying preset
    console.log('%c[PRESET DEBUG] Initial store state:', 'color: #3498db;', {
      activePreset: store.activePreset,
      badges: store.badges.map((b) => b.title)
    });

    // Apply dramatic changes based on preset type to make sentiment more reactive
    // Adjusted (lower) multipliers for a less dramatic impact.
    const presetMultipliers = {
      austerityPlan: 1.5,
      businessFriendly: 1.3,
      balancedBudget: 1.2,
      progressiveExpansion: 1.5,
      socialSafetyNet: 1.2,
      infrastructureBuilder: 1.3,
      stimulusPackage: 1.4
    };

    // Get the multiplier for this preset (default to 1.8 if not specified)
    const presetMultiplier = presetMultipliers[presetKey] || 1.8;
    console.log(
      `%c[PRESET DEBUG] Using preset multiplier: ${presetMultiplier}`,
      'color: #f1c40f;'
    );

    // Apply revenue settings with enhanced reactivity
    console.log('%c[PRESET DEBUG] Applying revenue settings:', 'color: #3498db;');
    Object.entries(preset.revenue).forEach(([sourceId, rate]) => {
      let adjustedRate = rate;

      if (
        presetKey === "austerityPlan" &&
        (sourceId === "personalIncomeTax" || sourceId === "corporateIncomeTax")
      ) {
        adjustedRate = Math.max(rate * 0.85, rate - 3);
      } else if (
        presetKey === "progressiveExpansion" &&
        sourceId === "corporateIncomeTax"
      ) {
        adjustedRate = Math.min(rate * 1.15, rate + 3);
      }

      // Special logging for carbon tax to help diagnose the issue
      if (sourceId === "carbonPricing") {
        console.log(`%c[PRESET][CARBON TAX] Setting carbon tax to ${adjustedRate}% from preset ${presetKey}`, 
                  'background: #e74c3c; color: white; padding: 2px 5px; border-radius: 3px;');
      }

      store.updateRevenueRate(sourceId, adjustedRate);
    });

    // Apply spending settings for main categories and nested groups with enhanced reactivity
    console.log(
      '%c[PRESET DEBUG] Applying spending factors:',
      'color: #2ecc71;'
    );
    Object.entries(preset.spending).forEach(([categoryId, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([subCategoryId, factor]) => {
          const enhancedFactor = enhanceFactorForCategory(
            subCategoryId,
            factor,
            presetKey,
            presetMultiplier
          );
          store.updateSpendingFactor(subCategoryId, enhancedFactor);
        });
      } else {
        const enhancedFactor = enhanceFactorForCategory(
          categoryId,
          value,
          presetKey,
          presetMultiplier
        );
        store.updateSpendingFactor(categoryId, enhancedFactor);
      }
    });

    // Apply tax expenditure adjustments with enhanced reactivity
    console.log(
      '%c[PRESET DEBUG] Applying tax expenditure adjustments:',
      'color: #9b59b6;'
    );
    Object.entries(preset.taxExpenditures).forEach(([expenditureId, adjustment]) => {
      const enhancedAdjustment = adjustment * presetMultiplier;
      store.updateTaxExpenditureAdjustment(expenditureId, enhancedAdjustment);
    });

    // Set active preset before completing batch update
    store.activePreset = presetKey;
    
    // Update badges (part of batch completion)
    store.updateBadges();
    
    // Complete the batch update - this triggers recalculation and sentiment updates
    store.completeBatchUpdate();
    
    // Log the final state after applying preset
    console.log('%c[PRESET DEBUG] Final store state after preset applied:', 'color: #1abc9c;', {
      activePreset: store.activePreset,
      badges: store.badges.map((b) => b.title),
      stateVersion: store.stateVersion
    });
    
    console.log(`Successfully applied "${preset.label}" preset with activePreset: ${presetKey}`);
    return true;
  } catch (error) {
    console.error(`Error applying preset "${presetKey}":`, error);
    // Still complete the batch to avoid leaving the store in an inconsistent state
    store.completeBatchUpdate();
    return false;
  }
}

/**
 * Helper function to enhance spending factors based on category and preset type.
 * Uses a dampened multiplier (via Math.sqrt) for increased categories.
 */
function enhanceFactorForCategory(categoryId, factor, presetKey, multiplier) {
  const presetEmphasis = {
    austerityPlan: {
      reduce: ["healthcare", "education", "childrenAndFamilies", "supportForSeniors", "environmentAndClimateChange"],
      increase: ["defense"]
    },
    businessFriendly: {
      reduce: ["environmentAndClimateChange"],
      increase: ["economicDevelopment", "infrastructure"]
    },
    progressiveExpansion: {
      reduce: [],
      increase: ["healthcare", "education", "childrenAndFamilies", "supportForSeniors", "environmentAndClimateChange"]
    },
    socialSafetyNet: {
      reduce: [],
      increase: ["childrenAndFamilies", "supportForSeniors", "healthcare"]
    },
    infrastructureBuilder: {
      reduce: [],
      increase: ["infrastructure", "transit", "digitalGovernment"]
    },
    stimulusPackage: {
      reduce: [],
      increase: ["economicDevelopment", "infrastructure", "research"]
    }
  };

  const emphasis = presetEmphasis[presetKey];
  if (!emphasis) return factor;

  if (emphasis.reduce.includes(categoryId)) {
    return Math.max(0.1, factor * 0.7);
  } else if (emphasis.increase.includes(categoryId)) {
    // Apply a dampened multiplier using the square root for less dramatic changes
    return factor * Math.sqrt(multiplier);
  }
  
  return factor * (multiplier > 1 ? Math.sqrt(multiplier) : 1);
}
