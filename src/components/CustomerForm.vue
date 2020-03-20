<template>
  <div>
    <el-form :model="form" v-loading="loading">
      <el-date-picker
        v-model="form.date"
        type="date"
        :placeholder="$t('enter.date')"
        format="dd.MM.yyyy"
        value-format="timestamp"
      ></el-date-picker>

      <el-input v-model="form.vin" :placeholder="$t('enter.vin')" autocomplete="off"></el-input>
      <el-input v-model="form.make" :placeholder="$t('enter.make')" autocomplete="off"></el-input>
      <el-input v-model="form.model" :placeholder="$t('enter.model')" autocomplete="off"></el-input>
      <el-input v-model="form.carNumber" :placeholder="$t('enter.carNumber')" autocomplete="off"></el-input>
      <el-input v-model="form.clientName" :placeholder="$t('enter.clientName')" autocomplete="off"></el-input>
      <el-input
        v-model="form.phoneNumber"
        :placeholder="$t('enter.phoneNumber')"
        autocomplete="off"
      ></el-input>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["loading"],

  data: function() {
    return {
      form: {
        vin: "",
        make: "",
        model: "",
        carNumber: "",
        clientName: "",
        phoneNumber: "",
        date: new Date().getTime(),
        price: ""
      }
    };
  }
};
</script>
