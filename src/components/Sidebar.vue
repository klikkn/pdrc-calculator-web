<template>
  <ul class="sidebar">
    <li>
      <router-link to="/">{{ $t('calculation') }}</router-link>
    </li>
    <li>
      <router-link to="/cars">{{ $t('cars') }}</router-link>
    </li>
    <li>
      <router-link to="/prices">{{ $t('prices') }}</router-link>
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