class CustomCursor {
  constructor() {
    this.enabled = !('ontouchstart' in window) && typeof window !== 'undefined'
    if (!this.enabled) return

    this.dot = document.createElement('div')
    this.dot.className = 'custom-cursor__dot'
    this.circle = document.createElement('div')
    this.circle.className = 'custom-cursor__circle'
    this.root = document.createElement('div')
    this.root.className = 'custom-cursor'
    this.root.appendChild(this.dot)
    this.root.appendChild(this.circle)
    document.body.appendChild(this.root)

    this.dotX = this.dotY = this.circleX = this.circleY = 0
    this.targetX = this.targetY = 0
    this.isHovering = false

    this._onMove = this._onMove.bind(this)
    this._onHover = this._onHover.bind(this)
    this._onLeave = this._onLeave.bind(this)
    this._loop = this._loop.bind(this)

    window.addEventListener('mousemove', this._onMove, { passive: true })
    document.addEventListener('pointerover', this._onHover)
    document.addEventListener('pointerout', this._onLeave)
    this.raf = requestAnimationFrame(this._loop)
  }

  _onMove(e) {
    this.targetX = e.clientX
    this.targetY = e.clientY
    this.dot.style.transform = `translate3d(${this.targetX}px, ${this.targetY}px, 0) translate(-50%, -50%)`
  }

  _onHover(e) {
    const el = e.target
    if (!el) return
    if (el.closest && (el.closest('a') || el.closest('button') || el.closest('.btn') || el.closest('.icon-btn'))) {
      this.root.classList.add('is-hovering')
    }
  }

  _onLeave(e) {
    const el = e.relatedTarget
    if (!el || !(el.closest && (el.closest('a') || el.closest('button') || el.closest('.btn') || el.closest('.icon-btn')))) {
      this.root.classList.remove('is-hovering')
    }
  }

  _loop() {
    // lerp circle to target
    const lerp = (a, b, n) => a + (b - a) * n
    this.circleX = lerp(this.circleX, this.targetX, 0.12)
    this.circleY = lerp(this.circleY, this.targetY, 0.12)
    this.circle.style.transform = `translate3d(${this.circleX}px, ${this.circleY}px, 0) translate(-50%, -50%)`
    this.raf = requestAnimationFrame(this._loop)
  }

  destroy() {
    if (!this.enabled) return
    window.removeEventListener('mousemove', this._onMove)
    document.removeEventListener('pointerover', this._onHover)
    document.removeEventListener('pointerout', this._onLeave)
    cancelAnimationFrame(this.raf)
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root)
  }
}

let instance = null
export default function initCustomCursor() {
  if (instance) return instance
  try {
    instance = new CustomCursor()
    return instance
  } catch (e) {
    console.warn('custom cursor init failed', e)
    return null
  }
}
