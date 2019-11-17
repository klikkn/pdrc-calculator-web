import Vue from "vue";
import Vuex from "vuex";

import {
  getParams,
  updateParams,
  getMakes,
  getMakeModels,
  getParts
} from "./services/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    params: {},
    makes: [],
    models: [],
    parts: {}
  },

  getters: {
    classes: ({ params: { classes } }) => classes || [],
    squares: ({ params: { squares } }) => squares || [],
    prices: ({ params: { prices } }) => prices || [],

    modelsByMakeId: state => id =>
      state.models.filter(model => model.makeId === id)
  },

  mutations: {
    ["SET"](state, { prop, value }) {
      state[prop] = value;
    }
  },

  actions: {
    async getParams({ commit }) {
      try {
        const { data } = await getParams();
        commit("SET", { prop: "params", value: data });
      } catch (err) {
        console.log(err.message);
      }
    },

    async updateParams({ commit }, { data }) {
      try {
        await updateParams(data);
        commit("SET", { prop: "params", value: data });
      } catch (err) {
        console.log(err.message);
      }
    },

    async getMakes({ commit }) {
      try {
        const { data } = await getMakes();
        commit("SET", { prop: "makes", value: data });
      } catch (err) {
        console.log(err.message);
      }
    },

    async getMakeModels({ commit }, { id }) {
      try {
        const { data } = await getMakeModels(id);
        commit("SET", { prop: "models", value: data });
      } catch (err) {
        console.log(err.message);
      }
    },

    async getParts({ commit }) {
      try {
        const { data } = await getParts();
        commit("SET", { prop: "parts", value: data });
      } catch (err) {
        console.log(err.message);
      }
    }
  }
});
