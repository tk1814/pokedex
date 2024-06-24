<template>
  <v-app class="app">
    <v-container>
      <v-main>
        <NavBar />
        <router-view />
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
import NavBar from './navbar/NavBar.vue';
</script>

<style scoped>
.app,
body {
  background: linear-gradient(
    0deg,
    rgb(111, 171, 187),
    rgb(169, 211, 205),
    rgb(195, 188, 118)
  );
}
</style>
