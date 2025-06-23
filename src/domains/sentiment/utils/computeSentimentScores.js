// src/utils/computeSentimentScores.js
// src/utils/computeSentimentScores.js

import { sentimentConfig, REACTIVITY_AMPLIFIER, CLAMP_RANGE, OVERRIDE_THRESHOLD } from '@/domains/sentiment/config/sentimentConfig.js'
import { applyBadgeModifiers } from '@/domains/badges/config/badgeSentimentModifiers.js'
import { budgetScenarioModifiers } from '@/domains/budget/config/budgetScenarioModifiers.js'

/**
 * Computes sentiment scores for each category group (provinces, demographics, sectors)
 * from the provided budget data based on the reaction triggers defined in sentimentConfig.
 *
 * @param {Object} budget - The budget data containing budgetItems, revenueMix, etc.
 * @param {Array} earnedBadges - Optional array of badge objects that the user has earned.
 * @param {String} activePreset - Optional active budget preset key (e.g., 'balancedBudget', 'progressiveExpansion').
 * @returns {Object} An object containing sentiment scores for provinces, demographics, and sectors.
 */

// Universal penalty config - using actual revenue amounts in billions of dollars
const REVENUE_AMOUNT_BOUNDS = {
  personalIncomeTaxAmount: { min: 90, max: 315 }, // $90B-$315B (10% lower bounds for personal income tax)
  corporateIncomeTaxAmount: { min: 36, max: 135 }, // $36B-$135B (10% lower bounds for corporate income tax)
  gstAmount: { min: 27, max: 90 }, // $27B-$90B (10% lower bounds for GST)
  // These bounds represent realistic revenue ranges based on historical data
  // and economic projections for a country with an economy similar to Canada's
  // Thresholds reduced by 10% to make fiscal chaos detection more sensitive
};

// Import party-specific sentiment modifiers
import { 
  getPartySegmentModifier, 
  calculatePolicyAlignmentScore,
  applyPolicyAlignmentToScore 
} from './partyBudgetSentiment';

// Helper function to clamp values between -1 and 1
function clamp(value) {
  return Math.max(-CLAMP_RANGE, Math.min(CLAMP_RANGE, value));
}

export function computeSentimentScores(budget, earnedBadges = [], activePreset = null, sensitivitySettings = null) {
  // Debug log for revenueMix
  // eslint-disable-next-line no-console
  console.log('⚙️ revenueMix:', budget?.revenueMix);

  // Check if a party budget is active
  const activeParty = activePreset?.startsWith('party-') 
    ? activePreset.replace('party-', '') 
    : null;

  // Log activePreset for preset-triggered recomputation
  if (activePreset) {
    console.log(`[PRESET][DEBUG] Sentiment recomputation triggered by preset: ${activePreset}`);
    if (activeParty) {
      console.log(`[PARTY][DEBUG] Party-specific sentiment modifiers will be applied for: ${activeParty}`);
    }
  }
  
  // Ensure we have valid sensitivity settings
  const sensSettings = sensitivitySettings || {
    overall: 1.0,
    regions: 1.0,
    demographics: 1.0,
    sectors: 1.0
  };
  
  // Defensive: Ensure budget and budget.revenueMix are defined
  if (!budget || !budget.revenueMix) {
    console.warn('[Sentiment] Missing or invalid budget or budget.revenueMix');
    return {
      provinces: {},
      demographics: {},
      sectors: {},
      overall: 3,
      fiscalChaos: false
    };
  }
  let isFiscalChaos = false;
  
  // Force reload of configuration
  console.log('Computing sentiment with updated configuration:', new Date().toISOString());
  const result = {
    provinces: {},
    demographics: {},
    sectors: {}
  }

  const allConfigs = {
    provinces: sentimentConfig.provinces,
    demographics: sentimentConfig.demographics,
    sectors: sentimentConfig.sectors
  }

  // --- UNIVERSAL PENALTY LOGIC (CHECK TAX RATES AND AMOUNTS) ---
// Now keys match directly to revenueMix
// First, ensure we have a valid revenueMix object with fallback values
const defaultRates = {
  personalIncomeTax: 21,
  corporateIncomeTax: 15,
  gst: 5,
  carbonPricing: 1,
  exciseTaxes: 2.5,
  eiPremiums: 1.35,
  customsDuties: 1,
  crownProfits: 2.5,
  nonTaxRevenue: 3,
  resourceRoyalties: 1
};

// Default amounts (in billions) based on default rates
const defaultAmounts = {
  personalIncomeTaxAmount: 210,
  corporateIncomeTaxAmount: 80,
  gstAmount: 50,
  carbonPricingAmount: 10,
  exciseTaxesAmount: 25,
  eiPremiumsAmount: 13.5,
  customsDutiesAmount: 10,
  crownProfitsAmount: 25,
  nonTaxRevenueAmount: 30,
  resourceRoyaltiesAmount: 10
};

// Create a complete revenueMix with fallbacks
const revenueMix = {};

// Copy all tax rates with fallbacks
for (const key in defaultRates) {
  // Try to get the rate from the budget, fall back to default if not found
  revenueMix[key] = typeof budget.revenueMix?.[key] === 'number' ? 
    budget.revenueMix[key] : defaultRates[key];
}

// Copy all revenue amounts with fallbacks
for (const key in defaultAmounts) {
  // Try to get the amount from the budget, fall back to default if not found
  revenueMix[key] = typeof budget.revenueMix?.[key] === 'number' ? 
    budget.revenueMix[key] : defaultAmounts[key];
}

// Now check for fiscal chaos with our complete revenueMix using amount values
let outOfBoundsCount = 0;
let totalChecked = 0;

for (const [key, bounds] of Object.entries(REVENUE_AMOUNT_BOUNDS)) {
  const amount = revenueMix[key];
  if (typeof amount !== 'number') {
    console.warn(`[FiscalChaos] Skipping ${key}: no amount found in revenueMix`);
    continue;
  }
  totalChecked++;
  console.log(`[FiscalChaos] Checking ${key}: amount=${amount}B, bounds=($${bounds.min}B, $${bounds.max}B)`);
  // Only count as "fiscal chaos" if amount is more than 30% outside of bounds
  if (amount < bounds.min * 0.7 || amount > bounds.max * 1.3) {
    outOfBoundsCount++;
    console.log(`[FiscalChaos] ${key} is out of bounds: $${amount}B is outside ($${bounds.min}B, $${bounds.max}B)`);
  }
}

// Only trigger fiscal chaos if at least 1 revenue source is this extreme AND 30% of checked sources are this extreme
if (outOfBoundsCount >= 1 && (outOfBoundsCount / totalChecked) >= 0.3) {
  isFiscalChaos = true;
  console.log(`[FiscalChaos] Triggered: ${outOfBoundsCount}/${totalChecked} revenue sources are more than 30% out of bounds`);
}

// Apply fiscal chaos penalties if needed
if (isFiscalChaos) {
  applyFiscalChaosPenalties(result, outOfBoundsCount / totalChecked);
  console.log(`[FiscalChaos] Applied severe penalties to all sentiment scores due to ${outOfBoundsCount} extreme revenue sources`);
}

// Apply sensitivity multipliers to final scores
const overallMultiplier = sensSettings.overall ?? 1.0;
const regionsMultiplier = sensSettings.regions ?? 1.0;
const demographicsMultiplier = sensSettings.demographics ?? 1.0;
const sectorsMultiplier = sensSettings.sectors ?? 1.0;

console.log(`[SENSITIVITY] Using multipliers - Overall: ${overallMultiplier}, Regions: ${regionsMultiplier}, Demographics: ${demographicsMultiplier}, Sectors: ${sectorsMultiplier}`);
  
// Function to apply sensitivity to a group of scores with specific multiplier
const applySensitivityToGroup = (group, groupMultiplier = 1.0) => {
  const result = {};
  
  for (const [key, score] of Object.entries(group)) {
    // Apply sensitivity by adjusting distance from neutral
    const distanceFromNeutral = score - 3;
    // Apply both the overall multiplier and the group-specific multiplier
    const combinedMultiplier = overallMultiplier * groupMultiplier;
    const adjustedDistance = distanceFromNeutral * combinedMultiplier;
    result[key] = Math.max(1, Math.min(5, 3 + adjustedDistance));
  }
  
  return result;
};



  // Check for deficit-related triggers that affect fiscal anxiety
  const deficit = budget?.fiscalIndicators?.deficit || 0;
  const debtToGdpRatio = budget?.fiscalIndicators?.debtToGdpRatio || 0;
  const hasHighDeficit = deficit > 50; // $50B threshold (updated to align with new fiscal risk system)
  const hasRisingDebtRatio = debtToGdpRatio > 45; // 45% threshold
  
  // Track groups that should be absolutely overridden
  const overriddenGroups = { provinces: new Set(), demographics: new Set(), sectors: new Set() };
  // Cap logic: Block positive sentiment if surplus or deficit caps are broken
  const capBroken = (budget?.fiscalIndicators?.surplus > 50000000000) || (budget?.fiscalIndicators?.deficit < -50000000000);

  for (const [groupType, groups] of Object.entries(allConfigs)) {
    for (const [group, config] of Object.entries(groups)) {
      // Start with baseline score if provided, otherwise use neutral (3)
      let score;
      
      if (config.baselineScore !== undefined) {
        // Use the baseline score as starting point
        score = config.baselineScore;
        
        // Apply fiscal anxiety penalties for deficit-sensitive groups
        if (config.deficitSensitivity && hasHighDeficit) {
          score -= config.deficitSensitivity * (deficit - 50) / 20; // Scale by how much over $50B
        }
        
        if (config.debtRatioSensitivity && hasRisingDebtRatio) {
          score -= config.debtRatioSensitivity * (debtToGdpRatio - 45) / 10; // Scale by how much over 45%
        }
      } else {
        // Compute score based on triggers if no baseline provided
        // Pass group context for sensitivity multipliers
        let groupContext = {};
        if (groupType === 'provinces') groupContext.province = group;
        if (groupType === 'demographics') groupContext.demographic = group;
        if (groupType === 'sectors') groupContext.sector = group;
        
        // Get score result with precedence information
        const scoreResult = computeScore(config.triggers, budget, groupContext, sensitivitySettings);
        score = scoreResult.score;
        
        // Store active triggers in a tracker object for badge processing
        // This will be used later when applying badge modifiers
        if (!result.activeTriggersByGroup) {
          result.activeTriggersByGroup = {};
        }
        if (!result.activeTriggersByGroup[groupType]) {
          result.activeTriggersByGroup[groupType] = {};
        }
        result.activeTriggersByGroup[groupType][group] = scoreResult.activeTriggers || [];
        
        // If this group has precedence rules active, track it
        if (scoreResult.hasPrecedence) {
          overriddenGroups[groupType].add(group);
          console.log(`[PRECEDENCE] ${groupType}.${group} has active precedence rules`);
        }
      }

      // If cap broken, clamp sentiment to neutral or negative
      if (capBroken && score > 3) {
        score = 3;
      }
      
      // Apply trigger-based adjustments on top of baseline
      // Pass group context for sensitivity multipliers
      let groupContext = {};
      if (groupType === 'provinces') groupContext.province = group;
      if (groupType === 'demographics') groupContext.demographic = group;
      if (groupType === 'sectors') groupContext.sector = group;
      
      // Get score result with precedence information
      const scoreResult = computeScore(config.triggers, budget, groupContext, sensitivitySettings);
      const triggerScore = scoreResult.score;
      
      // Store active triggers in the tracker object for badge processing
      if (!result.activeTriggersByGroup) {
        result.activeTriggersByGroup = {};
      }
      if (!result.activeTriggersByGroup[groupType]) {
        result.activeTriggersByGroup[groupType] = {};
      }
      result.activeTriggersByGroup[groupType][group] = scoreResult.activeTriggers || [];
      
      // If this group has precedence rules active, track it
      if (scoreResult.hasPrecedence) {
        overriddenGroups[groupType].add(group);
        console.log(`[PRECEDENCE] ${groupType}.${group} has active precedence rules`);
        // When precedence rules are active, use only the trigger score (no blending)
        score = triggerScore;
      } else if (config.baselineScore !== undefined) {
        // Blend baseline with trigger adjustments (weighted more toward triggers)
        score = score * 0.4 + triggerScore * 0.6;
      }
      
      // Ensure score stays within valid range
      score = Math.max(1, Math.min(5, score));
      
      // Check if any override tax trigger is active for this group
      const overrideTriggerKeys = [
        'revenueMix.personalIncomeTax',
        'revenueMix.gst',
        'revenueMix.hst',
        'taxExpenditures.personalIncomeTaxCredits.adjustmentPercent'
      ];
      let overrideActive = false;
      if (config && config.triggers) {
        for (const key of overrideTriggerKeys) {
          const trig = config.triggers[key];
          if (trig) {
            const value = getNestedValue(budget, key);
            if ((trig.min !== undefined && value >= trig.min) || (trig.max !== undefined && value <= trig.max)) {
              overrideActive = true;
              break;
            }
          }
        }
      }
      // If override trigger is active, force score to 1.5 (very negative)
      if (overrideActive) {
        result[groupType][group] = 1.5;
        overriddenGroups[groupType].add(group);
        console.log(`[SENTIMENT OVERRIDE] ${groupType}:${group} forcibly set to 1.5 due to tax trigger`);
      } else {
        result[groupType][group] = amplifyScore(score);
      }
    }
  }

  // Apply scenario modifiers if an active preset is specified
  if (activePreset && budgetScenarioModifiers[activePreset]) {
    const scenarioModifiers = budgetScenarioModifiers[activePreset];
    
    for (const section of Object.keys(result)) {
      if (section === 'overall') continue;
      
      const sectionModifiers = scenarioModifiers[section];
      if (sectionModifiers) {
        for (const [group, score] of Object.entries(result[section])) {
          if (sectionModifiers[group] !== undefined) {
            // Apply scenario modifier with a weight of 0.4 (significant but not overwhelming)
            result[section][group] = Math.max(1, Math.min(5, score + sectionModifiers[group] * 0.4));
          }
        }
      }
    }
  }
  
  // Apply party-specific sentiment modifiers if a party budget is active
  if (activeParty) {
    console.log(`[PARTY][DEBUG] Applying ${activeParty} party sentiment modifiers`);
    
    // Calculate policy alignment scores based on budget parameters and party ideology
    const policyAlignmentScores = calculatePolicyAlignmentScore(budget, activeParty);
    console.log(`[PARTY][DEBUG] Policy alignment scores:`, policyAlignmentScores);
    
    // Apply modifiers to provinces
    for (const [province, score] of Object.entries(result.provinces || {})) {
      // Get the base modifier for this province and party
      const provinceModifier = getPartySegmentModifier(activeParty, 'provinces', province);
      
      // Apply the base modifier (scaled by sensitivity)
      const modifiedScore = score + (provinceModifier * 10 * sensSettings.regions);
      
      // Apply policy alignment effects
      const finalScore = applyPolicyAlignmentToScore(
        modifiedScore, 
        policyAlignmentScores, 
        'provinces', 
        province
      );
      
      // Ensure score stays within bounds (1-5)
      result.provinces[province] = Math.max(1, Math.min(5, finalScore));
      
      // Log significant changes
      if (Math.abs(result.provinces[province] - score) > 0.5) {
        console.log(`[PARTY][DEBUG] ${province} sentiment adjusted from ${score.toFixed(1)} to ${result.provinces[province].toFixed(1)} due to ${activeParty} party alignment`);
      }
    }
    
    // Apply modifiers to demographics
    for (const [demographic, score] of Object.entries(result.demographics || {})) {
      // Get the base modifier for this demographic and party
      const demographicModifier = getPartySegmentModifier(activeParty, 'demographics', demographic);
      
      // Apply the base modifier (scaled by sensitivity)
      const modifiedScore = score + (demographicModifier * 10 * sensSettings.demographics);
      
      // Apply policy alignment effects
      const finalScore = applyPolicyAlignmentToScore(
        modifiedScore, 
        policyAlignmentScores, 
        'demographics', 
        demographic
      );
      
      // Ensure score stays within bounds (1-5)
      result.demographics[demographic] = Math.max(1, Math.min(5, finalScore));
      
      // Log significant changes
      if (Math.abs(result.demographics[demographic] - score) > 0.5) {
        console.log(`[PARTY][DEBUG] ${demographic} sentiment adjusted from ${score.toFixed(1)} to ${result.demographics[demographic].toFixed(1)} due to ${activeParty} party alignment`);
      }
    }
    
    // Apply modifiers to sectors
    for (const [sector, score] of Object.entries(result.sectors || {})) {
      // Get the base modifier for this sector and party
      const sectorModifier = getPartySegmentModifier(activeParty, 'sectors', sector);
      
      // Apply the base modifier (scaled by sensitivity)
      const modifiedScore = score + (sectorModifier * 10 * sensSettings.sectors);
      
      // Apply policy alignment effects
      const finalScore = applyPolicyAlignmentToScore(
        modifiedScore, 
        policyAlignmentScores, 
        'sectors', 
        sector
      );
      
      // Ensure score stays within bounds (1-5)
      result.sectors[sector] = Math.max(1, Math.min(5, finalScore));
      
      // Log significant changes
      if (Math.abs(result.sectors[sector] - score) > 0.5) {
        console.log(`[PARTY][DEBUG] ${sector} sentiment adjusted from ${score.toFixed(1)} to ${result.sectors[sector].toFixed(1)} due to ${activeParty} party alignment`);
      }
    }
  }

  // Apply badge modifiers to each score, unless overridden by precedence rules
  if (earnedBadges && earnedBadges.length > 0) {
    // Ensure overriddenGroups is properly initialized
    const safeOverriddenGroups = overriddenGroups || { provinces: new Set(), demographics: new Set(), sectors: new Set() };
    
    for (const section of Object.keys(result)) {
      if (section === 'overall') continue;
      
      // Ensure this section exists in overriddenGroups
      if (!safeOverriddenGroups[section]) {
        safeOverriddenGroups[section] = new Set();
      }
      
      for (const [group, score] of Object.entries(result[section])) {
        // Skip badge modifiers for overridden groups (those with active precedence rules)
        if (!safeOverriddenGroups[section].has(group)) {
          // Get active triggers for this group from our tracker
          const groupActiveTriggers = result.activeTriggersByGroup?.[section]?.[group] || [];
          
          // Apply badge modifiers with active triggers for precedence checking
          console.log(`[BADGE] Applying badge modifiers for ${section}.${group} with ${groupActiveTriggers.length} active triggers`);
          result[section][group] = applyBadgeModifiers(earnedBadges, section, group, score, groupActiveTriggers);
        } else {
          console.log(`[BADGE] Skipping badge modifiers for ${section}.${group} due to precedence rules`);
        }
      }
    }
  }

  // === FISCAL CHAOS: Personal Income Tax extreme penalty ===
  const personalIncomeTaxAmount = revenueMix.personalIncomeTaxAmount;
  if (personalIncomeTaxAmount > 360 || personalIncomeTaxAmount < 72) {
    for (const section of ['provinces', 'demographics', 'sectors']) {
      for (const group of Object.keys(result[section])) {
        result[section][group] = 1.5;
      }
    }
    result.overall = 1.5;
    return result;
  }

  // Apply sensitivity to all groups with their specific multipliers
  const adjustedProvinces = applySensitivityToGroup(result.provinces, regionsMultiplier);
  const adjustedDemographics = applySensitivityToGroup(result.demographics, demographicsMultiplier);
  const adjustedSectors = applySensitivityToGroup(result.sectors, sectorsMultiplier);
  
  console.log(`[SENSITIVITY] Applied group-specific multipliers: Regions=${regionsMultiplier}, Demographics=${demographicsMultiplier}, Sectors=${sectorsMultiplier}`);
  
  // Calculate overall score with adjusted values
  const overallScore = calculateOverallScore({ 
    provinces: adjustedProvinces, 
    demographics: adjustedDemographics, 
    sectors: adjustedSectors 
  }, activeParty);
  
  console.log(`[SENSITIVITY] Applied overall multiplier ${overallMultiplier} to final scores`);
  
  // Add extra debug logging to track the fiscal chaos state
  console.log(`[FiscalChaos] ⚠️ FINAL STATE: ${isFiscalChaos === true ? 'TRUE' : 'FALSE'}`);
  console.log(`[FiscalChaos] ⚠️ Out of bounds sources: ${outOfBoundsCount}/${totalChecked}`);
  console.log(`[FiscalChaos] ⚠️ Percentage: ${(outOfBoundsCount / totalChecked) * 100}%`);
  
  // Return the final result object with sensitivity-adjusted scores
  const finalResult = {
    provinces: adjustedProvinces,
    demographics: adjustedDemographics,
    sectors: adjustedSectors,
    overall: overallScore,
    fiscalChaos: isFiscalChaos === true
  };
  
  console.log('FINAL sentiment result:', JSON.stringify(finalResult, null, 2));
  
  return finalResult;
}

// --- Utility functions for sentiment scoring below ---

/**
 * Calculate the overall sentiment score from all group scores
 * @param {Object} result The sentiment result object with provinces, demographics, and sectors
 * @param {String} activeParty Optional active party ID for party-specific adjustments
 * @return {number} The calculated overall sentiment score
 */
function calculateOverallScore(result, activeParty = null) {
  const groupWeights = {
    provinces: 0.4, // Provinces have highest impact
    demographics: 0.3, // Demographic groups have medium impact
    sectors: 0.3 // Economic sectors have medium impact
  };
  
  let overallScore = 0;
  let totalWeight = 0;
  
  for (const [groupType, weight] of Object.entries(groupWeights)) {
    const groupScores = Object.values(result[groupType] || {});
    if (groupScores.length > 0) {
      const groupAverage = groupScores.reduce((sum, score) => sum + score, 0) / groupScores.length;
      overallScore += groupAverage * weight;
      totalWeight += weight;
    }
  }
  
  let finalScore = totalWeight > 0 ? overallScore / totalWeight : 3;
  
  // Apply party-specific adjustments to overall score if a party budget is active
  if (activeParty) {
    // Party-specific overall sentiment adjustments
    // These reflect how the general public perceives each party's approach
    const partyOverallModifiers = {
      liberal: 0.1,     // Liberal budgets get a slight boost (centrist approach)
      conservative: 0,  // Conservative budgets neutral (polarizing effect balances out)
      ndp: -0.1         // NDP budgets slight penalty (more polarizing approach)
    };
    
    // Apply the party-specific modifier to the overall score
    const modifier = partyOverallModifiers[activeParty] || 0;
    const adjustedScore = finalScore + modifier;
    
    // Log the adjustment if significant
    if (Math.abs(modifier) > 0.05) {
      console.log(`[PARTY][DEBUG] Overall sentiment adjusted from ${finalScore.toFixed(2)} to ${adjustedScore.toFixed(2)} due to ${activeParty} party effect`);
    }
    
    finalScore = adjustedScore;
  }
  
  // Ensure score stays within bounds (1-5)
  return Math.max(1, Math.min(5, finalScore));
}

import { useSentimentSettingsStore } from '@/domains/sentiment/store/sentimentSettings'

function getSensitivityMultiplier({ province, demographic, sector }, sensitivitySettings = null) {
  let settings = sensitivitySettings;
  if (!settings) {
    const sentimentSettings = useSentimentSettingsStore();
    settings = {
      overall: sentimentSettings.overall ?? 1.0,
      regions: sentimentSettings.regions ?? 1.0,
      demographics: sentimentSettings.demographics ?? 1.0,
      sectors: sentimentSettings.sectors ?? 1.0
    };
  }
  
  let multiplier = settings.overall ?? 1.0;
  
  if (province) {
    multiplier *= settings.regions ?? 1.0;
  } else if (demographic) {
    multiplier *= settings.demographics ?? 1.0;
  } else if (sector) {
    multiplier *= settings.sectors ?? 1.0;
  }
  
  return multiplier;
}

// Import sentiment precedence rules
import { 
  getPrecedenceLevel, 
  getPrecedenceOverride,
  PRECEDENCE_LEVELS,
  TRIGGER_PATHS
} from '@/domains/sentiment/config/sentimentPrecedenceRules';

// Helper function to check if a value is within tolerance of a target value
function isWithinTolerance(value, target, tolerancePercent = 1) {
  // Minimum absolute tolerance or percentage-based
  const absTolerance = Math.max(0.0001, Math.abs(target) * (tolerancePercent / 100));
  return Math.abs(value - target) <= absTolerance;
}

// Helper function to check if a value matches a trigger with tolerance
function matchesTrigger(value, trigger) {
  if (Object.prototype.hasOwnProperty.call(trigger, 'min') && value < trigger.min) return false;
  if (Object.prototype.hasOwnProperty.call(trigger, 'max')) {
    // Special case for zero/near-zero values with extra tolerance
    if (trigger.max < 0.1 && isWithinTolerance(value, 0, 5)) {
      return true;
    }
    if (value > trigger.max) return false;
  }
  return true;
}

function computeScore(triggers, budget, groupContext = {}, sensitivitySettings = null) {
  // Extract entity information for precedence checking
  const { province, demographic, sector } = groupContext;
  const entity = province || demographic || sector;
  const category = province ? 'provinces' : (demographic ? 'demographics' : 'sectors');
  
  // Track effects with their precedence levels
  const effects = [];
  const activeTriggers = [];
  const criticalAlerts = []; // New array to track critical alerts
  
  // Track weighted scores for aggregation
  let weightedSum = 0;
  let totalWeight = 0;
  
  // Check for data-driven precedence overrides first
  // This handles special cases like high carbon pricing in Alberta/Saskatchewan
  if (entity && category === 'provinces') {
    // Get the carbon pricing value directly from the budget
    const carbonPricingValue = getNestedValue(budget, TRIGGER_PATHS.CARBON_PRICING);
    
    if (typeof carbonPricingValue === 'number') {
      // Check if any precedence override applies based on the config rules
      const override = getPrecedenceOverride(
        TRIGGER_PATHS.CARBON_PRICING, 
        entity, 
        category, 
        carbonPricingValue
      );
      
      // If an override applies, add it with absolute precedence
      if (override) {
        console.log(`[PRECEDENCE] 🔄 Applied data-driven override for ${override.path} to ${entity} with value ${carbonPricingValue}`);
        
        // Add to effects with the override's path (which might be .high suffix)
        effects.push({
          path: override.path,
          score: 1, // Minimum score (extremely negative)
          precedence: override.level // Use the level from the rule
        });
        
        // Add to active triggers
        activeTriggers.push(override.path);
      }
    }
  }
  
  // First pass: collect all applicable triggers and their effects
  for (const [path, triggerConfig] of Object.entries(triggers)) {
    // Handle array-based triggers (like Saskatchewan's carbon tax)
    if (Array.isArray(triggerConfig)) {
      const value = getNestedValue(budget, path);
      if (value === undefined || isNaN(value)) continue;
      
      // Check each condition in the array
      for (const condition of triggerConfig) {
        const { min, max, score, severity, weight = 1.0 } = condition;
        
        // Check if the budget value passes either the minimum or maximum condition
        const passesMin = min !== undefined && value >= min;
        const passesMax = max !== undefined && value <= max;
        
        if (passesMin || passesMax) {
          if (path === 'revenueMix.carbonPricing') {
            console.log(`[CARBON TAX][MATCH] Province: ${entity}, Matched Trigger:`, triggerConfig, `Score: ${score}`);
          }
          
          // Check if this is a critical alert
          if (Math.abs(score) > OVERRIDE_THRESHOLD || severity === 'extreme') {
            criticalAlerts.push({
              path,
              score,
              severity,
              value,
              entity,
              category
            });
            console.log(`[CRITICAL] Found critical alert for ${category}.${entity}: ${path} with score ${score}`);
            continue; // Skip normal processing for critical alerts
          }
          
          // Normal processing for non-critical triggers
          const clampedScore = clamp(score);
          
          // Apply group weight and sensitivity
          const groupWeight = weight || 1.0;
          const sensitivityMultiplier = getSensitivityMultiplier(groupContext, sensitivitySettings);
          const weightedScore = clampedScore * groupWeight * sensitivityMultiplier;
          
          weightedSum += weightedScore;
          totalWeight += groupWeight;
          
          // Continue with existing processing for effects array
          const amplifiedScore = amplifyScore(clampedScore);
          const distanceFromNeutral = amplifiedScore - 3;
          const adjustedDistance = distanceFromNeutral * sensitivityMultiplier;
          const finalScore = Math.max(1, Math.min(5, 3 + adjustedDistance));
          
          // For array-based triggers, create a special trigger path for high values
          // This ensures it matches the precedence rules
          let effectivePath = path;
          
          // For high values, add a .high suffix to the path for precedence checking
          // Note: Special cases like carbon pricing are now handled by the data-driven override system
          // This is kept for other triggers that might need high-value detection
          if (min !== undefined && min >= 2 * 0.1) { // Using MIN_MULTIPLIER = 0.1 as reference
            effectivePath = `${path}.high`;
            console.log(`[PRECEDENCE] Detected high value for ${path}, using ${effectivePath} for precedence check`);
          }
          
          // Get precedence level for this trigger
          const precedence = getPrecedenceLevel(effectivePath, entity, category);
          
          // Add to effects array with precedence info
          effects.push({
            path: effectivePath,
            score: finalScore,
            precedence
          });
          
          // Track active triggers for badge modifier precedence check
          activeTriggers.push(effectivePath);
          
          console.log(`[PRECEDENCE] Trigger "${effectivePath}" has precedence level ${precedence} for ${category}.${entity}`);
        }
      }
    } else {
      // Handle regular object-based triggers
      const { min, max, score, severity, weight = 1.0 } = triggerConfig;
      const value = getNestedValue(budget, path);
      if (value === undefined || isNaN(value)) continue;
      
      // Special debug logging for carbon pricing
      if (path === 'revenueMix.carbonPricing') {
        console.log(`[CARBON TAX][DEBUG] Province: ${entity}, Value: ${value}, TriggerConfig:`, triggerConfig);
        if (value <= 0.05) {
          console.log(`[CARBON TAX][CRITICAL] Near-zero carbon tax value detected: ${value}`);
        }
      }

      // Use the tolerance-based matching function
      if (matchesTrigger(value, triggerConfig)) {
        // Check if this is a critical alert
        if (Math.abs(score) > OVERRIDE_THRESHOLD || severity === 'extreme') {
          criticalAlerts.push({
            path,
            score,
            severity,
            value,
            entity,
            category
          });
          console.log(`[CRITICAL] Found critical alert for ${category}.${entity}: ${path} with score ${score}`);
          continue; // Skip normal processing for critical alerts
        }
        
        // Normal processing for non-critical triggers
        const clampedScore = clamp(score);
        
        // Apply group weight and sensitivity
        const groupWeight = weight || 1.0;
        const sensitivityMultiplier = getSensitivityMultiplier(groupContext, sensitivitySettings);
        const weightedScore = clampedScore * groupWeight * sensitivityMultiplier;
        
        weightedSum += weightedScore;
        totalWeight += groupWeight;
        
        // Continue with existing processing
        const amplifiedScore = amplifyScore(clampedScore);
        const distanceFromNeutral = amplifiedScore - 3;
        const adjustedScore = 3 + (distanceFromNeutral * sensitivityMultiplier);
        
        // Special case for carbon pricing in Alberta/Saskatchewan
        let finalScore = adjustedScore;
        let effectivePath = path;
        
        if (path === 'revenueMix.carbonPricing' && value >= 0.4 && 
            (entity === 'Alberta' || entity === 'Saskatchewan')) {
          // For high carbon tax rates in Alberta/Saskatchewan, force extreme negative sentiment
          effectivePath = `${path}.high`;
          console.log(`[CARBON TAX] 🔴 Detected high carbon pricing value ${value} for ${entity}, using ${effectivePath}`);
          
          if (distanceFromNeutral < 0) {
            // Make even more negative for strong opposition
            finalScore = Math.max(1, Math.min(2, finalScore - 1));
            console.log(`[CARBON TAX] 🔴 Enforcing strong negative sentiment for ${entity}: score=${finalScore}`);
          }
        }
        
        // Get precedence level for this trigger
        const precedence = getPrecedenceLevel(effectivePath, entity, category);
        
        // Add to effects array with precedence info
        effects.push({
          path: effectivePath,
          score: finalScore,
          precedence,
          value,
          severity: triggerConfig.severity || 'normal'
        });
        
        // Track active triggers for badge modifier precedence check
        activeTriggers.push(`${path} = ${value} (${min || '-∞'} to ${max || '∞'})`);
        
        if (precedence === PRECEDENCE_LEVELS.ABSOLUTE || precedence === PRECEDENCE_LEVELS.HIGH) {
          console.log(`[PRECEDENCE] Trigger "${effectivePath}" has precedence level ${precedence} for ${category}.${entity}`);
        }
      }
    }
  }
  
  // Calculate aggregate raw score
  const aggregateRaw = totalWeight > 0 ? weightedSum / totalWeight : 0;
  console.log(`[AGGREGATE] Raw score for ${category}.${entity}: ${aggregateRaw} (weighted sum: ${weightedSum}, total weight: ${totalWeight})`);
  
  // Calculate final sentiment value using new formula
  const sentimentValue = Math.max(1, Math.min(5, Math.round(3 + 2 * aggregateRaw)));
  console.log(`[SENTIMENT] Calculated sentiment value: ${sentimentValue} from aggregateRaw: ${aggregateRaw}`);
  
  // If we have critical alerts, handle them first
  if (criticalAlerts.length > 0) {
    console.log(`[CRITICAL] Processing ${criticalAlerts.length} critical alerts for ${category}.${entity}`);
    
    // Calculate the average of critical alerts
    const criticalTotal = criticalAlerts.reduce((sum, alert) => sum + alert.score, 0);
    const criticalAverage = criticalTotal / criticalAlerts.length;
    
    // Return the critical score with the alerts
    return {
      score: Math.max(1, Math.min(5, criticalAverage)), // Use criticalAverage instead of sentimentValue
      activeTriggers: criticalAlerts.map(alert => alert.path),
      hasPrecedence: true,
      criticalAlerts,
      aggregateRaw
    };
  }
  
  // Check for absolute precedence triggers
  const absoluteEffects = effects.filter(e => e.precedence === PRECEDENCE_LEVELS.ABSOLUTE);
  
  if (absoluteEffects.length > 0) {
    // If we have absolute precedence effects, they override everything else
    console.log(`[PRECEDENCE] Absolute precedence found for ${category}.${entity}: ${absoluteEffects.map(e => e.path).join(', ')}`);
    
    // Use the average of all absolute precedence effects
    const total = absoluteEffects.reduce((sum, effect) => sum + effect.score, 0);
    const absoluteScore = total / absoluteEffects.length;
    
    // Apply badges only if allowed by precedence rules
    return {
      score: Math.max(1, Math.min(5, absoluteScore)), // Use absoluteScore instead of sentimentValue
      activeTriggers,
      hasPrecedence: true,
      aggregateRaw
    };
  }
  
  // No absolute precedence, proceed with normal calculation
  let total = 0;
  let count = 0;
  
  for (const effect of effects) {
    total += effect.score;
    count++;
  }

  // Calculate the average score
  if (count) {
    console.log('[SCORE DEBUG] Calculated score:', {
      total,
      count,
      averageScore: total / count,
      finalScore: sentimentValue // Use new sentiment value
    });
    
    // Return the score and active triggers for badge processing
    return {
      score: sentimentValue, // Use new sentiment value
      activeTriggers,
      hasPrecedence: false,
      aggregateRaw
    };
  } else {
    // Return neutral with empty active triggers
    return {
      score: sentimentValue, // Use new sentiment value
      activeTriggers: [],
      hasPrecedence: false,
      aggregateRaw
    };
  }
}

/**
 * Recursively retrieves a nested value from an object using a dot-separated path.
 *
 * @param {Object} obj - The object to query.
 * @param {string} path - Dot-separated path (e.g., "budgetItems.healthcare").
 * @returns {any} The value found at the path, or undefined if not found.
 */
function getNestedValue(obj, path) {
  // Handle special case for tax expenditure adjustment percentages
  if (path.endsWith('.adjustmentPercent')) {
    const basePath = path.replace('.adjustmentPercent', '');
    const baseObj = getNestedValue(obj, basePath);
    return baseObj?.adjustmentPercent;
  }
  
  const parts = path.split('.');
  return parts.reduce((obj, part) => obj && obj[part] !== undefined ? obj[part] : undefined, obj)
}

/**
 * Amplifies a sentiment score to make it more reactive by increasing its distance from neutral (3).
 * Applies extra negativity bias to make austerity budgets appear more negative.
 * Makes positive sentiments 15% less sensitive as requested.
 * 
 * @param {number} score - The original sentiment score (1-5 scale with 3 as neutral)
 * @returns {number} The amplified score, still within the 1-5 range
 */
function amplifyScore(score) {
  // Get the reactivity amplifier from the module scope
  const amplifier = REACTIVITY_AMPLIFIER;
  
  // Calculate distance from neutral (3)
  const distanceFromNeutral = score - 3;
  
  // Apply balanced multiplier for both positive and negative scores
  const biasMultiplier = 1.0; // Equal treatment for positive and negative scores
  
  // Amplify the distance with both the amplifier and appropriate bias
  const amplifiedDistance = distanceFromNeutral * amplifier * biasMultiplier;
  
  // Calculate new score and ensure it stays within 1-5 range
  return Math.max(1, Math.min(5, 3 + amplifiedDistance));
}

/**
 * Converts a numerical score (1-5) to a descriptive sentiment label
 * 
 * @param {number} score - Numerical score (1-5)
 * @returns {string} - Descriptive sentiment label
 */
export function getSentimentLabel(score) {
  if (score >= 4.5) return 'Enthusiastic';
  if (score >= 4) return 'Supportive';
  if (score >= 3.5) return 'Positive';
  if (score >= 3) return 'Neutral';
  if (score >= 2.5) return 'Concerned';
  if (score >= 2) return 'Dissatisfied';
  if (score >= 1.5) return 'Opposed';
  return 'Outraged';
}

/**
 * Returns a color code based on sentiment score
 * 
 * @param {number} score - Numerical score (1-5)
 * @returns {string} - Hex color code
 */
export function getSentimentColor(score) {
  if (score >= 4.5) return '#38A169'; // green-600
  if (score >= 4) return '#68D391';   // green-400
  if (score >= 3.5) return '#9AE6B4'; // green-300
  if (score >= 3) return '#CBD5E0';   // gray-400
  if (score >= 2.5) return '#FBD38D'; // orange-300
  if (score >= 2) return '#F6AD55';   // orange-400
  if (score >= 1.5) return '#FC8181'; // red-400
  return '#E53E3E';                   // red-600
}

/**
 * Returns emoji representation based on sentiment score
 * 
 * @param {number} score - Numerical score (1-5)
 * @returns {string} - Emoji character
 */
export function getSentimentEmoji(score) {
  if (score >= 4.5) return '😍';
  if (score >= 4) return '😊';
  if (score >= 3.5) return '🙂';
  if (score >= 3) return '😐';
  if (score >= 2.5) return '🤔';
  if (score >= 2) return '😕';
  if (score >= 1.5) return '😠';
  return '😡';
}



/**
 * Apply fiscal chaos penalties to sentiment scores
 * 
 * @param {Object} result - The sentiment result object
 * @param {number} severity - The severity factor (0-1)
 */
function applyFiscalChaosPenalties(result, severity) {
  // FORCE ALL SENTIMENT SCORES TO BE EXTREMELY NEGATIVE
  // This ensures fiscal chaos has a dramatic and consistent effect
  for (const section of ['provinces', 'demographics', 'sectors']) {
    for (const group of Object.keys(result[section])) {
      // Initialize the group in the result if it doesn't exist
      if (!result[section][group]) {
        result[section][group] = 3; // Start with neutral
      }
      
      // Apply a very severe penalty based on how many sources are out of bounds
      const severityFactor = severity > 0.5 ? 0.3 : (severity > 0.3 ? 0.4 : 0.5);
      
      // Force all scores to be very low - maximum 2.0 for any group
      result[section][group] = Math.min(2.0, result[section][group] * severityFactor);
      
      // Ensure at least 30% of scores are at absolute minimum (1.0)
      if (Math.random() < 0.3) {
        result[section][group] = 1.0;
      }
    }
  }
}
