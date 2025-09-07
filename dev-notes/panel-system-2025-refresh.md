# Panel System 2025 Refresh

This document summarizes the tab navigation, component naming, and onboarding improvements introduced in the 2025 refresh.

## Navigation and Grouping
- Groups: Core, Adjust, Insights, Planning, Share.
- Labels: concise (Revenue, Spending, Results, Analysis, Goals, Projections, Export).
- Features:
  - Multi‑row wrapping (no horizontal scroll)
  - Compact mode (icon‑only with tooltips)
  - Pinned tabs (front of the bar)
  - Mobile “More” to collapse non‑Core groups

## Key Components
- Host and banner:
  - `src/domains/budget/components/PanelHost.vue`
    - `panelDefs`: now include `group` per panel
    - Passes `:pinned-keys` and `:compact` to the banner
  - `src/domains/budget/components/PanelBanner.vue`
    - Props: `pinnedKeys?: string[]`, `compact?: boolean`
    - Emits: `update:modelValue`
    - Adds `data-panel-key` and `data-panel-group` attributes for the tour

- Budget‑prefixed aliases (consistency in tab groupings):
  - `BudgetRevenuePanel.vue`, `BudgetResultsPanel.vue`, `BudgetExportPanel.vue`
  - `BudgetYearSelector.vue`, `BudgetChartsPanel.vue`, `BudgetRevenueSliders.vue`
  - `BudgetPanelHost.vue`, `BudgetPanelBanner.vue`
  - Compatibility shim: `RevenuePanel.vue` forwards to `BudgetRevenuePanel.vue`

## Onboarding Tour (Shepherd.js)
- Modes: Quick vs Full (options dialog)
- Spotlight: larger overlay opening, teal halo, pulsing ring, blurred outer mask
- Storage gating:
  - `fis.tour.prompted.v1` – shown once per user
  - `fis.tour.completed.v1` – suppress future prompts after completion/cancel
- Reset: “restart” button near the tour launcher
- Step targets rely on `data-panel-key`/`data-panel-group` and stable CSS hooks in panels

See also: `docs/internal/onboarding-tour.md`.

## Migration Notes
- If you referenced old component names:
  - Replace `ExportPanel.vue` → `BudgetExportPanel.vue`
  - Replace `SpendingControls.vue` → `BudgetSpendingControls.vue`
  - Replace `CategoryInfo.vue` → `BudgetCategoryInfo.vue`
- Leave `RevenuePanel.vue` imports as‑is; a shim keeps them working.

