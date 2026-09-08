<script setup lang="ts">
import IconSymbolClose from "@kanton-basel-stadt/designsystem/icons/symbol/close";
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

function clearSearch() {
  draft.value = "";
  query.value = "";
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
          <button
            v-if="draft"
            type="button"
            class="search-clear"
            aria-label="Suche zurücksetzen"
            @click="clearSearch"
          >
            <component :is="IconSymbolClose" aria-hidden="true" />
          </button>
          <button type="submit" class="button is-strong search-submit">
            <component :is="IconSymbolSearch" aria-hidden="true" />
            Suchen
          </button>
        </form>

        <div class="filter-grid mt-20">
          <Dropdown
            id="filter-department"
            v-model="department"
            label="Departement"
            placeholder="Alle Departemente"
            :options="departmentOptions"
          />
          <Dropdown
            id="filter-abteilung"
            v-model="abteilung"
            label="Abteilung"
            placeholder="Alle Abteilungen"
            :options="abteilungOptions"
            :disabled="!department"
          />
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

.search-input::-webkit-search-cancel-button {
  appearance: none;
  display: none;
}

.search-clear {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  padding: 0;
  border: none;
  background: none;
  color: rgb(30 69 87);
  cursor: pointer;
}

.search-clear svg {
  display: block;
  width: 20px;
  height: 20px;
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

@media (min-width: 768px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
