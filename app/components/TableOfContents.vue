<script setup lang="ts">
defineProps<{
  items: { label: string; anchor: string }[]
}>()
</script>

<template>
  <div class="full-bleed">
    <div
      class="bg-primary-100 border-t-2 border-primary-600 mt-20 sticky bottom-0 z-50 toc-sticky"
      style="border-top: 2px solid rgb(var(--color-primary-600)); background-color: #ddecde"
    >
      <a
        href="#table-of-contents"
        class="pre-heading text-primary-700 mobile-only:text-lg container toc-trigger"
      >
        <span class="toc-title">Auf dieser Seite</span>
      </a>
    </div>

    <div
      id="table-of-contents"
      class="bg-primary-100 -mt-1 scroll-mt-20 toc-panel"
      style="background-color: #ddecde"
    >
      <nav class="container">
        <ul class="toc-grid">
          <li v-for="item in items" :key="item.anchor">
            <a
              class="link with-icon text-balance text-lg xl:text-xl font-bold toc-link"
              :href="`#${item.anchor}`"
            >
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.full-bleed {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.toc-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.toc-title {
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--color-primary-700));
}

.toc-panel {
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.toc-grid {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 10px;
  grid-auto-rows: auto;
}

.toc-link {
  font-weight: 700;
}

@media (min-width: 768px) {
  .toc-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .toc-panel {
    margin-bottom: 3rem;
  }

  .toc-sticky {
    margin-top: 3rem;
  }
}

@media (min-width: 1024px) {
  .toc-trigger {
    padding-top: 25px;
    padding-bottom: 25px;
  }

  .toc-panel {
    padding-bottom: 3rem;
  }
}

@media (min-width: 1280px) {
  .toc-panel {
    margin-bottom: 4rem;
  }

  .toc-sticky {
    margin-top: 4rem;
  }

  .toc-link {
    font-size: 20px;
  }
}
</style>
