<template>
  <div
    v-if="show"
    class="loading-indicator"
    :class="[size, variant]"
  >
    <div class="loading-spinner" />
    <p
      v-if="message"
      class="loading-text"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'overlay',
    validator: (value) => ['overlay', 'inline', 'button'].includes(value)
  }
});

const show = computed(() => props.show);
</script>

<style scoped>
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-indicator.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  z-index: 100;
  border-radius: inherit;
}

.loading-indicator.inline {
  padding: 1rem;
  background-color: transparent;
}

.loading-indicator.button {
  padding: 0.5rem;
  background-color: transparent;
}

.loading-spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4299e1;
  animation: spin 1s linear infinite;
}

.loading-indicator.small .loading-spinner {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-indicator.medium .loading-spinner {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.loading-indicator.large .loading-spinner {
  width: 32px;
  height: 32px;
  border-width: 4px;
}

.loading-text {
  font-size: 0.875rem;
  color: #4a5568;
  margin: 0;
  text-align: center;
}

.loading-indicator.small .loading-text {
  font-size: 0.75rem;
}

.loading-indicator.large .loading-text {
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .loading-indicator.overlay {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .loading-text {
    color: #e2e8f0;
  }
}
</style> 