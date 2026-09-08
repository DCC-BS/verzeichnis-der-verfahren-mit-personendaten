const DEPARTMENT_ORDER = [
  "Präsidialdepartement",
  "Bau- und Verkehrsdepartement",
  "Erziehungsdepartement",
  "Finanzdepartement",
  "Gesundheitsdepartement",
  "Justiz- und Sicherheitsdepartement",
  "Departement für Wirtschaft, Soziales und Umwelt",
  "Datenschutzbeauftragter",
  "Finanzkontrolle",
  "Gerichte",
  "Staatsanwaltschaft",
  "Ombudsstelle",
];

const DEPARTMENT_ABBREVIATIONS: Record<string, string> = {
  Präsidialdepartement: "PD",
  "Bau- und Verkehrsdepartement": "BVD",
  Erziehungsdepartement: "ED",
  Finanzdepartement: "FD",
  Gesundheitsdepartement: "GD",
  "Justiz- und Sicherheitsdepartement": "JSD",
  "Departement für Wirtschaft, Soziales und Umwelt": "WSU",
};

export function getDepartmentOrder(): string[] {
  return DEPARTMENT_ORDER;
}

export function getDepartmentAbbreviation(name: string): string | null {
  return DEPARTMENT_ABBREVIATIONS[name] ?? null;
}
