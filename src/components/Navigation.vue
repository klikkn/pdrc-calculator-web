<template>
  <el-menu shadow="always">
    <template v-if="isAuth">
      <router-link to="/classes" class="el-menu-item--classes">
        <el-menu-item>
          <i class="el-icon-document"></i>
          <span class="title">{{ $t("classes") }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/prices" class="el-menu-item--prices">
        <el-menu-item>
          <i class="el-icon-coin"></i>
          <span class="title">{{ $t("prices") }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/calculation" class="el-menu-item--calculation">
        <el-menu-item>
          <i class="el-icon-document-add"></i>
          <span class="title">{{ $t("calculation") }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/orders" class="el-menu-item--orders">
        <el-menu-item>
          <i class="el-icon-folder"></i>
          <span class="title">{{ $t("orders") }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/settings" class="el-menu-item--settings">
        <el-menu-item>
          <i class="el-icon-setting"></i>
          <span class="title">{{ $t("settings") }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <template v-else>
      <router-link to="/register" class="el-menu-item--register">
        <el-menu-item>
          <i class="el-icon-plus"></i>
          <span class="title">{{ $t("register") }}</span>
        </el-menu-item>
      </router-link>
      <router-link to="/login" class="el-menu-item--login">
        <el-menu-item>
          <i class="el-icon-key"></i>
          <span class="title">{{ $t("login") }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>

<style>
.el-menu {
  border: none;
}

.el-menu a {
  text-decoration: none;
  color: var(--PRIMARY_TEXT);
}

@media screen and (min-width: 0) {
  .el-menu {
    display: flex;
    justify-content: center;
  }

  .title {
    display: none;
  }
}

@media screen and (min-width: 568px) {
  .el-menu-item {
    padding: 0 20px;
  }
}

@media screen and (min-width: 768px) {
}

@media screen and (min-width: 1024px) {
  .el-menu {
    flex-direction: column;
  }

  .title {
    display: inline;
  }

  .el-menu-item--calculation {
    order: 1;
  }

  .el-menu-item--orders {
    order: 2;
  }

  .el-menu-item--prices {
    order: 3;
  }

  .el-menu-item--classes {
    order: 4;
  }

  .el-menu-item--settings {
    order: 5;
  }
}
</style>

<script>
export default {
  props: ["isAuth"]
};
</script>
