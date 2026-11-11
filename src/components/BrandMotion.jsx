import { useEffect } from 'react'

const marqueeSelectors = ['.brand-strip', '.brands-category-grid']

function enhanceMarquees(root) {
  marqueeSelectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((track) => {
      if (track.dataset.cxMarqueeReady || !track.children.length) return

      const items = Array.from(track.children)
      if (!items.length) return

      items.forEach((item) => {
        const duplicate = item.cloneNode(true)
        duplicate.setAttribute('aria-hidden', 'true')
        duplicate.querySelectorAll('a, button, [tabindex]').forEach((element) => {
          element.setAttribute('tabindex', '-1')
        })
        track.appendChild(duplicate)
      })

      track.dataset.cxMarqueeReady = 'true'
      track.classList.add('cx-marquee-track')
      track.parentElement?.classList.add('cx-marquee-window')
    })
  })
}

export default function BrandMotion() {
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return undefined

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches) return undefined

    enhanceMarquees(root)
    const observer = new MutationObserver(() => enhanceMarquees(root))
    observer.observe(root, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
