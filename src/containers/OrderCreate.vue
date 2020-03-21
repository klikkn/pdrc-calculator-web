<template>
  <div>
    <h1>{{ $t('orderCreateFormTitle') }}</h1>
    <OrderForm ref="orderForm" @submit="onSubmit" />
  </div>
</template>


<script>
import { mapActions } from "vuex";
import { createOrder } from "../services/api";

export default {
  methods: {
    ...mapActions(["handleError"]),

    onSubmit: async function(data) {
      try {
        await createOrder(data);
        this.$router.push("/orders");
      } catch (err) {
        this.handleError(err);
      }
    }
  }
};
</script>