import { useEffect } from 'react'

export default function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          // dispatch event for counters/animations
          entry.target.dispatchEvent(new CustomEvent('reveal:visible', { detail: entry }))
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    // auto-tag main sections for reveal if not manually annotated
    document.querySelectorAll('.section').forEach((s) => {
      if (!s.hasAttribute('data-reveal')) s.setAttribute('data-reveal', '')
    })

    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    els.forEach((el) => {
      const delay = el.dataset.revealDelay || ''
      if (delay) el.style.transitionDelay = delay
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}
