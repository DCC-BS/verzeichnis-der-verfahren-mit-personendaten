<script setup lang="ts">
import IconSymbolCaret from "@kanton-basel-stadt/designsystem/icons/symbol/caret";
import type { Verfahren } from "~/types/verfahren";

const { verfahren, status, departmentOptions, abteilungenFor } = useVerfahren();
const { query, department, abteilung, filtered } = useVerfahrenFilter(verfahren);

const abteilungOptions = computed(() => abteilungenFor(department.value || null));

const hasQuery = computed(() => query.value.trim().length > 0);

interface AbteilungGroup {
  name: string | null;
  items: Verfahren[];
}

interface DepartmentGroup {
  name: string;
  abbreviation: string | null;
  abteilungen: AbteilungGroup[];
}

const deptGroups = computed<DepartmentGroup[]>(() => {
  const result: DepartmentGroup[] = [];

  for (const v of filtered.value) {
    let dept = result[result.length - 1];
    if (!dept || dept.name !== v.department) {
      dept = {
        name: v.department,
        abbreviation: getDepartmentAbbreviation(v.department),
        abteilungen: [],
      };
      result.push(dept);
    }

    const abtName = v.abteilung ?? null;
    let abt = dept.abteilungen[dept.abteilungen.length - 1];
    if (!abt || abt.name !== abtName) {
      abt = { name: abtName, items: [] };
      dept.abteilungen.push(abt);
    }
    abt.items.push(v);
  }

  return result;
});

function accordionPrefix(deptName: string, abtName: string | null) {
  return `verfahren-${slugify(deptName)}-${slugify(abtName ?? "ohne")}`;
}

function hasNamedAbteilung(dept: DepartmentGroup) {
  return dept.abteilungen.some((abt) => Boolean(abt.name));
}
</script>

<template>
  <div>
    <h1 class="header-title text-primary-600 hyphens-auto text-balance">
      Verzeichnis der Verfahren mit Personendaten
    </h1>
    <p class="lead mt-30 hyphens-auto lg:hyphens-none text-pretty">
      Die öffentlichen Organe sind verpflichtet, über Angelegenheiten von allgemeinem Interesse
      aktiv zu informieren. Das folgende Verzeichnis listet die Verfahren der kantonalen Verwaltung
      Basel-Stadt nach Organisationen auf.
    </p>

    <SearchFilterBar
      v-model:query="query"
      v-model:department="department"
      v-model:abteilung="abteilung"
      :department-options="departmentOptions"
      :abteilung-options="abteilungOptions"
      class="mt-20 lg:mt-30"
    />

    <div v-if="status === 'pending'" class="text-gray-500">
      Daten werden geladen...
    </div>

    <template v-else>
      <p class="result-count">
        <strong>{{ filtered.length }} Verfahren</strong>
      </p>

      <div v-if="filtered.length === 0" class="text-gray-600">
        Keine Verfahren gefunden. Bitte passen Sie Ihre Suche oder die Filter an.
      </div>

      <div v-else class="verfahren-list">
        <section
          v-for="dept in deptGroups"
          :key="dept.name"
          class="dept-block"
        >
          <h2
            class="dept-heading text-green-500"
            :class="{ 'dept-heading--solo': !hasNamedAbteilung(dept) }"
          >
            <span class="dept-label-full">{{ dept.name }}</span>
            <span class="dept-label-short">{{ dept.abbreviation ?? dept.name }}</span>
          </h2>

          <section
            v-for="abt in dept.abteilungen"
            :key="abt.name ?? 'ohne'"
            class="abt-block"
          >
            <div
              v-if="abt.name"
              class="abt-heading text-green-500"
            >
              <span class="breadcrumb-sep" aria-hidden="true">
                <component :is="IconSymbolCaret" class="breadcrumb-caret" />
                <component :is="IconSymbolCaret" class="breadcrumb-caret breadcrumb-caret--nested" />
              </span>
              <span>{{ abt.name }}</span>
            </div>
            <VerfahrenAccordion
              :items="abt.items"
              :open-all="hasQuery"
              :id-prefix="accordionPrefix(dept.name, abt.name)"
            />
          </section>
        </section>

        <ScrollJumpButtons />
      </div>
    </template>
  </div>
</template>

<style scoped>
.result-count {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.125rem;
}

.dept-block {
  margin-top: 40px;
}

.dept-block:first-child {
  margin-top: 0;
}

.dept-heading,
.abt-heading {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
}

.dept-heading {
  padding: 12px 0 2px;
}

.dept-heading--solo {
  margin-bottom: 16px;
}

.abt-heading {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0 0;
  margin-bottom: 16px;
}

.abt-block + .abt-block {
  margin-top: 24px;
}

.dept-label-full {
  white-space: nowrap;
}

.dept-label-short {
  display: none;
  white-space: nowrap;
}

.breadcrumb-sep {
  position: relative;
  flex-shrink: 0;
  display: block;
  width: 1.05em;
  height: 0.7em;
}

.breadcrumb-caret {
  position: absolute;
  top: 50%;
  left: 0;
  width: 0.72em;
  height: 0.48em;
  transform: translateY(-50%) rotate(-90deg);
}

.breadcrumb-caret--nested {
  left: 0.34em;
}

@media (max-width: 767px) {
  .dept-label-full {
    display: none;
  }

  .dept-label-short {
    display: inline;
  }
}

@media (min-width: 768px) {
  .dept-heading,
  .abt-heading {
    font-size: 1.25rem;
  }
}
</style>
