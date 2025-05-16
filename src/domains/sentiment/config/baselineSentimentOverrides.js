/**
 * Baseline Sentiment Overrides for 2023-2024 Federal Budget
 * 
 * This file defines baseline sentiment scores that reflect the current public opinion
 * about the federal budget, with particular attention to growing concerns around
 * deficits and public spending.
 * 
 * Each group is assigned:
 *   - baselineScore: The default sentiment (1-5 scale, 3 is neutral) before any budget changes
 *   - deficitSensitivity: How much the group's sentiment drops per $20B of deficit above $40B
 *   - debtRatioSensitivity: How much the group's sentiment drops per 10% of debt-to-GDP ratio above 45%
 * 
 * These values reflect realistic regional, demographic, and sectoral reactions to the
 * current fiscal situation in Canada.
 */

export const baselineSentimentOverrides = {
  // ===== PROVINCES =====
  provinces: {
    // Western provinces - most deficit-sensitive
    Alberta: {
      baselineScore: 2.8,        // Moderately concerned, slightly below neutral
      deficitSensitivity: 0.065307,   // Reduced by 15% + 20% boost
      debtRatioSensitivity: 0.074637  // Reduced by 15% + 20% boost
    },
    Saskatchewan: {
      baselineScore: 2.9,        // Slightly below neutral
      deficitSensitivity: 0.018659,   // Reduced by 15% + 20% boost
      debtRatioSensitivity: 0.026656  // Reduced by 15% + 20% boost
    },
    Manitoba: {
      baselineScore: 3.0,        // Neutral
      deficitSensitivity: 0.026123,   // Reduced by 15%
      debtRatioSensitivity: 0.055978  // Reduced by 15%
    },
    BritishColumbia: {
      baselineScore: 2.9,        // Mixed sentiment (urban vs rural divide)
      deficitSensitivity: 0.12495,   // Reduced by 15%
      debtRatioSensitivity: 0.12495  // Reduced by 15%
    },
    
    // Central Canada - mixed sentiment
    Ontario: {
      baselineScore: 3.0,        // Minimum possible for lowest sentiment
      deficitSensitivity: 0.035715,  // Reduced by 15%
      debtRatioSensitivity: 0.030613  // Reduced by 15%
    },
    Quebec: {
      baselineScore: 3.2,        // More tolerant of deficits for social programs
      deficitSensitivity: 0.0833,   // Reduced by 15%
      debtRatioSensitivity: 0.0833  // Reduced by 15%
    },
    
    // Atlantic provinces - more dependent on federal transfers
    NovaScotia: {
      baselineScore: 3.8,        // Generally supportive of federal spending
      deficitSensitivity: 0.04165,   // Reduced by 15%
      debtRatioSensitivity: 0.04165  // Reduced by 15%
    },
    NewBrunswick: {
      baselineScore: 3.6,        // Supportive of federal spending
      deficitSensitivity: 0.05831,   // Reduced by 15%
      debtRatioSensitivity: 0.020409  // Reduced by 15%
    },
    "Prince Edward Island": {
      baselineScore: 3.7,        // Supportive of federal spending
      deficitSensitivity: 0.04165,   // Reduced by 15%
      debtRatioSensitivity: 0.04165  // Reduced by 15%
    },
    "Newfoundland and Labrador": {
      baselineScore: 3.5,        // Supportive but with some concerns
      deficitSensitivity: 0.0833,   // Reduced by 15%
      debtRatioSensitivity: 0.0833  // Reduced by 15%
    },
    
    // Northern territories - highly dependent on federal support
    Yukon: {
      baselineScore: 3.4,
      deficitSensitivity: 0.04165,   // Reduced by 15%
      debtRatioSensitivity: 0.04165  // Reduced by 15%
    },
    "Northwest Territories": {
      baselineScore: 3.5,
      deficitSensitivity: 0.04165,   // Reduced by 15%
      debtRatioSensitivity: 0.04165  // Reduced by 15%
    },
    Nunavut: {
      baselineScore: 3.6,
      deficitSensitivity: 0.04165,   // Reduced by 15%
      debtRatioSensitivity: 0.04165  // Reduced by 15%
    }
  },
  
  // ===== DEMOGRAPHICS =====
  demographics: {
    youth: {
      baselineScore: 3.5,        // Generally supportive but concerned about future debt
      deficitSensitivity: 0.1715,   // Reduced by another 30%
      debtRatioSensitivity: 0.196  // Reduced by another 30%
    },
    seniors: {
      baselineScore: 3,        // Concerned about fiscal sustainability
      deficitSensitivity: 0.14406,   // Reduced by another 30%
      debtRatioSensitivity: 0.12005  // Reduced by another 30%
    },
    families: {
      baselineScore: 3.0,        // Mixed sentiment based on income level
      deficitSensitivity: 0.21,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    workers: {
      baselineScore: 2.9,        // Slightly concerned
      deficitSensitivity: 0.28,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    students: {
      baselineScore: 3.4,        // Generally supportive of spending on education
      deficitSensitivity: 0.098,   // Reduced by 30%
      debtRatioSensitivity: 0.1029  // Reduced by another 30%
    },
    urban: {
      baselineScore: 3.2,        // More supportive of federal programs
      deficitSensitivity: 0.14,   // Reduced by 30%
      debtRatioSensitivity: 0.14  // Reduced by 30%
    },
    rural: {
      baselineScore: 2.4,        // More concerned about spending
      deficitSensitivity: 0.35,   // Reduced by 30%
      debtRatioSensitivity: 0.28  // Reduced by 30%
    },
    indigenous: {
      baselineScore: 3.0,        // Supportive of increased federal investment
      deficitSensitivity: 0.07,   // Reduced by 30%
      debtRatioSensitivity: 0.07  // Reduced by 30%
    },
    techWorkers: {
      baselineScore: 3.1,        // Generally supportive of innovation spending
      deficitSensitivity: 0.07203,   // Reduced by another 30%
      debtRatioSensitivity: 0.04802  // Reduced by another 30%
    },
    smallBusinessOwners: {
      baselineScore: 2.2,        // Concerned about fiscal sustainability
      deficitSensitivity: 0.42,   // Reduced by 30%
      debtRatioSensitivity: 0.35  // Reduced by 30%
    },
    newImmigrants: {
      baselineScore: 3.0,        // Supportive of settlement services
      deficitSensitivity: 0.14,   // Reduced by 30%
      debtRatioSensitivity: 0.14  // Reduced by 30%
    },
    unionizedWorkers: {
      baselineScore: 3.0,        // Supportive of labor protections
      deficitSensitivity: 0.21,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    renters: {
      baselineScore: 2.9,        // Supportive of housing affordability measures
      deficitSensitivity: 0.14,   // Reduced by 30%
      debtRatioSensitivity: 0.14  // Reduced by 30%
    },
    veterans: {
      baselineScore: 2.7,        // Concerned about veterans services
      deficitSensitivity: 0.35,   // Reduced by 30%
      debtRatioSensitivity: 0.28  // Reduced by 30%
    },
    indigenousPeoples: {
      baselineScore: 3.3,        // Supportive of increased federal investment
      deficitSensitivity: 0.07,   // Reduced by 30%
      debtRatioSensitivity: 0.07  // Reduced by 30%
    }
  },
  
  // ===== SECTORS =====
  sectors: {
    business: {
      baselineScore: 2.5,        // Concerned about fiscal sustainability
      deficitSensitivity: 0.343,   // Reduced by 30%
      debtRatioSensitivity: 0.294  // Reduced by 30%
    },
    manufacturing: {
      baselineScore: 2.6,        // Concerned about competitiveness
      deficitSensitivity: 0.42,   // Reduced by 30%
      debtRatioSensitivity: 0.35  // Reduced by 30%
    },
    technology: {
      baselineScore: 2.8,        // Moderately concerned
      deficitSensitivity: 0.28,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    environment: {
      baselineScore: 3.2,        // Supportive of climate spending
      deficitSensitivity: 0.14,   // Reduced by 30%
      debtRatioSensitivity: 0.14  // Reduced by 30%
    },
    healthcare: {
      baselineScore: 3.0,        // Neutral but wants more healthcare investment
      deficitSensitivity: 0.21,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    defense: {
      baselineScore: 2.4,        // Concerned about insufficient defense spending
      deficitSensitivity: 0.35,   // Reduced by 30%
      debtRatioSensitivity: 0.28  // Reduced by 30%
    },
    education: {
      baselineScore: 3.1,        // Generally supportive of education spending
      deficitSensitivity: 0.21,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    energy: {
      baselineScore: 2.3,        // Concerned about energy policy direction
      deficitSensitivity: 0.42,   // Reduced by 30%
      debtRatioSensitivity: 0.35  // Reduced by 30%
    },
    publicSector: {
      baselineScore: 3.3,        // Supportive of government programs
      deficitSensitivity: 0.14,   // Reduced by 30%
      debtRatioSensitivity: 0.14  // Reduced by 30%
    },
    tourism: {
      baselineScore: 2.9,        // Neutral to slightly concerned
      deficitSensitivity: 0.21,   // Reduced by 30%
      debtRatioSensitivity: 0.21  // Reduced by 30%
    },
    agriculture: {
      baselineScore: 2.6,        // Concerned about support for rural areas
      deficitSensitivity: 0.35,   // Reduced by 30%
      debtRatioSensitivity: 0.28  // Reduced by 30%
    },
    indigenous: {
      baselineScore: 3.3,        // Supportive of increased investment
      deficitSensitivity: 0.07,   // Reduced by 30%
      debtRatioSensitivity: 0.07  // Reduced by 30%
    },
    finance: {
      baselineScore: 2.6,        // Concerned about fiscal sustainability
      deficitSensitivity: 0.441,   // Reduced by 30%
      debtRatioSensitivity: 0.294  // Reduced by 30%
    },
    realEstate: {
      baselineScore: 2.7,        // Concerned about housing market impacts
      deficitSensitivity: 0.35,   // Reduced by 30%
      debtRatioSensitivity: 0.28  // Reduced by 30%
    },
    creativeIndustries: {
      baselineScore: 3.2,        // Supportive of cultural funding
      deficitSensitivity: 0.2,
      debtRatioSensitivity: 0.2
    },
    veteransServices: {
      baselineScore: 2.8,        // Concerned about veterans support
      deficitSensitivity: 0.4,
      debtRatioSensitivity: 0.3
    }
  }
};
