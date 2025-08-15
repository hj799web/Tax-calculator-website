import { bannerGroupMap } from '@/utils/bannerGrouping';
// Define constants
const CHANGE_THRESHOLD = 0.01; // $0.01B threshold

// Helper to find a category object in spendingCategories (including children)
function findCategory(budgetStore, categoryId) {
  if (!budgetStore.spendingCategories) {
    console.warn('[DEBUG] budgetStore.spendingCategories not available');
    return null;
  }
  // Search in main categories
  for (const category of Object.values(budgetStore.spendingCategories)) {
    // Return match whether it is a standalone category or a group parent
    if (category.id === categoryId) {
      return category;
    }
    // Search in group children
    if (category.isGroup && category.children) {
      for (const child of Object.values(category.children)) {
        if (child.id === categoryId) {
          return child;
        }
      }
    }
  }
  return null;
}

// Helper to find category name
function findCategoryName(budgetStore, categoryId) {
  const category = findCategory(budgetStore, categoryId);
  return category ? category.name : `Unknown (${categoryId})`;
}

// Helper to compute current dollar amount instantly (factor × baseAmount)
function findCategoryAmount(budgetStore, categoryId) {
  const category = findCategory(budgetStore, categoryId);
  if (!category) return 0;

  const base = Number(category.baseAmount) || 0;
  const factor = Number(category.adjustmentFactor ?? 1);

  // Round to 3 decimal places to avoid floating-point noise
  return +(base * factor).toFixed(3);
}

// Helper to find revenue source name
function findRevenueName(budgetStore, sourceId) {
  const source = budgetStore.revenueSources?.[sourceId];
  return source ? source.name || sourceId : `Unknown (${sourceId})`;
}

// Helper to find revenue source amount
function findRevenueAmount(budgetStore, sourceId) {
  const source = budgetStore.revenueSources?.[sourceId];
  // Prefer adjustedAmount if available, else amount
  return source ? (typeof source.adjustedAmount === 'number' ? source.adjustedAmount : source.amount || 0) : 0;
}

// Helper function to check if change is significant
function hasSignificantChange(beforeState, afterState) {
  const changeAmount = Math.abs(afterState.currentValue - beforeState.previousValue);
  return changeAmount >= CHANGE_THRESHOLD;
}

// Helper to find parent group id for a child category
function findParentGroupId(budgetStore, childId) {
  for (const category of Object.values(budgetStore.spendingCategories || {})) {
    if (category.isGroup && category.children) {
      if (Object.keys(category.children).includes(childId)) {
        return category.id;
      }
    }
  }
  return null;
}

function deriveGroupHeading(budgetStore, changeType, categoryId) {
  // 1. direct mapping
  if (bannerGroupMap[categoryId]) return bannerGroupMap[categoryId];

  // 2. spending child inherits parent group mapping
  if (changeType === 'spending') {
    const parentId = findParentGroupId(budgetStore, categoryId);
    if (parentId && bannerGroupMap[parentId]) return bannerGroupMap[parentId];
    return 'Other categories';
  }

  // 3. revenue fallback
  if (changeType === 'revenue') {
    return 'Other revenue sources';
  }

  return 'Mixed Changes';
}

// Helper to find tax expenditure name
function findTaxExpName(budgetStore, expId) {
  const expenditure = budgetStore.taxExpenditures?.[expId];
  return expenditure ? expenditure.name || expId : `Unknown Tax Expenditure (${expId})`;
}

// Helper to find tax expenditure impact value
function findTaxExpImpact(budgetStore, expId) {
  const expenditure = budgetStore.taxExpenditures?.[expId];
  if (!expenditure) return 0;
  
  // Use revenueImpact if available, otherwise calculate from adjustment
  if (typeof expenditure.revenueImpact === 'number') {
    return Math.abs(expenditure.revenueImpact); // Absolute value for display
  }
  
  const netAmount = Number(expenditure.netAmount) || 0;
  const adjustmentFactor = Number(expenditure.adjustmentFactor) || 0;
  return Math.abs(netAmount * (adjustmentFactor / 100));
}

// ===== Validation helpers (generic – replace ad-hoc "healthcare" code) =====
let ORIGINAL_REVENUE_IDS = null;
let ORIGINAL_SPENDING_IDS = null;
let ORIGINAL_TAX_EXP_IDS = null;

function captureOriginalIds(store) {
  if (!ORIGINAL_REVENUE_IDS) {
    ORIGINAL_REVENUE_IDS = new Set(Object.keys(store.revenueSources || {}));
  }
  if (!ORIGINAL_SPENDING_IDS) {
    const ids = new Set();
    Object.values(store.spendingCategories || {}).forEach(cat => {
      if (cat.id) ids.add(cat.id);
      if (cat.isGroup && cat.children) {
        Object.values(cat.children).forEach(ch => ids.add(ch.id));
      }
    });
    ORIGINAL_SPENDING_IDS = ids;
  }
  if (!ORIGINAL_TAX_EXP_IDS) {
    ORIGINAL_TAX_EXP_IDS = new Set(Object.keys(store.taxExpenditures || {}));
  }
}

function isValidRevenueSource(id) {
  return ORIGINAL_REVENUE_IDS?.has(id);
}

function isValidSpendingCategory(id) {
  return ORIGINAL_SPENDING_IDS?.has(id);
}

function assertValidRevenueId(id, methodName) {
  if (!isValidRevenueSource(id)) {
    const msg = `[Interceptor] ${methodName} called with NON-revenue id "${id}"`;
    console.error(msg);
    if (process.env.NODE_ENV !== 'production') {
      console.error(new Error().stack);
    }
    return false;
  }
  return true;
}

function assertValidSpendingId(id, methodName) {
  if (!isValidSpendingCategory(id)) {
    const msg = `[Interceptor] ${methodName} called with NON-spending id "${id}"`;
    console.error(msg);
    if (process.env.NODE_ENV !== 'production') {
      console.error(new Error().stack);
    }
    return false;
  }
  return true;
}

function isValidTaxExpenditure(id) {
  return ORIGINAL_TAX_EXP_IDS?.has(id);
}

function assertValidTaxExpId(id, methodName) {
  if (!isValidTaxExpenditure(id)) {
    const msg = `[Interceptor] ${methodName} called with NON-tax-expenditure id "${id}"`;
    console.error(msg);
    if (process.env.NODE_ENV !== 'production') {
      console.error(new Error().stack);
    }
    return false;
  }
  return true;
}

// --------------------------------------------------------------------------
// 🔍 HEALTHCARE DEBUG: Validation function
// NOTE: The specialised healthcare validator is no longer required; the two
// helpers above cover *all* IDs.
// --------------------------------------------------------------------------

export function applyInterceptors(budgetStore, changeTracker) {
  // Guard against double-application (e.g. HMR)
  if (budgetStore.__interceptorsApplied) return;
  budgetStore.__interceptorsApplied = true;

  // Capture baseline IDs for validation
  captureOriginalIds(budgetStore);

  // Add change context tracking
  budgetStore._currentChangeContext = null;
  budgetStore._pendingChangeEvents = [];
  budgetStore._contextTimeWindow = 500; // 500ms window for grouping related changes

  // Expose tracker
  window.changeTracker = changeTracker;

  /* ----------  SPENDING  ---------- */
  const originalUpdateSpendingFactor = budgetStore.updateSpendingFactor;
  budgetStore.updateSpendingFactor = function (categoryId, factor) {
    // Warn about unknown IDs but don't block execution
    if (!assertValidSpendingId(categoryId, 'updateSpendingFactor')) {
      console.warn(`[Interceptor] Unknown spending id "${categoryId}" - proceeding anyway`);
    }
    
    // Set change context for correlation
    const previousContext = budgetStore._currentChangeContext;
    budgetStore._currentChangeContext = `spending:${categoryId}`;
    
    const result = createMethodInterceptor(
      budgetStore,
      originalUpdateSpendingFactor,
      'spending',
      (categoryId, factor) => ({
        categoryId,
        categoryName: findCategoryName(budgetStore, categoryId),
        currentValue: findCategoryAmount(budgetStore, categoryId),
        factor,
      }),
    ).call(this, categoryId, factor);
    
    // Restore previous context
    budgetStore._currentChangeContext = previousContext;
    return result;
  };
  // Group spending updates
  const originalUpdateGroupSpendingFactor = budgetStore.updateGroupSpendingFactor;
  if (typeof originalUpdateGroupSpendingFactor === 'function') {
    budgetStore.updateGroupSpendingFactor = function (groupId, factor) {
      const cat = findCategory(budgetStore, groupId);
      if (!cat || !cat.isGroup) {
        return;
      }
      if (!assertValidSpendingId(groupId, 'updateGroupSpendingFactor')) {
        console.warn(`[Interceptor] Unknown group spending id "${groupId}" - proceeding anyway`);
      }
      
      // Set change context for correlation
      const previousContext = budgetStore._currentChangeContext;
      budgetStore._currentChangeContext = `spending:${groupId}`;
      
      const result = createMethodInterceptor(
        budgetStore,
        originalUpdateGroupSpendingFactor,
        'spending',
        (groupId, factor) => ({
          categoryId: groupId,
          categoryName: findCategoryName(budgetStore, groupId),
          currentValue: typeof budgetStore.getGroupTotal === 'function' ? budgetStore.getGroupTotal(groupId) : 0,
          factor,
        }),
      ).call(this, groupId, factor);
      
      // Restore previous context
      budgetStore._currentChangeContext = previousContext;
      return result;
    };
  }

  /* ----------  REVENUE  ---------- */
  const originalSetRevenueRate = budgetStore.setRevenueRate;
  budgetStore.setRevenueRate = function (sourceId, newRate) {
    if (!assertValidRevenueId(sourceId, 'setRevenueRate')) return;
    return createMethodInterceptor(
      budgetStore,
      originalSetRevenueRate,
      'revenue',
      (sourceId, newRate) => ({
        categoryId: sourceId,
        categoryName: findRevenueName(budgetStore, sourceId),
        currentValue: findRevenueAmount(budgetStore, sourceId),
        rate: newRate,
      }),
    ).call(this, sourceId, newRate);
  };

  const originalUpdateRevenueRate = budgetStore.updateRevenueRate;
  if (typeof originalUpdateRevenueRate === 'function') {
    budgetStore.updateRevenueRate = function (sourceId, newRate) {
      if (!assertValidRevenueId(sourceId, 'updateRevenueRate')) return;
      return createMethodInterceptor(
        budgetStore,
        originalUpdateRevenueRate,
        'revenue',
        (sourceId, newRate) => ({
          categoryId: sourceId,
          categoryName: findRevenueName(budgetStore, sourceId),
          currentValue: findRevenueAmount(budgetStore, sourceId),
          rate: newRate,
        }),
      ).call(this, sourceId, newRate);
    };
  }

  /* ----------  TAX EXPENDITURES ---------- */
  const originalUpdateTaxExp = budgetStore.updateTaxExpenditureAdjustment;
  if (typeof originalUpdateTaxExp === 'function') {
    budgetStore.updateTaxExpenditureAdjustment = function (expenditureId, adjustment) {
      if (!assertValidTaxExpId(expenditureId, 'updateTaxExpenditureAdjustment')) return;
      
      // Set change context for correlation
      const previousContext = budgetStore._currentChangeContext;
      budgetStore._currentChangeContext = `tax-expenditure:${expenditureId}`;
      
      const result = createMethodInterceptor(
        budgetStore,
        originalUpdateTaxExp,
        'spending', // This ensures red color for tax expenditures
        (expenditureId, adjustment) => ({
          categoryId: expenditureId,
          categoryName: findTaxExpName(budgetStore, expenditureId),
          currentValue: findTaxExpImpact(budgetStore, expenditureId),
          factor: adjustment,
        }),
      ).call(this, expenditureId, adjustment);
      
      // Restore previous context
      budgetStore._currentChangeContext = previousContext;
      return result;
    };
  }

  /* ----------  BATCH LIFECYCLE ---------- */
  const originalBeginBatchUpdate = budgetStore.beginBatchUpdate;
  if (typeof originalBeginBatchUpdate === 'function') {
    budgetStore.beginBatchUpdate = function (...args) {
      const started = originalBeginBatchUpdate.apply(this, args);
      if (started && window.changeTracker?.beginBatch) window.changeTracker.beginBatch();
      return started;
    };
  }

  const originalCompleteBatchUpdate = budgetStore.completeBatchUpdate;
  if (typeof originalCompleteBatchUpdate === 'function') {
    budgetStore.completeBatchUpdate = function (...args) {
      const finished = originalCompleteBatchUpdate.apply(this, args);
      if (finished && !this.isBatchUpdateInProgress && window.changeTracker?.endBatch) {
        window.changeTracker.endBatch();
      }
      return finished;
    };
  }
}

function createMethodInterceptor(store, originalMethod, changeType, metadataExtractor) {
  if (typeof originalMethod !== 'function') return originalMethod;

  return function (...args) {
    try {
      // 1) BEFORE state
      const beforeMeta = metadataExtractor(...args);
      const previousValue = beforeMeta.currentValue;

      // 2) Execute original method
      const result = originalMethod.apply(this, args);

      // 3) AFTER state
      const afterMeta = metadataExtractor(...args);
      const currentValue = afterMeta.currentValue;

      // 4) Significance check
      const significant = hasSignificantChange({ previousValue }, { currentValue });
      if (significant) {
        const inBatch = store.isBatchUpdateInProgress;
        const currentBatchId = window.changeTracker?.currentBatchId || null;
        const changeAmount = currentValue - previousValue;

        // Detect auto-balance and expenditure contexts
        const isAutoBalance = store.autoBalanceActive && changeType === 'revenue' && !inBatch;
        const expenditureImpact = changeType === 'revenue' && 
          store.revenueSources?.[beforeMeta.categoryId]?.expenditureImpact;
        const isRecalculation = store._isRecalculating && changeType === 'revenue';
        
        // Detect spending-driven revenue changes
        const triggerContext = store._currentChangeContext;
        const isSpendingDriven = changeType === 'revenue' && triggerContext && triggerContext.startsWith('spending:');
        const isTaxExpDriven = changeType === 'revenue' && triggerContext && triggerContext.startsWith('tax-expenditure:');

        const changeEvent = {
          id: `${changeType}_${beforeMeta.categoryId}_${Date.now()}`,
          type: changeType,
          majorType: changeType,
          subType: beforeMeta.categoryId,
          itemId: `${beforeMeta.categoryId}`,
          itemName: beforeMeta.categoryName,
          changeAmount,
          previousValue,
          currentValue,
          percentageChange: previousValue !== 0 ? (changeAmount / previousValue) * 100 : 0,
          groupHeading: deriveGroupHeading(store, changeType, beforeMeta.categoryId),
          metadata: {
            source: inBatch ? 'preset' : 'user',
            ...(inBatch && currentBatchId ? { batchId: currentBatchId } : {}),
            ...(typeof beforeMeta.factor !== 'undefined' ? { factor: beforeMeta.factor } : {}),
            ...(typeof beforeMeta.rate !== 'undefined' ? { rate: beforeMeta.rate } : {}),
            ...(isAutoBalance ? { isAutoBalance: true } : {}),
            ...(expenditureImpact ? { expenditureImpact: expenditureImpact } : {}),
            ...(isRecalculation ? { isRecalculation: true } : {}),
            ...(triggerContext ? { triggerContext: triggerContext } : {}),
            ...(isSpendingDriven ? { isSpendingDriven: true } : {}),
            ...(isTaxExpDriven ? { isTaxExpDriven: true } : {}),
          },
          timestamp: Date.now(),
        };

        if (window.changeTracker?.processChangeEvent) {
          window.changeTracker.processChangeEvent(changeEvent);
        } else if (window.changeTracker?.addChange) {
          window.changeTracker.addChange(changeEvent);
        }
      }

      return result;
    } catch (err) {
      console.error(`[Interceptor] Error in ${changeType} interceptor:`, err);
      throw err;
    }
  };
} 

export function createBudgetChangeInterceptors(budgetStore, changeTracker) {
  // Guard against double-application (e.g. HMR)
  if (budgetStore.__interceptorsApplied) {
    return {
      revenueInterceptor: budgetStore.setRevenueRate,
      spendingInterceptor: budgetStore.updateSpendingFactor
    };
  }
  budgetStore.__interceptorsApplied = true;

  // Capture baseline IDs for validation
  captureOriginalIds(budgetStore);

  // Add change context tracking
  budgetStore._currentChangeContext = null;
  budgetStore._pendingChangeEvents = [];
  budgetStore._contextTimeWindow = 500; // 500ms window for grouping related changes

  // Expose tracker
  window.changeTracker = changeTracker;

  // Store original methods
  const originalSetRevenueRate = budgetStore.setRevenueRate;
  const originalUpdateSpendingFactor = budgetStore.updateSpendingFactor;

  // Create revenue interceptor
  const revenueInterceptor = function (sourceId, newRate) {
    if (!assertValidRevenueId(sourceId, 'setRevenueRate')) return;
    return createMethodInterceptor(
      budgetStore,
      originalSetRevenueRate,
      'revenue',
      (sourceId, newRate) => ({
        categoryId: sourceId,
        categoryName: findRevenueName(budgetStore, sourceId),
        currentValue: findRevenueAmount(budgetStore, sourceId),
        rate: newRate,
      }),
    ).call(this, sourceId, newRate);
  };

  // Create spending interceptor
  const spendingInterceptor = function (categoryId, factor) {
    // Warn about unknown IDs but don't block execution
    if (!assertValidSpendingId(categoryId, 'updateSpendingFactor')) {
      console.warn(`[Interceptor] Unknown spending id "${categoryId}" - proceeding anyway`);
    }
    
    // Set change context for correlation
    const previousContext = budgetStore._currentChangeContext;
    budgetStore._currentChangeContext = `spending:${categoryId}`;
    
    const result = createMethodInterceptor(
      budgetStore,
      originalUpdateSpendingFactor,
      'spending',
      (categoryId, factor) => ({
        categoryId,
        categoryName: findCategoryName(budgetStore, categoryId),
        currentValue: findCategoryAmount(budgetStore, categoryId),
        factor,
      }),
    ).call(this, categoryId, factor);
    
    // Restore previous context
    budgetStore._currentChangeContext = previousContext;
    return result;
  };

  // Handle group spending updates
  const originalUpdateGroupSpendingFactor = budgetStore.updateGroupSpendingFactor;
  if (typeof originalUpdateGroupSpendingFactor === 'function') {
    budgetStore.updateGroupSpendingFactor = function (groupId, factor) {
      const cat = findCategory(budgetStore, groupId);
      if (!cat || !cat.isGroup) {
        return;
      }
      if (!assertValidSpendingId(groupId, 'updateGroupSpendingFactor')) {
        console.warn(`[Interceptor] Unknown group spending id "${groupId}" - proceeding anyway`);
      }
      
      // Set change context for correlation
      const previousContext = budgetStore._currentChangeContext;
      budgetStore._currentChangeContext = `spending:${groupId}`;
      
      const result = createMethodInterceptor(
        budgetStore,
        originalUpdateGroupSpendingFactor,
        'spending',
        (groupId, factor) => ({
          categoryId: groupId,
          categoryName: findCategoryName(budgetStore, groupId),
          currentValue: typeof budgetStore.getGroupTotal === 'function' ? budgetStore.getGroupTotal(groupId) : 0,
          factor,
        }),
      ).call(this, groupId, factor);
      
      // Restore previous context
      budgetStore._currentChangeContext = previousContext;
      return result;
    };
  }

  // Handle revenue rate updates
  const originalUpdateRevenueRate = budgetStore.updateRevenueRate;
  if (typeof originalUpdateRevenueRate === 'function') {
    budgetStore.updateRevenueRate = function (sourceId, newRate) {
      if (!assertValidRevenueId(sourceId, 'updateRevenueRate')) return;
      return createMethodInterceptor(
        budgetStore,
        originalUpdateRevenueRate,
        'revenue',
        (sourceId, newRate) => ({
          categoryId: sourceId,
          categoryName: findRevenueName(budgetStore, sourceId),
          currentValue: findRevenueAmount(budgetStore, sourceId),
          rate: newRate,
        }),
      ).call(this, sourceId, newRate);
    };
  }

  // Handle tax expenditure updates
  const originalUpdateTaxExp = budgetStore.updateTaxExpenditureAdjustment;
  if (typeof originalUpdateTaxExp === 'function') {
    budgetStore.updateTaxExpenditureAdjustment = function (expenditureId, adjustment) {
      if (!assertValidTaxExpId(expenditureId, 'updateTaxExpenditureAdjustment')) return;
      
      // Set change context for correlation
      const previousContext = budgetStore._currentChangeContext;
      budgetStore._currentChangeContext = `tax-expenditure:${expenditureId}`;
      
      const result = createMethodInterceptor(
        budgetStore,
        originalUpdateTaxExp,
        'spending', // This ensures red color for tax expenditures
        (expenditureId, adjustment) => ({
          categoryId: expenditureId,
          categoryName: findTaxExpName(budgetStore, expenditureId),
          currentValue: findTaxExpImpact(budgetStore, expenditureId),
          factor: adjustment,
        }),
      ).call(this, expenditureId, adjustment);
      
      // Restore previous context
      budgetStore._currentChangeContext = previousContext;
      return result;
    };
  }

  // Handle batch lifecycle
  const originalBeginBatchUpdate = budgetStore.beginBatchUpdate;
  if (typeof originalBeginBatchUpdate === 'function') {
    budgetStore.beginBatchUpdate = function (...args) {
      const started = originalBeginBatchUpdate.apply(this, args);
      if (started && window.changeTracker?.beginBatch) window.changeTracker.beginBatch();
      return started;
    };
  }

  const originalCompleteBatchUpdate = budgetStore.completeBatchUpdate;
  if (typeof originalCompleteBatchUpdate === 'function') {
    budgetStore.completeBatchUpdate = function (...args) {
      const finished = originalCompleteBatchUpdate.apply(this, args);
      if (finished && !this.isBatchUpdateInProgress && window.changeTracker?.endBatch) {
        window.changeTracker.endBatch();
      }
      return finished;
    };
  }

  // Return the interceptors for manual assignment
  return {
    revenueInterceptor,
    spendingInterceptor
  };
} 