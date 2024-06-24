# Pokédex-explorer

Please follow the instructions below to run the app locally:

```
$ git clone https://github.com/tk1814/pokedex.git
$ cd pokedex/
$ npm install
$ npm run dev

  ➜ Local: http://localhost:5173/
  ➜ Network: use --host to expose
  ➜ press h + enter to show help
```

Go to: http://localhost:5173/ or

See the app in action here: https://pokedex-tk.netlify.app

---

### Assumptions/Decisions:

1. Pokémon Type Filters:

When selecting multiple types, such as Water and Fire, the filter functionality will return all Pokémon that match either type individually or both types simultaneously. Specifically:

Selecting "Water" will display Pokémon that have "Water" as one of their types.<br>
Selecting "Fire" will display Pokémon that have "Fire" as one of their types.<br>
Selecting both "Water" and "Fire" will display Pokémon that have either "Water", "Fire", or both as their types.<br>
