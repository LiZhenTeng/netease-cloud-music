<template>
  <div id="app">
    <Background />
    <div class="app">
      <Header></Header>
      <div class="wrapper">
        <Left />
        <div class="main-container">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
if (process.client) {
  const { default: aplayer } = await import('APlayer');
  const ap = new aplayer({});
}
</script>