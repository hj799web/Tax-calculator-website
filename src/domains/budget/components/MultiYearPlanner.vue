<template>
  <div class="planner">
    <div class="content">
      <ProjectionsPanelLite :show-controls="false" />
    </div>
    <div class="apply-bar">
      <div class="toggle">
        <label>Auto-apply</label>
        <input type="checkbox" v-model="autoApply" />
      </div>
      <button class="btn primary" @click="applyChanges()">Apply Changes</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProjectionsPanelLite from '@/domains/budget/components/ProjectionsPanelLite.vue';

const autoApply = ref(false);

function applyChanges() {
  // Apply changes logic here
  console.log('Applying multi-year planning changes...');
}
</script>

<style scoped>
.planner {
  display: grid;
  grid-template-rows: 1fr auto;
  height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}
.content { min-height: 0; height: 100%; overflow: auto; padding-right: 4px; }
.apply-bar { position: sticky; bottom: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 8px; background: linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.8)); border-top: 1px solid #e5e7eb; backdrop-filter: blur(6px); }

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

.toggle { display: flex; align-items: center; gap: 8px; }
label { font-size: .85rem; color: #6b7280; }
input, select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 10px; width: 100%; }
</style>
