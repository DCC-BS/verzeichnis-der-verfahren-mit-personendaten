export interface Verfahren {
  department: string;
  abteilung: string | null;
  bezeichnung: string;
  rechtsgrundlage_n: string[];
  quelle_n: string[];
  verantwortliche_stelle: string;
  internetauftritt: string;
  zweck_der_datenbearbeitung: string;
  source_url: string;
  path: string;
}
