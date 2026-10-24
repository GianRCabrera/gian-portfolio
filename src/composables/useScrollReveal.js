import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollReveal(options = {}) {
  const el = ref(null)
  let observer = null

  // True when the URL hash points at this section or at something inside it (e.g. #capabilities).
  const isHashTarget = () => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || !el.value) return false
    return el.value.id === id || Boolean(el.value.querySelector(`#${CSS.escape(id)}`))
  }

  // Sections reached from a nav link appear immediately instead of fading in after the jump.
  const revealNow = () => {
    if (!el.value || !el.value.classList.contains('will-reveal')) return
    el.value.classList.add('reveal-instant')
    el.value.classList.remove('will-reveal')
    el.value.classList.add('is-revealed')
    observer?.unobserve(el.value)
  }

  const onHashChange = () => {
    if (isHashTarget()) revealNow()
  }

  onMounted(() => {
    if (!el.value) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (isHashTarget()) return

    const rect = el.value.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight * 0.98

    if (alreadyVisible) return

    el.value.classList.add('will-reveal')

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('will-reveal')
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06, ...options },
    )

    observer.observe(el.value)
    window.addEventListener('hashchange', onHashChange)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    window.removeEventListener('hashchange', onHashChange)
  })

  return { el }
}
