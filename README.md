# my-new-project

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
# Web-development

## Recent UI/UX updates (2025 refresh)

The Budget Simulator received a navigation and onboarding overhaul:

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
