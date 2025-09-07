<template>
  <div class="dockbar" v-if="isMobile">
    <button class="pill" @click="openChanges">
      <span class="material-icons" aria-hidden="true">history</span>
      <span class="label">Changes</span>
      <span class="count" v-if="count">({{ count }})</span>
    </button>
  </div>
  
</template>

<script setup>
import { computed } from 'vue'
import { useMobileDock } from '@/composables/useMobileDock'
import { useBudgetSimulatorStore } from '@/domains/budget'

const { isMobile, openChanges } = useMobileDock()
const budget = useBudgetSimulatorStore()
const count = computed(() => budget.changeHistory?.length || 0)
</script>

<style scoped>
.dockbar {
  position: fixed; left: 8px; right: 8px;
  bottom: calc(env(safe-area-inset-bottom) + 8px);
  display: flex; gap: 8px; justify-content: center; align-items: center;
  z-index: 2000;
}
.pill {
  min-width: 180px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 12px; border-radius: 12px; border: 1px solid #e5e7eb; background: #ffffff;
  color: #111827; font-weight: 600; box-shadow: 0 4px 18px rgba(0,0,0,.08);
}
.pill .material-icons { font-size: 18px; opacity: .9; }
.label { white-space: nowrap; }
.count { color: #6b7280; }
@media (min-width: 1025px) {
  .dockbar { display: none; }
}
</style>
