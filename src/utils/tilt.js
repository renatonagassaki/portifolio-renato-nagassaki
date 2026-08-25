export function initTilt(options = {}) {
  const selector = options.selector || '.tilt-card'
  const max = options.max || 8

  function onMove(e) {
    const card = this
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    card.style.setProperty('--tilt-x', `${-y * max}deg`)
    card.style.setProperty('--tilt-y', `${x * max}deg`)
    card.style.transform = `perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))`
  }

  function onLeave() {
    const card = this
    card.style.transform = ''
    card.style.removeProperty('--tilt-x')
    card.style.removeProperty('--tilt-y')
  }

  const els = Array.from(document.querySelectorAll(selector))
  els.forEach((el) => {
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
  })

  return () => {
    els.forEach((el) => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    })
  }
}
