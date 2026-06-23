<script setup lang="ts">
import type { Verfahren } from "~/types/verfahren";

const { verfahren, status, departmentOptions, abteilungenFor } = useVerfahren();
const { query, department, abteilung, filtered } = useVerfahrenFilter(verfahren);

const abteilungOptions = computed(() => abteilungenFor(department.value || null));

const hasQuery = computed(() => query.value.trim().length > 0);

interface VerfahrenGroup {
  label: string;
  items: Verfahren[];
}

const groups = computed<VerfahrenGroup[]>(() => {
  const result: VerfahrenGroup[] = [];
  let current: VerfahrenGroup | null = null;

  for (const v of filtered.value) {
    const label = [v.department, v.abteilung].filter(Boolean).join(" · ");
    if (!current || current.label !== label) {
      current = { label, items: [] };
      result.push(current);
    }
    current.items.push(v);
  }

  return result;
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

      <template v-else>
        <section
          v-for="group in groups"
          :key="group.label"
          class="verfahren-group"
        >
          <h2
            class="pre-heading text-primary-700 sticky top-0 z-40 -mt-15 mb-15 py-15 backdrop-blur-md bg-white/80 transition-all duration-250 ease-in-out mobile-only:-mx-15 mobile-only:px-15"
          >
            {{ group.label }}
          </h2>
          <VerfahrenAccordion :items="group.items" :open-all="hasQuery" />
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped>
.result-count {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.125rem;
}

.verfahren-group {
  margin-top: 30px;
}
</style>
