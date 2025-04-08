# 📘 Budget Simulator Developer Summary

This document summarizes the core architecture, logic, known bottlenecks, and implementation flow for the Federal Budget Simulator inside the Tax Calculator Website project.

## 🧩 1. Core Design Overview

### Central State (Pinia, Composition API):
- spendingCategories, revenueSources, budgetGoals, sentimentScores

### Key Computed Properties:
- totalSpending, totalRevenue, surplus, matchedBadge, budgetTitle

### Store Location:
- /src/stores/budgetSimulator.js

## 🏗️ 2. Module Breakdown

| File Path | Purpose |
|-----------|---------|
| /composables/useTitleGenerator.js | Generates budget titles based on tag logic |
| /composables/sentimentConfig.js | Sentiment rules by province, demographic, and sector |
| /composables/computeSentimentScores.js | Returns 0–4 sentiment score per group |
| /src/presets.js | Stores predefined slider configurations |
| /composables/useExportUtils.js | Handles PDF, PNG, and social card exports |
| /components/budget/ExportPanel.vue | PDF/PNG/iframe export UI |
| /components/budget/generateSocialCard.vue | Generates downloadable, branded social image |
| /components/budget/GoalTracker.vue | UI for setting revenue/deficit goals and tracking them |
| /components/budget/RadarSentiment.vue | Radar chart showing public sentiment by group |
| /components/budget/CategoryGroup.vue | Collapsible grouped category container (e.g., Spending, Revenue) |
| /components/budget/SpendingCategory.vue | Tile for individual budget item (e.g., Healthcare, Defense) |
| /components/budget/PercentageInput.vue | Reusable slider + numeric input used for all % controls |

## 🧠 3. Known Bottlenecks + Mitigations

### 🟥 High-Risk Bottlenecks

#### Complex UI State Sync
- **Why**: Sliders ↔ goals ↔ titles ↔ exports ↔ badges are deeply interconnected
- **Risk**: Data desync, incorrect exports, misleading results
- **Fixes**:
  - Centralize everything in budgetSimulator.js
  - Use computed() and watchEffect() for sync
  - Force-refresh UI blocks if needed

#### generateTitleFromBudget() / Badge Collisions
- **Why**: Multiple tag matches for one budget
- **Risk**: Misleading title/badge output
- **Fixes**:
  - Use exclusive tag groups or weights
  - Preview matched tags during dev:
  - "Matched tags: high_spending, high_tax → Equity Builder 🏥"

#### PDF/PNG Export Instability
- **Why**: html2canvas/html2pdf struggle with dynamic layout + Tailwind
- **Risk**: Broken renders, missing fonts, blur
- **Fixes**:
  - Use fixed-size export-only layout (e.g., ExportCard.vue)
  - Use scale: 2 in canvas
  - Always test export separately with dummy state

### 🟧 Medium-Risk Bottlenecks

#### Real-Time Sentiment Engine
- **Why**: Weighted matrix across many provinces and groups
- **Risk**: Laggy UI or incorrect radar output
- **Fixes**:
  - Memoize computeSentimentScores()
  - Debounce slider changes
  - Recalculate only on grouped input updates

#### Embed URL Restoration
- **Why**: Needs compact, readable state encoded in URL
- **Risk**: Corrupted or non-functional share links
- **Fixes**:
  - Use btoa(JSON.stringify(...)) for compact encoding
  - Validate decoded input before restoring
  - Fallback to default if malformed

#### Preset Highlight Confusion
- **Why**: Hard to tell which sliders were changed by preset vs. manually
- **Risk**: Users confused about what's different
- **Fixes**:
  - Store a previousPreset snapshot
  - Auto-highlight changed sliders temporarily
  - Fade highlights after a few seconds

### 🟩 Low-Risk Bottlenecks

#### Radar Chart Visual Imbalance
- **Why**: Some sentiment groups may be untouched
- **Risk**: Chart appears empty or skewed
- **Fixes**:
  - Default all scores to 0 if missing
  - Cap display to 0–4
  - Add hover tooltips with group names and values

#### Social Card Layout Issues
- **Why**: Unpredictable title, emoji, or badge lengths
- **Risk**: Overflow or broken text
- **Fixes**:
  - Use fixed height container
  - Apply text-ellipsis and responsive font sizes (text-sm md:text-lg)

#### Chart Responsiveness
- **Why**: Canvas size doesn't auto-adjust with layout shifts
- **Risk**: Charts overflow or shrink on mobile
- **Fixes**:
  - Watch container size with ResizeObserver
  - Redraw charts when parent resizes
  - Use aspect-ratio and max-width constraints

### 📌 Overall Bottleneck Strategy

| Area | Recommended Strategy |
|------|---------------------|
| State Sync | Use centralized Pinia store with watchers |
| Export Rendering | Use fixed-size layout; test independently |
| Sentiment Performance | Debounce + memoize matrix updates |
| Embed Restoration | Encode state cleanly with fallback |
| Preset Feedback | Track changes + auto-highlight diffs |
| Chart Responsiveness | Use redraw triggers + max-width styling |

## 🔁 4. How to Add New Features

1. Add new config to /src/stores/budgetSimulator.js
2. Update or create:
   - GoalTracker.vue (if logic ties into goals)
   - CategoryGroup.vue or SpendingCategory.vue (if visual block is new)
   - sentimentConfig.js (if public reaction logic is affected)
   - ExportPanel.vue (if results must be downloadable)
   - Radar or bar chart axes (if adding a new sentiment dimension)

## 🧪 5. Testing Strategy

- ✅ Export PDF/PNG with dummy and real budget states
- ✅ Validate state sync across:
  - Inputs ↔ Summary ↔ Charts ↔ Exports ↔ Embedded State
- ✅ Load simulator from embed URL and confirm full state is restored
- ✅ Confirm title and badge accurately reflect computed tags
- ✅ Test sentiment chart for edge cases (empty, maxed, lopsided)
- ✅ Run simulator flow end-to-end: input → result → export → embed → restore
