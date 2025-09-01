# 📘 Budget Simulator Developer Summary

This document summarizes the core architecture, logic, known bottlenecks, and implementation flow for the Federal Budget Simulator inside the Tax Calculator Website project.

## 🧩 1. Core Design Overview

### Central State (Pinia, Composition API):
- spendingCategories, revenueSources, budgetGoals, sentimentScores

### Key Computed Properties:
- totalSpending, totalRevenue, surplus, matchedBadge, budgetTitle

### Store Location:
- /src/domains/budget/store/budgetSimulator.js (migrated to domain-driven structure)

## 🏗️ 2. Module Breakdown (Domain-Driven Architecture)

| File Path | Purpose |
|-----------|---------|
| /src/domains/budget/store/budgetSimulator.js | Central Pinia store with dual auto-balance system |
| /src/domains/budget/components/BudgetResults.vue | Budget summary with simple auto-balance toggle |
| /src/domains/budget/components/GoalTracker.vue | Goal-based auto-balance and target tracking |
| /src/domains/budget/components/RevenueSliders.vue | Revenue source controls |
| /src/domains/budget/components/SpendingControls.vue | Spending category management |
| /src/domains/budget/components/ChartsPanel.vue | Data visualization (lazy loaded) |
| /src/domains/budget/components/ExportPanel.vue | PDF/PNG/social card export UI |
| /src/domains/sentiment/utils/computeSentimentScores.js | 0–4 sentiment score calculation engine |
| /src/domains/sentiment/config/sentimentConfig.js | Sentiment rules by province, demographic, sector |
| /src/domains/sentiment/components/CollapsibleSentimentBanner.vue | Fiscal chaos warnings and sentiment display |
| /src/domains/sentiment/components/RadarSentiment.vue | Radar chart (lazy loaded) |
| /src/domains/badges/utils/generateBadgesFromBudget.js | Achievement system with tier support |
| /src/domains/badges/components/AchievementBadge.vue | Badge display component |
| /src/domains/badges/components/BadgeGalleryModal.vue | Badge collection viewer (lazy loaded) |
| /src/domains/social/components/SocialShareModal.vue | Social sharing with budget snapshots (lazy loaded) |
| /src/presets.js | Predefined budget configurations (Conservative, Progressive, etc.) |

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

1. **Identify the Domain**: Determine which domain (budget, sentiment, badges, social) the feature belongs to
2. **Update Store**: Add new config to `/src/domains/budget/store/budgetSimulator.js`
3. **Create/Update Components**:
   - BudgetResults.vue (if affects budget display)
   - GoalTracker.vue (if logic ties into goals or auto-balance)
   - Auto-balance system (if affects budget balancing)
   - sentimentConfig.js (if public reaction logic is affected)
   - ExportPanel.vue (if results must be downloadable)
   - Badge system (if achievement logic is involved)
4. **Performance Considerations**:
   - Use lazy loading for heavy components
   - Implement proper memoization for complex calculations
   - Add debouncing for real-time updates

## 🆕 5. Recent Major Enhancements

### Dual Auto-Balance System
- **Simple Auto-Balance**: Direct deficit elimination (BudgetResults.vue)
- **Goal-Based Auto-Balance**: Target-specific balancing (GoalTracker.vue)
- **Smart Revenue Prioritization**: PIT → CIT → GST → Others
- **Real-time Triggering**: Automatic when spending changes

### Achievement System
- **Badge Tiers**: Bronze, Silver, Gold, Platinum
- **Preset Integration**: Special badges for budget presets
- **Real-time Updates**: Badge recalculation on budget changes
- **Gallery View**: Modal for viewing all earned badges

### Performance Optimization
- **Lazy Loading**: Charts, sentiment radar, social modals
- **State Management**: Batch updates, memoization, versioning
- **Domain Architecture**: Clear separation of concerns

## 🧪 5. Testing Strategy

- ✅ Export PDF/PNG with dummy and real budget states
- ✅ Validate state sync across:
  - Inputs ↔ Summary ↔ Charts ↔ Exports ↔ Embedded State
- ✅ Load simulator from embed URL and confirm full state is restored
- ✅ Confirm title and badge accurately reflect computed tags
- ✅ Test sentiment chart for edge cases (empty, maxed, lopsided)
- ✅ Run simulator flow end-to-end: input → result → export → embed → restore
