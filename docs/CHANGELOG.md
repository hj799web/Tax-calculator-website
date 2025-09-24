# Changelog

This project is actively evolving. This log highlights user‑visible and developer‑relevant changes made during the tab UX and onboarding overhaul.

## 2025‑01‑21 – Quebec Tax Calculation Enhancements

- **Quebec Abatement Implementation**: Added 16.5% federal tax reduction for Quebec residents
  - Quebec residents now receive a 16.5% reduction on their federal basic tax
  - This reflects Quebec's unique tax administration system
  - Significant tax savings for Quebec residents (typically $1,500-2,000+ for higher incomes)

- **Quebec Tax Brackets Correction**: Updated to official 2024 Revenu Québec rates
  - Corrected Quebec tax brackets: 15%, 20%, 24%, 25.75% with proper thresholds
  - Updated brackets: 15% up to $51,780, 20% to $103,545, 24% to $126,000, 25.75% above
  - Replaced incorrect 2024 brackets that were using outdated rates

- **QPIP Integration**: Added mandatory Quebec Parental Insurance Plan
  - 0.494% rate on income up to $91,000
  - Maximum annual contribution: $449
  - Mandatory for all Quebec residents with employment income
  - Included in total tax calculations for Quebec residents

- **Quebec-Specific Contribution Rates**: Implemented accurate Quebec rates
  - Quebec EI rate: 1.32% (vs 1.63% federal rate) with $63,200 max insurable earnings
  - Quebec QPP rate: 6.4% (vs 5.7% CPP) with $3,500 basic exemption
  - Maximum QPP contribution: $4,160 annually
  - Self-employed QPP rate: 12.8% (vs 11.4% CPP)

- **Enhanced Basic Personal Amount**: Updated Quebec BPA to $18,000
  - Higher than most provinces (vs $15,705 federal)
  - Provides additional tax relief for Quebec residents
  - Updated in all tax calculations and documentation

- **Comprehensive Documentation Updates**: Added detailed Quebec-specific features
  - New "Quebec-Specific Tax Features" section in all documentation
  - Updated tax calculation process to include Quebec abatement and QPIP
  - Bilingual support with complete French translations
  - Updated README.md and CHANGELOG.md with Quebec enhancements

- **Technical Implementation**: Robust Quebec tax calculation system
  - Added `calculateQuebecAbatement()`, `calculateQpipContribution()`, `calculateQppContribution()` functions
  - Updated `calculateEiPremium()` to handle Quebec-specific rates
  - Integrated Quebec calculations into main calculator store
  - Added QPIP to total tax calculations and percentage breakdowns

## 2025‑01‑21 – Chart Translation and Localization Enhancement

- **Federal Budget Chart Translation**: Complete translation of chart visualizations
  - Translated all chart titles, legends, and category labels in Federal Budget Allocation and Budget Visualizations sections
  - Added comprehensive translation keys for budget categories across 2022 and 2024 fiscal years
  - Updated three main chart components: `FederalBudgetPieChart.vue`, `Budget2024PieChart.vue`, `FederalBudget2024PieChart.vue`
  - Implemented dynamic translation system with `getCategoryTranslation()` helper functions
  - Chart content now automatically updates when users switch between English and French

- **Translation Key Architecture**: Organized translation structure
  - Added `federalBudget.categories.y2022` and `federalBudget.categories.y2024` sections to both language files
  - Standardized budget category names across all chart visualizations
  - Consistent terminology for healthcare, defense, social programs, and government operations
  - Proper French typography with accents and cultural adaptations

- **Chart Component Updates**: Enhanced chart components with i18n support
  - Added `useI18n` imports and translation logic to all chart components
  - Updated chart data computation to use translated category names
  - Chart titles now use `federalBudget.descriptions` translation keys
  - Dataset labels use `federalBudget.title` for consistency
  - Tooltips display translated category names for better user experience

- **Technical Improvements**: Code quality and maintainability
  - Removed unused `useYearStore` import from `Budget2024PieChart.vue` to fix ESLint errors
  - Clean separation of translation logic with helper functions
  - Future-proof structure for adding new budget categories
  - Consistent error handling with fallback to original category names

## 2025‑01‑21 – Comprehensive Localization and Welcome Page Conversion

- **Welcome Page Conversion**: Complete transformation of static HTML welcome pages
  - Converted `docs/welcome.html` and `public/welcome.html` to Vue.js component `src/views/WelcomeView.vue`
  - Full i18n integration with seamless language switching
  - Preserved all original styling, animations, and glassmorphism effects
  - Added navigation banner identical to main application
  - Responsive design with mobile optimization and touch-friendly interactions

- **Comprehensive Localization**: Complete bilingual support implementation
  - Added French translations for all calculator components, results, FAQs, and budget categories
  - Localized hardcoded strings in `FederalBudgetView.vue`, `BudgetCategoriesView.vue`, `ResultView.vue`
  - Updated Pinia stores (`calculator.js`, `year.js`) to support dynamic translations
  - Enhanced `TaxPieChart.vue` and `FAQSection.vue` with translation keys
  - Added loading and error message translations for lazy-loaded components

- **Translation Architecture**: Robust i18n system implementation
  - Created comprehensive translation keys in `en.json` and `fr.json`
  - Added `welcome` section with meta, header, nav, features, about, faq, simulator, and footer subsections
  - Implemented helper functions for dynamic category name translation
  - Added year-specific FAQ handling with conditional rendering
  - Proper French typography with accents and cultural adaptations

- **User Experience Enhancements**: Seamless language switching and navigation
  - Language preference persistence using localStorage
  - Global language switching affects entire application
  - Identical navigation experience across all pages
  - Mobile-responsive language switcher with proper touch targets
  - Accessibility improvements with ARIA labels and keyboard navigation

- **Technical Improvements**: Performance and maintainability optimizations
  - Fixed CSS syntax errors and improved code structure
  - Proper asset handling for background images and logos
  - Computed properties for efficient reactive translations
  - Hardware-accelerated 3D transform effects with reduced motion support
  - Clean separation of concerns with scoped component styles

## 2025‑01‑20 – Tax Breakdown Popup Federal Tax Integration + i18n Refactoring

- **Federal Tax-Based Popup Triggering**: Enhanced popup logic for better user experience
  - Popup now wired to `netFederalTaxAnnual` instead of raw income amount
  - Listens for tax/region changes and fires on any computed federal tax amount change
  - Removed session-based suppression - popup appears on every federal tax change
  - Still respects permanent "don't show again" user preference

- **Enhanced Popup Content**: Tax-focused dynamic content and messaging
  - Dynamic tags, titles, and descriptions now speak in terms of calculated federal tax
  - Annual federal tax amount formatted and displayed from new `taxAmount` prop
  - Tab "chips" include refreshed copy focused on tax implications and breakdowns
  - Content adapts based on actual tax calculations rather than income input

- **Improved User Experience**: More responsive and contextually relevant notifications
  - Popup triggers whenever federal tax amount changes (income, province, deductions, etc.)
  - Cross-tab navigation and analytics remain synchronized with new behavior
  - `popup_clicked` analytics event records which destination tab was selected
  - Better alignment between popup content and actual tax calculations

- **i18n Refactoring**: Replaced vue-i18n with local lightweight module
  - **Local i18n Module**: Created dependency-free i18n utility (`src/i18n/index.js`)
  - **Plugin Interface**: Maintains `app.use(i18n)` compatibility with `useI18n()` hook
  - **LocalStorage Integration**: Reads/writes locale from localStorage with EN fallback
  - **Key Lookup & Interpolation**: Supports simple key lookup with `{param}` interpolation
  - **Mojibake Fix**: Added override for French language label correction
  - **Import Updates**: Switched all components from `vue-i18n` to `@/i18n` imports
  - **ESLint Suppression**: Added per-file `/* eslint-disable */` to silence warnings
  - **Simulator i18n Wiring**: Main header, navigation, and section titles now use `t(...)`
  - **Translation Keys**: Added full simulator namespace for both EN and FR languages

## 2025‑09‑05 – Panel tabs + Onboarding overhaul

- Navigation tabs
  - Introduced grouped tabs in the budget simulator: `core`, `adjust`, `insights`, `planning`, `share`.
  - Simplified labels ("Revenue", "Spending", "Results", etc.).
  - Panel bar supports multi‑row wrapping, compact mode (icon‑only with tooltips), and a mobile "More" collapse.
  - Pinned tabs: `revenue` and `spending` are surfaced first; can be expanded later to user‑selectable pins.

## 2025‑01‑15 – Calculator Tab System Implementation

- **Tab-based navigation system**
  - Implemented shared `TabsComponent` with full accessibility compliance (WCAG 2.1 AA)
  - Added keyboard navigation (arrow keys, home, end, enter, space) with proper ARIA relationships
  - Created pill-style tab bar with backdrop blur and dark mode support
  - Mobile-optimized with horizontal scrolling and responsive design

- **Calculator content reorganization**
  - Wrapped calculator content in tab host for better content organization
  - Calculator and Results now share the same panel for improved UX
  - Global year/salary selectors remain above tabs as universal controls
  - Added auto-expansion for Categories and FAQs sections when first viewed

- **Tab configuration**
  - Calculator: Combined calculator and results in single panel
  - Budget Breakdown: How-it-works content
  - Categories: Budget categories section
  - FAQs: Frequently asked questions
  - Resources: Additional resources and documentation

- **Accessibility improvements**
  - Proper `role="tablist"` and `aria-controls` attributes
  - Focus management and screen reader support
  - Unique IDs for all interactive elements
  - Maintains focus order and keyboard navigation consistency

## 2025‑01‑15 – Mobile optimization + UI scaling + Data attribution

- **Data source attribution**
  - Added data source footnote to budget simulator description: "*The Budget Simulator uses approximate federal budget data from Public Accounts of Canada and Budget 2024 documents."
  - Positioned within the main description paragraph for better visibility and context.

- **Mobile UX overhaul**
  - **Removed global scaling hack**: Eliminated the `transform: scale(0.9)` on `#app` in mobile media queries to prevent blurry text and mismatched touch targets.
  - **Enhanced panel navigation**: Broadened mobile detection from ≤640px to ≤768px; added horizontal scroll for tab overflow with `-webkit-overflow-scrolling: touch`.
  - **Bottom spacing protection**: Added `padding-bottom: calc(env(safe-area-inset-bottom) + 72px)` to prevent MobileDockBar/BottomSheet from covering content.
  - **Touch accessibility**: Ensured minimum 44px touch targets for panel tabs on small screens.

- **Responsive typography**
  - **Fluid text scaling**: Implemented `clamp()` for smooth font-size scaling across all viewport widths:
    - Main titles: `clamp(1.2rem, 2.2vw + 0.8rem, 1.75rem)`
    - Section headings: `clamp(1rem, 1.25vw + 0.85rem, 1.35rem)`
    - Body text: `clamp(0.9rem, 0.5vw + 0.85rem, 1rem)`
    - Tab labels: `clamp(0.78rem, 0.6rem + 0.4vw, 0.9rem)`
  - **Applied across views**: Calculator, Results, Federal Budget, Budget Categories, How It Works, and both simulator views.

- **Chart responsiveness**
  - **Fluid chart containers**: Replaced fixed pixel heights with `clamp()` for responsive scaling.
  - **Legend optimization**: Chart legends use fluid font sizing and improved line-height for readability.
  - **Touch-friendly interactions**: Enhanced hover states and touch targets for mobile chart interactions.

- **Compact mobile layouts**
  - **Tighter spacing**: Added `@media (max-width: 480px)` rules for ultra-compact layouts:
    - Reduced grid gaps, card padding, and margins
    - Smaller button sizes and input padding
    - Single-column layouts where appropriate
  - **Input optimization**: Full-width selects and improved form layouts on narrow screens.

- **UI scaling implementation**
  - **20% downscale**: Applied `transform: scale(0.8)` with `transform-origin: top center` to:
    - Tax calculator page (`CalculatorView.vue`)
    - Budget simulator pages (`FinanceMinisterSimulator.vue`, `ModularFinanceMinisterSimulator.vue`)
  - **Consistent scaling**: Maintains visual hierarchy while reducing overall footprint across desktop and mobile.

- Components (names and shims)
  - New: `BudgetExportPanel.vue`, `BudgetSpendingControls.vue`, `BudgetCategoryInfo.vue`.
  - Aliases for consistency and grouping: `BudgetRevenuePanel.vue`, `BudgetResultsPanel.vue`, `BudgetYearSelector.vue`, `BudgetPanelHost.vue`, `BudgetPanelBanner.vue`, `BudgetChartsPanel.vue`, `BudgetRevenueSliders.vue`.
  - Compatibility shim: `RevenuePanel.vue` now forwards to `BudgetRevenuePanel.vue`.

- Panel host and banner
  - `PanelHost.vue` defines `panelDefs` with `group` and concise `label`.
  - `PanelBanner.vue` now accepts `pinnedKeys` and `compact` props; renders groups with lightweight headers and pill‑style tabs; exposes `data-panel-key` / `data-panel-group` for tours.

- Onboarding tour
  - Uses Shepherd.js with a refocused, tab‑first tour.
  - Options dialog with "Quick" vs "Full" modes; localStorage gating (`fis.tour.prompted.v1`, `fis.tour.completed.v1`).
  - Strong spotlight: larger overlay opening, teal halo, pulsing ring, blurred outer mask; darker overlay with slight blur; black call‑to‑action buttons.
  - New reset button to replay the tour (bottom‑left, `restart_alt`).
  - Full mode now covers detailed sub‑areas in Revenue, Spending, Results, Analysis, Sentiment, Projections, and Export.
  - **Fix**: Corrected dim highlight issue by restoring Shepherd's true cut‑out effect—removed dark background from container, used box‑shadow on opening element for proper spotlight.

- Mobile overlay system
  - **Unified mobile UX**: Prevents banner overlap on small screens (≤1024px) with coordinated bottom dock interface.
  - **Components**: `MobileDockBar.vue` (fixed bottom bar with changes button), `MobileBottomSheet.vue` (modal sheet for budget changes), `useMobileDock.js` (shared state management).
  - **Responsive behavior**: Desktop shows separate overlays; mobile consolidates budget changes into single bottom sheet. Multi‑year planning remains embedded within Projections panel on all screen sizes.
  - **Integration**: `FinanceMinisterSimulator.vue` conditionally renders mobile vs desktop overlay systems based on viewport width.

- Enhanced projections visualization
  - **Interactive Chart.js charts**: Multi‑series overview chart (Revenue, Program Spending, Interest, Deficit) with tooltips and hover effects.
  - **Historical deficit integration**: Continuous deficit chart combining 20 years of historical data (2004‑05 to 2023‑24) with projections using Chart.js.
  - **Professional presentation**: Responsive chart sizing, formatted tooltips ($123.4B), smooth line interpolation, and comprehensive axis labeling.
  - **Enhanced mini‑charts**: Debt‑to‑GDP chart with axes, gridlines, tick labels, and responsive scaling via ResizeObserver.
  - **Improved UX**: Larger hit areas for tooltips, auto‑skipped axis labels to prevent crowding, and optimized performance with throttled resize handling.

- Tooling
  - `jsconfig.json`: explicit include/exclude; excludes temporary `_tmp_*.vue` artifacts.

See:
- `dev-notes/panel-system-architecture.md`
- `docs/internal/onboarding-tour.md`
