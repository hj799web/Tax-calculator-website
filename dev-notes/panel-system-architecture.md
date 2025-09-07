# Panel System Architecture

## 🎯 Overview

The panel system replaces the traditional scrolling layout with a modern, tabbed interface that provides focused, professional user experience matching enterprise financial software patterns.

## 🏗️ Core Architecture

### **Component Hierarchy**
```
PanelHost.vue (Main Container)
├── PanelBanner.vue (Navigation Tabs)
├── panels/
│   ├── OverviewPanel.vue
│   ├── ResultsPanel.vue
│   ├── RevenuePanel.vue
│   ├── SpendingPanel.vue
│   ├── AnalysisPanel.vue
│   ├── GoalsPanel.vue
│   ├── PresetsPanel.vue
│   ├── SentimentPanel.vue
│   └── ExportPanel.vue
└── Mobile Overlay System (≤1024px)
    ├── MobileDockBar.vue (Bottom dock with changes button)
    ├── MobileBottomSheet.vue (Modal sheet for budget changes)
    └── useMobileDock.js (Shared state composable)
```

### **Feature Flag Control**
```javascript
// src/features.js
export const FEATURES = {
  PANEL_NAV: true  // Enable panel-based navigation
};
```

**Rollback Safety**: Set `PANEL_NAV: false` to instantly revert to original scrolling layout.

## 🎨 Panel Design System

### **Tab Order & Mental Model**
Following natural user workflow:

1. **Overview** - Quick KPIs and summary (landing page)
2. **Results** - Current budget totals and performance
3. **Revenue** - Tax rates and revenue source controls  
4. **Spending** - Government program allocation
5. **Analysis** - Charts, projections, and detailed analysis
6. **Sentiment** - Public opinion modeling and impacts
7. **Export** - Download reports and share functionality

### **Navigation Features**
- **Keyboard Navigation**: Arrow keys switch tabs, Enter/Space activate
- **Deep Linking**: URL updates with `?panel=revenue` for sharing
- **Preloading**: Hover on tabs preloads next panel for smooth transitions
- **Mobile Responsive**: Horizontal scroll with snap points

## 🔧 Implementation Details

### **PanelHost.vue Structure**
```vue
<template>
  <div class="panel-host">
    <PanelBanner v-model="currentPanel" :panels="panelDefs" />
    <div class="panel-content">
      <KeepAlive>
        <component :is="currentComp" :key="currentPanel" />
      </KeepAlive>
    </div>
  </div>
</template>
```

### **Panel Registration**
```javascript
const panelDefs = [
  { key: 'overview', label: 'Overview', icon: 'dashboard', comp: OverviewPanel },
  { key: 'results', label: 'Results', icon: 'analytics', comp: ResultsPanel },
  { key: 'revenue', label: 'Revenue', icon: 'payments', comp: RevenuePanel },
  // ... other panels
];
```

### **Lazy Loading**
```javascript
// Async component loading for performance
const RevenuePanel = defineAsyncComponent(() => import('./panels/RevenuePanel.vue'));
const SpendingPanel = defineAsyncComponent(() => import('./panels/SpendingPanel.vue'));
```

## 🎯 Panel Responsibilities

### **OverviewPanel.vue**
- **Purpose**: Landing page with key metrics
- **Content**: Budget summary, quick KPIs, recent changes
- **Actions**: Quick links to detailed panels

### **ResultsPanel.vue**  
- **Purpose**: Current budget performance
- **Content**: Total revenue/spending, deficit/surplus, debt ratios
- **Actions**: Goal tracking, performance indicators

### **RevenuePanel.vue**
- **Purpose**: Revenue source management
- **Content**: Tax rate sliders, revenue source controls
- **Actions**: Rate adjustments, tax expenditure impacts

### **SpendingPanel.vue**
- **Purpose**: Government spending allocation
- **Content**: Program categories, spending sliders
- **Actions**: Category adjustments, group resets

### **AnalysisPanel.vue**
- **Purpose**: Data visualization and projections
- **Content**: Charts, multi-year projections, trends
- **Actions**: Chart mode switching, data export

### **ProjectionsPanelLite.vue**
- **Purpose**: Multi‑year fiscal projections with interactive Chart.js visualizations
- **Content**: 
  - Multi‑series overview chart: Revenue, Program Spending, Interest, Deficit with full interactivity
  - Historical deficit chart: 20 years of data (2004‑05 to 2023‑24) continuous with projections
  - Debt‑to‑GDP mini‑chart: Enhanced SVG with gridlines and responsive scaling
- **Features**: 
  - Chart.js integration: Professional tooltips, smooth line interpolation, auto‑skipped labels
  - Historical data integration: Real fiscal data from Canadian government records
  - Responsive design: ResizeObserver with throttled updates, optimized chart sizing
  - Performance optimizations: RequestAnimationFrame scheduling, cleanup on unmount
- **Actions**: Interactive data exploration with hover tooltips and comprehensive fiscal analysis

### **SentimentPanel.vue**
- **Purpose**: Public opinion modeling
- **Content**: Sentiment radar, regional/demographic impacts
- **Actions**: Sensitivity adjustments, impact analysis

## 📱 Responsive Design

### **Desktop (>1024px)**
- Full panel interface with all features
- Separate floating overlays: `BudgetChangesBanner` (left) and `MultiYearDock` (right)
- Hover effects and preloading active

### **Mobile/Tablet (≤1024px)**
- **Unified bottom dock system** prevents overlay conflicts
- Desktop overlays hidden; replaced with coordinated mobile interface
- Bottom dock bar with single "Changes" button and change count badge
- Modal bottom sheet for budget changes only
- Multi‑year planning remains embedded within Projections panel
- Large touch targets (44px minimum)

### **Mobile Overlay Strategy**
The mobile system solves fixed positioning conflicts between multiple overlays:

**Problem**: `BudgetChangesBanner` and `MultiYearDock` both use fixed positioning, causing overlap and content obstruction on small screens.

**Solution**: Unified bottom dock interface with shared state management:
- `useMobileDock.js`: Composable tracking mobile state and changes visibility
- `MobileDockBar.vue`: Fixed bottom bar with single "Changes" button
- `MobileBottomSheet.vue`: Modal sheet for budget changes only
- Multi‑year planning kept within Projections panel for consistent UX across devices
- Breakpoint coordination at 1024px for consistent behavior

## 🎨 Styling System

### **Panel Banner**
```css
.panel-banner {
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}
```

### **Data Visualization Standards**
The projections system uses Chart.js for professional fiscal data presentation:

**Chart.js Implementation**:
- **Multi‑series overview**: Revenue, Program Spending, Interest, Deficit with comprehensive tooltips
- **Historical integration**: 20 years of Canadian fiscal data (2004‑05 to 2023‑24) seamlessly connected to projections
- **Professional styling**: Smooth monotone interpolation, responsive sizing, formatted axis labels ($123.4B)
- **Performance optimized**: Throttled resize handling, requestAnimationFrame scheduling, proper cleanup
- **Accessibility**: Keyboard navigation, screen reader compatible, larger hover hit areas

**Technical Architecture**:
- **Chart.js/vue‑chartjs**: Primary visualization library with full interactivity
- **ResizeObserver**: Responsive chart scaling with performance optimizations
- **Historical data**: Real government fiscal records integrated with projection algorithms
- **Responsive design**: Adaptive chart sizing with viewport‑aware height constraints
- **Error handling**: Robust cleanup, ESLint compliance, syntax error prevention

### **Tab States**
- **Default**: Subtle styling, clear labels
- **Active**: Bold text, colored underline, elevated appearance
- **Hover**: Light background, smooth transition
- **Focus**: High contrast outline for keyboard users

### **Panel Content**
- **Max Width**: 1100px centered
- **Padding**: 24px desktop, 16px mobile
- **Spacing**: Consistent 16-24px between sections

## ⚡ Performance Optimizations

### **Lazy Loading**
- Panels load only when first accessed
- Preloading on hover for smooth transitions
- Code splitting reduces initial bundle size

### **KeepAlive Caching**
- Panel state preserved when switching
- Form inputs maintain values
- Scroll positions remembered

### **Efficient Updates**
- Debounced state changes
- Minimal re-renders with computed properties
- Optimized component lifecycle

## 🔍 Accessibility Features

### **Keyboard Navigation**
- **Tab Order**: Logical progression through interface
- **Arrow Keys**: Switch between panels
- **Enter/Space**: Activate panels and controls
- **Escape**: Close modals and overlays

### **Screen Reader Support**
- **ARIA Roles**: `tablist`, `tab`, `tabpanel`
- **Labels**: Descriptive text for all interactive elements
- **Live Regions**: Announce dynamic content changes
- **Focus Management**: Clear focus indicators

### **Visual Accessibility**
- **Contrast**: >4.5:1 ratio for all text
- **Focus Indicators**: Visible outlines on interactive elements
- **Font Sizes**: 14-16px base with scalable typography
- **Color Independence**: Information not conveyed by color alone

## 🧪 Testing Strategy

### **Unit Tests**
```javascript
// Panel navigation
describe('PanelHost', () => {
  it('should switch panels on tab click', () => {
    // Test implementation
  });
  
  it('should update URL with panel query param', () => {
    // Test implementation  
  });
});
```

### **Integration Tests**
- Panel state preservation with KeepAlive
- URL routing and deep linking
- Keyboard navigation flows

### **Accessibility Tests**
- Screen reader compatibility
- Keyboard-only navigation
- Focus management verification

## 💡 Benefits Achieved

### **User Experience**
- **Focused Interface**: One task per screen eliminates cognitive overload
- **Professional Feel**: Matches enterprise software expectations
- **Better Performance**: Lazy loading and caching improve responsiveness
- **Mobile Friendly**: Responsive design works across all devices

### **Developer Experience**
- **Modular Architecture**: Easy to add/remove panels
- **Clear Boundaries**: Well-defined component responsibilities
- **Testable**: Isolated components enable focused testing
- **Maintainable**: Feature flags allow safe updates

### **Business Value**
- **Higher Engagement**: Focused interface reduces bounce rates
- **Better Accessibility**: Compliant with modern web standards
- **Future Ready**: Extensible architecture for new features
- **Professional Image**: Enterprise-grade user experience

---

*The panel system transforms the budget simulator from a traditional web form into a professional fiscal planning platform while maintaining full backward compatibility and accessibility compliance.*
