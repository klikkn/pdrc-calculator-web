import Vue from "vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import router from "./router";
import store from "./store";

import App from "./App.vue";
import Sidebar from "./components/Sidebar.vue";

Vue.use(ElementUI);
Vue.component("Sidebar", Sidebar);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
