import type { Ref } from "vue";
import type { Verfahren } from "~/types/verfahren";

const UMLAUT_MAP: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
};

function normalize(text: string): string {
  let value = text.toLowerCase();
  for (const [char, replacement] of Object.entries(UMLAUT_MAP)) {
    value = value.replaceAll(char, replacement);
  }
  return value.normalize("NFD").replace(/\p{M}/gu, "").trim();
}

function haystack(v: Verfahren): string {
  return normalize(
    [
      v.bezeichnung,
      v.zweck_der_datenbearbeitung,
      v.verantwortliche_stelle,
      ...(v.rechtsgrundlage_n ?? []),
      ...(v.quelle_n ?? []),
      v.department,
      v.abteilung ?? "",
    ].join(" "),
  );
}

export function useVerfahrenFilter(verfahren: Ref<Verfahren[]>) {
  const route = useRoute();
  const router = useRouter();

  const query = ref<string>(typeof route.query.q === "string" ? route.query.q : "");
  const department = ref<string>(typeof route.query.dep === "string" ? route.query.dep : "");
  const abteilung = ref<string>(typeof route.query.abt === "string" ? route.query.abt : "");

  let suppressAbteilungReset = false;

  watch(department, () => {
    if (suppressAbteilungReset) return;
    abteilung.value = "";
  });

  function applyAbteilungFilter(deptName: string, abtName: string) {
    suppressAbteilungReset = true;
    department.value = deptName;
    abteilung.value = abtName;
    queueMicrotask(() => {
      suppressAbteilungReset = false;
    });
  }

  watch([query, department, abteilung], ([q, dep, abt]) => {
    router.replace({
      query: {
        ...(q ? { q } : {}),
        ...(dep ? { dep } : {}),
        ...(abt ? { abt } : {}),
      },
    });
  });

  const filtered = computed<Verfahren[]>(() => {
    const needle = normalize(query.value);
    const terms = needle.split(/\s+/).filter(Boolean);

    return verfahren.value.filter((v) => {
      if (department.value && v.department !== department.value) return false;
      if (abteilung.value && v.abteilung !== abteilung.value) return false;

      if (terms.length === 0) return true;
      const hay = haystack(v);
      return terms.every((term) => hay.includes(term));
    });
  });

  return { query, department, abteilung, filtered, applyAbteilungFilter };
}
