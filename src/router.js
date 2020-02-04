import Vue from "vue";
import VueRouter from "vue-router";

import Login from "@/containers/Login";
import Register from "@/containers/Register";
import Calculation from "@/containers/Calculation";
import Prices from "@/containers/Prices";
import Orders from "@/containers/Orders";
import Classes from "@/containers/Classes";
import Settings from "@/containers/Settings";

import tokenService from '@/services/token'

Vue.use(VueRouter);

const routes = [
  {
    path: '/', redirect: () => tokenService.get() ? '/calculation' : '/login'
  },

  { path: "/login", component: Login, meta: {} },
  { path: "/register", component: Register, meta: {} },

  { path: "/calculation", component: Calculation, meta: { requiresAuth: true } },
  { path: "/prices", component: Prices, meta: { requiresAuth: true } },
  { path: "/orders", component: Orders, meta: { requiresAuth: true } },
  { path: "/classes", component: Classes, meta: { requiresAuth: true } },
  { path: "/settings", component: Settings, meta: { requiresAuth: true } },

  { path: '*', redirect: '/' }
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
