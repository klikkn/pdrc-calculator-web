<template>
  <el-form :model="customer" v-loading="loading" class="customer__form">
    <el-date-picker
      v-model="customer.date"
      type="date"
      :placeholder="$t('enter.date')"
      format="dd.MM.yyyy"
      value-format="timestamp"
    ></el-date-picker>

    <el-input v-model="customer.make" :placeholder="$t('enter.make')" autocomplete="off"></el-input>
    <el-input v-model="customer.model" :placeholder="$t('enter.model')" autocomplete="off"></el-input>
    <el-input v-model="customer.carNumber" :placeholder="$t('enter.carNumber')" autocomplete="off"></el-input>
    <el-input
      v-model="customer.clientName"
      :placeholder="$t('enter.clientName')"
      autocomplete="off"
    ></el-input>
    <el-input
      v-model="customer.phoneNumber"
      :placeholder="$t('enter.phoneNumber')"
      autocomplete="off"
    ></el-input>
  </el-form>
</template>

<style>
.customer__form {
  display: grid;
  grid-gap: 10px;
}
</style>

<script>
import { clone } from "ramda";

const customerDefaultState = {
  make: "",
  model: "",
  carNumber: "",
  clientName: "",
  phoneNumber: "",
  date: new Date().getTime(),
  price: ""
};

export default {
  props: ["loading", "initialState"],

  mounted() {
    if (!this.initialState) return;
    this.customer = clone(this.initialState);
  },

  data: function() {
    return {
      customer: clone(customerDefaultState)
    };
  },

  methods: {
    reset() {
      if (this.initialState) {
        this.customer = clone(this.initialState);
        return;
      }

      this.customer = clone(customerDefaultState);
    }
  }
};
</script>
