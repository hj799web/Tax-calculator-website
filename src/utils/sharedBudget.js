// src/utils/sharedBudget.js
// Utility to parse and apply shared budget settings from URL

/**
 * Parse budget, badge, and sentiment data from a shared budget URL or route query.
 * @param {Object|URLSearchParams} query - Either URLSearchParams or a route query object
 * @returns {Object}
 */
export function parseSharedBudgetParams(query) {
  // Handle both URLSearchParams and plain objects (route.query)
  const getValue = (key) => {
    if (query instanceof URLSearchParams) {
      return query.get(key);
    } else {
      return query[key];
    }
  };
  
  const hasKey = (key) => {
    if (query instanceof URLSearchParams) {
      return query.has(key);
    } else {
      return key in query && query[key] != null;
    }
  };
  
  const getEntries = () => {
    if (query instanceof URLSearchParams) {
      return Array.from(query.entries());
    } else {
      return Object.entries(query);
    }
  };

  // Parse main budget values
  const surplus = Number(getValue('surplus') || 0);
  const revenue = Number(getValue('revenue') || 0);
  const debt = Number(getValue('debt') || 0);

  // Parse revenue sliders
  const revenueSources = {};
  for (const [key, value] of getEntries()) {
    if (key.startsWith('r_')) {
      revenueSources[key.substring(2)] = Number(value);
    }
  }

  // Parse spending sliders
  const spendingCategories = {};
  for (const [key, value] of getEntries()) {
    if (key.startsWith('s_')) {
      spendingCategories[key.substring(2)] = Number(value);
    }
  }

  // Parse badges (just names)
  let badges = [];
  if (hasKey('badges')) {
    badges = getValue('badges').split(',').filter(Boolean);
  }

  // Parse sentiment segments
  const parseSegments = (prefix) => {
    const result = [];
    let i = 0;
    while (hasKey(`${prefix}${i}_name`) && hasKey(`${prefix}${i}_score`)) {
      result.push({
        name: getValue(`${prefix}${i}_name`),
        score: Number(getValue(`${prefix}${i}_score`))
      });
      i++;
    }
    return result;
  };
  const positiveSegments = parseSegments('pos');
  const negativeSegments = parseSegments('neg');

  // Parse party budget metadata
  const title = getValue('title') || '';
  const description = getValue('description') || '';
  const partyId = getValue('partyId') || null;
  const partyColor = getValue('partyColor') || '';
  
  // Parse highlights
  let highlights = [];
  if (hasKey('highlights')) {
    highlights = getValue('highlights').split('|').filter(Boolean);
  }
  
  return {
    surplus,
    revenue,
    debt,
    revenueSources,
    spendingCategories,
    badges,
    positiveSegments,
    negativeSegments,
    // Party budget specific fields
    title,
    description,
    partyId,
    partyColor,
    highlights
  };
}

/**
 * Apply shared budget settings to the store.
 * @param {Object} sharedData
 * @param {Object} budgetStore
 */
export async function applySharedBudgetToStore(sharedData, budgetStore) {
  // Set revenue sliders
  for (const [sourceId, rate] of Object.entries(sharedData.revenueSources || {})) {
    if (budgetStore.revenueSources[sourceId]) {
      budgetStore.updateRevenueRate(sourceId, rate);
    }
  }
  // Set spending sliders
  for (const [catId, factor] of Object.entries(sharedData.spendingCategories || {})) {
    if (budgetStore.spendingCategories[catId]) {
      budgetStore.updateSpendingFactor(catId, factor);
    }
  }
  // Optionally set surplus, revenue, debt (not needed if computed)
  // Optionally set badges/sentiment if needed
  // For now, badges and sentiment are display-only (store computes them)
}
