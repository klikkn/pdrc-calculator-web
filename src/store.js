import Vue from "vue";
import Vuex from "vuex";
import { Notification } from 'element-ui'

import { clone } from 'ramda';

import {
  status,
  login,
  register,
  getMe,
  updateMe,
  getParams,
  calculate,
  getOrders,
  createOrder,
  deleteOrder
} from "./services/api";

import tokenService from './services/token'

Vue.use(Vuex);

export const defaultCalculationFormState = {
  classIndex: null,
  items: [],
  result: 0
}

export default new Vuex.Store({
  strict: true,

  state: {
    status: false,
    user: null,
    params: null,
    orders: [],
    calculationForm: defaultCalculationFormState,
    isLoading: false,

    isStatusLoading: false,
    isStatusError: true,
    isCreateOrderLoading: false,
    isCreateOrderError: false,
    isDeleteOrderLoading: false,
    isDeleteOrderError: false
  },

  getters: {
    availableOrders: state => state.orders.filter(e => !e.isDeleted)
  },

  mutations: {
    ["SET"](state, { prop, value }) {
      state[prop] = value;
    }
  },

  actions: {
    enableLoading({ commit }) {
      commit("SET", { prop: "isLoading", value: true });
    },

    disableLoading({ commit }) {
      commit("SET", { prop: "isLoading", value: false });
    },

    updateCalculationForm({ commit }, data) {
      commit("SET", { prop: "calculationForm", value: data });
    },

    resetCalculationForm({ commit }) {
      commit("SET", { prop: "calculationForm", value: clone(defaultCalculationFormState) });
    },

    async calculate({ commit, state, dispatch }) {
      const { classIndex, items } = state.calculationForm;

      try {
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
        const { data: { jwt, user } } = await register(data);

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

    async getStatus({ commit, dispatch }) {
      try {
        commit("SET", { prop: "isStatusLoading", value: true });
        commit("SET", { prop: "isStatusError", value: false });

        await status();

        commit("SET", { prop: "isStatusLoading", value: false });
        commit("SET", { prop: "status", value: true });
      } catch (err) {
        dispatch('handleError', err);
        commit("SET", { prop: "isStatusLoading", value: false });
        commit("SET", { prop: "isStatusError", value: true });
      }
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

    async getOrders({ commit, dispatch }) {
      try {
        const { data } = await getOrders();
        commit("SET", { prop: "orders", value: data });
      } catch (err) {
        dispatch('handleError', err);
      }
    },

    async createOrder({ commit, state, dispatch }, data) {
      const { classIndex, items, result } = state.calculationForm;
      try {
        commit("SET", { prop: "isCreateOrderLoading", value: true });
        commit("SET", { prop: "isCreateOrderError", value: false });

        const { data: order } = await createOrder({ ...data, classIndex, items, price: result });

        if (state.orders > 0) commit("SET", { prop: "orders", value: [...state.orders, order] });
        commit("SET", { prop: "isCreateOrderLoading", value: false });

        dispatch('resetCalculationForm');
      } catch (err) {
        dispatch('handleError', err);
        commit("SET", { prop: "isCreateOrderLoading", value: false });
        commit("SET", { prop: "isCreateOrderError", value: true });
      }
    },

    async deleteOrder({ commit, state, dispatch }, id) {
      try {
        commit("SET", { prop: "isDeleteOrderLoading", value: true });
        commit("SET", { prop: "isDeleteOrderError", value: false });
        await deleteOrder(id);

        const orders = clone(state.orders);
        const deletedItem = orders.find(e => e.id === id);
        deletedItem.isDeleted = true;

        commit("SET", { prop: "orders", value: orders });
        commit("SET", { prop: "isDeleteOrderLoading", value: false });
      } catch (err) {
        dispatch('handleError', err);
        commit("SET", { prop: "isDeleteOrderLoading", value: false });
        commit("SET", { prop: "isDeleteOrderError", value: true });
      }
    },

    handleError({ dispatch }, error) {
      Notification.error({ message: error.message, duration: 0 });

      if (!error || !error.response) return;

      const statusCode = error.response.status;
      if (!statusCode) return;

      if (statusCode === 401) {
        dispatch('logout');
        return;
      }
    }
  }
});