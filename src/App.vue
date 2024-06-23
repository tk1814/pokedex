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
  background: linear-gradient(0deg, rgba(235, 67, 67, 0.973), #f1c840);
}
</style>
