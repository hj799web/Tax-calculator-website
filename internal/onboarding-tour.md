# Onboarding Tour – 2025 Refresh

The simulator’s onboarding uses Shepherd.js with a focus on explaining the grouped tabs and the most important actions within each panel.

## Behavior
- Modes: Quick Tour (core flow) and Full Tour (detailed).
- LocalStorage gating:
  - `fis.tour.prompted.v1`: set after the options dialog is shown once.
  - `fis.tour.completed.v1`: set on completion or cancel to suppress future prompts.
- Launcher: bottom‑left “Interactive Tour” button; “Reset” button clears storage and reopens the dialog.

## Visuals
- Spotlight: enlarged overlay opening (padding 18, radius 12), slight overlay blur, teal halo, pulsing ring, and a blurred outer mask to separate the target from the dimmed page.
- Cards: black buttons, elevated white surface, animated fade/translate/scale for a modern feel.

### Spotlight Implementation Details
The tour uses Shepherd's native cut‑out effect for proper highlighting:
- **Container**: `background: transparent !important` to avoid tinting the entire page
- **Opening**: Uses `box-shadow: 0 0 0 9999px rgba(0,0,0,0.9) !important` to create the dimmed overlay
- **Highlight ring**: `outline: 4px solid #fff; outline-offset: 6px` for crisp visibility
- **Padding**: `modalOverlayOpeningPadding: 40` keeps spotlight area wide (configurable per step)

This ensures highlighted elements appear at full brightness while the rest of the page is properly dimmed.

## Targets
- Tabs and groups expose data attributes:
  - `data-panel-key="<key>"`
  - `data-panel-group="<group>"`
- Detailed steps use stable CSS hooks in panels (examples):
  - Revenue: `.revenue-explanation`, `.revenue-controls`
  - Spending: `.main-categories-grid`, `.tax-expenditures-grid`, `.reset-button`
  - Results: `.deficit-warning-banner`, `.download-button`
  - Analysis: `.display-toggle`, `.chart-legend`
  - Sentiment: `.sentiment-panel .controls`, `.sentiment-panel .group-tabs`
  - Projections: `.multi-year-panel .assumptions`, `.multi-year-panel .proj-table`
  - Export: `.btn.btn-primary.mt-4` (download PDF)

## Developer Integration
- File: `src/components/OnboardingTour.vue`
- Banner props (from `PanelHost.vue`):
  - `pinned-keys`: `['revenue','spending']` (modifiable)
  - `compact`: computed based on viewport width
- Mobile: “More” chip collapses non‑Core groups; the tour step expands it when needed.

## Extending the tour
- Add steps with a stable `attachTo.element` and optional `beforeShowPromise` to activate the target tab first.
- Keep selectors resilient (prefer data attributes or semantic class names over deep DOM paths).

