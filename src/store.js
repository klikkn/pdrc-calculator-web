import Vue from "vue";
import Vuex from "vuex";

import {
  login,
  register,
  getMe,
  updateMe,
  getParams,
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

    prices: ({ user }) => user ? user.prices : [],
  },

  mutations: {
    ["SET"](state, { prop, value }) {
      state[prop] = value;
    }
  },

  actions: {
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

    async getMe({ commit }) {
      try {
        const { data } = await getMe();

        commit("SET", { prop: "user", value: data });
      } catch (err) {
        console.log(err.message);
      }
    },

    async updateMe({ commit }, _data) {
      try {
        const { data } = await updateMe(_data);

        commit("SET", { prop: "user", value: data });
      } catch (err) {
        console.log(err.message);
      }
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
