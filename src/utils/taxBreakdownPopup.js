/**
 * Utility for managing tax breakdown popup state and navigation
 */
export const useTaxBreakdownPopup = () => {
  const shouldShowPopup = () => {
    // Check if user has permanently dismissed the popup
    const permanentlyDismissed = localStorage.getItem('taxBreakdownPopupDismissed')
    if (permanentlyDismissed === 'true') {
      return false
    }
    
    // Check if popup has been shown in current session
    const sessionShown = sessionStorage.getItem('taxBreakdownPopupShown')
    if (sessionShown === 'true') {
      return false
    }
    
    return true
  }

  const markPopupShown = () => {
    sessionStorage.setItem('taxBreakdownPopupShown', 'true')
  }

  const navigateToTaxBreakdown = () => {
    // Smooth scroll to the tax breakdown section
    const targetId = 'how-it-works'
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      // Add a subtle highlight effect
      targetElement.style.transition = 'box-shadow 0.3s ease'
      targetElement.style.boxShadow = '0 0 0 4px rgba(52, 152, 219, 0.3)'
      
      // Smooth scroll to the element
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      
      // Remove highlight after animation
      setTimeout(() => {
        targetElement.style.boxShadow = ''
      }, 2000)
    }
  }

  return {
    shouldShowPopup,
    markPopupShown,
    navigateToTaxBreakdown
  }
} 