🧠 Budget Simulator Architecture Guide
For use by developers, Windsurf, or AI assistants contributing to fiscal-insights.ca

**🆕 RECENT UPDATES (Past 2 Months):**
- Migrated to domain-driven architecture
- Implemented dual auto-balance system
- Added comprehensive achievement system
- Performance optimization with lazy loading
- Enhanced sentiment engine with fiscal chaos detection
 
🧩 Core State Architecture
💵 Revenue & Spending
•	Pinia Store: /src/domains/budget/store/budgetSimulator.js (UPDATED PATH)
o	revenueSources: personalIncomeTax, corporateTax, GST, etc.
o	spendingCategories: healthcare, seniors, defense, grouped by sections
o	budgetGoals: { targetRevenue, targetDeficit, enabled }
o	autoBalanceActive: false (goal-based auto-balance)
o	simpleAutoBalanceActive: false (simple deficit elimination)
o	sentimentScores: computed from budget inputs
o	badges: [] (achievement system)
•	All sliders use 0.5% increments
•	Computed Getters:
o	totalRevenue, totalSpending, surplus
•	Actions:
o	applyPreset(), resetBudget(), syncToLocalStorage()
o	toggleAutoBalance(), toggleSimpleAutoBalance() (NEW)
o	autoBalanceBudget(), autoBalanceBudgetForGoal() (ENHANCED)
 
🏗️ File Structure Integration (Domain-Driven Design)
📁 Key Directories - UPDATED STRUCTURE
•	/views/FinanceMinisterSimulator.vue: main simulator page (UPDATED NAME)
•	/src/domains/budget/: Budget simulation domain
o	components/: BudgetResults.vue, GoalTracker.vue, RevenueSliders.vue, etc.
o	store/budgetSimulator.js: centralized Pinia store (MOVED)
o	utils/: sharedBudget.js, generateExportPDF.js
•	/src/domains/sentiment/: Public sentiment domain
o	components/: CollapsibleSentimentBanner.vue, RadarSentiment.vue (lazy)
o	config/: sentimentConfig.js, entityImpactFactors.js
o	utils/: computeSentimentScores.js
•	/src/domains/badges/: Achievement system domain
o	components/: AchievementBadge.vue, BadgeGalleryModal.vue (lazy)
o	config/: badgeConfig.js
o	utils/: generateBadgesFromBudget.js
•	/src/domains/social/: Social sharing domain
o	components/: SocialShareModal.vue (lazy), PartyBudgetSharing.vue
•	/src/utils/: Shared utilities (analytics.js, errorHandler.js)
 
🎯 Goal, Badge & Title Logic
🎛️ Goal Tracker
•	Reactive goal state:
budgetGoals = {
  targetRevenue: null,
  targetDeficit: null,
  enabled: false
}
•	Tracks proximity to user targets with ✅ / ⚠️ / ❌ logic
🏷️ Title Generator
•	useTitleGenerator.js (composition function)
•	Generates titles based on computed tags:
o	high_social, massive_deficit, surplus, etc.
•	Tag weights determine label priority
🏅 Badge Logic
•	Based on the same tag set
•	Returns badge object: { icon: "🌿", label: "Environmental Advocate" }
•	Used in summary, exports, and social cards
 
📊 Chart & Sentiment Engine
📈 Charts
•	Pie chart for spending breakdown
•	Bar chart for revenue breakdown
•	Radar chart for sentiment
🗺️ Public Sentiment
•	Config: sentimentConfig.js
•	Dimensions:
o	Provinces (population-weighted)
o	Demographics (youth, seniors, families, etc.)
o	Sectors (business, environmentalists, defense, etc.)
•	Score output range: 0–4 → 😡 😐 🙂 😄 🥳
•	Used in: RadarSentiment.vue, social card, and summary
 
📤 Export Architecture
🖨️ PDF Export
•	Uses html2pdf.js
•	Triggered from ExportPanel.vue
•	Exports a simplified version of BudgetSummary.vue
🖼️ Social Card
•	Component: generateSocialCard.vue
•	Tailwind-based square/4:3 card
•	Rendered as PNG using html2canvas
📷 Full Simulator PNG Export
•	Uses html2canvas on full simulator layout (collapsed sliders + charts)
•	Triggered from ExportPanel.vue
🌐 IFrame Embed
•	Generates embeddable iframe with serialized state via btoa(JSON.stringify(...))
•	Config preview handled in embed modal or EmbedPanel.vue
💾 LocalStorage
•	Key: savedBudgetConfig
•	Used for offline access, caching, and restoring sessions
•	Managed via syncToLocalStorage() in the store
 
⚠️ Known Bottlenecks & Mitigations (UPDATED)
| Bottleneck | Risk | Solution | Status |
|------------|------|----------|---------|
| State sync across components | 🟥 | Use budgetSimulator.js store only | ✅ RESOLVED |
| Auto-balance conflicts | 🟥 | Separate simple/goal-based systems | ✅ IMPLEMENTED |
| Title & badge overlaps | 🟥 | Use tag weights/priority ordering | 🟧 ONGOING |
| html2canvas/jspdf glitches | 🟥 | Export fixed-size versions only | 🟧 ONGOING |
| Sentiment score debounce | 🟧 | Memoize + run on input pause | ✅ IMPLEMENTED |
| Query param restore in embed | 🟧 | Use encoding, validate fallback | ✅ IMPLEMENTED |
| Component loading performance | 🟧 | Lazy loading for heavy components | ✅ IMPLEMENTED |
| Badge calculation overhead | 🟧 | Optimized badge generation with caching | ✅ IMPLEMENTED |
 
🚀 Future Ideas (Backlogged)
•	Budget comparison mode (view multiple scenarios side-by-side)
•	Multiplayer mode (collaborative budget debates)
•	AI-generated budgets (ML-powered budget suggestions)
•	Custom dataset uploads (user-provided economic data)
•	Advanced auto-balance strategies (economic impact optimization)
•	Real-time collaboration features
•	Mobile app version
•	International budget comparisons

📊 Recent Performance Improvements
•	**Lazy Loading**: Charts, sentiment radar, badge gallery, social modals
•	**State Optimization**: Batch updates, memoization cache, state versioning
•	**Component Architecture**: Domain separation, reduced coupling
•	**Auto-Balance**: Dual system prevents conflicts and improves UX
•	**Badge System**: Efficient calculation with preset integration
•	**Sentiment Engine**: Enhanced fiscal chaos detection and warnings
