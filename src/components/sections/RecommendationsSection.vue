<script setup>
import { computed, ref } from 'vue'
import ExperienceDatePill from '../ExperienceDatePill.vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

const props = defineProps({
  recommendations: {
    type: Array,
    required: true,
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
})

const { el } = useScrollReveal()

const visibleRecommendations = computed(() => props.recommendations.filter((item) => !item.draft))

const gridClass = computed(() =>
  visibleRecommendations.value.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1',
)

const expandedKey = ref('')

const cardKey = (item) => `${item.name}-${item.role}`

const toggleExpanded = (item) => {
  const key = cardKey(item)
  expandedKey.value = expandedKey.value === key ? '' : key
}

const isExpanded = (item) => expandedKey.value === cardKey(item)

const needsToggle = (item) => (item.quote?.length || 0) > 170

const avatarFailed = ref(new Set())

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const hasAvatar = (item) => Boolean(item.avatarUrl) && !avatarFailed.value.has(cardKey(item))

const markAvatarFailed = (item) => {
  const key = cardKey(item)
  if (avatarFailed.value.has(key)) return
  avatarFailed.value = new Set([...avatarFailed.value, key])
}
</script>

<template>
  <section
    ref="el"
    id="recommendations"
    class="section-shell space-y-8 border-t border-[var(--line)] pt-9 sm:pt-10"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Recommendations
        </p>
        <h2 class="mt-3 text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
          In their words.
        </h2>
        <p class="mt-3 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
          {{ meta.intro || 'Short notes from people I’ve worked with.' }}
        </p>
      </div>
      <a
        v-if="meta.linkedinReceivedUrl"
        :href="meta.linkedinReceivedUrl"
        target="_blank"
        rel="noreferrer"
        class="w-fit shrink-0 text-sm font-medium text-[var(--accent)] underline decoration-[rgba(27,110,97,0.28)] underline-offset-4 transition hover:decoration-[var(--accent)]"
      >
        View on LinkedIn →
      </a>
    </div>

    <div class="grid items-start gap-7" :class="gridClass">
      <article
        v-for="item in visibleRecommendations"
        :key="`${item.name}-${item.role}`"
        class="rec-card hover-card group relative flex w-full flex-col overflow-hidden rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--surface)] p-6 shadow-[0_18px_44px_rgba(32,24,16,0.08)] sm:p-7"
        :class="isExpanded(item) ? 'ring-1 ring-[var(--accent)]/25' : ''"
      >
        <div v-if="item.relationship" class="relative z-[1] mb-4">
          <span
            class="rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]"
          >
            {{ item.relationship }}
          </span>
        </div>
        <div
          class="pointer-events-none absolute left-5 top-[4.1rem] font-serif text-5xl leading-none text-[var(--accent)]/15 sm:left-6 sm:top-[4.5rem]"
          aria-hidden="true"
        >
          “
        </div>
        <div
          class="relative z-[1] shrink-0"
          :class="!isExpanded(item) ? 'overflow-hidden' : ''"
        >
          <blockquote
            :class="[
              'border-l-2 border-[var(--accent)]/25 pl-5 font-[family-name:var(--font-heading)] text-[0.98rem] italic leading-7 text-pretty text-[var(--ink-strong)]',
              !isExpanded(item) ? 'rec-quote-clamp' : '',
            ]"
          >
            {{ item.quote }}
          </blockquote>
        </div>
        <div class="relative z-[1] mt-3 min-h-[2.25rem]">
          <button
            v-if="needsToggle(item)"
            type="button"
            :aria-expanded="isExpanded(item)"
            class="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            @click="toggleExpanded(item)"
          >
            {{ isExpanded(item) ? 'Show less' : 'Read more' }}
          </button>
        </div>
        <div class="mt-5 shrink-0 border-t border-[var(--line)] pt-5">
          <component
            :is="item.linkedinUrl ? 'a' : 'div'"
            :href="item.linkedinUrl || undefined"
            :target="item.linkedinUrl ? '_blank' : undefined"
            :rel="item.linkedinUrl ? 'noreferrer' : undefined"
            :aria-label="item.linkedinUrl ? `View ${item.name} on LinkedIn` : undefined"
            class="group/author flex items-center gap-4"
            :class="
              item.linkedinUrl
                ? 'rounded-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
                : ''
            "
          >
            <div
              v-if="hasAvatar(item)"
              class="h-12 w-12 flex-none overflow-hidden rounded-full border border-[var(--line)] bg-[var(--surface-raised)]"
            >
              <img
                :src="item.avatarUrl"
                :srcset="item.avatarSrcSet || undefined"
                sizes="48px"
                :alt="item.name"
                width="48"
                height="48"
                class="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
                @error="markAvatarFailed(item)"
              />
            </div>
            <div
              v-else
              class="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-sm font-semibold text-[var(--accent)] transition group-hover/author:border-[var(--accent)]/40"
            >
              {{ getInitials(item.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="flex items-center gap-1.5 text-base font-semibold text-[var(--ink-strong)] not-italic transition group-hover/author:text-[var(--accent)]"
              >
                <span>{{ item.name }}</span>
                <span
                  v-if="item.linkedinUrl"
                  class="text-sm text-[var(--ink-muted)] opacity-0 transition group-hover/author:opacity-100 group-hover/author:text-[var(--accent)]"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </p>
              <div class="mt-0.5 flex min-w-0 flex-nowrap items-center justify-between gap-2">
                <p class="min-w-0 truncate text-sm leading-6 text-[var(--ink-muted)] not-italic">
                  {{ item.role }}
                </p>
                <ExperienceDatePill
                  v-if="item.sourceDate"
                  :dates="item.sourceDate"
                  variant="inline"
                  class="shrink-0"
                />
              </div>
            </div>
          </component>
        </div>
      </article>
    </div>
  </section>
</template>
