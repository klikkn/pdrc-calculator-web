import Vue from "vue";
import Vuex from "vuex";

import { clone } from 'ramda';

import {
  login,
  register,
  getMe,
  updateMe,
  getParams,
  calculate
} from "./services/api";

import tokenService from './services/token'
import { errorHandler } from './services/errors'

Vue.use(Vuex);

export const defaultCalculationFormState = {
  classIndex: null,
  selected: {},
  complicated: {},
  squares: {},
  result: 0
}

export default new Vuex.Store({
  strict: true,

  state: {
    user: null,
    params: null,
    calculationForm: defaultCalculationFormState,
    isLoading: false
  },

  getters: {},

  mutations: {
    ["SET"](state, { prop, value }) {
      state[prop] = value;
    }
  },

  actions: {
    enableLoader({ commit }) {
      commit("SET", { prop: "isLoading", value: true });
    },

    disableLoader({ commit }) {
      commit("SET", { prop: "isLoading", value: false });
    },

    updateCalculationForm({ commit }, data) {
      commit("SET", { prop: "calculationForm", value: data });
    },

    resetCalculationForm({ commit }) {
      commit("SET", { prop: "calculationForm", value: clone(defaultCalculationFormState) });
    },

    async calculate({ commit, state }, data) {
      try {
        const { selected, classIndex, complicated, squares } = data;
        const {
          data: { result }
        } = await calculate({
          selected,
          classIndex,
          complicated,
          squares
        });

        commit("SET", {
          prop: "calculationForm", value: {
            ...state.calculationForm, result
          }
        });

      } catch (err) {
        errorHandler(err.message);
      }
    },

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
