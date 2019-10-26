import Vue from "vue";
import VueRouter from "vue-router";

import HelloWorld from "./components/HelloWorld";

Vue.use(VueRouter);

const routes = [{ path: "/foo", component: HelloWorld }];

export default new VueRouter({ routes, mode: "history" });
