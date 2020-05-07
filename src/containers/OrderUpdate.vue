<template>
  <div>
    <div class="flex order__header">
      <h1 class="order__title">{{ $t('orderUpdateFormTitle') }}</h1>
      <div v-if="order" class="flex order__actions">
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

<style scoped>
.order__header {
  flex-direction: column;
}

.order__title {
  align-self: flex-start;
}

.order__actions {
  align-self: flex-end;
  margin-bottom: 20px;
}

@media screen and (min-width: 568px) {
  .order__header {
    flex-direction: row;
  }

  .order__actions {
    align-self: auto;
    margin-bottom: 0px;
  }
}
</style>

<script>
import { mapActions, mapState } from "vuex";
import { getOrder, updateOrder, deleteOrder } from "../services/api";
import dayjs from "dayjs";
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
    ...mapState(["isLoading", "params"])
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
      if (!this.params) return [];

      const { categories, squares, parts } = this.params;

      var dd = {
        content: [
          {
            stack: [
              this.$t("invoice"),
              {
                text: dayjs(this.order.date).format("DD.MM.YYYY"),
                style: "subheader"
              }
            ],
            style: "header"
          },
          {
            stack: [
              this.order.clientName ? `${this.$t("clientName")}: ${this.order.clientName}\n` : "",
              this.order.phoneNumber ? `${this.$t("phoneNumber")}: ${this.order.phoneNumber}\n` : "",
              this.order.make ? `${this.$t("make")}: ${this.order.make}\n` : "",
              this.order.model ? `${this.$t("model")}: ${this.order.model}\n` : "",
              this.order.carNumber ? `${this.$t("carNumber")}: ${this.order.carNumber}\n` : "",
            ],
            style: "text"
          },
          {
            table: {
              widths: ["*", 125, 75, 75],
              body: [
                [
                  { text: this.$t("part"), style: "tableHeader" },
                  { text: this.$t("category"), style: "tableHeader" },
                  { text: this.$t("count"), style: "tableHeader" },
                  { text: this.$t("square"), style: "tableHeader" }
                ],
                ...this.order.items.map(e => [
                  this.$t(parts[e.part]),
                  this.$t(categories[e.category]),
                  e.count,
                  squares[e.square].title
                ])
              ]
            },
            style: "tableBody"
          },
          {
            text: `${this.$t("totalCost")} ${this.order.price} ${this.$t(
              "rub"
            )}`,
            style: "price"
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "left",
            margin: [0, 100, 0, 50]
          },
          subheader: {
            fontSize: 14
          },
          text: {
            fontSize: 13
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            alignment: "center"
          },
          tableBody: {
            margin: [0, 20, 0, 15]
          },
          price: {
            fontSize: 15,
            alignment: "center"
          }
        }
      };
      pdfMake.createPdf(dd).print();
    }
  }
};
</script>