<template>
  <div>
    <h1>{{ $t('order') }}</h1>
    {{item}}
  </div>
</template>


<script>
import { mapActions } from "vuex";
import { getOrder } from "../services/api";

export default {
  mounted: async function() {
    try {
      const orderId = this.$route.params.id;
      if (!orderId) return;

      this.$data.item = await getOrder(orderId);
    } catch (err) {
      this.handleError(err);
    }
  },

  data: function() {
    return {
      item: null,
      editable: false
    };
  },

  methods: {
    ...mapActions(["handleError"])
  }
};
</script>