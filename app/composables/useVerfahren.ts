import type { AbteilungGroup, DepartmentGroup, Verfahren } from '~/types/verfahren'
import { slugify } from '~/utils/slugify'
import { getDepartmentOrder } from '~/utils/departmentMeta'

export function useVerfahren() {
  const { data: rawData, status } = useFetch<Verfahren[]>('/api/verfahren')

  const departments = computed<DepartmentGroup[]>(() => {
    if (!rawData.value) return []

    const order = getDepartmentOrder()
    const grouped = new Map<string, Map<string | null, Verfahren[]>>()

    for (const v of rawData.value) {
      if (!grouped.has(v.department)) {
        grouped.set(v.department, new Map())
      }
      const deptMap = grouped.get(v.department)!
      const key = v.abteilung
      if (!deptMap.has(key)) {
        deptMap.set(key, [])
      }
      deptMap.get(key)!.push(v)
    }

    const result: DepartmentGroup[] = []
    for (const deptName of order) {
      const abtMap = grouped.get(deptName)
      if (!abtMap) continue

      const abteilungen: AbteilungGroup[] = []
      for (const [abtName, verfahren] of abtMap) {
        abteilungen.push({
          name: abtName,
          slug: slugify(abtName ?? deptName),
          verfahren,
        })
      }

      result.push({ name: deptName, abteilungen })
    }

    return result
  })

  function findBySlug(slug: string): { department: string; abteilung: AbteilungGroup } | null {
    for (const dept of departments.value) {
      for (const abt of dept.abteilungen) {
        if (abt.slug === slug) {
          return { department: dept.name, abteilung: abt }
        }
      }
    }
    return null
  }

  return { departments, status, findBySlug }
}
