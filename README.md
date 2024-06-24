# Pokédex-explorer

Please follow the instructions to run the app:

```
$ cd pokedex/
$ npm install
$ npm run dev

  ➜ Local: http://localhost:5173/
  ➜ Network: use --host to expose
  ➜ press h + enter to show help

Finally go to: http://localhost:5173/
```

Assumptions/Decisions:

1. Assumption for Pokémon Type Filters:

We assume that when selecting multiple types, such as Water and Fire, the filter functionality will return all Pokémon that match either type individually or both types simultaneously. Specifically:

Selecting "Water" will display Pokémon that have "Water" as one of their types.<br>
Selecting "Fire" will display Pokémon that have "Fire" as one of their types.<br>
Selecting both "Water" and "Fire" will display Pokémon that have either "Water", "Fire", or both as their types.<br>
