<script setup>
import { computed, onBeforeUpdate, ref, watch } from 'vue'

defineOptions({
  name: 'TabsComponent'
})

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.every(item => item && typeof item.id === 'string' && typeof item.label === 'string')
  },
  modelValue: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default'
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const instanceId = `tabs-${Math.random().toString(36).slice(2, 10)}`

const tabRefs = ref([])

const normalizedItems = computed(() => props.items.map(item => ({
  ...item,
  panelId: item.panelId || `${instanceId}-panel-${item.id}`
})))

const activeTab = ref('')

const getFallbackId = () => normalizedItems.value[0]?.id || ''

const setActive = (id, { emitChange = false } = {}) => {
  const nextId = id ?? ''
  const changed = nextId !== activeTab.value

  if (changed) {
    activeTab.value = nextId
    emit('update:modelValue', nextId)
    if (emitChange) {
      emit('change', nextId)
    }
  } else if (emitChange) {
    emit('change', nextId)
  }
}

watch(
  normalizedItems,
  (items) => {
    if (!items.length) {
      activeTab.value = ''
      emit('update:modelValue', '')
      return
    }

    const hasActive = items.some(item => item.id === activeTab.value)
    if (!hasActive) {
      const fallback = props.modelValue && items.some(item => item.id === props.modelValue)
        ? props.modelValue
        : getFallbackId()
      setActive(fallback, { emitChange: false })
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      if (!activeTab.value && normalizedItems.value.length) {
        setActive(getFallbackId(), { emitChange: false })
      }
      return
    }

    if (value !== activeTab.value) {
      setActive(value, { emitChange: false })
    }
  }
)

onBeforeUpdate(() => {
  tabRefs.value = []
})

const classes = computed(() => ['tabs', `tabs--${props.variant}`].filter(Boolean))

const getTabId = (id) => `${instanceId}-tab-${id}`

const getPanelId = (id) => {
  const match = normalizedItems.value.find(item => item.id === id)
  return match ? match.panelId : `${instanceId}-panel-${id}`
}

const getPanelProps = (id) => ({
  id: getPanelId(id),
  role: 'tabpanel',
  tabindex: activeTab.value === id ? 0 : -1,
  'aria-labelledby': getTabId(id),
  'aria-hidden': activeTab.value === id ? 'false' : 'true'
})

const focusTab = (index) => {
  const el = tabRefs.value[index]
  if (el) {
    el.focus()
  }
}

const selectByIndex = (index) => {
  const item = normalizedItems.value[index]
  if (!item) {
    return
  }
  setActive(item.id, { emitChange: true })
  focusTab(index)
}

const onKeydown = (event, index) => {
  const { key } = event
  const total = normalizedItems.value.length
  if (!total) {
    return
  }

  const isHorizontal = props.orientation === 'horizontal'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

  if (key === nextKey) {
    event.preventDefault()
    const nextIndex = (index + 1) % total
    selectByIndex(nextIndex)
  } else if (key === prevKey) {
    event.preventDefault()
    const prevIndex = (index - 1 + total) % total
    selectByIndex(prevIndex)
  } else if (key === 'Home') {
    event.preventDefault()
    selectByIndex(0)
  } else if (key === 'End') {
    event.preventDefault()
    selectByIndex(total - 1)
  } else if (key === 'Enter' || key === ' ') {
    event.preventDefault()
    const item = normalizedItems.value[index]
    if (item) {
      setActive(item.id, { emitChange: true })
    }
  }
}

const onClickTab = (id) => {
  if (id !== activeTab.value) {
    setActive(id, { emitChange: true })
  }
}

const setTabRef = (el, index) => {
  if (el) {
    tabRefs.value[index] = el
  }
}

const slotBinding = computed(() => ({
  activeTab: activeTab.value,
  getPanelProps,
  getPanelId,
  getTabId
}))
</script>

<template>
  <div :class="classes">
    <div
      class="tabs__list"
      role="tablist"
      :aria-orientation="orientation"
    >
      <button
        v-for="(tab, index) in normalizedItems"
        :id="getTabId(tab.id)"
        :key="tab.id"
        :ref="(el) => setTabRef(el, index)"
        type="button"
        class="tabs__tab"
        :class="{ 'is-active': tab.id === activeTab }"
        role="tab"
        :aria-selected="tab.id === activeTab"
        :aria-controls="tab.panelId"
        :tabindex="tab.id === activeTab ? 0 : -1"
        @click="onClickTab(tab.id)"
        @keydown="onKeydown($event, index)"
      >
        <span class="tabs__label">{{ tab.label }}</span>
      </button>
    </div>
    <div class="tabs__panels">
      <slot v-bind="slotBinding" />
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tabs__list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(17, 24, 39, 0.08);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
  overflow-x: auto;
  scrollbar-width: thin;
  backdrop-filter: blur(14px);
}


.tabs__list::-webkit-scrollbar {
  height: 6px;
}

.tabs__list::-webkit-scrollbar-thumb {
  background: rgba(17, 24, 39, 0.2);
  border-radius: 9999px;
}

.tabs__tab {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted, #4b5563);
  padding: 0.6rem 1.25rem;
  font-weight: 600;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.tabs__tab:hover {
  color: var(--fg, #111827);
  background: rgba(17, 24, 39, 0.06);
}

.tabs__tab:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.35);
}

.tabs__tab.is-active {
  color: var(--fg, #111827);
  background: rgba(34, 211, 238, 0.16);
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 6px 18px rgba(34, 211, 238, 0.18);
}

.tabs__panels {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dark .tabs__list {
  background: rgba(15, 23, 42, 0.88);
  border-color: rgba(148, 163, 184, 0.26);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.45);
}

.dark .tabs__tab {
  color: rgba(226, 232, 240, 0.78);
}

.dark .tabs__tab:hover {
  color: rgba(248, 250, 252, 0.92);
  background: rgba(248, 250, 252, 0.08);
}

.dark .tabs__tab.is-active {
  color: #f8fafc;
  background: rgba(34, 211, 238, 0.28);
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 12px 28px rgba(34, 211, 238, 0.35);
}

.tabs--primary .tabs__tab.is-active {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.28), rgba(16, 185, 129, 0.24));
  border-color: rgba(34, 211, 238, 0.55);
  box-shadow: 0 8px 20px rgba(34, 211, 238, 0.25);
}

.tabs--primary .tabs__tab:hover {
  background: rgba(34, 211, 238, 0.18);
}

@media (max-width: 768px) {
  .tabs__tab {
    flex: 1 0 auto;
    padding: 0.55rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
