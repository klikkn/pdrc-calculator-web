<template>
  <div>
    <h1>Register</h1>

    <form v-on:submit.prevent="onSubmit">
      <input type="text" v-model="username" />
      <input type="text" v-model="email" />
      <input type="password" v-model="password1" />
      <input type="password" v-model="password2" />

      <button type="submit">{{ $t('submit') }}</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: function() {
    return { username: "", email: "", password1: "", password2: "" };
  },

  methods: {
    ...mapActions(["register"]),

    onSubmit: async function() {
      this.register({
        username: this.username,
        email: this.email,
        password: this.password1
      });
    }
  }
};
</script>