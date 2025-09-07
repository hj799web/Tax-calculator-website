# Changelog

This project is actively evolving. This log highlights user‑visible and developer‑relevant changes made during the tab UX and onboarding overhaul.

## 2025‑09‑05 – Panel tabs + Onboarding overhaul

- Navigation tabs
  - Introduced grouped tabs in the budget simulator: `core`, `adjust`, `insights`, `planning`, `share`.
  - Simplified labels ("Revenue", "Spending", "Results", etc.).
  - Panel bar supports multi‑row wrapping, compact mode (icon‑only with tooltips), and a mobile "More" collapse.
  - Pinned tabs: `revenue` and `spending` are surfaced first; can be expanded later to user‑selectable pins.

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
