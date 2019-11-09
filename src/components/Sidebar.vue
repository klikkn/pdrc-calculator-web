<template>
  <ul class="sidebar">
    <li>
      <router-link to="/">Home</router-link>
    </li>
    <li>
      <router-link to="/calculation">Calculation</router-link>
    </li>
    <li>
      <router-link to="/cars">Cars</router-link>
    </li>
    <li>
      <router-link to="/prices">Prices</router-link>
    </li>
  </ul>
</template>

<style>
.sidebar {
  position: absolute;
  width: 150px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>