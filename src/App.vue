<template>
  <div id="app">
    <Sidebar />

    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.main {
  padding-left: 200px;
}
</style>

<script>
</script>
