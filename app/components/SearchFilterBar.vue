<script setup lang="ts">
import IconSymbolSearch from "@kanton-basel-stadt/designsystem/icons/symbol/search";

const query = defineModel<string>("query", { default: "" });
const department = defineModel<string>("department", { default: "" });
const abteilung = defineModel<string>("abteilung", { default: "" });

defineProps<{
  departmentOptions: string[];
  abteilungOptions: string[];
}>();

const draft = ref(query.value);

watch(query, (value) => {
  draft.value = value;
});

function submit() {
  query.value = draft.value;
}
</script>

<template>
  <div class="full-bleed">
    <div class="search-band" style="background-color: #ddecde">
      <div class="container py-20 lg:py-30">
        <form
          class="search-pill border border-blue-900 transition-all ease-in-out duration-150 hover:border-purple-600 focus-within:!border-purple-500 focus-within:!shadow-purple-600"
          role="search"
          @submit.prevent="submit"
        >
          <input
            v-model="draft"
            type="search"
            class="search-input"
            placeholder="Frage oder Suchbegriff"
            aria-label="Frage oder Suchbegriff"
          />
          <button type="submit" class="button is-strong search-submit">
            <component :is="IconSymbolSearch" aria-hidden="true" />
            Suchen
          </button>
        </form>

        <div class="filter-grid mt-20">
          <div class="filter-field">
            <label for="filter-department" class="label">Departement</label>
            <select id="filter-department" v-model="department" class="input">
              <option value="">Alle Departemente</option>
              <option v-for="dep in departmentOptions" :key="dep" :value="dep">
                {{ dep }}
              </option>
            </select>
          </div>

          <div class="filter-field">
            <label for="filter-abteilung" class="label">Abteilung</label>
            <select
              id="filter-abteilung"
              v-model="abteilung"
              class="input"
              :disabled="!department"
            >
              <option value="">Alle Abteilungen</option>
              <option v-for="abt in abteilungOptions" :key="abt" :value="abt">
                {{ abt }}
              </option>
            </select>
          </div>
        </div>
      </div>
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

.search-band {
  border-top: 2px solid rgb(var(--color-primary-600));
}

.search-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: #fff;
  border-radius: 9999px;
  padding: 6px 6px 6px 20px;
}

.search-input {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: rgb(var(--color-gray-900, 24 24 24));
  height: 40px;
}

.search-input::placeholder {
  color: rgb(var(--color-gray-500, 115 115 115));
}

.search-submit {
  flex: 0 0 auto;
  border-radius: 9999px !important;
}

.filter-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

.filter-field {
  display: flex;
  flex-direction: column;
}

.filter-field .input {
  width: 100%;
}

@media (min-width: 768px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
