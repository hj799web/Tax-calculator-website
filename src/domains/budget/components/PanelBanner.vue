<template>
  <div class="panel-banner" :class="{ compact }" role="tablist" :aria-label="i18nText('panelBanner.sections', 'Sections')" tabindex="0" @keydown="onKeydown">
    <div v-for="grp in visibleGroups" :key="grp.key" class="group-block" :data-panel-group="grp.key">
      <div class="group-label" aria-hidden="true">{{ grp.title }}</div>
      <button v-for="p in grp.items" :key="p.key"
              class="tab"
              role="tab"
              :title="p.label"
              :aria-label="p.label"
              :aria-selected="p.key===modelValue"
              :class="{ active: p.key===modelValue }"
              :data-panel-key="p.key"
              @click="emit('update:modelValue', p.key)">
        <span class="material-icons" aria-hidden="true">{{ p.icon }}</span>
        <span class="label">{{ p.label }}</span>
      </button>
    </div>
    <button v-if="isMobile && collapsibleExists" class="more-toggle" @click="showMore = !showMore">
      <span class="material-icons" aria-hidden="true">{{ showMore ? 'expand_less' : 'expand_more' }}</span>
      <span class="label">{{ showMore ? i18nText('panelBanner.less', 'Less') : i18nText('panelBanner.more', 'More') }}</span>
    </button>
  </div>
  
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from '@/i18n';

// i18n setup
const { t } = useI18n();
const i18nText = (key, fallback = '') => {
  const value = t(key);
  return value === key ? fallback : value;
};

const props = defineProps({
  modelValue: { type: String, required: true },
  panels: { type: Array, required: true },
  pinnedKeys: { type: Array, default: () => [] },
  compact: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const order = ['pinned','core','adjust','insights','planning','share'];

const titles = computed(() => ({ 
  core: i18nText('panelBanner.groups.core', 'Core'), 
  adjust: i18nText('panelBanner.groups.adjust', 'Adjust'), 
  insights: i18nText('panelBanner.groups.insights', 'Insights'), 
  planning: i18nText('panelBanner.groups.planning', 'Planning'), 
  share: i18nText('panelBanner.groups.share', 'Share') 
}));

const pinnedSet = computed(() => new Set((props.pinnedKeys || []).filter(Boolean)));

const baseGroups = computed(() => {
  const map = new Map();
  // Pinned group
  const pinned = (props.panels || []).filter(p => pinnedSet.value.has(p.key));
  if (pinned.length) map.set('pinned', pinned);

  for (const p of props.panels || []) {
    if (pinnedSet.value.has(p.key)) continue; // skip already in pinned
    const g = p.group || 'core';
    if (!map.has(g)) map.set(g, []);
    map.get(g).push(p);
  }
  const keys = Array.from(map.keys()).sort((a,b) => order.indexOf(a) - order.indexOf(b));
  return keys.map(k => ({ key: k, title: k === 'pinned' ? 'Pinned' : (titles.value[k] || k), items: map.get(k) }));
});

// Mobile collapse state
const isMobile = ref(false);
const showMore = ref(false);

function updateIsMobile() {
  try { isMobile.value = window.innerWidth <= 768; } catch (_) { isMobile.value = false; }
}
onMounted(() => { updateIsMobile(); window.addEventListener('resize', updateIsMobile); });
onUnmounted(() => { window.removeEventListener('resize', updateIsMobile); });

const collapsibleExists = computed(() => baseGroups.value.some(g => g.key !== 'core' && g.key !== 'pinned'));

const visibleGroups = computed(() => {
  if (!isMobile.value) return baseGroups.value;
  if (showMore.value) return baseGroups.value;
  // Only show pinned and core when collapsed on mobile
  return baseGroups.value.filter(g => g.key === 'pinned' || g.key === 'core');
});

const flatPanels = computed(() => {
  const out = [];
  for (const g of baseGroups.value) { for (const p of g.items) out.push(p); }
  return out;
});
const currentIndex = computed(() => flatPanels.value.findIndex(p => p.key === props.modelValue));
function onKeydown(e) {
  if (!props.panels?.length) return;
  if (e.key === 'ArrowRight') {
    const i = (currentIndex.value + 1) % props.panels.length;
    emit('update:modelValue', props.panels[i].key);
    e.preventDefault();
  } else if (e.key === 'ArrowLeft') {
    const i = (currentIndex.value - 1 + props.panels.length) % props.panels.length;
    emit('update:modelValue', props.panels[i].key);
    e.preventDefault();
  }
}
</script>

<style scoped>
.panel-banner {
  position: sticky; top: 0; z-index: 5;
  display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; justify-content: flex-start;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(8px);
  border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  overflow-x: auto; -webkit-overflow-scrolling: touch;
}
.group-block { display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; padding-right: 4px; }
.group-label { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #6b7280; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 9999px; padding: 4px 8px; }

.tab { position: relative; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 12px;
  border: 1px solid #e5e7eb; background: #ffffff; cursor: pointer; color: #374151; font-weight: 600; line-height: 1; box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: all .15s ease; }
.tab { min-height: 36px; }
.tab .material-icons { font-size: 18px; opacity: .8; }
.tab .label { white-space: nowrap; font-size: clamp(0.78rem, 0.6rem + 0.4vw, 0.9rem); }
.tab.active { color: #0f172a; background: #eef2ff; border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99,102,241,0.15); }
.tab:not(.active):hover { background: #f9fafb; transform: translateY(-1px); }

.more-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 12px; border: 1px solid #e5e7eb; background: #f9fafb; color: #374151; font-weight: 600; }
.more-toggle .material-icons { font-size: 18px; }

@media (max-width: 640px) {
  .tab { padding: 6px 10px; min-height: 44px; }
  .tab .label { font-size: 0.85rem; }
}

.compact .label { display: none; }
</style>
