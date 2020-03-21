<template>
  <div>
    <el-form :model="customer" v-loading="loading">
      <el-date-picker
        v-model="customer.date"
        type="date"
        :placeholder="$t('enter.date')"
        format="dd.MM.yyyy"
        value-format="timestamp"
      ></el-date-picker>

      <el-input v-model="customer.vin" :placeholder="$t('enter.vin')" autocomplete="off"></el-input>
      <el-input v-model="customer.make" :placeholder="$t('enter.make')" autocomplete="off"></el-input>
      <el-input v-model="customer.model" :placeholder="$t('enter.model')" autocomplete="off"></el-input>
      <el-input
        v-model="customer.carNumber"
        :placeholder="$t('enter.carNumber')"
        autocomplete="off"
      ></el-input>
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
  </div>
</template>

<script>
import { clone } from "ramda";

const customerDefaultState = {
  vin: "",
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
