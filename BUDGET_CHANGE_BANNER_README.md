# Budget Changes Banner

This document explains how the Budget Changes Banner works, the changes made to support it, and how to use it in the app.

## Overview

- The banner displays a live feed of budget changes (revenue, spending, tax expenditures, presets, auto‑balance, reset), grouped by category with a compact summary.
- It reads from a centralized change history in the budget store and reacts efficiently via a versioned trigger.
- It is fixed to the left side of the viewport, collapsible, and supports clearing the history.

Key files:
- src/domains/budget/components/BudgetChangesBanner.vue:1
- src/domains/budget/store/budgetSimulator.js:777
- src/views/FinanceMinisterSimulator.vue:262
- src/views/FinanceMinisterSimulator.vue:349

## Component

Banner UI and logic live in:
- src/domains/budget/components/BudgetChangesBanner.vue:1

Features
- Collapsible header with total change count and quick actions (clear, collapse).
- Category tabs (e.g., Income Taxes, Main Spending, System Actions, etc.) to filter visible changes.
- Recent changes list showing name, time, description, and amount with up/down icons and color.
- Summary section aggregating revenue and spending deltas.
- Budget totals section showing total revenue, total spending, and surplus/deficit.

Props
- maxRecentChanges: Number of recent changes to show (default 10).

State/Computed
- Reads `changeHistory` and `changeHistoryVersion` from the budget store for reactivity.
- `changesByCategory`: Adds an “All” pseudo‑tab on top of the store‑provided grouping.
- `summary`: Uses store‑computed totals for revenue, spending, and tax expenditures.
- `isCollapsed`: Local collapse state; persisted outside the component if needed.

Actions
- `clearChanges()`: Calls the store to clear history.
- `toggleCollapse()`: Locally toggles banner collapse.

Formatting
- `getDisplayAmount()` on a change record determines whether to show dollar impact or percentage.
- Revenue shows dollar impact when available; other types show percentage deltas.

## Store Changes

All banner data is driven by the Pinia store:
- src/domains/budget/store/budgetSimulator.js:777

Change Tracking State
- changeHistory: Array of `ChangeRecord` entries.
- changeHistoryVersion: Integer used as a reactive version trigger for computed getters.
- maxChangeHistorySize: Cap on history length (default 50).

Change Types and Categories
- CHANGE_TYPES: revenue, spending, tax_expenditure, preset, reset, auto_balance.
- CHANGE_CATEGORIES: Income Taxes, Consumption Taxes, Other Revenue, Main Spending, Loans & Investments, Government Operations, Tax Credits & Deductions, System Actions.
- `REVENUE_CATEGORY_MAP` and `SPENDING_CATEGORY_MAP` map item IDs to banner categories.

ChangeRecord
- Structure: id, type, category, itemId, itemName, oldValue, newValue, amount, dollarImpact, timestamp, description.
- Description: auto‑generated with readable phrasing and percentage formatting.
- getDisplayAmount(): Revenue uses `dollarImpact` when provided; others use `amount`.
- getChangeIcon()/getChangeColor(): Visual cues for up/down/no‑change.

Core APIs
- addBudgetChange(...): src/domains/budget/store/budgetSimulator.js:2798
  - Deduplicates by (type + itemId) before inserting the newest change.
  - Unshifts new change and trims to `maxChangeHistorySize`.
  - Increments `changeHistoryVersion` to notify dependents.
- clearChangeHistory(): src/domains/budget/store/budgetSimulator.js:2987
  - Clears history and bumps version.
- getChangesByCategory(): src/domains/budget/store/budgetSimulator.js:2993
  - Groups history by `change.category` for the banner’s tabs.
- getChangesSummary(): src/domains/budget/store/budgetSimulator.js:3027
  - Aggregates totals: revenue/spending dollar impacts and tax expenditure percentages.

Tracking Hooks
- trackRevenueChange(sourceId, oldRate, newRate)
  - Computes `dollarImpact = base * (newRate - oldRate)` and passes rates for description.
  - Categorizes via `REVENUE_CATEGORY_MAP`.
- trackSpendingChange(categoryId, oldFactor, newFactor)
  - Computes `dollarImpact = baseAmount * (newFactor - oldFactor)` and passes factors as percentages for description.
  - Categorizes via `SPENDING_CATEGORY_MAP`.
- trackTaxExpenditureChange(expenditureId, oldAdjustment, newAdjustment)
  - Tracks percentage changes under Tax Credits & Deductions.
- trackPresetApplication(presetKey, presetLabel)
  - Logs a `System Actions` entry noting the applied preset.
- trackAutoBalance()/trackBudgetReset()
  - Logs system‑level actions in `System Actions`.

## Usage

Import and mount the banner in the simulator view:
- src/views/FinanceMinisterSimulator.vue:349

Template usage:
- src/views/FinanceMinisterSimulator.vue:262

Example:
```
<BudgetChangesBanner :max-recent-changes="10" />
```

The banner is positioned fixed on the left side and is mobile‑responsive.

## Behavior Details

- Deduplication: Only one entry per unique `(type, itemId)` is kept; the most recent replaces older ones.
- History Cap: When `changeHistory` exceeds `maxChangeHistorySize`, older entries are trimmed.
- Reactivity: Incrementing `changeHistoryVersion` ensures computed properties re‑evaluate across the app.
- No‑Changes State: The banner shows an empty state with guidance when history is empty.
- Category Tabs: “All” tab is synthetic; other tabs come from store grouping.
- Summary: Revenue/Spending totals reflect cumulative dollar impacts of tracked changes.

## Debugging Aids

Console debug tags are emitted throughout to validate flow:
- [CHANGE DEBUG] addBudgetChange called
- [CHANGE DEBUG] Dedup: removing existing change for same item
- [CHANGE DEBUG] Created ChangeRecord
- [CHANGE DEBUG] Change added to history
- [CHANGE DEBUG] getChangesByCategory called
- [BANNER DEBUG] hasChanges computed
- [BANNER DEBUG] Recent changes computed (filtered)
- [BANNER DEBUG] Changes by category computed

## Edge Cases

- Rapid slider movements collapse to a single latest entry due to deduplication.
- Preset application records one `System Actions` item plus many individual revenue/spending changes.
- Revenue and spending display dollar impacts in the banner summary; item rows show either dollar impact (revenue) or percent (others).
- The banner can be collapsed independently from the rest of the UI and can be cleared at any time.

## Future Enhancements (Optional)

- Persist collapsed state and active category to local storage.
- Add export of the change history (CSV/JSON) from the banner.
- Add filters for time ranges (e.g., session only, last hour, all).
- Optional toggle to show/hide the Budget Totals block.

