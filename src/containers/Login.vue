<template>
  <div class="auth">
    <h1>{{ $t('login') }}</h1>

    <form v-on:submit.prevent="onSubmit" class="auth__form">
      <el-input :placeholder="$t('enter.login')" v-model="email"></el-input>
      <el-input :placeholder="$t('enter.password')" v-model="password" show-password></el-input>

      <el-button type="primary" native-type="submit">{{ $t('submit') }}</el-button>
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