<template>
  <div
    v-if="error"
    class="error-boundary"
  >
    <div class="error-content">
      <span class="material-icons error-icon">error_outline</span>
      <h3 class="error-title">
        Something went wrong
      </h3>
      <p class="error-message">
        {{ error.message || 'An unexpected error occurred' }}
      </p>
      <div class="error-actions">
        <button
          class="error-button primary"
          @click="resetError"
        >
          Try Again
        </button>
        <button
          class="error-button secondary"
          @click="reportError"
        >
          Report Issue
        </button>
      </div>
      <details
        v-if="showDetails"
        class="error-details"
      >
        <summary>Technical Details</summary>
        <pre class="error-stack">{{ error.stack }}</pre>
        <p class="error-context">
          Component: {{ componentName }}
        </p>
        <p class="error-context">
          Timestamp: {{ errorTimestamp }}
        </p>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured, provide } from 'vue';
import { handleError } from '@/utils/errorHandler.js';

const props = defineProps({
  componentName: {
    type: String,
    default: 'Unknown Component'
  },
  fallback: {
    type: Function,
    default: null
  }
});

const error = ref(null);
const errorTimestamp = ref(null);
const showDetails = ref(false);

// Provide error boundary context to child components
provide('errorBoundary', {
  reportError: (err) => {
    error.value = err;
    errorTimestamp.value = new Date().toISOString();
  }
});

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  console.error(`[ErrorBoundary] Error in ${props.componentName}:`, err, info);
  
  // Log error with context
  handleError(err, (msg) => {
    console.error(`[ErrorBoundary] ${msg}`);
  });
  
  // Store error details
  error.value = err;
  errorTimestamp.value = new Date().toISOString();
  
  // Prevent error from propagating up
  return false;
});

const resetError = () => {
  error.value = null;
  errorTimestamp.value = null;
  showDetails.value = false;
};

const reportError = () => {
  // Send error to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Integrate with Sentry, LogRocket, etc.
    console.error('[ErrorBoundary] Reporting error:', {
      error: error.value,
      component: props.componentName,
      timestamp: errorTimestamp.value,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
  showDetails.value = true;
};
</script>

<style scoped>
.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.error-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
}

.error-icon {
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.error-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.error-button.primary {
  background: #4299e1;
  color: white;
}

.error-button.primary:hover {
  background: #3182ce;
}

.error-button.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.error-button.secondary:hover {
  background: #cbd5e0;
}

.error-details {
  margin-top: 1rem;
  text-align: left;
}

.error-stack {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
}

.error-context {
  font-size: 0.875rem;
  color: #718096;
  margin: 0.5rem 0;
}
</style> 