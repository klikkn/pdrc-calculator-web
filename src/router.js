import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./containers/Home";
import Calculation from "./containers/Calculation";
import Cars from "./containers/Cars";
import Prices from "./containers/Prices";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home },
  { path: "/calculation", component: Calculation },
  { path: "/cars", component: Cars },
  { path: "/prices", component: Prices }
];

export default new VueRouter({ routes, mode: "history" });
