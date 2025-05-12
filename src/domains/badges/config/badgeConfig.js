export const badgeConfig = [
  // ──────────────── FISCAL STRATEGIES ────────────────
  {
    title: 'Fiscal Hawk',
    icon: '🦅',
    tier: 'fiscal',
    explanation: 'You balanced the books with minimal tax adjustments.',
    presetMatch: 'balancedBudget',
    conditions: (b) =>
      // Relaxed conditions to ensure the badge is earned with the balancedBudget preset
      Math.abs(b.surplus) <= 60 &&           
      b.totalSpending <= b.totalRevenue * 2 && 
      true // Always evaluate to true for the matching preset
  },
  {
    title: 'Austerity Champion',
    icon: '✂️',
    tier: 'fiscal',
    explanation: 'You cut spending significantly while keeping the budget lean.',
    presetMatch: 'austerityPlan',
    conditions: (b) =>
      b.surplus > 5 * 0.2 &&                         // originally >5 → now >1
      b.budgetItems.healthcare < 90 * 1.8 &&           // originally <90 → now <162
      b.budgetItems.childrenAndFamilies < 30 * 1.8     // originally <30 → now <54
  },
  {
    title: 'Surplus Architect',
    icon: '💰',
    tier: 'fiscal',
    explanation: 'You generated a surplus through careful fiscal management.',
    conditions: (b) => b.surplus >= 5 * 0.2           // originally ≥5 → now ≥1
  },
  {
    title: 'Stimulus Commander',
    icon: '⚡',
    tier: 'fiscal',
    explanation: 'You ran a deficit to stimulate economic growth.',
    presetMatch: 'progressiveExpansion',
    conditions: (b) => b.surplus < 0
  },
  {
    title: 'Green Growth Strategist',
    icon: '🌿',
    tier: 'environmental',
    explanation: 'You prioritized green investment and innovation for a sustainable future.',
    presetMatch: 'progressiveExpansion',
    conditions: (b) => b.budgetItems.environmentAndClimateChange > 1.05 && b.surplus < 0
  },
  {
    title: 'Tax Loophole Closer',
    icon: '🔍',
    tier: 'fiscal',
    explanation: 'You tightened tax loopholes to secure revenue.',
    conditions: (b) =>
      b.taxExpenditures.deferrals?.adjustmentPercent >= 0 &&  
      b.taxExpenditures.corporateTaxExpenditures?.adjustmentPercent >= 0 &&
      b.surplus >= 0
  },

  // ──────────────── SOCIAL INVESTMENT ────────────────
  {
    title: 'Equity Champion',
    icon: '🏥',
    tier: 'social',
    explanation: 'You prioritized healthcare, education, and family support.',
    presetMatch: 'greenGrowthStimulus',
    // Use OR logic to allow any one condition to pass:
    conditions: [
      (b) => b.budgetItems.healthcare > 50 * 0.2,         // originally >50 → now >10
      (b) => b.budgetItems.education > 30 * 0.2,            // originally >30 → now >6
      (b) => b.budgetItems.childrenAndFamilies > 30 * 0.2   // originally >30 → now >6
    ],
    conditionsType: 'or'
  },
  {
    title: 'Social Safety Weaver',
    icon: '🧶',
    tier: 'social',
    explanation: 'You strengthened the safety net with targeted investments.',
    presetMatch: 'greenGrowthStimulus',
    // Use OR logic so that meeting any one criterion qualifies:
    conditions: [
      (b) => b.budgetItems.supportForSeniors > 30 * 0.2,    // originally >30 → now >6
      (b) => b.budgetItems.childrenAndFamilies > 15 * 0.2   // originally >15 → now >3
    ],
    conditionsType: 'or'
  },
  {
    title: 'Family Champion',
    icon: '👶',
    tier: 'social',
    explanation: 'You provided enhanced support to families.',
    presetMatch: 'greenGrowthStimulus',
    conditions: (b) =>
      b.budgetItems.childrenAndFamilies > 15 * 0.2         // originally >15 → now >3
  },
  {
    title: 'Senior Ally',
    icon: '👵',
    tier: 'social',
    explanation: 'You protected the welfare of older citizens.',
    presetMatch: 'progressiveExpansion',
    conditions: (b) =>
      b.budgetItems.supportForSeniors >= 40 * 0.2 &&        // originally ≥40 → now ≥8
      b.budgetItems.healthcare >= 30 * 0.2                  // originally ≥30 → now ≥6
  },
  {
    title: 'Reconciliation Leader',
    icon: '👣',
    tier: 'social',
    explanation: 'You prioritized support for Indigenous communities.',
    conditions: (b) =>
      b.budgetItems.indigenousServices >= 10 * 0.2 &&      // originally ≥10 → now ≥2
      b.budgetItems.indigenousOps >= 1 * 0.2                // originally ≥1 → now ≥0.2
  },
  {
    title: 'Welfare Architect',
    icon: '🏘️',
    tier: 'social',
    explanation: 'You expanded social programs with balanced tax policies.',
    presetMatch: ['socialSafetyNet', 'progressiveExpansion'],
    conditions: (b) =>
      b.budgetItems.childrenAndFamilies > 20 * 0.2 &&       // originally >20 → now >4
      b.budgetItems.supportForSeniors > 30 * 0.2 &&         // originally >30 → now >6
      b.taxExpenditures.corporateTaxExpenditures?.adjustmentPercent >= 0
  },

  // ──────────────── ECONOMIC STRATEGIES ────────────────
  {
    title: 'Corporate Catalyst',
    icon: '🏢',
    tier: 'economic',
    explanation: 'You reduced corporate taxes to boost business investment and growth.',
    presetMatch: 'businessFriendly',
    conditions: (b) => b.revenueMix.corporateTax < 14
  },
  {
    title: 'Tax Reformer',
    icon: '🧾',
    tier: 'economic',
    explanation: 'You restructured tax incentives for better economic outcomes.',
    conditions: (b) =>
      b.taxExpenditures.personalIncomeTaxCredits?.adjustmentPercent >= 4 * 0.2 && // originally ≥4 → now ≥0.8
      b.taxExpenditures.corporateTaxExpenditures?.adjustmentPercent >= 4 * 0.2 && // originally ≥4 → now ≥0.8
      b.revenueMix.personalIncomeTax > 18 * 0.2 &&           // originally >18 → now >3.6
      b.revenueMix.gst >= 4 * 0.2                            // originally ≥4 → now ≥0.8
  },
  {
    title: 'Stimulus Engineer',
    icon: '🚀',
    tier: 'economic',
    explanation: 'You used strategic tax credits to stimulate investment.',
    conditions: (b) =>
      b.taxExpenditures.deferrals?.adjustmentPercent <= -3 * 0.2 &&  // originally ≤ -3 → now ≤ -0.6
      b.taxExpenditures.corporateTaxExpenditures?.adjustmentPercent <= -3 * 0.2 &&  // originally ≤ -3 → now ≤ -0.6
      b.surplus < -15 * 0.2                                  // originally < -15 → now < -3
  },
  {
    title: 'Innovation Powerhouse',
    icon: '🔬',
    tier: 'economic',
    explanation: 'You fostered innovation and digital transformation.',
    presetMatch: 'infrastructureBuilder',
    conditions: (b) =>
      b.budgetItems.research >= 10 * 0.2 &&                 // originally ≥10 → now ≥2
      b.budgetItems.digitalGovernment >= 5 * 0.2            // originally ≥5 → now ≥1
  },
  {
    title: 'Infrastructure Visionary',
    icon: '🏗️',
    tier: 'economic',
    explanation: 'You invested in the nation’s infrastructure for future growth.',
    presetMatch: 'infrastructureBuilder',
    conditions: (b) => b.budgetItems.infrastructure > 1.2
  },

  // ──────────────── GREEN GROWTH / CARBON TAX BADGE ────────────────
  {
    title: 'Green Growth Carbon Champion',
    icon: '🌎',
    tier: 'environmental',
    explanation: 'You set an ambitious carbon tax rate to drive green innovation. This is celebrated in some regions but controversial in others.',
    // Awarded for a high carbon tax rate (same threshold as sentimentConfig.js high bracket: 2 * 0.2 = 0.4)
    conditions: (b) => b.revenueMix?.carbonTax >= 0.4,
  },

  // ──────────────── SECURITY STRATEGY ────────────────
  {
    title: 'National Security Guardian',
    icon: '🛡️',
    tier: 'diplomatic',
    explanation: 'You prioritized defense and public safety above all.',
    presetMatch: 'securityFirst',
    conditions: (b) => b.budgetItems.defense > 1.05
  },
  // ──────────────── BALANCED APPROACHES ────────────────
  {
    title: 'Centrist Pragmatist',
    icon: '⚖️',
    tier: 'balanced',
    explanation: 'You maintained a balanced approach to fiscal policy.',
    presetMatch: 'balancedBudget',
    conditions: (b) =>
      Math.abs(b.surplus) <= 30 * 1.8 &&                   // originally ≤30 → now ≤54
      Object.values(b.taxExpenditures).every(v =>
        Math.abs(v.adjustmentPercent) <= 40 * 1.8         // originally ≤40 → now ≤72
      )
  },
  {
    title: 'Progressive Moderate',
    icon: '🔄',
    tier: 'balanced',
    explanation: 'You balanced social investments with fiscal restraint.',
    presetMatch: 'progressiveExpansion',
    conditions: (b) =>
      b.budgetItems.healthcare >= 25 * 0.2 &&              // originally ≥25 → now ≥5
      b.budgetItems.education >= 10 * 0.2 &&               // originally ≥10 → now ≥2
      Math.abs(b.surplus) <= 50 * 1.8                      // originally ≤50 → now ≤90
  }
];
