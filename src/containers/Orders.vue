<template>
  <div>
    <h1>{{ $t('orders') }}</h1>

    <el-collapse>
      <el-collapse-item v-for="(order, index) of availableOrders" :key="order.id" :name="index">
        <template slot="title">
          <div class="header">
            <div class="remove">
              <el-button
                icon="el-icon-delete"
                size="mini"
                circle
                @click.stop="openDeleteActionDialog(order.id)"
              ></el-button>
            </div>

            <div>{{ order.date | date }}</div>
            <div>{{ order.price }} {{ $t('rub') }}</div>
            <div>{{ order.make }} {{ order.model | emptyString}}</div>
          </div>
        </template>

        <div class="content">
          <div>
            <div>{{ $t('vin')}}: {{ order.vin | emptyString }}</div>
            <div>{{ $t('carNumber')}}: {{ order.carNumber | emptyString }}</div>
            <div>{{ $t('clientName')}}: {{ order.clientName }}</div>
            <div>{{ $t('phoneNumber')}}: {{ order.phoneNumber }}</div>
            <div>
              <span>{{ $t('classIndex')}}:</span>
              <span v-if="classes[order.classIndex]">{{ classes[order.classIndex].title }}</span>
            </div>
          </div>

          <div>
            <div>{{ $t('partsCount')}}: {{ order.items.length }}</div>

            <table class="table orders-table">
              <tr>
                <th>{{ $t('element') }}</th>
                <th>{{ $t('size') }}</th>
                <th>{{ $t('complicated') }}</th>
              </tr>
              <tr v-for="(item, index) of order.items" :key="index" class="table">
                <td>{{ $t(item.value) }}</td>
                <td>
                  <span v-if="squares[item.square]">{{ squares[item.square].title }} {{ $t('sm2') }}</span>
                </td>
                <td>
                  <i v-if="item.complicated" class="el-icon-success"></i>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog :title="$t('confirmation')" :visible.sync="deleteDialogVisible">
      <div v-loading="isDeleteOrderLoading">{{ $t('deleteConfirmation') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="deleteDialogVisible = false"
          :disabled="isDeleteOrderLoading"
        >{{ $t('cancel') }}</el-button>
        <el-button
          type="primary"
          @click="deleteAction"
          :disabled="isDeleteOrderLoading"
        >{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  display: grid;
  grid-gap: 10px;
  align-items: center;
}

.content {
  display: grid;
  align-items: flex-start;
  padding-left: 55px;
  max-width: 800px;
}

.orders-table th {
  text-align: left;
}

.orders-table th,
.orders-table td {
  padding-left: 0;
}

@media screen and (min-width: 0) {
  .header {
    grid-template-columns: auto auto;
    grid-template-rows: repeat(4, auto);
  }

  .remove {
    grid-row: 1/-1;
    grid-column: 1/2;
    align-self: start;
  }

  .content {
    grid-template-columns: auto;
    grid-gap: 10px;
    padding-left: 15px;
  }
}

@media screen and (min-width: 568px) {
  .header {
    grid-template-columns: repeat(4, auto);
    grid-template-columns: auto minmax(75px, auto) minmax(75px, auto) auto;
    grid-template-rows: repeat(1, auto);
  }

  .remove {
    grid-row: initial;
    grid-column: initial;
  }
}

@media screen and (min-width: 768px) {
  .content {
    grid-template-columns: repeat(2, auto);
    grid-gap: 25px;
    padding-left: 55px;
  }
}

@media screen and (min-width: 1024px) {
}
</style>

<script>
import { isEmpty } from "ramda";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data: function() {
    return {
      deleteDialogVisible: false,
      deletedDraftId: null
    };
  },

  mounted: function() {
    if (isEmpty(this.orders)) this.getOrders();
  },

  computed: {
    ...mapState({
      orders: ({ orders }) => orders,
      squares: ({ params }) => (params ? params.squares : []),
      classes: ({ params }) => (params ? params.classes : []),
      isDeleteOrderLoading: ({ isDeleteOrderLoading }) => isDeleteOrderLoading,
      isDeleteOrderError: ({ isDeleteOrderError }) => isDeleteOrderError
    }),
    ...mapGetters(["availableOrders"])
  },

  methods: {
    ...mapActions(["getOrders", "deleteOrder"]),

    openDeleteActionDialog(id) {
      this.deleteDialogVisible = true;
      this.deletedDraftId = id;
    },

    deleteAction() {
      this.deleteOrder(this.deletedDraftId);
    }
  },

  watch: {
    isDeleteOrderLoading: function(newVal, oldVal) {
      if (
        !newVal &&
        oldVal &&
        this.deleteDialogVisible &&
        !this.isDeleteOrderError
      ) {
        this.deleteDialogVisible = false;
        this.deletedDraftId = null;
      }
    }
  },

  filters: {
    emptyString: function(value) {
      return value === "" ? "-" : value;
    }
  }
};
</script>