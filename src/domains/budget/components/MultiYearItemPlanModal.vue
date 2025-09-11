<template>
  <div v-if="show" class="modal-backdrop" @click="close">
    <div class="modal" @click.stop>
      <div class="header">
        <h3>Multi-Year Plan: {{ itemName }}</h3>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <div class="body">
        <div class="section">
          <h4>Growth Profile</h4>
          <div class="row">
            <label>Baseline growth (%)</label>
            <input type="number" step="0.1" v-model.number="plan.baselineGrowth" />
            <label>Demographic adjustment (%)</label>
            <input type="number" step="0.1" v-model.number="plan.demographicAdjustment" />
          </div>
        </div>
        
        <div class="section">
          <h4>Level Adjustments</h4>
          <div class="row">
            <label>One-time adjustment (%)</label>
            <input type="number" step="0.1" v-model.number="plan.levelAdjustment" />
            <label>Apply from year</label>
            <input type="number" v-model.number="plan.startYear" min="2024" max="2040" />
          </div>
        </div>

        <div class="section">
          <h4>Policy Options</h4>
          <div class="row">
            <label>Policy type</label>
            <select v-model="plan.policyType">
              <option value="none">No policy change</option>
              <option value="expansion">Program expansion</option>
              <option value="efficiency">Efficiency improvement</option>
              <option value="reform">Structural reform</option>
            </select>
            <label>Impact magnitude (%)</label>
            <input type="number" step="0.1" v-model.number="plan.policyImpact" />
          </div>
        </div>

        <div class="section">
          <h4>Scenario Analysis</h4>
          <div class="row">
            <label>Scenario</label>
            <select v-model="selectedScenario" @change="applyScenario">
              <option value="baseline">Baseline</option>
              <option value="conservative">Conservative</option>
              <option value="optimistic">Optimistic</option>
              <option value="crisis">Crisis response</option>
            </select>
          </div>
        </div>
      </div>
      <div class="footer">
        <button class="btn" @click="reset">Reset</button>
        <button class="btn" @click="close">Cancel</button>
        <button class="btn primary" @click="save">Save Plan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  show: Boolean,
  itemName: String,
  itemId: String
});

const emit = defineEmits(['close', 'save']);

const selectedScenario = ref('baseline');

const plan = reactive({
  baselineGrowth: 2.0,
  demographicAdjustment: 0.0,
  levelAdjustment: 0.0,
  startYear: 2024,
  policyType: 'none',
  policyImpact: 0.0
});

function close() {
  emit('close');
}

function save() {
  emit('save', { itemId: props.itemId, plan: { ...plan } });
  close();
}

function reset() {
  plan.baselineGrowth = 2.0;
  plan.demographicAdjustment = 0.0;
  plan.levelAdjustment = 0.0;
  plan.startYear = 2024;
  plan.policyType = 'none';
  plan.policyImpact = 0.0;
  selectedScenario.value = 'baseline';
}

function applyScenario() {
  switch (selectedScenario.value) {
    case 'conservative':
      plan.baselineGrowth = 1.5;
      plan.demographicAdjustment = 0.5;
      break;
    case 'optimistic':
      plan.baselineGrowth = 3.0;
      plan.demographicAdjustment = -0.2;
      break;
    case 'crisis':
      plan.baselineGrowth = 5.0;
      plan.levelAdjustment = 10.0;
      break;
    default:
      reset();
  }
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; max-width: 600px; width: 90vw; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.header h3 { margin: 0; font-size: 1.1rem; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
.body { padding: 16px; max-height: 60vh; overflow-y: auto; }
.section { margin-bottom: 16px; }
.section h4 { margin: 0 0 8px 0; font-size: 0.9rem; color: #374151; }
.row { display: grid; grid-template-columns: 1fr auto 1fr auto; gap: 6px; align-items: center; }
input, select { padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; }
.footer { display: flex; justify-content: end; gap: 8px; padding: 10px 12px; border-top: 1px solid #e5e7eb; }

.btn {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  box-shadow: 0 4px 16px rgba(107, 114, 128, 0.2);
  transform: translateY(-1px);
  border-color: #6b7280;
}

.btn:hover::before {
  left: 100%;
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.15);
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn.primary::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  border-color: #2563eb;
}

.btn:disabled {
  background: #6b7280;
  border-color: #6b7280;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}
</style>