<script setup lang="ts">
import { slugify } from '~/utils/slugify'

const { departments, status } = useVerfahren()

const tocItems = computed(() =>
  departments.value.map((dept) => ({
    label: dept.name,
    anchor: slugify(dept.name),
  })),
)
</script>

<template>
  <div>
    <div v-if="status === 'pending'" class="text-gray-500">
      Daten werden geladen...
    </div>

    <template v-else>
      <h1 class="header-title text-primary-600 hyphens-auto text-balance">
        Verzeichnis der Verfahren mit Personendaten
      </h1>
      <p class="lead mt-30 hyphens-auto lg:hyphens-none text-pretty">
        Die öffentlichen Organe sind verpflichtet, über Angelegenheiten von allgemeinem Interesse
        aktiv zu informieren. Das folgende Verzeichnis listet die Verfahren der kantonalen Verwaltung
        Basel-Stadt nach Organisationen auf.
      </p>

      <TableOfContents :items="tocItems" />

      <template v-for="(dept, i) in departments" :key="dept.name">
        <hr
          v-if="i > 0"
          class="my-10 overflow-hidden border-0 border-t border-solid border-t-[#e3e3e3] pt-10"
        />
        <DepartmentSection :name="dept.name" :abteilungen="dept.abteilungen" />
      </template>
    </template>
  </div>
</template>
