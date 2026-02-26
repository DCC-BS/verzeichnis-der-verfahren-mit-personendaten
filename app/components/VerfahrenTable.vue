<script setup lang="ts">
import type { Verfahren } from '~/types/verfahren'

const props = defineProps<{
  verfahren: Verfahren
}>()

const columns = [
  { key: 'label', label: '', thClass: 'sr-only', tdClass: 'w-1/4' },
  { key: 'value', label: '', thClass: 'sr-only' },
]

const rows = computed(() => [
  { label: 'Bezeichnung', value: props.verfahren.bezeichnung },
  { label: 'Rechtsgrundlage(n)', value: props.verfahren.rechtsgrundlage_n },
  { label: 'Quelle(n)', value: props.verfahren.quelle_n },
  { label: 'Verantwortliche Stelle', value: props.verfahren.verantwortliche_stelle },
  { label: 'Internetauftritt', value: props.verfahren.internetauftritt },
  { label: 'Zweck der Datenbearbeitung', value: props.verfahren.zweck_der_datenbearbeitung },
])
</script>

<template>
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

@media (max-width: 767px) {
  :deep(.table.has-mobile-style td[data-head-label]::before) {
    content: none !important;
    display: none !important;
  }

  :deep(.table.has-mobile-style tbody td[data-head-label]) {
    border-top: 0 !important;
  }
}
</style>
