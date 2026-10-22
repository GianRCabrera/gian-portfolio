<script setup>
defineProps({
  study: {
    type: Object,
    required: true,
  },
  project: {
    type: Object,
    default: () => ({}),
  },
  profile: {
    type: Object,
    default: () => ({}),
  },
})

const year = new Date().getFullYear()
</script>

<template>
  <div class="relative isolate overflow-hidden pb-10">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-6xl">
      <div class="absolute left-0 top-16 h-64 w-64 rounded-full bg-[rgba(27,110,97,0.12)] blur-3xl" />
      <div class="absolute right-0 top-36 h-72 w-72 rounded-full bg-[rgba(186,111,77,0.12)] blur-3xl" />
    </div>

    <header class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 pt-6 sm:px-6 lg:px-10">
      <a
        href="/#projects"
        class="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-panel)] px-4 py-2 text-sm font-medium text-[var(--ink-strong)] backdrop-blur transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" class="h-4 w-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">
          <path d="M10.5 3.5 6 8l4.5 4.5" />
        </svg>
        {{ profile.name || 'Portfolio' }}
      </a>
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">Case study</span>
    </header>

    <main class="mx-auto flex max-w-4xl flex-col gap-14 px-4 pt-12 sm:px-6 sm:pt-16 lg:px-10">
      <!-- Intro -->
      <section class="flex flex-col gap-5">
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          {{ study.kicker }}
        </p>
        <h1 class="text-4xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-5xl">
          {{ study.title }}
        </h1>
        <p class="max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)]">
          {{ study.tagline }}
        </p>

        <dl class="grid gap-px overflow-hidden rounded-[1.4rem] border border-[var(--line-strong)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="fact in study.facts" :key="fact.label" class="flex flex-col gap-1 bg-[var(--surface)] px-5 py-4">
            <dt class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">{{ fact.label }}</dt>
            <dd class="text-sm leading-6 font-medium text-[var(--ink-strong)]">{{ fact.value }}</dd>
          </div>
        </dl>
      </section>

      <!-- Narrative sections -->
      <section v-for="section in study.sections" :key="section.heading" class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-strong)] sm:text-3xl">{{ section.heading }}</h2>
        <p v-for="(paragraph, index) in section.paragraphs" :key="index" class="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">
          {{ paragraph }}
        </p>
        <ul v-if="section.bullets?.length" class="flex max-w-2xl flex-col gap-2.5 pt-1">
          <li v-for="bullet in section.bullets" :key="bullet" class="flex gap-3 text-base leading-relaxed text-[var(--ink-soft)]">
            <span class="mt-[0.65rem] h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" aria-hidden="true" />
            <span>{{ bullet }}</span>
          </li>
        </ul>
      </section>

      <!-- Screens -->
      <section v-if="study.screens?.length" class="flex flex-col gap-5">
        <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-strong)] sm:text-3xl">{{ study.screensHeading || 'Screens' }}</h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <figure
            v-for="screen in study.screens"
            :key="screen.src"
            class="flex flex-col overflow-hidden rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_12px_28px_rgba(32,24,16,0.06)]"
          >
            <img :src="screen.src" :alt="screen.alt" width="397" height="897" class="aspect-[397/897] w-full object-cover" loading="lazy" decoding="async" />
            <figcaption class="border-t border-[var(--line)] px-3 py-2 text-xs font-medium text-[var(--ink-muted)]">
              {{ screen.caption }}
            </figcaption>
          </figure>
        </div>
      </section>

      <!-- Timeline -->
      <section v-if="study.timeline?.length" class="flex flex-col gap-5">
        <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-strong)] sm:text-3xl">{{ study.timelineHeading || 'Timeline' }}</h2>
        <ol class="flex flex-col gap-0 border-l-2 border-[var(--accent)]/25">
          <li v-for="item in study.timeline" :key="item.date" class="relative flex flex-col gap-1 pb-6 pl-6 last:pb-0">
            <span class="absolute -left-[0.45rem] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--accent)] bg-[var(--surface)]" aria-hidden="true" />
            <span class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{{ item.date }}</span>
            <span class="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">{{ item.text }}</span>
          </li>
        </ol>
      </section>

      <!-- Lessons -->
      <section v-if="study.lessons?.length" class="flex flex-col gap-5">
        <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-strong)] sm:text-3xl">{{ study.lessonsHeading || 'Lessons' }}</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <article
            v-for="lesson in study.lessons"
            :key="lesson.title"
            class="flex flex-col gap-2 rounded-[1.3rem] border border-[var(--line-strong)] bg-[var(--surface)] p-6 shadow-[0_14px_34px_rgba(32,24,16,0.06)]"
          >
            <h3 class="font-[family-name:var(--font-heading)] text-lg leading-snug font-semibold text-[var(--ink-strong)]">{{ lesson.title }}</h3>
            <p class="text-sm leading-6 text-[var(--ink-soft)]">{{ lesson.text }}</p>
          </article>
        </div>
      </section>

      <!-- Next steps -->
      <section class="flex flex-col gap-4 rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--surface)] p-7 shadow-[0_18px_44px_rgba(32,24,16,0.08)] sm:p-9">
        <h2 class="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink-strong)]">Want to talk about it?</h2>
        <p class="max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
          I’m happy to walk through the app, the code, or how it fits into RabDash DC.
        </p>
        <div class="flex flex-wrap gap-3 pt-1">
          <a
            v-if="profile.contactHref"
            :href="profile.contactHref"
            class="btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {{ profile.contactLabel || 'Email me' }}
          </a>
          <a
            v-if="project.repoUrl"
            :href="project.repoUrl"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
          >
            Source code
          </a>
          <a
            href="/#projects"
            class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
          >
            More projects
          </a>
        </div>
      </section>
    </main>

    <footer class="mt-12 border-t border-[var(--line)] px-4 pb-5 pt-5 text-center text-sm leading-relaxed text-[var(--ink-muted)] sm:px-6 lg:px-10">
      <p>© {{ year }} Gian R. Cabrera. All rights reserved.</p>
    </footer>
  </div>
</template>
