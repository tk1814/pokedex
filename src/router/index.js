import { createRouter, createWebHistory } from 'vue-router';
import PokemonList from '../components/PokemonList.vue';
import PokemonDetails from '../components/PokemonDetails.vue';
import PokemonFavourites from '../components/PokemonFavourites.vue';

const routes = [
  { path: '/', redirect: '/pokemon-list' },
  { path: '/pokemon-list', name: 'PokemonList', component: PokemonList },
  {
    path: '/pokemon-list/:id',
    name: 'PokemonDetails',
    component: PokemonDetails,
  },
  {
    path: '/pokemon-list/favourites',
    name: 'PokemonFavourites',
    component: PokemonFavourites,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
