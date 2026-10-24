/**
 * GitHub: profile/social links use gian-r-cabrera; RabDash Mobile repo is under GianRCabrera (formerly GianSolo-aok).
 * Update its repoUrl once the repo is transferred to gian-r-cabrera.
 */
export const navigation = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Research', href: '#research' },
  { label: 'Recommendations', href: '#recommendations' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export const profile = {
  name: 'Gian Cabrera',
  shortName: 'GC',
  /** Page / SEO-friendly title; hero uses heroTitleLines + heroRolesLine. */
  title: 'Gian Cabrera — Software Developer · Researcher',
  /** Line 1: your name (gradient). Line 2: primary role. Roles pipe is heroRolesLine below. */
  heroTitleLines: ['Gian Cabrera', 'Software Developer · Researcher'],
  photo: {
    src: '/DP_PORTFOLIO-800.webp',
    fallbackSrc: '/DP_PORTFOLIO-800.webp',
    srcSet:
      '/DP_PORTFOLIO-160.webp 160w, /DP_PORTFOLIO-533.webp 533w, /DP_PORTFOLIO-800.webp 800w, /DP_PORTFOLIO-1066.webp 1066w',
    sizes: '(max-width: 640px) 280px, (max-width: 1024px) 248px, 272px',
    alt: 'Portrait of Gian Cabrera',
    caption: 'Software Developer · DiWA Center',
    /** Small kicker on portrait overlay. */
    overlayKicker: 'Software · 3D · research',
    /** Hide duplicate name on photo when H1 is already the name. */
    hideName: true,
  },
  /** Hero lead copy (short paragraphs, top-to-bottom). */
  introParagraphs: [
    'Junior Programmer at the DiWA Center (UP Mindanao), where I lead RabDash DC: the rabies data system that replaced the Davao City Veterinarian’s Office’s paper forms. I build dashboards and decision-support tools for disease surveillance and public health.',
  ],
  /** Short chips under the lead (three items; highlights carry NOW/DOMAIN/STACK). */
  heroFocusAreas: [],
  location: 'Davao City, Philippines',
  /** Shown on Contact; header keeps full `location`. */
  timezone: 'PHT',
  currentRole: 'Junior Programmer at the Mindanao Center for Disease Watch and Analytics',
  availability: 'Open to software engineering, analytics, and dashboard-focused roles.',
  education: 'BS Computer Science, UP Mindanao',
  heroHighlights: [
    {
      label: 'Now',
      value: 'Leading RabDash DC',
      detail: 'Web system + mobile app · DiWA Center',
    },
    {
      label: 'Stack',
      value: 'Vue · Node.js',
      detail: 'Express · MySQL · MongoDB',
    },
    {
      label: 'Recognition',
      value: 'Cum laude · UP Mindanao',
      detail: 'Best Thesis finalist · ICIAH 2026 presenter',
    },
  ],
  contactLabel: 'Email me',
  contactHref: 'mailto:gianrubillarcabrera@gmail.com',
  scheduleCallUrl: 'https://calendly.com/gianrubillarcabrera/30min',
  resumeUrl: '/gian-cabrera-resume.pdf',
  socialLinks: [
    {
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/gian-cabrera-2011b3256',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/gian-r-cabrera',
    },
  ],
}

export const projects = [
  {
    title: 'RabDash DC Mobile',
    slug: 'rabdash-dc-mobile-application',
    typeLabel: 'Mobile App',
    role: 'Full Stack · Lead Developer',
    audience: 'City Veterinary Office (CVO) + private veterinarians in Davao City',
    context: 'Android app for rabies vaccination case reporting in Davao City — started as my thesis, now leading its full-stack build.',
    scope: 'Rabies case reporting',
    surface: 'Field submission workflow',
    contribution: 'Full stack work across mobile UI, auth, and submission flows.',
    impact: 'Faster field submissions and cleaner records.',
    spotlight: {
      outcome: 'CVO + private vet reporting flow shipped.',
      role: 'Full stack: UI, auth, and submission workflow.',
      constraints: 'Android-only · requires internet connection.',
    },
    stack: ['React Native', 'Express.js', 'Node.js', 'MySQL', 'Public Health Analytics'],
    featured: true,
    primary: true,
    featuredImage: '/login.webp',
    featuredImageAlt: 'Login screen',
    featuredImageCaption: 'Login',
    featuredSlides: [
      {
        src: '/login.webp',
        alt: 'Login screen',
        caption: 'Login',
      },
      {
        src: '/register.webp',
        alt: 'Register screen',
        caption: 'Register',
      },
      {
        src: '/reset_forgotten_password.webp',
        alt: 'Reset forgotten password screen',
        caption: 'Reset password',
      },
      {
        src: '/Landing_page.webp',
        alt: 'Landing page screen',
        caption: 'Landing page',
      },
      {
        src: '/menu_cvo.webp',
        alt: 'CVO menu screen',
        caption: 'CVO menu',
      },
      {
        src: '/User_Profile.webp',
        alt: 'User profile screen',
        caption: 'User profile',
      },
      {
        src: '/Downloadable_Forms_CVO.webp',
        alt: 'Downloadable forms screen (CVO)',
        caption: 'Downloadable forms',
      },
      {
        src: '/CVO_Data_Tables_Menu.webp',
        alt: 'CVO data tables menu screen',
        caption: 'Data tables menu',
      },
    ],
    screens: [],
    liveUrl: '',
    repoUrl: 'https://github.com/GianRCabrera/Rabdash_Mobile',
    caseStudyUrl: '/rabdash-dc-mobile/',
  },
  {
    title: 'IWOMB 2025 Website',
    slug: 'iwomb-2025-website',
    typeLabel: 'Event Website',
    role: 'Full Stack · Website Build',
    audience: 'Workshop attendees and organizers',
    context: 'Workshop website for schedule, applications, and attendee access.',
    scope: 'Programme and applications',
    surface: 'Conference information hub',
    contribution: 'Information architecture and page structure.',
    impact: 'Reduced back-and-forth for attendees.',
    impactLead: 'Single hub for schedules and applications',
    previewAccent: 'form',
    stackGroups: {
      tech: ['Google Sites'],
      domain: ['Event website', 'Information architecture'],
    },
    stack: ['Google Sites', 'Information Architecture', 'Event Website'],
    featured: true,
    primary: false,
    featuredImage: null,
    cardImage: '/iwomb2025.webp',
    cardKind: 'Public site',
    highlightSecondary: false,
    liveUrl: 'https://sites.google.com/up.edu.ph/iwomb2025/',
    repoUrl: '',
    caseStudyUrl: '',
  },
  {
    title: 'DiWA Disease Trends Dashboard',
    slug: 'infectious-disease-trends-dashboard',
    typeLabel: 'Dashboard ·AI reporting system',
    role: 'Dashboard · AI reporting system',
    audience: 'Public health reporting teams',
    context: 'Trend dashboards and templated reporting in one workflow.',
    scope: 'Trend review and report generation',
    surface: 'Hybrid workflow module',
    contribution: 'UI, workflow logic, and module integration.',
    impact: 'Faster trend review and report prep.',
    impactLead: 'Faster trend review and report prep',
    previewAccent: 'chart',
    stackGroups: {
      tech: ['Vue 3', 'Templates', 'AI-assisted drafting', 'Backend logic'],
      domain: ['Surveillance', 'Reporting'],
    },
    stack: ['Vue 3', 'Backend logic', 'Templates', 'AI-assisted drafting'],
    featured: true,
    primary: false,
    featuredImage: null,
    cardImage: '/dashboard1.webp',
    cardKind: 'Internal product',
    highlightSecondary: true,
    liveUrl: '',
    repoUrl: '',
    caseStudyUrl: '',
  },
  {
    title: 'RabDash DC Chart Maintenance',
    slug: 'rabdash-dc-chart-maintenance',
    typeLabel: 'Chart Maintenance',
    role: 'Frontend · Chart Updates',
    audience: 'Research and surveillance users',
    context: 'Live dashboard chart updates and visual maintenance.',
    scope: 'Live chart updates',
    surface: 'Dashboard visual upkeep',
    contribution: 'Chart UI updates and refinements.',
    impact: 'Consistent visuals as data changes.',
    impactLead: 'Charts stay current as data evolves',
    previewAccent: 'chart',
    chartVariant: 'bars',
    stackGroups: {
      tech: ['Laravel', 'Chart UI', 'Data visualization'],
      domain: ['Data visualization', 'Live dashboard'],
    },
    stack: ['Laravel', 'Chart UI', 'Data Visualization'],
    featured: true,
    primary: false,
    featuredImage: null,
    cardImage: '/rabdash.webp',
    cardKind: 'Live system',
    highlightSecondary: false,
    liveUrl: 'https://rabdash.com/',
    repoUrl: '',
    caseStudyUrl: '',
  },
]

export const experience = [
  {
    company: 'Mindanao Center for Disease Watch and Analytics',
    companyShort: 'DiWA Center',
    role: 'Junior Programmer',
    dates: 'Jun 2026–present',
    current: true,
    logoSrc: '/DiWA_Logo.webp',
    logoAlt: 'DiWA logo',
    summary:
      'Lead the design, development, implementation, and continuing improvement of RabDash, aligning technical work with Center and partner requirements.',
    highlights: [
      'Building the full-stack RabDash DC Mobile App (React Native, Express, Node.js, MySQL).',
      'Technical point of contact for RabDash updates, demos, and stakeholder concerns.',
      'Technical documentation, dashboards, app pitching, proposals, and mentoring.',
    ],
  },
  {
    company: 'Mindanao Center for Disease Watch and Analytics',
    companyShort: 'DiWA Center',
    role: 'Computer Programmer I',
    dates: 'Aug 2024–May 2026',
    current: false,
    logoSrc: '/DiWA_Logo.webp',
    logoAlt: 'DiWA logo',
    summary:
      'Developed and maintained public health dashboards and decision-support systems for disease surveillance and reporting.',
    highlights: [
      'Vue, Node.js, Express, MySQL, MongoDB, and Power BI dashboards.',
      'Maintained RabDash DC for the City Veterinarian’s Office.',
      'AI-assisted reporting, specs, proposals, and the IWOMB 2025 website.',
    ],
  },
  {
    company: 'RabDash DC, UP Mindanao',
    role: 'Student Researcher & Summer Intern',
    dates: 'Mar 2023–Jun 2024',
    logoSrc: '/Rabdash_logo.webp',
    logoAlt: 'RabDash logo',
    summary: 'Developed and tested an Android app centralizing rabies data from private vets and the City Veterinarian’s Office.',
    highlights: [
      'Digitized historical vaccination records for data migration.',
      'UI/UX and content improvements.',
    ],
  },
  {
    company: 'University of the Philippines Mindanao',
    role: 'BS Computer Science',
    dates: '2020–2024',
    logoSrc: '/UPMin_Logo.webp',
    logoAlt: 'UP Mindanao seal',
    summary: 'Graduated Cum Laude. Thesis on a centralized pet management app for dog rabies vaccination reporting in Davao City.',
    highlights: [
      'Finalist, Best Thesis in Computer Science (Poster).',
      'Software engineering fundamentals and systems thinking.',
    ],
  },
]

export const skills = [
  {
    title: 'Frontend and UI',
    items: ['Vue 3', 'JavaScript', 'Tailwind CSS', 'React / React Native', 'Vite', 'Chart.js', 'HTML', 'CSS'],
  },
  {
    title: 'Backend and data',
    items: ['Node.js', 'Express', 'REST APIs', 'JWT auth', 'PHP / Laravel', 'MySQL', 'MongoDB', 'Power BI', 'Excel / CSV processing'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'Postman', 'VS Code', 'Cursor', 'Vercel', 'Hostinger', 'XAMPP'],
  },
  {
    title: 'Domain and product thinking',
    items: ['Dashboard design', 'KPI framing', 'Surveillance reporting', 'Decision-support interfaces'],
  },
  {
    title: 'Collaboration',
    items: ['Cross-functional delivery', 'Research support', 'Public health context'],
  },
]

export const about = {
  sectionLabel: 'About',
  title: 'I build product UI for complex workflows.',
  paragraphs: [
    'Clear screens, faster decisions.',
  ],
  differentiators: [
    'Workflow-first UI',
    'Data-heavy UX',
    'Clarity under pressure',
  ],
}

export const contact = {
  title: "Let's build products people actually use.",
  intro: 'Open to frontend and product-focused roles in analytics, dashboards, and workflow systems.',
  availabilityBadge: 'Open to roles',
  availability: 'Best fit: product UI, data-heavy screens, and workflow tools.',
  links: [
    {
      label: 'Email',
      description: 'gianrubillarcabrera@gmail.com',
      url: 'mailto:gianrubillarcabrera@gmail.com',
      icon: 'mail',
      ariaLabel: 'Email Gian Cabrera',
    },
    {
      label: 'Book a call',
      description: 'calendly.com/gianrubillarcabrera/30min',
      url: 'https://calendly.com/gianrubillarcabrera/30min',
      icon: 'calendar',
      ariaLabel: 'Book a call with Gian Cabrera on Calendly',
    },
    {
      label: 'Resume',
      description: 'Download resume PDF',
      url: '/gian-cabrera-resume.pdf',
      icon: 'file',
      hint: 'PDF',
      ariaLabel: 'Download Gian Cabrera resume as PDF',
    },
    {
      label: 'LinkedIn',
      description: 'linkedin.com/in/gian-cabrera-2011b3256',
      url: 'https://linkedin.com/in/gian-cabrera-2011b3256',
      icon: 'linkedin',
      ariaLabel: "Open Gian Cabrera's LinkedIn profile",
    },
    {
      label: 'GitHub',
      description: 'github.com/gian-r-cabrera',
      url: 'https://github.com/gian-r-cabrera',
      icon: 'github',
      ariaLabel: "Open Gian Cabrera's GitHub profile",
    },
  ],
}

/** Full case study pages, keyed by the page slug (e.g. /rabdash-dc-mobile/). */
export const caseStudies = {
  'rabdash-dc-mobile': {
    title: 'RabDash DC Mobile',
    kicker: 'Case study · From thesis to production',
    tagline:
      'An Android app that brings rabies vaccination and case reporting for the Davao City Veterinarian’s Office (CVO) and private veterinarians into one place.',
    facts: [
      { label: 'My role', value: 'Full-stack developer, now lead developer' },
      { label: 'Timeline', value: 'Mar 2023 – present' },
      { label: 'Platform', value: 'Android' },
      { label: 'Stack', value: 'React Native · Express.js · Node.js · MySQL' },
      { label: 'Users', value: 'CVO staff and private veterinarians, Davao City' },
      { label: 'Recognition', value: 'Finalist, Best Thesis in Computer Science (Poster)' },
    ],
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Private veterinary clinics across Davao City give rabies vaccinations, but the CVO had no direct way to receive those records. Its staff had to go around the city to collect the data from each clinic, so it was hard to collect accurately and stayed scattered.',
          'The RabDash DC project, which aims for a rabies-free Davao City by 2030, needed that data in one place, sent straight from the people doing the vaccinations.',
        ],
      },
      {
        heading: 'What I built',
        paragraphs: [
          'RabDash DC Mobile started as my solo undergraduate thesis at UP Mindanao: a centralized app for rabies vaccination reporting. I built it full stack on my own, from the React Native screens to the API and database behind them.',
        ],
        bullets: [
          'Accounts: sign up, login, password reset, and user profiles.',
          'Input forms that mirror the CVO’s reports: field vaccination, neuter, animal control and rehabilitation, rabies sample information, human rabies exposure, schedules and events, seminars and IEC reports, and budget.',
          'Data tables to review submitted records for each form.',
          'Downloadable copies of the blank forms for offline paperwork.',
          'Reporting flows for both CVO staff and private veterinarians.',
          'An Express and Node.js API with a MySQL database.',
        ],
      },
    ],
    screensHeading: 'Screens',
    screens: [
      { src: '/Landing_page.webp', caption: 'Welcome', alt: 'RabDash DC welcome screen with login and sign up buttons' },
      { src: '/login.webp', caption: 'Login', alt: 'Login screen' },
      { src: '/menu_cvo.webp', caption: 'Main menu', alt: 'Main menu with input forms, data tables, downloadable forms, profile, and about' },
      { src: '/CVO_Data_Tables_Menu.webp', caption: 'Data tables', alt: 'CVO data tables menu listing eight report types' },
      { src: '/Downloadable_Forms_CVO.webp', caption: 'Downloadable forms', alt: 'Downloadable forms menu listing eight blank CVO forms' },
      { src: '/User_Profile.webp', caption: 'Profile', alt: 'User profile screen' },
      { src: '/register.webp', caption: 'Sign up', alt: 'Registration screen' },
      { src: '/reset_forgotten_password.webp', caption: 'Reset password', alt: 'Reset forgotten password screen' },
    ],
    timelineHeading: 'From thesis to production',
    timeline: [
      { date: 'Mar 2023', text: 'Joined RabDash DC at UP Mindanao as a student researcher and summer intern, and began building the app as my thesis.' },
      { date: '2023 – 2024', text: 'Built and tested the app, and digitized historical vaccination records so they could be migrated into it.' },
      { date: 'May 2024', text: 'Defended the thesis; finalist for Best Thesis in Computer Science (Poster). Graduated cum laude.' },
      { date: 'Jun 2026 – now', text: 'As Junior Programmer at the DiWA Center, I lead the app’s full-stack build. I also maintain and lead RabDash DC’s web system, which I inherited.' },
    ],
  },
}

export const research = {
  intro: 'Papers and pitches where I present the public health systems I build, newest first.',
  items: [
    {
      type: 'Project pitch',
      title:
        'DiWA PLUS: Advancing the Disease Watch and Analytics (DiWA) App as an Integrated Disease Surveillance and Predictive Analytics Platform for Mindanao',
      event: '16th Health R&D Expo and Mentorship Program 2026',
      location: 'World Palace Hotel, Davao City',
      date: 'Oct 13, 2026',
      role: 'Presenter',
      summary:
        'Pitched DiWA PLUS as a flagship project proposal in the mentorship program: extending the DiWA app into an integrated disease surveillance and predictive analytics platform for Mindanao.',
    },
    {
      type: 'Paper presentation',
      title:
        'Development and Implementation of RabDash DC: A Web-Based Rabies Data Management and Analytics System for Davao City',
      event: 'International Conference for Interdisciplinary Approaches to Health (ICIAH) 2026',
      location: 'Virtual',
      date: 'Sep 9, 2026',
      role: 'Presenter',
      summary:
        'Presented the design and rollout of RabDash DC, a web system that replaced the Davao City Veterinarian’s Office’s paper-based rabies forms and has supported its rabies data management and monitoring since 2023.',
      /** Set `url` to the published paper once it is out, and remove `status`. */
      status: 'Publication forthcoming',
    },
  ],
}

export const gallery = {
  title: 'Gallery',
  heading: 'Moments in tech.',
  intro: 'Selected moments from conferences, presentations, demos, and milestones in my journey in tech.',
  /**
   * Newest first; events are grouped by the year in `date`.
   * `cover`: card image (falls back to the first photo); `shortTitle`: card label (falls back to title);
   * `related`: optional link shown on the card and in the viewer. Each photo's `title` (badge) and `alt` show as its caption.
   */
  events: [
    {
      title: 'Regional Science, Technology, and Innovation Week (RSTW) 2026',
      date: 'Oct 17, 2026',
      shortTitle: 'RSTW 2026',
      meta: 'SMX Convention Center Davao · Oct 17, 2026 · DiWA Center exhibit',
      cover: '/gallery-thumbs/RSTW_1.webp',
      photos: [
        {
          title: 'EXHIBIT',
          meta: 'RSTW 2026',
          src: '/RSTW_1.webp',
          alt: 'DiWA Center team at their exhibit booth during RSTW 2026 at SMX Convention Center Davao',
        },
        {
          title: 'DEMO',
          meta: 'RSTW 2026',
          src: '/RSTW_2.webp',
          alt: 'Demonstrating the DiWA app to a group of students at RSTW 2026',
        },
        {
          title: 'DEMO',
          meta: 'RSTW 2026',
          src: '/RSTW_3.webp',
          alt: 'Walking a group of students through the DiWA dashboards at the RSTW 2026 booth',
        },
      ],
    },
    {
      title: '16th Health R&D Expo and Mentorship Program 2026',
      date: 'Oct 12–13, 2026',
      related: { label: 'See the talk', href: '#research' },
      shortTitle: 'Health R&D Expo 2026',
      meta: 'World Palace Hotel, Davao City · Oct 12–13, 2026 · DiWA PLUS presentation',
      cover: '/gallery-thumbs/Mentorship_program_2.webp',
      photos: [
        {
          title: 'PRESENTATION',
          meta: '16th Health R&D Expo',
          src: '/Mentorship_program_1.webp',
          alt: 'Presenting "DiWA PLUS: Advancing the Disease Watch and Analytics (DiWA) App as an Integrated Disease Surveillance and Predictive Analytics Platform for Mindanao" at the 16th Health R&D Expo and Mentorship Program 2026',
        },
        {
          title: 'TEAM',
          meta: '16th Health R&D Expo',
          src: '/Mentorship_program_2.webp',
          alt: 'DiWA Center team group photo on stage at the 16th Health R&D Expo and Mentorship Program 2026',
        },
      ],
    },
    {
      title: 'International Conference for Interdisciplinary Approaches to Health (ICIAH) 2026',
      date: 'Sep 9, 2026',
      related: { label: 'See the talk', href: '#research' },
      shortTitle: 'ICIAH 2026',
      meta: 'Virtual · Sep 9, 2026 · Paper presentation on RabDash DC',
      cover: '/gallery-thumbs/ICIAH_1.webp',
      photos: [
        {
          title: 'RESEARCH',
          meta: 'ICIAH 2026',
          src: '/ICIAH_1.webp',
          alt: 'Gian presenting the paper "Development and Implementation of RabDash DC: A Web-Based Rabies Data Management and Analytics System for Davao City" at ICIAH 2026',
        },
        {
          title: 'RESEARCH',
          meta: 'ICIAH 2026',
          src: '/ICIAH_3.webp',
          alt: 'ICIAH 2026 presentation slide on the Davao City Veterinarian’s Office and its paper-based data-entry forms',
        },
        {
          title: 'RESEARCH',
          meta: 'ICIAH 2026',
          src: '/ICIAH_2.webp',
          alt: 'ICIAH 2026 presentation slide on RabDash DC implementation and adoption since 2023',
        },
      ],
    },
    {
      title: 'DiWA App Caravan',
      date: 'Jun 15–22, 2026',
      meta: 'Davao Region · Jun 15–22, 2026 · Product demonstration',
      cover: '/gallery-thumbs/DiWA_App_Caravan_3.webp',
      photos: [
        {
          title: 'DEMO',
          meta: 'DiWA App Caravan',
          src: '/DiWA_App_Caravan_1.webp',
          alt: 'Gian presenting the DiWA app during the DiWA App Caravan',
        },
        {
          title: 'DEMO',
          meta: 'DiWA App Caravan',
          src: '/DiWA_App_Caravan_2.webp',
          alt: 'Health office staff watching a DiWA app demonstration in a conference room',
        },
        {
          title: 'PARTNERS',
          meta: 'Department of Health Davao Region',
          src: '/DiWA_App_Caravan_3.webp',
          alt: 'Group photo with the Department of Health Davao Region team during the DiWA App Caravan',
        },
        {
          title: 'PARTNERS',
          meta: 'Carmen Municipal Health Office',
          src: '/DiWA_App_Caravan_4.webp',
          alt: 'Group photo with the Carmen Municipal Health Office team during the DiWA App Caravan',
        },
      ],
    },
    {
      title: 'PythonAsia 2026',
      date: 'Mar 21–23, 2026',
      meta: 'Manila · Mar 21–23, 2026 · Community event',
      cover: '/gallery-thumbs/PythonAsia2026_group.webp',
      photos: [
        {
          title: 'CONFERENCE',
          meta: 'PythonAsia 2026',
          src: '/PythonAsia2026.webp',
          alt: 'Photo at PythonAsia 2026 event backdrop',
        },
        {
          title: 'CONFERENCE',
          meta: 'PythonAsia 2026',
          src: '/PythonAsia2026_group.webp',
          alt: 'Group photo at PythonAsia 2026 event backdrop',
        },
      ],
    },
    {
      title: 'Mindanao Startup Summit',
      date: 'Sep 2025',
      meta: 'Mindanao · Sep 2025 · Startup ecosystem',
      cover: '/gallery-thumbs/Mindanao_StartUpSummit1.webp',
      photos: [
        {
          title: 'COMMUNITY',
          meta: 'Mindanao Startup Summit',
          src: '/Mindanao_StartUpSummit1.webp',
          alt: 'Photo from Mindanao Startup Summit event',
        },
        {
          title: 'COMMUNITY',
          meta: 'Mindanao Startup Summit',
          src: '/Mindanao_StartUpSummit2.webp',
          alt: 'Second photo from Mindanao Startup Summit event',
        },
      ],
    },
    {
      title: 'Pycon Davao 2024',
      date: 'Sep 2024',
      meta: 'Davao · Sep 2024 · Community event',
      cover: '/gallery-thumbs/PyconDavao2024.webp',
      photos: [
        {
          title: 'COMMUNITY',
          meta: 'Pycon Davao 2024',
          src: '/PyconDavao2024.webp',
          alt: 'Photo from Pycon Davao 2024 event',
        },
        {
          title: 'COMMUNITY',
          meta: 'Pycon Davao 2024',
          src: '/PyconDavao2024_2.webp',
          alt: 'Second photo from Pycon Davao 2024 event',
        },
      ],
    },
    {
      title: 'Thesis defense',
      date: 'May 2024',
      meta: 'UP Mindanao · May 2024 · Presentation day',
      cover: '/gallery-thumbs/thesis_def1.webp',
      photos: [
        {
          title: 'PRESENTATION',
          meta: 'Thesis defense',
          src: '/thesis_def1.webp',
          alt: 'Thesis defense photo with panelists part 2',
        },
        {
          title: 'PRESENTATION',
          meta: 'Thesis defense',
          src: '/thesis_def2.webp',
          alt: 'Thesis defense photo with panelists part 2',
        },
      ],
    },
  ],
}

export const recommendationsMeta = {
  intro: 'Short notes from people I’ve worked and studied with.',
  linkedinReceivedUrl:
    'https://www.linkedin.com/in/gian-cabrera-2011b3256/details/recommendations/?detailScreenTabIndex=0',
}

export const recommendations = [
  {
    quote:
      'I’ve had the pleasure of working with Gian at the Mindanao Center for Disease Watch and Analytics (DiWA Center) for more than a year now, where he is a Programmer on our Technological Development Team supporting the DiWA Web App. He has shown strong technical ability, especially in developing dashboards and contributing thoughtful features and ideas that help improve the application. What makes Gian especially valuable, however, is not only his technical competence but also his clear communication, organized approach to work, and steady positivity even during demanding situations. He is supportive of his teammates and brings an encouraging, optimistic presence to the center. Gian continues to be an important member of our team, and I truly appreciate the opportunity to work with him.',
    name: 'Andrew Kenan Songahid',
    role: 'Junior Programmer @ DiWA Center',
    relationship: 'Colleague · DiWA',
    sourceDate: 'Apr 2026',
    sourceLabel: 'Recommendation',
    avatarUrl: '/recommendations/andrew-kenan-songahid-192.jpeg',
    avatarSrcSet:
      '/recommendations/andrew-kenan-songahid-96.jpeg 1x, /recommendations/andrew-kenan-songahid-192.jpeg 2x',
    linkedinUrl: 'https://www.linkedin.com/in/andrew-kenan-songahid-9ab921285',
  },
  {
    quote:
      'I am pleased to recommend Gian Cabrera, my coworker at the DiWA Center, who has consistently shown himself to be adaptable, dependable, and easy to work with. He is highly open to mentorship and demonstrates a strong willingness to learn, grow, and improve in his work. Gian also brings thoughtful perspectives to discussions and approaches tasks with strong critical thinking and sound judgment. What stands out most is his ability to work independently while still collaborating effectively with others. I am confident that he will be a valuable asset in any team or organization he joins.',
    name: 'Guy Ivan Ocon',
    role: 'Software Applications Engineer @ Nascent Batteries',
    relationship: 'Colleague · DiWA',
    sourceDate: 'Apr 2026',
    sourceLabel: 'Recommendation',
    avatarUrl: '/recommendations/guy-ivan-ocon-192.jpeg',
    avatarSrcSet: '/recommendations/guy-ivan-ocon-96.jpeg 1x, /recommendations/guy-ivan-ocon-192.jpeg 2x',
    linkedinUrl: 'https://www.linkedin.com/in/guyivanocon',
  },
  {
    quote:
      'I’ve known Gian since our college years, and his professional growth has been impressive. He is remarkably resilient; he approaches complex challenges with a persistent, solution-oriented mindset and a refusal to give up until the job is done. This tenacity is matched by his natural ability to collaborate. Even during intense academic or personal projects, Gian maintained his composure and stayed focused, often acting as a steadying influence on the group. With his dual expertise in software and hardware development, Gian is a versatile asset to any team. He is a high-caliber professional who elevates the work of those around him, and I recommend him to any organization looking for someone dedicated and technically skilled.',
    name: 'Harold Clyde Valiente',
    role: 'Computer Programmer @ UP Mindanao',
    relationship: 'UP Mindanao · colleague',
    sourceDate: 'Jun 2026',
    sourceLabel: 'Recommendation',
    avatarUrl: '/recommendations/harold-clyde-valiente-192.jpg',
    avatarSrcSet:
      '/recommendations/harold-clyde-valiente-96.jpg 1x, /recommendations/harold-clyde-valiente-192.jpg 2x',
    linkedinUrl: 'https://www.linkedin.com/in/harold-clyde-valiente-36b178219',
  },
  {
    quote:
      'I’ve known Gian as both a classmate and roommate at UP Mindanao. He consistently delivers quality work, learns new technologies quickly, and approaches every task with professionalism and integrity. Gian is dependable, adaptable, and someone I would confidently recommend for any team looking for a strong contributor and lifelong learner.',
    name: 'Francis Celeste',
    role: 'BS Computer Science, UP Mindanao',
    relationship: 'UP Mindanao · classmate',
    sourceDate: 'Jun 2026',
    sourceLabel: 'Recommendation',
    avatarUrl: '/recommendations/francis-celeste-192.jpg',
    avatarSrcSet: '/recommendations/francis-celeste-96.jpg 1x, /recommendations/francis-celeste-192.jpg 2x',
    linkedinUrl: 'https://www.linkedin.com/in/feceleste',
  },
]
