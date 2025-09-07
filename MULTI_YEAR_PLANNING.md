# Multi-Year Fiscal Planning Feature

## 🎯 Overview

Transform the budget simulator into a comprehensive fiscal planning tool with multi-year projections, scenario management, and professional panel-based interface.

## 🎨 Key Design Changes

### **1. Panel-Based Navigation** 
Replace scrolling layout with professional tabbed interface:

```
Overview → Results → Revenue → Spending → Analysis → Sentiment → Export
```

**Benefits:**
- Eliminates scroll fatigue
- Matches enterprise software patterns  
- Better focus on individual tasks
- Deep linkable (`?panel=revenue`)

### **2. User-Configurable Parameters**
Following [Finances of the Nation](https://financesofthenation.ca/fiscal-gap-simulator/) approach:

**Economic Assumptions (User Sets):**
- GDP Growth Rate (default: 2.0%)
- Inflation Rate (default: 2.0%) 
- Interest Rate (default: 3.5%)
- Population Growth (default: 0.9%)

**Planning Options:**
- 5-10 year horizon
- Per-item planning (revenue rates, spending factors)
- Scenario save/load/compare

### **3. Right-Side Multi-Year Dock**
Persistent, collapsible panel for quick planning access:

- **Preview Mode**: See planned values without applying
- **Apply Workflow**: "Apply Preview Year" updates current budget
- **Live Sync**: Optional real-time application (debounced)
- **Mobile**: Converts to bottom sheet

## 🏗️ Technical Implementation

### **Core Architecture**

**Non-Breaking Extensions:**
```javascript
// Existing budget store remains unchanged
// Multi-year data stored in parallel

multiYearSettings: {
  economicAssumptions: { gdpGrowthRate: 2.0, ... },
  multiYearPlans: {
    revenue: { personalIncomeTax: { mode: 'rule', startRate: 21, annualDelta: 0.5 } },
    spending: { healthCare: { points: { 2025: 1.1, 2026: 1.15 } } }
  }
}
```

**Safe Application:**
```javascript
// Batch updates prevent UI choppiness
applyPlanForYear(year) {
  budgetStore.startBatchUpdate();
  // Apply all changes
  budgetStore.endBatchUpdate(); // Single recalc
}
```

### **Panel System**

**Feature Flag Control:**
```javascript
// src/features.js
PANEL_NAV: true,           // Enable panel interface
MULTI_YEAR_PLANNING: true // Enable multi-year dock
```

**Component Structure:**
```
PanelHost.vue
├── PanelBanner.vue (tabbed navigation)
└── panels/
    ├── OverviewPanel.vue
    ├── ResultsPanel.vue  
    ├── RevenuePanel.vue
    ├── SpendingPanel.vue
    └── AnalysisPanel.vue
```

## 🔧 Implementation Phases

### **Phase 1: Panel Foundation** ✅
- [x] Feature flags and safety rollback
- [x] Panel host with tabbed navigation
- [x] Core panel components (Results, Revenue, Spending)
- [x] URL routing and deep linking

### **Phase 2: Multi-Year Integration** 🔄
- [ ] Multi-year settings store
- [ ] Projection calculations
- [ ] Right-side dock component
- [ ] Preview/Apply workflow
- [ ] Per-item planning modals

### **Phase 3: Advanced Features** ⏳
- [ ] Scenario management
- [ ] Economic assumptions panel
- [ ] Export functionality
- [ ] Performance optimizations

## 🎛️ User Experience

### **Panel Navigation**
- **Keyboard**: Arrow keys to switch tabs, Enter/Space to activate
- **Mouse**: Click tabs, hover to preload next panel
- **Mobile**: Horizontal scroll with snap points

### **Multi-Year Planning Workflow**
1. **Set Assumptions**: Configure economic parameters
2. **Plan Items**: Set per-item multi-year targets  
3. **Preview**: Select year to see projected values
4. **Apply**: Update current budget with planned values
5. **Compare**: Save scenarios and compare outcomes

### **Responsive Design**
- **Desktop**: Full panel interface + right dock
- **Tablet**: Stacked panels + collapsible dock
- **Mobile**: Bottom tabs + bottom sheet dock

## 🔍 Key Benefits

**For Users:**
- Professional fiscal planning experience
- Clear separation of concerns (revenue vs spending vs analysis)
- Multi-year scenario planning capabilities
- No need to scroll through long forms

**For Developers:**
- Non-breaking implementation (existing code unchanged)
- Modular panel system (easy to add/remove features)
- Feature flag control (gradual rollout)
- Performance optimized (lazy loading, memoization)

**For Maintainability:**
- Clear component boundaries
- Testable in isolation
- Documented state management patterns
- Accessibility compliance built-in

## 🚀 Quick Start

**Enable Panel Interface:**
```javascript
// src/features.js
export const FEATURES = {
  PANEL_NAV: true  // Switch to panel-based layout
};
```

**Enable Multi-Year Planning:**
```javascript
// src/features.js  
export const FEATURES = {
  MULTI_YEAR_PLANNING: true  // Add multi-year dock
};
```

**Rollback Safety:**
Set either flag to `false` to instantly revert to original layout.

---

*This feature transforms the budget simulator from a single-year tool into a comprehensive fiscal planning platform while maintaining full backward compatibility and professional user experience standards.*

