import { budgetPresets } from '@/presets.js';

export const PRIORITY_SCALE = [1, 2, 3, 4, 5];

export const PRIORITY_QUESTIONS = [
  { id: 'healthcare', category: 'spending', labelKey: 'quiz.q.healthcare' },
  { id: 'education', category: 'spending', labelKey: 'quiz.q.education' },
  { id: 'seniors', category: 'spending', labelKey: 'quiz.q.seniors' },
  // Philosophy questions inserted early (after 3 spending questions)
  { id: 'balancedBudget', category: 'philosophy', labelKey: 'quiz.q.balancedBudget', useFor: 'preset' },
  { id: 'taxLevel', category: 'philosophy', labelKey: 'quiz.q.taxLevel', useFor: 'revenue' },
  // Continue with rest of spending questions
  { id: 'childrenFamilies', category: 'spending', labelKey: 'quiz.q.childrenFamilies' },
  { id: 'indigenousServices', category: 'spending', labelKey: 'quiz.q.indigenousServices' },
  { id: 'employmentInsurance', category: 'spending', labelKey: 'quiz.q.employmentInsurance' },
  { id: 'defensePublicSafety', category: 'spending', labelKey: 'quiz.q.defensePublicSafety' },
  { id: 'environmentalPrograms', category: 'spending', labelKey: 'quiz.q.environmentalPrograms' },
  { id: 'transportationInfrastructure', category: 'spending', labelKey: 'quiz.q.transportationInfrastructure' },
  { id: 'researchInnovation', category: 'spending', labelKey: 'quiz.q.researchInnovation' },
  { id: 'publicSafetyEmergency', category: 'spending', labelKey: 'quiz.q.publicSafetyEmergency' },
  { id: 'internationalDevelopment', category: 'spending', labelKey: 'quiz.q.internationalDevelopment' },
];

const DEFAULT_WEIGHT = 1 / PRIORITY_QUESTIONS.length;

const presetFingerprints = {
  balancedBudget: {
    healthcare: 0.9,
    education: 0.85,
    seniors: 0.85,
    childrenFamilies: 0.75,
    indigenousServices: 0.75,
    employmentInsurance: 0.7,
    defensePublicSafety: 0.65,
    environmentalPrograms: 0.7,
    transportationInfrastructure: 0.7,
    researchInnovation: 0.7,
    publicSafetyEmergency: 0.65,
    internationalDevelopment: 0.65,
    // Philosophy dimensions
    balancedBudget: 1.0,    // Strong preference for no deficit
    taxLevel: 0.6,          // Moderate taxes, balanced approach
  },
  progressiveExpansion: {
    healthcare: 1,
    education: 0.95,
    seniors: 0.85,
    childrenFamilies: 1,
    indigenousServices: 1,
    employmentInsurance: 0.75,
    defensePublicSafety: 0.5,
    environmentalPrograms: 0.9,
    transportationInfrastructure: 0.85,
    researchInnovation: 0.8,
    publicSafetyEmergency: 0.55,
    internationalDevelopment: 0.75,
    // Philosophy dimensions
    balancedBudget: 0.2,    // Willing to run deficits for priorities
    taxLevel: 0.2,          // Support higher taxes for services
  },
  greenGrowthStimulus: {
    healthcare: 0.7,
    education: 0.75,
    seniors: 0.65,
    childrenFamilies: 0.7,
    indigenousServices: 0.8,
    employmentInsurance: 0.6,
    defensePublicSafety: 0.45,
    environmentalPrograms: 1,
    transportationInfrastructure: 0.95,
    researchInnovation: 0.9,
    publicSafetyEmergency: 0.55,
    internationalDevelopment: 0.75,
    // Philosophy dimensions
    balancedBudget: 0.5,    // Moderate deficits OK for green investment
    taxLevel: 0.4,          // Support higher taxes for environment
  },
  businessFriendly: {
    healthcare: 0.5,
    education: 0.55,
    seniors: 0.45,
    childrenFamilies: 0.4,
    indigenousServices: 0.35,
    employmentInsurance: 0.5,
    defensePublicSafety: 0.65,
    environmentalPrograms: 0.35,
    transportationInfrastructure: 0.9,
    researchInnovation: 1,
    publicSafetyEmergency: 0.6,
    internationalDevelopment: 0.5,
    // Philosophy dimensions
    balancedBudget: 0.6,    // Prefer balance but flexible
    taxLevel: 0.8,          // Keep taxes low
  },
  securityFirst: {
    healthcare: 0.55,
    education: 0.5,
    seniors: 0.6,
    childrenFamilies: 0.45,
    indigenousServices: 0.45,
    employmentInsurance: 0.55,
    defensePublicSafety: 1,
    environmentalPrograms: 0.4,
    transportationInfrastructure: 0.6,
    researchInnovation: 0.55,
    publicSafetyEmergency: 0.95,
    internationalDevelopment: 0.4,
    // Philosophy dimensions
    balancedBudget: 0.6,    // Moderate balance preference
    taxLevel: 0.5,          // Moderate tax levels
  },
  austerityPlan: {
    healthcare: 0.35,
    education: 0.4,
    seniors: 0.45,
    childrenFamilies: 0.35,
    indigenousServices: 0.35,
    employmentInsurance: 0.5,
    defensePublicSafety: 0.7,
    environmentalPrograms: 0.3,
    transportationInfrastructure: 0.45,
    researchInnovation: 0.4,
    publicSafetyEmergency: 0.55,
    internationalDevelopment: 0.35,
    // Philosophy dimensions
    balancedBudget: 1.0,    // Must balance budget
    taxLevel: 0.9,          // Keep taxes very low
  },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normaliseVector = (vector) => {
  const entries = Object.entries(vector);
  const total = entries.reduce((sum, [, val]) => sum + val, 0);
  if (total <= 0) {
    return PRIORITY_QUESTIONS.reduce((acc, { id }) => {
      acc[id] = DEFAULT_WEIGHT;
      return acc;
    }, {});
  }
  return entries.reduce((acc, [key, val]) => {
    acc[key] = val / total;
    return acc;
  }, {});
};

export const normalisedPresetFingerprints = Object.fromEntries(
  Object.entries(presetFingerprints)
    .filter(([key]) => budgetPresets[key])
    .map(([key, fingerprint]) => [key, normaliseVector(fingerprint)])
);

export const responsesToWeights = (responses) => {
  const rawWeights = {};

  PRIORITY_QUESTIONS.forEach(({ id }) => {
    const value = clamp(Number(responses[id] ?? 3), PRIORITY_SCALE[0], PRIORITY_SCALE[PRIORITY_SCALE.length - 1]);
    const scaled = (value - PRIORITY_SCALE[0]) / (PRIORITY_SCALE[PRIORITY_SCALE.length - 1] - PRIORITY_SCALE[0]);
    rawWeights[id] = scaled;
  });

  const total = Object.values(rawWeights).reduce((sum, val) => sum + val, 0);
  if (total <= 0) {
    return PRIORITY_QUESTIONS.reduce((acc, { id }) => {
      acc[id] = DEFAULT_WEIGHT;
      return acc;
    }, {});
  }

  const normalised = {};
  Object.entries(rawWeights).forEach(([key, value]) => {
    normalised[key] = value / total;
  });
  return normalised;
};

export const recommendPreset = (weights) => {
  if (!weights || typeof weights !== 'object') {
    return null;
  }

  const normalised = normaliseVector(weights);
  let bestPreset = null;
  let bestScore = -Infinity;

  Object.entries(normalisedPresetFingerprints).forEach(([presetKey, fingerprint]) => {
    let score = 0;
    PRIORITY_QUESTIONS.forEach(({ id }) => {
      const userWeight = normalised[id] ?? 0;
      const presetWeight = fingerprint[id] ?? DEFAULT_WEIGHT;
      score += userWeight * presetWeight;
    });
    if (score > bestScore) {
      bestScore = score;
      bestPreset = presetKey;
    }
  });

  return bestPreset;
};

// Helper: Apply revenue adjustments with differentiated weights
function applyRevenueAdjustments(store, taxLevelWeight, maxShift, adjustments) {
  try {
    // taxLevelWeight: 0 = support high taxes, 1 = keep taxes low
    // Map to adjustment: low weight → increase rates, high weight → decrease rates
    const baseAdjustment = (0.5 - taxLevelWeight) * maxShift;
    
    // Differentiated weights by revenue source
    const revenueConfig = [
      { id: 'personalIncomeTax', weight: 1.0 },     // Full impact
      { id: 'corporateIncomeTax', weight: 0.6 },   // 60% impact
      { id: 'gst', weight: 0.3 },                  // 30% impact (regressive, harder to change)
    ];

    revenueConfig.forEach(({ id, weight }) => {
      const source = store.revenueSources?.[id];
      if (!source) {
        console.warn(`[userPriorities] Revenue source ${id} not found`);
        return;
      }

      const oldRate = source.rate ?? source.baseRate ?? 0;
      const adjustment = baseAdjustment * weight;
      let newRate = oldRate * (1 + adjustment);

      // Respect min/max bounds
      if (source.minRate !== undefined) {
        newRate = Math.max(newRate, source.minRate);
      }
      if (source.maxRate !== undefined) {
        newRate = Math.min(newRate, source.maxRate);
      }

      // Only apply if change is significant
      if (Math.abs(newRate - oldRate) > 0.01) {
        store.updateRevenueRate(id, newRate);
        
        // Track for banner
        if (typeof store.trackRevenueChange === 'function') {
          store.trackRevenueChange(id, oldRate, newRate);
        }

        adjustments.push({
          id,
          category: 'revenue',
          name: source.name || id,
          oldRate,
          newRate,
          type: 'revenue',
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('[userPriorities] Revenue adjustment error:', error);
    return { success: false, error: error.message };
  }
}

// Helper: Validate final state
function validateFinalState(store, balancedBudgetWeight) {
  try {
    const totalRevenue = store.totalRevenue ?? 0;
    const totalSpending = store.totalSpending ?? 0;
    const deficit = totalSpending - totalRevenue;

    // If user wants balanced budget (high weight) but we created large deficit
    if (balancedBudgetWeight > 0.7 && deficit > 20) {
      return {
        valid: false,
        warning: `Created $${deficit.toFixed(1)}B deficit despite balanced budget preference`,
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: true }; // Fail open if validation breaks
  }
}

export const applyUserPrioritiesToBudget = (store, weights, options = {}) => {
  if (!store || typeof store.updateSpendingFactor !== 'function') {
    console.warn('[userPriorities] Invalid store');
    return { adjustments: [], description: '', increases: [], decreases: [], revenueChanges: [] };
  }

  const normalised = normaliseVector(weights || {});
  const spendingMaxShift = clamp(options.maxShift ?? 0.25, 0, 0.35);
  const revenueMaxShift = 0.10; // Fixed at ±10% for revenue
  
  // Separate weights by category
  const spendingWeights = {};
  const philosophyWeights = {};
  
  PRIORITY_QUESTIONS.forEach(({ id, category }) => {
    const weight = normalised[id] ?? DEFAULT_WEIGHT;
    if (category === 'spending') {
      spendingWeights[id] = weight;
    } else if (category === 'philosophy') {
      philosophyWeights[id] = weight;
    }
  });

  // Calculate spending average weight only from spending questions
  const spendingEntries = Object.entries(spendingWeights).map(([id, weight]) => ({ id, weight }));
  const spendingAverageWeight = spendingEntries.length > 0 
    ? spendingEntries.reduce((sum, entry) => sum + entry.weight, 0) / spendingEntries.length 
    : DEFAULT_WEIGHT;

  const beginBatch = typeof store.beginBatchUpdate === 'function' ? store.beginBatchUpdate() : false;
  const adjustments = [];
  let hadError = false;

  const findCategoryMeta = (categoryId) => {
    const categories = store.spendingCategories || {};
    if (categories[categoryId]) {
      const node = categories[categoryId];
      return { name: node.name || categoryId, factor: node.adjustmentFactor ?? 1 };
    }
    for (const candidate of Object.values(categories)) {
      if (candidate?.children && candidate.children[categoryId]) {
        const child = candidate.children[categoryId];
        return { name: child.name || categoryId, factor: child.adjustmentFactor ?? 1 };
      }
    }
    return { name: categoryId, factor: 1 };
  };

  let topIncreases = [];
  let topDecreases = [];
  let revenueChanges = [];

  try {
    // 1. Apply spending adjustments
    spendingEntries.forEach(({ id, weight }) => {
      const meta = findCategoryMeta(id);
      const relative = weight - spendingAverageWeight;
      const adjustment = clamp(relative / Math.max(spendingAverageWeight, 1e-4), -1, 1) * spendingMaxShift;
      const factor = clamp(1 + adjustment, 1 - spendingMaxShift, 1 + spendingMaxShift);
      
      if (Math.abs((meta.factor || 0) - factor) > 1e-4) {
        adjustments.push({
          id,
          category: 'spending',
          name: meta.name,
          oldFactor: meta.factor ?? 1,
          newFactor: factor,
          type: 'spending',
        });
      }
      store.updateSpendingFactor(id, factor);
    });

    // Track spending changes
    if (typeof store.trackSpendingChange === 'function') {
      adjustments.filter(a => a.type === 'spending').forEach(({ id, oldFactor, newFactor }) => {
        store.trackSpendingChange(id, oldFactor, newFactor);
      });
    }

    // 2. Apply revenue adjustments based on taxLevel philosophy
    if (philosophyWeights.taxLevel !== undefined && typeof store.updateRevenueRate === 'function') {
      const revenueResult = applyRevenueAdjustments(
        store,
        philosophyWeights.taxLevel,
        revenueMaxShift,
        adjustments
      );
      
      if (!revenueResult.success) {
        console.warn('[userPriorities] Revenue adjustments failed:', revenueResult.error);
      }
    }

  } catch (error) {
    console.error('[userPriorities] Error applying priorities:', error);
    hadError = true;
    
    // Rollback: reset to initial state if possible
    if (typeof store.resetBudget === 'function') {
      console.warn('[userPriorities] Rolling back changes');
      store.resetBudget();
    }
  } finally {
    if (beginBatch && typeof store.completeBatchUpdate === 'function') {
      store.completeBatchUpdate();
    } else if (!beginBatch && typeof store.recalculateTotals === 'function') {
      store.recalculateTotals();
    }
  }

  if (hadError) {
    return { adjustments: [], description: 'Failed to apply priorities', increases: [], decreases: [], revenueChanges: [] };
  }

  // 3. Validate final state
  const validation = validateFinalState(store, philosophyWeights.balancedBudget);
  if (!validation.valid) {
    console.warn('[userPriorities] Final state validation warning:', validation.warning);
  }

  // 4. Format description and record to banner
  const spendingChanges = adjustments.filter(a => a.type === 'spending');
  revenueChanges = adjustments.filter(a => a.type === 'revenue');

  topIncreases = spendingChanges
    .filter(a => a.newFactor > a.oldFactor)
    .sort((a, b) => (b.newFactor - b.oldFactor) - (a.newFactor - a.oldFactor))
    .slice(0, 2);

  topDecreases = spendingChanges
    .filter(a => a.newFactor < a.oldFactor)
    .sort((a, b) => (a.newFactor - a.oldFactor) - (b.newFactor - b.oldFactor))
    .slice(0, 2);

  let description = '';
  const parts = [];

  if (topIncreases.length || topDecreases.length) {
    const spendingParts = [];
    if (topIncreases.length) {
      spendingParts.push(`↑ ${topIncreases.map(a => a.name).join(', ')}`);
    }
    if (topDecreases.length) {
      spendingParts.push(`↓ ${topDecreases.map(a => a.name).join(', ')}`);
    }
    parts.push(`Spending: ${spendingParts.join(', ')}`);
  }

  if (revenueChanges.length) {
    const revenueParts = revenueChanges.map(a => {
      const delta = ((a.newRate - a.oldRate) / a.oldRate) * 100;
      const sign = delta > 0 ? '+' : '';
      return `${a.name} ${sign}${delta.toFixed(1)}%`;
    });
    parts.push(`Revenue: ${revenueParts.join(', ')}`);
  }

  description = parts.join(' | ');

  // Record to banner
  if (description && typeof store.addBudgetChange === 'function') {
    store.addBudgetChange(
      'preset',
      'System Actions',
      `priorities_quiz_${Date.now()}`,
      'Applied priorities quiz',
      0,
      0,
      description
    );
  }

  return {
    adjustments,
    description,
    increases: topIncreases,
    decreases: topDecreases,
    revenueChanges,
  };
};
