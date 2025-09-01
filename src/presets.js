// Change tracking is now handled by the store itself

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
      personalIncomeTax: 21.5,    // Increased from 21 to ensure sufficient revenue
      corporateIncomeTax: 15.5,   // Increased from 15 to ensure sufficient revenue
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
      healthcare: 0.95,           // Slightly reduced to help balance
      education: 0.95,            // Slightly reduced to help balance
      childrenAndFamilies: 0.95,  // Slightly reduced to help balance
      supportForSeniors: 0.95,    // Slightly reduced to help balance
      indigenousServices: 0.95,   // Slightly reduced to help balance
      defense: 0.95,              // Slightly reduced to help balance
      scienceAndInnovation: 0.95, // Slightly reduced to help balance
      infrastructure: 0.95,       // Slightly reduced to help balance
      digitalGovernment: 0.95,    // Slightly reduced to help balance
      environmentAndClimateChange: 0.95, // Slightly reduced to help balance
      carbonPricing: 0.95,        // Slightly reduced to help balance
      agriculture: 0.95,          // Slightly reduced to help balance
      internationalDevelopment: 0.95, // Slightly reduced to help balance
      culturalPrograms: 0.95,     // Slightly reduced to help balance
      transit: 0.95,              // Slightly reduced to help balance
      economicDevelopment: 0.95,  // Slightly reduced to help balance
      indigenousOperations: 0.95, // Slightly reduced to help balance
      diplomaticRepresentation: 0.95, // Slightly reduced to help balance
      loansInvestments: {
        studentLoans: 0.95,
        agricultureLoans: 0.95,
        internationalDevelopment: 0.95,
        businessInnovation: 0.95,
        defenseSector: 0.95,
        economicDevelopment: 0.95
      },
      governmentOperations: {
        transportationInfrastructure: 0.95,
        environmentalPrograms: 0.95,
        publicSafetyEmergency: 0.95,
        governmentBuildings: 0.95,
        researchInnovation: 0.95,
        digitalGovernment: 0.95,
        federalEmployeeSalaries: 0.95,
        legalJusticeSystem: 0.95,
        indigenousServicesOps: 0.95,
        culturalPrograms: 0.95,
        scientificResearch: 0.95,
        diplomaticRepresentation: 0.95
      }
    },
    taxExpenditures: {
      personalTaxCredits: -5,     // Reduced tax credits to help balance
      corporateTaxExpenditures: -5, // Reduced tax credits to help balance
      gstExpenditures: -5,        // Reduced tax credits to help balance
      taxDeferrals: -5            // Reduced tax deferrals to help balance
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
      "An economic growth-focused approach that uses strategic deficits to stimulate the economy while staying under the $50B deficit threshold. This preset is designed to earn the 'Stimulus Commander' and 'Stimulus Engineer' badges.",
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
      corporateIncomeTax: 11.5, // Reduced from 13.5 to be more business-friendly
      gst: 5,
      exciseTaxes: 2.5,
      carbonPricing: 0, // Eliminated carbon tax to be truly business-friendly
      eiPremiums: 1.4,
      customsDuties: 0.9,
      crownProfits: 2.5,
      nonTaxRevenue: 3.4,
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
      economicDevelopment: 1.1,
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
      corporateTaxExpenditures: 15, // Changed from -15 to +15 to increase tax credits
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
  
  // Change tracking is handled automatically by store during batch operations

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

    // Demographic-specific multipliers for different presets
    const demographicMultipliers = {
      austerityPlan: {
        seniors: 1.2,      // Seniors more sensitive to austerity
        families: 1.3,     // Families strongly affected by cuts
        youth: 1.4,        // Youth most affected by austerity
        workers: 1.2,      // Workers affected by job cuts
        students: 1.3,     // Students affected by education cuts
        indigenousPeoples: 1.3, // Indigenous services often cut
        veterans: 1.2      // Veterans services often cut
      },
      businessFriendly: {
        smallBusinessOwners: 1.4, // Strong positive for small business
        techWorkers: 1.3,         // Good for tech sector
        workers: 1.2,             // Generally positive for workers
        renters: 1.1,             // Slightly positive for renters
        youth: 1.2                // Good for job creation
      },
      progressiveExpansion: {
        families: 1.4,            // Strong support for families
        youth: 1.3,               // Good for youth programs
        seniors: 1.2,             // Support for seniors
        indigenousPeoples: 1.3,    // Support for indigenous services
        renters: 1.3,             // Housing support
        workers: 1.2              // Worker support
      },
      greenGrowthStimulus: {
        youth: 1.4,               // Strong climate action
        urban: 1.3,               // Urban environmental programs
        rural: 1.2,               // Rural environmental programs
        indigenousPeoples: 1.3,    // Indigenous environmental stewardship
        workers: 1.2              // Green jobs
      },
      securityFirst: {
        veterans: 1.4,            // Strong support for veterans
        seniors: 1.2,             // Security concerns
        families: 1.2,            // Family security
        workers: 1.1              // Defense jobs
      }
    };

    // Get the demographic multipliers for this preset
    const demoMultipliers = demographicMultipliers[presetKey] || {};

    // Province-specific multipliers for different presets
    const provinceMultipliers = {
      austerityPlan: {
        Ontario: 1.2,      // Sensitive to economic competitiveness
        Quebec: 1.3,       // Strong reaction to social program cuts
        BritishColumbia: 1.2, // Environmental concerns
        Alberta: 1.4,      // Strong reaction to carbon pricing
        Manitoba: 1.1,     // Moderate reaction
        Saskatchewan: 1.3,  // Resource sector sensitivity
        NovaScotia: 1.2,   // Healthcare sensitivity
        NewBrunswick: 1.1,  // Moderate reaction
        Nunavut: 1.3,      // Indigenous services sensitivity
        "Prince Edward Island": 1.1, // Moderate reaction
        "Newfoundland and Labrador": 1.2, // Resource sensitivity
        "Northwest Territories": 1.2, // Indigenous services
        Yukon: 1.1         // Moderate reaction
      },
      businessFriendly: {
        Ontario: 1.4,      // Strong positive for business
        Quebec: 1.2,       // Moderate business support
        BritishColumbia: 1.3, // Tech sector boost
        Alberta: 1.5,      // Strong resource sector support
        Manitoba: 1.2,     // Moderate support
        Saskatchewan: 1.3,  // Resource sector support
        NovaScotia: 1.1,   // Moderate support
        NewBrunswick: 1.2,  // Moderate support
        Nunavut: 1.1,      // Limited impact
        "Prince Edward Island": 1.1, // Limited impact
        "Newfoundland and Labrador": 1.2, // Resource support
        "Northwest Territories": 1.2, // Resource support
        Yukon: 1.1         // Limited impact
      },
      progressiveExpansion: {
        Ontario: 1.3,      // Urban support
        Quebec: 1.4,       // Strong social program support
        BritishColumbia: 1.3, // Environmental support
        Alberta: 1.1,      // Limited support
        Manitoba: 1.2,     // Moderate support
        Saskatchewan: 1.1,  // Limited support
        NovaScotia: 1.3,   // Healthcare support
        NewBrunswick: 1.2,  // Moderate support
        Nunavut: 1.4,      // Indigenous support
        "Prince Edward Island": 1.2, // Moderate support
        "Newfoundland and Labrador": 1.2, // Moderate support
        "Northwest Territories": 1.3, // Indigenous support
        Yukon: 1.3         // Environmental support
      },
      greenGrowthStimulus: {
        Ontario: 1.3,      // Urban environmental support
        Quebec: 1.4,       // Strong climate action
        BritishColumbia: 1.5, // Environmental leadership
        Alberta: 1.1,      // Limited support
        Manitoba: 1.2,     // Moderate support
        Saskatchewan: 1.1,  // Limited support
        NovaScotia: 1.3,   // Coastal climate action
        NewBrunswick: 1.2,  // Moderate support
        Nunavut: 1.3,      // Indigenous stewardship
        "Prince Edward Island": 1.2, // Moderate support
        "Newfoundland and Labrador": 1.2, // Moderate support
        "Northwest Territories": 1.3, // Indigenous stewardship
        Yukon: 1.4         // Environmental leadership
      },
      securityFirst: {
        Ontario: 1.2,      // Urban security
        Quebec: 1.2,       // Moderate support
        BritishColumbia: 1.2, // Coastal security
        Alberta: 1.3,      // Resource security
        Manitoba: 1.1,     // Moderate support
        Saskatchewan: 1.1,  // Moderate support
        NovaScotia: 1.3,   // Maritime security
        NewBrunswick: 1.2,  // Moderate support
        Nunavut: 1.4,      // Arctic security
        "Prince Edward Island": 1.1, // Limited impact
        "Newfoundland and Labrador": 1.3, // Maritime security
        "Northwest Territories": 1.4, // Arctic security
        Yukon: 1.3         // Arctic security
      }
    };

    // Get the province multipliers for this preset
    const provMultipliers = provinceMultipliers[presetKey] || {};

    // Sector-specific multipliers for different presets
    const sectorMultipliers = {
      businessFriendly: {
        business: 1.4,        // General business sector
        realEstate: 1.5,      // Increased from 1.3 to 1.5 for stronger real estate response
        finance: 1.5,         // Increased from 1.3 to 1.5 for stronger finance response
        technology: 1.3,      // Tech sector
        manufacturing: 1.3,   // Manufacturing sector
        energy: 1.4,         // Energy sector
        agriculture: 1.2,     // Agriculture sector
        tourism: 1.2,        // Tourism sector
        creativeIndustries: 1.2, // Creative industries
        publicSector: 1.1     // Public sector
      }
    };

    // Get the sector multipliers for this preset
    const activeSectorMultipliers = sectorMultipliers[presetKey] || {};

    // Apply revenue settings with enhanced reactivity
    console.log('%c[PRESET DEBUG] Applying revenue settings:', 'color: #3498db;');
    Object.entries(preset.revenue).forEach(([sourceId, rate]) => {
      let adjustedRate = rate;

      // Apply sector-specific adjustments to revenue rates
      if (sourceId === "corporateIncomeTax") {
        if (presetKey === "businessFriendly") {
          // Stronger reduction for business-friendly sectors
          const sectorFactor = Math.max(
            ...Object.entries(activeSectorMultipliers)
              .filter(([sector]) => ['business', 'realEstate', 'finance'].includes(sector))
              .map(([, factor]) => factor)
          );
          adjustedRate = Math.max(rate * 0.75, rate - (2.5 * sectorFactor));
        }
      } else if (sourceId === "carbonPricing") {
        if (presetKey === "greenGrowthStimulus") {
          // Stronger increase for environmentally conscious sectors
          const sectorFactor = Math.max(
            ...Object.entries(activeSectorMultipliers)
              .filter(([sector]) => ['energy', 'agriculture', 'tourism'].includes(sector))
              .map(([, factor]) => factor)
          );
          adjustedRate = Math.min(rate * 1.2, rate + (1 * sectorFactor));
        }
      }

      console.log('%c[PRESET DEBUG] Applying revenue rate:', 'background: #e74c3c; color: white; padding: 2px 5px;', {
        sourceId,
        originalRate: rate,
        adjustedRate,
        presetKey
      });
      
      store.updateRevenueRate(sourceId, adjustedRate);
    });

    // Apply spending settings with sector-specific adjustments
    // Map preset spending keys to store category IDs where names differ
    const spendingAliasMap = {
      // Top-level main spending
      supportForSeniors: 'seniors',
      childrenAndFamilies: 'childrenFamilies',
      defense: 'defensePublicSafety',
      // Government operations (children)
      environmentAndClimateChange: 'environmentalPrograms',
      scienceAndInnovation: 'researchInnovation',
      infrastructure: 'transportationInfrastructure',
      transit: 'transportationInfrastructure',
      culturalPrograms: 'culturalHeritage',
      indigenousOperations: 'indigenousServicesOps',
      // Approximate mappings
      agriculture: 'agricultureLoans',
      // carbonPricing appears only as revenue; skip mapping to spending
    };
    const mapSpendingKey = (key) => spendingAliasMap[key] || key;

    console.log('%c[PRESET DEBUG] Applying spending factors:', 'color: #2ecc71;');
    Object.entries(preset.spending).forEach(([categoryId, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([subCategoryId, factor]) => {
          const mappedSubId = mapSpendingKey(subCategoryId);
          const enhancedFactor = enhanceFactorForCategory(
            mappedSubId,
            factor,
            presetKey,
            demoMultipliers,
            provMultipliers,
            activeSectorMultipliers
          );
          if (mappedSubId !== 'carbonPricing') {
            store.updateSpendingFactor(mappedSubId, enhancedFactor);
          } else {
            console.warn('[PRESET DEBUG] Skipping spending key mapped to revenue-only source:', subCategoryId);
          }
        });
      } else {
        const mappedId = mapSpendingKey(categoryId);
        const enhancedFactor = enhanceFactorForCategory(
          mappedId,
          value,
          presetKey,
          demoMultipliers,
          provMultipliers,
          activeSectorMultipliers
        );
        if (mappedId !== 'carbonPricing') {
          store.updateSpendingFactor(mappedId, enhancedFactor);
        } else {
          console.warn('[PRESET DEBUG] Skipping spending key mapped to revenue-only source:', categoryId);
        }
      }
    });

    // Apply tax expenditure adjustments with enhanced reactivity
    console.log(
      '%c[PRESET DEBUG] Applying tax expenditure adjustments:',
      'color: #9b59b6;'
    );
    Object.entries(preset.taxExpenditures).forEach(([expenditureId, adjustment]) => {
      // Apply demographic-specific adjustments to tax expenditures
      let enhancedAdjustment = adjustment;
      if (expenditureId === "personalTaxCredits") {
        if (presetKey === "progressiveExpansion") {
          enhancedAdjustment = Math.max(adjustment * 1.2, adjustment + 5);
        } else if (presetKey === "austerityPlan") {
          enhancedAdjustment = Math.min(adjustment * 0.8, adjustment - 5);
        }
      }
      store.updateTaxExpenditureAdjustment(expenditureId, enhancedAdjustment);
    });

    // Set active preset before completing batch update
    store.activePreset = presetKey;
    
    // Track the preset application
    store.trackPresetApplication(presetKey, preset.label);
    
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
 * Helper function to enhance spending factors based on category, demographic, province, and sector multipliers.
 */
function enhanceFactorForCategory(categoryId, factor, presetKey, demoMultipliers, provMultipliers, sectorMultipliers) {
  // Map categories to relevant sectors
  const categorySectors = {
    infrastructure: ['realEstate', 'business', 'finance'],
    economicDevelopment: ['business', 'finance', 'realEstate'],
    digitalGovernment: ['technology', 'finance', 'business'],
    housing: ['realEstate', 'finance', 'business'],
    transit: ['realEstate', 'business'],
    environmentAndClimateChange: ['realEstate', 'business'],
    publicSafety: ['realEstate', 'business'],
    loansInvestments: ['finance', 'business', 'realEstate'],
    businessInnovation: ['business', 'finance', 'technology'],
    defenseSector: ['business', 'finance']
  };

  // Get relevant sectors for this category
  const relevantSectors = categorySectors[categoryId] || [];
  
  // Calculate the average multiplier from relevant sectors
  let totalSectorMultiplier = 1.0;
  let sectorCount = 0;
  
  relevantSectors.forEach(sector => {
    if (sectorMultipliers[sector]) {
      totalSectorMultiplier *= sectorMultipliers[sector];
      sectorCount++;
    }
  });

  // Apply the geometric mean of relevant sector multipliers
  const finalSectorMultiplier = sectorCount > 0 ? Math.pow(totalSectorMultiplier, 1/sectorCount) : 1.0;
  
  // Map categories to relevant provinces
  const categoryProvinces = {
    healthcare: ['Ontario', 'Quebec', 'NovaScotia', 'NewBrunswick'],
    education: ['Ontario', 'Quebec', 'BritishColumbia'],
    childrenAndFamilies: ['Quebec', 'Ontario', 'BritishColumbia'],
    supportForSeniors: ['NovaScotia', 'NewBrunswick', 'Ontario'],
    indigenousServices: ['Nunavut', 'NorthwestTerritories', 'Yukon'],
    defense: ['NovaScotia', 'Newfoundland and Labrador', 'NorthwestTerritories'],
    scienceAndInnovation: ['Ontario', 'BritishColumbia', 'Quebec'],
    infrastructure: ['Ontario', 'Alberta', 'BritishColumbia'],
    digitalGovernment: ['Ontario', 'BritishColumbia', 'Quebec'],
    environmentAndClimateChange: ['BritishColumbia', 'Quebec', 'Yukon'],
    carbonPricing: ['Alberta', 'Saskatchewan', 'BritishColumbia'],
    agriculture: ['Saskatchewan', 'Manitoba', 'Alberta'],
    internationalDevelopment: ['Ontario', 'Quebec', 'BritishColumbia'],
    culturalPrograms: ['Quebec', 'Ontario', 'BritishColumbia'],
    transit: ['Ontario', 'Quebec', 'BritishColumbia'],
    economicDevelopment: ['Ontario', 'Alberta', 'BritishColumbia']
  };

  // Get relevant provinces for this category
  const relevantProvinces = categoryProvinces[categoryId] || [];
  
  // Calculate the average multiplier from relevant provinces
  let totalProvMultiplier = 1.0;
  let provCount = 0;
  
  relevantProvinces.forEach(province => {
    if (provMultipliers[province]) {
      totalProvMultiplier *= provMultipliers[province];
      provCount++;
    }
  });

  // Apply the geometric mean of relevant province multipliers
  const finalProvMultiplier = provCount > 0 ? Math.pow(totalProvMultiplier, 1/provCount) : 1.0;
  
  // Map categories to relevant demographics
  const categoryDemographics = {
    healthcare: ['seniors', 'families', 'indigenousPeoples', 'veterans'],
    education: ['youth', 'students', 'families'],
    childrenAndFamilies: ['families', 'youth'],
    supportForSeniors: ['seniors', 'veterans'],
    indigenousServices: ['indigenousPeoples'],
    defense: ['veterans', 'workers'],
    scienceAndInnovation: ['techWorkers', 'students'],
    infrastructure: ['workers', 'urban', 'rural'],
    digitalGovernment: ['techWorkers', 'urban'],
    environmentAndClimateChange: ['youth', 'urban', 'rural'],
    housing: ['renters', 'families', 'youth'],
    transit: ['urban', 'workers', 'students'],
    economicDevelopment: ['workers', 'smallBusinessOwners'],
    mentalHealth: ['youth', 'veterans', 'seniors'],
    culturalPrograms: ['indigenousPeoples', 'urban'],
    skillsDevelopment: ['workers', 'youth', 'students']
  };

  // Get relevant demographics for this category
  const relevantDemos = categoryDemographics[categoryId] || [];
  
  // Calculate the average multiplier from relevant demographics
  let totalDemoMultiplier = 1.0;
  let demoCount = 0;
  
  relevantDemos.forEach(demo => {
    if (demoMultipliers[demo]) {
      totalDemoMultiplier *= demoMultipliers[demo];
      demoCount++;
    }
  });

  const finalDemoMultiplier = demoCount > 0 ? Math.pow(totalDemoMultiplier, 1/demoCount) : 1.0;
  
  // Combine all multipliers (sector, province, and demographic)
  const finalMultiplier = Math.pow(
    finalSectorMultiplier * finalProvMultiplier * finalDemoMultiplier,
    1/3
  );
  
  // Apply the multiplier with dampening for increases
  if (factor > 1) {
    return factor * Math.sqrt(finalMultiplier);
  } else if (factor < 1) {
    return factor * finalMultiplier;
  }
  return factor;
}
