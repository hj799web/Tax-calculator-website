<template>
  <aside
    class="my-dock"
    :class="{ collapsed }"
    role="complementary"
    :aria-label="i18nText('multiYearDock.ariaLabel', 'Multi-year planning')"
  >
    <button
      class="dock-toggle"
      :aria-expanded="!collapsed"
      @click="collapsed = !collapsed"
    >
      <span class="material-icons">{{ collapsed ? 'chevron_left' : 'chevron_right' }}</span>
    </button>
    <div
      v-if="!collapsed"
      class="dock-content"
    >
      <MultiYearPlanner />
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import MultiYearPlanner from '@/domains/budget/components/MultiYearPlanner.vue';
import { useI18n } from '@/i18n';

// i18n setup
const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key);
  return value === key ? fallback : value;
};

const collapsed = ref(false);
</script>

<style scoped>
.my-dock {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 360px;
  max-height: calc(100vh - 24px);
  background: rgba(255,255,255,0.86);
  border: 1px solid rgba(229,231,235,0.9);
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  z-index: 100;
  backdrop-filter: saturate(1.2) blur(8px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.my-dock.collapsed { width: 44px; }
.dock-toggle {
  position: absolute; left: -38px; top: 12px;
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid #e5e7eb; background: #fff;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  display: grid; place-items: center; cursor: pointer;
}
.dock-content {
  display: flex; flex-direction: column; min-height: 0; height: 100%; padding: 12px;
}
@media (max-width: 768px) {
  .my-dock { right: 8px; left: 8px; width: auto; bottom: 8px; top: auto; transform: none; max-height: 82vh; }
  .dock-toggle { right: 8px; left: auto; top: -36px; }
}
</style>
