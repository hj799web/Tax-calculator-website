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
