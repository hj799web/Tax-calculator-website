// src/config/badgeSentimentModifiers.js

/**
 * Badge Sentiment Modifiers
 * 
 * This file maps badge titles to sentiment modifier adjustments. The purpose is to
 * adjust the sentiment scores computed by the scoring engine based on which badges
 * a user has earned.
 * 
 * Structure:
 *  - Each key is a badge title (must match the titles in the badge system).
 *  - Each value is an object with keys corresponding to sentiment sections:
 *      • provinces
 *      • demographics
 *      • sectors
 *  - Under each section, keys represent specific groups (e.g., "seniors", "urban", "business")
 *    and their values are numeric modifiers.
 * 
 * A positive modifier increases the sentiment score, while a negative value decreases it.
 * Scores should always be clamped between 1 (very negative) and 5 (very positive), with 3 as neutral.
 * 
 * Example: If a user earns the "Equity Champion" badge, it should boost the sentiment scores
 * for demographics "seniors" and "families" by 0.5, and also slightly boost the healthcare sector.
 */
export const badgeSentimentModifiers = {
  // ──────────────── FISCAL STRATEGIES ────────────────
  "Fiscal Hawk": {
    provinces: { Ontario: 0.3, Alberta: 0.2, Saskatchewan: 0.1 },
    demographics: { workers: 0.3, urban: 0.2 },
    sectors: { business: 0.4, defense: 0.2 }
  },
  // Moderated: Effects reduced by a third overall, but Alberta and Saskatchewan unchanged
  "Austerity Champion": {
    provinces: { Alberta: 0.5, Saskatchewan: 0.4, Ontario: 0.133 },
    demographics: { workers: 0.133, rural: 0.133 },
    sectors: { business: 0.333, defense: 0.2 },
    // Some groups dislike austerity (reduced negatives)
    demographics_negative: { seniors: -0.2, families: -0.2, students: -0.267 },
    sectors_negative: { healthcare: -0.267, academia: -0.2, environment: -0.133 }
  },
  // Moderated: Effects reduced by a third overall, but Alberta and Saskatchewan unchanged
  "Surplus Architect": {
    provinces: { Ontario: 0.2, Alberta: 0.2, Saskatchewan: 0.1 },
    demographics: { workers: 0.133, urban: 0.133 },
    sectors: { business: 0.2 }
  },
  "Stimulus Commander": {
    provinces: { Quebec: 0.4, BritishColumbia: 0.3, Ontario: 0.2 },
    demographics: { workers: 0.4, youth: 0.3, urban: 0.3 },
    sectors: { environment: 0.5, business: 0.3, academia: 0.3 }
  },
  "Tax Loophole Closer": {
    provinces: { Quebec: 0.4, BritishColumbia: 0.3, Ontario: 0.2 },
    demographics: { workers: 0.3, families: 0.2, youth: 0.2 },
    sectors: { environment: 0.2, healthcare: 0.2 },
    // Business sector dislikes tax loophole closures
    sectors_negative: { business: -0.3 }
  },

  // ──────────────── SOCIAL INVESTMENT ────────────────
  "Equity Champion": {
    provinces: { Quebec: 0.5, BritishColumbia: 0.4, Ontario: 0.3, NovaScotia: 0.4 },
    demographics: { seniors: 0.5, families: 0.5, youth: 0.4, students: 0.4 },
    sectors: { healthcare: 0.5, academia: 0.4, environment: 0.3 },
    // Some groups may be less enthusiastic
    sectors_negative: { business: -0.2 }
  },
  "Social Safety Weaver": {
    provinces: { Quebec: 0.4, NovaScotia: 0.5, NewBrunswick: 0.5 },
    demographics: { seniors: 0.5, families: 0.5, youth: 0.3 },
    sectors: { healthcare: 0.4, academia: 0.3 },
    // Some groups may be less enthusiastic
    sectors_negative: { business: -0.1 }
  },
  "Family Champion": {
    provinces: { Quebec: 0.5, Ontario: 0.4, BritishColumbia: 0.3 },
    demographics: { families: 0.6, youth: 0.3, urban: 0.2 },
    sectors: { healthcare: 0.3, academia: 0.3 }
  },
  "Senior Ally": {
    provinces: { NovaScotia: 0.6, NewBrunswick: 0.6, Quebec: 0.4, Ontario: 0.3 },
    demographics: { seniors: 0.7, families: 0.2 },
    sectors: { healthcare: 0.5 }
  },
  "Reconciliation Leader": {
    provinces: { BritishColumbia: 0.6, Manitoba: 0.5, Saskatchewan: 0.4 },
    demographics: { rural: 0.3, youth: 0.3 },
    sectors: { indigenous: 0.8, environment: 0.3 }
  },
  "Welfare Architect": {
    provinces: { Quebec: 0.5, NovaScotia: 0.5, NewBrunswick: 0.5, Ontario: 0.3 },
    demographics: { families: 0.5, seniors: 0.5, youth: 0.3, students: 0.3 },
    sectors: { healthcare: 0.4, academia: 0.3 },
    // Some groups may be less enthusiastic
    sectors_negative: { business: -0.2 }
  },

  // ──────────────── ECONOMIC STRATEGIES ────────────────
  "Business Friendly": {
    provinces: { Alberta: 0.6, Ontario: 0.5, Saskatchewan: 0.4 },
    demographics: { workers: 0.4, urban: 0.3 },
    sectors: { business: 0.7, agriculture: 0.3 },
    // Some groups may be less enthusiastic
    demographics_negative: { youth: -0.2 },
    sectors_negative: { environment: -0.3 }
  },
  "Tax Reformer": {
    provinces: { Quebec: 0.4, Ontario: 0.3, BritishColumbia: 0.3 },
    demographics: { workers: 0.3, families: 0.3, seniors: 0.3 },
    sectors: { business: 0.3, healthcare: 0.2, academia: 0.2 }
  },
  "Stimulus Engineer": {
    provinces: { Ontario: 0.4, Quebec: 0.3, BritishColumbia: 0.3 },
    demographics: { workers: 0.5, youth: 0.3, urban: 0.3 },
    sectors: { business: 0.6, academia: 0.3 }
  },
  "Innovation Powerhouse": {
    provinces: { Ontario: 0.4, BritishColumbia: 0.5, Quebec: 0.4 },
    demographics: { youth: 0.5, students: 0.6, urban: 0.4 },
    sectors: { business: 0.4, academia: 0.6, healthcare: 0.3 }
  },
  "Infrastructure Visionary": {
    provinces: { Ontario: 0.5, Alberta: 0.4, BritishColumbia: 0.4, Manitoba: 0.5 },
    demographics: { workers: 0.5, urban: 0.4, rural: 0.4 },
    sectors: { business: 0.4, environment: 0.2 }
  },

  // ──────────────── BALANCED APPROACHES ────────────────
  "Centrist Pragmatist": {
    // Moderate positive impact across most groups
    provinces: { Ontario: 0.3, Quebec: 0.3, Alberta: 0.3, BritishColumbia: 0.3 },
    demographics: { workers: 0.3, families: 0.2, seniors: 0.2, urban: 0.2, rural: 0.2 },
    sectors: { business: 0.3, healthcare: 0.2, academia: 0.2, defense: 0.2 }
  },
  "Progressive Moderate": {
    provinces: { Quebec: 0.4, Ontario: 0.3, BritishColumbia: 0.4, NovaScotia: 0.3 },
    demographics: { families: 0.4, seniors: 0.3, youth: 0.4, students: 0.4 },
    sectors: { healthcare: 0.4, academia: 0.4, environment: 0.3 },
    // Slight negative impact on some groups
    sectors_negative: { business: -0.1 }
  },

  // ──────────────── ADDITIONAL BADGES ────────────────
  // These are based on common badge types in economic simulations
  "Corporate Catalyst": {
    provinces: { Alberta: 0.6, Ontario: 0.5, Saskatchewan: 0.4 },
    demographics: { workers: 0.4, urban: 0.3 },
    sectors: { business: 0.6, agriculture: 0.3 },
    // Some groups may be less enthusiastic
    demographics_negative: { youth: -0.2 },
    sectors_negative: { environment: -0.3 }
  },
  "Environmental Advocate": {
    provinces: { BritishColumbia: 0.6, Quebec: 0.5, Ontario: 0.3 },
    demographics: { youth: 0.6, students: 0.5, urban: 0.4 },
    sectors: { environment: 0.7, indigenous: 0.4, academia: 0.3 },
    // Some groups may be less enthusiastic
    // Extreme negative effect for carbon tax in Alberta and Saskatchewan
    provinces_negative: { Alberta: -7.0, Saskatchewan: -5.0 },
    sectors_negative: { business: -0.3, agriculture: -0.2 }
  },
  "National Security Guardian": {
    provinces: { Alberta: 0.5, Ontario: 0.4, Saskatchewan: 0.3 },
    demographics: { seniors: 0.4, rural: 0.3 },
    sectors: { defense: 0.7, business: 0.2 },
    // Some groups may be less enthusiastic
    demographics_negative: { youth: -0.2 },
    sectors_negative: { environment: -0.2, academia: -0.1 }
  },

  // ──────────────── GREEN GROWTH / CARBON TAX BADGE ────────────────
  "Green Growth Carbon Champion": {
    // Dramatic backlash for carbon tax in Alberta and Saskatchewan
    provinces: { BritishColumbia: 0.7, Quebec: 0.6, Alberta: -5.0, Saskatchewan: -4.0 },
    demographics: { youth: 0.7, students: 0.6, urban: 0.5, rural: -0.3 },
    sectors: { environment: 1.0, business: -0.5, agriculture: -0.4 },
    // Strong negative for AB/SK, strong positive for BC/QC/youth/environment
  }
};

/**
 * Helper function to retrieve the sentiment modifier for a given badge, section, and group.
 *
 * @param {string} badgeTitle - The title of the badge.
 * @param {string} section - The sentiment section ("provinces", "demographics", or "sectors").
 * @param {string} group - The specific group within the section.
 * @returns {number} The modifier value (default is 0 if not defined).
 */
export function getBadgeModifier(badgeTitle, section, group) {
  const badge = badgeSentimentModifiers[badgeTitle];
  if (!badge) return 0;

  // Check for positive modifiers
  if (badge[section] && typeof badge[section][group] === 'number') {
    return badge[section][group];
  }
  
  // Check for negative modifiers (stored in section_negative)
  const negativeSection = `${section}_negative`;
  if (badge[negativeSection] && typeof badge[negativeSection][group] === 'number') {
    return badge[negativeSection][group];
  }
  
  return 0;
}

/**
 * Helper function to apply all badge modifiers to a sentiment score.
 * 
 * @param {Array} earnedBadges - Array of badge objects that the user has earned.
 * @param {string} section - The sentiment section ("provinces", "demographics", or "sectors").
 * @param {string} group - The specific group within the section.
 * @param {number} baseScore - The base sentiment score before badge modifiers.
 * @param {Array<string>} activeTriggers - Optional array of active trigger paths that might have precedence.
 * @returns {number} The modified sentiment score, clamped between 1 and 5.
 */
export function applyBadgeModifiers(earnedBadges, section, group, baseScore, activeTriggers = []) {
  if (!earnedBadges || !earnedBadges.length) return baseScore;
  
  // Import precedence rules lazily to avoid circular dependencies
  // This is done inside the function to prevent import cycles
  let hasAbsolutePrecedence = false;
  
  try {
    // Dynamic import would be better, but for now we'll use a try/catch
    const { hasAbsolutePrecedence: checkPrecedence } = require('../../sentiment/config/sentimentPrecedenceRules');
    hasAbsolutePrecedence = checkPrecedence(activeTriggers, group, section);
  } catch (e) {
    // If precedence module isn't available, continue without it
    console.warn('Sentiment precedence module not available:', e.message);
  }
  
  // If any trigger has absolute precedence, don't apply badge modifiers
  if (hasAbsolutePrecedence) {
    console.log(`Badge modifiers skipped for ${section}.${group} due to precedence rules`);
    return baseScore;
  }
  
  let totalModifier = 0;
  
  // Sum all applicable modifiers from earned badges
  earnedBadges.forEach(badge => {
    totalModifier += getBadgeModifier(badge.title, section, group);
  });
  
  // Apply the total modifier and clamp the result between 1 and 5
  const modifiedScore = baseScore + totalModifier;
  return Math.max(1, Math.min(5, modifiedScore));
}
