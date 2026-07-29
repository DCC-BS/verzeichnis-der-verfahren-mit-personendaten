import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: [join(__dirname, 'node_modules/bs-dashboard-base')],

  compatibilityDate: '2025-01-01',

  runtimeConfig: {
    bsApiKey: process.env.NUXT_BS_API_KEY || '',
    feedback: {
      repo: 'Feedback_verzeichnis-der-verfahren-mit-personendaten',
      repoOwner: 'DCC-BS',
      project: 'verzeichnis-der-verfahren-mit-personendaten',
      githubToken: process.env.FEEDBACK_GITHUB_TOKEN || '',
      label: 'feedback',
    },
  },

  app: {
    baseURL: '/verzeichnis-der-verfahren-mit-personendaten/',
    head: {
      title: 'Verzeichnis der Verfahren mit Personendaten',
      htmlAttrs: { lang: 'de' },
    },
  },
})
