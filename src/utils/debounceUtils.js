// Enhanced debouncing utilities for consistent performance optimization
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

// Standard debounce delay for most inputs
export const STANDARD_DEBOUNCE_DELAY = 200;

// Shorter delay for immediate feedback
export const FAST_DEBOUNCE_DELAY = 100;

// Longer delay for expensive operations
export const SLOW_DEBOUNCE_DELAY = 300;

// Create debounced function with consistent configuration
export function createDebouncedFunction(func, delay = STANDARD_DEBOUNCE_DELAY) {
  return debounce(func, delay, {
    leading: false,
    trailing: true,
    maxWait: delay * 2
  });
}

// Create throttled function for real-time feedback
export function createThrottledFunction(func, delay = FAST_DEBOUNCE_DELAY) {
  return throttle(func, delay, {
    leading: true,
    trailing: true
  });
}

// Debounced store update with loading state management
export function createStoreUpdateWithLoading(store, updateMethod, loadingKey = 'isUpdating') {
  const debouncedUpdate = createDebouncedFunction(async (...args) => {
    try {
      if (loadingKey && store[loadingKey] !== undefined) {
        store[loadingKey] = true;
      }
      await updateMethod.apply(store, args);
    } finally {
      if (loadingKey && store[loadingKey] !== undefined) {
        store[loadingKey] = false;
      }
    }
  }, STANDARD_DEBOUNCE_DELAY);

  return debouncedUpdate;
} 