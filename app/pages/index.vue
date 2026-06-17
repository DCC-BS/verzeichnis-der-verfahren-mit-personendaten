<script setup lang="ts">
import { slugify } from "~/utils/slugify";

const PAGE_SIZE = 25;

const { verfahren, status, departmentOptions, abteilungenFor } = useVerfahren();
const { query, department, abteilung, filtered } = useVerfahrenFilter(verfahren);

const abteilungOptions = computed(() => abteilungenFor(department.value || null));

const page = ref(1);
watch(filtered, () => {
  page.value = 1;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)));
const pagedVerfahren = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filtered.value.slice(start, start + PAGE_SIZE);
});

function goToPage(next: number) {
  page.value = Math.min(Math.max(1, next), totalPages.value);
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function subtitle(v: (typeof filtered.value)[number]) {
  return [v.department, v.abteilung].filter(Boolean).join(" · ");
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

      <template v-else>
        <section
          v-for="v in pagedVerfahren"
          :key="`${v.department}-${v.abteilung}-${v.bezeichnung}`"
          class="verfahren-section"
        >
          <h2 :id="slugify(v.bezeichnung)" class="verfahren-heading scroll-mt-10">
            {{ v.bezeichnung }}
          </h2>
          <p class="verfahren-subtitle">{{ subtitle(v) }}</p>
          <VerfahrenTable :verfahren="v" />
        </section>

        <nav v-if="totalPages > 1" class="pagination" aria-label="Seitennavigation">
          <button
            type="button"
            class="button is-prev is-inverted"
            :disabled="page === 1"
            @click="goToPage(page - 1)"
          >
            Zurück
          </button>
          <span class="pagination-info">Seite {{ page }} von {{ totalPages }}</span>
          <button
            type="button"
            class="button is-next is-inverted"
            :disabled="page === totalPages"
            @click="goToPage(page + 1)"
          >
            Weiter
          </button>
        </nav>
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

.verfahren-heading {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.verfahren-subtitle {
  color: rgb(var(--color-gray-600, 82 82 82));
  font-size: 0.875rem;
  margin-bottom: 10px;
}

.verfahren-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

@media (min-width: 1024px) {
  .verfahren-section {
    margin-top: 50px;
    margin-bottom: 50px;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination-info {
  font-weight: 500;
}
</style>
