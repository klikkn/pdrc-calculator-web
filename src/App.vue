<template>
  <div id="app">
    <div class="container">
      <Navigation />

      <div class="main">
        <router-view></router-view>
      </div>
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

.container {
  padding: 0 25px;
}

.mt-1 {
  margin-top: 15px;
}
</style>

<script>
</script>
