export default defineAppConfig({
  dashboard: {
    showNavBar: false,
    logoHref: "https://www.bs.ch",
    aboutLink: "https://www.bs.ch/pd/statistik",
    aboutLabel: "Über uns",
    footer: {
      contactLinks: [
        { href: "https://www.bs.ch/pd/statistik", label: "Statistisches Amt" },
        { href: "https://www.bs.ch/daten/databs/dcc", label: "DCC Data Competence Center" },
        { href: "https://data.bs.ch/explore/dataset/100520/", label: "Link zur Datenquelle" },
        {
          href: "https://github.com/DCC-BS/verzeichnis-der-verfahren-mit-personendaten",
          label: "Code auf Github",
          showGithubIcon: true,
        },
      ],
      metaLinks: [
        { href: "https://www.bs.ch/", label: "Startseite" },
        { href: "https://www.bs.ch/datenschutzerklaerung", label: "Datenschutz" },
      ],
      copyrightYear: new Date().getFullYear(),
    },
  },
});
