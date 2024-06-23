<template>
  <v-app-bar app color="rgb(211, 211, 211)" dark>
    <v-spacer></v-spacer>

    <v-btn
      rounded
      @click="goBackToPokemonList"
      :class="['ma-4', { active: $route.path === '/pokemon-list' }]"
    >
      <v-icon icon="mdi-pokeball" start></v-icon>
      Home
    </v-btn>

    <v-btn
      rounded
      @click="viewFavouritePokemons"
      :class="['ma-4', { active: $route.path === '/pokemon-list/favourites' }]"
    >
      <v-icon icon="mdi-heart-outline" start></v-icon>
      Favourites
    </v-btn>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goBackToPokemonList() {
  router.push({ name: 'PokemonList' });
}

function viewFavouritePokemons() {
  router.push({ name: 'PokemonFavourites' });
}
</script>

<style scoped>
.v-app-bar {
  height: 60px;
  background-color: rgb(211, 211, 211);
  justify-content: center;
}

.v-btn {
  scale: 1.2;
  color: #424242;

  transition: all 0.3s ease;
}

.v-btn:active {
  transform: translateY(2px);
}

.active {
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
</style>
