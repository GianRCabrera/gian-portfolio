<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  navigation: {
    type: Array,
    required: true,
  },
  profile: {
    type: Object,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  themeLabel: {
    type: String,
    required: true,
  },
  activeSection: {
    type: String,
    default: '',
  },
})

defineEmits(['toggle-theme'])

const isMobileMenuOpen = ref(false)
const mobileMenuEl = ref(null)
const scheduleCallHref = computed(() => {
  const schedulingUrl = props.profile?.scheduleCallUrl
  if (typeof schedulingUrl === 'string' && /^https?:\/\//i.test(schedulingUrl)) return schedulingUrl

  const mailHref = props.profile?.contactHref
  if (typeof mailHref === 'string' && mailHref.startsWith('mailto:')) return mailHref

  return '#contact'
})

function openMobileMenu() {
  isMobileMenuOpen.value = true
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function onMobileMenuKeyDown(event) {
  if (event.key === 'Escape') closeMobileMenu()
}

watch(isMobileMenuOpen, async (open) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    mobileMenuEl.value?.focus?.()
  }
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header data-site-header class="fixed inset-x-0 top-3 z-50 px-4 sm:px-6 lg:px-10">
    <div
      class="site-header-bar mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-[1.75rem] border px-4 py-3 md:flex-row md:flex-nowrap md:gap-5 md:px-6"
    >
      <div class="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:flex-initial">
        <a href="#top" class="flex min-w-0 items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--surface-raised)] sm:h-11 sm:w-11">
          <img
            :src="profile.photo.fallbackSrc || profile.photo.src"
            :srcset="profile.photo.srcSet || undefined"
            :sizes="'(max-width: 639px) 40px, 44px'"
            :alt="profile.photo.alt"
            class="h-full w-full object-cover object-top"
            decoding="async"
            fetchpriority="high"
          />
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold tracking-[0.18em] text-[var(--ink-strong)] uppercase">
              {{ profile.name }}
            </p>
            <p class="hidden truncate text-sm text-[var(--ink-muted)] sm:block">
              {{ profile.location }}
            </p>
          </div>
        </a>
      </div>

      <nav class="hidden min-[1100px]:block min-[1100px]:flex-1">
        <div class="flex items-center justify-center gap-0.5 text-sm text-[var(--ink-soft)] xl:gap-2">
          <a
            v-for="item in navigation"
            :key="item.href"
            :href="item.href"
            :class="[
              'rounded-full px-3 py-2 transition hover:bg-[var(--surface-raised)] xl:px-4 hover:text-[var(--ink-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
              activeSection === item.href.replace('#', '')
                ? 'font-semibold text-[var(--ink-strong)] ring-1 ring-[var(--accent)]/45 bg-[color-mix(in_oklab,var(--accent)_18%,var(--surface-raised))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                : 'text-[var(--ink-soft)]',
            ]"
          >
            {{ item.label }}
          </a>
        </div>
      </nav>

      <div class="flex items-center justify-end gap-2 sm:gap-3 md:flex-none">
        <a
          v-if="profile.resumeUrl"
          :href="profile.resumeUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:text-sm min-[1100px]:px-4 min-[1100px]:py-2.5"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          Resume
        </a>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--ink-strong)] transition hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:h-11 sm:w-11 min-[1100px]:hidden"
          aria-label="Open menu"
          @click="openMobileMenu"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
        <button
          type="button"
          :aria-label="themeLabel"
          :title="themeLabel"
          @click="$emit('toggle-theme')"
          class="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--ink-strong)] transition hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:h-11 sm:w-11 min-[1100px]:inline-flex"
        >
          <svg
            v-if="theme === 'dark'"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
          </svg>
          <svg
            v-else
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          >
            <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" />
          </svg>
        </button>

      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm min-[1100px]:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        @click.self="closeMobileMenu"
        @keydown="onMobileMenuKeyDown"
      >
        <div
          ref="mobileMenuEl"
          tabindex="-1"
          class="mx-auto mt-4 w-[min(96vw,28rem)] rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_28px_80px_rgba(0,0,0,0.28)] focus:outline-none"
        >
          <div class="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
            <p class="text-sm font-semibold tracking-[0.18em] uppercase text-[var(--ink-strong)]">
              Menu
            </p>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--ink-strong)] transition hover:border-[var(--line-strong)] hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Close menu"
              @click="closeMobileMenu"
            >
              ✕
            </button>
          </div>

          <nav class="p-3">
            <a
              v-for="item in navigation"
              :key="`m-${item.href}`"
              :href="item.href"
              class="flex items-center justify-between rounded-[1.1rem] px-4 py-3 text-base font-medium text-[var(--ink-strong)] transition hover:bg-[var(--surface-raised)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              @click="closeMobileMenu"
            >
              <span>{{ item.label }}</span>
              <span class="text-[var(--ink-muted)]" aria-hidden="true">→</span>
            </a>
          </nav>

          <div class="flex flex-col gap-2 border-t border-[var(--line)] p-4">
            <a
              :href="scheduleCallHref"
              :target="scheduleCallHref.startsWith('http') ? '_blank' : undefined"
              :rel="scheduleCallHref.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="btn-primary inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              @click="closeMobileMenu"
            >
              Book a 30-min call
            </a>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-4 py-3 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              style="background: var(--button-secondary-bg); color: var(--button-secondary-text);"
              @click="$emit('toggle-theme')"
            >
              {{ themeLabel }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
