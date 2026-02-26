<script setup lang="ts">
import type { AbteilungGroup } from '~/types/verfahren'
import { getDepartmentMeta } from '~/utils/departmentMeta'
import { slugify } from '~/utils/slugify'

const props = defineProps<{
  name: string
  abteilungen: AbteilungGroup[]
}>()

const meta = computed(() => getDepartmentMeta(props.name))
const anchorId = computed(() => slugify(props.name))
</script>

<template>
  <section :id="anchorId" class="scroll-mt-10">
    <h2 class="h2 mb-20 lg:mb-30 mt-10 md:mt-40 xl:mt-50 scroll-mt-10 xl:pr-140">
      {{ name }}
    </h2>
    <div class="my-20 lg:mb-30 xl:pr-220">
      <div class="ck-content hyphens-auto lg:hyphens-none">
        <p>{{ meta.intro }}</p>
      </div>
    </div>

    <ul class="dienststellen-grid">
      <li v-for="abt in abteilungen" :key="abt.slug">
        <LinkItem
          :href="`/${abt.slug}`"
          :title="abt.name ?? name"
          description="Hier finden Sie die Verfahren, bei denen personenbezogene Daten bearbeitet werden."
          icon="internal"
          class="w-full text-balance lg:text-lg"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.dienststellen-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .dienststellen-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .dienststellen-grid {
    row-gap: 2.5rem;
  }
}

@media (min-width: 1280px) {
  .dienststellen-grid {
    row-gap: 3rem;
  }
}
</style>
