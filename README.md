# Canada Tax Calculator

A comprehensive tax calculation tool for Canadian taxpayers with government spending visualization and budget simulation capabilities.

## Features

- **Accurate Tax Calculations**: Federal and provincial tax calculations based on 2024 tax rates
- **Quebec-Specific Tax Features**: Complete Quebec tax calculations including abatement, QPIP, and Quebec-specific rates for EI and QPP
- **Government Spending Visualization**: See how your tax dollars are allocated across different categories
- **Budget Simulator**: Step into the shoes of Canada's Finance Minister
- **Bilingual Support**: Full English and French language support
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Recent Updates

### Quebec Tax Calculation Enhancements (2025-01-21)

- **Quebec Abatement Implementation**: Added 16.5% federal tax reduction for Quebec residents
- **Quebec Tax Brackets Update**: Corrected 2024 Quebec tax brackets to official Revenu Québec rates
- **QPIP Integration**: Added mandatory Quebec Parental Insurance Plan (0.494% rate)
- **Quebec-Specific Rates**: Implemented Quebec EI rate (1.32% vs 1.63% federal) and QPP rates (6.4% vs 5.7% CPP)
- **Enhanced Basic Personal Amount**: Updated Quebec BPA to $18,000 (higher than most provinces)
- **Comprehensive Documentation**: Added detailed Quebec-specific tax features section to all documentation
- **Bilingual Support**: Full French translations for all Quebec tax features

### Chart Translation and Localization Enhancement (2025-01-21)

- **Federal Budget Chart Translation**: Fully translated all chart titles, legends, and category labels in Federal Budget Allocation and Budget Visualizations sections
- **Comprehensive Category Translation**: Added translation keys for all budget categories across 2022 and 2024 fiscal years in both English and French
- **Chart Component Updates**: Updated three main chart components (FederalBudgetPieChart, Budget2024PieChart, FederalBudget2024PieChart) to use dynamic translation system
- **Dynamic Language Switching**: Chart content now automatically updates when users switch between English and French
- **Consistent Terminology**: Standardized budget category names across all chart visualizations
- **Translation Key Structure**: Implemented organized translation structure with `federalBudget.categories.y2022` and `federalBudget.categories.y2024` sections

### Localization and Welcome Page Conversion (2025-01-21)

- **Welcome Page Conversion**: Converted static HTML welcome pages to fully integrated Vue.js component with i18n support
- **Comprehensive Localization**: Added complete French translations for all calculator components, results, FAQs, and budget categories
- **Language Switching**: Implemented seamless language switching with persistence across all pages
- **Navigation Integration**: Added identical navigation banner to welcome page matching main application
- **Mobile Optimization**: Enhanced responsive design with touch-friendly interactions and proper scaling

For detailed documentation, see:
- `docs/LOCALIZATION_AND_WELCOME_PAGE_UPDATE.md`
- `docs/CHANGELOG.md`

## Recent UI/UX updates (2025 refresh)

The Budget Simulator received a navigation and onboarding overhaul:

- **Tax Breakdown Popup Enhancement** (2025-01-20): Full-width glassmorphism notification with animated orbit graphic, dynamic content based on federal tax calculations, and smart tab navigation with pulse highlights
- **i18n Refactoring** (2025-01-20): Replaced vue-i18n with local lightweight module, added simulator i18n wiring, and fixed ESLint issues
- Grouped tabs with simplified labels, compact mode, and pinned tabs
- Budget‑prefixed panels for consistent naming
- Refocused Shepherd tour with Quick/Full modes and a stronger spotlight
- Data source attribution for transparency and credibility

## Calculator Tab System (2025‑01‑15)

Implemented a comprehensive tab-based navigation system for the calculator:

- **Accessible tab component**: Full WCAG 2.1 AA compliance with keyboard navigation
- **Content organization**: Calculator and Results share a panel, other sections in separate tabs
- **Global controls**: Year/salary selectors remain above tabs as universal controls
- **Mobile optimization**: Horizontal scrolling tabs with responsive design
- **Dark mode support**: Pill-style design with backdrop blur and proper contrast

## Mobile optimization (2025‑01‑15)

Comprehensive mobile experience improvements:

- **Crisp mobile rendering**: Removed global scaling hacks for sharp text and accurate touch targets
- **Responsive typography**: Fluid `clamp()` scaling across all viewport widths
- **Enhanced navigation**: Horizontal scrollable tabs with improved mobile detection (≤768px)
- **Touch accessibility**: 44px minimum touch targets and safe-area-aware spacing
- **Chart responsiveness**: Fluid containers and optimized legends for mobile viewing
- **UI scaling**: 20% downscale applied to calculator and simulator pages for compact viewing

For details, see:
- `docs/CHANGELOG.md`
- `dev-notes/panel-system-2025-refresh.md`
- `docs/internal/onboarding-tour.md`
