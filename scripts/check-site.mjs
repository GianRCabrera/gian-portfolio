// Pre-deploy check: `npm run check`
// Catches the usual content mistakes (missing photos, broken links, missing fields)
// and confirms the production build contains every page and asset it references.
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(import.meta.dirname, '..')
const data = await import(join(root, 'src/data/portfolio.js'))

const errors = []
const warnings = []
let checks = 0
const ok = (condition, message) => {
  checks += 1
  if (!condition) errors.push(message)
}

const walk = (dir, filter) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path, filter) : filter(path) ? [path] : []
  })

// 1. Every local file referenced in the data exists in public/
const assetPattern = /^\/(?!\/)[^#?\s]+\.(webp|png|jpe?g|svg|gif|pdf)$/i
const collectAssets = (value, where, found = []) => {
  if (typeof value === 'string') {
    // srcset strings hold several paths
    for (const part of value.split(',')) {
      const path = part.trim().split(/\s+/)[0]
      if (assetPattern.test(path)) found.push({ path, where })
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collectAssets(item, `${where}[${i}]`, found))
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) collectAssets(item, `${where}.${key}`, found)
  }
  return found
}
const assets = Object.entries(data).flatMap(([name, value]) => collectAssets(value, name))
for (const { path, where } of assets) {
  ok(existsSync(join(root, 'public', path)), `Missing file public${path} (used at ${where})`)
}

// 2. Required content fields
const { gallery, projects, caseStudies, research, navigation } = data
gallery.events.forEach((event, i) => {
  const at = `gallery.events[${i}] (${event.title || 'untitled'})`
  ok(event.title, `${at}: missing title`)
  ok(/\d{4}/.test(event.date || ''), `${at}: missing date with a year (needed for the year tag)`)
  ok(event.photos?.length, `${at}: has no photos`)
  event.photos?.forEach((photo, j) => {
    ok(photo.src, `${at}.photos[${j}]: missing src`)
    ok(photo.alt, `${at}.photos[${j}]: missing alt text (also shown as the caption)`)
  })
  if (!event.cover) warnings.push(`${at}: no cover image; the first full-size photo is used on the card`)
})
projects.forEach((project, i) => {
  const at = `projects[${i}] (${project.title || 'untitled'})`
  ok(project.title && project.slug, `${at}: missing title or slug`)
})
research.items.forEach((item, i) => {
  ok(item.title && item.event && item.date, `research.items[${i}]: missing title, event, or date`)
})

// 3. Case study pages exist, are built, and are linked
const viteConfig = readFileSync(join(root, 'vite.config.js'), 'utf8')
for (const slug of Object.keys(caseStudies)) {
  const page = `${slug}/index.html`
  ok(existsSync(join(root, page)), `Case study "${slug}": ${page} is missing`)
  ok(viteConfig.includes(`'${page}'`), `Case study "${slug}": add ${page} to build inputs in vite.config.js`)
  if (existsSync(join(root, page))) {
    ok(readFileSync(join(root, page), 'utf8').includes(`data-case-study="${slug}"`), `${page}: body needs data-case-study="${slug}"`)
  }
  ok(projects.some((p) => p.caseStudyUrl === `/${slug}/`), `Case study "${slug}": no project has caseStudyUrl "/${slug}/"`)
}

// 4. In-page links (#section) point at real ids
const vueSource = walk(join(root, 'src'), (p) => p.endsWith('.vue'))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n')
const ids = new Set([...vueSource.matchAll(/\bid="([\w-]+)"/g)].map((m) => m[1]))
const hashLinks = [
  ...navigation.map((item) => ({ href: item.href, where: `navigation (${item.label})` })),
  ...gallery.events.filter((e) => e.related).map((e) => ({ href: e.related.href, where: `gallery "${e.title}" related link` })),
]
for (const { href, where } of hashLinks) {
  if (href?.startsWith('#')) ok(ids.has(href.slice(1)), `${where}: ${href} has no matching id in the page`)
}

// 5. Page metadata
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8')
for (const page of ['index.html', ...Object.keys(caseStudies).map((slug) => `${slug}/index.html`)]) {
  if (!existsSync(join(root, page))) continue
  const ogImage = readFileSync(join(root, page), 'utf8').match(/property="og:image" content="([^"]+)"/)?.[1] || ''
  ok(/^https:\/\//.test(ogImage), `${page}: og:image must be a full https:// URL`)
  ok(existsSync(join(root, 'public', new URL(ogImage || 'https://x/none').pathname)), `${page}: og:image file is missing in public/`)
}
const jsonLd = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
try {
  ok(JSON.parse(jsonLd || 'null')?.['@type'] === 'Person', 'index.html: structured data should describe a Person')
} catch {
  ok(false, 'index.html: structured data is not valid JSON')
}
ok(indexHtml.includes('google-site-verification'), 'index.html: Google Search Console verification tag was removed')

// 6. Production build contains every page and every asset its pages reference
console.log('Building…')
execSync('npx vite build', { cwd: root, stdio: 'pipe' })
const dist = join(root, 'dist')
const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
for (const loc of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
  const path = new URL(loc).pathname
  ok(existsSync(join(dist, path, 'index.html')), `sitemap.xml lists ${path}, but dist${path}index.html was not built`)
}
ok(existsSync(join(dist, '404.html')), 'dist/404.html is missing')
for (const page of walk(dist, (p) => p.endsWith('.html'))) {
  const html = readFileSync(page, 'utf8')
  for (const [, ref] of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
    if (ref.startsWith('/_vercel/')) continue // served by Vercel in production only
    if (ref.endsWith('/')) continue // links to pages, e.g. "/" or "/rabdash-dc-mobile/"
    ok(existsSync(join(dist, ref)), `${relative(dist, page)} references ${ref}, which is not in the build`)
  }
}

// Report
for (const warning of warnings) console.log(`  warn  ${warning}`)
if (errors.length) {
  for (const error of errors) console.log(`  FAIL  ${error}`)
  console.log(`\n${errors.length} problem(s) found in ${checks} checks. Fix these before deploying.`)
  process.exit(1)
}
console.log(`\nAll ${checks} checks passed (${assets.length} files referenced in the data). Safe to deploy.`)
