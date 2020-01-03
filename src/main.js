import Vue from "vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import router from "./router";
import store from "./store";
import i18n from "./i18n";

import App from "./App.vue";
import Navigation from "./containers/Navigation.vue";
import Loader from "./containers/Loader.vue";

Vue.use(ElementUI);
Vue.component("Navigation", Navigation);
Vue.component("Loader", Loader);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");
