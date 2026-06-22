import { joinURL } from "ufo";
import type { Verfahren } from "~/types/verfahren";
import { getDepartmentOrder } from "~/utils/departmentMeta";

export function useVerfahren() {
  const base = useRuntimeConfig().app.baseURL;
  const { data: rawData, status } = useFetch<Verfahren[]>(() => joinURL(base, "api/verfahren"));

  const order = getDepartmentOrder();
  const departmentRank = (name: string) => {
    const index = order.indexOf(name);
    return index === -1 ? order.length : index;
  };

  const verfahren = computed<Verfahren[]>(() => {
    if (!rawData.value) return [];

    return [...rawData.value].sort((a, b) => {
      const deptDiff = departmentRank(a.department) - departmentRank(b.department);
      if (deptDiff !== 0) return deptDiff;

      const abtDiff = (a.abteilung ?? "").localeCompare(b.abteilung ?? "", "de");
      if (abtDiff !== 0) return abtDiff;

      return a.bezeichnung.localeCompare(b.bezeichnung, "de");
    });
  });

  const departmentOptions = computed<string[]>(() => {
    const seen = new Set<string>();
    for (const v of verfahren.value) {
      if (v.department) seen.add(v.department);
    }
    return [...seen].sort((a, b) => departmentRank(a) - departmentRank(b));
  });

  function abteilungenFor(department: string | null): string[] {
    const seen = new Set<string>();
    for (const v of verfahren.value) {
      if (department && v.department !== department) continue;
      if (v.abteilung) seen.add(v.abteilung);
    }
    return [...seen].sort((a, b) => a.localeCompare(b, "de"));
  }

  return { verfahren, status, departmentOptions, abteilungenFor };
}
