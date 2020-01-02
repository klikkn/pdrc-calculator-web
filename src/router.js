import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Calculation from "./containers/Calculation";
import Prices from "./containers/Prices";

import tokenService from './services/token'

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home, meta: {} },

  { path: "/login", component: Login, meta: {} },
  { path: "/register", component: Register, meta: {} },

  { path: "/calculation", component: Calculation, meta: { requiresAuth: true } },
  { path: "/prices", component: Prices, meta: { requiresAuth: true } }
];

const router = new VueRouter({ routes, mode: "history" });

router.beforeEach((to, _, next) => {
  const isRequiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (isRequiresAuth && tokenService.get() == null) {
    next({ path: '/login', params: { nextUrl: to.fullPath } })
    return
  }

  next()
})

export default router;
