🧠 Budget Simulator Architecture Guide
For use by developers, Windsurf, or AI assistants contributing to fiscal-insights.ca
 
🧩 Core State Architecture
💵 Revenue & Spending
•	Pinia Store: /stores/budgetSimulator.js
o	revenueSources: personalIncomeTax, corporateTax, GST, etc.
o	spendingCategories: healthcare, seniors, defense, grouped by sections
o	budgetGoals: { targetRevenue, targetDeficit, enabled }
o	sentimentScores: computed from budget inputs
•	All sliders use 0.5% increments
•	Computed Getters:
o	totalRevenue, totalSpending, surplus
•	Actions:
o	applyPreset(), resetBudget(), syncToLocalStorage()
 
🏗️ File Structure Integration
📁 Key Directories
•	/views/FederalBudgetSimulatorView.vue: main simulator page
•	/components: UI components
o	generateSocialCard.vue
o	ExportPanel.vue
o	RadarSentiment.vue
•	/composables: reusable logic
o	useBudgetState.js
o	useExportUtils.js
o	useTitleGenerator.js
o	sentimentConfig.js
•	/stores/budgetSimulator.js: centralized Pinia store for all simulator data
 
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
 
⚠️ Known Bottlenecks & Mitigations
Bottleneck	Risk	Solution
State sync across components	🟥	Use budgetSimulator.js store only
Title & badge overlaps	🟥	Use tag weights/priority ordering
html2canvas/jspdf glitches	🟥	Export fixed-size versions only
Sentiment score debounce	🟧	Memoize + run on input pause
Query param restore in embed	🟧	Use encoding, validate fallback
Preset slider highlight accuracy	🟧	Store lastPreset and compare deltas
 
🚀 Future Ideas (Backlogged)
•	Budget comparison mode
•	Multiplayer mode (debate budgets)
•	AI-generated budgets
•	Custom dataset uploads
