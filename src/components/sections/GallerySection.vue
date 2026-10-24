<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'
import { useSwipe } from '../../composables/useSwipe'

const props = defineProps({
  gallery: {
    type: Object,
    required: true,
  },
})

const { el } = useScrollReveal()

const events = computed(() => (Array.isArray(props.gallery?.events) ? props.gallery.events : []).filter(Boolean))

const photosOf = (event) => (Array.isArray(event?.photos) ? event.photos.filter(Boolean) : [])
const coverOf = (event) => event.cover || photosOf(event)[0]?.src || ''
const yearOf = (event) => event.date?.match(/\d{4}/)?.[0] || ''

// Full-screen viewer for one event's photos
const openEvent = ref(null)
const activePhoto = ref(0)
const closeButtonRef = ref(null)
let returnFocusTo = null

const viewerPhotos = computed(() => photosOf(openEvent.value))
const photoCount = computed(() => viewerPhotos.value.length)
const hasMultiplePhotos = computed(() => photoCount.value > 1)
const current = computed(() => viewerPhotos.value[activePhoto.value] || null)

const openViewer = async (event, trigger) => {
  returnFocusTo = trigger || null
  openEvent.value = event
  activePhoto.value = 0
  await nextTick()
  closeButtonRef.value?.focus?.()
}

const closeViewer = () => {
  openEvent.value = null
  returnFocusTo?.focus?.()
  returnFocusTo = null
}

const goTo = (index) => {
  const n = photoCount.value
  if (!n) return
  activePhoto.value = ((index % n) + n) % n
}
const goPrev = () => goTo(activePhoto.value - 1)
const goNext = () => goTo(activePhoto.value + 1)

// Follow a "See the talk" link from inside the viewer: close first, then let the hash navigate.
const followRelated = () => {
  openEvent.value = null
  returnFocusTo = null
}

const viewerPhotoArea = ref(null)
useSwipe(viewerPhotoArea, {
  onLeft: () => hasMultiplePhotos.value && goNext(),
  onRight: () => hasMultiplePhotos.value && goPrev(),
})

const onKeyDown = (event) => {
  if (!openEvent.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeViewer()
  } else if (event.key === 'ArrowLeft' && hasMultiplePhotos.value) {
    event.preventDefault()
    goPrev()
  } else if (event.key === 'ArrowRight' && hasMultiplePhotos.value) {
    event.preventDefault()
    goNext()
  }
}

watch(openEvent, (value) => {
  document.documentElement.style.overflow = value ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <section ref="el" id="gallery" class="section-shell space-y-7 border-t border-[var(--line)] pt-9 sm:pt-10">
    <div>
      <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        {{ gallery.title || 'Gallery' }}
      </p>
      <h2 class="pt-3 text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
        {{ gallery.heading || 'Moments in tech.' }}
      </h2>
      <p v-if="gallery.intro" class="max-w-xl pt-3 text-base leading-relaxed text-[var(--ink-soft)]">
        {{ gallery.intro }}
      </p>
    </div>

    <ul v-if="events.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      <li
        v-for="event in events"
        :key="event.title"
        class="hover-card group flex flex-col overflow-hidden rounded-[1.2rem] border border-[var(--line-strong)] bg-[var(--surface)] shadow-[0_14px_34px_rgba(32,24,16,0.07)]"
      >
        <button
          type="button"
          class="flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--accent)]"
          :aria-label="`View ${photosOf(event).length} photos from ${event.title}`"
          @click="openViewer(event, $event.currentTarget)"
        >
          <span class="relative block aspect-[4/3] w-full overflow-hidden bg-[var(--surface-panel-soft)]">
            <img
              v-if="coverOf(event)"
              :src="coverOf(event)"
              alt=""
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              loading="lazy"
              decoding="async"
            />
            <span
              v-if="yearOf(event)"
              class="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[0.68rem] font-semibold tracking-[0.08em] text-white backdrop-blur"
              aria-hidden="true"
            >
              {{ yearOf(event) }}
            </span>
            <span
              class="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="11" r="2" />
                <path d="m21 17-5-5-8 7" />
              </svg>
              {{ photosOf(event).length }}
            </span>
          </span>
          <span class="flex flex-1 flex-col gap-1 px-3 py-2.5 sm:px-4 sm:py-3">
            <span class="line-clamp-2 text-sm leading-snug font-semibold text-[var(--ink-strong)]">
              {{ event.shortTitle || event.title }}
            </span>
            <span v-if="event.date" class="text-xs text-[var(--ink-muted)]">{{ event.date }}</span>
          </span>
        </button>
        <a
          v-if="event.related"
          :href="event.related.href"
          class="border-t border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--surface-raised)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--accent)] sm:px-4"
        >
          {{ event.related.label }} →
        </a>
      </li>
    </ul>

    <p
      v-if="!events.length"
      class="w-fit rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]"
    >
      Add photos soon
    </p>

    <Teleport to="body">
      <div
        v-if="openEvent"
        class="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="`Photos: ${openEvent.title}`"
        @click.self="closeViewer"
      >
        <div class="flex max-h-full w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-[1.4rem] border border-white/10 bg-[#101614]/90 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <div class="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
            <div class="min-w-0">
              <p class="text-sm font-semibold leading-snug text-white">{{ openEvent.title }}</p>
              <p v-if="openEvent.meta" class="pt-0.5 text-xs text-white/75">{{ openEvent.meta }}</p>
            </div>
            <button
              ref="closeButtonRef"
              type="button"
              class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              aria-label="Close photos"
              @click="closeViewer"
            >
              ✕
            </button>
          </div>

          <div ref="viewerPhotoArea" class="relative flex-none bg-black/30">
            <div class="grid place-items-center p-3 sm:p-4">
              <img
                v-if="current?.src"
                :key="current.src"
                :src="current.src"
                :alt="current.alt || current.title || 'Event photo'"
                class="max-h-[max(12rem,min(68vh,calc(100dvh-19rem)))] w-full object-contain"
                decoding="async"
              />
            </div>

            <div v-if="hasMultiplePhotos" class="pointer-events-none absolute inset-0 flex items-center justify-between px-2.5 sm:px-3.5">
              <button
                type="button"
                class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                aria-label="Previous photo"
                @click="goPrev"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                  <path d="M10.5 3.5 6 8l4.5 4.5" />
                </svg>
              </button>
              <button
                type="button"
                class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                aria-label="Next photo"
                @click="goNext"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
                  <path d="M5.5 12.5 10 8 5.5 3.5" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2 border-t border-white/10 px-4 py-3 sm:px-5">
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="current?.title"
                class="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white"
              >
                {{ current.title }}
              </span>
              <span v-if="current?.meta && current.meta !== openEvent.title" class="text-xs text-white/75">{{ current.meta }}</span>
              <span v-if="hasMultiplePhotos" class="ml-auto flex items-center gap-1.5" aria-hidden="true">
                <span
                  v-for="(photo, index) in viewerPhotos"
                  :key="photo.src"
                  class="h-1.5 rounded-full transition-all"
                  :class="index === activePhoto ? 'w-4 bg-white' : 'w-1.5 bg-white/35'"
                />
              </span>
            </div>
            <p v-if="current?.alt" class="line-clamp-3 text-sm leading-relaxed text-white/90">{{ current.alt }}</p>
            <p class="sr-only" aria-live="polite">Photo {{ activePhoto + 1 }} of {{ photoCount }}</p>
            <a
              v-if="openEvent.related"
              :href="openEvent.related.href"
              class="w-fit text-sm font-semibold text-[#6fd2bb] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              @click="followRelated"
            >
              {{ openEvent.related.label }} →
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
