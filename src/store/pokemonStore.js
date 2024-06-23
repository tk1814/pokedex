import { defineStore } from 'pinia';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    favouritePokemons: [], // array to hold ids of favourite pokemon
  }),

  getters: {
    // check if pokemon id is in the favourites list
    isFavourite: (state) => (pokemonId) => {
      return state.favouritePokemons.includes(pokemonId);
    },
  },

  actions: {
    // add or remove a pokemon id from the favourites list
    toggleFavouritePokemon(pokemonId) {
      const index = this.favouritePokemons.indexOf(pokemonId);
      if (index === -1) {
        // if id not in list, add it
        this.favouritePokemons.push(pokemonId);
      } else {
        // if id in list, remove it
        this.favouritePokemons.splice(index, 1);
      }
    },
  },
});
