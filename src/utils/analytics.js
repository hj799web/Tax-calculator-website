/**
 * Analytics utility for tracking popup engagement
 */
export const useAnalytics = () => {
  const trackPopupShown = (deviceType) => {
    // Track popup shown event
    // eslint-disable-next-line no-undef
    if (typeof gtag !== 'undefined') {
      // eslint-disable-next-line no-undef
      gtag('event', 'popup_shown', {
        event_category: 'user_engagement',
        event_label: `tax_breakdown_popup_${deviceType}`,
        value: 1
      })
    }
  }

  const trackPopupClicked = (deviceType) => {
    // Track popup clicked event
    // eslint-disable-next-line no-undef
    if (typeof gtag !== 'undefined') {
      // eslint-disable-next-line no-undef
      gtag('event', 'popup_clicked', {
        event_category: 'user_engagement',
        event_label: `tax_breakdown_popup_${deviceType}`,
        value: 1
      })
    }
  }

  const trackPopupDismissed = (deviceType, permanently = false) => {
    // Track popup dismissed event
    // eslint-disable-next-line no-undef
    if (typeof gtag !== 'undefined') {
      // eslint-disable-next-line no-undef
      gtag('event', 'popup_dismissed', {
        event_category: 'user_engagement',
        event_label: `tax_breakdown_popup_${deviceType}_${permanently ? 'permanent' : 'session'}`,
        value: 1
      })
    }
  }

  return {
    trackPopupShown,
    trackPopupClicked,
    trackPopupDismissed
  }
} 