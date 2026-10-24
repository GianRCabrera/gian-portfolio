<script setup>
import { computed } from 'vue'
import ExperienceDatePill from '../ExperienceDatePill.vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

const currentLabel = 'present'

const props = defineProps({
  experience: {
    type: Array,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
})

const { el } = useScrollReveal()

const isCurrentRole = (item) => item.current === true || item.dates?.toLowerCase().includes(currentLabel)

const isEducationEntry = (group) => {
  const role = group.roles[0]
  return role?.role?.includes('BS ') || group.company?.includes('University')
}

const experienceGroups = computed(() => {
  const groups = []

  for (const item of props.experience) {
    const last = groups[groups.length - 1]
    if (last && last.company === item.company) {
      last.roles.push(item)
      if (!last.companyShort && item.companyShort) {
        last.companyShort = item.companyShort
      }
    } else {
      groups.push({
        company: item.company,
        companyShort: item.companyShort || '',
        logoSrc: item.logoSrc,
        logoAlt: item.logoAlt,
        logoMark: item.logoMark,
        roles: [item],
      })
    }
  }

  return groups
})

const groupHasCurrentRole = (group) => group.roles.some((role) => isCurrentRole(role))

const splitDateRange = (dates) => {
  if (!dates) return { start: '', end: '' }
  const match = dates.match(/^(.+?)\s*[-–]\s*(.+)$/)
  if (!match) return { start: dates.trim(), end: '' }
  return { start: match[1].trim(), end: match[2].trim() }
}

const normalizeDatesDisplay = (dates) => {
  if (!dates) return ''
  return dates.replace(/\bPresent\b/g, 'present').replace(/\s*-\s*/g, '–')
}

/** Org-level span for grouped cards (earliest start → present or latest end). */
const groupDateRange = (group) => {
  const roles = group.roles
  if (!roles?.length) return ''
  if (roles.length === 1) return normalizeDatesDisplay(roles[0].dates)

  const { start } = splitDateRange(roles[roles.length - 1].dates)
  if (groupHasCurrentRole(group)) return `${start}–present`

  const { end } = splitDateRange(roles[0].dates)
  return `${start}–${end}`
}

const groupKey = (group) =>
  group.roles.map((role) => `${role.role}-${role.dates}`).join('|')
</script>

<template>
  <section
    ref="el"
    id="experience"
    class="section-shell grid gap-12 pt-6 xl:grid-cols-2 xl:items-start xl:gap-12"
  >
    <div class="space-y-6">
      <header class="space-y-3">
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Experience
        </p>
        <h2 class="text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
          Where I’ve worked.
        </h2>
        <p class="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">
          Roles and milestones where I shipped UI, reporting workflows, and data-heavy features — from internships to production work.
        </p>
      </header>

      <div>
        <div class="relative space-y-0">
          <div
            class="pointer-events-none absolute left-[0.8rem] top-10 bottom-10 hidden w-px bg-gradient-to-b from-[var(--line)]/25 via-[var(--line)]/18 to-transparent md:block"
            aria-hidden="true"
          />

          <div class="flex flex-col gap-4">
            <div
              v-for="(group, groupIndex) in experienceGroups"
              :key="groupKey(group)"
              class="exp-entry-wrap flex items-start gap-3 md:gap-4"
            >
              <div class="relative flex w-11 shrink-0 flex-col items-center md:w-11">
                <div
                  class="relative z-[1] mt-5 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] text-[var(--accent)] shadow-[0_10px_24px_rgba(32,24,16,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <img
                    v-if="group.logoSrc"
                    :src="group.logoSrc"
                    :alt="group.logoAlt || `${group.company} logo`"
                    class="h-full w-full object-contain p-[0.52rem] opacity-100 grayscale-[12%] contrast-[1.05]"
                    loading="lazy"
                  />
                  <span
                    v-else-if="group.logoMark?.type === 'text'"
                    class="px-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]"
                    :aria-label="group.logoMark.ariaLabel || group.company"
                    role="img"
                  >
                    {{ group.logoMark.text }}
                  </span>
                  <svg
                    v-else-if="isEducationEntry(group)"
                    viewBox="0 0 24 24"
                    class="h-4 w-4 opacity-80"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    class="h-4 w-4 opacity-80"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    <path d="M12 12v.01" />
                  </svg>
                </div>
                <div
                  v-if="groupIndex < experienceGroups.length - 1"
                  class="mt-2 min-h-[1.5rem] w-px flex-1 bg-gradient-to-b from-[var(--line)]/55 via-[var(--line)]/35 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <!-- Multi-role group (e.g. DiWA) -->
              <article
                v-if="group.roles.length > 1"
                :class="[
                  'exp-entry hover-card min-w-0 flex-1 rounded-[1.6rem] border p-5 sm:p-6',
                  groupHasCurrentRole(group)
                    ? 'border-[var(--line-strong)] border-l-[3px] border-l-[var(--accent)] bg-[var(--surface-panel-soft)] shadow-[0_16px_40px_rgba(32,24,16,0.09)]'
                    : 'border-[var(--line)] bg-[var(--surface-raised)]',
                ]"
              >
                <div class="relative min-w-0">
                  <ExperienceDatePill
                    :dates="groupDateRange(group)"
                    :highlighted="groupHasCurrentRole(group)"
                    absolute
                    class="mb-3 sm:mb-0"
                  />

                  <div class="min-w-0 sm:pr-[12rem]">
                    <h3 class="text-[1.05rem] font-semibold leading-6 text-[var(--ink-strong)] sm:text-base">
                      {{ group.companyShort || group.company }}
                    </h3>
                    <p
                      v-if="group.companyShort"
                      class="pt-1 text-xs leading-relaxed text-[var(--ink-muted)]"
                    >
                      {{ group.company }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 space-y-0">
                  <div
                    v-for="(role, roleIndex) in group.roles"
                    :key="`${role.role}-${role.dates}`"
                    :class="[
                      'py-4 first:pt-0 last:pb-0',
                      roleIndex > 0 ? 'border-t border-[var(--line)]' : '',
                    ]"
                  >
                    <div class="flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <p
                        class="min-w-0 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
                      >
                        {{ role.role }}
                      </p>
                      <ExperienceDatePill
                        :dates="normalizeDatesDisplay(role.dates)"
                        variant="inline"
                        :highlighted="isCurrentRole(role)"
                        class="shrink-0"
                      />
                    </div>
                    <p class="pt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                      {{ role.summary }}
                    </p>
                  </div>
                </div>
              </article>

              <!-- Single-role group (RabDash, UP Mindanao) -->
              <article
                v-else
                :class="[
                  'exp-entry hover-card min-w-0 flex-1 rounded-[1.6rem] border p-7',
                  isCurrentRole(group.roles[0])
                    ? 'border-[var(--line-strong)] border-l-[3px] border-l-[var(--accent)] bg-[var(--surface-panel-soft)] shadow-[0_16px_40px_rgba(32,24,16,0.09)]'
                    : 'border-[var(--line)] bg-[var(--surface-raised)]',
                ]"
              >
                <div class="relative">
                  <ExperienceDatePill
                    :dates="normalizeDatesDisplay(group.roles[0].dates)"
                    absolute
                  />

                  <div class="min-w-0 sm:pr-[12rem]">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="text-[1.05rem] font-semibold leading-6 text-[var(--ink-strong)] sm:text-base">
                        {{ group.companyShort || group.company }}
                      </h3>
                      <span
                        v-if="isCurrentRole(group.roles[0])"
                        class="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]"
                      >
                        Current
                      </span>
                    </div>
                    <p
                      v-if="group.companyShort"
                      class="pt-1 text-xs leading-relaxed text-[var(--ink-muted)]"
                    >
                      {{ group.company }}
                    </p>

                    <p class="pt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                      {{ group.roles[0].role }}
                    </p>
                  </div>

                  <p class="max-w-2xl pt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {{ group.roles[0].summary }}
                  </p>
                </div>

                <ul class="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
                  <li
                    v-for="highlight in (group.roles[0].highlights || []).slice(0, 2)"
                    :key="highlight"
                    class="flex gap-3 leading-snug"
                  >
                    <span class="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[var(--accent)]" />
                    <span>{{ highlight }}</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <header class="space-y-3">
        <p class="section-label text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Capabilities
        </p>
        <h2 class="text-3xl leading-tight font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
          What I bring.
        </h2>
        <p class="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)]">
          The strengths I bring to dashboard-heavy work — from UI craft to reporting workflows and collaboration.
        </p>
      </header>

      <aside
        class="capabilities-shell rounded-[2rem] border border-[var(--line-strong)] bg-[var(--surface-panel-strong)] p-6 text-[var(--ink-strong)] shadow-[0_22px_52px_rgba(21,38,35,0.18)] sm:p-8 xl:sticky xl:top-28 xl:self-start"
        aria-label="Capabilities and skills"
      >
        <div class="space-y-6">
          <div>
            <p class="max-w-xl text-[1.05rem] leading-relaxed text-[var(--ink-soft)]">
              Strongest on dashboards, reporting workflows, and data-heavy interfaces.
            </p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span class="exp-skill-pill">Dashboards</span>
              <span class="exp-skill-pill">KPI views</span>
              <span class="exp-skill-pill">Reporting workflows</span>
              <span class="exp-skill-pill">Data-heavy interfaces</span>
            </div>
          </div>

          <div class="space-y-5 border-t border-[var(--line)] pt-6">
            <div v-for="skillGroup in skills" :key="skillGroup.title" class="space-y-3">
              <h3 class="text-base font-semibold tracking-[-0.01em] text-[var(--ink-strong)]">
                {{ skillGroup.title }}
              </h3>
              <div class="mt-1 flex flex-wrap gap-1.5">
                <span v-for="skill in skillGroup.items" :key="skill" class="exp-skill-pill text-xs">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-4 border-t border-[var(--line)] pt-6">
            <div>
              <p class="text-label text-[var(--ink-muted)]">Work style</p>
              <p class="pt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                Calm, detail-oriented delivery — with a bias toward clarity, reliability, and useful UX.
              </p>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span class="exp-skill-pill">Reliable in production</span>
              <span class="exp-skill-pill">Iterative shipping</span>
              <span class="exp-skill-pill">Clear communication</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
