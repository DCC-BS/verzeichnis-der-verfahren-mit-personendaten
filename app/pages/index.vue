<script setup lang="ts">
import IconSymbolCaret from "@kanton-basel-stadt/designsystem/icons/symbol/caret";
import type { Verfahren } from "~/types/verfahren";

const { verfahren, status, departmentOptions, abteilungenFor } = useVerfahren();
const { query, department, abteilung, filtered, applyAbteilungFilter } = useVerfahrenFilter(verfahren);

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

const vDeptHeight = {
  mounted(el: HTMLElement) {
    const parent = el.closest(".dept-block") as HTMLElement | null;
    const apply = () => {
      parent?.style.setProperty("--dept-h", `${el.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    (el as HTMLElement & { _deptHeightObserver?: ResizeObserver })._deptHeightObserver = observer;
  },
  unmounted(el: HTMLElement & { _deptHeightObserver?: ResizeObserver }) {
    el._deptHeightObserver?.disconnect();
  },
};

function selectDepartment(name: string) {
  if (department.value === name && !abteilung.value) {
    department.value = "";
    return;
  }
  if (department.value === name) {
    abteilung.value = "";
    return;
  }
  department.value = name;
}

function selectAbteilung(deptName: string, abtName: string | null) {
  if (!abtName) return;
  if (department.value === deptName && abteilung.value === abtName) {
    abteilung.value = "";
    return;
  }
  applyAbteilungFilter(deptName, abtName);
}

function accordionPrefix(deptName: string, abtName: string | null) {
  return `verfahren-${slugify(deptName)}-${slugify(abtName ?? "ohne")}`;
}

function isDeptSelected(deptName: string) {
  return department.value === deptName && !abteilung.value;
}

function isAbtSelected(deptName: string, abtName: string | null) {
  return Boolean(abtName) && department.value === deptName && abteilung.value === abtName;
}

function crumbClass(selected: boolean) {
  return selected ? "text-green-700" : "text-green-500";
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
      Basel-Stadt auf, bei denen personenbezogene Daten bearbeitet werden.
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
        <strong>{{ filtered.length }}</strong> Verfahren
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
            v-dept-height
            class="dept-heading"
          >
            <button
              type="button"
              class="breadcrumb-link"
              :class="crumbClass(isDeptSelected(dept.name))"
              :aria-current="isDeptSelected(dept.name) ? 'true' : undefined"
              :aria-label="dept.name"
              :title="isDeptSelected(dept.name)
                ? `Filter «${dept.name}» aufheben`
                : `Nach Departement «${dept.name}» filtern`"
              @click="selectDepartment(dept.name)"
            >
              <span class="dept-label-full">{{ dept.name }}</span>
              <span class="dept-label-short">{{ dept.abbreviation ?? dept.name }}</span>
            </button>
          </h2>

          <section
            v-for="abt in dept.abteilungen"
            :key="abt.name ?? 'ohne'"
            class="abt-block"
          >
            <div
              v-if="abt.name"
              class="abt-heading"
            >
              <span class="breadcrumb-sep text-green-500" aria-hidden="true">
                <component :is="IconSymbolCaret" class="breadcrumb-caret" />
                <component :is="IconSymbolCaret" class="breadcrumb-caret breadcrumb-caret--nested" />
              </span>
              <button
                type="button"
                class="breadcrumb-link"
                :class="crumbClass(isAbtSelected(dept.name, abt.name))"
                :aria-current="isAbtSelected(dept.name, abt.name) ? 'true' : undefined"
                :title="isAbtSelected(dept.name, abt.name)
                  ? `Filter «${abt.name}» aufheben`
                  : `Nach Abteilung «${abt.name}» filtern`"
                @click.stop="selectAbteilung(dept.name, abt.name)"
              >
                {{ abt.name }}
              </button>
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
  --dept-h: 3.25rem;
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
  background-color: #fff;
}

.dept-heading {
  position: sticky;
  top: 0;
  z-index: 42;
  padding: 12px 0 2px;
}

.abt-heading {
  position: sticky;
  top: var(--dept-h);
  z-index: 41;
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

.breadcrumb-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
}

.breadcrumb-link:hover,
.breadcrumb-link:focus-visible {
  text-decoration: none;
  opacity: 0.8;
}

@media (max-width: 767px) {
  .dept-label-full {
    display: none;
  }

  .dept-label-short {
    display: inline;
  }

  .dept-heading,
  .abt-heading {
    margin-left: -15px;
    margin-right: -15px;
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media (min-width: 768px) {
  .dept-heading,
  .abt-heading {
    font-size: 1.25rem;
  }
}
</style>
