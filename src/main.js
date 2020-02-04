import Vue from "vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import ruLocale from 'element-ui/lib/locale/lang/ru-RU'
// import enLlocale from 'element-ui/lib/locale/lang/en'

import '@/filters';
import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";

import App from "@/App.vue";
import Navigation from "@/containers/Navigation.vue";
import Progress from "@/containers/Progress.vue";
import PartsTable from "@/components/PartsTable.vue";
import SelectField from "@/components/SelectField.vue";

Vue.use(ElementUI, { locale: ruLocale })
Vue.component("Navigation", Navigation);
Vue.component("Progress", Progress);

Vue.component("PartsTable", PartsTable);
Vue.component("SelectField", SelectField);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");
