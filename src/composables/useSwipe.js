import { onMounted, onUnmounted, unref, watch } from 'vue'

/**
 * Horizontal swipe on touch screens. Calls onLeft (finger moved left → next)
 * or onRight (finger moved right → previous). Mostly-vertical gestures are
 * ignored so page scrolling is unaffected.
 */
export function useSwipe(target, { onLeft, onRight, threshold = 40 } = {}) {
  let startX = 0
  let startY = 0
  let tracking = false
  let element = null

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) return
    startX = event.touches[0].clientX
    startY = event.touches[0].clientY
    tracking = true
  }

  const onTouchEnd = (event) => {
    if (!tracking) return
    tracking = false
    const touch = event.changedTouches[0]
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) onLeft?.()
    else onRight?.()
  }

  const attach = (el) => {
    if (element) {
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchend', onTouchEnd)
    }
    element = el || null
    if (!element) return
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchend', onTouchEnd, { passive: true })
  }

  // The target may appear later (v-if), so follow the ref.
  onMounted(() => {
    attach(unref(target))
    watch(() => unref(target), attach)
  })
  onUnmounted(() => attach(null))
}
