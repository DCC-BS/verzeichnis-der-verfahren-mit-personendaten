<script setup lang="ts">
import IconSymbolCaret from "@kanton-basel-stadt/designsystem/icons/symbol/caret";
import type { Verfahren } from "~/types/verfahren";

const props = defineProps<{
  items: Verfahren[];
  openAll?: boolean;
}>();

const openItems = ref<Set<number>>(new Set());

watch(
  () => [props.openAll, props.items.length] as const,
  ([openAll]) => {
    openItems.value = openAll
      ? new Set(props.items.map((_, index) => index))
      : new Set();
  },
  { immediate: true },
);

function toggle(index: number) {
  const next = new Set(openItems.value);
  if (next.has(index)) {
    next.delete(index);
  } else {
    next.add(index);
  }
  openItems.value = next;
}

function isOpen(index: number): boolean {
  return openItems.value.has(index);
}
</script>

<template>
  <div class="grid grid-cols-1 items-start gap-10 md:gap-15">
    <div v-for="(item, index) in items" :key="index" class="accordion-item">
      <h3 class="accordion-header">
        <button
          type="button"
          class="accordion-trigger"
          :aria-expanded="isOpen(index)"
          :aria-controls="`verfahren-content-${index}`"
          @click="toggle(index)"
        >
          <span>{{ item.bezeichnung }}</span>
          <component
            :is="IconSymbolCaret"
            aria-hidden="true"
            class="accordion-caret"
            :class="{ 'accordion-caret--open': isOpen(index) }"
          />
        </button>
      </h3>

      <div
        v-show="isOpen(index)"
        :id="`verfahren-content-${index}`"
        role="region"
      >
        <div class="p-10 md:p-20">
          <VerfahrenTable :verfahren="item" />
        </div>
      </div>
    </div>
  </div>
</template>
