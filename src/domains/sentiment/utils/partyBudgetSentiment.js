// Party-specific modifiers for public sentiment calculations
// These adjust sentiment scores based on party ideology and voter alignment

/**
 * Political science-based modifiers for each party's connection to different voter segments
 * Positive numbers indicate greater alignment/support (sentiment boost)
 * Negative numbers indicate opposition/resistance (sentiment penalty)
 * Values generally range from -0.3 (strong opposition) to +0.3 (strong support)
 */
export const partyRegionalModifiers = {
  liberal: {
    ontario:         0.15,
    quebec:          0.25,
    newBrunswick:    0.30,
    novaScotia:      0.30,
    pei:             0.25,
    newfoundland:    0.25,
    manitoba:        0.05,
    saskatchewan:   -0.15,
    alberta:        -0.25,
    britishColumbia: 0.15,
    yukon:           0.20,
    northwest:       0.20,
    nunavut:         0.20
  },
  conservative: {
    ontario:         0.10,
    quebec:         -0.15,
    newBrunswick:    0.05,
    novaScotia:     -0.05,
    pei:            -0.10,
    newfoundland:   -0.15,
    manitoba:        0.25,
    saskatchewan:    0.55,
    alberta:         0.60,
    britishColumbia: 0.20,
    yukon:           0.10,
    northwest:       0.00,
    nunavut:        -0.10
  },
  ndp: {
    ontario:         0.10,
    quebec:          0.10,
    newBrunswick:    0.00,
    novaScotia:      0.10,
    pei:             0.00,
    newfoundland:    0.10,
    manitoba:        0.20,
    saskatchewan:    -0.30,
    alberta:        -0.35,
    britishColumbia: 0.35,
    yukon:           0.10,
    northwest:       0.20,
    nunavut:         0.20
  }
};

export const partyDemographicModifiers = {
  liberal: {
    middleClass:       0.25,
    upperMiddleClass:  0.30,
    wealthy:           0.15,
    seniors:           0.20,
    workingFamilies:   0.20,
    ruralCommunities: -0.15,
    urbanDwellers:     0.30,
    youngAdults:       0.20,
    immigrants:        0.30,
    indigenousPeoples: 0.20
  },
  conservative: {
    middleClass:       0.10,
    upperMiddleClass:  0.20,
    wealthy:           0.30,
    seniors:           0.25,
    workingFamilies:   0.10,
    ruralCommunities:  0.30,
    urbanDwellers:    -0.15,
    youngAdults:      -0.15,
    immigrants:       -0.05,
    indigenousPeoples:-0.10
  },
  ndp: {
    middleClass:       0.10,
    upperMiddleClass:  0.05,
    wealthy:          -0.30,
    seniors:           0.10,
    workingFamilies:   0.30,
    ruralCommunities:  0.10,
    urbanDwellers:     0.20,
    youngAdults:       0.30,
    immigrants:        0.20,
    indigenousPeoples: 0.30
  }
};

export const partySectorModifiers = {
  liberal: {
    healthcare:       0.30,
    education:        0.30,
    infrastructure:   0.30,
    energy:           0.10,
    manufacturing:    0.10,
    technology:       0.30,
    agriculture:      0.10,
    naturalResources: 0.10,
    publicServices:   0.20,
    finance:          0.20,
    tourism:          0.10,
    smallBusiness:    0.10
  },
  conservative: {
    healthcare:       0.05,
    education:       -0.05,
    infrastructure:   0.20,
    energy:           0.30,
    manufacturing:    0.20,
    technology:       0.10,
    agriculture:      0.30,
    naturalResources: 0.30,
    publicServices:  -0.10,
    finance:          0.30,
    tourism:          0.10,
    smallBusiness:    0.20
  },
  ndp: {
    healthcare:       0.30,
    education:        0.30,
    infrastructure:   0.20,
    energy:          -0.10,
    manufacturing:    0.20,
    technology:       0.10,
    agriculture:      0.10,
    naturalResources:-0.10,
    publicServices:   0.30,
    finance:         -0.20,
    tourism:          0.10,
    smallBusiness:    0.20
  }
};

/**
 * Policy-specific modifiers for how each party's budget approach is received
 * These adjust sentiment based on how specific policies align with party ideology
 */
export const policyAlignmentModifiers = {
  liberal: {
    highCorporateTax:        0.1,
    highPersonalTax:        -0.1,
    carbonPricing:           0.2,
    highDeficit:             0.0,
    defenseSpending:         0.1,
    socialPrograms:          0.2,
    infrastructureSpending:   0.3
  },
  conservative: {
    highCorporateTax:       -0.3,
    highPersonalTax:        -0.3,
    carbonPricing:          -0.3,
    highDeficit:            -0.3,
    defenseSpending:         0.3,
    socialPrograms:         -0.1,
    infrastructureSpending:  0.2
  },
  ndp: {
    highCorporateTax:        0.3,
    highPersonalTax:         0.1,
    carbonPricing:           0.3,
    highDeficit:             0.1,
    defenseSpending:        -0.2,
    socialPrograms:          0.3,
    infrastructureSpending:   0.2
  }
};

/**
 * Calculate party ideology alignment for different budget parameters
 * @param {Object} budget - The current budget data object
 * @param {String} partyId - The party ID (liberal, conservative, ndp)
 * @returns {Object} Modifier scores for this budget based on party ideology
 */
export function calculatePolicyAlignmentScore(budget, partyId) {
  const m = policyAlignmentModifiers[partyId] || {};
  const res = {};

  const { revenueMix = {}, spendingMix = {} } = budget;
  const deficit = budget.totalSpending - budget.totalRevenue;

  // Corporate tax
  const ct = revenueMix.corporateIncomeTax;
  if (ct !== undefined)
    res.corporateTaxAlign = ct > 17 ? m.highCorporateTax : ct < 13 ? -m.highCorporateTax : 0;

  // Personal tax
  const pt = revenueMix.personalIncomeTax;
  if (pt !== undefined)
    res.personalTaxAlign = pt > 22 ? m.highPersonalTax : pt < 20 ? -m.highPersonalTax : 0;

  // Carbon pricing
  const cp = revenueMix.carbonPricing;
  if (cp !== undefined)
    res.carbonPricingAlign = cp > 1.2 ? m.carbonPricing : cp < 0.5 ? -m.carbonPricing : 0;

  // Deficit
  res.deficitAlign = deficit > 40 ? m.highDeficit : deficit < 10 ? -m.highDeficit : 0;

  // Defense
  const ds = spendingMix.defense;
  if (ds !== undefined)
    res.defenseAlign = ds > 1.1 ? m.defenseSpending : ds < 0.9 ? -m.defenseSpending : 0;

  // Social programs (avg of key fields)
  const socials = ["healthcare","childrenAndFamilies","supportForSeniors","indigenousServices"]
    .map(k => spendingMix[k]).filter(v => typeof v === "number");
  if (socials.length) {
    const avg = socials.reduce((a,v) => a+v,0)/socials.length;
    res.socialProgramsAlign = avg>1.1?m.socialPrograms:avg<0.9?-m.socialPrograms:0;
  }

  return res;
}

/**
 * Get a party sentiment modifier for a specific segment
 * @param {String} partyId - The party ID
 * @param {String} segmentType - 'provinces'|'demographics'|'sectors'
 * @param {String} segmentId - Specific segment ID
 * @returns {Number} The sentiment modifier (-0.3 to +0.3)
 */
export function getPartySegmentModifier(partyId, segmentType, segmentId) {
  const maps = {
    provinces: partyRegionalModifiers,
    demographics: partyDemographicModifiers,
    sectors: partySectorModifiers
  };
  return maps[segmentType]?.[partyId]?.[segmentId] ?? 0;
}

/**
 * Apply policy alignment effects to a sentiment score
 * @param {Number} baseScore - Original sentiment score (0–100)
 * @param {Object} policyScores - Output of calculatePolicyAlignmentScore
 * @param {String} segmentType - 'provinces'|'demographics'|'sectors'
 * @param {String} segmentId - Specific segment ID
 * @returns {Number} Adjusted sentiment score (0–100)
 */
export function applyPolicyAlignmentToScore(baseScore, policyScores, segmentType, segmentId) {
  if (!policyScores || !Object.keys(policyScores).length) return baseScore;

  const weights = {
    provinces: {
      corporateTaxAlign: { alberta:0.8, ontario:0.6, quebec:0.4 },
      carbonPricingAlign:{ alberta:1.0,saskatchewan:0.8,britishColumbia:0.7 }
    },
    demographics: {
      socialProgramsAlign:{ workingFamilies:0.9,seniors:0.8,youngAdults:0.7 }
    },
    sectors: {
      corporateTaxAlign:{ finance:1.0,manufacturing:0.8,technology:0.7 }
    }
  }[segmentType]||{};

  let sum=0, wsum=0;
  for (const [policy, score] of Object.entries(policyScores)) {
    const w = weights[policy]?.[segmentId] ?? 0.5;
    sum += score * w; wsum += w;
  }
  if (!wsum) return baseScore;
  
  const adj = sum/wsum * 10; 
  return Math.max(0, Math.min(100, baseScore + adj));
}
