export function initCounters() {
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  function animate(el, to, duration = 1500) {
    const start = performance.now()
    const from = parseInt(el.textContent.replace(/[^0-9.-]/g, '')) || 0

    function frame(now) {
      const t = Math.min((now - start) / duration, 1)
      const v = Math.round(from + (to - from) * easeOutCubic(t))
      el.textContent = v.toLocaleString()
      if (t < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }

  function onReveal(e) {
    const root = e.target
    const counters = root.querySelectorAll('[data-count-to]')
    counters.forEach((c) => {
      const to = parseInt(c.dataset.countTo, 10) || 0
      animate(c, to)
    })
  }

  document.querySelectorAll('[data-reveal]').forEach((el) => el.addEventListener('reveal:visible', onReveal))

  // also run for elements already visible
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      const to = parseInt(el.dataset.countTo, 10) || 0
      animate(el, to)
    }
  })

  return () => document.querySelectorAll('[data-reveal]').forEach((el) => el.removeEventListener('reveal:visible', onReveal))
}
