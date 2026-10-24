<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
})

const { el } = useScrollReveal()

// Phones get a compact portrait beside the name; only one <img> is rendered so only one is downloaded.
const desktopQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)') : null
const isDesktop = ref(desktopQuery?.matches ?? true)
const onDesktopChange = (event) => {
  isDesktop.value = event.matches
}
desktopQuery?.addEventListener('change', onDesktopChange)


const scheduleCallHref = computed(() => {
  const schedulingUrl = props.profile?.scheduleCallUrl
  if (typeof schedulingUrl === 'string' && /^https?:\/\//i.test(schedulingUrl)) return schedulingUrl

  const href = props.profile?.contactHref
  if (typeof href !== 'string' || !href.startsWith('mailto:')) return '#contact'
  const hasQuery = href.includes('?')
  const prefix = hasQuery ? '&' : '?'
  const subject = encodeURIComponent('Schedule a call')
  const body = encodeURIComponent('Hi Gian — I’d like to schedule a quick call. What times work for you?')
  return `${href}${prefix}subject=${subject}&body=${body}`
})

onBeforeUnmount(() => {
  desktopQuery?.removeEventListener('change', onDesktopChange)
})
</script>

<template>
  <section
    ref="el"
    id="top"
    class="section-shell relative grid items-start gap-6 overflow-hidden rounded-[2rem] border border-[var(--line-strong)] bg-[var(--surface)] px-5 pt-6 pb-4 shadow-[0_30px_80px_rgba(35,26,18,0.08)] sm:px-8 sm:pt-8 sm:pb-5 md:grid-cols-[minmax(220px,0.42fr)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,1fr)] lg:gap-8 lg:px-12 lg:pt-10 lg:pb-5"
  >
    <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(27,110,97,0.4),transparent)]" />

    <div class="relative order-2 grid items-start gap-3 md:order-1">
      <div
        class="motion-card absolute -right-10 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(27,110,97,0.25),_transparent_70%)] blur-2xl"
      />
      <div
        class="motion-card absolute -left-6 bottom-4 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(186,111,77,0.22),_transparent_70%)] blur-2xl"
      />

      <figure
        v-if="isDesktop"
        class="relative mx-auto w-full max-w-[16.5rem] self-start overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-panel-strong)] shadow-[0_20px_44px_rgba(36,26,18,0.1)] sm:max-w-[17.5rem] md:mx-0 md:max-w-[15.5rem] lg:max-w-[17rem]"
      >
        <div class="relative aspect-[3/4] w-full overflow-hidden rounded-[1.45rem]">
          <img
            :src="profile.photo.fallbackSrc || profile.photo.src"
            :srcset="profile.photo.srcSet || undefined"
            :sizes="profile.photo.sizes || undefined"
            :alt="profile.photo.alt"
            class="absolute inset-0 h-full w-full object-cover object-[center_8%]"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />

          <div class="pointer-events-none absolute bottom-3 right-3 z-[2]">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1.5 text-[0.72rem] font-semibold text-white shadow-[0_12px_26px_rgba(0,0,0,0.18)] backdrop-blur"
            >
              <span class="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
              <span>Open to roles</span>
            </span>
          </div>

          <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent_40%,rgba(0,0,0,0.22))]" />
        </div>
      </figure>

      <!-- Mini Stats Strip — fills space below photo -->
      <div
        class="mt-2 grid grid-cols-3 divide-x divide-[var(--line)] overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-panel-soft)]"
      >
        <div class="flex flex-col items-center px-2 py-3 text-center">
          <span class="text-2xl font-bold text-[var(--ink-strong)]" style="font-family: var(--font-heading)">3+</span>
          <span class="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]"
            >Yrs Exp</span
          >
        </div>

        <div class="flex flex-col items-center px-2 py-3 text-center">
          <span class="text-2xl font-bold text-[var(--ink-strong)]" style="font-family: var(--font-heading)">7+</span>
          <span class="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]"
            >Projects</span
          >
        </div>

        <div class="flex flex-col items-center px-2 py-3 text-center">
          <span class="text-2xl font-bold text-[var(--ink-strong)]" style="font-family: var(--font-heading)">2</span>
          <span class="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]"
            >Talks</span
          >
        </div>
      </div>

      <!-- Availability pill — sits below stats -->
      <div class="mt-2 grid gap-2">
        <div
          class="flex items-center justify-between rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-panel-soft)] px-4 py-2.5"
        >
          <div class="flex items-center gap-2">
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--accent)]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 21s7-4.35 7-11a7 7 0 0 0-14 0c0 6.65 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <span class="text-sm font-medium text-[var(--ink-strong)]">
              {{ profile.location || 'Davao City, Philippines' }}
            </span>
          </div>
        </div>

        <a
          :href="scheduleCallHref"
          class="group flex items-center rounded-[1.2rem] border border-[var(--accent)]/28 bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface-panel-soft))] px-4 py-2.5 text-[var(--ink-strong)] transition hover:-translate-y-[1px] hover:border-[var(--accent)]/45 hover:bg-[color-mix(in_oklab,var(--accent)_14%,var(--surface-panel))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:translate-y-0"
          :target="scheduleCallHref.startsWith('http') ? '_blank' : undefined"
          :rel="scheduleCallHref.startsWith('http') ? 'noopener noreferrer' : undefined"
        >
          <div class="flex items-center gap-2">
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--surface-raised)] text-[var(--accent)]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M8 2v3M16 2v3" />
                <path d="M3.5 9h17" />
                <path d="M6 4h12a2 2 0 0 1 2 2v13.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                <path d="M8.5 13.25h7" />
                <path d="M8.5 16.75h7" />
              </svg>
            </span>
            <span class="text-sm font-medium text-[var(--accent)]">Discuss opportunities</span>
          </div>
        </a>
      </div>
    </div>

    <div class="relative z-10 order-1 flex w-full min-w-0 flex-col gap-5 md:order-2">
      <div class="w-full">
        <p class="section-label text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
          Portfolio
        </p>

        <div class="mt-3 flex w-full flex-col gap-3 sm:mt-4 sm:gap-4">
          <div class="flex w-full items-center gap-4">
            <figure
              v-if="!isDesktop"
              class="relative h-24 w-[4.5rem] flex-none overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-panel-strong)] shadow-[0_12px_28px_rgba(36,26,18,0.12)]"
            >
              <img
                :src="profile.photo.fallbackSrc || profile.photo.src"
                :srcset="profile.photo.srcSet || undefined"
                sizes="72px"
                :alt="profile.photo.alt"
                class="h-full w-full object-cover object-[center_8%]"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </figure>
            <div class="flex min-w-0 flex-1 flex-col gap-1 sm:gap-1.5">
              <h1 class="w-full font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--ink-strong)]">
                <span class="block gradient-text text-[clamp(1.55rem,3.6vw,2.65rem)]">
                  {{ profile.heroTitleLines?.[0] || profile.name }}
                </span>
              </h1>

              <p class="text-lg font-semibold leading-snug text-[var(--ink-strong)] sm:text-xl">
                {{ profile.heroTitleLines?.[1] || 'Software Developer · Researcher' }}
              </p>
              <span
                v-if="!isDesktop"
                class="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-600/25 bg-green-500/10 px-2.5 py-1 text-[0.7rem] font-semibold text-[var(--ink-strong)]"
              >
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" aria-hidden="true"></span>
                Open to roles
              </span>
            </div>
          </div>

          <div
            v-if="
              profile.introParagraphs?.length ||
              profile.intro ||
              profile.heroSecondary ||
              profile.heroFocusAreas?.length
            "
            class="flex w-full flex-col gap-3"
          >
            <div
              v-if="profile.introParagraphs?.length"
              class="flex max-w-prose flex-col gap-3 text-sm leading-6 text-[var(--ink-soft)] text-pretty hyphens-none sm:text-base sm:leading-7"
              lang="en"
            >
              <p v-for="(paragraph, idx) in profile.introParagraphs" :key="idx" class="hyphens-none">
                {{ paragraph }}
              </p>
            </div>
            <p
              v-else-if="profile.intro"
              class="max-w-prose text-sm leading-6 text-[var(--ink-soft)] text-pretty hyphens-none sm:text-base sm:leading-7"
              lang="en"
            >
              {{ profile.intro }}
            </p>

            <p
              v-if="profile.heroSecondary"
              class="max-w-prose hyphens-none text-pretty text-sm leading-6 text-[var(--ink-muted)] sm:leading-7"
            >
              {{ profile.heroSecondary }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="profile.heroHighlights?.length"
        class="w-full"
      >
        <p class="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">At a glance</p>

        <div class="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
        <component
          :is="item.label === 'Stack' ? 'a' : 'div'"
          v-for="item in profile.heroHighlights"
          :key="item.label"
          :href="item.label === 'Stack' ? '#capabilities' : undefined"
          class="group relative block min-w-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-panel-soft)]/80 px-4 py-3 transition sm:rounded-[1rem]"
          :class="item.label === 'Stack' ? 'hover:-translate-y-0.5 hover:border-[var(--accent)]/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]' : ''"
        >
          <span
            aria-hidden="true"
            class="absolute inset-x-0 top-0 h-0.5 opacity-70"
            :class="{
              'bg-green-500/60': item.label === 'Now',
              'bg-[var(--accent)]/55': item.label === 'Stack',
              'bg-[var(--warm)]/55': item.label === 'Domain',
              'bg-[var(--line)]': !['Now', 'Stack', 'Domain'].includes(item.label),
            }"
          />
          <p class="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm leading-6 text-[var(--ink-strong)]">
            {{ item.value }}<br />
            <span v-if="item.detail" class="text-[var(--ink-muted)]">{{ item.detail }}</span>
            <span
              v-if="item.label === 'Stack'"
              class="mt-2 flex w-fit items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
            >
              See all skills
              <span aria-hidden="true">↓</span>
            </span>
          </p>
        </component>
        </div>
      </div>

      <div class="flex flex-wrap gap-2.5">
        <a
          href="#projects"
          class="btn-primary inline-flex items-center gap-2 justify-center rounded-full px-6 py-3.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          View work
          <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>

        <a
          :href="profile.resumeUrl"
          class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          Resume
        </a>

        <a
          v-for="link in profile.socialLinks"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
        >
          <svg
            v-if="link.label === 'LinkedIn'"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="mr-2 h-4 w-4"
            fill="currentColor"
          >
            <path
              d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.65H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0Z"
            />
          </svg>
          <svg
            v-else-if="link.label === 'GitHub'"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="mr-2 h-4 w-4"
            fill="currentColor"
          >
            <path
              d="M12 0C5.37 0 0 5.5 0 12.29c0 5.43 3.44 10.04 8.2 11.67.6.11.82-.27.82-.6 0-.29-.01-1.05-.02-2.06-3.34.75-4.04-1.66-4.04-1.66-.55-1.41-1.34-1.78-1.34-1.78-1.09-.77.08-.76.08-.76 1.2.09 1.84 1.26 1.84 1.26 1.07 1.88 2.8 1.34 3.49 1.03.11-.8.42-1.35.76-1.66-2.66-.31-5.47-1.36-5.47-6.05 0-1.34.46-2.44 1.23-3.3-.12-.31-.53-1.57.12-3.27 0 0 1.01-.33 3.3 1.26.96-.27 1.99-.41 3.01-.41 1.02 0 2.05.14 3.01.41 2.29-1.59 3.3-1.26 3.3-1.26.65 1.7.24 2.96.12 3.27.77.86 1.23 1.96 1.23 3.3 0 4.7-2.81 5.74-5.49 6.04.43.38.81 1.13.81 2.28 0 1.65-.02 2.98-.02 3.39 0 .33.22.71.82.6 4.77-1.63 8.2-6.24 8.2-11.67C24 5.5 18.63 0 12 0Z"
            />
          </svg>
          {{ link.label }}
        </a>
      </div>
    </div>

  </section>
</template>
