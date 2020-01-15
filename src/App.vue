<template>
  <div id="app" class="app">
    <Loader />
    <div class="main" :class="{ blur: isMenuActive }">
      <div class="container">
        <div class="mb-1">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="open-nav" @click="enableMenu">
      <i class="el-icon-menu"></i>
    </div>
    <div class="nav" :class="{ active: isMenuActive }">
      <Navigation />
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

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.bold {
  font-weight: bold;
}

.blur {
  filter: blur(5px);
}

.noscroll {
  overflow: hidden;
}

.el-notification {
  width: 290px;
}

.el-select-dropdown__item {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.el-collapse-item__header {
  height: auto;
  line-height: 1;
  padding: 15px;
  color: var(--REGULAR_TEXT);
  font-weight: bold;
}

.nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.open-nav {
  position: absolute;
  font-size: 32px;
}

.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.auth__form {
  display: grid;
  grid-gap: 10px;
  width: 100%;
  max-width: 500px;
}

.table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.table th,
.table td {
  border-bottom: 1px solid var(--LIGHTER_BORDER);
  padding: 10px;
}

.table th {
  color: var(--SECONDARY_TEXT);
}

.table td {
  color: var(--REGULAR_TEXT);
}

@media screen and (min-width: 0) {
  .mt-1 {
    margin-top: 15px;
  }

  .mb-1 {
    margin-bottom: 15px;
  }

  .fz-1 {
    font-size: 0.7rem;
  }

  .el-dialog {
    width: 90%;
  }

  .container {
    padding: 0 10px;
  }

  .nav {
    display: none;
    border: none;
  }

  .open-nav {
    top: 20px;
    right: 7px;
  }

  .active {
    display: block;
  }
}

@media screen and (min-width: 568px) {
  .mt-1 {
    margin-top: 20px;
  }

  .mb-1 {
    margin-bottom: 20px;
  }

  .fz-1 {
    font-size: 0.875rem;
  }

  .el-dialog {
    width: 70%;
  }

  .open-nav {
    top: 20px;
    right: 12px;
  }

  .container {
    padding: 0 15px;
  }
}

@media screen and (min-width: 768px) {
  .mt-1 {
    margin-top: 25px;
  }

  .mb-1 {
    margin-bottom: 25px;
  }

  .fz-1 {
    font-size: 1rem;
  }

  .el-dialog {
    width: 50%;
  }

  .open-nav {
    top: 20px;
    right: 17px;
  }

  .container {
    padding: 0 20px;
  }
}

@media screen and (min-width: 1024px) {
  .nav {
    display: block;
    bottom: 0;
    right: 0;
    width: 300px;
  }

  .open-nav {
    display: none;
  }

  .main {
    margin-right: 300px;
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
    ...mapState(["user", "params", "isMenuActive"])
  },

  methods: {
    ...mapActions(["getMe", "getParams", "enableMenu"])
  }
};
</script>
