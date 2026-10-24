<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

const props = defineProps({
  contact: {
    type: Object,
    required: true,
  },
  profile: {
    type: Object,
    required: true,
  },
})

const { el } = useScrollReveal()

const safeLinks = computed(() => {
  const raw = Array.isArray(props.contact?.links) ? props.contact.links : []
  return raw
    .filter(Boolean)
    .map((item) => {
      if (item?.label !== 'Resume') return item
      const url = props.profile?.resumeUrl || item?.url
      return { ...item, url }
    })
})

const emailAddress = computed(() => {
  const mail = props.contact.links?.find((l) => l.label === 'Email')
  return mail?.description?.replace(/^mailto:/i, '') || ''
})

const copied = ref({})
let copyTimer = null

const copyToClipboard = async (value) => {
  if (!value) return false
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.setAttribute('aria-hidden', 'true')
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    if (copyTimer) clearTimeout(copyTimer)
    return true
  } catch {
    return false
  }
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})

const locationLine = computed(() => {
  return props.profile.location || 'Davao City, Philippines'
})

// Philippine time has no daylight saving, so the offset is fixed.
const timezoneLine = computed(() => (props.profile.timezone ? `${props.profile.timezone} (UTC+8)` : ''))

const scheduleCallUrl = computed(() => {
  const url = props.profile.scheduleCallUrl
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : ''
})

// Split after "@" and "/" so long addresses wrap at those points instead of mid-word.
const breakableParts = (text) => String(text || '').split(/(?<=[@/])/)

const linkAriaLabel = (item) => item.ariaLabel || `${item.label}: ${item.description}`

const cardKey = (item) => `${item.label}-${item.description}`

const onCopyEmail = async (event, item) => {
  event.preventDefault()
  event.stopPropagation()
  const ok = await copyToClipboard(emailAddress.value)
  if (!ok) return
  const key = cardKey(item)
  copied.value = { ...copied.value, [key]: true }
  copyTimer = setTimeout(() => {
    const next = { ...copied.value }
    delete next[key]
    copied.value = next
  }, 1800)
}
</script>

<template>
  <section
    ref="el"
    id="contact"
    class="section-shell grid gap-7 rounded-[2rem] border border-[var(--line-strong)] bg-[var(--surface-panel-strong)] p-6 text-[var(--ink-strong)] shadow-[0_22px_60px_rgba(21,38,35,0.2)] sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Contact
        </p>
        <span
          v-if="contact.availabilityBadge"
          class="rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
        >
          {{ contact.availabilityBadge }}
        </span>
      </div>

      <h2 class="max-w-3xl text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
        {{ contact.title }}
      </h2>
      <p v-if="contact.intro" class="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">
        {{ contact.intro }}
      </p>
      <p v-if="contact.availability" class="max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
        {{ contact.availability }}
      </p>

      <div class="flex flex-wrap gap-3 pt-3">
        <a
          v-if="profile.contactHref"
          :href="profile.contactHref"
          class="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="m22 6-10 7L2 6" />
          </svg>
          {{ profile.contactLabel || 'Email me' }}
        </a>
        <a
          v-if="scheduleCallUrl"
          :href="scheduleCallUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-sm font-medium transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M8 2v3M16 2v3" />
            <path d="M3.5 9h17" />
            <path d="M6 4h12a2 2 0 0 1 2 2v13.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
          Book a 30-min call
        </a>
      </div>

      <div class="flex flex-wrap items-center gap-2 pt-4 md:mt-auto">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2 text-sm text-[var(--ink-soft)]"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 21s-8-4.5-8-11a8 8 0 0 1 16 0c0 6.5-8 11-8 11z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {{ locationLine }}
        </span>
        <span
          v-if="timezoneLine"
          class="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-2 text-sm text-[var(--ink-soft)]"
        >
          <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {{ timezoneLine }}
        </span>
      </div>
    </div>

    <div class="grid gap-3">
      <a
        v-for="item in safeLinks"
        :key="item?.label || item?.url"
        :href="item?.url || '#'"
        :aria-label="linkAriaLabel(item)"
        v-bind="
          typeof item?.url === 'string' && item.url.startsWith('mailto:')
            ? {}
            : { target: '_blank', rel: 'noopener noreferrer' }
        "
        :download="item.label === 'Resume' ? 'gian-cabrera-resume.pdf' : undefined"
        class="contact-link-card hover-card group relative flex w-full min-w-0 items-center gap-4 rounded-[1.4rem] border border-[var(--line-strong)] bg-[var(--surface-panel)] px-5 py-4 text-[var(--ink-strong)] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--accent)] transition group-hover:border-[var(--accent)]/40"
          aria-hidden="true"
        >
          <svg v-if="item.icon === 'mail'" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <path d="m22 6-10 7L2 6" />
          </svg>
          <svg v-else-if="item.icon === 'github'" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          <svg v-else-if="item.icon === 'linkedin'" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
          <svg v-else-if="item.icon === 'calendar'" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M8 2v3M16 2v3" />
            <path d="M3.5 9h17" />
            <path d="M6 4h12a2 2 0 0 1 2 2v13.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <path d="M8.5 13.25h7" />
            <path d="M8.5 16.75h7" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {{ item.label }}
          </p>
          <p
            class="min-w-0 break-words pt-1 text-sm font-medium leading-snug text-[var(--ink-strong)] sm:text-[0.95rem]"
          >
            <span class="min-w-0 [overflow-wrap:anywhere]"
              ><template v-for="(part, index) in breakableParts(item.description)" :key="index"
                ><wbr v-if="index" />{{ part }}</template
              ></span
            >
            <span v-if="item.hint" class="ml-2 text-xs font-normal uppercase tracking-wider text-[var(--ink-muted)]">
              {{ item.hint }}
            </span>
          </p>
        </div>
        <div class="ml-auto flex flex-none items-center gap-2">
          <button
            v-if="item.icon === 'mail'"
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            :aria-label="copied[cardKey(item)] ? 'Email copied' : 'Copy email address'"
            @click="onCopyEmail($event, item)"
          >
            {{ copied[cardKey(item)] ? 'Copied' : 'Copy' }}
          </button>
          <span class="self-center text-[var(--ink-muted)] opacity-0 transition group-hover:opacity-100" aria-hidden="true">→</span>
        </div>
      </a>
    </div>
  </section>
</template>
