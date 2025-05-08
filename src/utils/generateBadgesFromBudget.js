import { badgeConfig } from '@/config/badgeConfig';

/**
 * Sensitivity factor: 60% more sensitive (i.e., multiplier of 1.6)
 * Increasing this makes it easier to earn badges by amplifying the impact of budget changes
 */
const sensitivityMultiplier = 1.6;

/**
 * Apply a sensitivity multiplier to budget data.
 * This amplifies the impact of changes on key metrics used by badge conditions.
 *
 * @param {Object} budget - The raw budget data.
 * @param {number} multiplier - Sensitivity multiplier (e.g., 1.4 for 40% increased sensitivity).
 * @returns {Object} A new budget object with adjusted values.
 */
function applySensitivity(budget, multiplier) {
  return {
    ...budget,
    surplus: budget.surplus * multiplier,
    totalRevenue: budget.totalRevenue * multiplier,
    totalSpending: budget.totalSpending * multiplier,
    revenueMix: { ...budget.revenueMix },
    taxExpenditures: Object.fromEntries(
      Object.entries(budget.taxExpenditures).map(([key, value]) => [
        key,
        {
          ...value,
          // Only modify if adjustmentPercent is a number.
          adjustmentPercent:
            typeof value.adjustmentPercent === 'number'
              ? value.adjustmentPercent * multiplier
              : value.adjustmentPercent,
        },
      ])
    ),
    budgetItems: Object.fromEntries(
      Object.entries(budget.budgetItems).map(([key, value]) => [
        key,
        typeof value === 'number' ? value * multiplier : value,
      ])
    ),
  };
}

/**
 * Generate achievement badges based on budget decisions.
 *
 * @param {Object} budget - The raw budget data.
 * @param {string|null} [activePreset=null] - The currently active budget preset key (if any).
 * @param {number|null} [maxBadges=5] - Maximum number of badges to return. Set null for no limit.
 * @returns {Array} Array of earned badges.
 */
export function getBudgetBadges(budget, activePreset = null, maxBadges = 5) {
  // Memoization: cache by budget hash AND active preset
  // This ensures that changing presets always triggers a badge recalculation
  const hash = JSON.stringify({ budget, activePreset });
  if (window._badgeCache?.hash === hash) return window._badgeCache.result;

  // Add detailed debugging to check what's being passed in
  console.log('%c[BADGE DEBUG] getBudgetBadges called', 'background: #3498db; color: white; padding: 2px 5px; border-radius: 3px;');
  console.log('Budget data for badges:', budget);
  console.log('Active preset:', activePreset, typeof activePreset);
  console.log('Max badges:', maxBadges);
  console.log('Available badges in config:', badgeConfig.length);
  console.log('Badge config:', badgeConfig.map(b => ({ title: b.title, tier: b.tier, presetMatch: b.presetMatch })));
  
  // CRITICAL FIX: If we have an active preset, ALWAYS include the matching badge
  // This is the most important fix to ensure preset badges always appear
  if (activePreset) {
    console.log('%c[BADGE DEBUG] GUARANTEE MODE: Ensuring preset badge appears for:', 'background: #e74c3c; color: white; font-weight: bold; padding: 2px 5px; border-radius: 3px;', activePreset);
  }
  
  // Apply the sensitivity multiplier to make badge evaluation 40% more sensitive.
  const sensitiveBudget = applySensitivity(budget, sensitivityMultiplier);
  // Store hash and result for memoization
  window._badgeCache = window._badgeCache || {};

  
  // Filter for "regular" badges (exclude fallback) that satisfy their conditions.
  const regularBadges = badgeConfig.filter(b => {
    try {
      // Enhanced debugging for badge conditions
      console.log(`%c[BADGE EVAL] Evaluating badge: ${b.title} (${b.tier})`, 'color: #9b59b6;');
      
      // Check for specific properties used in conditions
      const conditionStr = b.conditions.toString();
      
      // Log specific budget values that might be problematic
      if (conditionStr.includes('childrenAndFamilies')) {
        console.log(`  - childrenAndFamilies value:`, sensitiveBudget.budgetItems.childrenAndFamilies);
      }
      if (conditionStr.includes('supportForSeniors')) {
        console.log(`  - supportForSeniors value:`, sensitiveBudget.budgetItems.supportForSeniors);
      }
      
      // Handle array of conditions (OR logic)
      if (Array.isArray(b.conditions)) {
        if (b.conditionsType === 'or') {
          const results = b.conditions.map(condition => {
            try {
              return condition(sensitiveBudget);
            } catch (err) {
              console.error(`  - Error in condition:`, err);
              return false;
            }
          });
          const result = results.some(r => r);
          console.log(`  - OR conditions result:`, result, results);
          return result;
        } else {
          // Default to AND logic
          const results = b.conditions.map(condition => {
            try {
              return condition(sensitiveBudget);
            } catch (err) {
              console.error(`  - Error in condition:`, err);
              return false;
            }
          });
          const result = results.every(r => r);
          console.log(`  - AND conditions result:`, result, results);
          return result;
        }
      }
      
      // Standard single condition
      const result = b.tier !== 'fallback' && b.conditions(sensitiveBudget);
      console.log(`  - Condition result:`, result);
      return result;
    } catch (error) {
      console.error(`Error evaluating badge ${b.title}:`, error);
      return false;
    }
  });
  
  console.log('%c[BADGE DEBUG] Regular badges that match conditions:', 'background: #2ecc71; color: white; padding: 2px 5px; border-radius: 3px;', regularBadges.map(b => b.title));
  
  if (regularBadges.length > 0) {
    // Define badge tier priority for sorting
    const priority = ['fiscal', 'economic', 'social', 'environmental', 'diplomatic', 'balanced'];
    
    // If an activePreset is provided, prioritize badges that match the preset
    if (activePreset) {
      console.log('%c[BADGE DEBUG] Prioritizing preset matches with activePreset:', 'background: #e74c3c; color: white; padding: 2px 5px; border-radius: 3px;', activePreset);
      
      // GUARANTEED PRESET BADGE SYSTEM
      // Find all badges that are designed to match this preset
      const presetBadges = badgeConfig.filter(b => {
        if (!b.presetMatch) return false;
        
        if (Array.isArray(b.presetMatch)) {
          return b.presetMatch.includes(activePreset);
        }
        return b.presetMatch === activePreset;
      });
      
      console.log('%c[BADGE DEBUG] All badges matching preset:', 'color: #3498db;', 
        presetBadges.map(b => b.title));
      
      // CRITICAL FIX: Directly add ALL preset-specific badges to regularBadges
      // This guarantees that all badges designed for this preset will appear
      if (presetBadges.length > 0) {
        console.log('%c[BADGE DEBUG] GUARANTEE MODE: Adding ALL preset badges:', 'background: #e74c3c; color: white; font-weight: bold;', 
          presetBadges.map(b => b.title));
          
        // Add any preset badges that aren't already in regularBadges
        presetBadges.forEach(presetBadge => {
          if (!regularBadges.some(rb => rb.title === presetBadge.title)) {
            console.log(`  - Adding guaranteed preset badge: ${presetBadge.title}`);
            regularBadges.push(presetBadge);
          }
        });
      }
      
      // Find badges that explicitly match this preset
      const presetMatchBadges = regularBadges.filter(b => {
        console.log(`Checking badge ${b.title} for preset match:`, b.presetMatch);
        if (!b.presetMatch) {
          console.log(`  - No presetMatch for ${b.title}`);
          return false;
        }
        if (Array.isArray(b.presetMatch)) {
          const includes = b.presetMatch.includes(activePreset);
          console.log(`  - Array presetMatch for ${b.title}:`, b.presetMatch, 'includes', activePreset, '?', includes);
          return includes;
        }
        const matches = b.presetMatch === activePreset;
        console.log(`  - String presetMatch for ${b.title}:`, b.presetMatch, '===', activePreset, '?', matches);
        return matches;
      });
      
      console.log('%c[BADGE DEBUG] Preset-matching badges:', 'background: #f39c12; color: white; padding: 2px 5px; border-radius: 3px;', presetMatchBadges.map(b => b.title));
      
      // If we found preset-matching badges, prioritize them but still include other earned badges
      if (presetMatchBadges.length > 0) {
        console.log('Found preset-matching badges, prioritizing them');
        
        // Sort preset-matching badges by tier priority
        const sortedPresetMatches = [...presetMatchBadges].sort(
          (a, b) => priority.indexOf(a.tier) - priority.indexOf(b.tier)
        );
        
        // Get badges that don't match the preset
        const otherBadges = regularBadges.filter(b => !presetMatchBadges.includes(b));
        console.log('Other non-matching badges:', otherBadges.map(b => b.title));
        
        // Sort other badges by tier priority
        const sortedOtherBadges = [...otherBadges].sort(
          (a, b) => priority.indexOf(a.tier) - priority.indexOf(b.tier)
        );
        
        // Combine preset-matching badges with other badges
        const combined = [...sortedPresetMatches, ...sortedOtherBadges];
        console.log('Combined badges (preset matches first):', combined.map(b => b.title));
        
        // Return the top N badges (or all if maxBadges is null)
        const result = maxBadges ? combined.slice(0, maxBadges) : combined;
        window._badgeCache = { hash, result };
        return result;
      }
    }
    
    // If no preset-specific badges or no active preset, sort all regular badges.
    // Use the priority array defined above
    const sortedRegularBadges = regularBadges.sort(
      (a, b) => priority.indexOf(a.tier) - priority.indexOf(b.tier)
    );
    const result = maxBadges ? sortedRegularBadges.slice(0, maxBadges) : sortedRegularBadges;
    console.log('Returning regular badges:', result.map(b => b.title));
    return result;
  }
  
  // If no regular badges are found, just return an empty array
  // We no longer use fallback badges
  console.log('No regular badges found, returning empty array');
  return [];
}
