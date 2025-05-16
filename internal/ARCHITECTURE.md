# Tax Calculator & Budget Simulator Architecture

## 1. Core State Management & Data Flow

### Revenue Management System
```javascript
revenueSources: {
  personalIncomeTax: {
    rate: 21,
    base: 10,  // $10B per 1%
    amount: 210, // $210B
    rateByYear: { 2022: 20, 2023: 20.5, 2024: 21, ... }
  },
  corporateIncomeTax: { ... },
  gst: { ... },
  // Other revenue sources
}
```
Each revenue source has:
- Base rate and amount
- Year-specific rates
- Min/max rate constraints
- Linked expenditures
- Color coding for visualization

### Spending Management System
```javascript
spendingCategories: {
  mainCategories: { ... },
  governmentOperations: { ... },
  otherCategories: { ... }
}
```
Features:
- Hierarchical structure
- Group-based organization
- Spending factors for adjustments
- Base and adjusted amounts

### Budget Goals System
```javascript
budgetGoals: {
  enabled: boolean,
  targetRevenue: number,
  targetDeficit: number,
  status: { revenue: string, deficit: string }
}
```
Features:
- Revenue targets
- Deficit/surplus goals
- Goal status tracking
- Auto-balance integration

## 2. Domain Interactions

### Calculator → Budget Interaction
```javascript
// In calculator store
const netFederalTaxAnnual = computed(() => {
  // Tax calculations that feed into budget
  let fedTax = calculateBracketTax(fedTaxable, currentFederalTaxBrackets.value);
  return Math.max(fedTax, 0);
});
```
Key points:
- Tax calculations provide revenue projections
- Year-specific tax rates affect budget planning
- Tax expenditures impact revenue

### Budget → Sentiment Interaction
```javascript
// In budget simulator store
sentimentUpdateRequired: false,
lastSentimentUpdate: Date.now(),
```
Key points:
- Budget changes trigger sentiment updates
- Spending decisions affect public opinion
- Revenue changes impact different sectors

### Budget → Badges Interaction
```javascript
// In budget simulator store
badges: [],
lastBadgeUpdate: Date.now(),
updateBadges() {
  // Updates achievements based on budget performance
}
```
Key points:
- Budget performance unlocks achievements
- Fiscal goals trigger badge updates
- Spending efficiency tracked

## 3. Component Hierarchy & Data Flow

### Main Simulator Component
```javascript
// FinanceMinisterSimulator.vue
<template>
  <div class="finance-minister-simulator">
    <CollapsibleSentimentBanner />
    <div class="main-container">
      <GoalTracker />
      <BudgetResults />
      <RevenueSliders />
      <SpendingControls />
      <ChartsPanel />
      <SentimentSensitivityControl />
    </div>
  </div>
</template>
```
Features:
- Orchestrates all major components
- Manages state between components
- Handles user interactions

### Budget Control Components
```javascript
// RevenueSliders.vue
<template>
  <div class="revenue-controls">
    <RevenueSlider
      v-for="source in revenueSources"
      :key="source.id"
      :source="source"
      :auto-balance-active="autoBalanceActive"
    />
  </div>
</template>
```
Features:
- Revenue source controls
- Spending category controls
- Budget goal tracking

### Visualization Components
```javascript
// ChartsPanel.vue
<template>
  <div class="charts-container">
    <RevenueChart />
    <SpendingChart />
    <DeficitChart />
  </div>
</template>
```
Features:
- Budget visualization
- Sentiment radar
- Achievement badges

## 4. State Management & Updates

### Budget State
```javascript
// In budgetSimulator.js
const totalRevenue = computed(() => {
  return Object.values(revenueSources.value)
    .reduce((sum, source) => sum + source.amount, 0);
});
```
Features:
- Revenue calculations
- Spending tracking
- Deficit/surplus computation

### Sentiment State
```javascript
// In sentimentSettings.js
state: () => ({
  overall: 1.0,
  regions: 1.0,
  demographics: 1.0,
  sectors: 1.0
})
```
Features:
- Sensitivity settings
- Public opinion tracking
- Regional variations

### Calculator State
```javascript
// In calculator.js
const netFederalTaxAnnual = computed(() => {
  // Tax calculations
  return Math.max(fedTax, 0);
});
```
Features:
- Tax computations
- Income calculations
- Year-specific rates

## 5. Key Interactions & Dependencies

### Budget → Calculator
- Tax rates affect revenue
- Income changes impact budget
- Year selection affects both

### Budget → Sentiment
- Spending affects public opinion
- Revenue changes impact sectors
- Fiscal chaos triggers warnings

### Budget → Badges
- Performance unlocks achievements
- Goals trigger badge updates
- Efficiency tracked

## Architecture Benefits

This architecture ensures:
1. Clear separation of concerns
2. Efficient state management
3. Reactive updates
4. Modular component structure
5. Maintainable codebase

## File Structure

```
src/
├── domains/
│   ├── budget/
│   │   ├── components/
│   │   │   ├── BudgetResults.vue
│   │   │   ├── ChartsPanel.vue
│   │   │   ├── GoalTracker.vue
│   │   │   ├── RevenueSliders.vue
│   │   │   └── SpendingControls.vue
│   │   └── store/
│   │       └── budgetSimulator.js
│   ├── calculator/
│   │   ├── components/
│   │   │   ├── PresetSelector.vue
│   │   │   └── SalaryRateSelector.vue
│   │   └── store/
│   │       └── calculator.js
│   └── sentiment/
│       ├── components/
│       │   └── SentimentSensitivityControl.vue
│       └── store/
│           └── sentimentSettings.js
└── views/
    └── FinanceMinisterSimulator.vue
```

## Component Dependencies

### FinanceMinisterSimulator.vue
- Imports and uses all major components
- Manages global state
- Handles user interactions

### Budget Components
- RevenueSliders.vue: Revenue control
- SpendingControls.vue: Spending management
- GoalTracker.vue: Budget goal tracking
- ChartsPanel.vue: Data visualization

### Calculator Components
- PresetSelector.vue: Budget presets
- SalaryRateSelector.vue: Income input

### Sentiment Components
- SentimentSensitivityControl.vue: Public opinion settings
- CollapsibleSentimentBanner.vue: Sentiment display

## Store Dependencies

### budgetSimulator.js
- Manages budget state
- Handles revenue calculations
- Controls spending adjustments
- Tracks budget goals

### calculator.js
- Manages tax calculations
- Handles income computations
- Provides year-specific rates

### sentimentSettings.js
- Manages public opinion
- Controls sensitivity settings
- Tracks regional variations 