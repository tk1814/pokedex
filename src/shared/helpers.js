import defaultImage from '../assets/pokemon-logo.png';

// Remove dashes and capitalize the first letter of each word
export function toTitleCase(word) {
  return word.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Get the background of the pokemon for the pokemon card
export function getBackground(pokemon) {
  return (
    pokemon.sprites[0].avatar.other['official-artwork'].front_shiny ||
    pokemon.sprites[0].avatar.other['official-artwork'].front_default ||
    defaultImage
  );
}

// Get the avatar of the pokemon for the pokemon card
export function getAvatar(pokemon) {
  return (
    pokemon.sprites[0].avatar.other.showdown.front_shiny ||
    pokemon.sprites[0].avatar.other.showdown.front_default ||
    defaultImage
  );
}
