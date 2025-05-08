// src/config/sentimentPrecedenceRules.js

/**
 * Sentiment Precedence Rules
 * 
 * This configuration defines which sentiment triggers take precedence over others,
 * allowing certain effects (like high carbon tax in Alberta) to override other effects.
 * 
 * The precedence system ensures that high-priority sentiment triggers (like carbon tax
 * in Alberta/Saskatchewan) will supersede other effects, including badge modifiers.
 * 
 * IMPORTANT NAMING CONVENTION:
 * - The system uses 'carbonPricing' as the property name for carbon tax
 * - All trigger paths should match the actual property names used in the budget data
 */

// Enable/disable debug logging for precedence rules
const DEBUG_PRECEDENCE = true;

// Precedence levels - higher numbers take precedence
export const PRECEDENCE_LEVELS = {
  NORMAL: 0,     // Default for most triggers
  HIGH: 10,      // Important triggers that should take precedence
  ABSOLUTE: 20   // Triggers that completely override everything else
};

// Trigger path constants to prevent naming mismatches
export const TRIGGER_PATHS = {
  CARBON_PRICING: "revenueMix.carbonPricing",
  CARBON_PRICING_HIGH: "revenueMix.carbonPricing.high"
};

// Rules for specific triggers
export const SENTIMENT_PRECEDENCE_RULES = {
  // Carbon tax in Alberta/Saskatchewan overrides everything when high
  [TRIGGER_PATHS.CARBON_PRICING_HIGH]: {
    level: PRECEDENCE_LEVELS.ABSOLUTE,
    appliesTo: {
      provinces: ["Alberta", "Saskatchewan"]
    },
    minValue: 0.4, // Threshold for 'high' carbon pricing
    description: "High carbon tax rates have an absolute negative effect in Alberta and Saskatchewan"
  },
  
  // Regular carbon pricing for Alberta/Saskatchewan still has strong precedence
  [TRIGGER_PATHS.CARBON_PRICING]: {
    level: PRECEDENCE_LEVELS.ABSOLUTE,
    appliesTo: {
      provinces: ["Alberta", "Saskatchewan"]
    },
    description: "Carbon pricing has an absolute negative effect in Alberta and Saskatchewan"
  },
  
  // Legacy keys maintained for backward compatibility
  "revenueMix.carbonTax.high": {
    level: PRECEDENCE_LEVELS.ABSOLUTE,
    appliesTo: {
      provinces: ["Alberta", "Saskatchewan"]
    },
    description: "[LEGACY] High carbon tax rates have an absolute negative effect in Alberta and Saskatchewan"
  },
  
  "revenueMix.carbonTax": {
    level: PRECEDENCE_LEVELS.ABSOLUTE,
    appliesTo: {
      provinces: ["Saskatchewan", "Alberta"]
    },
    description: "[LEGACY] Carbon tax has an absolute negative effect in Saskatchewan and Alberta"
  },
  
  // Add more precedence rules as needed
};

/**
 * Gets the precedence level for a trigger and entity
 * 
 * @param {string} trigger - The trigger path (e.g., "revenueMix.carbonPricing.high")
 * @param {string} entity - The entity name (e.g., "Alberta")
 * @param {string} category - The category (provinces, demographics, sectors)
 * @returns {number} The precedence level from PRECEDENCE_LEVELS
 */
export function getPrecedenceLevel(trigger, entity, category) {
  if (DEBUG_PRECEDENCE) console.log(`Evaluating trigger "${trigger}" for ${entity} (${category})...`);
  
  const rule = SENTIMENT_PRECEDENCE_RULES[trigger];
  if (!rule) {
    if (DEBUG_PRECEDENCE) console.log(`  No special rule found for "${trigger}". Defaulting to normal precedence.`);
    return PRECEDENCE_LEVELS.NORMAL;
  }
  
  // Check if rule applies to this entity
  if (rule.appliesTo?.[category]?.includes(entity)) {
    if (DEBUG_PRECEDENCE) {
      const levelName = Object.keys(PRECEDENCE_LEVELS).find(key => PRECEDENCE_LEVELS[key] === rule.level);
      console.log(`  Trigger "${trigger}" has ${levelName} precedence for ${entity}.`);
    }
    return rule.level;
  }
  
  if (DEBUG_PRECEDENCE) console.log(`  Trigger "${trigger}" does not apply to ${entity}. Defaulting to normal precedence.`);
  return PRECEDENCE_LEVELS.NORMAL;
}

/**
 * Checks if a trigger has precedence over badges for an entity
 * 
 * @param {string} trigger - The trigger path
 * @param {string} entity - The entity name
 * @param {string} category - The category (provinces, demographics, sectors)
 * @returns {boolean} True if the trigger has precedence over badges
 */
export function hasPrecedenceOverBadges(trigger, entity, category) {
  const level = getPrecedenceLevel(trigger, entity, category);
  return level >= PRECEDENCE_LEVELS.HIGH;
}

/**
 * Checks if any triggers in a list have absolute precedence for an entity
 * 
 * @param {Array<string>} triggers - List of active trigger paths
 * @param {string} entity - The entity name
 * @param {string} category - The category (provinces, demographics, sectors)
 * @returns {boolean} True if any trigger has absolute precedence
 */
export function hasAbsolutePrecedence(triggers, entity, category) {
  return triggers.some(trigger => 
    getPrecedenceLevel(trigger, entity, category) === PRECEDENCE_LEVELS.ABSOLUTE
  );
}

/**
 * Gets the highest precedence level from a list of triggers for an entity
 * 
 * @param {Array<string>} triggers - List of active trigger paths
 * @param {string} entity - The entity name
 * @param {string} category - The category (provinces, demographics, sectors)
 * @returns {number} The highest precedence level found
 */
export function getHighestPrecedenceLevel(triggers, entity, category) {
  let highest = PRECEDENCE_LEVELS.NORMAL;
  
  for (const trigger of triggers) {
    const level = getPrecedenceLevel(trigger, entity, category);
    highest = Math.max(highest, level);
  }
  
  return highest;
}

/**
 * For debugging: explains why a trigger has precedence
 * 
 * @param {string} trigger - The trigger path
 * @param {string} entity - The entity name
 * @param {string} category - The category (provinces, demographics, sectors)
 * @returns {string} Human-readable explanation
 */
export function explainPrecedence(trigger, entity, category) {
  const rule = SENTIMENT_PRECEDENCE_RULES[trigger];
  if (!rule) return `"${trigger}" has normal precedence (no special rules).`;
  
  if (!rule.appliesTo?.[category]?.includes(entity)) {
    return `"${trigger}" has normal precedence for ${entity} (rule doesn't apply).`;
  }
  
  const levelName = Object.keys(PRECEDENCE_LEVELS).find(
    key => PRECEDENCE_LEVELS[key] === rule.level
  );
  
  return `"${trigger}" has ${levelName} precedence for ${entity}: ${rule.description}`;
}

/**
 * Check if a precedence rule applies to a specific entity, category, and value
 * 
 * @param {string} path - The trigger path (e.g., 'revenueMix.carbonPricing')
 * @param {string} entity - The entity (e.g., 'Alberta')
 * @param {string} category - The category (e.g., 'provinces')
 * @param {number} value - The value to check against rule thresholds
 * @returns {Object|null} The rule if it applies, null otherwise
 */
export const getPrecedenceOverride = (path, entity, category, value) => {
  // Find all rules that might apply to this path
  const applicableRules = Object.entries(SENTIMENT_PRECEDENCE_RULES)
    .filter(([rulePath, rule]) => {
      // Check if the rule applies to this entity and category
      if (!rule.appliesTo || !rule.appliesTo[category] || 
          !rule.appliesTo[category].includes(entity)) {
        return false;
      }
      
      // Check if the rule path matches or is a suffix of the current path
      // This handles both direct matches and .high/.eliminated suffixes
      if (rulePath === path) {
        return true;
      } else if (path.startsWith(rulePath + '.')) {
        return true;
      } else if (rulePath.startsWith(path + '.')) {
        // Check if value meets the threshold for this rule
        if ((rule.minValue !== undefined && value >= rule.minValue) ||
            (rule.maxValue !== undefined && value <= rule.maxValue)) {
          return true;
        }
      }
      
      return false;
    })
    .map(([path, rule]) => ({ path, ...rule }));
  
  if (applicableRules.length === 0) {
    return null;
  }
  
  // If multiple rules apply, use the one with the highest precedence
  applicableRules.sort((a, b) => b.level - a.level);
  
  const selectedRule = applicableRules[0];
  
  if (DEBUG_PRECEDENCE) {
    console.log(`[PRECEDENCE] ⚡ Applying override rule for ${selectedRule.path} to ${entity} with level ${selectedRule.level}`);
  }
  
  return selectedRule;
};
