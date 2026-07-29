<script setup lang="ts">
import type { Verfahren } from '~/types/verfahren'

const props = defineProps<{
  items: Verfahren[]
  openAll?: boolean
}>()

const accordionItems = computed(() =>
  props.items.map(item => ({
    ...item,
    title: item.bezeichnung,
  })),
)

function asVerfahren(item: Record<string, unknown>): Verfahren {
  return item as unknown as Verfahren
}
</script>

<template>
  <Accordion
    :items="accordionItems"
    :open-all="openAll"
    id-prefix="verfahren"
  >
    <template #item="{ item }">
      <VerfahrenTable :verfahren="asVerfahren(item)" />
    </template>
  </Accordion>
</template>
