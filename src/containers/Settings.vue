<template>
  <div>
    <h1>{{ $t('settings') }}</h1>

    <el-button type="danger" icon="el-icon-switch-button" @click="logout">{{ $t('logout') }}</el-button>
  </div>
</template>


<script>
import { mapActions } from "vuex";

export default {
  data: function() {
    return { email: "", password: "" };
  },

  methods: {
    ...mapActions(["logout"])
  }
};
</script>