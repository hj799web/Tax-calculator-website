<template>
  <div class="demo-container">
    <h2>Budget Change Banner Demo</h2>
    <p>This demo shows how the budget change banner tracks and displays changes in spending and revenue.</p>
    
    <div class="demo-controls">
      <h3>Simulate Changes</h3>
      
      <div class="control-group">
        <h4>Revenue Changes</h4>
        <button @click="simulateRevenueChange('personalIncomeTax', 5)" class="demo-btn">
          Increase Personal Income Tax (+$5B)
        </button>
        <button @click="simulateRevenueChange('gst', -2)" class="demo-btn">
          Decrease GST (-$2B)
        </button>
        <button @click="simulateRevenueChange('corporateIncomeTax', 3)" class="demo-btn">
          Increase Corporate Tax (+$3B)
        </button>
      </div>
      
      <div class="control-group">
        <h4>Spending Changes</h4>
        <button @click="simulateSpendingChange('healthCare', 8)" class="demo-btn">
          Increase Health Care (+$8B)
        </button>
        <button @click="simulateSpendingChange('education', -4)" class="demo-btn">
          Decrease Education (-$4B)
        </button>
        <button @click="simulateSpendingChange('defense', 6)" class="demo-btn">
          Increase Defense (+$6B)
        </button>
      </div>
      
      <div class="control-group">
        <h4>Batch Operations</h4>
        <button @click="simulateBatchChanges" class="demo-btn">
          Simulate Preset Application
        </button>
        <button @click="simulateAutoBalance" class="demo-btn">
          Simulate Auto-Balance
        </button>
      </div>
    </div>
    
    <div class="demo-info">
      <h3>How It Works</h3>
      <ul>
        <li><strong>Individual Changes:</strong> Shows specific revenue sources or spending categories that were modified</li>
        <li><strong>Batch Changes:</strong> Groups multiple changes from preset applications or bulk operations</li>
        <li><strong>Threshold Filtering:</strong> Only shows changes above $0.5B to avoid notification spam</li>
        <li><strong>Auto-Dismiss:</strong> Notifications automatically disappear after 4 seconds</li>
        <li><strong>Manual Dismiss:</strong> Users can manually dismiss notifications</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useBudgetSimulatorStore } from '@/domains/budget/store/budgetSimulator';

const budgetStore = useBudgetSimulatorStore();

// Simulate revenue changes
function simulateRevenueChange(sourceId, changeAmount) {
  const source = budgetStore.revenueSources[sourceId];
  if (!source) {
    console.warn(`Revenue source ${sourceId} not found`);
    return;
  }
  
  const currentRate = source.rate;
  const newRate = currentRate + (changeAmount / source.base);
  
  // Ensure rate is within bounds
  const clampedRate = Math.max(source.minRate || 0, Math.min(source.maxRate || 50, newRate));
  
  budgetStore.setRevenueRate(sourceId, clampedRate);
}

// Simulate spending changes
function simulateSpendingChange(categoryId, changeAmount) {
  // Find the category
  let category = null;
  
  // Search in main categories
  for (const cat of Object.values(budgetStore.spendingCategories)) {
    if (cat.id === categoryId && !cat.isGroup) {
      category = cat;
      break;
    }
    if (cat.isGroup && cat.children) {
      for (const child of Object.values(cat.children)) {
        if (child.id === categoryId) {
          category = child;
          break;
        }
      }
    }
  }
  
  if (!category) {
    console.warn(`Spending category ${categoryId} not found`);
    return;
  }
  
  const currentFactor = category.adjustmentFactor || 1;
  const newFactor = currentFactor + (changeAmount / category.baseAmount);
  
  budgetStore.updateSpendingFactor(categoryId, newFactor);
}

// Simulate batch changes (like preset application)
function simulateBatchChanges() {
  // Simulate applying a preset that changes multiple items
  const changes = [
    { sourceId: 'personalIncomeTax', rateChange: 2 },
    { sourceId: 'corporateIncomeTax', rateChange: 1 },
    { categoryId: 'healthCare', factorChange: 0.1 },
    { categoryId: 'education', factorChange: -0.05 }
  ];
  
  changes.forEach(change => {
    if (change.sourceId) {
      const source = budgetStore.revenueSources[change.sourceId];
      if (source) {
        const newRate = source.rate + change.rateChange;
        budgetStore.setRevenueRate(change.sourceId, newRate);
      }
    } else if (change.categoryId) {
      const category = findCategory(budgetStore, change.categoryId);
      if (category) {
        const newFactor = (category.adjustmentFactor || 1) + change.factorChange;
        budgetStore.updateSpendingFactor(change.categoryId, newFactor);
      }
    }
  });
}

// Simulate auto-balance operation
function simulateAutoBalance() {
  // Simulate auto-balance that adjusts multiple items to balance the budget
  const changes = [
    { sourceId: 'personalIncomeTax', rateChange: 1.5 },
    { sourceId: 'gst', rateChange: 0.5 },
    { categoryId: 'healthCare', factorChange: -0.08 },
    { categoryId: 'education', factorChange: -0.03 }
  ];
  
  changes.forEach(change => {
    if (change.sourceId) {
      const source = budgetStore.revenueSources[change.sourceId];
      if (source) {
        const newRate = source.rate + change.rateChange;
        budgetStore.setRevenueRate(change.sourceId, newRate);
      }
    } else if (change.categoryId) {
      const category = findCategory(budgetStore, change.categoryId);
      if (category) {
        const newFactor = (category.adjustmentFactor || 1) + change.factorChange;
        budgetStore.updateSpendingFactor(change.categoryId, newFactor);
      }
    }
  });
}

// Helper function to find category
function findCategory(budgetStore, categoryId) {
  for (const cat of Object.values(budgetStore.spendingCategories)) {
    if (cat.id === categoryId && !cat.isGroup) {
      return cat;
    }
    if (cat.isGroup && cat.children) {
      for (const child of Object.values(cat.children)) {
        if (child.id === categoryId) {
          return child;
        }
      }
    }
  }
  return null;
}
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-container h2 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.demo-container p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-controls {
  margin-bottom: 2rem;
}

.demo-controls h3 {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.control-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.control-group h4 {
  color: #4b5563;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.demo-btn {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.demo-btn:active {
  transform: translateY(0);
}

.demo-info {
  background: #f0f9ff;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.demo-info h3 {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.demo-info ul {
  color: #1e40af;
  line-height: 1.6;
}

.demo-info li {
  margin-bottom: 0.5rem;
}

.demo-info strong {
  color: #1e3a8a;
}
</style> 