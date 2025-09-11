# Component Import Guide

## 🎯 Overview

The budget components have been organized into logical directories with index files that provide clean, organized import patterns while maintaining full backward compatibility.

## 📁 Directory Organization

### **panels/** - Main Content Panels
Components that represent main application screens or content areas.

```javascript
// Available components
import { 
  AssumptionsPanel,
  BudgetChartsPanel,
  BudgetExportPanel,
  BudgetResultsPanel,
  BudgetRevenuePanel,
  ProjectionsPanelLite,
  SpendingPanel
} from '@/domains/budget/components/panels';
```

### **controls/** - Interactive Input Components
Form controls, sliders, and interactive input elements.

```javascript
// Available components
import { 
  BudgetRevenueSliders,
  BudgetSpendingControls,
  BudgetYearSelector,
  CategoryGroup,
  PercentageInput,
  SpendingCategory
} from '@/domains/budget/components/controls';
```

### **overlays/** - Modal and Floating Components
Banners, modals, docks, and floating UI elements.

```javascript
// Available components
import { 
  BudgetChangesBanner,
  FiscalChaosAlert,
  MultiYearDock,
  MultiYearItemPlanModal,
  MultiYearPlanner,
  SharedBudgetDetailModal
} from '@/domains/budget/components/overlays';
```

### **widgets/** - Reusable Display Components
Information displays, cards, and reusable UI widgets.

```javascript
// Available components
import { 
  BudgetCategoryInfo,
  BudgetResults,
  ExportCard,
  GoalTracker,
  ItemsPlanList
} from '@/domains/budget/components/widgets';
```

### **layout/** - Navigation and Container Components
Panel hosts, navigation banners, and layout management.

```javascript
// Available components
import { 
  BudgetPanelBanner,
  BudgetPanelHost,
  PanelBanner,      // Legacy
  PanelHost         // Legacy
} from '@/domains/budget/components/layout';
```

### **charts/** - Data Visualization Components
Charts, graphs, and data visualization components.

```javascript
// Available components
import { 
  ChartsPanel,
  MultiYearProjectionsPanel,
  SpendingPieChart
} from '@/domains/budget/components/charts';
```

## 🔄 Migration Patterns

### **Old vs New Import Patterns**

#### **Single Component Import**
```javascript
// ❌ Old approach (still works)
import BudgetRevenuePanel from '@/domains/budget/components/BudgetRevenuePanel.vue';
import BudgetRevenueSliders from '@/domains/budget/components/BudgetRevenueSliders.vue';
import BudgetChangesBanner from '@/domains/budget/components/BudgetChangesBanner.vue';

// ✅ New organized approach
import { BudgetRevenuePanel } from '@/domains/budget/components/panels';
import { BudgetRevenueSliders } from '@/domains/budget/components/controls';
import { BudgetChangesBanner } from '@/domains/budget/components/overlays';
```

#### **Multiple Component Import**
```javascript
// ❌ Old approach (verbose)
import BudgetRevenuePanel from '@/domains/budget/components/BudgetRevenuePanel.vue';
import SpendingPanel from '@/domains/budget/components/SpendingPanel.vue';
import ProjectionsPanelLite from '@/domains/budget/components/ProjectionsPanelLite.vue';

// ✅ New organized approach (clean)
import { 
  BudgetRevenuePanel, 
  SpendingPanel, 
  ProjectionsPanelLite 
} from '@/domains/budget/components/panels';
```

#### **Mixed Category Imports**
```javascript
// ❌ Old approach (scattered)
import BudgetRevenuePanel from '@/domains/budget/components/BudgetRevenuePanel.vue';
import BudgetRevenueSliders from '@/domains/budget/components/BudgetRevenueSliders.vue';
import BudgetChangesBanner from '@/domains/budget/components/BudgetChangesBanner.vue';
import GoalTracker from '@/domains/budget/components/GoalTracker.vue';

// ✅ New organized approach (grouped by purpose)
import { BudgetRevenuePanel } from '@/domains/budget/components/panels';
import { BudgetRevenueSliders } from '@/domains/budget/components/controls';
import { BudgetChangesBanner } from '@/domains/budget/components/overlays';
import { GoalTracker } from '@/domains/budget/components/widgets';
```

## 🚀 Best Practices

### **1. Group Related Imports**
```javascript
// ✅ Good - Group by category
import { BudgetRevenuePanel, SpendingPanel } from '@/domains/budget/components/panels';
import { BudgetRevenueSliders, CategoryGroup } from '@/domains/budget/components/controls';
import { BudgetChangesBanner } from '@/domains/budget/components/overlays';
```

### **2. Use Descriptive Import Names**
```javascript
// ✅ Good - Clear purpose
import { BudgetRevenuePanel as RevenuePanel } from '@/domains/budget/components/panels';
import { BudgetRevenueSliders as RevenueControls } from '@/domains/budget/components/controls';
```

### **3. Consistent Import Style**
```javascript
// ✅ Good - Consistent destructuring
import { ComponentA, ComponentB } from '@/domains/budget/components/panels';
import { ControlA, ControlB } from '@/domains/budget/components/controls';

// ❌ Avoid mixing styles in same file
import { ComponentA } from '@/domains/budget/components/panels';
import ControlA from '@/domains/budget/components/ControlA.vue';
```

## 🛠️ Development Workflow

### **Adding New Components**

1. **Create the component** in the appropriate directory
2. **Add export** to the relevant `index.js` file
3. **Use organized imports** in consuming files

```javascript
// Example: Adding a new control component

// 1. Create: src/domains/budget/components/TaxRateSlider.vue
// 2. Add to: src/domains/budget/components/controls/index.js
export { default as TaxRateSlider } from '../TaxRateSlider.vue';

// 3. Use organized import
import { TaxRateSlider } from '@/domains/budget/components/controls';
```

### **Finding Components**

Use the directory structure to quickly locate components by purpose:
- **Need a form control?** → Look in `controls/`
- **Need a modal or banner?** → Look in `overlays/`
- **Need a data display?** → Look in `widgets/`
- **Need a chart?** → Look in `charts/`
- **Need a main panel?** → Look in `panels/`

## 🔧 Migration Strategy

### **Gradual Migration (Recommended)**
1. **Keep existing imports working** (they still work!)
2. **Update imports** when you're already editing a file
3. **Use new pattern** for all new code
4. **No rush** - migrate at your own pace

### **File-by-File Migration**
```javascript
// Before
import BudgetRevenuePanel from '@/domains/budget/components/BudgetRevenuePanel.vue';
import BudgetRevenueSliders from '@/domains/budget/components/BudgetRevenueSliders.vue';

// After
import { BudgetRevenuePanel } from '@/domains/budget/components/panels';
import { BudgetRevenueSliders } from '@/domains/budget/components/controls';
```

## 📋 Quick Reference

| Component Type | Directory | Purpose |
|---|---|---|
| **Panels** | `panels/` | Main content areas, application screens |
| **Controls** | `controls/` | Form inputs, sliders, interactive elements |
| **Overlays** | `overlays/` | Modals, banners, floating components |
| **Widgets** | `widgets/` | Display components, cards, summaries |
| **Layout** | `layout/` | Navigation, containers, hosts |
| **Charts** | `charts/` | Data visualization, graphs |

## ✅ Benefits

- **🎯 Clear Purpose** - Easy to find components by their role
- **🚀 Better DX** - Reduced cognitive load when importing
- **📦 Clean Imports** - Group related components together
- **🔄 Backward Compatible** - Existing code continues to work
- **📈 Scalable** - Easy to add new components to appropriate categories
- **🛠️ Maintainable** - Logical organization improves long-term maintenance




