<template>
  <div class="auth">
    <h1>{{ $t('register') }}</h1>

    <form v-on:submit.prevent="onSubmit" class="auth__form">
      <el-input :placeholder="$t('enter.username')" v-model="username"></el-input>
      <el-input :placeholder="$t('enter.email')" v-model="email"></el-input>
      <el-input :placeholder="$t('enter.password')" v-model="password1" show-password></el-input>
      <el-input :placeholder="$t('enter.passwordAgain')" v-model="password2" show-password></el-input>

      <el-button type="primary" native-type="submit">{{ $t('submit') }}</el-button>
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