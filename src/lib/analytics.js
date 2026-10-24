export function enableAnalytics() {
  const id = import.meta.env.VITE_GA4_ID
  if (!id || !/^G-[A-Z0-9]+$/i.test(id) || typeof window === 'undefined') return false
  if (window.gtag) return true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
  if (!document.querySelector('[data-connectx-ga4]')) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    script.dataset.connectxGa4 = 'true'
    document.head.appendChild(script)
  }
  return true
}

export function trackEvent(name, parameters = {}) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', name, parameters)
}
