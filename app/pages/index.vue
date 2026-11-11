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

const verfahrenListRef = ref<HTMLElement | null>(null);
let stickyPushRaf = 0;

function nextFollowingTop(header: HTMLElement, candidates: HTMLElement[]) {
  for (const candidate of candidates) {
    if (header.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING) {
      return candidate.getBoundingClientRect().top;
    }
  }
  return Number.POSITIVE_INFINITY;
}

function applyStickyPush(
  headers: HTMLElement[],
  stickyTop: number,
  extraPushers: HTMLElement[] = [],
) {
  for (const header of headers) {
    header.style.transform = "none";
  }

  const heights = headers.map((header) => header.offsetHeight);
  const sameLevelTops = headers.map((header) => header.getBoundingClientRect().top);

  headers.forEach((header, index) => {
    const nextSameTop = sameLevelTops[index + 1] ?? Number.POSITIVE_INFINITY;
    const nextExtraTop = nextFollowingTop(header, extraPushers);
    const nextTop = Math.min(nextSameTop, nextExtraTop);

    if (!Number.isFinite(nextTop)) {
      header.style.transform = "";
      return;
    }

    const push = Math.min(0, nextTop - stickyTop - heights[index]!);
    header.style.transform = push < 0 ? `translateY(${push}px)` : "";
  });
}

function syncStickyPush() {
  const list = verfahrenListRef.value;
  if (!list) return;

  const deptHeaders = [...list.querySelectorAll<HTMLElement>(".dept-heading")];
  const abtHeaders = [...list.querySelectorAll<HTMLElement>(".abt-heading")];

  applyStickyPush(deptHeaders, 0);

  const abtStickyTop = abtHeaders[0]
    ? Number.parseFloat(getComputedStyle(abtHeaders[0]).top)
    : 0;
  applyStickyPush(
    abtHeaders,
    Number.isFinite(abtStickyTop) ? abtStickyTop : 0,
    deptHeaders,
  );
}

function scheduleStickyPush() {
  if (stickyPushRaf) return;
  stickyPushRaf = window.requestAnimationFrame(() => {
    stickyPushRaf = 0;
    syncStickyPush();
  });
}

onMounted(() => {
  window.addEventListener("scroll", scheduleStickyPush, { passive: true });
  window.addEventListener("resize", scheduleStickyPush);
  scheduleStickyPush();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scheduleStickyPush);
  window.removeEventListener("resize", scheduleStickyPush);
  if (stickyPushRaf) {
    window.cancelAnimationFrame(stickyPushRaf);
    stickyPushRaf = 0;
  }
});

watch(deptGroups, async () => {
  await nextTick();
  scheduleStickyPush();
});
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

      <div
        v-else
        ref="verfahrenListRef"
        class="verfahren-list"
      >
        <template
          v-for="dept in deptGroups"
          :key="dept.name"
        >
          <h2
            class="dept-heading text-green-500"
            :class="{ 'dept-heading--solo': !hasNamedAbteilung(dept) }"
          >
            <span class="dept-label-full">{{ dept.name }}</span>
            <span class="dept-label-short">{{ dept.abbreviation ?? dept.name }}</span>
          </h2>

          <template
            v-for="abt in dept.abteilungen"
            :key="abt.name ?? 'ohne'"
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
            <div class="abt-block">
              <VerfahrenAccordion
                :items="abt.items"
                :open-all="hasQuery"
                :id-prefix="accordionPrefix(dept.name, abt.name)"
              />
            </div>
          </template>
        </template>

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

.verfahren-list {
  --dept-heading-height: calc(14px + 1.35 * 1.125rem);
}

.abt-block + .dept-heading {
  margin-top: 40px;
}

.dept-heading,
.abt-heading {
  margin: 0 -12px;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  background-color: #fff;
  box-shadow: -12px 0 0 #fff, 12px 0 0 #fff;
  will-change: transform;
}

.dept-heading {
  position: sticky;
  top: 0;
  z-index: 3;
  padding: 12px 12px 2px;
}

.dept-heading--solo {
  padding-bottom: 18px;
}

.abt-heading {
  position: sticky;
  top: calc(var(--dept-heading-height) - 2px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 4px;
  margin-top: -2px;
  margin-bottom: 12px;
  box-shadow: -12px 0 0 #fff, 12px 0 0 #fff, 0 -2px 0 #fff;
}

.abt-block + .abt-heading {
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
  .verfahren-list {
    --dept-heading-height: calc(14px + 1.35 * 1.25rem);
  }

  .dept-heading,
  .abt-heading {
    font-size: 1.25rem;
  }
}
</style>
