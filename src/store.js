import Vue from "vue";
import Vuex from "vuex";

import {
  me,
  login,
  register,
  getParams
} from "./services/api";

import tokenService from './services/token'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    params: null
  },

  getters: {
    user: ({ user }) => user,
    params: ({ params }) => params,

    classes: ({ params }) => params ? params.classes : [],
    squares: ({ params }) => params ? params.squares : [],
    parts: ({ params }) => params ? params.parts : [],

    prices: ({ user: { prices } }) => prices,
  },

  mutations: {
    ["SET"](state, { prop, value }) {
      state[prop] = value;
    }
  },

  actions: {
    async getUser({ commit }) {
      try {
        const { data } = await me();

        commit("SET", { prop: "user", value: data });
      } catch (err) {
        console.log(err.message);
      }
    },

    async login({ commit }, data) {
      try {
        const { data: { jwt, user } } = await login(data);

        tokenService.set(jwt);
        commit("SET", { prop: "user", value: user });

        window.location.replace('/')
      } catch (err) {
        console.log(err.message);
      }
    },

    async register({ commit }, data) {
      try {
        const { jwt, user } = await register(data);

        tokenService.set(jwt);
        commit("SET", { prop: "user", value: user });

        window.location.replace('/')
      } catch (err) {
        console.log(err.message);
      }
    },

    async logout() {
      tokenService.remove();
      window.location.replace('/')
    },

    async getParams({ commit }) {
      try {
        const { data } = await getParams();
        commit("SET", { prop: "params", value: data });
      } catch (err) {
        console.log(err.message);
      }
    }
  }
});
