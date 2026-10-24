<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

defineProps({
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

onBeforeUnmount(() => {
  desktopQuery?.removeEventListener('change', onDesktopChange)
})

const accentFor = (label) =>
  ({
    Now: 'bg-green-500/60',
    Stack: 'bg-[var(--accent)]/55',
    Recognition: 'bg-[var(--warm)]/60',
  })[label] || 'bg-[var(--line)]'
</script>

<template>
  <section
    ref="el"
    id="top"
    class="section-shell relative grid items-start gap-6 overflow-hidden rounded-[2rem] border border-[var(--line-strong)] bg-[var(--surface)] px-5 pt-6 pb-6 shadow-[0_30px_80px_rgba(35,26,18,0.08)] sm:px-8 sm:pt-8 md:grid-cols-[minmax(220px,0.42fr)_minmax(0,1fr)] md:gap-8 lg:grid-cols-[minmax(260px,0.42fr)_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-10"
  >
    <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(27,110,97,0.4),transparent)]" />

    <!-- Portrait + numbers (desktop: left column; phones: after the buttons) -->
    <div class="relative order-2 flex flex-col gap-4 md:order-1">
      <div
        class="motion-card absolute -right-10 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(27,110,97,0.25),_transparent_70%)] blur-2xl"
      />
      <div
        class="motion-card absolute -left-6 bottom-4 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(186,111,77,0.22),_transparent_70%)] blur-2xl"
      />

      <figure
        v-if="isDesktop"
        class="relative w-full max-w-[15.5rem] overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-panel-strong)] shadow-[0_20px_44px_rgba(36,26,18,0.12)] ring-4 ring-[var(--accent)]/10 lg:max-w-[17rem]"
      >
        <img
          :src="profile.photo.fallbackSrc || profile.photo.src"
          :srcset="profile.photo.srcSet || undefined"
          :sizes="profile.photo.sizes || undefined"
          :alt="profile.photo.alt"
          class="aspect-[3/4] w-full object-cover object-[center_22%]"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </figure>

      <dl
        class="relative grid w-full grid-cols-3 divide-x divide-[var(--line)] overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-panel-soft)] md:max-w-[15.5rem] lg:max-w-[17rem]"
      >
        <div class="flex flex-col-reverse items-center px-2 py-3 text-center">
          <dt class="pt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Yrs exp</dt>
          <dd class="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--ink-strong)]">3+</dd>
        </div>
        <div class="flex flex-col-reverse items-center px-2 py-3 text-center">
          <dt class="pt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Projects</dt>
          <dd class="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--ink-strong)]">7+</dd>
        </div>
        <div class="flex flex-col-reverse items-center px-2 py-3 text-center">
          <dt class="pt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">Talks</dt>
          <dd class="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--ink-strong)]">2</dd>
        </div>
      </dl>
    </div>

    <!-- Name, intro, highlights, actions -->
    <div class="relative z-10 order-1 flex w-full min-w-0 flex-col gap-6 md:order-2">
      <div class="flex w-full items-center gap-4 sm:gap-5">
        <figure
          v-if="!isDesktop"
          class="h-24 w-[4.5rem] flex-none overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-panel-strong)] shadow-[0_12px_28px_rgba(36,26,18,0.12)] ring-4 ring-[var(--accent)]/10 sm:h-36 sm:w-28"
        >
          <img
            :src="profile.photo.fallbackSrc || profile.photo.src"
            :srcset="profile.photo.srcSet || undefined"
            sizes="(min-width: 640px) 112px, 72px"
            :alt="profile.photo.alt"
            class="h-full w-full object-cover object-[center_22%]"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </figure>
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <h1
            class="gradient-text text-[clamp(2rem,6vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
          >
            {{ profile.heroTitleLines?.[0] || profile.name }}
          </h1>
          <p class="text-base font-semibold leading-snug text-[var(--ink-strong)] sm:text-xl">
            {{ profile.heroTitleLines?.[1] || 'Software Developer · Researcher' }}
          </p>
          <span
            class="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-600/25 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-[var(--ink-strong)]"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" aria-hidden="true"></span>
            Open to roles
          </span>
        </div>
      </div>

      <div
        v-if="profile.introParagraphs?.length"
        class="flex max-w-prose flex-col gap-3 text-[0.95rem] leading-7 text-[var(--ink-soft)] text-pretty sm:text-base"
      >
        <p v-for="(paragraph, idx) in profile.introParagraphs" :key="idx">
          {{ paragraph }}
        </p>
      </div>

      <div v-if="profile.heroHighlights?.length" class="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        <component
          :is="item.label === 'Stack' ? 'a' : 'div'"
          v-for="item in profile.heroHighlights"
          :key="item.label"
          :href="item.label === 'Stack' ? '#capabilities' : undefined"
          class="group relative block min-w-0 overflow-hidden rounded-[1rem] border border-[var(--line)] bg-[var(--surface-panel-soft)]/80 px-4 py-3 transition"
          :class="item.label === 'Stack' ? 'hover:-translate-y-0.5 hover:border-[var(--accent)]/35' : ''"
        >
          <span aria-hidden="true" class="absolute inset-x-0 top-0 h-0.5" :class="accentFor(item.label)" />
          <p class="flex items-center justify-between gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            {{ item.label }}
            <span
              v-if="item.label === 'Stack'"
              class="inline-flex items-center gap-1 tracking-[0.14em] transition group-hover:translate-y-0.5"
            >
              All skills
              <span aria-hidden="true">↓</span>
            </span>
          </p>
          <p class="pt-1 text-sm leading-6 font-medium text-[var(--ink-strong)]">{{ item.value }}</p>
          <p v-if="item.detail" class="text-sm leading-6 text-[var(--ink-muted)]">{{ item.detail }}</p>
        </component>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <a
          href="#projects"
          class="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5"
        >
          View work
          <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>

        <a
          v-if="profile.resumeUrl"
          :href="profile.resumeUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          Resume
        </a>

        <span class="mx-1 hidden h-6 w-px bg-[var(--line-strong)] sm:block" aria-hidden="true" />

        <a
          v-for="link in profile.socialLinks"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${link.label} profile`"
          :title="link.label"
          class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line-strong)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
        >
          <svg v-if="link.label === 'LinkedIn'" aria-hidden="true" viewBox="0 0 24 24" class="h-[1.1rem] w-[1.1rem]" fill="currentColor">
            <path
              d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.65H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0Z"
            />
          </svg>
          <svg v-else-if="link.label === 'GitHub'" aria-hidden="true" viewBox="0 0 24 24" class="h-[1.1rem] w-[1.1rem]" fill="currentColor">
            <path
              d="M12 0C5.37 0 0 5.5 0 12.29c0 5.43 3.44 10.04 8.2 11.67.6.11.82-.27.82-.6 0-.29-.01-1.05-.02-2.06-3.34.75-4.04-1.66-4.04-1.66-.55-1.41-1.34-1.78-1.34-1.78-1.09-.77.08-.76.08-.76 1.2.09 1.84 1.26 1.84 1.26 1.07 1.88 2.8 1.34 3.49 1.03.11-.8.42-1.35.76-1.66-2.66-.31-5.47-1.36-5.47-6.05 0-1.34.46-2.44 1.23-3.3-.12-.31-.53-1.57.12-3.27 0 0 1.01-.33 3.3 1.26.96-.27 1.99-.41 3.01-.41 1.02 0 2.05.14 3.01.41 2.29-1.59 3.3-1.26 3.3-1.26.65 1.7.24 2.96.12 3.27.77.86 1.23 1.96 1.23 3.3 0 4.7-2.81 5.74-5.49 6.04.43.38.81 1.13.81 2.28 0 1.65-.02 2.98-.02 3.39 0 .33.22.71.82.6 4.77-1.63 8.2-6.24 8.2-11.67C24 5.5 18.63 0 12 0Z"
            />
          </svg>
          <span v-else class="text-sm font-medium">{{ link.label }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
