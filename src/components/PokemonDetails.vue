<template>
  <v-container>
    <!-- Loader -->
    <div v-if="loading"><Loader /></div>

    <!-- Error message -->
    <div v-else-if="error">Something went wrong: {{ error.message }}</div>

    <!-- Pokemon details -->
    <div v-else-if="pokemon">
      <v-row>
        <v-col cols="auto">
          <!-- Pokemon card -->
          <v-card
            class="pokemon-card card pa-12"
            :style="{
              backgroundImage: 'url(' + pokemon.background + ')',
              backgroundSize: '150%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }"
          >
            <!-- Id -->
            <div class="pokemon-id id">#{{ pokemon.id }}</div>

            <v-card class="card-content content">
              <!-- Name -->
              <v-card-title class="pokemon-name name">
                {{ pokemon.name }}
              </v-card-title>

              <!-- Avatar -->
              <v-img
                :src="pokemon.avatar"
                class="pokemon-avatar"
                contain
                height="100"
                width="100"
              ></v-img>

              <!-- Height/Weight -->
              <v-card-text>
                <b> Height (m):</b> {{ pokemon.height / 10 }} <br />
                <b> Weight (kg):</b> {{ pokemon.weight / 10 }}
              </v-card-text>

              <v-divider></v-divider>

              <!-- Types -->
              <v-card-text>
                <b> Types</b>
                <v-row dense>
                  <v-col
                    v-for="type in pokemon.types"
                    :key="type.id"
                    cols="auto"
                  >
                    <v-chip variant="flat" class="pokemon-chip">
                      {{ type.name }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <!-- Abilities -->
              <v-card-text>
                <b> Abilities</b>
                <v-row dense class="pa-0">
                  <v-col
                    v-for="ability in pokemon.abilities"
                    :key="ability.id"
                    cols="auto"
                    class="pa-1"
                  >
                    <v-chip variant="flat" class="pokemon-chip">{{
                      ability.name
                    }}</v-chip>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <!-- Statistics -->
              <v-card-text>
                <b> Statistics </b>
                <v-row dense class="pa-0">
                  <v-col
                    v-for="stat in pokemon.stats"
                    :key="stat.id"
                    cols="12"
                    class="d-flex justify-space-between pa-1"
                  >
                    <div class="stat-name">{{ stat.name }}</div>
                    <div class="base-stat">{{ stat.base_stat }}</div>
                  </v-col>
                </v-row>
              </v-card-text>

              <!-- Favourite -->
              <v-btn
                v-ripple="false"
                class="fav-icon"
                icon
                @click.stop="toggleFavouritePokemon(pokemon.id)"
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
    </div>

    <!-- No pokemon found -->
    <div v-else>
      <p>No Pokémon found.</p>
    </div>
  </v-container>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable';
import { onMounted, ref, watch } from 'vue';
import Loader from '../loader/Loader.vue';
import { GET_POKEMON_DETAILS } from '../queries/getPokemonDetails.gql';
import { useRoute } from 'vue-router';
import { usePokemonStore } from '../store/pokemonStore.js';
import { toTitleCase, getBackground, getAvatar } from '../shared/helpers.js';

const store = usePokemonStore();
const route = useRoute();

const pokemon = ref(null);

const loading = ref(true);
const error = ref(null);

onMounted(() => {
  // get the pokemon id fromt the route parameters
  const pokemonId = route.params.id;

  if (pokemonId) {
    // get all pokemon details
    const {
      result,
      loading: detailsLoading,
      error: detailsError,
    } = useQuery(GET_POKEMON_DETAILS, { id: pokemonId });

    // watch for changes in details
    watch(
      result,
      (newResult) => {
        if (newResult) {
          // update the details with new ones
          pokemon.value = {
            ...newResult.pokemon,
            name: toTitleCase(newResult.pokemon.name),
            types: newResult.pokemon.types.map((type) => ({
              id: type.type.id,
              name: toTitleCase(type.type.name),
            })),
            stats: newResult.pokemon.stats.map((stat) => ({
              base_stat: stat.base_stat,
              id: stat.stat.id,
              name: toTitleCase(stat.stat.name),
            })),
            abilities: newResult.pokemon.abilities.map((ability) => ({
              id: ability.ability.id,
              name: toTitleCase(ability.ability.name),
            })),
            background: getBackground(newResult.pokemon),
            avatar: getAvatar(newResult.pokemon),
          };
          loading.value = false;
        }
      },
      { immediate: true }
    );

    // watch for changes in details loading and update loading value
    watch(detailsLoading, (newLoading) => {
      loading.value = newLoading;
    });

    // watch for error in pokemon details
    watch(detailsError, (newError) => {
      loading.value = false; // stop loading
      error.value = newError; // update error value
    });
  } else {
    // stop loading
    loading.value = false;
  }
});

// add or remove pokemon from favourites
function toggleFavouritePokemon(pokemonId) {
  store.toggleFavouritePokemon(pokemonId);
}

// check if pokemon is favourite
function isFavourite(pokemonId) {
  return store.isFavourite(pokemonId);
}
</script>

<style lang="scss" scoped>
@import '../styles/styles.scss';

.card {
  height: 100%;
  overflow-y: auto; // vertical scrolling if content exceeds height
}

.id {
  font-size: 20px;
}

.content {
  max-width: 300px;
  padding: 10px;
}

.name {
  font-size: 24px;
}

b {
  font-size: 15px;
}

.stat-name {
  text-align: left;
}

.base-stat {
  text-align: right;
}
</style>
