<script setup>
import TitleBar from "./components/TitleBar.vue";
import PlaylistContainer from "./components/PlaylistContainer.vue";


</script>

<template>
  <title-bar />

  <main class="main-container">
    <playlist-container></playlist-container>
  </main>
</template>

<style scoped>

.main-container {
  overflow-y: scroll;
}

</style>
