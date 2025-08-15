import { ref, computed, onUnmounted } from 'vue';
import { debounce } from 'lodash-es';

// User preferences (could be from Pinia, Vuex, or localStorage)
const userSettings = {
  bannerThreshold: Number(localStorage.getItem('bannerThreshold')) || 0.01, // Lowered to $0.01B for more sensitivity
  maxBannerChanges: Number(localStorage.getItem('maxBannerChanges')) || 15, // Increased for more changes
  showIndividualPresetChanges: localStorage.getItem('showIndividualPresetChanges') !== 'false', // Default to true
  batchWindow: Number(localStorage.getItem('batchWindow')) || 200 // Shorter window for more responsive feel
};

export function useChangeTracker() {
  const recentChanges = ref([]);
  const batchChanges = ref([]);
  const currentBatchId = ref(null);
  const dismissTimeouts = new Map();
  const isPresetMode = ref(false); // Track if we're in preset mode

  // Configuration
  const CONFIG = {
    CHANGE_THRESHOLD: userSettings.bannerThreshold,
    MAX_CHANGES: userSettings.maxBannerChanges,
    CHANGE_DURATION: 0, // 0 means no auto-dismiss (persistent)
    BATCH_DURATION: 0, // 0 means no auto-dismiss (persistent)
    DEBOUNCE_DELAY: 75, // Hybrid debounce: small delay for user drags
    BATCH_WINDOW: userSettings.batchWindow,
    PRESET_MODE_DURATION: 3000 // How long to stay in preset mode after preset changes
  };

  // Computed
  const hasActiveChanges = computed(() => recentChanges.value.length > 0);
  const hasBatchChanges = computed(() => batchChanges.value.length > 0);

  // Batching logic
  let batchBuffer = [];
  let batchTimeout = null;
  let presetModeTimeout = null;

  function processBatchedChanges() {
    if (batchBuffer.length === 0) return;
    
    // If in preset mode and user wants individual changes, add them individually
    if (isPresetMode.value && userSettings.showIndividualPresetChanges) {
      batchBuffer.forEach(event => {
        addIndividualChange(event);
      });
      batchBuffer = [];
      return;
    }
    
    // Otherwise, group into batch
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalChange = batchBuffer.reduce((sum, evt) => sum + evt.changeAmount, 0);
    batchChanges.value.push({
      batchId,
      changes: [...batchBuffer],
      totalChange,
      timestamp: Date.now(),
      isPreset: isPresetMode.value
    });
    batchBuffer = [];
  }

  // --- Hybrid change processor ---
  // 1.  handleEvent: full logic previously inside debounced function
  // 2.  debouncedHandle: coalesces rapid slider events (75 ms)
  // 3.  processChangeEvent: routes preset/batch events directly to handleEvent,
  //     otherwise through debouncedHandle

  function handleEvent(event) {
    console.log('[CHANGE TRACKER] Processing event:', {
      id: event.id,
      type: event.type,
      changeAmount: event.changeAmount,
      threshold: CONFIG.CHANGE_THRESHOLD,
      isPresetMode: isPresetMode.value
    });

    if (Math.abs(event.changeAmount) < CONFIG.CHANGE_THRESHOLD) {
      console.log('[CHANGE TRACKER] Change below threshold, ignoring');
      return;
    }

    // Detect preset changes (multiple rapid changes of the same type)
    if (event.metadata?.isPresetChange || event.metadata?.source === 'preset') {
      console.log('[CHANGE TRACKER] Preset change detected');
      isPresetMode.value = true;
      
      // Clear any existing preset mode timeout
      if (presetModeTimeout) {
        clearTimeout(presetModeTimeout);
      }
      
      // Set timeout to exit preset mode
      presetModeTimeout = setTimeout(() => {
        isPresetMode.value = false;
        console.log('[CHANGE TRACKER] Exiting preset mode');
      }, CONFIG.PRESET_MODE_DURATION);
    }

    // If it's a batch change, buffer it
    if (event.metadata?.batchId) {
      batchBuffer.push(event);
      if (batchTimeout) clearTimeout(batchTimeout);
      batchTimeout = setTimeout(processBatchedChanges, CONFIG.BATCH_WINDOW);
    } else {
      addIndividualChange(event);
    }
  }

  // Debounced wrapper for non-batch events
  const debouncedHandle = debounce(handleEvent, CONFIG.DEBOUNCE_DELAY);

  function processChangeEvent(event) {
    // Preset / batch events = immediate processing
    if (event.metadata?.isPresetChange || event.metadata?.source === 'preset') {
      handleEvent(event);
    } else {
      debouncedHandle(event);
    }
  }

  // Change management
  function addIndividualChange(event) {
    console.log('[CHANGE TRACKER] Adding individual change:', event.id);
    // Find if a notification for this item already exists
    const existingIndex = recentChanges.value.findIndex(
      change => change.itemId === event.itemId && change.type === event.type
    );
    if (existingIndex !== -1) {
      // Update the existing notification with the new event data and move it to the end
      const existing = recentChanges.value[existingIndex];
      const updated = {
        ...existing,
        ...event,
        id: existing.id, // keep original id for dismiss
        timestamp: Date.now()
      };
      recentChanges.value.splice(existingIndex, 1); // remove old
      recentChanges.value.push(updated); // add updated to end
    } else {
      if (recentChanges.value.length >= CONFIG.MAX_CHANGES) {
        // Remove the oldest item from the live list
        const overflowEvent = recentChanges.value.shift();
        clearTimeout(dismissTimeouts.get(overflowEvent.id));
        dismissTimeouts.delete(overflowEvent.id);

        // Create a mini-batch to preserve the discarded event
        const overflowBatch = {
          batchId: `overflow_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          changes: [overflowEvent],
          totalChange: overflowEvent.changeAmount,
          timestamp: Date.now(),
          // Treat as preset if the original event was preset-generated
          isPreset: !!overflowEvent.metadata?.isPresetChange
        };
        batchChanges.value.push(overflowBatch);
      }
      // Finally append the new event to the live list
      recentChanges.value.push(event);
    }
    // Only set timeout if duration is greater than 0
    if (CONFIG.CHANGE_DURATION > 0) {
      const timeout = setTimeout(() => {
        dismissChange(event.id);
      }, CONFIG.CHANGE_DURATION);
      dismissTimeouts.set(event.id, timeout);
    }
  }

  function dismissChange(id) {
    const index = recentChanges.value.findIndex(change => change.id === id);
    if (index > -1) {
      recentChanges.value.splice(index, 1);
      clearTimeout(dismissTimeouts.get(id));
      dismissTimeouts.delete(id);
    }
  }

  function dismissBatch(batchId) {
    const index = batchChanges.value.findIndex(batch => batch.batchId === batchId);
    if (index > -1) {
      batchChanges.value.splice(index, 1);
    }
  }

  function clearAllChanges() {
    recentChanges.value = [];
    batchChanges.value = [];
    dismissTimeouts.forEach(timeout => clearTimeout(timeout));
    dismissTimeouts.clear();
    isPresetMode.value = false;
    if (presetModeTimeout) {
      clearTimeout(presetModeTimeout);
      presetModeTimeout = null;
    }
  }

  // Batch operation helpers
  function beginBatch() {
    currentBatchId.value = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('[CHANGE TRACKER] Beginning batch:', currentBatchId.value);
    return currentBatchId.value;
  }

  function endBatch() {
    console.log('[CHANGE TRACKER] Ending batch:', currentBatchId.value);
    currentBatchId.value = null;
  }

  // Cleanup
  onUnmounted(() => {
    dismissTimeouts.forEach(timeout => clearTimeout(timeout));
    dismissTimeouts.clear();
    if (batchTimeout) clearTimeout(batchTimeout);
    if (presetModeTimeout) clearTimeout(presetModeTimeout);
  });

  return {
    recentChanges,
    batchChanges,
    hasActiveChanges,
    hasBatchChanges,
    isPresetMode,
    dismissChange,
    dismissBatch,
    clearAllChanges,
    processChangeEvent,
    beginBatch,
    endBatch,
    currentBatchId,
    CONFIG // Export config for UI use
  };
} 