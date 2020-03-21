<template>
  <div>
    <h1>{{ $t('orderUpdate') }}</h1>
    <OrderForm ref="orderForm" :initialState="order" v-if="order" @submit="onSubmit" />
  </div>
</template>


<script>
import { mapActions } from "vuex";
import { getOrder, updateOrder } from "../services/api";

export default {
  mounted: async function() {
    try {
      const orderId = this.$route.params.id;
      const { data } = await getOrder(orderId);
      this.order = data;
    } catch (err) {
      this.handleError(err);
    }
  },

  data: function() {
    return {
      order: null
    };
  },

  methods: {
    ...mapActions(["handleError"]),

    onSubmit: async function(data) {
      try {
        await updateOrder(this.order.id, data);
        this.$refs.orderForm.$data.dialogFormVisible = false;
      } catch (err) {
        this.handleError(err);
      }
    }
  }
};
</script>