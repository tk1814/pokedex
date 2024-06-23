<template>
  <v-container>
    <!-- Search pokemon name -->
    <v-row>
      <v-col cols="12" md="6" class="search">
        <v-text-field
          v-model="searchQuery"
          label="Search Pokemon"
          outlined
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Filter pokemon types -->
    <div>
      <v-row class="types">
        <v-col cols="auto">
          <v-chip
            variant="flat"
            class="pokemon-chip"
            v-for="(type, index) in pokemonTypes"
            :key="index"
            @click="toggleSelectedType(type)"
            :class="{
              'outlined-chip': selectedTypes.includes(type.toLowerCase()),
            }"
          >
            {{ type }}
          </v-chip>
        </v-col>
      </v-row>
    </div>

    <div v-if="loading"><Loader /></div>
    <div v-else>
      <v-row>
        <v-col v-for="pokemon in pokemons" :key="pokemon.id" cols="auto">
          <!-- Pokemon card -->
          <v-card
            class="pokemon-card card pa-7"
            :style="{
              backgroundImage: 'url(' + pokemon.background + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }"
          >
            <!-- Id -->
            <div class="pokemon-id id">#{{ pokemon.id }}</div>

            <v-card class="card-content content">
              <div @click="goToPokemonDetails(pokemon)" class="details">
                <!-- Name -->
                <v-card-title class="pokemon-name name">
                  {{ pokemon.name }}
                </v-card-title>

                <!-- Avatar -->
                <v-img
                  :src="pokemon.background"
                  class="pokemon-avatar"
                  contain
                  height="150"
                  width="200"
                ></v-img>

                <!-- Types -->
                <v-card-text>
                  <v-row dense>
                    <v-col
                      v-for="type in pokemon.types"
                      :key="type.id"
                      cols="auto"
                    >
                      <v-chip variant="flat" class="pokemon-chip chip">
                        {{ type.name }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-card-text>
              </div>

              <!-- Favourite -->
              <v-btn
                v-ripple="false"
                class="fav-icon"
                icon
                @click="toggleFavouritePokemon(pokemon.id)"
              >
                <v-icon color="red" v-if="isFavourite(pokemon.id)">
                  mdi-heart
                </v-icon>
                <v-icon v-else>mdi-heart-outline</v-icon>
              </v-btn>
            </v-card>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <v-pagination
        class="pagination"
        v-model="currentPage"
        :length="Math.ceil(totalPokemons / itemsPerPage)"
        :total-visible="3"
        @input="onPageChange"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script setup>
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import { ref, watch, watchEffect } from 'vue';
import Loader from '../loader/Loader.vue';
import { GET_POKEMONS } from '../queries/getPokemons.gql';
import { GET_POKEMON_TYPES } from '../queries/getPokemonTypes.gql';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '../store/pokemonStore';
import { toTitleCase, getBackground } from '../shared/helpers.js';

const store = usePokemonStore();
const router = useRouter();

const itemsPerPage = ref(12);
const currentPage = ref(1);
const pokemonTypes = ref([]);
const pokemons = ref([]);
const totalPokemons = ref(0);
const searchQuery = ref('');
const loading = ref(true);
const selectedTypes = ref([]);

function onPageChange(newPage) {
  currentPage.value = newPage;
}

// get all types of pokemon
const {
  result: typesResult,
  loading: typesLoading,
  error: typesError,
} = useQuery(GET_POKEMON_TYPES);

// watch for changes in types loading and update loading value
watch(typesLoading, (newLoading) => {
  loading.value = newLoading;
});

// get all pokemon
const {
  result: listResult,
  loading: listLoading,
  error: listError,
  refetch: refetchList,
  load: loadList,
} = useLazyQuery(GET_POKEMONS, getMainListParams());

// watch for changes in types
watch(
  typesResult,
  (newTypesResult) => {
    if (newTypesResult) {
      // update pokemon types with new values in title case for readability
      pokemonTypes.value = newTypesResult.types.map((type) =>
        toTitleCase(type.name)
      );
      // load main pokemon list using the initial types
      loadList(GET_POKEMONS, getMainListParams());
    }
  },
  { immediate: true } // execute immediately with initial value
);

// watch for changes in pokemon list
watch(
  listResult,
  (newListResult) => {
    if (newListResult) {
      // map pokemon values
      mapPokemons(newListResult);
    }
  },
  { immediate: true }
);

// watch for changes in list loading and update loading value
watch(listLoading, (newLoading) => {
  loading.value = newLoading;
});

// watch for changes in page number, search term and selected types
watch(
  [currentPage, searchQuery, selectedTypes],
  () => {
    // refetch pokemon list with the new data
    refetchList(getMainListParams());
  },
  { deep: true }
);

// construct the parameters for the query of retrieving pokemon list
function getMainListParams() {
  return {
    limit: itemsPerPage.value,
    offset: (currentPage.value - 1) * itemsPerPage.value,
    name: `%${searchQuery.value}%`,
    types: selectedTypes.value.length
      ? selectedTypes.value
      : pokemonTypes.value.map((type) => type.toLowerCase()),
  };
}

// map pokemon to the
function mapPokemons(newResult) {
  pokemons.value = newResult.pokemons.map((pokemon) => {
    return {
      ...pokemon,
      name: toTitleCase(pokemon.name), // transform name to title case
      background: getBackground(pokemon), // get background image
      types: pokemon.types.map((type) => ({
        id: type.type.id,
        name: toTitleCase(type.type.name), // transform type name to title case
      })),
    };
  });
  // update total number of pokemon
  totalPokemons.value = newResult.pokemonCount.aggregate.count;
  // mark that loading finished
  loading.value = false;
}

// everytime errors occur it will show here
watchEffect(() => {
  if (listError.value || typesError.value) {
    console.log(listError.value || typesError.value);
  }
});

// add or remove a favourite pokemon
function toggleFavouritePokemon(pokemonId) {
  store.toggleFavouritePokemon(pokemonId);
}

// check if pokemon is favourite
function isFavourite(pokemonId) {
  return store.isFavourite(pokemonId);
}

// reset to the first page when search input changes
function handleSearch() {
  currentPage.value = 1;
}

// add/remove types from the selected pokemon types
function toggleSelectedType(typeName) {
  currentPage.value = 1; // reset to the first page when selected types change
  const newTypeName = typeName.toLowerCase(); // convert type name to lowercase
  const typeIndex = selectedTypes.value.indexOf(newTypeName);
  // if selected type is not selected, add it
  if (typeIndex === -1) {
    selectedTypes.value.push(newTypeName.toLowerCase());
  } else {
    // if selected type is selected, remove it
    selectedTypes.value.splice(typeIndex, 1);
  }
}

// navigate to the detailed view of pokemon with its id as parameter
function goToPokemonDetails(pokemon) {
  router.push({ name: 'PokemonDetails', params: { id: pokemon.id } });
}
</script>

<style lang="scss" scoped>
@import '../styles/styles.scss';

.types {
  margin: 0 auto;
  margin-bottom: 30px;
  max-width: 800px;
}

.outlined-chip {
  border: 1px solid rgb(171, 162, 143);
  background-color: rgb(171, 162, 143);
}

.card {
  height: 430px;
  width: 300px;
}

.card:hover {
  transform: scale(1.05);
}

.id {
  font-size: 15px;
}

.content {
  width: 200px;
}

.name {
  font-size: 18px;
}

.chip {
  font-size: 13px !important;
}

.v-pagination {
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>
