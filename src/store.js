import Vue from "vue";
import Vuex from "vuex";

import { clone } from 'ramda';

import {
  login,
  register,
  getMe,
  updateMe,
  getParams,
} from "./services/api";

import tokenService from './services/token'
import { errorHandler } from './services/errors'

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,

  state: {
    user: null,
    params: null
  },

  getters: {
    user: ({ user }) => user,
    params: ({ params }) => params,

    classes: ({ params }) => params ? clone(params.classes) : [],
    squares: ({ params }) => params ? clone(params.squares) : [],
    parts: ({ params }) => params ? clone(params.parts) : [],
    categories: ({ params }) => params ? clone(params.categories) : [],

    prices: ({ user }) => user ? clone(user.prices) : [],
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
        errorHandler(err.message);
      }
    },

    async register({ commit }, data) {
      try {
        const { jwt, user } = await register(data);

        tokenService.set(jwt);
        commit("SET", { prop: "user", value: user });

        window.location.replace('/')
      } catch (err) {
        errorHandler(err.message);
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
        errorHandler(err.message);
      }
    },

    async updateMe({ commit, state }, data) {
      const { user } = state;
      try {
        await updateMe(data);
        commit("SET", { prop: "user", value: { ...clone(user), ...clone(data) } });
      } catch (err) {
        commit("SET", { prop: "user", value: clone(user) });
        errorHandler(err.message);
      }
    },

    async getParams({ commit }) {
      try {
        const { data } = await getParams();
        commit("SET", { prop: "params", value: data });
      } catch (err) {
        errorHandler(err.message);
      }
    }
  }
});
