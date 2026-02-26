<script setup lang="ts">
import { slugify } from '~/utils/slugify'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { findBySlug, status } = useVerfahren()

const result = computed(() => findBySlug(slug.value))
const pageTitle = computed(() => {
  if (!result.value) return ''
  const abtName = result.value.abteilung.name
  if (abtName) {
    return `Verzeichnis der Verfahren mit Personendaten – ${abtName}`
  }
  return `Verzeichnis der Verfahren mit Personendaten – ${result.value.department}`
})

const tocItems = computed(() => {
  if (!result.value) return []
  return result.value.abteilung.verfahren.map((v) => ({
    label: v.bezeichnung,
    anchor: slugify(v.bezeichnung),
  }))
})

useHead({ title: pageTitle })
</script>

<template>
  <div>
    <div v-if="status === 'pending'" class="text-gray-500">
      Daten werden geladen...
    </div>

    <template v-else-if="result">
      <h1 class="header-title text-primary-600 hyphens-auto text-balance">
        {{ pageTitle }}
      </h1>
      <p class="lead mt-30 hyphens-auto lg:hyphens-none text-pretty">
        Hier finden Sie die Verfahren, bei denen personenbezogene Daten bearbeitet werden.
      </p>

      <TableOfContents :items="tocItems" />

      <section v-for="v in result.abteilung.verfahren" :key="v.bezeichnung" class="verfahren-section">
        <h3
          :id="slugify(v.bezeichnung)"
          class="text-left font-bold mb-10 scroll-mt-10 verfahren-heading"
        >
          {{ v.bezeichnung }}
        </h3>
        <VerfahrenTable :verfahren="v" />
      </section>
    </template>

    <div v-else class="text-red-600">
      Seite nicht gefunden.
    </div>
  </div>
</template>

<style scoped>
.verfahren-heading {
  font-size: 20px;
}

.verfahren-section {
  margin-top: 20px;
  margin-bottom: 20px;
}

@media (min-width: 1024px) {
  .verfahren-section {
    margin-top: 50px;
    margin-bottom: 50px;
  }
}
</style>
