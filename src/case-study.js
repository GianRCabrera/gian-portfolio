import { createApp } from 'vue'
// Self-hosted fonts (same weights the Google Fonts link used to load).
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/lora/600.css'
import '@fontsource/lora/600-italic.css'
import './style.css'
import CaseStudyPage from './pages/CaseStudyPage.vue'
import { caseStudies, profile, projects } from './data/portfolio'

// Each case study page sets <body data-case-study="slug">; the slug matches its folder and the project's caseStudyUrl.
const slug = document.body.dataset.caseStudy
const study = caseStudies[slug]
const project = projects.find((item) => item.caseStudyUrl === `/${slug}/`) || {}

if (study) {
  createApp(CaseStudyPage, { study, project, profile }).mount('#app')
} else {
  console.error(`No case study found for "${slug}"`)
}
