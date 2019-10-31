import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./containers/Home";
import Calculation from "./containers/Calculation";
import Cars from "./containers/Cars";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home },
  { path: "/calculation", component: Calculation },
  { path: "/cars", component: Cars }
];

export default new VueRouter({ routes, mode: "history" });
