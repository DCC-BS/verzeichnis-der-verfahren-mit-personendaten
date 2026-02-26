export default defineNuxtConfig({
  extends: [
    ['github:StataBS/bs-dashboard-base', { install: true }],
  ],

  compatibilityDate: '2025-01-01',

  runtimeConfig: {
    bsApiKey: process.env.BS_API_KEY || '',
  },

  app: {
    head: {
      title: 'Verzeichnis der Verfahren mit Personendaten',
      htmlAttrs: { lang: 'de' },
    },
  },
})
