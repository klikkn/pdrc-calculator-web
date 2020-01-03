<template>
  <div id="app">
    <Loader />
    <div class="container">
      <Navigation />

      <div class="main mb-1">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --BASIC_BLACK: #000000;
  --BASIC_WHITE: #ffffff;
  --BRAND_COLOR: #409eff;

  --PRIMARY_TEXT: #303133;
  --REGULAR_TEXT: #606266;
  --SECONDARY_TEXT: #909399;
  --PLACEHOLDER_TEXT: #c0c4cc;

  --BASE_BORDER: #dcdfe6;
  --LIGHT_BORDER: #e4e7ed;
  --LIGHTER_BORDER: #ebeef5;
  --EXTRA_LIGHT_BORDER: #f2f6fc;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container {
  padding: 0 25px;
}

@media screen and (min-width: 0) {
  .mt-1 {
    margin-top: 15px;
  }

  .mb-1 {
    margin-bottom: 15px;
  }
}

@media screen and (min-width: 568px) {
  .mt-1 {
    margin-top: 20px;
  }

  .mb-1 {
    margin-bottom: 20px;
  }
}

@media screen and (min-width: 768px) {
  .mt-1 {
    margin-top: 25px;
  }

  .mb-1 {
    margin-bottom: 25px;
  }
}
</style>

<script>
import { isNil } from "ramda";
import { mapState, mapActions } from "vuex";
import tokenService from "./services/token";

export default {
  mounted: function() {
    if (!tokenService.get()) return;

    if (isNil(this.user)) this.getMe();
    if (isNil(this.params)) this.getParams();
  },

  computed: {
    ...mapState(["user", "params"])
  },

  methods: {
    ...mapActions(["getMe", "getParams"])
  }
};
</script>
