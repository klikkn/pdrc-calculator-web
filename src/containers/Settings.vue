<template>
  <div>
    <h1>{{ $t('settings') }}</h1>
    <el-form>
      <el-form-item>
        <el-input type="textarea" v-model="user.sign" :placeholder="$t('sign')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit" @click="onSubmit">{{ $t('save') }}</el-button>
      </el-form-item>
    </el-form>
    <el-button type="danger" icon="el-icon-switch-button" @click="logout">{{ $t('logout') }}</el-button>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import { updateMe } from "../services/api";

export default {
  data: function() {
    return { email: "", password: "" };
  },

  computed: {
    ...mapState([
      "user",
    ]),
  },

  methods: {
    ...mapActions(["logout"]),

    onSubmit: async function() {
      try {
        await updateMe({ sign: this.user.sign });
      } catch (err) {
        this.handleError(err);
      }
    }
  }
};
</script>