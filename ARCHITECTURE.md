# Tax Calculator & Budget Simulator Architecture

## 1. Core State Management & Data Flow

### Revenue Management System (`src/stores/budgetSimulator.js`)

#### Revenue Source Structure
```javascript
revenueSources: {
  personalIncomeTax: {
    id: "personalIncomeTax",
    name: "Personal Income Tax",
    rate: 21,
    base: 10,  // $10B per 1%
    amount: 210, // $210B
    adjustedAmount: 210,
    rateByYear: {
      2022: 20,
      2023: 20.5,
      2024: 21,
      2025: 21.5,
      2026: 22
    },
    minRate: 0,
    maxRate: 50,
    description: "Controls the average effective personal income tax rate across all brackets.",
    note: "Personal income tax is the largest source of federal revenue.",
    linkedExpenditures: ["personalTaxCredits", "taxDeferrals"],
    expenditureImpact: 0,
    color: "#4299E1"
  },
  corporateIncomeTax: {
    id: "corporateIncomeTax",
    name: "Corporate Income Tax",
    rate: 15,
    base: 5.33, // ~$5.33B per 1%
    amount: 80, // $80B
    adjustedAmount: 80,
    rateByYear: { ... },
    minRate: 0,
    maxRate: 40,
    description: "Reflects business contributions via corporate taxes.",
    note: "Corporate income tax is levied on business profits.",
    linkedExpenditures: ["corporateTaxExpenditures"],
    expenditureImpact: 0,
    color: "#48BB78"
  },
  // Other revenue sources: GST, excise taxes, carbon pricing, etc.
}
```

#### Revenue Categories
1. Income Taxes
   - Personal Income Tax (Base: $10B/1%, Max: 50%)
   - Corporate Income Tax (Base: $5.33B/1%, Max: 40%)

2. Consumption Taxes
   - GST (Base: $10B/1%, Max: 15%)
   - Excise Taxes (Base: $4.8B/1%, Max: 10%)
   - Carbon Pricing (Base: $8B/1%, Max: 5%)
   - Customs Duties (Base: $6B/1%, Max: 5%)

3. Other Revenue
   - EI Premiums (Base: $20B/1%, Max: 5%)
   - Crown Profits (Base: $2.4B/1%, Max: 10%)
   - Resource Royalties (Base: $5B/1%, Max: 5%)
   - Non-Tax Revenue (Base: $10B/1%, Max: 10%)

#### Revenue Management Features

1. Rate Control
   ```javascript
   setRevenueRate(sourceId, newRate) {
     const source = this.revenueSources[sourceId];
     if (!source) return false;
     
     // Clamp rate to valid range
     const clampedRate = Math.max(source.minRate, 
                                Math.min(source.maxRate, newRate));
     
     // Update source immutably
     this.revenueSources = {
       ...this.revenueSources,
       [sourceId]: {
         ...source,
         rate: clampedRate,
         amount: source.base * clampedRate
       }
     };
     
     // Trigger updates
     this.updateRevenueSourceAdjustedAmount(sourceId);
     this.recalculateTotals();
   }
   ```

2. Tax Expenditure Impact
   ```javascript
   updateRevenueSourceAdjustedAmount(revSourceId) {
     const source = this.revenueSources[revSourceId];
     if (!source) return;
     
     // Calculate total impact from linked expenditures
     let totalImpact = 0;
     Object.values(this.taxExpenditures).forEach(exp => {
       if (exp.linkedRevenueSource === revSourceId) {
         totalImpact += -1 * exp.netAmount * (exp.adjustmentFactor / 100);
       }
     });
     
     // Update adjusted amount
     const adjustedAmount = Math.max(0, source.amount + totalImpact);
     
     this.revenueSources = {
       ...this.revenueSources,
       [revSourceId]: {
         ...source,
         adjustedAmount,
         expenditureImpact: totalImpact
       }
     };
   }
   ```

3. Year-Specific Rates
   ```javascript
   setCurrentYear(year) {
     const updatedSources = {};
     for (const sourceId in this.revenueSources) {
       const source = this.revenueSources[sourceId];
       if (source.rateByYear && source.rateByYear[year] !== undefined) {
         updatedSources[sourceId] = {
           ...source,
           rate: source.rateByYear[year],
           amount: source.base * source.rateByYear[year],
           adjustedAmount: source.base * source.rateByYear[year]
         };
       }
     }
     this.revenueSources = updatedSources;
   }
   ```

### Spending Management System (`src/stores/budgetSimulator.js`)

#### Spending Category Structure
```javascript
spendingCategories: {
  mainCategories: {
    isGroup: true,
    name: "Main Categories",
    children: {
      healthCare: {
        id: "healthCare",
        name: "Health Care",
        baseAmount: 200,
        adjustedAmount: 200,
        adjustmentFactor: 1,
        description: "Federal health care spending",
        linkedRevenue: ["personalIncomeTax"],
        color: "#4299E1"
      },
      // ... other main categories
    }
  },
  governmentOperations: {
    isGroup: true,
    name: "Government Operations",
    children: {
      // ... government operation categories
    }
  }
}
```

#### Spending Management Features

1. Adjustment Control
   ```javascript
   adjustSpendingCategory(categoryId, factor) {
     const category = this.findCategory(categoryId);
     if (!category) return;
     
     // Update adjustment factor
     category.adjustmentFactor = factor;
     
     // Recalculate adjusted amount
     category.adjustedAmount = category.baseAmount * factor;
     
     // Update linked revenue impacts
     this.updateLinkedRevenueImpacts(category);
   }
   ```

2. Group Management
   ```javascript
   toggleGroupExpansion(groupId) {
     this.expandedGroups = {
       ...this.expandedGroups,
       [groupId]: !this.expandedGroups[groupId]
     };
   }
   ```

### Budget Goals System (`src/stores/budgetSimulator.js`)

#### Goal Structure
```javascript
budgetGoals: {
  enabled: true,
  targetRevenue: 434, // $434B
  targetDeficit: 0,
  status: {
    revenue: "on-track",
    deficit: "warning"
  },
  autoBalance: {
    enabled: false,
    priority: ["personalIncomeTax", "corporateIncomeTax", "gst"]
  }
}
```

#### Goal Management Features

1. Auto-Balance Implementation
   ```javascript
   autoBalanceBudgetForGoal() {
     const adjustmentNeeded = this.targetRevenue - this.totalRevenue;
     
     // Get adjustable sources
     const adjustableSources = this.getAdjustableRevenueSources();
     
     // Adjust proportionally
     const result = this.adjustRevenueProportionally(
       adjustmentNeeded,
       adjustableSources
     );
     
     return {
       success: result.success,
       message: result.message,
       adjustments: result.adjustments
     };
   }
   ```

2. Goal Status Tracking
   ```javascript
   updateGoalStatus() {
     const revenueStatus = this.calculateRevenueStatus();
     const deficitStatus = this.calculateDeficitStatus();
     
     this.budgetGoals.status = {
       revenue: revenueStatus,
       deficit: deficitStatus
     };
     
     // Trigger UI updates
     this.lastUpdate = Date.now();
   }
   ```

### State Management Features

#### 1. Reactive Updates
```javascript
// Debounced slider updates
const commitSliderChange = debounce((sourceId, value) => {
  budgetStore.updateRevenueRate(sourceId, value);
}, 200);

// Batch updates
startBatchUpdate() {
  this.isBatchUpdateInProgress = true;
}

endBatchUpdate() {
  this.isBatchUpdateInProgress = false;
  this.recalculateTotals();
  this.lastUpdate = Date.now();
}
```

#### 2. Data Persistence
```javascript
// Local storage sync
syncToLocalStorage() {
  const state = {
    revenueSources: this.revenueSources,
    spendingCategories: this.spendingCategories,
    budgetGoals: this.budgetGoals,
    version: this.stateVersion
  };
  localStorage.setItem('budgetState', JSON.stringify(state));
}

// State recovery
loadFromLocalStorage() {
  const saved = localStorage.getItem('budgetState');
  if (!saved) return false;
  
  const state = JSON.parse(saved);
  if (state.version !== this.stateVersion) return false;
  
  this.revenueSources = state.revenueSources;
  this.spendingCategories = state.spendingCategories;
  this.budgetGoals = state.budgetGoals;
  return true;
}
```

#### 3. Performance Optimizations
```javascript
// Efficient recalculation
recalculateTotals() {
  // Use computed properties for derived values
  this.totalRevenue = this.calculateTotalRevenue();
  this.totalSpending = this.calculateTotalSpending();
  this.surplus = this.totalRevenue - this.totalSpending;
  
  // Batch UI updates
  this.lastUpdate = Date.now();
}

// Optimized reactivity
const revenueSources = computed(() => {
  return Object.values(budgetStore.revenueSources || {})
    .filter(source => source && source.id && !isNaN(Number(source.adjustedAmount)))
    .sort((a, b) => (Number(b.adjustedAmount) || 0) - (Number(a.adjustedAmount) || 0));
});
```

#### 4. Error Handling
```javascript
// Graceful fallbacks
budgetData() {
  try {
    return this.budgetDataForBadges;
  } catch (e) {
    console.error('[budgetData] Error:', e);
    return {
      totalRevenue: 0,
      totalSpending: 0,
      surplus: 0,
      revenueMix: this.getDefaultRevenueMix()
    };
  }
}

// Validation
validateNumericValue(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}
```

#### 5. State Synchronization
```javascript
// Version tracking
incrementStateVersion() {
  this.stateVersion++;
  this.lastUpdate = Date.now();
}

// Atomic updates
updateRevenueSource(sourceId, updates) {
  const source = this.revenueSources[sourceId];
  if (!source) return;
  
  this.revenueSources = {
    ...this.revenueSources,
    [sourceId]: {
      ...source,
      ...updates
    }
  };
  
  this.incrementStateVersion();
}
```

## 2. Domain Interactions

### Budget → Calculator Interaction

#### Tax Rate Synchronization
```javascript
// In budget simulator store
updateCalculatorState() {
  const calculatorStore = useCalculatorStore();
  
  // Update tax rates based on revenue sources
  const taxRates = {
    personal: this.revenueSources.personalIncomeTax.rate,
    corporate: this.revenueSources.corporateIncomeTax.rate,
    gst: this.revenueSources.gst.rate
  };
  
  calculatorStore.updateTaxRates(taxRates);
  
  // Update year-specific calculations
  calculatorStore.updateYear(this.currentYear);
  
  // Trigger recalculation
  calculatorStore.recalculateTax();
}

// In calculator store
updateTaxRates(rates) {
  // Update tax brackets based on new rates
  this.taxBrackets = this.calculateTaxBrackets(rates);
  
  // Update effective rates
  this.effectiveRates = this.calculateEffectiveRates(rates);
  
  // Recalculate taxes for current income
  this.recalculateTax();
}
```

#### Income Impact Analysis
```javascript
// In calculator store
watch(() => this.netFederalTaxAnnual, (newTax) => {
  const budgetStore = useBudgetSimulatorStore();
  
  // Calculate impact on budget
  const taxRate = (newTax / this.income.annual) * 100;
  const revenueImpact = this.calculateRevenueImpact(taxRate);
  
  // Update budget projections
  budgetStore.updateRevenueProjection('personalIncomeTax', revenueImpact);
});

// In budget simulator store
updateRevenueProjection(sourceId, impact) {
  const source = this.revenueSources[sourceId];
  if (!source) return;
  
  // Update projected amount
  const projectedAmount = source.base * (source.rate + impact);
  
  this.revenueSources = {
    ...this.revenueSources,
    [sourceId]: {
      ...source,
      projectedAmount,
      impact
    }
  };
  
  // Recalculate totals
  this.recalculateTotals();
}
```

### Budget → Sentiment Interaction

#### Public Opinion Impact
```javascript
// In sentiment store
calculateBudgetImpact(budgetData) {
  const {
    revenueMix,
    spendingMix,
    deficit
  } = budgetData;
  
  // Calculate sector impacts
  const sectorImpacts = {
    business: this.calculateBusinessImpact(revenueMix),
    individuals: this.calculateIndividualImpact(revenueMix),
    environment: this.calculateEnvironmentalImpact(spendingMix)
  };
  
  // Calculate regional variations
  const regionalImpacts = this.calculateRegionalImpacts(budgetData);
  
  // Calculate demographic effects
  const demographicImpacts = this.calculateDemographicImpacts(budgetData);
  
  return {
    overall: this.calculateOverallSentiment(sectorImpacts, regionalImpacts),
    sectors: sectorImpacts,
    regions: regionalImpacts,
    demographics: demographicImpacts
  };
}

// In budget simulator store
updateSentiment() {
  const sentimentStore = useSentimentStore();
  
  // Prepare budget data
  const budgetData = {
    revenueMix: this.revenueMix,
    spendingMix: this.spendingMix,
    deficit: this.surplus,
    year: this.currentYear
  };
  
  // Update sentiment
  const impacts = sentimentStore.calculateBudgetImpact(budgetData);
  
  // Store impacts for UI
  this.sentimentImpacts = impacts;
  
  // Trigger UI updates
  this.lastUpdate = Date.now();
}
```

#### Fiscal Chaos Detection
```javascript
// In budget simulator store
detectFiscalChaos() {
  const indicators = {
    revenueDrop: this.calculateRevenueDrop(),
    spendingSpike: this.calculateSpendingSpike(),
    deficitThreshold: this.calculateDeficitThreshold()
  };
  
  const warnings = [];
  
  // Check revenue stability
  if (indicators.revenueDrop > 0.1) {
    warnings.push({
      type: 'revenue',
      severity: 'high',
      message: 'Significant revenue drop detected'
    });
  }
  
  // Check spending stability
  if (indicators.spendingSpike > 0.15) {
    warnings.push({
      type: 'spending',
      severity: 'high',
      message: 'Unusual spending increase detected'
    });
  }
  
  // Check deficit threshold
  if (indicators.deficitThreshold > 0.05) {
    warnings.push({
      type: 'deficit',
      severity: 'critical',
      message: 'Deficit exceeding sustainable threshold'
    });
  }
  
  return {
    isChaotic: warnings.length > 0,
    warnings,
    indicators
  };
}

// In sentiment store
updateFiscalChaosStatus(chaos) {
  if (chaos.isChaotic) {
    // Update sentiment based on chaos
    this.overall *= 0.8;
    
    // Update sector sentiments
    Object.keys(this.sectors).forEach(sector => {
      this.sectors[sector] *= 0.9;
    });
    
    // Update regional sentiments
    Object.keys(this.regions).forEach(region => {
      this.regions[region] *= 0.85;
    });
  }
}
```

### Budget → Badges Interaction

#### Achievement Tracking
```javascript
// In badges store
checkAchievements(budgetData) {
  const achievements = [];
  
  // Check revenue achievements
  if (this.checkRevenueAchievements(budgetData)) {
    achievements.push({
      id: 'revenue_master',
      title: 'Revenue Master',
      description: 'Achieved optimal revenue mix',
      criteria: {
        revenueEfficiency: 0.8,
        revenueStability: 0.9
      }
    });
  }
  
  // Check spending achievements
  if (this.checkSpendingAchievements(budgetData)) {
    achievements.push({
      id: 'spending_expert',
      title: 'Spending Expert',
      description: 'Optimized spending allocation',
      criteria: {
        spendingEfficiency: 0.8,
        spendingBalance: 0.9
      }
    });
  }
  
  // Check deficit achievements
  if (this.checkDeficitAchievements(budgetData)) {
    achievements.push({
      id: 'deficit_warrior',
      title: 'Deficit Warrior',
      description: 'Maintained sustainable deficit levels',
      criteria: {
        deficitControl: 0.9,
        debtRatio: 0.8
      }
    });
  }
  
  return achievements;
}

// In budget simulator store
updateBadges() {
  const badgesStore = useBadgesStore();
  
  // Prepare budget data
  const budgetData = {
    revenue: this.revenueData,
    spending: this.spendingData,
    deficit: this.surplus,
    performance: this.calculatePerformanceMetrics()
  };
  
  // Check for new achievements
  const newBadges = badgesStore.checkAchievements(budgetData);
  
  if (newBadges.length > 0) {
    // Update badges
    this.badges = [...this.badges, ...newBadges];
    
    // Update last badge update time
    this.lastBadgeUpdate = Date.now();
    
    // Trigger achievement notifications
    this.notifyAchievements(newBadges);
  }
}
```

#### Performance Metrics
```javascript
// In budget simulator store
calculatePerformanceMetrics() {
  return {
    revenueEfficiency: this.calculateRevenueEfficiency(),
    spendingEfficiency: this.calculateSpendingEfficiency(),
    deficitManagement: this.calculateDeficitManagement(),
    publicSatisfaction: this.calculatePublicSatisfaction()
  };
}

// In badges store
evaluatePerformance(metrics) {
  const thresholds = {
    revenueEfficiency: 0.8,
    spendingEfficiency: 0.8,
    deficitManagement: 0.9,
    publicSatisfaction: 0.7
  };
  
  const evaluations = Object.entries(metrics).map(([key, value]) => ({
    metric: key,
    value,
    threshold: thresholds[key],
    passed: value >= thresholds[key]
  }));
  
  return {
    overall: evaluations.every(e => e.passed),
    evaluations
  };
}
```

### Cross-Domain State Management

#### State Synchronization
```javascript
// In budget simulator store
synchronizeState() {
  // Update calculator state
  this.updateCalculatorState();
  
  // Update sentiment state
  this.updateSentimentState();
  
  // Update badges state
  this.updateBadgesState();
  
  // Trigger UI updates
  this.lastUpdate = Date.now();
}

updateCalculatorState() {
  const calculatorStore = useCalculatorStore();
  calculatorStore.updateTaxRates(this.revenueSources);
  calculatorStore.updateYear(this.currentYear);
}

updateSentimentState() {
  const sentimentStore = useSentimentStore();
  sentimentStore.updateBudgetData(this.budgetData);
}

updateBadgesState() {
  const badgesStore = useBadgesStore();
  badgesStore.updatePerformanceMetrics(this.calculatePerformanceMetrics());
}
```

#### Event Handling
```javascript
// In budget simulator store
handleBudgetChange() {
  // Start batch update
  this.startBatchUpdate();
  
  try {
    // Update internal state
    this.recalculateTotals();
    
    // Synchronize with other domains
    this.synchronizeState();
    
    // Update UI
    this.lastUpdate = Date.now();
  } finally {
    // End batch update
    this.endBatchUpdate();
  }
}

// In components
watch(() => budgetStore.lastUpdate, () => {
  // Update local component state
  this.updateLocalState();
  
  // Trigger UI refresh
  this.refreshUI();
});
```

### Domain Communication Patterns

#### 1. Direct Store Communication
```javascript
// Direct store access
const budgetStore = useBudgetSimulatorStore();
const calculatorStore = useCalculatorStore();

// Synchronous updates
budgetStore.updateRevenueRate('personalIncomeTax', newRate);
calculatorStore.updateTaxCalculation();
```

#### 2. Event-Based Communication
```javascript
// Event emission
const emitBudgetUpdate = (data) => {
  eventBus.emit('budget:update', data);
};

// Event handling
eventBus.on('budget:update', (data) => {
  // Handle budget update
  handleBudgetUpdate(data);
});
```

#### 3. Computed Property Dependencies
```javascript
// In budget simulator
const budgetData = computed(() => ({
  totalRevenue: this.totalRevenue,
  totalSpending: this.totalSpending,
  surplus: this.surplus,
  revenueMix: this.calculateRevenueMix()
}));

// In other stores
watch(() => budgetStore.budgetData, (newData) => {
  // React to budget data changes
  updateDependentState(newData);
});
```

#### 4. State Versioning
```javascript
// In budget simulator
incrementStateVersion() {
  this.stateVersion++;
  this.lastUpdate = Date.now();
  
  // Notify other domains
  this.notifyStateChange();
}

notifyStateChange() {
  const event = new CustomEvent('budget:stateChange', {
    detail: { version: this.stateVersion }
  });
  window.dispatchEvent(event);
}
```

## 3. Component Hierarchy & Data Flow

### Main Application Component (`src/App.vue`)

#### Tab-Based Navigation System
The main application now uses a tab-based navigation system to organize long-form content and improve user experience. The tab system mirrors the simulator's structure and makes content easier to scan.

```vue
<template>
  <div class="app">
    <!-- Global Controls (Year/Salary Selectors) -->
    <div class="global-controls">
      <!-- Year and salary selectors remain above tabs -->
    </div>

    <!-- Tab Navigation -->
    <Tabs
      class="calculator-tabs"
      variant="primary"
      :items="tabItems"
      v-model="activeTab"
    >
      <template #default="{ activeTab: currentTab, getPanelProps }">
        <!-- Calculator + Results Panel -->
        <section
          v-bind="getPanelProps('calculator')"
          class="calculator-section budget-simulator"
          v-show="currentTab === 'calculator'"
        >
          <CalculatorView />
          <ResultView />
        </section>

        <!-- Other Tab Panels -->
        <section
          v-bind="getPanelProps('breakdown')"
          v-show="currentTab === 'breakdown'"
        >
          <!-- Budget Breakdown Content -->
        </section>
      </template>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Tabs from '@/components/Tabs.vue'

// Tab configuration
const activeTab = ref('calculator')
const tabItems = [
  { id: 'calculator', label: 'Calculator', panelId: 'calculator-panel' },
  { id: 'breakdown', label: 'Budget Breakdown', panelId: 'how-it-works' },
  { id: 'categories', label: 'Categories', panelId: 'budget-categories-section' },
  { id: 'faqs', label: 'FAQs', panelId: 'faq-section' },
  { id: 'resources', label: 'Resources', panelId: 'resources-section' }
]

// Auto-expand sections when tabs are first viewed
watch(activeTab, (value) => {
  if (value === 'categories' && !showBudgetCategories.value) {
    showBudgetCategories.value = true
  }
  if (value === 'faqs' && !showFAQs.value) {
    showFAQs.value = true
  }
})
</script>
```

#### Tab System Features

1. **Accessible Navigation**
   - Full keyboard navigation (arrow keys, home, end, enter, space)
   - Proper ARIA attributes (`role="tablist"`, `aria-controls`, `aria-labelledby`)
   - Focus management and screen reader support

2. **Content Organization**
   - Calculator and Results share the same panel for better UX
   - Other sections (Breakdown, Categories, FAQs, Resources) in separate panels
   - Global controls (year/salary selectors) remain above tabs

3. **State Management**
   - Local tab state with reactive updates
   - Auto-expansion of sections when first viewed
   - Maintains scroll position and section state

4. **Styling & Responsiveness**
   - Pill-style tab bar with backdrop blur
   - Dark mode support with appropriate contrast
   - Mobile-optimized with horizontal scrolling
   - Consistent spacing and typography

5. **i18n System Integration**
   - **Local i18n Module**: Dependency-free internationalization utility
   - **Plugin Interface**: Maintains `app.use(i18n)` compatibility with `useI18n()` hook
   - **LocalStorage Integration**: Persists locale selection across sessions
   - **Parameter Interpolation**: Supports `{param}` syntax for dynamic content
   - **Fallback System**: Falls back to EN if translation key not found
   - **Mojibake Fix**: Special handling for French language labels
   - **Simulator i18n Wiring**: Main header, navigation, and section titles use `t(...)`

### Shared Tabs Component (`src/components/Tabs.vue`)

#### Component Structure
```vue
<template>
  <div :class="classes">
    <div
      class="tabs__list"
      role="tablist"
      :aria-orientation="orientation"
    >
      <button
        v-for="(tab, index) in normalizedItems"
        :key="tab.id"
        type="button"
        class="tabs__tab"
        :class="{ 'is-active': tab.id === activeTab }"
        :id="getTabId(tab.id)"
        role="tab"
        :aria-selected="tab.id === activeTab"
        :aria-controls="tab.panelId"
        :tabindex="tab.id === activeTab ? 0 : -1"
        @click="onClickTab(tab.id)"
        @keydown="onKeydown($event, index)"
        :ref="(el) => setTabRef(el, index)"
      >
        <span class="tabs__label">{{ tab.label }}</span>
      </button>
    </div>
    <div class="tabs__panels">
      <slot v-bind="slotBinding" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUpdate, ref, watch } from 'vue'

defineOptions({
  name: 'TabsComponent'
})

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.every(item => 
      item && typeof item.id === 'string' && typeof item.label === 'string'
    )
  },
  modelValue: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default'
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Keyboard navigation and accessibility features
const onKeydown = (event, index) => {
  const { key } = event
  const total = normalizedItems.value.length
  if (!total) return

  const isHorizontal = props.orientation === 'horizontal'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

  if (key === nextKey) {
    event.preventDefault()
    const nextIndex = (index + 1) % total
    selectByIndex(nextIndex)
  } else if (key === prevKey) {
    event.preventDefault()
    const prevIndex = (index - 1 + total) % total
    selectByIndex(prevIndex)
  } else if (key === 'Home') {
    event.preventDefault()
    selectByIndex(0)
  } else if (key === 'End') {
    event.preventDefault()
    selectByIndex(total - 1)
  } else if (key === 'Enter' || key === ' ') {
    event.preventDefault()
    const item = normalizedItems.value[index]
    if (item) {
      setActive(item.id, { emitChange: true })
    }
  }
}
</script>
```

#### Tab Component Features

1. **Accessibility Compliance**
   - WCAG 2.1 AA compliant keyboard navigation
   - Proper ARIA relationships between tabs and panels
   - Focus management and screen reader support
   - Unique IDs for all interactive elements

2. **Flexible Configuration**
   - Support for horizontal and vertical orientations
   - Multiple styling variants (default, primary)
   - Customizable tab items with validation
   - Two-way data binding with v-model

3. **Performance Optimizations**
   - Efficient reactivity with computed properties
   - Debounced updates to prevent excessive re-renders
   - Lazy panel loading support
   - Memory-efficient ref management

4. **Styling System**
   - Pill-style design with backdrop blur
   - Dark mode support with appropriate contrast ratios
   - Mobile-responsive with horizontal scrolling
   - Consistent spacing and typography

### Main Simulator Component (`src/views/FinanceMinisterSimulator.vue`)

#### Component Structure
```vue
<template>
  <div class="finance-minister-simulator">
    <!-- Sentiment Banner -->
    <CollapsibleSentimentBanner
      :sentiment="sentimentStore.overall"
      :warnings="fiscalWarnings"
      @expand="handleBannerExpand"
    />
    
    <div class="main-container">
      <!-- Goal Tracking -->
      <GoalTracker
        :goals="budgetStore.budgetGoals"
        :status="budgetStore.goalStatus"
        @goal-update="handleGoalUpdate"
      />
      
      <!-- Budget Results -->
      <BudgetResults
        :revenue="budgetStore.totalRevenue"
        :spending="budgetStore.totalSpending"
        :surplus="budgetStore.surplus"
        :year="budgetStore.currentYear"
      />
      
      <!-- Revenue Controls -->
      <RevenueSliders
        :sources="budgetStore.revenueSources"
        :auto-balance="budgetStore.autoBalanceActive"
        @rate-change="handleRevenueChange"
      />
      
      <!-- Spending Controls -->
      <SpendingControls
        :categories="budgetStore.spendingCategories"
        :expanded-groups="budgetStore.expandedGroups"
        @spending-change="handleSpendingChange"
      />
      
      <!-- Visualization -->
      <ChartsPanel
        :revenue-data="budgetStore.revenueData"
        :spending-data="budgetStore.spendingData"
        :display-mode="chartDisplayMode"
        @mode-change="handleChartModeChange"
      />
      
      <!-- Sentiment Controls -->
      <SentimentSensitivityControl
        :sensitivity="sentimentStore.sensitivity"
        @sensitivity-change="handleSensitivityChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';
import { useSentimentStore } from '@/stores/sentiment';

// Store initialization
const budgetStore = useBudgetSimulatorStore();
const sentimentStore = useSentimentStore();

// Local state
const chartDisplayMode = ref('amount');
const fiscalWarnings = ref([]);

// Lifecycle hooks
onMounted(() => {
  initializeSimulator();
});

// Event handlers
const handleRevenueChange = (sourceId, newRate) => {
  budgetStore.setRevenueRate(sourceId, newRate);
};

const handleSpendingChange = (categoryId, factor) => {
  budgetStore.adjustSpendingCategory(categoryId, factor);
};

const handleGoalUpdate = (goals) => {
  budgetStore.updateBudgetGoals(goals);
};

const handleSensitivityChange = (sensitivity) => {
  sentimentStore.updateSensitivity(sensitivity);
};

// Watch for fiscal chaos
watch(() => budgetStore.fiscalChaos, (chaos) => {
  if (chaos.isChaotic) {
    fiscalWarnings.value = chaos.warnings;
  }
});
</script>
```

### Budget Control Components

#### Revenue Sliders (`src/domains/budget/components/RevenueSliders.vue`)
```vue
<template>
  <div class="revenue-controls">
    <!-- Income Taxes Group -->
    <div class="revenue-group">
      <div class="group-header" @click="toggleGroup('incomeTaxes')">
        <h3>Income Taxes</h3>
        <span class="total">${{ formatCurrency(incomeTaxTotal) }}B</span>
      </div>
      
      <div v-show="isGroupExpanded('incomeTaxes')" class="group-content">
    <RevenueSlider
          v-for="source in incomeTaxSources"
      :key="source.id"
      :source="source"
      :auto-balance-active="autoBalanceActive"
          @rate-change="handleRateChange"
    />
      </div>
    </div>
    
    <!-- Similar groups for Consumption Taxes and Other Revenue -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';
import debounce from 'lodash.debounce';

// Props
const props = defineProps({
  autoBalanceActive: Boolean
});

// Store
const budgetStore = useBudgetSimulatorStore();

// Local state
const expandedGroups = ref({
  incomeTaxes: true,
  consumptionTaxes: true,
  otherRevenues: true
});

// Computed properties
const incomeTaxSources = computed(() => {
  return Object.values(budgetStore.revenueSources)
    .filter(source => ['personalIncomeTax', 'corporateIncomeTax'].includes(source.id));
});

const incomeTaxTotal = computed(() => {
  return incomeTaxSources.value.reduce((sum, source) => 
    sum + (source.adjustedAmount || 0), 0);
});

// Methods
const toggleGroup = (groupName) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName];
};

const isGroupExpanded = (groupName) => {
  return expandedGroups.value[groupName];
};

// Debounced rate change handler
const handleRateChange = debounce((sourceId, newRate) => {
  budgetStore.setRevenueRate(sourceId, newRate);
}, 200);
</script>
```

#### Spending Controls (`src/domains/budget/components/SpendingControls.vue`)
```vue
<template>
  <div class="spending-controls">
    <!-- Main Categories -->
    <div class="spending-group">
      <div class="group-header" @click="toggleGroup('mainCategories')">
        <h3>Main Categories</h3>
        <span class="total">${{ formatCurrency(mainCategoriesTotal) }}B</span>
      </div>
      
      <div v-show="isGroupExpanded('mainCategories')" class="group-content">
        <SpendingSlider
          v-for="category in mainCategories"
          :key="category.id"
          :category="category"
          @adjustment-change="handleAdjustmentChange"
        />
      </div>
    </div>
    
    <!-- Similar groups for Government Operations and Other Categories -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';

// Store
const budgetStore = useBudgetSimulatorStore();

// Computed properties
const mainCategories = computed(() => {
  return Object.values(budgetStore.spendingCategories.mainCategories.children);
});

const mainCategoriesTotal = computed(() => {
  return mainCategories.value.reduce((sum, category) => 
    sum + (category.adjustedAmount || 0), 0);
});

// Methods
const handleAdjustmentChange = (categoryId, factor) => {
  budgetStore.adjustSpendingCategory(categoryId, factor);
};
</script>
```

### Visualization Components

#### Charts Panel (`src/domains/budget/components/ChartsPanel.vue`)
```vue
<template>
  <div class="charts-container">
    <!-- Revenue Chart -->
    <div class="chart-wrapper">
      <h3>Revenue Distribution</h3>
      <PieChart
        :data="revenueChartData"
        :options="chartOptions"
      />
    </div>
    
    <!-- Spending Chart -->
    <div class="chart-wrapper">
      <h3>Spending Distribution</h3>
      <PieChart
        :data="spendingChartData"
        :options="chartOptions"
      />
    </div>
    
    <!-- Deficit Chart -->
    <div class="chart-wrapper">
      <h3>Budget Balance</h3>
      <BarChart
        :data="deficitChartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';
import { Chart } from 'chart.js';

// Props
const props = defineProps({
  displayMode: {
    type: String,
    default: 'amount'
  }
});

// Store
const budgetStore = useBudgetSimulatorStore();

// Chart data
const revenueChartData = computed(() => {
  const sources = Object.values(budgetStore.revenueSources);
  return {
    labels: sources.map(s => s.name),
    datasets: [{
      data: sources.map(s => 
        props.displayMode === 'amount' ? s.adjustedAmount : (s.adjustedAmount / budgetStore.totalRevenue) * 100
      ),
      backgroundColor: sources.map(s => s.color)
    }]
  };
});

// Similar computed properties for spending and deficit charts

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          return props.displayMode === 'amount' 
            ? `$${value.toFixed(1)}B`
            : `${value.toFixed(1)}%`;
        }
      }
    }
  }
};
</script>
```

### Component Communication Patterns

#### 1. Props and Events
```javascript
// Parent component
<RevenueSlider
  :source="revenueSource"
  :auto-balance-active="autoBalanceActive"
  @rate-change="handleRateChange"
/>

// Child component
const props = defineProps({
  source: Object,
  autoBalanceActive: Boolean
});

const emit = defineEmits(['rate-change']);

const handleSliderChange = (value) => {
  emit('rate-change', props.source.id, value);
};
```

#### 2. Store Integration
```javascript
// Component
const budgetStore = useBudgetSimulatorStore();

// Watch for store changes
watch(() => budgetStore.revenueSources, (sources) => {
  updateLocalState(sources);
}, { deep: true });

// Update store
const updateStore = (changes) => {
  budgetStore.updateRevenueSources(changes);
};
```

#### 3. Computed Properties
```javascript
// Component
const totalRevenue = computed(() => {
  return budgetStore.totalRevenue;
});

const revenueSources = computed(() => {
  return Object.values(budgetStore.revenueSources)
    .filter(source => source.adjustedAmount > 0)
    .sort((a, b) => b.adjustedAmount - a.adjustedAmount);
});
```

#### 4. Event Bus Communication
```javascript
// Event bus setup
const eventBus = mitt();

// Component A
const emitUpdate = (data) => {
  eventBus.emit('budget:update', data);
};

// Component B
eventBus.on('budget:update', (data) => {
  handleBudgetUpdate(data);
});
```

### Component State Management

#### 1. Local State
```javascript
// Component
const localState = ref({
  expanded: true,
  selectedSource: null,
  sliderValue: 0
});

// Methods
const toggleExpanded = () => {
  localState.value.expanded = !localState.value.expanded;
};

const updateSlider = (value) => {
  localState.value.sliderValue = value;
};
```

#### 2. Shared State
```javascript
// Composable
export function useSharedState() {
  const state = ref({
    expandedGroups: {},
    selectedItems: new Set(),
    displayMode: 'amount'
  });

  return {
    state,
    toggleGroup: (groupId) => {
      state.value.expandedGroups[groupId] = !state.value.expandedGroups[groupId];
    },
    toggleSelection: (itemId) => {
      if (state.value.selectedItems.has(itemId)) {
        state.value.selectedItems.delete(itemId);
      } else {
        state.value.selectedItems.add(itemId);
      }
    }
  };
}
```

#### 3. Persistent State
```javascript
// Component
const persistentState = useLocalStorage('budget-simulator-state', {
  expandedGroups: {},
  displayMode: 'amount',
  lastUpdate: Date.now()
});

// Methods
const saveState = () => {
  persistentState.value = {
    ...persistentState.value,
    lastUpdate: Date.now()
  };
};
```

## 4. State Management & Updates

### Budget State Management (`src/stores/budgetSimulator.js`)

#### Core State Structure
```javascript
// Budget simulator store
export const useBudgetSimulatorStore = defineStore('budgetSimulator', {
  state: () => ({
    // Revenue state
    revenueSources: {
      personalIncomeTax: {
        id: 'personalIncomeTax',
        name: 'Personal Income Tax',
        rate: 21,
        base: 10,
        amount: 210,
        adjustedAmount: 210,
        rateByYear: {
          2022: 20,
          2023: 20.5,
          2024: 21,
          2025: 21.5,
          2026: 22
        },
        minRate: 0,
        maxRate: 50,
        description: 'Controls the average effective personal income tax rate',
        note: 'Personal income tax is the largest source of federal revenue',
        linkedExpenditures: ['personalTaxCredits', 'taxDeferrals'],
        expenditureImpact: 0,
        color: '#4299E1'
      },
      // Other revenue sources...
    },

    // Spending state
    spendingCategories: {
      mainCategories: {
        isGroup: true,
        name: 'Main Categories',
        children: {
          healthCare: {
            id: 'healthCare',
            name: 'Health Care',
            baseAmount: 200,
            adjustedAmount: 200,
            adjustmentFactor: 1,
            description: 'Federal health care spending',
            linkedRevenue: ['personalIncomeTax'],
            color: '#4299E1'
          }
          // Other categories...
        }
      }
    },

    // Budget goals
    budgetGoals: {
      enabled: true,
      targetRevenue: 434,
      targetDeficit: 0,
      status: {
        revenue: 'on-track',
        deficit: 'warning'
      },
      autoBalance: {
        enabled: false,
        priority: ['personalIncomeTax', 'corporateIncomeTax', 'gst']
      }
    },

    // UI state
    expandedGroups: {},
    selectedItems: new Set(),
    displayMode: 'amount',
    lastUpdate: Date.now(),
    stateVersion: 1
  }),

  // Getters
  getters: {
    totalRevenue: (state) => {
      return Object.values(state.revenueSources)
        .reduce((sum, source) => sum + (source.adjustedAmount || 0), 0);
    },

    totalSpending: (state) => {
      return Object.values(state.spendingCategories)
        .reduce((sum, category) => {
          if (category.isGroup) {
            return sum + Object.values(category.children)
              .reduce((groupSum, child) => 
                groupSum + (child.adjustedAmount || 0), 0);
          }
          return sum + (category.adjustedAmount || 0);
        }, 0);
    },

    surplus: (state) => {
      return state.totalRevenue - state.totalSpending;
    },

    revenueMix: (state) => {
      const total = state.totalRevenue;
      return Object.entries(state.revenueSources)
        .reduce((mix, [id, source]) => ({
          ...mix,
          [id]: (source.adjustedAmount / total) * 100
        }), {});
    }
  },

  // Actions
  actions: {
    // Revenue management
    setRevenueRate(sourceId, newRate) {
      const source = this.revenueSources[sourceId];
      if (!source) return false;

      const clampedRate = Math.max(source.minRate, 
                                 Math.min(source.maxRate, newRate));

      this.revenueSources = {
        ...this.revenueSources,
        [sourceId]: {
          ...source,
          rate: clampedRate,
          amount: source.base * clampedRate
        }
      };

      this.updateRevenueSourceAdjustedAmount(sourceId);
      this.recalculateTotals();
    },

    updateRevenueSourceAdjustedAmount(sourceId) {
      const source = this.revenueSources[sourceId];
      if (!source) return;

      let totalImpact = 0;
      Object.values(this.taxExpenditures).forEach(exp => {
        if (exp.linkedRevenueSource === sourceId) {
          totalImpact += -1 * exp.netAmount * (exp.adjustmentFactor / 100);
        }
      });

      const adjustedAmount = Math.max(0, source.amount + totalImpact);

      this.revenueSources = {
        ...this.revenueSources,
        [sourceId]: {
          ...source,
          adjustedAmount,
          expenditureImpact: totalImpact
        }
      };
    },

    // Spending management
    adjustSpendingCategory(categoryId, factor) {
      const category = this.findCategory(categoryId);
      if (!category) return;

      category.adjustmentFactor = factor;
      category.adjustedAmount = category.baseAmount * factor;
      this.updateLinkedRevenueImpacts(category);
    },

    // Goal management
    updateBudgetGoals(goals) {
      this.budgetGoals = {
        ...this.budgetGoals,
        ...goals
      };

      if (goals.autoBalance?.enabled) {
        this.autoBalanceBudgetForGoal();
      }
    },

    // State synchronization
    synchronizeState() {
      this.updateCalculatorState();
      this.updateSentimentState();
      this.updateBadgesState();
      this.lastUpdate = Date.now();
    }
  }
});
```

### Sentiment State Management (`src/stores/sentiment.js`)

#### State Structure
```javascript
export const useSentimentStore = defineStore('sentiment', {
  state: () => ({
    overall: 1.0,
    regions: {
      ontario: 1.0,
      quebec: 1.0,
      west: 1.0,
      east: 1.0
    },
    demographics: {
      youth: 1.0,
      seniors: 1.0,
      middleClass: 1.0,
      business: 1.0
    },
    sectors: {
      healthcare: 1.0,
      education: 1.0,
      environment: 1.0,
      economy: 1.0
    },
    sensitivity: {
      revenue: 1.0,
      spending: 1.0,
      deficit: 1.0
    },
    lastUpdate: Date.now()
  }),

  // Getters
  getters: {
    weightedSentiment: (state) => {
      const weights = {
        regions: 0.3,
        demographics: 0.3,
        sectors: 0.4
      };

      return (
        weights.regions * average(Object.values(state.regions)) +
        weights.demographics * average(Object.values(state.demographics)) +
        weights.sectors * average(Object.values(state.sectors))
      );
    }
  },

  // Actions
  actions: {
    updateSentiment(budgetData) {
      const impacts = this.calculateImpacts(budgetData);
      
      this.regions = this.updateRegionalSentiment(impacts);
      this.demographics = this.updateDemographicSentiment(impacts);
      this.sectors = this.updateSectorSentiment(impacts);
      
      this.overall = this.weightedSentiment;
      this.lastUpdate = Date.now();
    },

    calculateImpacts(budgetData) {
      return {
        revenue: this.calculateRevenueImpact(budgetData),
        spending: this.calculateSpendingImpact(budgetData),
        deficit: this.calculateDeficitImpact(budgetData)
      };
    }
  }
});
```

### Calculator State Management (`src/stores/calculator.js`)

#### State Structure
```javascript
export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    income: {
      annual: 0,
      type: 'employment',
      province: 'ontario'
    },
    deductions: {
      rrsp: 0,
      cpp: 0,
      ei: 0
    },
    credits: {
      basic: true,
      cpp: true,
      ei: true
    },
    taxBrackets: {
      federal: [],
      provincial: []
    },
    results: {
      grossIncome: 0,
      netIncome: 0,
      totalTax: 0,
      effectiveRate: 0,
      marginalRate: 0
    },
    year: 2024,
    lastUpdate: Date.now()
  }),

  // Getters
  getters: {
    taxableIncome: (state) => {
      return state.income.annual - 
             state.deductions.rrsp - 
             state.deductions.cpp - 
             state.deductions.ei;
    },

    netFederalTaxAnnual: (state) => {
      const fedTax = calculateBracketTax(
        state.taxableIncome,
        state.taxBrackets.federal
      );
      return Math.max(fedTax, 0);
    }
  },

  // Actions
  actions: {
    updateIncome(income) {
      this.income = {
        ...this.income,
        ...income
      };
      this.recalculateTax();
    },

    updateDeductions(deductions) {
      this.deductions = {
        ...this.deductions,
        ...deductions
      };
      this.recalculateTax();
    },

    recalculateTax() {
      const taxableIncome = this.taxableIncome;
      const federalTax = this.calculateFederalTax(taxableIncome);
      const provincialTax = this.calculateProvincialTax(taxableIncome);
      
      this.results = {
        grossIncome: this.income.annual,
        netIncome: this.income.annual - federalTax - provincialTax,
        totalTax: federalTax + provincialTax,
        effectiveRate: ((federalTax + provincialTax) / this.income.annual) * 100,
        marginalRate: this.calculateMarginalRate(taxableIncome)
      };
      
      this.lastUpdate = Date.now();
    }
  }
});
```

### State Synchronization Patterns

#### 1. Cross-Store Updates
```javascript
// In budget simulator store
updateCalculatorState() {
  const calculatorStore = useCalculatorStore();
  
  // Update tax rates
  calculatorStore.updateTaxRates(this.revenueSources);
  
  // Update year
  calculatorStore.updateYear(this.currentYear);
  
  // Recalculate taxes
  calculatorStore.recalculateTax();
}

// In calculator store
updateTaxRates(rates) {
  // Update tax brackets based on new rates
  this.taxBrackets = this.calculateTaxBrackets(rates);
  
  // Update effective rates
  this.effectiveRates = this.calculateEffectiveRates(rates);
  
  // Recalculate taxes for current income
  this.recalculateTax();
}
```

#### 2. Reactive Updates
```