<template>
  <div>
    <div class="flex">
      <h1>{{ $t('orderUpdateFormTitle') }}</h1>
      <div>
        <el-button icon="el-icon-printer" circle @click.stop="onPrint"></el-button>
        <el-button icon="el-icon-delete" circle @click.stop="deleteDialogVisible = true"></el-button>
      </div>
    </div>

    <OrderForm
      :key="remountKey"
      ref="orderForm"
      :initialState="order"
      v-if="order"
      @submit="onSubmit"
    />

    <el-dialog :title="$t('confirmation')" :visible.sync="deleteDialogVisible">
      <div v-loading="isLoading">{{ $t('deleteConfirmation') }}</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" :disabled="isLoading">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="deleteOrder" :disabled="isLoading">{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getOrder, updateOrder, deleteOrder } from "../services/api";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
      deleteDialogVisible: false,
      remountKey: 1
    };
  },

  computed: {
    ...mapState(["isLoading"])
  },

  methods: {
    ...mapActions(["handleError"]),

    async onSubmit(order) {
      try {
        const { data } = await updateOrder(this.order.id, order);
        this.order = data;

        this.$refs.orderForm.$data.dialogFormVisible = false;
        this.remountKey = Math.round(Math.random() * 1000);
      } catch (err) {
        this.handleError(err);
      }
    },

    async deleteOrder() {
      try {
        await deleteOrder(this.$route.params.id);
        this.$router.push("/orders");
      } catch (err) {
        this.handleError(err);
      }
    },

    onPrint() {
      var dd = {
        content: [this.order.price]
      };
      pdfMake.createPdf(dd).print();
    }
  }
};
</script>