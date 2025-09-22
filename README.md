# Canada Tax Calculator

A comprehensive tax calculation tool for Canadian taxpayers with government spending visualization and budget simulation capabilities.

## Features

- **Accurate Tax Calculations**: Federal and provincial tax calculations based on 2024 tax rates
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
