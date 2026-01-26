import { defineStore } from 'pinia';
import { reactive, computed, toRefs } from 'vue';

export const USER_PREFERENCES_STORAGE_KEY = 'fi:userPrefs:v1';
const STORE_VERSION = 1;

const buildDefaultState = () => ({
  version: STORE_VERSION,
  completedOnboarding: false,
  priorityWeights: {},
  recommendedPresetKey: null,
  prefillAppliedAt: null,
  rawResponses: {},
});

const readStoredState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(USER_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    // Basic schema guard with version check
    if (parsed.version !== STORE_VERSION) {
      return {
        ...buildDefaultState(),
        ...parsed,
        version: STORE_VERSION,
      };
    }

    return {
      ...buildDefaultState(),
      ...parsed,
      version: STORE_VERSION,
    };
  } catch (error) {
    console.warn('[userPreferences] Failed to read stored state:', error);
    return null;
  }
};

const persistState = (state) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const payload = JSON.stringify(state);
    window.localStorage.setItem(USER_PREFERENCES_STORAGE_KEY, payload);
  } catch (error) {
    console.warn('[userPreferences] Failed to persist state:', error);
  }
};

export const useUserPreferences = defineStore('userPreferences', () => {
  const state = reactive(readStoredState() || buildDefaultState());

  const hasPriorityWeights = computed(() => Object.keys(state.priorityWeights || {}).length > 0);
  // Allow re-apply each session; gate is in-memory at the simulator level
  const shouldApplyPrefill = computed(() => state.completedOnboarding && hasPriorityWeights.value);

  const persist = () => {
    persistState({
      ...state,
      priorityWeights: { ...state.priorityWeights },
      rawResponses: { ...state.rawResponses },
    });
  };

  const save = (weights, presetKey = null, rawResponses = {}) => {
    state.priorityWeights = { ...weights };
    state.rawResponses = { ...rawResponses };
    state.recommendedPresetKey = presetKey;
    state.completedOnboarding = true;
    state.prefillAppliedAt = null;
    persist();
  };

  const markCompleted = () => {
    state.completedOnboarding = true;
    persist();
  };

  const markPrefillApplied = () => {
    state.prefillAppliedAt = Date.now();
    persist();
  };

  const markPrefillPending = () => {
    state.prefillAppliedAt = null;
    persist();
  };

  const markIncomplete = () => {
    state.completedOnboarding = false;
    state.prefillAppliedAt = null;
    persist();
  };

  const reset = () => {
    const fresh = buildDefaultState();
    Object.assign(state, fresh);
    persist();
  };

  const setPriorityWeights = (weights) => {
    state.priorityWeights = { ...weights };
    persist();
  };

  // Recompute weights from stored raw responses if needed
  const recomputeWeightsIfEmpty = (normaliseFn) => {
    if (Object.keys(state.priorityWeights || {}).length > 0) {
      return;
    }
    if (typeof normaliseFn !== 'function') {
      return;
    }
    try {
      const weights = normaliseFn(state.rawResponses || {});
      state.priorityWeights = { ...weights };
      persist();
    } catch (error) {
      console.warn('[userPreferences] Failed to recompute weights', error);
    }
  };

  const setRawResponses = (responses) => {
    state.rawResponses = { ...responses };
    persist();
  };

  const setRecommendedPreset = (presetKey) => {
    state.recommendedPresetKey = presetKey;
    persist();
  };

  const loadFromStorage = () => {
    const stored = readStoredState();
    if (!stored) {
      return;
    }
    Object.assign(state, stored);
    // Clear persisted apply gate so quiz prefs reapply on each session load
    state.prefillAppliedAt = null;
    persist();
  };

  return {
    ...toRefs(state),
    hasPriorityWeights,
    shouldApplyPrefill,
    save,
    reset,
    markCompleted,
    markPrefillApplied,
    markPrefillPending,
    markIncomplete,
    setPriorityWeights,
    setRawResponses,
    setRecommendedPreset,
    loadFromStorage,
    recomputeWeightsIfEmpty,
  };
});
