<template>
  <v-container class="loader-container" fill-height>
    <v-row class="loader-row">
      <v-col cols="auto">
        <v-img
          class="rotating-image"
          :src="pokeball"
          alt="Loading..."
          width="100"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import pokeball from '../assets/pokeball.png';
</script>

<style lang="scss" scoped>
@import '../styles/styles.scss';

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.loader-row {
  height: 100%;
}

.rotating-image {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
