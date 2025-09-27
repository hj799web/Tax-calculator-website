<template>
  <teleport to="body">
    <div v-if="isMobile && open !== 'none'">
      <div class="scrim" @click="close" />
      <section class="sheet" role="dialog" aria-modal="true" :aria-label="t('mobileBottomSheet.ariaLabel', 'Budget changes')">
        <header class="sheet-header">
          <div class="title">
            <span class="material-icons" aria-hidden="true">history</span>
            {{ t('mobileBottomSheet.title', 'Budget Changes') }}
          </div>
          <button class="close" @click="close" :aria-label="t('mobileBottomSheet.closeAria', 'Close')">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
        </header>
        <div class="body">
          <div class="panel">
            <BudgetChangesBanner :max-recent-changes="10" />
          </div>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup>
import { useMobileDock } from '@/composables/useMobileDock'
import BudgetChangesBanner from '@/domains/budget/components/BudgetChangesBanner.vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const { isMobile, open, close } = useMobileDock()
</script>

<style scoped>
.scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 1999; }
.sheet {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 2000;
  max-height: 82vh; background: #fff; border-radius: 16px 16px 0 0;
  box-shadow: 0 -12px 32px rgba(0,0,0,.18); display: grid;
  grid-template-rows: auto 1fr; overflow: hidden;
}
.sheet-header { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #e5e7eb; }
.title { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: #111827; }
.close { margin-left: auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 6px 8px; }
.body { min-height: 0; overflow: auto; padding: 8px; }
.panel { height: 100%; }

/* Make banner render inline inside the sheet */
:deep(.budget-changes-banner) { position: static; top: auto; left: auto; transform: none; width: 100%; max-height: none; box-shadow: none; border: none; }
:deep(.budget-changes-banner .banner-content) { max-height: none; }
</style>
