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
- Dual auto-balance integration (simple + goal-based)

### Auto-Balance System
```javascript
// Dual auto-balance system implemented
autoBalanceActive: false,        // Goal-based auto-balance
simpleAutoBalanceActive: false,  // Simple auto-balance (eliminate deficit)
autoBalanceConfig: {
  revenueToSpendingRatio: 0.5,
  minSpendingFactor: 0.1,
  maxSpendingFactor: 2.0,
  prioritizePIT: true
}
```
Features:
- **Simple Auto-Balance**: Direct deficit elimination without goals
- **Goal-Based Auto-Balance**: Balance to specific revenue/deficit targets
- Intelligent revenue source prioritization
- Automatic triggering on spending changes

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
activePreset: null,
updateBadges() {
  // Updates achievements based on budget performance
  // Includes preset-specific badges and tier system
}
```
Key points:
- **Achievement System**: Comprehensive badge system with tiers (Bronze, Silver, Gold, Platinum)
- **Preset Badges**: Special badges for applying budget presets
- **Performance Tracking**: Fiscal responsibility, efficiency, and goal achievement
- **Real-time Updates**: Badge calculations triggered by budget changes

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

## File Structure (Domain-Driven Design)

```
src/
├── domains/
│   ├── budget/
│   │   ├── components/
│   │   │   ├── BudgetResults.vue
│   │   │   ├── ChartsPanel.vue (lazy loaded)
│   │   │   ├── GoalTracker.vue
│   │   │   ├── RevenueSliders.vue
│   │   │   ├── SpendingControls.vue
│   │   │   ├── ExportPanel.vue
│   │   │   └── SharedBudgetDetailModal.vue
│   │   ├── store/
│   │   │   └── budgetSimulator.js
│   │   └── utils/
│   │       ├── sharedBudget.js
│   │       └── generateExportPDF.js
│   ├── calculator/
│   │   ├── components/
│   │   │   ├── PresetSelector.vue
│   │   │   ├── SalaryRateSelector.vue
│   │   │   └── IncomeInput.vue
│   │   └── store/
│   │       └── calculator.js
│   ├── sentiment/
│   │   ├── components/
│   │   │   ├── SentimentSensitivityControl.vue
│   │   │   ├── CollapsibleSentimentBanner.vue
│   │   │   └── RadarSentiment.vue (lazy loaded)
│   │   ├── config/
│   │   │   ├── sentimentConfig.js
│   │   │   └── entityImpactFactors.js
│   │   └── utils/
│   │       └── computeSentimentScores.js
│   ├── badges/
│   │   ├── components/
│   │   │   ├── AchievementBadge.vue
│   │   │   └── BadgeGalleryModal.vue (lazy loaded)
│   │   ├── config/
│   │   │   └── badgeConfig.js
│   │   └── utils/
│   │       └── generateBadgesFromBudget.js
│   └── social/
│       ├── components/
│       │   ├── SocialShareModal.vue (lazy loaded)
│       │   └── PartyBudgetSharing.vue
│       └── utils/
│           └── socialSharing.js
├── components/ (shared)
│   ├── MainNavigation.vue
│   └── OnboardingTour.vue
├── utils/ (shared)
│   ├── analytics.js
│   ├── bannerGrouping.js
│   └── errorHandler.js
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

### i18n System (`src/i18n/index.js`)

#### Local i18n Module
The application uses a custom, dependency-free i18n utility instead of vue-i18n:

```javascript
// Local i18n implementation
export function useI18n() {
  return {
    t: (key, params = {}) => {
      // Key lookup with parameter interpolation
      const message = getMessage(key, currentLocale.value);
      return interpolate(message, params);
    },
    locale: currentLocale
  };
}

// Plugin interface for Vue app
export default {
  install(app) {
    app.config.globalProperties.$t = (key, params) => t(key, params);
    app.provide('i18n', { t, locale: currentLocale });
  }
};
```

#### Features
- **Dependency-Free**: No external vue-i18n dependency
- **LocalStorage Integration**: Persists locale selection across sessions
- **Parameter Interpolation**: Supports `{param}` syntax for dynamic content
- **Fallback System**: Falls back to EN if translation key not found
- **Mojibake Fix**: Special handling for French language labels

#### Translation Structure
```javascript
// EN translations
{
  "simulator": {
    "header": {
      "title": "Budget Simulator",
      "subtitle": "Experience fiscal planning"
    },
    "nav": {
      "overview": "Overview",
      "results": "Results"
    },
    "sections": {
      "revenue": { "title": "Revenue Sources" },
      "spending": { "title": "Spending Categories" }
    }
  }
}
```

#### Component Integration
```javascript
// In components
import { useI18n } from '@/i18n'

const { t } = useI18n()

// Usage
const title = t('simulator.header.title')
const description = t('simulator.description.intro', { year: 2024 })
``` 