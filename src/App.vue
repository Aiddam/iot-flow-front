<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import store from "@/store";
if (localStorage.getItem('token')) {
  store.dispatch('auth/fetchUser')
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

:root {
  --gray-color: #666;
}

html,
body {
  margin: 0;
  padding: 0;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
