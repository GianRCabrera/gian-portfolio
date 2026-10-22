<script setup>
import { computed } from 'vue'
import ExperienceDatePill from '../ExperienceDatePill.vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

const props = defineProps({
  research: {
    type: Object,
    required: true,
  },
})

const { el } = useScrollReveal()

const items = computed(() => (Array.isArray(props.research?.items) ? props.research.items : []).filter(Boolean))

const gridClass = computed(() => (items.value.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'))
</script>

<template>
  <section
    v-if="items.length"
    ref="el"
    id="research"
    class="section-shell space-y-8 border-t border-[var(--line)] pt-9 sm:pt-10"
  >
    <div>
      <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        Research &amp; Talks
      </p>
      <h2 class="mt-3 text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
        Presenting the work.
      </h2>
      <p v-if="research.intro" class="mt-3 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
        {{ research.intro }}
      </p>
    </div>

    <div class="grid items-stretch gap-7" :class="gridClass">
      <article
        v-for="item in items"
        :key="item.title"
        class="hover-card relative flex w-full flex-col rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--surface)] p-7 shadow-[0_18px_44px_rgba(32,24,16,0.08)] sm:p-9"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span
            v-if="item.type"
            class="rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
          >
            {{ item.type }}
          </span>
          <ExperienceDatePill v-if="item.date" :dates="item.date" variant="compact" />
        </div>

        <h3
          class="pt-5 font-[family-name:var(--font-heading)] text-lg leading-snug font-semibold text-pretty text-[var(--ink-strong)] sm:text-xl"
        >
          {{ item.title }}
        </h3>

        <p class="pt-2 text-sm leading-6 text-[var(--ink-muted)]">
          <span class="font-semibold text-[var(--ink-strong)]">{{ item.event }}</span>
          <span v-if="item.location"> · {{ item.location }}</span>
        </p>

        <p v-if="item.summary" class="pt-4 text-base leading-relaxed text-[var(--ink-soft)]">
          {{ item.summary }}
        </p>

        <div class="grow" aria-hidden="true" />

        <div class="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[var(--line)] pt-5">
          <span
            v-if="item.role"
            class="rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]"
          >
            {{ item.role }}
          </span>
          <span
            v-if="item.status"
            class="rounded-full border border-dashed border-[var(--line-strong)] px-3 py-1 text-xs font-medium text-[var(--ink-muted)]"
          >
            {{ item.status }}
          </span>
          <a
            v-if="item.url"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
            class="ml-auto text-sm font-medium text-[var(--accent)] underline decoration-[rgba(27,110,97,0.28)] underline-offset-4 transition hover:decoration-[var(--accent)]"
          >
            {{ item.urlLabel || 'Read paper' }} →
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
