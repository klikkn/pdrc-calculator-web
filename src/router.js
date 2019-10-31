import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./containers/Home";
import Calculation from "./containers/Calculation";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home },
  { path: "/calculation", component: Calculation }
];

export default new VueRouter({ routes, mode: "history" });
