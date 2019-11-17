<template>
  <ul class="navigation">
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
.navigation {
  margin: 0;
  padding: 0;
  display: flex;
}

.navigation li {
  display: block;
  margin-right: 15px;
}
</style>