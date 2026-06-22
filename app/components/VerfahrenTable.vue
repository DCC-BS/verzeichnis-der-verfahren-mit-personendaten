<script setup lang="ts">
import type { Verfahren } from "~/types/verfahren";

const props = defineProps<{
  verfahren: Verfahren;
}>();

const columns = [
  { key: "label", label: "", thClass: "sr-only", tdClass: "w-1/4" },
  { key: "value", label: "", thClass: "sr-only" },
];

const rows = computed(() => [
  { label: "Rechtsgrundlage(n)", value: props.verfahren.rechtsgrundlage_n },
  { label: "Quelle(n)", value: props.verfahren.quelle_n },
  { label: "Verantwortliches öffentliches Organ", value: props.verfahren.verantwortliche_stelle },
  { label: "Internetauftritt", value: props.verfahren.internetauftritt },
  { label: "Zweck der Datenbearbeitung", value: props.verfahren.zweck_der_datenbearbeitung },
]);
</script>

<template>
  <div class="verfahren-table">
    <Table :columns="columns" :rows="rows" :mobile="true" table-class="mb-20">
      <template #cell-label="{ value }">
        <strong>{{ value }}</strong>
      </template>
      <template #cell-value="{ row }">
        <template v-if="row.label === 'Rechtsgrundlage(n)'">
          <p v-for="(rg, i) in row.value" :key="i" class="list-line">{{ rg }}</p>
        </template>
        <template v-else-if="row.label === 'Quelle(n)'">
          <ul class="source-list">
            <li v-for="(q, i) in row.value" :key="i">
              <a
                :href="q"
                target="_blank"
                rel="noopener noreferrer"
                class="link source-link"
              >
                {{ q.replace(/^https?:\/\//, '') }}
              </a>
            </li>
          </ul>
        </template>
        <template v-else-if="row.label === 'Internetauftritt'">
          <a
            :href="row.value"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >
            {{ row.value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') }}
          </a>
        </template>
        <template v-else>
          {{ row.value }}
        </template>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.list-line + .list-line {
  margin-top: 6px;
}

.source-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.source-list li + li {
  margin-top: 6px;
}

.source-link {
  display: block;
  text-decoration: underline;
}

/* Override the design system .table: no horizontal rules anywhere
   (top, between rows, or bottom) on both desktop and mobile. */
.verfahren-table :deep(.table),
.verfahren-table :deep(.table thead),
.verfahren-table :deep(.table tbody),
.verfahren-table :deep(.table tr),
.verfahren-table :deep(.table th),
.verfahren-table :deep(.table td) {
  border: 0 !important;
}

@media (max-width: 767px) {
  /* The DS pseudo-label is unused here (the label is its own column). */
  .verfahren-table :deep(.table.has-mobile-style td[data-head-label])::before {
    content: none !important;
    display: none !important;
  }

  /* Let the label use the full width so it no longer leaves space on the right
     and long labels stop wrapping; tighten the label-to-value spacing. */
  .verfahren-table :deep(.table.has-mobile-style td.table__col--label) {
    width: 100% !important;
    padding: 0 0 2px !important;
  }

  .verfahren-table :deep(.table.has-mobile-style td.table__col--value) {
    padding: 0 0 18px !important;
  }

  .verfahren-table :deep(.table.has-mobile-style tbody tr:last-child td.table__col--value) {
    padding-bottom: 0 !important;
  }
}
</style>
