interface DepartmentMeta {
  intro: string
  hasAbteilungen: boolean
}

const DEPARTMENT_ORDER = [
  'Präsidialdepartement',
  'Bau- und Verkehrsdepartement',
  'Erziehungsdepartement',
  'Finanzdepartement',
  'Gesundheitsdepartement',
  'Justiz- und Sicherheitsdepartement',
  'Departement für Wirtschaft, Soziales und Umwelt',
  'Datenschutzbeauftragter',
  'Finanzkontrolle',
  'Gerichte',
  'Staatsanwaltschaft',
  'Ombudsstelle',
]

const META: Record<string, DepartmentMeta> = {
  Präsidialdepartement: {
    intro:
      'Das Präsidialdepartement bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  'Bau- und Verkehrsdepartement': {
    intro:
      'Das Bau- und Verkehrsdepartement bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  Erziehungsdepartement: {
    intro:
      'Das Erziehungsdepartement bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  Finanzdepartement: {
    intro:
      'Das Finanzdepartement bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  Gesundheitsdepartement: {
    intro:
      'Das Gesundheitsdepartement bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  'Justiz- und Sicherheitsdepartement': {
    intro:
      'Das Justiz- und Sicherheitsdepartement bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  'Departement für Wirtschaft, Soziales und Umwelt': {
    intro:
      'Das Departement für Wirtschaft, Soziales und Umwelt bearbeitet Personendaten in den folgenden Verfahren aufgelistet nach Abteilungen:',
    hasAbteilungen: true,
  },
  Datenschutzbeauftragter: {
    intro: 'Der Datenschutzbeauftragte bearbeitet Personendaten in den folgenden Verfahren:',
    hasAbteilungen: false,
  },
  Finanzkontrolle: {
    intro: 'Die Finanzkontrolle bearbeitet Personendaten in den folgenden Verfahren:',
    hasAbteilungen: false,
  },
  Gerichte: {
    intro: 'Die Gerichte bearbeiten Personendaten in den folgenden Verfahren:',
    hasAbteilungen: true,
  },
  Staatsanwaltschaft: {
    intro: 'Die Staatsanwaltschaft bearbeitet Personendaten in den folgenden Verfahren:',
    hasAbteilungen: false,
  },
  Ombudsstelle: {
    intro: 'Die Ombudsstelle bearbeitet Personendaten in den folgenden Verfahren:',
    hasAbteilungen: false,
  },
}

export function getDepartmentMeta(name: string): DepartmentMeta {
  return META[name] ?? { intro: '', hasAbteilungen: true }
}

export function getDepartmentOrder(): string[] {
  return DEPARTMENT_ORDER
}
