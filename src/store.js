import Vue from "vue";
import Vuex from "vuex";

import cars from "./assets/cars.json";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    prices: [],
    cars: cars
  }
});
