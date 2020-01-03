<template>
  <ul class="navigation">
    <li>
      <router-link to="/">{{ $t('home') }}</router-link>
    </li>
    <template v-if="user">
      <li>
        <router-link to="/calculation">{{ $t('calculation') }}</router-link>
      </li>
      <li>
        <router-link to="/prices">{{ $t('prices') }}</router-link>
      </li>
      <li>
        <a href="#" v-on:click.prevent="logout">{{ $t('logout') }}</a>
      </li>
    </template>
    <template v-else>
      <li>
        <router-link to="/register">{{ $t('register') }}</router-link>
      </li>
      <li>
        <router-link to="/login">{{ $t('login') }}</router-link>
      </li>
    </template>
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

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["logout"])
  }
};
</script>