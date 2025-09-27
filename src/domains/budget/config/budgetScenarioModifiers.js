/**
 * Budget Scenario Modifiers
 * 
 * Simplified sentiment modifiers for budget presets.
 * Each modifier ranges from -2.0 to +2.0, where:
 * -2.0: Strongly negative
 * -1.0: Negative
 *  0.0: Neutral
 * +1.0: Positive
 * +2.0: Strongly positive
 */

export const budgetScenarioModifiers = {
  // ===== BALANCED BUDGET =====
  balancedBudget: {
    label: "⚖️ Balanced Budget",
    description: "budgetScenarios.balancedBudget.description",
    provinces: {
      Ontario: 1.0,           // Positive
      Quebec: 0.0,            // Neutral
      "British Columbia": 0.5, // Slightly positive
      Alberta: 1.0,           // Positive
      Saskatchewan: 1.0,      // Positive
      Manitoba: 0.5,          // Slightly positive
      NovaScotia: 0.0,        // Neutral
      NewBrunswick: 0.0,      // Neutral
      "Prince Edward Island": 0.0, // Neutral
      "Newfoundland and Labrador": 0.0, // Neutral
      Yukon: 0.0,            // Neutral
      "Northwest Territories": 0.0, // Neutral
      Nunavut: 0.0           // Neutral
    },
    demographics: {
      youth: 0.0,            // Neutral
      seniors: 0.5,          // Slightly positive
      families: 0.5,         // Slightly positive
      workers: 1.0,          // Positive
      students: 0.0,         // Neutral
      urban: 0.5,            // Slightly positive
      rural: 1.0,            // Positive
      indigenous: 0.0        // Neutral
    },
    sectors: {
      business: 1.0,         // Positive
      manufacturing: 0.5,    // Slightly positive
      technology: 0.0,       // Neutral
      environment: 0.0,      // Neutral
      healthcare: 0.5,       // Slightly positive
      defense: 0.5,          // Slightly positive
      education: 0.0,        // Neutral
      energy: 0.5,          // Slightly positive
      publicSector: 0.0,     // Neutral
      creativeIndustries: 0.0, // Neutral
      tourism: 0.5,         // Slightly positive
      agriculture: 0.5,     // Slightly positive
      indigenous: 0.0       // Neutral
    }
  },

  // ===== PROGRESSIVE EXPANSION =====
  progressiveExpansion: {
    label: "🌱 Progressive Expansion",
    description: "budgetScenarios.socialPrograms.description",
    provinces: {
      Ontario: 1.0,          // Positive
      Quebec: 1.0,           // Positive
      "British Columbia": 1.0, // Positive
      Alberta: -1.0,         // Negative
      Saskatchewan: -1.0,    // Negative
      Manitoba: 0.0,         // Neutral
      NovaScotia: 1.0,       // Positive
      NewBrunswick: 1.0,     // Positive
      "Prince Edward Island": 1.0, // Positive
      "Newfoundland and Labrador": 1.0, // Positive
      Yukon: 1.0,           // Positive
      "Northwest Territories": 1.0, // Positive
      Nunavut: 1.0          // Positive
    },
    demographics: {
      youth: 1.0,           // Positive
      seniors: 1.0,         // Positive
      families: 1.0,        // Positive
      workers: 0.5,         // Slightly positive
      students: 1.0,        // Positive
      urban: 1.0,           // Positive
      rural: -0.5,          // Slightly negative
      indigenous: 1.0       // Positive
    },
    sectors: {
      // Core sectors with maximum positive impact
      education: 2.0,       // Strongly positive - Major investments in education, research, and student support
      creativeIndustries: 2.0, // Strongly positive - Strong support for arts, culture, and creative sector development
      publicSector: 2.0,    // Strongly positive - Major expansion of public services and infrastructure
      healthcare: 2.0,      // Strongly positive - Significant healthcare investments
      environment: 2.0,     // Strongly positive - Major climate and environmental initiatives
      
      // Supporting sectors with strong positive impact
      technology: 1.5,      // Very positive - Digital infrastructure and innovation support
      indigenous: 1.5,      // Very positive - Strong support for indigenous initiatives
      
      // Sectors with moderate positive impact
      tourism: 1.0,         // Positive - Cultural and infrastructure investments
      agriculture: 1.0,     // Positive - Support for sustainable agriculture
      
      // Neutral sectors
      business: 0.0,        // Neutral - Balanced approach to business support
      manufacturing: 0.0,   // Neutral - No significant impact
      defense: 0.0,         // Neutral - No significant impact
      energy: 0.0          // Neutral - Balanced energy transition approach
    }
  },

  // ===== INFRASTRUCTURE BUILDER =====
  infrastructureBuilder: {
    label: "🏗️ Infrastructure Builder",
    description: "budgetScenarios.infrastructure.description",
    provinces: {
      Ontario: 0.0,          // Neutral
      Quebec: 1.0,           // Positive
      "British Columbia": 1.0, // Positive
      Alberta: -0.5,         // Slightly negative
      Saskatchewan: -0.5,    // Slightly negative
      Manitoba: 1.0,         // Positive
      NovaScotia: 1.0,       // Positive
      NewBrunswick: 1.0,     // Positive
      "Prince Edward Island": 1.0, // Positive
      "Newfoundland and Labrador": 1.0, // Positive
      Yukon: 1.0,           // Positive
      "Northwest Territories": 1.0, // Positive
      Nunavut: 1.0          // Positive
    },
    demographics: {
      youth: 0.0,           // Neutral
      seniors: 0.0,         // Neutral
      families: 0.5,        // Slightly positive
      workers: 1.0,         // Positive
      students: 0.0,        // Neutral
      urban: 1.0,           // Positive
      rural: 1.0,           // Positive
      indigenous: 1.0       // Positive
    },
    sectors: {
      business: 1.0,        // Positive
      manufacturing: 1.0,   // Positive
      technology: 0.5,      // Slightly positive
      environment: 0.5,     // Slightly positive
      healthcare: 0.0,      // Neutral
      defense: 0.0,         // Neutral
      education: 0.0,       // Neutral
      energy: 0.5,         // Slightly positive
      publicSector: 0.5,   // Slightly positive
      creativeIndustries: 0.0, // Neutral
      tourism: 0.5,        // Slightly positive
      agriculture: 0.5,    // Slightly positive
      indigenous: 1.0      // Positive
    }
  },

  // ===== BUSINESS FRIENDLY =====
  businessFriendly: {
    label: "💼 Business Friendly",
    description: "budgetScenarios.businessFriendly.description",
    provinces: {
      Alberta: 1.0,          // Positive
      Saskatchewan: 1.0,     // Positive
      Ontario: 0.5,          // Slightly positive
      "British Columbia": 0.0, // Neutral
      Manitoba: 0.0,         // Neutral
      "Northwest Territories": 0.0, // Neutral
      Yukon: 0.0,           // Neutral
      Nunavut: 0.0,         // Neutral
      "Newfoundland and Labrador": 0.0, // Neutral
      NovaScotia: 0.0,      // Neutral
      NewBrunswick: 0.0,    // Neutral
      "Prince Edward Island": 0.0, // Neutral
      Quebec: 0.0           // Neutral
    },
    demographics: {
      rural: 0.5,           // Slightly positive
      seniors: 0.0,         // Neutral
      workers: 0.0,         // Neutral
      families: 0.0,        // Neutral
      urban: 0.0,           // Neutral
      indigenous: 0.0,      // Neutral
      youth: 0.0,           // Neutral
      students: 0.0         // Neutral
    },
    sectors: {
      business: 2.0,        // Strongly positive
      agriculture: 0.5,     // Slightly positive
      energy: 0.5,         // Slightly positive
      manufacturing: 0.5,  // Slightly positive
      technology: 0.5,     // Slightly positive
      defense: 0.0,        // Neutral
      tourism: 0.0,        // Neutral
      healthcare: 0.0,     // Neutral
      education: 0.0,      // Neutral
      publicSector: 0.0,   // Neutral
      creativeIndustries: 0.0, // Neutral
      indigenous: 0.0,     // Neutral
      environment: 0.0     // Neutral
    }
  },

  // ===== GREEN GROWTH STIMULUS =====
  greenGrowthStimulus: {
    label: "🌿 Green Growth Stimulus",
    description: "budgetScenarios.climateForward.description",
    provinces: {
      "British Columbia": 1.0, // Positive
      Quebec: 1.0,          // Positive
      Ontario: 0.5,         // Slightly positive
      "Newfoundland and Labrador": 0.5, // Slightly positive
      Manitoba: 0.5,        // Slightly positive
      "Prince Edward Island": 0.5, // Slightly positive
      NovaScotia: 0.5,      // Slightly positive
      NewBrunswick: 0.5,    // Slightly positive
      Yukon: 0.5,          // Slightly positive
      "Northwest Territories": 0.5, // Slightly positive
      Nunavut: 0.5,        // Slightly positive
      Saskatchewan: -1.0,   // Negative
      Alberta: -1.0        // Negative
    },
    demographics: {
      youth: 1.0,          // Positive
      students: 1.0,       // Positive
      urban: 1.0,          // Positive
      families: 0.5,       // Slightly positive
      seniors: 0.0,        // Neutral
      workers: 0.0,        // Neutral
      rural: -0.5,         // Slightly negative
      indigenous: 1.0      // Positive
    },
    sectors: {
      environment: 2.0,    // Strongly positive
      indigenous: 1.0,     // Positive
      technology: 1.0,     // Positive
      healthcare: 0.5,     // Slightly positive
      education: 0.5,      // Slightly positive
      publicSector: 0.5,   // Slightly positive
      tourism: 0.5,        // Slightly positive
      defense: 0.0,        // Neutral
      manufacturing: 0.0,  // Neutral
      business: 0.0,       // Neutral
      energy: 0.0,         // Neutral
      agriculture: 0.0,    // Neutral
      creativeIndustries: 0.0 // Neutral
    }
  },

  // ===== SECURITY FIRST =====
  securityFirst: {
    label: "🛡️ Security First",
    description: "budgetScenarios.nationalSecurity.description",
    provinces: {
      Alberta: 1.0,         // Positive
      Saskatchewan: 1.0,    // Positive
      Manitoba: 0.5,        // Slightly positive
      Yukon: 0.5,          // Slightly positive
      "Northwest Territories": 0.5, // Slightly positive
      Nunavut: 0.5,        // Slightly positive
      NovaScotia: 0.0,     // Neutral
      NewBrunswick: 0.0,   // Neutral
      "Prince Edward Island": 0.0, // Neutral
      "Newfoundland and Labrador": 0.0, // Neutral
      Ontario: 0.0,        // Neutral
      "British Columbia": 0.0, // Neutral
      Quebec: -0.5         // Slightly negative
    },
    demographics: {
      rural: 0.5,          // Slightly positive
      seniors: 0.5,        // Slightly positive
      workers: 0.0,        // Neutral
      families: 0.0,       // Neutral
      urban: 0.0,          // Neutral
      indigenous: 0.0,     // Neutral
      students: 0.0,       // Neutral
      youth: 0.0          // Neutral
    },
    sectors: {
      defense: 2.0,        // Strongly positive
      publicSector: 1.0,   // Positive
      business: 0.5,       // Slightly positive
      manufacturing: 0.5,  // Slightly positive
      technology: 0.5,     // Slightly positive
      energy: 0.0,         // Neutral
      tourism: 0.0,        // Neutral
      agriculture: 0.0,    // Neutral
      education: 0.0,      // Neutral
      healthcare: 0.0,     // Neutral
      environment: 0.0,    // Neutral
      creativeIndustries: 0.0, // Neutral
      indigenous: 0.0      // Neutral
    }
  },

  // ===== AUSTERITY PLAN =====
  austerityPlan: {
    label: "✂️ Austerity Plan",
    description: "budgetScenarios.fiscalDiscipline.description",
    provinces: {
      Ontario: 0.0,         // Neutral
      Quebec: -0.5,         // Slightly negative
      "British Columbia": -0.5, // Slightly negative
      Alberta: 1.0,         // Positive
      Saskatchewan: 0.5,    // Slightly positive
      Manitoba: -0.5,       // Slightly negative
      NovaScotia: -1.0,     // Negative
      NewBrunswick: -1.0,   // Negative
      "Prince Edward Island": -1.0, // Negative
      "Newfoundland and Labrador": -1.0, // Negative
      Yukon: -1.0,         // Negative
      "Northwest Territories": -1.0, // Negative
      Nunavut: -1.0        // Negative
    },
    demographics: {
      youth: -1.0,         // Negative
      seniors: -0.5,       // Slightly negative
      families: -0.5,      // Slightly negative
      workers: 0.0,        // Neutral
      students: -1.0,      // Negative
      urban: -0.5,         // Slightly negative
      rural: 0.0,          // Neutral
      indigenous: -0.5     // Slightly negative
    },
    sectors: {
      business: 0.5,       // Slightly positive
      manufacturing: 0.0,  // Neutral
      technology: 0.0,     // Neutral
      environment: 0.0,    // Neutral
      healthcare: 0.0,     // Neutral
      defense: 0.0,        // Neutral
      education: 0.0,      // Neutral
      energy: 0.0,         // Neutral
      publicSector: 0.0,   // Neutral
      creativeIndustries: 0.0, // Neutral
      tourism: 0.0,        // Neutral
      agriculture: 0.0,    // Neutral
      indigenous: 0.0      // Neutral
    }
  }
};
