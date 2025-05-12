// sentimentSettings.js
// Store for managing public sentiment sensitivity settings
import { defineStore } from 'pinia';

export const useSentimentSettingsStore = defineStore('sentimentSettings', {
  // Auto-load from localStorage on initialization
  hydrate(state) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sentimentSensitivity');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          state.overall = parsed.overall ?? 1.0;
          state.regions = parsed.regions ?? 1.0;
          state.demographics = parsed.demographics ?? 1.0;
          state.sectors = parsed.sectors ?? 1.0;
        } catch (e) { /* ignore */ }
      }
    }
  },
  state: () => ({
    overall: 1.0,
    regions: 1.0,
    demographics: 1.0,
    sectors: 1.0
  }),
  actions: {
    loadFromLocalStorage() {
      const saved = localStorage.getItem('sentimentSensitivity');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.overall = parsed.overall ?? 1.0;
          this.regions = parsed.regions ?? 1.0;
          this.demographics = parsed.demographics ?? 1.0;
          this.sectors = parsed.sectors ?? 1.0;
        } catch (e) { /* ignore */ }
      }
    },
    setOverall(value) {
      console.log('[STORE DEBUG] Setting overall sensitivity to:', value);
      this.overall = value;
      this.saveToLocalStorage();
    },
    setRegions(value) {
      console.log('[STORE DEBUG] Setting regions sensitivity to:', value);
      this.regions = value;
      this.saveToLocalStorage();
    },
    setDemographics(value) {
      console.log('[STORE DEBUG] Setting demographics sensitivity to:', value);
      this.demographics = value;
      this.saveToLocalStorage();
    },
    setSectors(value) {
      console.log('[STORE DEBUG] Setting sectors sensitivity to:', value);
      this.sectors = value;
      this.saveToLocalStorage();
    },
    resetAll() {
      this.overall = 1.0;
      this.regions = 1.0;
      this.demographics = 1.0;
      this.sectors = 1.0;
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sentimentSensitivity', JSON.stringify({
          overall: this.overall,
          regions: this.regions,
          demographics: this.demographics,
          sectors: this.sectors
        }));
      }
    }
  }
});
