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
    <transition name="slide-up">
      <Aplayer ref="player" v-show="showPlayer" v-if="enablePlayer" />
    </transition>
  </div>
</template>
<script lang="ts" setup>

import { storeToRefs } from 'pinia';

const route = useRoute();

const p = new Player();
const playerStore = usePlayerStore(pinia)
playerStore.player = new Proxy(p, {
  set(target: any, prop, val) {
    //console.log({ prop, val });
    target[prop] = val;
    if (prop === '_howler') return true;
    target.saveSelfToLocalStorage();
    target.sendSelfToIpcMain();
    return true;
  },
});
const { player } = storeToRefs(playerStore)

const showPlayer = computed(() => {
  return (
    [
      'mv',
      'loginUsername',
      'login',
      'loginAccount',
      'lastfmCallback',
    ].includes(route.name?.toString() || '') === false
  );
})
const enablePlayer = computed(() => {
  return (player as any)?.enabled && route.name !== 'lastfmCallback';
})
</script>