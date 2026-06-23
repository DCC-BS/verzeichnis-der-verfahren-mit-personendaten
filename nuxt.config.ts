export default defineNuxtConfig({
  extends: [["github:StataBS/bs-dashboard-base", { install: true }]],

  compatibilityDate: "2025-01-01",

  runtimeConfig: {
    bsApiKey: process.env.NUXT_BS_API_KEY || "",
    feedback: {
      repo: "Feedback_verzeichnis-der-verfahren-mit-personendaten",
      repoOwner: "DCC-BS",
      project: "verzeichnis-der-verfahren-mit-personendaten",
      githubToken: process.env.FEEDBACK_GITHUB_TOKEN || "",
      label: "feedback",
    },
  },

  app: {
    baseURL: "/verzeichnis-der-verfahren-mit-personendaten/",
    head: {
      title: "Verzeichnis der Verfahren mit Personendaten",
      htmlAttrs: { lang: "de" },
    },
  },
});
