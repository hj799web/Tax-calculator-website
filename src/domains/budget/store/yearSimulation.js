import { defineStore } from 'pinia';
import { ref } from 'vue';

// Store for year-specific simulation overlays and saved scenarios
export const useYearSimulationStore = defineStore('yearSimulation', () => {
  // Overlays keyed by year: { revenuePct: {key: pct}, spendingPct: {key: pct} }
  const overlaysByYear = ref({});
  const scenarios = ref([]); // { id, name, year, createdAt, overlay }

  function ensureOverlay(year) {
    const y = String(year);
    if (!overlaysByYear.value[y]) {
      overlaysByYear.value[y] = { revenuePct: {}, spendingPct: {} };
    }
    return overlaysByYear.value[y];
  }

  function getOverlay(year) {
    return ensureOverlay(year);
  }

  function setRevenueDelta(year, key, pct) {
    const ov = ensureOverlay(year);
    ov.revenuePct = { ...ov.revenuePct, [key]: Number(pct || 0) };
  }

  function setSpendingDelta(year, key, pct) {
    const ov = ensureOverlay(year);
    ov.spendingPct = { ...ov.spendingPct, [key]: Number(pct || 0) };
  }

  function resetYear(year) {
    overlaysByYear.value[String(year)] = { revenuePct: {}, spendingPct: {} };
  }

  function saveScenario(year, name) {
    const overlay = JSON.parse(JSON.stringify(getOverlay(year)));
    const id = `ys_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    scenarios.value.push({ id, year: Number(year), name: name || `Scenario ${new Date().toLocaleString()}` , overlay, createdAt: Date.now() });
    return id;
  }

  function loadScenario(id) {
    const s = scenarios.value.find(s => s.id === id);
    if (!s) return;
    overlaysByYear.value[String(s.year)] = JSON.parse(JSON.stringify(s.overlay));
  }

  function deleteScenario(id) {
    scenarios.value = scenarios.value.filter(s => s.id !== id);
  }

  return {
    overlaysByYear,
    scenarios,
    getOverlay,
    setRevenueDelta,
    setSpendingDelta,
    resetYear,
    saveScenario,
    loadScenario,
    deleteScenario,
  };
});

