import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChangeTracker } from '../useChangeTracker';

// Mock budget store
const mockBudgetStore = {
  revenueSources: {
    personalIncomeTax: {
      name: 'Personal Income Tax',
      adjustedAmount: 210
    }
  },
  spendingCategories: {
    healthCare: {
      name: 'Health Care',
      adjustedAmount: 200
    }
  }
};

describe('useChangeTracker', () => {
  let changeTracker;

  beforeEach(() => {
    changeTracker = useChangeTracker(mockBudgetStore);
  });

  it('should initialize with empty changes', () => {
    expect(changeTracker.recentChanges.value).toEqual([]);
    expect(changeTracker.batchChanges.value).toEqual([]);
    expect(changeTracker.hasActiveChanges.value).toBe(false);
    expect(changeTracker.hasBatchChanges.value).toBe(false);
  });

  it('should process individual changes', () => {
    const changeEvent = {
      id: 'test-1',
      type: 'revenue',
      itemId: 'personalIncomeTax',
      itemName: 'Personal Income Tax',
      changeAmount: 10,
      percentageChange: 5,
      previousValue: 200,
      currentValue: 210,
      metadata: { source: 'user' },
      timestamp: Date.now()
    };

    changeTracker.processChangeEvent(changeEvent);

    expect(changeTracker.recentChanges.value).toHaveLength(1);
    expect(changeTracker.recentChanges.value[0].id).toBe('test-1');
    expect(changeTracker.hasActiveChanges.value).toBe(true);
  });

  it('should filter out insignificant changes', () => {
    const smallChangeEvent = {
      id: 'test-2',
      type: 'revenue',
      itemId: 'personalIncomeTax',
      itemName: 'Personal Income Tax',
      changeAmount: 0.1, // Below threshold
      percentageChange: 0.05,
      previousValue: 200,
      currentValue: 200.1,
      metadata: { source: 'user' },
      timestamp: Date.now()
    };

    changeTracker.processChangeEvent(smallChangeEvent);

    expect(changeTracker.recentChanges.value).toHaveLength(0);
    expect(changeTracker.hasActiveChanges.value).toBe(false);
  });

  it('should handle batch changes', () => {
    const batchId = 'batch-123';
    const changeEvent1 = {
      id: 'test-3',
      type: 'revenue',
      itemId: 'personalIncomeTax',
      itemName: 'Personal Income Tax',
      changeAmount: 10,
      percentageChange: 5,
      previousValue: 200,
      currentValue: 210,
      metadata: { source: 'user', batchId },
      timestamp: Date.now()
    };

    const changeEvent2 = {
      id: 'test-4',
      type: 'spending',
      itemId: 'healthCare',
      itemName: 'Health Care',
      changeAmount: -5,
      percentageChange: -2.5,
      previousValue: 200,
      currentValue: 195,
      metadata: { source: 'user', batchId },
      timestamp: Date.now()
    };

    changeTracker.processChangeEvent(changeEvent1);
    changeTracker.processChangeEvent(changeEvent2);

    expect(changeTracker.batchChanges.value).toHaveLength(1);
    expect(changeTracker.batchChanges.value[0].batchId).toBe(batchId);
    expect(changeTracker.batchChanges.value[0].changes).toHaveLength(2);
    expect(changeTracker.hasBatchChanges.value).toBe(true);
  });

  it('should dismiss individual changes', () => {
    const changeEvent = {
      id: 'test-5',
      type: 'revenue',
      itemId: 'personalIncomeTax',
      itemName: 'Personal Income Tax',
      changeAmount: 10,
      percentageChange: 5,
      previousValue: 200,
      currentValue: 210,
      metadata: { source: 'user' },
      timestamp: Date.now()
    };

    changeTracker.processChangeEvent(changeEvent);
    expect(changeTracker.recentChanges.value).toHaveLength(1);

    changeTracker.dismissChange('test-5');
    expect(changeTracker.recentChanges.value).toHaveLength(0);
    expect(changeTracker.hasActiveChanges.value).toBe(false);
  });

  it('should dismiss batch changes', () => {
    const batchId = 'batch-456';
    const changeEvent = {
      id: 'test-6',
      type: 'revenue',
      itemId: 'personalIncomeTax',
      itemName: 'Personal Income Tax',
      changeAmount: 10,
      percentageChange: 5,
      previousValue: 200,
      currentValue: 210,
      metadata: { source: 'user', batchId },
      timestamp: Date.now()
    };

    changeTracker.processChangeEvent(changeEvent);
    expect(changeTracker.batchChanges.value).toHaveLength(1);

    changeTracker.dismissBatch(batchId);
    expect(changeTracker.batchChanges.value).toHaveLength(0);
    expect(changeTracker.hasBatchChanges.value).toBe(false);
  });

  it('should limit maximum number of changes', () => {
    // Add more than MAX_CHANGES (3) individual changes
    for (let i = 0; i < 5; i++) {
      const changeEvent = {
        id: `test-${i}`,
        type: 'revenue',
        itemId: 'personalIncomeTax',
        itemName: 'Personal Income Tax',
        changeAmount: 10,
        percentageChange: 5,
        previousValue: 200,
        currentValue: 210,
        metadata: { source: 'user' },
        timestamp: Date.now()
      };
      changeTracker.processChangeEvent(changeEvent);
    }

    expect(changeTracker.recentChanges.value).toHaveLength(3); // MAX_CHANGES
    expect(changeTracker.recentChanges.value[0].id).toBe('test-2'); // Oldest should be removed
  });

  it('should generate batch IDs', () => {
    const batchId1 = changeTracker.beginBatch();
    const batchId2 = changeTracker.beginBatch();

    expect(batchId1).toBeDefined();
    expect(batchId2).toBeDefined();
    expect(batchId1).not.toBe(batchId2);
    expect(batchId1).toMatch(/^batch_\d+_/);
  });

  it('should end batches', () => {
    const batchId = changeTracker.beginBatch();
    expect(changeTracker.currentBatchId.value).toBe(batchId);

    changeTracker.endBatch();
    expect(changeTracker.currentBatchId.value).toBe(null);
  });
}); 