<template>
  <el-menu shadow="always">
    <el-menu-item @click="disableMenu" class="close">
      <i class="el-icon-close"></i>
    </el-menu-item>

    <template v-if="isToken">
      <router-link to="/calculation">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('calculation') }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/prices">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('prices') }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/orders">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('orders') }}</span>
        </el-menu-item>
      </router-link>

      <router-link to="/classes">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('classes') }}</span>
        </el-menu-item>
      </router-link>
      <a href="#" v-on:click.prevent="logout">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('logout') }}</span>
        </el-menu-item>
      </a>
    </template>
    <template v-else>
      <router-link to="/register">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('register') }}</span>
        </el-menu-item>
      </router-link>
      <router-link to="/login">
        <el-menu-item>
          <i class="el-icon-menu"></i>
          <span>{{ $t('login') }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>


<style>
.el-menu a {
  text-decoration: none;
  color: var(--PRIMARY_TEXT);
}

.el-menu-item.close i {
  font-size: 32px;
}

@media screen and (min-width: 0) {
  .close {
    text-align: right;
  }
}

@media screen and (min-width: 568px) {
}

@media screen and (min-width: 768px) {
}

@media screen and (min-width: 1024px) {
  .close {
    visibility: hidden;
  }
}
</style>

<script>
import { mapActions } from "vuex";
import tokenService from "../services/token";

export default {
  computed: {
    isToken() {
      return tokenService.get();
    }
  },
  methods: {
    ...mapActions(["disableMenu", "logout"])
  }
};
</script>