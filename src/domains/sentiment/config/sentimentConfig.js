import { baselineSentimentOverrides } from '@/domains/sentiment/config/baselineSentimentOverrides.js';

/**
 * sentimentConfig.js
 *
 * Enhanced sentiment configuration for the Fiscal Insights Simulator.
 * This file expands and refines public sentiment rules with realistic,
 * politically grounded reactions while preserving existing logic and structure.
 *
 * Sections:
 *   - provinces: All 13 provinces/territories with unique regional triggers
 *   - demographics: Original plus 7 new groups (techWorkers, smallBusinessOwners,
 *     newImmigrants, unionizedWorkers, renters, veterans, indigenousPeoples)
 *   - sectors: Original plus 7 new sectors (technology, finance, realEstate,
 *     creativeIndustries, manufacturing, veteransServices, publicSector)
 *
 * Sensitivity multipliers:
 *   MIN_MULTIPLIER: Lower thresholds for positive triggers
 *   MAX_MULTIPLIER: Higher limits for allowable negatives
 *   REACTIVITY_AMPLIFIER: Magnifies sentiment shifts from neutral
 */

export const MIN_MULTIPLIER = 0.1;          // Easier to hit positive thresholds
export const MAX_MULTIPLIER = 1.8;          // More flexible upper limits
export const REACTIVITY_AMPLIFIER = 1.2; // Increased from 1.0 to make scores more reactive

/**
 * Constants for sentiment score calculations
 * CLAMP_RANGE: Maximum absolute value for raw sentiment scores before clamping
 * OVERRIDE_THRESHOLD: Threshold for critical alerts that override normal sentiment calculations
 */
export const CLAMP_RANGE = 2; // Increased from 1 to allow for more extreme scores
export const OVERRIDE_THRESHOLD = 3;

function mergeWithBaseline(configSection, baselineSection) {
  const result = {};
  for (const [group, cfg] of Object.entries(configSection)) {
    const overrides = baselineSection?.[group] || {};
    result[group] = {
      ...cfg,
      baselineScore: overrides.baselineScore ?? 3.0,
      deficitSensitivity: overrides.deficitSensitivity ?? 0.0,
      debtRatioSensitivity: overrides.debtRatioSensitivity ?? 0.0
    };
  }
  return result;
}

export const sentimentConfig = {
  // Update intervals in milliseconds
  updateIntervals: {
    quick: 500,    // For real-time updates
    normal: 1000,  // Default update frequency
    detailed: 2000 // For detailed analysis
  },

  // Impact thresholds for different sentiment levels
  impactThresholds: {
    low: 0.1,    // Minimal impact
    medium: 0.3, // Moderate impact
    high: 0.5    // Significant impact
  },

  // Weights for different demographic factors
  demographicWeights: {
    age: 0.3,
    income: 0.3,
    region: 0.2,
    sector: 0.2
  },

  // Revenue impact weights
  revenueWeights: {
    personalIncomeTax: 0.3,
    corporateIncomeTax: 0.2,
    gst: 0.15,
    otherTaxes: 0.35
  },

  // Spending impact weights
  spendingWeights: {
    healthcare: 0.25,
    education: 0.2,
    infrastructure: 0.15,
    socialServices: 0.2,
    other: 0.2
  },

  // Age group impact factors
  ageGroupFactors: {
    youth: {
      education: 0.4,
      socialServices: 0.3,
      healthcare: 0.2,
      other: 0.1
    },
    workingAge: {
      personalIncomeTax: 0.3,
      healthcare: 0.3,
      infrastructure: 0.2,
      other: 0.2
    },
    seniors: {
      healthcare: 0.4,
      socialServices: 0.4,
      other: 0.2
    }
  },

  // Income level impact factors
  incomeLevelFactors: {
    low: {
      gst: 0.4,
      socialServices: 0.4,
      other: 0.2
    },
    middle: {
      personalIncomeTax: 0.4,
      healthcare: 0.3,
      other: 0.3
    },
    high: {
      corporateIncomeTax: 0.4,
      personalIncomeTax: 0.3,
      other: 0.3
    }
  },

  // Color schemes for sentiment visualization
  colors: {
    positive: {
      light: 'hsl(120, 70%, 75%)',
      medium: 'hsl(120, 70%, 60%)',
      dark: 'hsl(120, 70%, 45%)'
    },
    negative: {
      light: 'hsl(0, 70%, 75%)',
      medium: 'hsl(0, 70%, 60%)',
      dark: 'hsl(0, 70%, 45%)'
    },
    neutral: {
      light: 'hsl(200, 70%, 75%)',
      medium: 'hsl(200, 70%, 60%)',
      dark: 'hsl(200, 70%, 45%)'
    }
  },

  // Emoji indicators for sentiment levels
  emojis: {
    veryPositive: '😊',
    positive: '🙂',
    neutral: '😐',
    negative: '🙁',
    veryNegative: '😢'
  },

  // Labels for sentiment levels
  labels: {
    veryPositive: 'Very Positive',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    veryNegative: 'Very Negative'
  },

  provinces: mergeWithBaseline({
    Ontario: {
      weight: 0.38, // Largest share—diverse, centrist-conservative tilt
      triggers: {
        // Economic competitiveness and business climate
        "revenueMix.corporateTax":            { max: 13 * MAX_MULTIPLIER, score: 2 },   // Lower corporate tax rates are viewed positively for competitiveness
        "budgetItems.economicDevelopment":    { min: 10 * MIN_MULTIPLIER, score: 2 },   // Direct investment in economic development is popular
        "budgetItems.infrastructure":         { min: 20 * MIN_MULTIPLIER, score: 2 },   // Infrastructure spending is a major priority

        // Healthcare and education
        "budgetItems.healthcare":             { min: 90 * MIN_MULTIPLIER, score: 1 },   // Universal healthcare is a core expectation
        "budgetItems.education":              { min: 22 * MIN_MULTIPLIER, score: 1 },   // Education funding is expected

        // Housing and affordability
        "budgetItems.housing":                { min: 8 * MIN_MULTIPLIER, score: 2 },    // Housing crisis is a major issue
        "budgetItems.childrenAndFamilies":    { min: 18 * MIN_MULTIPLIER, score: 1 },   // Family benefits are important

        // Fiscal responsibility
        "budgetItems.deficit":                { max: 0.04, score: -2 },                 // Deficits above 4% are strongly disliked

        // Environmental action
        "budgetItems.environmentAndClimateChange": { min: 7 * MIN_MULTIPLIER, score: 1 }, // Modest climate action is expected
        "revenueMix.carbonPricing":               { max: 0.9 * MAX_MULTIPLIER, score: 1 },  // Moderate carbon tax sensitivity
      }
    },
    Quebec: {
      weight: 0.23, // Social-democratic, culturally distinct
      triggers: {
        // Social programs and solidarity
        "budgetItems.childrenAndFamilies":      { min: 30 * MIN_MULTIPLIER, score: 5 }, // Universal childcare and family benefits
        "budgetItems.healthcare":               { min: 95 * MIN_MULTIPLIER, score: 2 }, // Public healthcare is highly valued
        "budgetItems.education":                { min: 24 * MIN_MULTIPLIER, score: 2 }, // Education funding is important

        // Cultural identity
        "budgetItems.culturalPrograms":         { min: 4  * MIN_MULTIPLIER, score: 4 }, // Funding for arts and French-language media

        // Environmental leadership
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // Ambitious climate action
        "revenueMix.carbonPricing":                 { min: 1.2 * MIN_MULTIPLIER, score: 3 }, // Carbon pricing is widely accepted

        // Progressive tax mix
        "revenueMix.corporateTax":              { min: 15 * MIN_MULTIPLIER, score: 2 }, // Higher corporate tax rates are tolerated

        // Deficit tolerance
        "budgetItems.deficit":                  { max: 0.06, score: -1 }, // More tolerant of deficits

        // Language and immigration
        "budgetItems.immigration":              { min: 5 * MIN_MULTIPLIER, score: 2 }, // French-language integration
      }
    },
    BritishColumbia: {
      weight: 0.14, // Green-leaning, urban-rural split
      triggers: {
        // Environmental leadership
        "budgetItems.environmentAndClimateChange": { min: 12 * MIN_MULTIPLIER, score: 5 }, // Strong climate action
        "revenueMix.carbonPricing":                    { min: 1.4 * MIN_MULTIPLIER, score: 4 }, // Carbon tax leadership

        // Indigenous reconciliation
        "budgetItems.indigenousServices":          { min: 12 * MIN_MULTIPLIER, score: 4 }, // Indigenous services

        // Urban issues
        "budgetItems.housing":                     { min: 10 * MIN_MULTIPLIER, score: 4 }, // Housing crisis
        "budgetItems.transit":                     { min: 10 * MIN_MULTIPLIER, score: 4 }, // Transit investment

        // Economic development
        "budgetItems.economicDevelopment":         { min: 7 * MIN_MULTIPLIER, score: 2 }, // Green jobs and innovation

        // Fiscal responsibility
        "budgetItems.deficit":                     { max: 0.05, score: -1 }, // Moderate deficit concern

        // Resource management
        "budgetItems.naturalResources":            { min: 8 * MIN_MULTIPLIER, score: 2 }, // Sustainable resource development
      }
    },
    Alberta: {
      weight: 0.18, // Resource-driven, fiscally conservative
      triggers: {
        // Pro-business, low taxes
        "revenueMix.corporateTax":         { max: 12 * MAX_MULTIPLIER, score: 3 }, // Lower corporate taxes
        "budgetItems.economicDevelopment": { min: 10 * MIN_MULTIPLIER, score: 3 }, // Economic development
        "budgetItems.infrastructure":      { min: 15 * MIN_MULTIPLIER, score: 2 }, // Infrastructure

        // Carbon pricing resistance
        "revenueMix.carbonPricing": [
          { max: 0.01, score: 9 },  // Elimination of carbon tax
          { max: 0.6 * MAX_MULTIPLIER, score: 2 }, // Low carbon tax
          { min: 2 * MIN_MULTIPLIER, score: -25 } // High carbon prices
        ],

        // Resource sector support
        "budgetItems.naturalResources":    { min: 10 * MIN_MULTIPLIER, score: 2 }, // Energy and resource extraction

        // Fiscal conservatism
        "budgetItems.deficit":             { max: 0.03, score: -3 }, // Strong deficit aversion

        // Healthcare and education
        "budgetItems.healthcare":          { min: 85 * MIN_MULTIPLIER, score: 1 }, // Basic healthcare
        "budgetItems.education":           { min: 18 * MIN_MULTIPLIER, score: 1 }, // Education

        // Rural support
        "budgetItems.agriculture":         { min: 8 * MIN_MULTIPLIER, score: 2 }, // Agricultural support
      }
    },
    Manitoba: {
      weight: 0.05, // Balanced, pragmatic
      triggers: {
        // Agriculture and rural priorities
        "budgetItems.agriculture":         { min: 7 * MIN_MULTIPLIER, score: 3 }, // Farm supports
        "budgetItems.infrastructure":      { min: 10 * MIN_MULTIPLIER, score: 2 }, // Rural infrastructure

        // Indigenous reconciliation
        "budgetItems.indigenousServices":  { min: 10 * MIN_MULTIPLIER, score: 2 }, // Indigenous services

        // Healthcare and education
        "budgetItems.healthcare":          { min: 90 * MIN_MULTIPLIER, score: 2 }, // Rural healthcare
        "budgetItems.education":           { min: 20 * MIN_MULTIPLIER, score: 1 }, // Education

        // Fiscal prudence
        "budgetItems.deficit":             { max: 0.05, score: -1 }, // Moderate deficit concern

        // Urban support
        "budgetItems.housing":             { min: 7 * MIN_MULTIPLIER, score: 1 }, // Urban housing
      }
    },
    Saskatchewan: {
      weight: 0.03, // Resource/agriculture, conservative
      triggers: {
        // Agriculture and resources
        "budgetItems.agriculture":         { min: 8 * MIN_MULTIPLIER, score: 7 }, // Farm supports
        "budgetItems.economicDevelopment": { min: 7 * MIN_MULTIPLIER, score: 3 }, // Economic development
        "budgetItems.infrastructure":      { min: 10 * MIN_MULTIPLIER, score: 3 }, // Rural infrastructure

        // Carbon tax resistance
        "revenueMix.carbonPricing": [
          { max: 0.05, score: 3 }, // Near-zero carbon tax
          { max: 0.6 * MAX_MULTIPLIER, score: 2 }, // Low carbon tax
          { min: 2 * MIN_MULTIPLIER, score: -5 } // High carbon tax
        ],

        // Fiscal conservatism
        "budgetItems.deficit":             { max: 0.03, score: -2 }, // Deficit aversion

        // Pro-business
        "revenueMix.corporateTax":         { max: 13 * MAX_MULTIPLIER, score: 5 }, // Low corporate tax

        // Urban services
        "budgetItems.healthcare":          { min: 90 * MIN_MULTIPLIER, score: 1 }, // Healthcare
        "budgetItems.education":           { min: 17 * MIN_MULTIPLIER, score: 1 }, // Education
      }
    },
    NovaScotia: {
      weight: 0.03, // Aging, coastal, moderate
      triggers: {
        // Healthcare and seniors
        "budgetItems.healthcare":          { min: 110 * MIN_MULTIPLIER, score: 4 }, // Rural healthcare
        "budgetItems.supportForSeniors":   { min: 80 * MIN_MULTIPLIER, score: 4 }, // Seniors' supports

        // Fisheries and rural
        "budgetItems.fisheries":           { min: 3 * MIN_MULTIPLIER, score: 3 }, // Fisheries policy
        "budgetItems.infrastructure":      { min: 7 * MIN_MULTIPLIER, score: 2 }, // Rural infrastructure

        // Deficit concern
        "budgetItems.deficit":             { max: 0.06, score: -1 }, // Moderate deficit concern

        // Urban support
        "budgetItems.housing":             { min: 6 * MIN_MULTIPLIER, score: 1 }, // Urban housing
      }
    },
    NewBrunswick: {
      weight: 0.02, // Rural, aging, pragmatic
      triggers: {
        // Healthcare and seniors
        "budgetItems.healthcare":          { min: 105 * MIN_MULTIPLIER, score: 4 }, // Rural healthcare
        "budgetItems.supportForSeniors":   { min: 80 * MIN_MULTIPLIER, score: 4 }, // Seniors' supports

        // Fisheries and jobs
        "budgetItems.fisheries":           { min: 2 * MIN_MULTIPLIER, score: 3 }, // Fisheries
        "budgetItems.economicDevelopment": { min: 6 * MIN_MULTIPLIER, score: 2 }, // Job creation

        // Deficit concern
        "budgetItems.deficit":             { max: 0.06, score: -1 }, // Moderate deficit concern

        // Bilingualism
        "budgetItems.culturalPrograms":    { min: 2 * MIN_MULTIPLIER, score: 1 }, // French/Acadian culture
      }
    },
    Nunavut: {
      weight: 0.005, // Remote, Indigenous, northern
      triggers: {
        // Indigenous services
        "budgetItems.indigenousServices":   { min: 25 * MIN_MULTIPLIER, score: 5 }, // Inuit-led services

        // Infrastructure and housing
        "budgetItems.infrastructure":       { min: 15 * MIN_MULTIPLIER, score: 3 }, // Remote infrastructure
        "budgetItems.housing":              { min: 10 * MIN_MULTIPLIER, score: 3 }, // Housing crisis

        // Healthcare and education
        "budgetItems.healthcare":           { min: 90 * MIN_MULTIPLIER, score: 4 }, // Remote healthcare
        "budgetItems.education":            { min: 20 * MIN_MULTIPLIER, score: 3 }, // Inuit education

        // Arctic sovereignty
        "budgetItems.defense":              { min: 20 * MIN_MULTIPLIER, score: 2 }, // Arctic presence
      }
    },
    "Prince Edward Island": {
      weight: 0.01, // Small, rural, agri/fisheries
      triggers: {
        // Agriculture and fisheries
        "budgetItems.agriculture":         { min: 5 * MIN_MULTIPLIER, score: 3 }, // Farm supports
        "budgetItems.fisheries":           { min: 2 * MIN_MULTIPLIER, score: 3 }, // Fisheries
        "budgetItems.tourism":             { min: 2 * MIN_MULTIPLIER, score: 2 }, // Tourism

        // Healthcare
        "budgetItems.healthcare":          { min: 90 * MIN_MULTIPLIER, score: 2 }, // Rural healthcare

        // Deficit tolerance
        "budgetItems.deficit":             { max: 0.07, score: -1 }, // Flexible deficit concern

        // Infrastructure
        "budgetItems.infrastructure":      { min: 3 * MIN_MULTIPLIER, score: 1 }, // Rural infrastructure
      }
    },
    "Newfoundland and Labrador": {
      weight: 0.02, // Coastal, resource, rural
      triggers: {
        // Fisheries and rural
        "budgetItems.fisheries":           { min: 3 * MIN_MULTIPLIER, score: 4 }, // Fisheries
        "budgetItems.infrastructure":      { min: 8 * MIN_MULTIPLIER, score: 2 }, // Rural infrastructure

        // Healthcare and seniors
        "budgetItems.healthcare":          { min: 100 * MIN_MULTIPLIER, score: 3 }, // Rural healthcare
        "budgetItems.supportForSeniors":   { min: 75 * MIN_MULTIPLIER, score: 2 }, // Seniors' supports

        // Deficit tolerance
        "budgetItems.deficit":             { max: 0.08, score: -1 }, // Flexible deficit concern

        // Resource development
        "budgetItems.naturalResources":    { min: 8 * MIN_MULTIPLIER, score: 3 }, // Resource investment

        // Population retention
        "budgetItems.childrenAndFamilies": { min: 7 * MIN_MULTIPLIER, score: 1 }, // Family benefits
      }
    },
    "Northwest Territories": {
      weight: 0.005, // Remote, Indigenous, resource
      triggers: {
        // Indigenous services
        "budgetItems.indigenousServices":   { min: 18 * MIN_MULTIPLIER, score: 4 }, // Indigenous services

        // Infrastructure and housing
        "budgetItems.infrastructure":       { min: 12 * MIN_MULTIPLIER, score: 3 }, // Remote infrastructure
        "budgetItems.housing":              { min: 7 * MIN_MULTIPLIER, score: 2 }, // Housing

        // Healthcare and education
        "budgetItems.healthcare":           { min: 80 * MIN_MULTIPLIER, score: 3 }, // Remote healthcare

        // Arctic sovereignty
        "budgetItems.defense":              { min: 18 * MIN_MULTIPLIER, score: 2 }, // Arctic presence

        // Resource development
        "budgetItems.naturalResources":     { min: 7 * MIN_MULTIPLIER, score: 3 }, // Resource investment
      }
    },
    Yukon: {
      weight: 0.005, // Remote, Indigenous, environmental
      triggers: {
        // Indigenous reconciliation
        "budgetItems.indigenousServices":   { min: 15 * MIN_MULTIPLIER, score: 4 }, // Indigenous services

        // Infrastructure and housing
        "budgetItems.infrastructure":       { min: 12 * MIN_MULTIPLIER, score: 3 }, // Remote infrastructure

        // Healthcare
        "budgetItems.healthcare":           { min: 85 * MIN_MULTIPLIER, score: 3 }, // Remote healthcare

        // Environment and climate
        "budgetItems.environmentAndClimateChange": { min: 8 * MIN_MULTIPLIER, score: 4 }, // Climate action

        // Tourism
        "budgetItems.tourism":              { min: 3 * MIN_MULTIPLIER, score: 2 }, // Tourism

        // Resource development
        "budgetItems.naturalResources":     { min: 5 * MIN_MULTIPLIER, score: 1 }, // Sustainable development
      }
    }
  }, baselineSentimentOverrides.provinces),

  demographics: mergeWithBaseline({
    youth: {
      weight: 0.15, // Young Canadians (18-30)
      triggers: {
        // Education and skills
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 5 },  // Post-secondary funding
        "budgetItems.skillsDevelopment":        { min: 8 * MIN_MULTIPLIER, score: 4 },   // Job training
        "budgetItems.loansInvestments.studentLoans": { min: 5 * MIN_MULTIPLIER, score: 4 }, // Student debt relief

        // Climate and environment
        "budgetItems.environmentAndClimateChange": { min: 12 * MIN_MULTIPLIER, score: 4 }, // Climate action
        "revenueMix.carbonPricing":                 { min: 1.5 * MIN_MULTIPLIER, score: 3 },  // Carbon pricing

        // Housing and affordability
        "budgetItems.housing":                  { min: 15 * MIN_MULTIPLIER, score: 5 },  // Rental support
        "budgetItems.transit":                  { min: 10 * MIN_MULTIPLIER, score: 4 },  // Public transit

        // Digital services
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 3 },   // Digital access
        "budgetItems.cybersecurity":            { min: 4 * MIN_MULTIPLIER, score: 3 },   // Online security

        // Mental health
        "budgetItems.mentalHealth":             { min: 7 * MIN_MULTIPLIER, score: 4 },   // Youth mental health

        // Economic inequality
        "revenueMix.wealthTax":                 { min: 0.5 * MIN_MULTIPLIER, score: 3 },  // Wealth redistribution
      }
    },
    seniors: {
      weight: 0.20, // Older Canadians (65+)
      triggers: {
        // Healthcare and support
        "budgetItems.healthcare":               { min: 110 * MIN_MULTIPLIER, score: 5 }, // Healthcare access
        "budgetItems.supportForSeniors":        { min: 85 * MIN_MULTIPLIER, score: 5 },  // Pension support
        "budgetItems.mentalHealth":             { min: 10 * MIN_MULTIPLIER, score: 3 },  // Senior mental health

        // Housing and mobility
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 4 },   // Senior housing
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 3 },   // Mobility support

        // Tax relief
        "revenueMix.personalIncomeTaxCap":      { max: 20 * MAX_MULTIPLIER, score: 4 },  // Tax caps
        "taxExpenditures.personalTaxCredits":   { min: 15 * MIN_MULTIPLIER, score: 4 },  // Senior credits

        // Elder protection
        "budgetItems.socialServices.elderAbuse": { min: 2 * MIN_MULTIPLIER, score: 3 }, // Elder protection

        // Fiscal responsibility
        "budgetItems.deficit":                  { max: 0.04, score: -2 },                // Deficit concern
      }
    },
    families: {
      weight: 0.25, // Canadian families with children
      triggers: {
        // Family support
        "budgetItems.childrenAndFamilies":      { min: 30 * MIN_MULTIPLIER, score: 5 },  // Family benefits
        "budgetItems.childcare":                { min: 15 * MIN_MULTIPLIER, score: 5 },  // Childcare support

        // Healthcare and education
        "budgetItems.healthcare":               { min: 105 * MIN_MULTIPLIER, score: 4 }, // Family health
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 4 },  // Education quality

        // Housing and transit
        "budgetItems.housing":                  { min: 10 * MIN_MULTIPLIER, score: 5 },  // Family housing
        "budgetItems.transit":                  { min: 7 * MIN_MULTIPLIER, score: 3 },   // Family transit

        // Tax relief
        "taxExpenditures.personalTaxCreditsIncrease": { min: 10 * MIN_MULTIPLIER, score: 4 }, // Family credits
      }
    },
    workers: {
      weight: 0.25, // Working Canadians
      triggers: {
        // Jobs and economy
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },   // Job creation
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 4 },  // Infrastructure jobs

        // Income and taxes
        "revenueMix.personalIncomeTaxCap":      { max: 20 * MAX_MULTIPLIER, score: 4 },  // Take-home pay
        "revenueMix.eiPremiums": [
          { max: 1.3 * MAX_MULTIPLIER, score: 4 },  // Low EI premiums
          { min: 2.0 * MIN_MULTIPLIER, score: -4 }  // High EI premiums
        ],

        // Skills and training
        "budgetItems.skillsDevelopment":        { min: 7 * MIN_MULTIPLIER, score: 4 },   // Job training
        "budgetItems.scienceAndInnovation":     { min: 6 * MIN_MULTIPLIER, score: 3 },   // Future jobs

        // Work-life balance
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 3 },   // Commuting
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 4 },   // Affordable housing
      }
    },
    students: {
      weight: 0.10, // Post-secondary students
      triggers: {
        // Education funding
        "budgetItems.education":                { min: 30 * MIN_MULTIPLIER, score: 5 },  // Education funding
        "budgetItems.scienceAndInnovation":     { min: 8 * MIN_MULTIPLIER, score: 4 },  // Research funding

        // Financial support
        "budgetItems.loansInvestments.studentLoans": { min: 5 * MIN_MULTIPLIER, score: 5 }, // Loan support
        "taxExpenditures.studentTaxCredits":    { min: 15 * MIN_MULTIPLIER, score: 5 },  // Tax credits

        // Student life
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 5 },  // Student housing
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 4 },  // Student transit

        // Digital access
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 3 },  // Digital services
        "budgetItems.mentalHealth":             { min: 6 * MIN_MULTIPLIER, score: 4 },  // Student mental health
      }
    },
    urban: {
      weight: 0.65, // Urban Canadians
      triggers: {
        // Urban infrastructure
        "budgetItems.transit":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // Public transit
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 4 }, // Urban infrastructure

        // Housing and affordability
        "budgetItems.housing":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // Housing crisis
        "budgetItems.immigration":              { min: 6 * MIN_MULTIPLIER, score: 3 },  // Settlement services

        // Environment and climate
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // Air quality
        "revenueMix.carbonPricing":                 { min: 1.2 * MIN_MULTIPLIER, score: 3 }, // Carbon pricing

        // Urban services
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 4 },  // Smart cities
        "budgetItems.publicSafety":             { min: 10 * MIN_MULTIPLIER, score: 3 }, // Urban safety
      }
    },
    rural: {
      weight: 0.35, // Rural Canadians
      triggers: {
        // Rural economy
        "budgetItems.agriculture":              { min: 8 * MIN_MULTIPLIER, score: 5 },  // Farm support
        "budgetItems.naturalResources":         { min: 7 * MIN_MULTIPLIER, score: 4 },  // Resource development

        // Infrastructure and connectivity
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 5 }, // Rural roads
        "budgetItems.digitalGovernment":        { min: 6 * MIN_MULTIPLIER, score: 5 },  // Rural internet

        // Carbon tax sensitivity
        "revenueMix.carbonPricing": [
          { max: 0.7 * MAX_MULTIPLIER, score: 4 }, // Low carbon tax
          { max: 0.01, score: 2 }                  // No carbon tax
        ],

        // Rural services
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // Rural healthcare
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },   // Rural jobs
      }
    },
    indigenousPeoples: {
      weight: 0.05, // First Nations, Métis, and Inuit
      triggers: {
        // Indigenous services
        "budgetItems.indigenousServices":       { min: 18 * MIN_MULTIPLIER, score: 5 }, // Essential services
        "budgetItems.indigenousOperations":     { min: 12 * MIN_MULTIPLIER, score: 5 }, // Self-governance

        // Housing and infrastructure
        "budgetItems.housing":                  { min: 10 * MIN_MULTIPLIER, score: 5 }, // Housing crisis
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // Community infrastructure

        // Health and education
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // Health equity
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 5 },  // Education equity

        // Environment and land
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // Land stewardship

        // Economic development
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },    // Economic opportunities
      }
    },
    techWorkers: {
      weight: 0.08, // Tech sector workers
      triggers: {
        // Innovation and research
        "budgetItems.scienceAndInnovation":     { min: 10 * MIN_MULTIPLIER, score: 5 }, // R&D funding
        "budgetItems.digitalGovernment":        { min: 6 * MIN_MULTIPLIER, score: 4 },  // Digital transformation

        // Skills and education
        "budgetItems.skillsDevelopment":        { min: 8 * MIN_MULTIPLIER, score: 4 },  // Tech training
        "budgetItems.education":                { min: 15 * MIN_MULTIPLIER, score: 3 }, // STEM education

        // Business environment
        "revenueMix.corporateTax":              { max: 15 * MAX_MULTIPLIER, score: 4 }, // Competitive tax
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 12 * MIN_MULTIPLIER, score: 4 }, // Startup incentives

        // Digital infrastructure
        "budgetItems.cybersecurity":            { min: 5 * MIN_MULTIPLIER, score: 5 },  // Digital security
        "budgetItems.housing":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // Tech hub housing

        // Talent attraction
        "budgetItems.immigration":              { min: 5 * MIN_MULTIPLIER, score: 4 },  // Tech immigration
      }
    },
    smallBusinessOwners: {
      weight: 0.10, // Small and medium business owners
      triggers: {
        // Tax environment
        "revenueMix.corporateTax":              { max: 12 * MAX_MULTIPLIER, score: 5 }, // Small business tax
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 15 * MIN_MULTIPLIER, score: 5 }, // Tax credits

        // Payroll costs
        "revenueMix.eiPremiums": [
          { max: 1.2 * MAX_MULTIPLIER, score: 4 }, // Low EI costs
          { min: 1.8 * MIN_MULTIPLIER, score: -3 } // High EI costs
        ],

        // Business support
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 5 },  // SME programs
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 4 },  // Red tape reduction

        // Infrastructure
        "budgetItems.infrastructure":           { min: 10 * MIN_MULTIPLIER, score: 4 }, // Local infrastructure
        "budgetItems.loansInvestments.businessLoans": { min: 5 * MIN_MULTIPLIER, score: 5 }, // Business financing
      }
    },
    newImmigrants: {
      weight: 0.07, // Recent immigrants to Canada
      triggers: {
        // Settlement services
        "budgetItems.immigration":              { min: 6 * MIN_MULTIPLIER, score: 5 },  // Settlement programs
        "budgetItems.skillsDevelopment":        { min: 8 * MIN_MULTIPLIER, score: 5 },  // Credential recognition

        // Basic needs
        "budgetItems.housing":                  { min: 12 * MIN_MULTIPLIER, score: 5 }, // Affordable housing
        "budgetItems.healthcare":               { min: 95 * MIN_MULTIPLIER, score: 5 }, // Healthcare access

        // Family support
        "budgetItems.childrenAndFamilies":      { min: 25 * MIN_MULTIPLIER, score: 4 }, // Family support
        "budgetItems.education":                { min: 20 * MIN_MULTIPLIER, score: 4 }, // Language training

        // Employment
        "budgetItems.economicDevelopment":      { min: 6 * MIN_MULTIPLIER, score: 4 },  // Job opportunities
        "budgetItems.publicSafety":             { min: 8 * MIN_MULTIPLIER, score: 3 },  // Community safety
      }
    },
    unionizedWorkers: {
      weight: 0.12, // Union members
      triggers: {
        // Labor rights
        "budgetItems.laborPrograms":            { min: 5 * MIN_MULTIPLIER, score: 5 },  // Labor rights
        "budgetItems.publicSafety":             { min: 12 * MIN_MULTIPLIER, score: 4 }, // Workplace safety

        // Jobs and infrastructure
        "budgetItems.infrastructure":           { min: 18 * MIN_MULTIPLIER, score: 5 }, // Job creation
        "budgetItems.manufacturing":            { min: 10 * MIN_MULTIPLIER, score: 5 }, // Industrial policy

        // Progressive taxation
        "revenueMix.corporateTax":              { min: 16 * MIN_MULTIPLIER, score: 4 }, // Corporate tax fairness
        "revenueMix.wealthTax":                 { min: 0.5 * MIN_MULTIPLIER, score: 3 }, // Wealth inequality

        // Worker support
        "budgetItems.skillsDevelopment":        { min: 7 * MIN_MULTIPLIER, score: 4 },  // Worker training
        "revenueMix.eiPremiums": [
          { max: 1.3 * MAX_MULTIPLIER, score: 3 }, // Low EI premiums
          { min: 1.8 * MIN_MULTIPLIER, score: -3 } // High EI premiums
        ],
      }
    },
    renters: {
      weight: 0.15, // Canadians who rent their homes
      triggers: {
        // Housing affordability
        "budgetItems.housing":                  { min: 15 * MIN_MULTIPLIER, score: 5 }, // Rental support
        "taxExpenditures.renterTaxCredits.adjustmentPercent": { min: 12 * MIN_MULTIPLIER, score: 5 }, // Renter credits

        // Urban amenities
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // Community amenities
        "budgetItems.transit":                  { min: 10 * MIN_MULTIPLIER, score: 5 }, // Public transit

        // Economic equality
        "revenueMix.wealthTax":                 { min: 0.6 * MIN_MULTIPLIER, score: 4 }, // Wealth redistribution
        "budgetItems.childrenAndFamilies":      { min: 22 * MIN_MULTIPLIER, score: 4 }, // Family benefits

        // Tenant rights
        "budgetItems.publicSafety":             { min: 6 * MIN_MULTIPLIER, score: 3 },  // Tenant protections
        "budgetItems.economicDevelopment":      { min: 6 * MIN_MULTIPLIER, score: 3 },  // Housing development
      }
    },
    veterans: {
      weight: 0.05, // Canadian veterans
      triggers: {
        // Veterans services
        "budgetItems.veteransAffairs":          { min: 8 * MIN_MULTIPLIER, score: 5 },  // Veterans programs
        "budgetItems.mentalHealth":             { min: 6 * MIN_MULTIPLIER, score: 5 },  // PTSD support

        // Healthcare and support
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // Healthcare access
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 4 },  // Veterans housing
        "budgetItems.supportForSeniors":        { min: 70 * MIN_MULTIPLIER, score: 4 }, // Aging veterans

        // Military support
        "budgetItems.defense":                  { min: 25 * MIN_MULTIPLIER, score: 4 }, // Military support
        "budgetItems.skillsDevelopment":        { min: 6 * MIN_MULTIPLIER, score: 4 },  // Civilian transition

        // Recognition
        "taxExpenditures.personalTaxCredits":   { min: 10 * MIN_MULTIPLIER, score: 4 }, // Veterans tax credits
      }
    }
  }, baselineSentimentOverrides.demographics),

  sectors: mergeWithBaseline({
    business: {
      weight: 0.30, // Business sector overall
      triggers: {
        // Tax competitiveness
        "revenueMix.corporateTax": [
          { max: 13 * MAX_MULTIPLIER, score: 5 }, // Competitive corporate tax
          { min: 20 * MIN_MULTIPLIER, score: -4 } // High corporate tax
        ],
        // Business environment
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },  // Business support
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 4 },  // Red tape reduction
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // Business infrastructure
        // Workforce development
        "budgetItems.skillsDevelopment":        { min: 7 * MIN_MULTIPLIER, score: 3 },  // Workforce training
        // Fiscal responsibility
        "budgetItems.deficit":                  { max: 0.04, score: -3 },               // Deficit concern
        // Trade and investment
        "budgetItems.trade":                    { min: 6 * MIN_MULTIPLIER, score: 4 },  // Trade support
        "budgetItems.internationalAssistance":  { min: 5 * MIN_MULTIPLIER, score: 3 }   // Global markets
      }
    },
    environment: {
      weight: 0.15, // Environmental organizations and advocates
      triggers: {
        // Climate action
        "budgetItems.environmentAndClimateChange": { min: 15 * MIN_MULTIPLIER, score: 5 }, // Climate programs
        "revenueMix.carbonPricing": [
          { min: 1.5 * MIN_MULTIPLIER, score: 5 }, // Strong carbon pricing
          { max: 0.01, score: -5 }                // No carbon pricing
        ],
        // Sustainable infrastructure
        "budgetItems.transit":                  { min: 12 * MIN_MULTIPLIER, score: 4 }, // Public transit
        "budgetItems.infrastructure":           { min: 12 * MIN_MULTIPLIER, score: 4 }, // Green infrastructure
        // Innovation and research
        "budgetItems.scienceAndInnovation":     { min: 8 * MIN_MULTIPLIER, score: 4 },  // Clean tech research
        // Conservation and stewardship
        "budgetItems.naturalResources":         { min: 8 * MIN_MULTIPLIER, score: 3 },  // Conservation programs
        "budgetItems.indigenousServices":       { min: 10 * MIN_MULTIPLIER, score: 4 }, // Indigenous stewardship
        // Environmental protection
        "budgetItems.publicSafety":             { min: 6 * MIN_MULTIPLIER, score: 3 }   // Environmental enforcement
      }
    },
    healthcare: {
      weight: 0.20, // Healthcare sector
      triggers: {
        // Core healthcare funding
        "budgetItems.healthcare": [
          { min: 110 * MIN_MULTIPLIER, score: 5 }, // Strong healthcare funding
          { min: 90 * MIN_MULTIPLIER, score: 3 },  // Moderate funding
          { max: 70 * MAX_MULTIPLIER, score: -4 }  // Insufficient funding
        ],
        // Research and innovation
        "budgetItems.scienceAndInnovation": [
          { min: 8 * MIN_MULTIPLIER, score: 5 },   // Strong medical research
          { min: 5 * MIN_MULTIPLIER, score: 3 },   // Moderate research
          { max: 3 * MAX_MULTIPLIER, score: -2 }   // Weak research
        ],
        // Health tax credits
        "taxExpenditures.healthTaxCredits": [
          { min: 12 * MIN_MULTIPLIER, score: 4 },  // Strong health credits
          { min: 8 * MIN_MULTIPLIER, score: 2 },   // Moderate credits
          { max: 4 * MAX_MULTIPLIER, score: -2 }   // Weak credits
        ],
        // Specialized care
        "budgetItems.supportForSeniors": [
          { min: 80 * MIN_MULTIPLIER, score: 4 },  // Strong senior care
          { min: 60 * MIN_MULTIPLIER, score: 2 },  // Moderate care
          { max: 40 * MAX_MULTIPLIER, score: -3 }  // Weak care
        ],
        "budgetItems.childrenAndFamilies": [
          { min: 25 * MIN_MULTIPLIER, score: 4 },  // Strong family health
          { min: 20 * MIN_MULTIPLIER, score: 2 },  // Moderate support
          { max: 15 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Digital health
        "budgetItems.digitalGovernment": [
          { min: 6 * MIN_MULTIPLIER, score: 4 },   // Strong health records
          { min: 4 * MIN_MULTIPLIER, score: 2 },   // Moderate digital
          { max: 2 * MAX_MULTIPLIER, score: -2 }   // Weak digital
        ]
      }
    },
    defense: {
      weight: 0.10, // Defense and security sector
      triggers: {
        // Core defense
        "budgetItems.defense":                  { min: 30 * MIN_MULTIPLIER, score: 5 }, // Military funding
        "budgetItems.cybersecurity":            { min: 4 * MIN_MULTIPLIER, score: 5 },  // Digital defense
        "budgetItems.publicSafety":             { min: 15 * MIN_MULTIPLIER, score: 4 }, // Domestic security
        "budgetItems.borderSecurity":           { min: 10 * MIN_MULTIPLIER, score: 5 }, // Border protection
        // International presence
        "budgetItems.diplomaticRepresentation": { min: 8 * MIN_MULTIPLIER, score: 4 }, // International presence
        "budgetItems.internationalDevelopment": { min: 7 * MIN_MULTIPLIER, score: 3 }, // Global stability
        // Veteran support
        "budgetItems.veteransAffairs":          { min: 8 * MIN_MULTIPLIER, score: 4 },  // Veterans programs
        "budgetItems.mentalHealth":             { min: 6 * MIN_MULTIPLIER, score: 4 }   // Mental health support
      }
    },
    education: {
      weight: 0.10, // Education sector
      triggers: {
        // Core education funding
        "budgetItems.education": [
          { min: 30 * MIN_MULTIPLIER, score: 5 },  // Strong education funding
          { min: 25 * MIN_MULTIPLIER, score: 3 },  // Moderate funding
          { max: 20 * MAX_MULTIPLIER, score: -3 }  // Insufficient funding
        ],
        // Skills and training
        "budgetItems.skillsDevelopment": [
          { min: 7 * MIN_MULTIPLIER, score: 5 },   // Strong training
          { min: 5 * MIN_MULTIPLIER, score: 3 },   // Moderate training
          { max: 3 * MAX_MULTIPLIER, score: -2 }   // Weak training
        ],
        // Early education
        "budgetItems.childrenAndFamilies": [
          { min: 25 * MIN_MULTIPLIER, score: 4 },  // Strong early education
          { min: 20 * MIN_MULTIPLIER, score: 2 },  // Moderate support
          { max: 15 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Research and innovation
        "budgetItems.scienceAndInnovation": [
          { min: 8 * MIN_MULTIPLIER, score: 4 },   // Strong research
          { min: 6 * MIN_MULTIPLIER, score: 2 },   // Moderate research
          { max: 4 * MAX_MULTIPLIER, score: -2 }   // Weak research
        ],
        // Digital learning
        "budgetItems.digitalGovernment": [
          { min: 6 * MIN_MULTIPLIER, score: 4 },   // Strong digital learning
          { min: 4 * MIN_MULTIPLIER, score: 2 },   // Moderate digital
          { max: 2 * MAX_MULTIPLIER, score: -2 }   // Weak digital
        ],
        // Student support
        "budgetItems.loansInvestments.studentLoans": [
          { min: 5 * MIN_MULTIPLIER, score: 5 },   // Strong loan support
          { min: 3 * MIN_MULTIPLIER, score: 3 },   // Moderate support
          { max: 1 * MAX_MULTIPLIER, score: -3 }   // Weak support
        ]
      }
    },
    energy: {
      weight: 0.10, // Energy sector
      triggers: {
        // Clean energy transition
        "budgetItems.environmentAndClimateChange": [
          { min: 10 * MIN_MULTIPLIER, score: 5 },  // Strong clean energy
          { min: 7 * MIN_MULTIPLIER, score: 3 },   // Moderate transition
          { max: 4 * MAX_MULTIPLIER, score: -3 }   // Weak transition
        ],
        // Energy infrastructure
        "budgetItems.economicDevelopment": [
          { min: 10 * MIN_MULTIPLIER, score: 4 },  // Strong energy infrastructure
          { min: 7 * MIN_MULTIPLIER, score: 2 },   // Moderate support
          { max: 4 * MAX_MULTIPLIER, score: -2 }   // Weak support
        ],
        // Carbon pricing
        "revenueMix.carbonPricing": [
          { max: 0.5 * MAX_MULTIPLIER, score: 5 }, // Low carbon pricing
          { max: 0.8 * MAX_MULTIPLIER, score: 2 }, // Moderate pricing
          { min: 1.2 * MIN_MULTIPLIER, score: -4 } // High pricing
        ],
        // Energy innovation
        "budgetItems.scienceAndInnovation": [
          { min: 9 * MIN_MULTIPLIER, score: 5 },   // Strong energy innovation
          { min: 6 * MIN_MULTIPLIER, score: 3 },   // Moderate innovation
          { max: 4 * MAX_MULTIPLIER, score: -2 }   // Weak innovation
        ],
        // Infrastructure
        "budgetItems.infrastructure": [
          { min: 15 * MIN_MULTIPLIER, score: 5 },  // Strong infrastructure
          { min: 10 * MIN_MULTIPLIER, score: 3 },  // Moderate infrastructure
          { max: 7 * MAX_MULTIPLIER, score: -3 }   // Weak infrastructure
        ],
        // Tax environment
        "revenueMix.corporateTax": [
          { max: 13 * MAX_MULTIPLIER, score: 4 },  // Competitive tax rate
          { max: 15 * MAX_MULTIPLIER, score: 2 },  // Moderate tax rate
          { min: 17 * MIN_MULTIPLIER, score: -3 }  // High tax rate
        ]
      }
    },
    tourism: {
      weight: 0.05, // Tourism sector
      triggers: {
        // Tourism promotion
        "budgetItems.tourism":                  { min: 3 * MIN_MULTIPLIER, score: 5 },  // Tourism promotion
        "budgetItems.culturalPrograms":         { min: 4 * MIN_MULTIPLIER, score: 5 },  // Cultural attractions
        // Infrastructure
        "budgetItems.infrastructure":           { min: 10 * MIN_MULTIPLIER, score: 4 }, // Tourism infrastructure
        "budgetItems.transit":                  { min: 8 * MIN_MULTIPLIER, score: 4 },  // Transportation
        // Natural attractions
        "budgetItems.environmentAndClimateChange": { min: 6 * MIN_MULTIPLIER, score: 4 }, // Natural attractions
        "budgetItems.naturalResources":         { min: 5 * MIN_MULTIPLIER, score: 3 },  // Parks and recreation
        // Indigenous tourism
        "budgetItems.indigenousServices":       { min: 8 * MIN_MULTIPLIER, score: 4 },  // Indigenous tourism
        // Digital presence
        "budgetItems.digitalGovernment":        { min: 4 * MIN_MULTIPLIER, score: 3 }   // Digital tourism
      }
    },
    agriculture: {
      weight: 0.10, // Agriculture sector
      triggers: {
        // Farm support
        "budgetItems.agriculture": [
          { min: 10 * MIN_MULTIPLIER, score: 5 },  // Strong farm support
          { min: 7 * MIN_MULTIPLIER, score: 3 },   // Moderate support
          { max: 4 * MAX_MULTIPLIER, score: -3 }   // Weak support
        ],
        // Carbon pricing
        "revenueMix.carbonPricing": [
          { max: 0.5 * MAX_MULTIPLIER, score: 5 }, // Low carbon pricing
          { max: 0.8 * MAX_MULTIPLIER, score: 2 }, // Moderate pricing
          { min: 1.2 * MIN_MULTIPLIER, score: -4 } // High pricing
        ],
        // Rural infrastructure
        "budgetItems.infrastructure": [
          { min: 12 * MIN_MULTIPLIER, score: 5 },  // Strong rural infrastructure
          { min: 8 * MIN_MULTIPLIER, score: 3 },   // Moderate infrastructure
          { max: 5 * MAX_MULTIPLIER, score: -3 }   // Weak infrastructure
        ],
        // Climate adaptation
        "budgetItems.environmentAndClimateChange": [
          { min: 8 * MIN_MULTIPLIER, score: 4 },   // Strong climate adaptation
          { min: 5 * MIN_MULTIPLIER, score: 2 },   // Moderate adaptation
          { max: 3 * MAX_MULTIPLIER, score: -2 }   // Weak adaptation
        ],
        // Agricultural research
        "budgetItems.scienceAndInnovation": [
          { min: 7 * MIN_MULTIPLIER, score: 4 },   // Strong agri-research
          { min: 5 * MIN_MULTIPLIER, score: 2 },   // Moderate research
          { max: 3 * MAX_MULTIPLIER, score: -2 }   // Weak research
        ],
        // Export support
        "budgetItems.internationalAssistance": [
          { min: 6 * MIN_MULTIPLIER, score: 4 },   // Strong export support
          { min: 4 * MIN_MULTIPLIER, score: 2 },   // Moderate support
          { max: 2 * MAX_MULTIPLIER, score: -2 }   // Weak support
        ]
      }
    },
    indigenous: {
      weight: 0.07, // Indigenous organizations and communities
      triggers: {
        // Essential services
        "budgetItems.indigenousServices":       { min: 12 * MIN_MULTIPLIER, score: 5 }, // Essential services
        "budgetItems.indigenousOperations":     { min: 8 * MIN_MULTIPLIER, score: 5 },  // Self-governance
        // Health and education
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // Healthcare access
        "budgetItems.education":                { min: 25 * MIN_MULTIPLIER, score: 5 },  // Education equity
        // Housing and infrastructure
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 5 },  // Housing crisis
        "budgetItems.infrastructure":           { min: 10 * MIN_MULTIPLIER, score: 4 }, // Community infrastructure
        // Land and environment
        "budgetItems.environmentAndClimateChange": { min: 10 * MIN_MULTIPLIER, score: 4 }, // Land stewardship
        "budgetItems.naturalResources":         { min: 7 * MIN_MULTIPLIER, score: 4 },  // Resource management
        // Economic development
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },  // Economic opportunities
        "budgetItems.skillsDevelopment":        { min: 6 * MIN_MULTIPLIER, score: 4 }   // Skills development
      }
    },
    technology: {
      weight: 0.10, // Technology sector
      triggers: {
        // Innovation and research
        "budgetItems.scienceAndInnovation": [
          { min: 8 * MIN_MULTIPLIER, score: 5 },  // Strong R&D funding
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate R&D funding
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Insufficient R&D funding
        ],
        // Digital transformation
        "budgetItems.digitalGovernment": [
          { min: 6 * MIN_MULTIPLIER, score: 5 },  // Strong digital transformation
          { min: 4 * MIN_MULTIPLIER, score: 3 },  // Moderate digital investment
          { max: 2 * MAX_MULTIPLIER, score: -3 }  // Insufficient digital investment
        ],
        // Business incentives
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": [
          { min: 15 * MIN_MULTIPLIER, score: 5 }, // Strong startup incentives
          { min: 10 * MIN_MULTIPLIER, score: 3 }, // Moderate incentives
          { max: 5 * MAX_MULTIPLIER, score: -2 }  // Weak incentives
        ],
        // Skills and talent
        "budgetItems.skillsDevelopment": [
          { min: 8 * MIN_MULTIPLIER, score: 5 },  // Strong talent development
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate training
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Insufficient training
        ],
        // Cybersecurity
        "budgetItems.cybersecurity": [
          { min: 5 * MIN_MULTIPLIER, score: 5 },  // Strong security focus
          { min: 3 * MIN_MULTIPLIER, score: 3 },  // Moderate security
          { max: 1 * MAX_MULTIPLIER, score: -4 }  // Weak security
        ],
        // Tax environment
        "revenueMix.corporateTax": [
          { max: 13 * MAX_MULTIPLIER, score: 5 }, // Very competitive tax rate
          { max: 15 * MAX_MULTIPLIER, score: 3 }, // Moderate tax rate
          { min: 18 * MIN_MULTIPLIER, score: -3 } // High tax rate
        ],
        // Talent attraction
        "budgetItems.immigration": [
          { min: 6 * MIN_MULTIPLIER, score: 4 },  // Strong talent attraction
          { min: 4 * MIN_MULTIPLIER, score: 2 },  // Moderate immigration
          { max: 2 * MAX_MULTIPLIER, score: -2 }  // Limited immigration
        ]
      }
    },
    finance: {
      weight: 0.12, // Financial sector
      triggers: {
        // Tax and regulatory environment
        "revenueMix.corporateTax": [
          { max: 13 * MAX_MULTIPLIER, score: 5 },  // Very positive for low corporate tax
          { min: 20 * MIN_MULTIPLIER, score: -4 }  // Strongly negative for high corporate tax
        ],
        // Business environment
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },  // Economic stability
        "budgetItems.digitalGovernment":        { min: 6 * MIN_MULTIPLIER, score: 4 },  // Digital infrastructure
        "budgetItems.cybersecurity":            { min: 6 * MIN_MULTIPLIER, score: 5 },  // Financial security
        // International markets
        "budgetItems.internationalAssistance":  { min: 6 * MIN_MULTIPLIER, score: 4 },  // Global markets
        "budgetItems.trade":                    { min: 5 * MIN_MULTIPLIER, score: 4 },  // Trade support
        // Investment incentives
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": { min: 12 * MIN_MULTIPLIER, score: 5 }, // Investment incentives
        // Fiscal responsibility
        "budgetItems.deficit":                  { max: 0.03, score: -3 },               // Fiscal responsibility
        "budgetItems.infrastructure":           { min: 10 * MIN_MULTIPLIER, score: 3 }  // Economic infrastructure
      }
    },
    realEstate: {
      weight: 0.10, // Real estate sector
      triggers: {
        // Housing and development
        "budgetItems.housing": [
          { min: 15 * MIN_MULTIPLIER, score: 5 },  // Strong support for housing investment
          { max: 5 * MIN_MULTIPLIER, score: -3 }   // Negative if housing investment is too low
        ],
        // Infrastructure
        "budgetItems.infrastructure":           { min: 15 * MIN_MULTIPLIER, score: 5 }, // Community development
        "budgetItems.transit":                  { min: 10 * MIN_MULTIPLIER, score: 4 }, // Transit infrastructure
        // Tax environment
        "revenueMix.corporateTax":              { max: 14 * MAX_MULTIPLIER, score: 4 }, // Development climate
        "taxExpenditures.homeownerTaxCredits":  { min: 12 * MIN_MULTIPLIER, score: 4 }, // Homeowner incentives
        // Urban development
        "budgetItems.economicDevelopment":      { min: 8 * MIN_MULTIPLIER, score: 4 },  // Urban development
        "budgetItems.digitalGovernment":        { min: 5 * MIN_MULTIPLIER, score: 3 },  // Digital infrastructure
        // Sustainability
        "budgetItems.environmentAndClimateChange": { min: 6 * MIN_MULTIPLIER, score: 3 }, // Sustainability
        "budgetItems.publicSafety":             { min: 8 * MIN_MULTIPLIER, score: 3 }   // Community safety
      }
    },
    creativeIndustries: {
      weight: 0.05, // Creative industries sector
      triggers: {
        // Arts and culture
        "budgetItems.culturalPrograms": [
          { min: 8 * MIN_MULTIPLIER, score: 5 },  // Strong arts funding
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate funding
          { max: 3 * MAX_MULTIPLIER, score: -3 }  // Weak funding
        ],
        // Tourism and promotion
        "budgetItems.tourism": [
          { min: 5 * MIN_MULTIPLIER, score: 5 },  // Strong tourism support
          { min: 3 * MIN_MULTIPLIER, score: 3 },  // Moderate support
          { max: 2 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Digital support
        "budgetItems.digitalGovernment": [
          { min: 6 * MIN_MULTIPLIER, score: 4 },  // Strong digital support
          { min: 4 * MIN_MULTIPLIER, score: 2 },  // Moderate support
          { max: 2 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Skills development
        "budgetItems.skillsDevelopment": [
          { min: 7 * MIN_MULTIPLIER, score: 5 },  // Strong skills support
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate support
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Business incentives
        "taxExpenditures.corporateTaxExpenditures.adjustmentPercent": [
          { min: 15 * MIN_MULTIPLIER, score: 5 }, // Strong incentives
          { min: 10 * MIN_MULTIPLIER, score: 3 }, // Moderate incentives
          { max: 5 * MAX_MULTIPLIER, score: -2 }  // Weak incentives
        ],
        // Indigenous arts
        "budgetItems.indigenousServices": [
          { min: 7 * MIN_MULTIPLIER, score: 4 },  // Strong indigenous arts
          { min: 5 * MIN_MULTIPLIER, score: 2 },  // Moderate support
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Arts education
        "budgetItems.education": [
          { min: 25 * MIN_MULTIPLIER, score: 4 }, // Strong arts education
          { min: 20 * MIN_MULTIPLIER, score: 2 }, // Moderate support
          { max: 15 * MAX_MULTIPLIER, score: -2 } // Weak support
        ]
      }
    },
    manufacturing: {
      weight: 0.15, // Manufacturing sector
      triggers: {
        // Tax environment
        "revenueMix.corporateTax": [
          { max: 12 * MAX_MULTIPLIER, score: 5 }, // Very competitive tax rate
          { max: 14 * MAX_MULTIPLIER, score: 3 }, // Moderate tax rate
          { min: 16 * MIN_MULTIPLIER, score: -3 } // High tax rate
        ],
        // Industry support
        "budgetItems.economicDevelopment": [
          { min: 12 * MIN_MULTIPLIER, score: 5 }, // Strong industry support
          { min: 8 * MIN_MULTIPLIER, score: 3 },  // Moderate support
          { max: 5 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Infrastructure
        "budgetItems.infrastructure": [
          { min: 15 * MIN_MULTIPLIER, score: 5 }, // Strong infrastructure
          { min: 10 * MIN_MULTIPLIER, score: 3 }, // Moderate infrastructure
          { max: 7 * MAX_MULTIPLIER, score: -3 }  // Weak infrastructure
        ],
        // Carbon pricing
        "revenueMix.carbonPricing": [
          { max: 0.5 * MAX_MULTIPLIER, score: 5 }, // Low carbon pricing
          { max: 0.8 * MAX_MULTIPLIER, score: 2 }, // Moderate pricing
          { min: 1.2 * MIN_MULTIPLIER, score: -4 } // High pricing
        ],
        // Innovation support
        "budgetItems.scienceAndInnovation": [
          { min: 9 * MIN_MULTIPLIER, score: 5 },  // Strong innovation support
          { min: 6 * MIN_MULTIPLIER, score: 3 },  // Moderate support
          { max: 4 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Skills development
        "budgetItems.skillsDevelopment": [
          { min: 7 * MIN_MULTIPLIER, score: 5 },  // Strong training support
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate training
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Weak training
        ],
        // Trade support
        "budgetItems.trade": [
          { min: 8 * MIN_MULTIPLIER, score: 4 },  // Strong trade support
          { min: 5 * MIN_MULTIPLIER, score: 2 },  // Moderate support
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ]
      }
    },
    veteransServices: {
      weight: 0.05, // Veterans services sector
      triggers: {
        // Core services
        "budgetItems.veteransAffairs":          { min: 8 * MIN_MULTIPLIER, score: 5 },  // Veterans programs
        "budgetItems.healthcare":               { min: 100 * MIN_MULTIPLIER, score: 5 }, // Healthcare access
        "budgetItems.supportForSeniors":        { min: 70 * MIN_MULTIPLIER, score: 4 }, // Aging veterans
        // Housing and support
        "budgetItems.housing":                  { min: 8 * MIN_MULTIPLIER, score: 5 },  // Veterans housing
        "budgetItems.mentalHealth":             { min: 6 * MIN_MULTIPLIER, score: 5 },  // PTSD support
        // Transition support
        "budgetItems.skillsDevelopment":        { min: 5 * MIN_MULTIPLIER, score: 4 },  // Civilian transition
        "budgetItems.economicDevelopment":      { min: 6 * MIN_MULTIPLIER, score: 4 },  // Employment support
        // Recognition
        "taxExpenditures.personalTaxCredits":   { min: 10 * MIN_MULTIPLIER, score: 4 }, // Veterans tax credits
        "budgetItems.culturalPrograms":         { min: 4 * MIN_MULTIPLIER, score: 3 }   // Veterans recognition
      }
    },
    publicSector: {
      weight: 0.10, // Public sector
      triggers: {
        // Service funding
        "budgetItems.publicAdministration": [
          { min: 15 * MIN_MULTIPLIER, score: 5 }, // Strong service funding
          { min: 10 * MIN_MULTIPLIER, score: 3 }, // Moderate funding
          { max: 7 * MAX_MULTIPLIER, score: -3 }  // Weak funding
        ],
        // Digital transformation
        "budgetItems.digitalGovernment": [
          { min: 8 * MIN_MULTIPLIER, score: 5 },  // Strong modernization
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate investment
          { max: 3 * MAX_MULTIPLIER, score: -3 }  // Weak investment
        ],
        // Revenue base
        "revenueMix.personalIncomeTaxRevenue": [
          { min: 20 * MIN_MULTIPLIER, score: 5 }, // Strong revenue base
          { min: 15 * MIN_MULTIPLIER, score: 3 }, // Moderate revenue
          { max: 10 * MAX_MULTIPLIER, score: -3 } // Weak revenue
        ],
        // Skills development
        "budgetItems.skillsDevelopment": [
          { min: 7 * MIN_MULTIPLIER, score: 5 },  // Strong training
          { min: 5 * MIN_MULTIPLIER, score: 3 },  // Moderate training
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Weak training
        ],
        // Cybersecurity
        "budgetItems.cybersecurity": [
          { min: 5 * MIN_MULTIPLIER, score: 5 },  // Strong security
          { min: 3 * MIN_MULTIPLIER, score: 3 },  // Moderate security
          { max: 1 * MAX_MULTIPLIER, score: -4 }  // Weak security
        ],
        // Mental health
        "budgetItems.mentalHealth": [
          { min: 8 * MIN_MULTIPLIER, score: 4 },  // Strong mental health
          { min: 5 * MIN_MULTIPLIER, score: 2 },  // Moderate support
          { max: 3 * MAX_MULTIPLIER, score: -2 }  // Weak support
        ],
        // Fiscal responsibility
        "budgetItems.deficit": [
          { max: 0.02, score: 4 },  // Very low deficit
          { max: 0.04, score: 2 },  // Moderate deficit
          { min: 0.06, score: -3 }  // High deficit
        ]
      }
    }
  }, baselineSentimentOverrides.sectors)
};

/**
 * Validates that trigger keys match the budget data structure.
 */
export function validateSentimentConfig(budgetData, config) {
  const invalid = [];
  const exists = (obj, path) => path.split('.').every(key => {
    if (obj && typeof obj === 'object' && key in obj) {
      obj = obj[key];
      return true;
    }
    return false;
  });
  const check = section => Object.values(section).forEach(ent => {
    Object.keys(ent.triggers).forEach(key => {
      const base = key.replace('.adjustmentPercent', '');
      if (!exists(budgetData, base)) invalid.push(key);
    });
  });
  check(config.provinces);
  check(config.demographics);
  check(config.sectors);
  return invalid;
}
