<template>
  <div>
    <h1>{{ $t('orderUpdateFormTitle') }}</h1>
    <OrderForm
      :key="remountKey"
      ref="orderForm"
      :initialState="order"
      v-if="order"
      @submit="onSubmit"
    />
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
      order: null,
      remountKey: 1
    };
  },

  methods: {
    ...mapActions(["handleError"]),

    onSubmit: async function(order) {
      try {
        const { data } = await updateOrder(this.order.id, order);
        this.order = data;

        this.$refs.orderForm.$data.dialogFormVisible = false;
        this.remountKey = Math.round(Math.random() * 1000);
      } catch (err) {
        this.handleError(err);
      }
    }
  }
};
</script>