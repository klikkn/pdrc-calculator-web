<template>
  <div>
    <h1>{{ $t('login') }}</h1>

    <form v-on:submit.prevent="onSubmit">
      <input type="text" v-model="email" />
      <input type="password" v-model="password" />

      <button type="submit">{{ $t('submit') }}</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: function() {
    return { email: "", password: "" };
  },

  methods: {
    ...mapActions(["login"]),

    onSubmit: async function() {
      this.login({ identifier: this.email, password: this.password });
    }
  }
};
</script>