// Shared state for the mobile bottom dock / sheet
// Keeps a single source of truth across components
import { ref, computed, onMounted, onUnmounted } from 'vue'

// module-scoped singletons so all users share state
const openState = ref('none') // 'none' | 'changes'
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

function handleResize() {
  try { 
    width.value = window.innerWidth 
  } catch (_) {
    // Ignore resize errors in SSR/test environments
  }
}

export function useMobileDock() {
  onMounted(() => { 
    try { 
      window.addEventListener('resize', handleResize) 
    } catch (_) {
      // Ignore event listener errors in SSR/test environments
    }
  })
  onUnmounted(() => { 
    try { 
      window.removeEventListener('resize', handleResize) 
    } catch (_) {
      // Ignore event listener cleanup errors in SSR/test environments
    }
  })

  const isMobile = computed(() => width.value <= 1024)

  return {
    isMobile,
    open: openState,
    openChanges: () => { openState.value = 'changes' },
    close: () => { openState.value = 'none' },
  }
}
