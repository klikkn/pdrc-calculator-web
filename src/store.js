import Vue from "vue";
import Vuex from "vuex";
import { Notification } from 'element-ui'

import { clone, isNil } from 'ramda';

import {
  login,
  register,
  getMe,
  updateMe,
  getParams,
  calculate,
  getRequests,
  createRequest,
  deleteRequest
} from "./services/api";

import tokenService from './services/token'

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
    requests: [],
    calculationForm: defaultCalculationFormState,
    isLoading: false,

    isCreateRequestLoading: false,
    isCreateRequestError: false,
    isDeleteRequestLoading: false,
    isDeleteRequestError: false
  },

  getters: {
    availableRequests: state => state.requests.filter(e => !e.isDeleted)
  },

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

    async calculate({ commit, state, dispatch }) {
      try {
        const { classIndex } = state.calculationForm;
        const items = calculationFormMapper(state.calculationForm);

        const { data: { result } } = await calculate({ classIndex, items });

        commit("SET", {
          prop: "calculationForm", value: {
            ...state.calculationForm, result
          }
        });

      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async login({ commit, dispatch }, data) {
      try {
        const { data: { jwt, user } } = await login(data);

        tokenService.set(jwt);
        commit("SET", { prop: "user", value: user });

        window.location.replace('/')
      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async register({ commit, dispatch }, data) {
      try {
        const { jwt, user } = await register(data);

        tokenService.set(jwt);
        commit("SET", { prop: "user", value: user });

        window.location.replace('/')
      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async logout() {
      tokenService.remove();
      window.location.replace('/')
    },

    async getMe({ commit, dispatch }) {
      try {
        const { data } = await getMe();

        commit("SET", { prop: "user", value: data });
      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async updateMe({ commit, state, dispatch }, data) {
      const { user } = state;
      try {
        await updateMe(data);
        commit("SET", { prop: "user", value: { ...clone(user), ...clone(data) } });
      } catch (err) {
        commit("SET", { prop: "user", value: clone(user) });
        dispatch('handleError', err);
      }
    },

    async getParams({ commit, dispatch }) {
      try {
        const { data } = await getParams();
        commit("SET", { prop: "params", value: data });
      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async getRequests({ commit, dispatch }) {
      try {
        const { data } = await getRequests();
        commit("SET", { prop: "requests", value: data });
      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async createRequest({ commit, state, dispatch }, data) {
      try {
        commit("SET", { prop: "isCreateRequestLoading", value: true });
        commit("SET", { prop: "isCreateRequestError", value: false });

        const { classIndex, result } = state.calculationForm;
        const items = calculationFormMapper(state.calculationForm);

        const { data: request } = await createRequest({ ...data, classIndex, items, price: result });

        commit("SET", { prop: "requests", value: [...state.requests, request] });
        commit("SET", { prop: "isCreateRequestLoading", value: false });
      } catch (err) {
        dispatch('handleError', err);
        commit("SET", { prop: "isCreateRequestLoading", value: false });
        commit("SET", { prop: "isCreateRequestError", value: true });
      }
    },

    async deleteRequest({ commit, state, dispatch }, id) {
      try {
        commit("SET", { prop: "isDeleteRequestLoading", value: true });
        commit("SET", { prop: "isDeleteRequestError", value: false });
        await deleteRequest(id);

        const requests = clone(state.requests);
        const deletedItem = requests.find(e => e.id === id);
        deletedItem.isDeleted = true;

        commit("SET", { prop: "requests", value: requests });
        commit("SET", { prop: "isDeleteRequestLoading", value: false });
      } catch (err) {
        dispatch('handleError', err);
        commit("SET", { prop: "isDeleteRequestLoading", value: false });
        commit("SET", { prop: "isDeleteRequestError", value: true });
      }
    },

    handleError({ dispatch }, error) {
      Notification.error({ message: error.message, duration: 0 });

      const statusCode = error.response.status;
      if (!statusCode) return;

      if (statusCode === 401) {
        dispatch('logout');
        return;
      }
    }
  }
});

const calculationFormMapper = ({ selected, complicated, squares }) =>
  Object.entries(selected)
    .filter(([key, value]) => value && !isNil(squares[key]))
    .map(([key]) => ({ value: key, square: squares[key], complicated: Boolean(complicated[key]) }))
