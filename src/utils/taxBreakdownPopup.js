/**
 * Utility for managing tax breakdown popup state and navigation
 */
export const useTaxBreakdownPopup = () => {
  const shouldShowPopup = () => {
    const permanentlyDismissed = localStorage.getItem('taxBreakdownPopupDismissed')
    return permanentlyDismissed !== 'true'
  }

  const markPopupShown = () => {}

  const navigateToTaxBreakdown = (targetTab = 'breakdown') => {
    window.dispatchEvent(
      new CustomEvent('tax-tabs:navigate', {
        detail: { tab: targetTab }
      })
    )

    const highlightTargets = {
      breakdown: () => document.getElementById('how-it-works'),
      categories: () => document.querySelector('.budget-categories-section'),
      faqs: () => document.querySelector('.faq-section'),
      resources: () => document.querySelector('.resources-section')
    }

    requestAnimationFrame(() => {
      const targetElementGetter = highlightTargets[targetTab] || highlightTargets.breakdown
      const targetElement = targetElementGetter?.()

      if (targetElement) {
        targetElement.classList.add('tax-highlight')

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

        setTimeout(() => {
          targetElement.classList.remove('tax-highlight')
        }, 1800)
      }
    })
  }

  return {
    shouldShowPopup,
    markPopupShown,
    navigateToTaxBreakdown
  }
}
