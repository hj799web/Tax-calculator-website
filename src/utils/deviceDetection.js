import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Device detection utility for responsive behavior
 */
export const useDeviceDetection = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const updateDeviceType = () => {
    const width = window.innerWidth
    
    if (width < 768) {
      isMobile.value = true
      isTablet.value = false
      isDesktop.value = false
    } else if (width >= 768 && width < 1024) {
      isMobile.value = false
      isTablet.value = true
      isDesktop.value = false
    } else {
      isMobile.value = false
      isTablet.value = false
      isDesktop.value = true
    }
  }

  onMounted(() => {
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceType)
  })

  return {
    isMobile,
    isTablet,
    isDesktop
  }
} 