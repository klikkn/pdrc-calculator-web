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
  getOrders,
  createOrder,
  deleteOrder
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
    orders: [],
    calculationForm: defaultCalculationFormState,
    isLoading: false,
    isMenuActive: false,

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

    enableMenu({ commit }) {
      commit("SET", { prop: "isMenuActive", value: true });
    },

    disableMenu({ commit }) {
      commit("SET", { prop: "isMenuActive", value: false });
    },

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
      try {
        commit("SET", { prop: "isCreateOrderLoading", value: true });
        commit("SET", { prop: "isCreateOrderError", value: false });

        const { classIndex, result } = state.calculationForm;
        const items = calculationFormMapper(state.calculationForm);

        const { data: order } = await createOrder({ ...data, classIndex, items, price: result });

        commit("SET", { prop: "orders", value: [...state.orders, order] });
        commit("SET", { prop: "isCreateOrderLoading", value: false });
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
