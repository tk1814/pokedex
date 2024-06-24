<template>
  <v-container>
    <!-- Search pokemon name -->
    <v-row>
      <v-col cols="12" md="6" class="search">
        <v-text-field
          v-model="searchQuery"
          label="Search Pokémon"
          outlined
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Loader -->
    <div v-if="loading"><Loader /></div>

    <!-- Error message -->
    <div v-else-if="error">Something went wrong: {{ error.message }}</div>

    <!-- Favourite pokemon list -->
    <div v-else-if="pokemons.length > 0">
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
              <!-- Navigate to pokemon details -->
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

    <!-- No pokemon found -->
    <div v-else>
      <p>No Pokémon found.</p>
    </div>
  </v-container>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable';
import { ref, watch, computed } from 'vue';
import Loader from '../loader/Loader.vue';
import { GET_FAVOURITE_POKEMONS } from '../queries/getFavouritePokemons.gql';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '../store/pokemonStore.js';
import { toTitleCase, getBackground } from '../shared/helpers.js';

const store = usePokemonStore();
const router = useRouter();

const itemsPerPage = ref(12);
const currentPage = ref(1);

const pokemons = ref([]);
const totalPokemons = ref(0);

// automatically updates when its dependencies change
const favouritePokemons = computed(() => store.favouritePokemons);

const searchQuery = ref('');
const loading = ref(true);
const error = ref(null);

// handle page changes
function onPageChange(newPage) {
  currentPage.value = newPage;
}

// get the list of favourite pokemon
const {
  result: favResult,
  loading: favLoading,
  error: favError,
  refetch: refetchFavs,
} = useQuery(GET_FAVOURITE_POKEMONS, getMainListParams());

// watch for changes in favourites
watch(
  favResult,
  (newFavResult) => {
    if (newFavResult) {
      // update pokemon favourites with new values
      mapPokemons(newFavResult);
    }
  },
  { immediate: true }
);

// watch for changes in favourites loading and update loading value
watch(favLoading, (newLoading) => {
  loading.value = newLoading;
});

// watch for error in favourites list
watch(favError, (newError) => {
  loading.value = false; // stop loading
  error.value = newError; // update error value
});

// watch for changes in page number and search term
watch(
  [currentPage, searchQuery],
  () => {
    // refetch favourites with the new data
    refetchFavs(getMainListParams());
  },
  { deep: true }
);

// construct the parameters for the query of retrieving favourites
function getMainListParams() {
  return {
    limit: itemsPerPage.value,
    offset: (currentPage.value - 1) * itemsPerPage.value,
    name: `%${searchQuery.value}%`,
    ids: favouritePokemons.value.length > 0 ? favouritePokemons.value : [],
  };
}

// map pokemon values
function mapPokemons(newResult) {
  pokemons.value = newResult.pokemons.map((pokemon) => {
    return {
      ...pokemon,
      name: toTitleCase(pokemon.name),
      background: getBackground(pokemon),
      types: pokemon.types.map((type) => ({
        id: type.type.id,
        name: toTitleCase(type.type.name),
      })),
    };
  });
  // update total number of pokemon
  totalPokemons.value = newResult.pokemonCount.aggregate.count;
  // stop loading
  loading.value = false;
}

// add or remove pokemon from favourites
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

// navigate to the detailed view of pokemon with its id as parameter
function goToPokemonDetails(pokemon) {
  router.push({ name: 'PokemonDetails', params: { id: pokemon.id } });
}
</script>

<style lang="scss" scoped>
@import '../styles/styles.scss';

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
