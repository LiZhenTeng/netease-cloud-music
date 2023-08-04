<template>
  <div id="app">
    <Background />
    <div class="app">
      <Header></Header>
      <!-- <Aplayer></Aplayer> -->
      <div class="wrapper">
        <Left />
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "./assets/main.css";
</script>