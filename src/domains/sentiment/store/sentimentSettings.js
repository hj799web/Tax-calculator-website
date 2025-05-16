// sentimentSettings.js
// Store for managing public sentiment sensitivity settings
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSentimentSettingsStore = defineStore('sentimentSettings', () => {
  // Sensitivity settings
  const sensitivity = ref({
    overall: 1.0,
    regions: 1.0,
    demographics: 1.0,
    sectors: 1.0
  });

  // Thresholds for different sentiment levels
  const thresholds = ref({
    warning: 0.3,
    critical: 0.7
  });

  // Update frequency in milliseconds
  const updateFrequency = ref(1000);
  const lastUpdate = ref(Date.now());

  // Computed properties
  const shouldUpdate = computed(() => {
    return Date.now() - lastUpdate.value > updateFrequency.value;
  });

  const isWarningLevel = computed(() => {
    return Math.abs(sensitivity.value.overall) > thresholds.value.warning;
  });

  const isCriticalLevel = computed(() => {
    return Math.abs(sensitivity.value.overall) > thresholds.value.critical;
  });

  // Actions
  const setSensitivity = (category, value) => {
    if (Object.prototype.hasOwnProperty.call(sensitivity.value, category)) {
      sensitivity.value[category] = Math.max(0, Math.min(2, value));
      saveToLocalStorage();
    } else {
      console.warn(`[SENTIMENT SETTINGS] Attempted to update non-existent setting: ${category}`);
    }
  };

  const setThreshold = (level, value) => {
    if (Object.prototype.hasOwnProperty.call(thresholds.value, level)) {
      thresholds.value[level] = Math.max(0, Math.min(1, value));
      saveToLocalStorage();
    } else {
      console.warn(`[SENTIMENT SETTINGS] Attempted to update non-existent setting: ${level}`);
    }
  };

  const setUpdateFrequency = (frequency) => {
    updateFrequency.value = Math.max(100, Math.min(5000, frequency));
    saveToLocalStorage();
  };

  const resetAll = () => {
    sensitivity.value = {
      overall: 1.0,
      regions: 1.0,
      demographics: 1.0,
      sectors: 1.0
    };
    thresholds.value = {
      warning: 0.3,
      critical: 0.7
    };
    updateFrequency.value = 1000;
    saveToLocalStorage();
  };

  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sentimentSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          sensitivity.value = parsed.sensitivity || sensitivity.value;
          thresholds.value = parsed.thresholds || thresholds.value;
          updateFrequency.value = parsed.updateFrequency || updateFrequency.value;
        } catch (e) {
          console.error('Error loading sentiment settings:', e);
        }
      }
    }
  };

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sentimentSettings', JSON.stringify({
        sensitivity: sensitivity.value,
        thresholds: thresholds.value,
        updateFrequency: updateFrequency.value
      }));
    }
  };

  // Initialize
  loadFromLocalStorage();

  return {
    sensitivity,
    thresholds,
    updateFrequency,
    lastUpdate,
    shouldUpdate,
    isWarningLevel,
    isCriticalLevel,
    setSensitivity,
    setThreshold,
    setUpdateFrequency,
    resetAll,
    loadFromLocalStorage,
    saveToLocalStorage
  };
});
