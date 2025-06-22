// Enhanced state persistence with error handling and validation
export class StatePersistence {
  constructor(storageKey, options = {}) {
    this.storageKey = storageKey;
    this.version = options.version || '1.0';
    this.autoSave = options.autoSave !== false;
    this.debounceDelay = options.debounceDelay || 1000;
    this.encryption = options.encryption || false;
    this.compression = options.compression || false;
    
    this.debouncedSave = this.createDebouncedSave();
  }

  // Save state to localStorage with error handling
  save(state) {
    try {
      const dataToSave = {
        version: this.version,
        timestamp: Date.now(),
        data: state
      };

      let serializedData = JSON.stringify(dataToSave);
      
      // Add compression if enabled
      if (this.compression) {
        serializedData = this.compress(serializedData);
      }
      
      // Add encryption if enabled
      if (this.encryption) {
        serializedData = this.encrypt(serializedData);
      }

      localStorage.setItem(this.storageKey, serializedData);
      
      console.log(`[StatePersistence] Successfully saved state for ${this.storageKey}`);
      return true;
    } catch (error) {
      console.error(`[StatePersistence] Failed to save state for ${this.storageKey}:`, error);
      return false;
    }
  }

  // Load state from localStorage with validation
  load(defaultState = {}) {
    try {
      const serializedData = localStorage.getItem(this.storageKey);
      
      if (!serializedData) {
        console.log(`[StatePersistence] No saved state found for ${this.storageKey}`);
        return defaultState;
      }

      let data = serializedData;
      
      // Decrypt if encrypted
      if (this.encryption) {
        data = this.decrypt(data);
      }
      
      // Decompress if compressed
      if (this.compression) {
        data = this.decompress(data);
      }

      const parsedData = JSON.parse(data);
      
      // Version check
      if (parsedData.version !== this.version) {
        console.warn(`[StatePersistence] Version mismatch for ${this.storageKey}. Expected: ${this.version}, Found: ${parsedData.version}`);
        return defaultState;
      }

      // Timestamp check (optional: expire old data)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (Date.now() - parsedData.timestamp > maxAge) {
        console.warn(`[StatePersistence] Saved state for ${this.storageKey} is too old, using defaults`);
        return defaultState;
      }

      console.log(`[StatePersistence] Successfully loaded state for ${this.storageKey}`);
      return parsedData.data;
    } catch (error) {
      console.error(`[StatePersistence] Failed to load state for ${this.storageKey}:`, error);
      return defaultState;
    }
  }

  // Clear saved state
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log(`[StatePersistence] Cleared state for ${this.storageKey}`);
      return true;
    } catch (error) {
      console.error(`[StatePersistence] Failed to clear state for ${this.storageKey}:`, error);
      return false;
    }
  }

  // Check if state exists
  exists() {
    return localStorage.getItem(this.storageKey) !== null;
  }

  // Get state info
  getInfo() {
    try {
      const serializedData = localStorage.getItem(this.storageKey);
      if (!serializedData) return null;

      const parsedData = JSON.parse(serializedData);
      return {
        version: parsedData.version,
        timestamp: parsedData.timestamp,
        age: Date.now() - parsedData.timestamp,
        size: serializedData.length
      };
    } catch (error) {
      return null;
    }
  }

  // Create debounced save function
  createDebouncedSave() {
    let timeoutId = null;
    let pendingData = null;

    return (data) => {
      pendingData = data;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        if (pendingData) {
          this.save(pendingData);
          pendingData = null;
        }
      }, this.debounceDelay);
    };
  }

  // Auto-save wrapper
  autoSave(data) {
    if (this.autoSave) {
      this.debouncedSave(data);
    }
  }

  // Simple compression (base64 encoding for demo)
  compress(data) {
    return btoa(data);
  }

  // Simple decompression
  decompress(data) {
    return atob(data);
  }

  // Simple encryption (for demo purposes - use proper encryption in production)
  encrypt(data) {
    return btoa(data);
  }

  // Simple decryption
  decrypt(data) {
    return atob(data);
  }
}

// Create persistence instances for different parts of the app
export const budgetPersistence = new StatePersistence('budget-simulator-state', {
  version: '1.0',
  autoSave: true,
  debounceDelay: 1000
});

export const sentimentPersistence = new StatePersistence('sentiment-settings', {
  version: '1.0',
  autoSave: true,
  debounceDelay: 500
});

export const uiPersistence = new StatePersistence('ui-state', {
  version: '1.0',
  autoSave: true,
  debounceDelay: 200
}); 