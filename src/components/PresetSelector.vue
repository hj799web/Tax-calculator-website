<template>
  <div class="preset-panel">
    <div class="preset-header">
      <h3>
        <span class="material-icons icon">auto_awesome</span>
        Budget Presets
      </h3>
      <button 
        class="toggle-button"
        @click="isExpanded = !isExpanded"
        :aria-expanded="isExpanded"
        aria-controls="preset-grid"
      >
        <span class="material-icons">{{ isExpanded ? 'expand_less' : 'expand_more' }}</span>
        <span class="sr-only">{{ isExpanded ? 'Hide' : 'Show' }} Presets</span>
      </button>
    </div>
    
    <transition name="slide">
      <div v-if="isExpanded" id="preset-grid" class="preset-grid" role="group" aria-label="Budget presets">
        <div 
          v-for="(preset, key) in budgetPresets" 
          :key="key"
          class="preset-tile"
        >
          <button 
            class="preset-button" 
            :class="{ 'active': activePreset === key }"
            @click="applyPreset(key)"
            @mouseenter="hoveredPreset = key"
            @mouseleave="hoveredPreset = null"
            :aria-pressed="activePreset === key"
            :aria-label="`Apply ${preset.label} preset`"
          >
            <div class="preset-content">
              <div class="preset-label">{{ preset.label }}</div>
              <div class="preset-description" :id="`preset-desc-${key}`">{{ getShortDescription(preset.description) }}</div>
              
              <div v-if="preset.fiscalBalance" class="preset-fiscal-badge" :class="preset.fiscalBalance">
                {{ getFiscalBalanceLabel(preset.fiscalBalance) }}
              </div>
            </div>
            

          </button>
        </div>
      </div>
    </transition>
    
    <!-- Preset Information Panel -->
    <div class="preset-info-panel">
      <div v-if="hoveredPreset" class="preset-details">
        <h4 class="preset-details-title">{{ budgetPresets[hoveredPreset]?.label }}</h4>
        <p class="preset-details-description">{{ budgetPresets[hoveredPreset]?.description }}</p>
        <div v-if="budgetPresets[hoveredPreset]?.fiscalBalance" class="preset-fiscal-badge-large" :class="budgetPresets[hoveredPreset]?.fiscalBalance">
          {{ getFiscalBalanceLabel(budgetPresets[hoveredPreset]?.fiscalBalance) }}
        </div>
      </div>
      
      <div v-if="!hoveredPreset && activePreset" class="preset-details">
        <h4 class="preset-details-title">{{ budgetPresets[activePreset]?.label }}</h4>
        <p class="preset-details-description">{{ budgetPresets[activePreset]?.description }}</p>
        <div v-if="budgetPresets[activePreset]?.fiscalBalance" class="preset-fiscal-badge-large" :class="budgetPresets[activePreset]?.fiscalBalance">
          {{ getFiscalBalanceLabel(budgetPresets[activePreset]?.fiscalBalance) }}
        </div>
      </div>
      
      <div v-if="!hoveredPreset && !activePreset" class="preset-details preset-details-empty">
        <p>Hover over a preset to see details or click to apply it to your budget.</p>
      </div>
    </div>
    
    <!-- Active Preset Info -->
    <div v-if="activePreset" class="active-preset-info">
      <div class="active-preset-label">
        <span class="material-icons">check_circle</span>
        Active Preset: {{ budgetPresets[activePreset]?.label }}
      </div>
      <button 
        class="reset-button" 
        @click="resetPreset"
        aria-label="Reset active preset"
      >
        <span class="material-icons">restart_alt</span>
        Reset
      </button>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useBudgetSimulatorStore } from '@/stores/budgetSimulator';
import { budgetPresets, setPreset } from '@/presets';

export default {
  name: 'PresetSelector',
  
  data() {
    return {
      budgetPresets,
      isExpanded: true,
      activePreset: null,
      hoveredPreset: null
    };
  },
  
  computed: {
    ...mapStores(useBudgetSimulatorStore)
  },
  
  methods: {
    applyPreset(presetKey) {
      // Apply the preset using the setPreset function from presets.js
      setPreset(presetKey, this.budgetSimulatorStore);
      
      // Update the active preset
      this.activePreset = presetKey;
      
      // Emit an event to notify parent components
      this.$emit('preset-applied', presetKey);
    },
    
    resetPreset() {
      // Clear the active preset
      this.activePreset = null;
      
      // Reset the budget to default values
      this.budgetSimulatorStore.resetBudget();
      
      // Emit an event to notify parent components
      this.$emit('preset-reset');
    },
    
    getFiscalBalanceLabel(balance) {
      switch (balance) {
        case 'balanced':
          return 'Balanced';
        case 'surplus':
          return 'Surplus';
        case 'deficit':
          return 'Deficit';
        default:
          return '';
      }
    },
    
    getShortDescription(description) {
      // Truncate description to a reasonable length for the tile display
      return description.length > 60 
        ? description.substring(0, 57) + '...'
        : description;
    }
  }
};
</script>

<style scoped>
.preset-panel {
  margin: 1rem 0 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: #f8fafc;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.preset-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preset-header .icon {
  font-size: 1.2rem;
  color: #3b82f6;
}

.toggle-button {
  background-color: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #64748b;
  padding: 0.25rem;
  transition: all 0.2s;
}

.toggle-button:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.toggle-button .material-icons {
  font-size: 1.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f8fafc;
}

.preset-tile {
  position: relative;
}

.preset-button {
  width: 100%;
  height: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.preset-button:hover {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6, 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.preset-button:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #93c5fd;
}

.preset-button.active {
  background-color: #eff6ff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6, 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preset-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 2;
}

.preset-label {
  font-size: 1rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.preset-description {
  font-size: 0.8rem;
  color: #64748b;
  flex-grow: 1;
  line-height: 1.4;
}

.preset-fiscal-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  align-self: flex-start;
  margin-top: 0.5rem;
}

.preset-fiscal-badge.balanced {
  background-color: #e6fffa;
  color: #0d9488;
  border: 1px solid #99f6e4;
}

.preset-fiscal-badge.surplus {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.preset-fiscal-badge.deficit {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Preset Info Panel */
.preset-info-panel {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preset-details {
  max-width: 600px;
  text-align: center;
}

.preset-details-empty {
  color: #64748b;
  font-style: italic;
}

.preset-details-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 0.5rem 0;
}

.preset-details-description {
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
}

.preset-fiscal-badge-large {
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  margin-top: 0.5rem;
}

.preset-fiscal-badge-large.balanced {
  background-color: #e6fffa;
  color: #0d9488;
  border: 1px solid #99f6e4;
}

.preset-fiscal-badge-large.surplus {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.preset-fiscal-badge-large.deficit {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.active-preset-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #eff6ff;
  border-top: 1px solid #dbeafe;
}

.active-preset-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #1e40af;
}

.active-preset-label .material-icons {
  font-size: 1rem;
  color: #3b82f6;
}

.reset-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #dbeafe;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  color: #1e40af;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #bfdbfe;
}

.reset-button .material-icons {
  font-size: 0.9rem;
}

/* Animation */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .preset-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .preset-button {
    min-height: 90px;
    padding: 0.75rem;
  }
  
  .preset-label {
    font-size: 0.9rem;
  }
  
  .preset-description {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preset-button {
    min-height: 80px;
  }
  
  .active-preset-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .reset-button {
    align-self: flex-end;
  }
}
</style>
