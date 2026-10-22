<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

const props = defineProps({
  gallery: {
    type: Object,
    required: true,
  },
})

const { el } = useScrollReveal()

const activeEvent = ref(0)
const activePhoto = ref(0)
const isLightboxOpen = ref(false)
const isPortrait = ref(false)

const events = computed(() => (Array.isArray(props.gallery?.events) ? props.gallery.events : []).filter(Boolean))

// Back-compat: if `gallery.items` exists, treat it as a single unnamed event.
const legacyItems = computed(() => (Array.isArray(props.gallery?.items) ? props.gallery.items : []).filter(Boolean))
const normalizedEvents = computed(() => {
  if (events.value.length) return events.value
  if (!legacyItems.value.length) return []
  return [
    {
      title: props.gallery?.title || 'Gallery',
      meta: '',
      photos: legacyItems.value,
    },
  ]
})

const eventCount = computed(() => normalizedEvents.value.length)
const hasMultipleEvents = computed(() => eventCount.value > 1)

const clampEventIndex = (value) => {
  const n = eventCount.value
  if (!n) return 0
  const next = value % n
  return next < 0 ? next + n : next
}

const setActiveEvent = (value) => {
  activeEvent.value = clampEventIndex(value)
}

const goPrevEvent = () => setActiveEvent(activeEvent.value - 1)
const goNextEvent = () => setActiveEvent(activeEvent.value + 1)

const photos = computed(() => {
  const currentEvent = normalizedEvents.value[activeEvent.value]
  const raw = currentEvent?.photos
  return Array.isArray(raw) ? raw.filter(Boolean) : []
})

const photoCount = computed(() => photos.value.length)
const hasMultiplePhotos = computed(() => photoCount.value > 1)
const photoCounterLabel = computed(() => (photoCount.value ? `${activePhoto.value + 1} / ${photoCount.value}` : ''))
const eventCounterLabel = computed(() => (eventCount.value ? `${activeEvent.value + 1} / ${eventCount.value}` : ''))

const clampPhotoIndex = (value) => {
  const n = photoCount.value
  if (!n) return 0
  const next = value % n
  return next < 0 ? next + n : next
}

const setActivePhoto = (value) => {
  activePhoto.value = clampPhotoIndex(value)
}

const goPrev = () => setActivePhoto(activePhoto.value - 1)
const goNext = () => setActivePhoto(activePhoto.value + 1)

const openLightbox = () => {
  if (!current.value?.src) return
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

const currentEvent = computed(() => normalizedEvents.value[activeEvent.value] || null)
const current = computed(() => photos.value[activePhoto.value] || null)

const updateOrientation = (src) => {
  if (!src) {
    isPortrait.value = false
    return
  }

  const img = new Image()
  img.onload = () => {
    if (!img.naturalWidth || !img.naturalHeight) {
      isPortrait.value = false
      return
    }
    isPortrait.value = img.naturalHeight > img.naturalWidth
  }
  img.onerror = () => {
    isPortrait.value = false
  }
  img.src = src
}

const thumbStrip = ref(null)

watch(activeEvent, (index) => {
  activePhoto.value = 0

  // Keep the active thumbnail visible; scroll only the strip, never the page.
  const strip = thumbStrip.value
  const thumb = strip?.children?.[index]
  if (!strip || !thumb) return
  const left = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2
  strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
})

watch(
  () => current.value?.src,
  (src) => updateOrientation(src),
  { immediate: true }
)

const onKeyDown = (event) => {
  if (isLightboxOpen.value && event.key === 'Escape') {
    event.preventDefault()
    closeLightbox()
    return
  }
  if (!hasMultiplePhotos.value) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrev()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNext()
  }
}

watch(isLightboxOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <section ref="el" id="gallery" class="section-shell space-y-7 pt-3">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {{ gallery.title || 'Gallery' }}
        </p>
        <h2 class="mt-3 text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
          {{ gallery.heading || 'Moments in tech.' }}
        </h2>
        <p v-if="gallery.intro" class="mt-3 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
          {{ gallery.intro }}
        </p>
      </div>
      <span
        v-if="!normalizedEvents.length"
        class="w-fit rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]"
      >
        Add photos soon
      </span>
    </div>

    <div v-if="normalizedEvents.length" class="space-y-3">
      <figure class="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--surface)] shadow-[0_18px_44px_rgba(32,24,16,0.08)] sm:max-w-3xl">
        <div class="relative aspect-[5/4] w-full overflow-hidden bg-[var(--surface-panel-soft)] sm:aspect-[16/9]">
          <button
            v-if="current?.src"
            type="button"
            class="group relative h-full w-full cursor-zoom-in"
            :aria-label="`Open photo in full screen${current?.title ? `: ${current.title}` : ''}`"
            @click="openLightbox"
          >
            <img
              :src="current.src"
              alt=""
              class="pointer-events-none absolute inset-0 h-full w-full object-cover blur-2xl saturate-125"
              :class="isPortrait ? 'opacity-60 scale-[1.14]' : 'opacity-30 scale-[1.08]'"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(27,110,97,0.16),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(186,111,77,0.14),transparent_60%)]"
              aria-hidden="true"
            />
            <img
              :src="current.src"
              :alt="current.alt || current.title || 'Gallery photo'"
              class="h-full w-full object-contain transition duration-300 group-hover:scale-[1.01]"
              :class="isPortrait ? 'scale-[1.06] contrast-[1.14] saturate-[1.18] drop-shadow-[0_26px_55px_rgba(0,0,0,0.18)]' : 'contrast-[1.12] saturate-[1.14]'"
              loading="lazy"
              decoding="async"
            />
            <div
              class="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
              aria-hidden="true"
            >
              <div class="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(16,16,16,0.42))]" />
              <div class="absolute inset-0 bg-black/5 opacity-0 transition group-hover:opacity-100" />
              <div class="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                <svg aria-hidden="true" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 21l-4.3-4.3" />
                  <circle cx="11" cy="11" r="7" />
                  <path d="M11 8v6M8 11h6" />
                </svg>
                <span>Zoom</span>
              </div>
            </div>
          </button>
          <div
            v-else
            class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(27,110,97,0.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(186,111,77,0.16),transparent_60%)]"
            aria-hidden="true"
          />
          <div
            v-if="!current?.src"
            class="absolute inset-0 grid place-items-center"
            aria-hidden="true"
          >
            <div class="rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-center shadow-[0_10px_24px_rgba(32,24,16,0.08)]">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Add photos</p>
              <p class="mt-1 text-xs text-[var(--ink-muted)]">Events · demos · defense</p>
            </div>
          </div>

          <div v-if="hasMultiplePhotos" class="pointer-events-none absolute inset-0 flex items-center justify-between px-2.5">
            <button
              type="button"
              class="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[var(--surface)]/70 text-[var(--ink-strong)] shadow-[0_12px_24px_rgba(0,0,0,0.12)] backdrop-blur transition hover:scale-[1.03] hover:bg-[var(--surface)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.16)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Previous photo"
              @click="goPrev"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                <path d="M10.5 3.5 6 8l4.5 4.5" />
              </svg>
            </button>
            <button
              type="button"
              class="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[var(--surface)]/70 text-[var(--ink-strong)] shadow-[0_12px_24px_rgba(0,0,0,0.12)] backdrop-blur transition hover:scale-[1.03] hover:bg-[var(--surface)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.16)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Next photo"
              @click="goNext"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                <path d="M5.5 12.5 10 8 5.5 3.5" />
              </svg>
            </button>
          </div>
        </div>

        <figcaption class="space-y-1.5 border-t border-[var(--line)] px-5 py-4">
          <p class="text-[1.05rem] font-semibold leading-snug text-[var(--ink-strong)] sm:text-lg">
            {{ currentEvent?.title || current?.title }}
          </p>
          <p v-if="currentEvent?.meta || current?.meta" class="text-sm leading-6 text-[var(--ink-muted)]/90">
            {{ currentEvent?.meta || current?.meta }}
          </p>
          <div class="pt-1">
            <span
              v-if="current?.title"
              class="inline-flex items-center rounded-full border border-[var(--accent)]/18 bg-[var(--accent)]/6 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]"
            >
              {{ current.title }}
            </span>
          </div>
        </figcaption>
      </figure>

      <div class="mx-auto w-full max-w-2xl space-y-2 sm:max-w-3xl">
        <!-- Event-level label (one box) -->
        <div
          class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.05rem] border border-[var(--line)] bg-[var(--surface-panel)] px-4 py-2 text-[var(--ink-strong)] shadow-[0_10px_22px_rgba(32,24,16,0.05)]"
          :aria-label="`Event: ${currentEvent?.title || 'Gallery event'}`"
        >
          <div v-if="hasMultipleEvents" class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--ink-strong)] transition hover:scale-[1.02] hover:border-[var(--accent)]/35 hover:bg-[var(--surface)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Previous event"
              @click="goPrevEvent"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                <path d="M10.5 3.5 6 8l4.5 4.5" />
              </svg>
            </button>
            <button
              type="button"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--ink-strong)] transition hover:scale-[1.02] hover:border-[var(--accent)]/35 hover:bg-[var(--surface)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Next event"
              @click="goNextEvent"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                <path d="M5.5 12.5 10 8 5.5 3.5" />
              </svg>
            </button>
          </div>
          <div class="min-w-0 text-center">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
              {{ hasMultipleEvents ? `Event ${eventCounterLabel}` : 'Event' }}
            </p>
          </div>
          <div class="flex justify-end">
            <span
              v-if="hasMultiplePhotos"
              class="rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]"
            >
              Photo {{ photoCounterLabel }}
            </span>
          </div>
        </div>

        <!-- Jump straight to any event -->
        <div
          v-if="hasMultipleEvents"
          ref="thumbStrip"
          class="flex snap-x gap-2.5 overflow-x-auto px-0.5 pb-2 pt-1"
          aria-label="Jump to an event"
        >
          <button
            v-for="(event, index) in normalizedEvents"
            :key="`${event.title}-${index}`"
            type="button"
            class="group flex w-28 flex-none snap-start flex-col justify-start overflow-hidden rounded-[0.9rem] border bg-[var(--surface)] text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:w-32"
            :class="
              index === activeEvent
                ? 'border-[var(--accent)] shadow-[0_8px_20px_rgba(27,110,97,0.16)]'
                : 'border-[var(--line)] opacity-80 hover:border-[var(--accent)]/40 hover:opacity-100'
            "
            :aria-current="index === activeEvent ? 'true' : undefined"
            :aria-label="`Show event: ${event.title}`"
            @click="setActiveEvent(index)"
          >
            <span class="block aspect-[4/3] w-full overflow-hidden bg-[var(--surface-panel-soft)]">
              <img
                v-if="event.cover || event.photos?.[0]?.src"
                :src="event.cover || event.photos[0].src"
                alt=""
                class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span
              class="line-clamp-2 px-2 py-1.5 text-[0.68rem] leading-snug font-semibold text-[var(--ink-strong)]"
            >
              {{ event.shortTitle || event.title }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="`Gallery photo: ${currentEvent?.title || 'Event'}`"
        @click.self="closeLightbox"
      >
        <div class="w-full max-w-5xl overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/40 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <div class="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-white">
                {{ currentEvent?.title || 'Gallery' }}
              </p>
              <p v-if="currentEvent?.meta" class="mt-0.5 truncate text-xs text-white/70">
                {{ currentEvent.meta }}
              </p>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              aria-label="Close full screen viewer"
              @click="closeLightbox"
            >
              ✕
            </button>
          </div>

          <div class="relative bg-black/30">
            <div class="grid place-items-center p-3 sm:p-4">
              <img
                v-if="current?.src"
                :src="current.src"
                :alt="current.alt || current.title || 'Gallery photo'"
                class="max-h-[72vh] w-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>

            <div v-if="hasMultiplePhotos" class="pointer-events-none absolute inset-0 flex items-center justify-between px-2.5 sm:px-3.5">
              <button
                type="button"
                class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                aria-label="Previous photo"
                @click="goPrev"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                  <path d="M10.5 3.5 6 8l4.5 4.5" />
                </svg>
              </button>
              <button
                type="button"
                class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                aria-label="Next photo"
                @click="goNext"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                  <path d="M5.5 12.5 10 8 5.5 3.5" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-white/70 sm:px-5">
            <p class="min-w-0 truncate">
              <span v-if="current?.title" class="font-semibold text-white">{{ current.title }}</span>
              <span v-if="current?.meta" class="ml-2">{{ current.meta }}</span>
            </p>
            <span v-if="photoCount" class="flex-none rounded-full border border-white/15 bg-black/25 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-white/70">
              {{ activePhoto + 1 }} / {{ photoCount }}
            </span>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

