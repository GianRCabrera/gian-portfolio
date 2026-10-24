<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'
import { profile } from '../../data/portfolio'

const props = defineProps({
  projects: {
    type: Array,
    required: true,
  },
})

const { el } = useScrollReveal()

const featuredProjects = computed(() => props.projects.filter((project) => project.featured))
const primaryProject = computed(
  () => featuredProjects.value.find((project) => project.primary) || featuredProjects.value[0],
)
const secondaryProjects = computed(() =>
  featuredProjects.value.filter((project) => project.slug !== primaryProject.value?.slug),
)

const featuredSlides = computed(() => {
  const raw = primaryProject.value?.featuredSlides
  return Array.isArray(raw) ? raw.filter(Boolean) : []
})

const activeSlide = ref(0)

const slideCount = computed(() => featuredSlides.value.length)
const currentSlide = computed(() => featuredSlides.value[activeSlide.value] ?? null)
const carouselEnabled = computed(() => slideCount.value > 0)
const showCarouselControls = computed(() => slideCount.value > 1)

const goToSlide = (index) => {
  if (!slideCount.value) return
  const next = Math.max(0, Math.min(index, slideCount.value - 1))
  activeSlide.value = next
}

const goPrevSlide = () => {
  if (!slideCount.value) return
  activeSlide.value = (activeSlide.value - 1 + slideCount.value) % slideCount.value
}

const goNextSlide = () => {
  if (!slideCount.value) return
  activeSlide.value = (activeSlide.value + 1) % slideCount.value
}

const prevSlideIndex = computed(() => {
  if (!slideCount.value) return -1
  return (activeSlide.value - 1 + slideCount.value) % slideCount.value
})

const nextSlideIndex = computed(() => {
  if (!slideCount.value) return -1
  return (activeSlide.value + 1) % slideCount.value
})

const prevSlide = computed(() => featuredSlides.value[prevSlideIndex.value] ?? null)
const nextSlide = computed(() => featuredSlides.value[nextSlideIndex.value] ?? null)

const onCarouselKeydown = (event) => {
  if (!showCarouselControls.value) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrevSlide()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNextSlide()
  }
}

const isCaseStudyOpen = ref(false)
const selectedProject = ref(null)
const closeButtonRef = ref(null)

const requestOverviewHref = (project) => {
  const base = profile.contactHref || 'mailto:'
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}subject=${encodeURIComponent(`Overview: ${project.title}`)}`
}

const cardKindLabel = (project) => project.cardKind || project.typeLabel

/** Placeholder preview: `chart` (dashboard) vs `form` (event / registration). */
const previewAccent = (project) => project.previewAccent ?? 'chart'
const chartVariant = (project) => project.chartVariant ?? 'line'

const spotlightItems = computed(() => {
  const s = primaryProject.value?.spotlight
  if (!s) return []

  const items = [
    { label: 'Outcome', value: s.outcome },
    { label: 'My role', value: s.role },
    { label: 'Constraints', value: s.constraints },
  ]

  return items.filter((item) => typeof item.value === 'string' && item.value.trim().length)
})

const stackGroupsFor = (project) => {
  const g = project.stackGroups
  if (!g) return null
  const tech = Array.isArray(g.tech) ? g.tech : []
  const domain = Array.isArray(g.domain) ? g.domain : []
  if (!tech.length && !domain.length) return null
  return { tech, domain }
}

const openCaseStudy = async (project) => {
  selectedProject.value = project
  isCaseStudyOpen.value = true
  await nextTick()
  closeButtonRef.value?.focus?.()
}

const closeCaseStudy = () => {
  isCaseStudyOpen.value = false
}

/** Full-screen view of a project card's screenshot. */
const zoomedProject = ref(null)
const zoomCloseRef = ref(null)

const openZoom = async (project) => {
  zoomedProject.value = project
  await nextTick()
  zoomCloseRef.value?.focus?.()
}

const closeZoom = () => {
  zoomedProject.value = null
}

const onKeydown = (event) => {
  if (event.key !== 'Escape') return
  if (zoomedProject.value) {
    event.preventDefault()
    closeZoom()
  } else if (isCaseStudyOpen.value) {
    event.preventDefault()
    closeCaseStudy()
  }
}

watch([isCaseStudyOpen, zoomedProject], ([caseStudyOpen, zoomed]) => {
  document.body.style.overflow = caseStudyOpen || zoomed ? 'hidden' : ''
})

watch(primaryProject, () => {
  activeSlide.value = 0
})

window.addEventListener('keydown', onKeydown)

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section ref="el" id="projects" class="section-shell space-y-10 border-t border-[var(--line)] pt-9 sm:pt-10">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div class="max-w-3xl space-y-3">
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Work
        </p>
        <h2 class="text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
          Projects.
        </h2>
        <p class="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">
          Selected work across real reporting workflows, data-heavy interfaces, and product features that hold up in production.
        </p>
      </div>
    </div>

    <article
      v-if="primaryProject"
      class="grid gap-6 rounded-[2rem] border border-[var(--line-strong)] bg-[var(--surface)] p-6 shadow-[0_30px_80px_rgba(35,26,18,0.08)] lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:p-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
    >
      <div class="space-y-5">
        <div class="flex flex-wrap items-center gap-3">
          <span
            class="rounded-full bg-[var(--button-primary-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--button-primary-text)]"
          >
            Featured Project
          </span>
          <span class="rounded-full border border-[var(--line)] bg-[var(--surface-panel)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {{ primaryProject.typeLabel }}
          </span>
        </div>

        <div class="space-y-3">
          <h3 class="text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
            {{ primaryProject.title }}
          </h3>
          <p class="text-sm font-medium text-[var(--ink-muted)]">
            {{ primaryProject.role }}
          </p>
          <p class="text-base leading-7 text-[var(--ink-soft)]">
            {{ primaryProject.context }}
          </p>
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            {{ primaryProject.resultLabel }}
          </p>
        </div>

        <figure class="group overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface-panel-soft)]">
          <div
            v-if="carouselEnabled"
            class="relative overflow-hidden"
            role="region"
            :aria-label="`Preview carousel: ${primaryProject.title}`"
            tabindex="0"
            @keydown="onCarouselKeydown"
          >
            <div class="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
              <div
                class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.20),transparent_58%),radial-gradient(circle_at_25%_20%,rgba(27,110,97,0.14),transparent_55%),radial-gradient(circle_at_75%_85%,rgba(186,111,77,0.12),transparent_60%)]"
                aria-hidden="true"
              />
              <img
                v-if="showCarouselControls"
                :src="prevSlide?.src"
                :alt="prevSlide?.alt || 'Previous preview'"
                class="pointer-events-none absolute left-0 top-1/2 z-[1] hidden h-[82%] w-auto max-w-[44%] -translate-x-[18%] -translate-y-1/2 object-contain opacity-20 grayscale blur-[0.5px] sm:block"
                style="mask-image: linear-gradient(90deg, transparent 0%, black 22%, black 100%); -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 22%, black 100%);"
                loading="lazy"
                aria-hidden="true"
              />

              <div
                class="absolute left-1/2 top-1/2 z-[2] h-[96%] w-[60%] max-w-[62%] -translate-x-1/2 -translate-y-1/2 sm:w-[56%] sm:max-w-[58%]"
              >
                <div class="relative h-full w-full overflow-hidden rounded-[1.55rem] border border-white/10 bg-black/15 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
                  <div class="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_18px_40px_rgba(0,0,0,0.26)]" aria-hidden="true" />
                  <div class="pointer-events-none absolute left-1/2 top-3 h-1 w-14 -translate-x-1/2 rounded-full bg-white/10" aria-hidden="true" />
                  <div class="absolute inset-2.5 overflow-hidden rounded-[1.25rem] bg-black/15">
                    <img
                      :src="currentSlide?.src"
                      :alt="currentSlide?.alt || primaryProject.featuredImageAlt || `${primaryProject.title} screenshot`"
                      class="h-full w-full object-contain contrast-[1.08] saturate-[1.06]"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <img
                v-if="showCarouselControls"
                :src="nextSlide?.src"
                :alt="nextSlide?.alt || 'Next preview'"
                class="pointer-events-none absolute right-0 top-1/2 z-[1] hidden h-[82%] w-auto max-w-[44%] translate-x-[18%] -translate-y-1/2 object-contain opacity-20 grayscale blur-[0.5px] sm:block"
                style="mask-image: linear-gradient(270deg, transparent 0%, black 22%, black 100%); -webkit-mask-image: linear-gradient(270deg, transparent 0%, black 22%, black 100%);"
                loading="lazy"
                aria-hidden="true"
              />
            </div>

            <div v-if="showCarouselControls" class="pointer-events-none absolute inset-0 z-[10] flex items-center justify-between px-3">
              <button
                type="button"
                class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/30 text-white shadow-[0_14px_30px_rgba(0,0,0,0.25)] backdrop-blur transition hover:scale-[1.03] hover:bg-black/40 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                aria-label="Previous preview"
                @click="goPrevSlide"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/30 text-white shadow-[0_14px_30px_rgba(0,0,0,0.25)] backdrop-blur transition hover:scale-[1.03] hover:bg-black/40 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                aria-label="Next preview"
                @click="goNextSlide"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>

            <div v-if="showCarouselControls" class="pointer-events-none absolute bottom-4 left-0 right-0 z-[12] flex justify-center">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 shadow-[0_10px_26px_rgba(0,0,0,0.28)] backdrop-blur">
                <span class="max-w-[12rem] truncate">{{ currentSlide?.caption || 'Preview' }}</span>
                <span class="text-white/55">·</span>
                <span>{{ activeSlide + 1 }} / {{ slideCount }}</span>
              </div>
            </div>
          </div>

          <div v-else class="overflow-hidden">
            <img
              v-if="primaryProject.featuredImage"
              :src="primaryProject.featuredImage"
              :alt="primaryProject.featuredImageAlt || `${primaryProject.title} screenshot`"
              class="aspect-[16/10] w-full bg-[var(--surface-raised)] object-contain"
              loading="lazy"
            />
            <div
              v-else
              class="flex aspect-[16/10] w-full flex-col items-center justify-center gap-4 bg-[var(--surface-raised)] px-8 text-center"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                {{ primaryProject.typeLabel }}
              </p>
              <p class="text-lg font-semibold text-[var(--ink-strong)]">{{ primaryProject.title }}</p>
              <div class="flex flex-wrap justify-center gap-2">
                <span
                  v-for="tag in primaryProject.stack.slice(0, 4)"
                  :key="tag"
                  class="rounded-full border border-[var(--line)] bg-[var(--surface-panel)] px-3 py-1 text-xs text-[var(--ink-muted)]"
                >{{ tag }}</span>
              </div>
              <p class="text-xs text-[var(--ink-muted)] opacity-60">Screenshot coming soon</p>
            </div>
          </div>

          <figcaption class="sr-only">
            {{ currentSlide?.caption || primaryProject.featuredImageCaption || primaryProject.title }}
          </figcaption>
        </figure>

      </div>

      <div class="flex h-full flex-col rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-panel-soft)] p-5 text-[var(--ink-strong)]">
        <p class="text-label text-[var(--accent)]">
          Project overview
        </p>
        <p class="mt-3 text-base leading-7 text-[var(--ink-soft)]">
          {{ primaryProject.summary }}
        </p>

        <dl v-if="spotlightItems.length" class="mt-5 grid gap-4 rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-panel)] p-4">
          <div
            v-for="(item, index) in spotlightItems"
            :key="item.label"
            class="grid gap-1.5 pb-4"
            :class="index === spotlightItems.length - 1 ? 'pb-0' : 'border-b border-[var(--line)]'"
          >
            <dt class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              {{ item.label }}
            </dt>
            <dd class="text-sm font-medium leading-6 text-[var(--ink-strong)]">
              {{ item.value }}
            </dd>
          </div>
        </dl>

        <div class="mt-6 flex flex-wrap gap-2">
          <span
            v-for="item in primaryProject.stack"
            :key="item"
            class="rounded-full border border-[var(--line)] bg-[var(--surface-panel)] px-3 py-1.5 text-sm text-[var(--ink-strong)]"
          >
            {{ item }}
          </span>
        </div>

        <div class="mt-auto flex flex-wrap gap-3 pt-8">
          <a
            v-if="primaryProject.repoUrl"
            :href="primaryProject.repoUrl"
            target="_blank"
            rel="noreferrer"
            class="btn-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            Source code
          </a>
          <a
            v-if="primaryProject.caseStudyUrl"
            :href="primaryProject.caseStudyUrl"
            class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
          >
            Case study →
          </a>
          <button
            v-else
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
            @click="openCaseStudy(primaryProject)"
          >
            Case study →
          </button>
        </div>
      </div>
    </article>

    <Teleport to="body">
      <div
        v-if="isCaseStudyOpen && selectedProject"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
        @click.self="closeCaseStudy"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div
          role="dialog"
          aria-modal="true"
          class="relative z-[61] w-full max-w-3xl overflow-hidden rounded-[1.8rem] border border-[var(--line-strong)] bg-[var(--surface)] shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
        >
          <div class="flex items-start justify-between gap-4 border-b border-[var(--line)] p-6 sm:p-8">
            <div class="min-w-0">
              <p class="text-label text-[var(--accent)]">Case study</p>
              <h3 class="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-strong)] sm:text-3xl">
                {{ selectedProject.title }}
              </h3>
              <p class="mt-2 text-sm text-[var(--ink-muted)]">
                {{ selectedProject.role }}
              </p>
            </div>
            <button
              ref="closeButtonRef"
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-panel)] text-[var(--ink-strong)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Close case study"
              @click="closeCaseStudy"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="max-h-[70vh] overflow-auto p-6 sm:p-8">
            <div class="grid gap-6">
              <div>
                <p class="text-label text-[var(--ink-soft)]">Problem</p>
                <p class="mt-2 text-base leading-7 text-[var(--ink-soft)]">
                  {{ selectedProject.context }}
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-raised)] p-5">
                  <p class="text-label text-[var(--ink-soft)]">Solution</p>
                  <p class="mt-2 text-sm leading-6 text-[var(--ink-strong)]">
                    {{ selectedProject.contribution }}
                  </p>
                </div>
                <div class="rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-raised)] p-5">
                  <p class="text-label text-[var(--ink-soft)]">Impact</p>
                  <p class="mt-2 text-sm leading-6 text-[var(--ink-strong)]">
                    {{ selectedProject.impact }}
                  </p>
                </div>
              </div>

              <div>
                <p class="text-label text-[var(--ink-soft)]">Stack</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="item in selectedProject.stack"
                    :key="item"
                    class="rounded-full border border-[var(--line)] bg-[var(--surface-panel)] px-3 py-1.5 text-sm text-[var(--ink-strong)]"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <div v-if="selectedProject.screens?.length" class="space-y-3">
                <p class="text-label text-[var(--ink-soft)]">Screens</p>
                <div class="grid gap-4 sm:grid-cols-2">
                  <figure
                    v-for="screen in selectedProject.screens"
                    :key="screen.src"
                    class="overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-panel-soft)]"
                  >
                    <img :src="screen.src" :alt="screen.alt" class="aspect-[16/10] w-full object-cover" loading="lazy" />
                    <figcaption v-if="screen.caption" class="border-t border-[var(--line)] px-4 py-3 text-[0.72rem] text-[var(--ink-muted)]">
                      {{ screen.caption }}
                    </figcaption>
                  </figure>
                </div>
              </div>

              <div class="flex flex-wrap gap-3 pt-2">
                <a
                  v-if="selectedProject.repoUrl"
                  :href="selectedProject.repoUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  Source code
                </a>
                <a
                  v-if="selectedProject.caseStudyUrl"
                  :href="selectedProject.caseStudyUrl"
                  :target="selectedProject.caseStudyUrl.startsWith('/') ? undefined : '_blank'"
                  :rel="selectedProject.caseStudyUrl.startsWith('/') ? undefined : 'noreferrer'"
                  class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
                >
                  {{ selectedProject.caseStudyUrl.startsWith('/') ? 'Read full case study →' : 'External case study →' }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="zoomedProject"
        class="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="`${zoomedProject.title} screenshot`"
        @click.self="closeZoom"
      >
        <div class="w-full max-w-5xl overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/40 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
          <div class="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
            <p class="min-w-0 truncate text-sm font-semibold text-white">{{ zoomedProject.title }}</p>
            <button
              ref="zoomCloseRef"
              type="button"
              class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              aria-label="Close screenshot"
              @click="closeZoom"
            >
              ✕
            </button>
          </div>
          <div class="grid place-items-center bg-black/30 p-3 sm:p-4">
            <img
              :src="zoomedProject.cardImage"
              :alt="`${zoomedProject.title} screenshot`"
              class="max-h-[78vh] w-full object-contain"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <div class="border-t border-[var(--line)] pt-10">
      <div class="flex items-center justify-between">
        <div>
          <p class="section-label text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Other selected projects
          </p>
          <p class="mt-2 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
            Additional projects across dashboards, reporting workflows, and event websites.
          </p>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-6">
        <article
          v-for="project in secondaryProjects"
          :key="project.slug"
          :class="[
            'secondary-project-card group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border bg-[var(--surface-panel-soft)] text-[var(--ink-strong)] shadow-[0_22px_54px_rgba(32,24,16,0.11)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform',
            project.highlightSecondary
              ? 'border-[var(--line-strong)] shadow-[0_28px_72px_rgba(32,24,16,0.14)] ring-1 ring-[var(--accent)]/22 hover:z-10 hover:-translate-y-1.5 hover:shadow-[0_38px_92px_rgba(27,110,97,0.12),0_38px_92px_rgba(32,24,16,0.18)] hover:ring-[var(--accent)]/32 lg:scale-[1.01]'
              : 'border-[var(--line-strong)] hover:z-[1] hover:-translate-y-1.5 hover:shadow-[0_32px_78px_rgba(32,24,16,0.17)] hover:ring-1 hover:ring-[var(--accent)]/22',
          ]"
        >
          <div class="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
            <div class="relative h-full w-full overflow-hidden">
              <button
                v-if="project.cardImage"
                type="button"
                class="group/zoom block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--accent)]"
                :aria-label="`Enlarge ${project.title} screenshot`"
                @click="openZoom(project)"
              >
                <img
                  :src="project.cardImage"
                  :alt="`${project.title} preview`"
                  class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
                <span
                  class="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[0.68rem] font-semibold text-white backdrop-blur transition sm:opacity-0 sm:group-hover/zoom:opacity-100 sm:group-focus-visible/zoom:opacity-100"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 21l-4.3-4.3" />
                    <circle cx="11" cy="11" r="7" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                  Enlarge
                </span>
              </button>
              <div
                v-else
                class="preview-mock-zoom relative h-full min-h-[168px] w-full transition-transform duration-500 ease-out group-hover:scale-[1.045] motion-reduce:group-hover:scale-100"
                aria-hidden="true"
              >
                <div
                  class="absolute inset-0 opacity-[0.2]"
                  style="
                    background-image: radial-gradient(circle at 1px 1px, var(--ink-muted) 1px, transparent 0);
                    background-size: 16px 16px;
                  "
                />
                <svg
                  viewBox="0 0 320 200"
                  class="absolute inset-x-3 inset-y-6 h-[calc(100%-3rem)] w-[calc(100%-1.5rem)] text-[var(--accent)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient :id="`wf-fade-${project.slug}`" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="currentColor" stop-opacity="0.42" />
                      <stop offset="100%" stop-color="currentColor" stop-opacity="0.12" />
                    </linearGradient>
                    <linearGradient :id="`wf-area-${project.slug}`" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="currentColor" stop-opacity="0.38" />
                      <stop offset="100%" stop-color="currentColor" stop-opacity="0.04" />
                    </linearGradient>
                  </defs>
                  <rect x="8" y="8" width="140" height="12" rx="3" fill="currentColor" opacity="0.34" />
                  <rect x="156" y="8" width="156" height="12" rx="3" fill="currentColor" opacity="0.22" />
                  <rect x="8" y="32" width="304" height="92" rx="6" stroke="currentColor" stroke-width="1.75" opacity="0.58" />
                  <rect
                    x="20"
                    y="46"
                    width="88"
                    height="68"
                    rx="4"
                    :fill="`url(#wf-fade-${project.slug})`"
                    opacity="0.72"
                  />
                  <circle cx="28" cy="58" r="2.5" fill="currentColor" opacity="0.45" />
                  <circle cx="28" cy="70" r="2.5" fill="currentColor" opacity="0.28" />
                  <circle cx="28" cy="82" r="2.5" fill="currentColor" opacity="0.28" />
                  <rect x="36" y="54" width="64" height="5" rx="1.5" fill="currentColor" opacity="0.22" />
                  <rect x="36" y="66" width="48" height="5" rx="1.5" fill="currentColor" opacity="0.18" />

                  <!-- Recognizable UI: chart (trend or bars) or registration form -->
                  <g v-if="previewAccent(project) === 'chart' && chartVariant(project) === 'bars'">
                    <rect x="118" y="112" width="18" height="22" rx="2" fill="currentColor" opacity="0.52" />
                    <rect x="142" y="98" width="18" height="36" rx="2" fill="currentColor" opacity="0.62" />
                    <rect x="166" y="104" width="18" height="30" rx="2" fill="currentColor" opacity="0.48" />
                    <rect x="190" y="92" width="18" height="42" rx="2" fill="currentColor" opacity="0.68" />
                    <rect x="214" y="100" width="18" height="34" rx="2" fill="currentColor" opacity="0.55" />
                    <rect x="238" y="88" width="18" height="46" rx="2" fill="currentColor" opacity="0.58" />
                    <rect x="262" y="96" width="18" height="38" rx="2" fill="currentColor" opacity="0.5" />
                    <path
                      d="M116 124h188"
                      stroke="currentColor"
                      stroke-width="1.2"
                      opacity="0.35"
                      stroke-linecap="round"
                    />
                  </g>
                  <g v-else-if="previewAccent(project) === 'chart'">
                    <path
                      :fill="`url(#wf-area-${project.slug})`"
                      d="M118 108 L132 96 L154 102 L176 88 L198 94 L220 82 L242 90 L264 78 L286 84 L286 118 L118 118 Z"
                      opacity="0.95"
                    />
                    <path
                      d="M118 108 L132 96 L154 102 L176 88 L198 94 L220 82 L242 90 L264 78 L286 84"
                      stroke="currentColor"
                      stroke-width="2.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      opacity="0.78"
                      fill="none"
                    />
                    <circle cx="132" cy="96" r="3.5" fill="var(--surface)" stroke="currentColor" stroke-width="1.6" />
                    <circle cx="198" cy="94" r="3.5" fill="var(--surface)" stroke="currentColor" stroke-width="1.6" />
                    <circle cx="264" cy="78" r="3.5" fill="var(--surface)" stroke="currentColor" stroke-width="1.6" />
                    <path
                      d="M118 124h172"
                      stroke="currentColor"
                      stroke-width="1.2"
                      opacity="0.32"
                      stroke-linecap="round"
                    />
                  </g>
                  <g v-else-if="previewAccent(project) === 'form'">
                    <rect x="118" y="48" width="182" height="11" rx="2.5" stroke="currentColor" stroke-width="1.4" opacity="0.55" fill="rgba(255,255,255,0.06)" />
                    <rect x="118" y="64" width="182" height="11" rx="2.5" stroke="currentColor" stroke-width="1.4" opacity="0.5" fill="rgba(255,255,255,0.05)" />
                    <rect x="118" y="80" width="182" height="11" rx="2.5" stroke="currentColor" stroke-width="1.4" opacity="0.5" fill="rgba(255,255,255,0.05)" />
                    <rect x="118" y="96" width="182" height="36" rx="3" stroke="currentColor" stroke-width="1.4" opacity="0.45" fill="rgba(255,255,255,0.04)" />
                    <path d="M124 104h168M124 114h120" stroke="currentColor" stroke-width="1" opacity="0.28" stroke-linecap="round" />
                    <rect x="118" y="140" width="88" height="16" rx="4" fill="currentColor" opacity="0.58" />
                    <path
                      d="M142 148h40M152 152h20"
                      stroke="var(--surface)"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      opacity="0.92"
                    />
                  </g>

                  <rect x="20" y="138" width="56" height="44" rx="4" fill="currentColor" opacity="0.22" />
                  <rect x="84" y="138" width="56" height="44" rx="4" fill="currentColor" opacity="0.16" />
                  <rect x="148" y="138" width="56" height="44" rx="4" fill="currentColor" opacity="0.12" />
                  <rect x="212" y="138" width="88" height="44" rx="4" fill="currentColor" opacity="0.18" />
                </svg>
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--surface-panel)]/18 via-transparent to-[var(--surface)]/72"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,0,0,0.10),transparent_55%)]"
                  aria-hidden="true"
                />
              </div>
            </div>

            <span
              class="pointer-events-none absolute left-3 top-3 rounded-md border border-white/25 bg-black/55 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm"
            >
              {{ cardKindLabel(project) }}
            </span>
          </div>

          <div class="flex flex-1 flex-col gap-2.5 p-6">
            <div class="space-y-1.5">
              <p class="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--ink-muted)]/85">
                {{ project.role }}
              </p>
              <h3 class="text-2xl leading-tight font-semibold tracking-[-0.02em] text-[var(--ink-strong)]">
                {{ project.title }}
              </h3>
              <p
                class="text-sm leading-relaxed text-[var(--ink-muted)]"
                :class="project.highlightSecondary ? 'line-clamp-2' : 'line-clamp-3'"
              >
                {{ project.context }}
              </p>
              <p v-if="project.impactLead || project.impact" class="text-sm leading-relaxed text-[var(--ink-soft)] line-clamp-1">
                {{ project.impactLead || project.impact }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="chip in (stackGroupsFor(project)?.tech || project.stack || []).slice(0, project.slug === 'rabdash-dc-chart-maintenance' ? 3 : 2)"
                :key="`${project.slug}-chip-${chip}`"
                class="rounded-full border border-[var(--line-strong)] bg-[var(--surface-raised)] px-3 py-1.5 text-[0.7rem] font-semibold text-[var(--ink-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                {{ chip }}
              </span>
            </div>

            <div class="mt-auto flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                class="btn-primary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(22,55,48,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
                @click="openCaseStudy(project)"
              >
                View details →
              </button>

              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-4 py-2.5 text-xs font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_8px_20px_rgba(32,24,16,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
                style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
              >
                Live site
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
