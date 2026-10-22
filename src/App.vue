<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/sections/HeroSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import RecommendationsSection from './components/sections/RecommendationsSection.vue'
import ResearchSection from './components/sections/ResearchSection.vue'
import GallerySection from './components/sections/GallerySection.vue'
import { useActiveSection } from './composables/useActiveSection'
import {
  contact,
  experience,
  gallery,
  navigation,
  profile,
  projects,
  recommendations,
  recommendationsMeta,
  research,
  skills,
} from './data/portfolio'

const year = new Date().getFullYear()
const theme = ref('light')
const showScrollTop = ref(false)

const { activeSection } = useActiveSection([
  'top',
  'projects',
  'experience',
  'research',
  'recommendations',
  'gallery',
  'contact',
])

const themeLabel = computed(() =>
  theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
)

const applyTheme = (value) => {
  theme.value = value
  document.documentElement.dataset.theme = value
  window.localStorage.setItem('portfolio-theme', value)
}

const toggleTheme = () => {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 600
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getHeaderOffset = () => {
  const header = document.querySelector('[data-site-header]')
  const height = header?.getBoundingClientRect().height ?? 0
  return Math.max(88, Math.round(height + 18))
}

const scrollToHash = (hash, behavior = 'auto') => {
  if (!hash) return false

  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const target = document.getElementById(id)
  if (!target) return false

  const top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset()
  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  })

  return true
}

const handleHashChange = () => {
  scrollToHash(window.location.hash, 'smooth')
}

onMounted(() => {
  const savedTheme = window.localStorage.getItem('portfolio-theme')
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme || (preferredDark ? 'dark' : 'light'))

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  nextTick(() => {
    if (window.location.hash) {
      const success = scrollToHash(window.location.hash, 'auto')
      if (!success) {
        requestAnimationFrame(() => {
          scrollToHash(window.location.hash, 'auto')
        })
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  })

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('hashchange', handleHashChange)
})

watch(theme, (value) => {
  document.documentElement.dataset.theme = value
})
</script>

<template>
  <div class="relative isolate overflow-hidden pb-8">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[34rem] max-w-6xl">
      <div class="absolute left-0 top-16 h-64 w-64 rounded-full bg-[rgba(27,110,97,0.12)] blur-3xl" />
      <div class="absolute right-0 top-36 h-72 w-72 rounded-full bg-[rgba(186,111,77,0.12)] blur-3xl" />
    </div>

    <SiteHeader
      :navigation="navigation"
      :profile="profile"
      :theme="theme"
      :theme-label="themeLabel"
      :active-section="activeSection"
      @toggle-theme="toggleTheme"
    />

    <main class="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-32">
      <HeroSection :profile="profile" />

      <ProjectsSection :projects="projects" />
      <ExperienceSection :experience="experience" :skills="skills" />
      <ResearchSection :research="research" />
      <RecommendationsSection :recommendations="recommendations" :meta="recommendationsMeta" />
      <GallerySection :gallery="gallery" />
      <ContactSection :contact="contact" :profile="profile" />
    </main>

    <footer class="mt-2 border-t border-[var(--line)] px-4 pb-5 pt-5 text-center text-sm leading-relaxed text-[var(--ink-muted)] sm:px-6 lg:px-10">
      <p>
        © {{ year }} Gian R. Cabrera. All rights reserved.
      </p>
    </footer>

    <Transition name="fab">
      <button
        v-if="showScrollTop"
        type="button"
        aria-label="Scroll to top"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-panel)] text-[var(--ink-strong)] shadow-[0_8px_24px_rgba(32,24,16,0.14)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </div>
</template>
