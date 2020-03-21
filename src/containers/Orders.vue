<template>
  <div>
    <h1>{{ $t('orders') }}</h1>

    <el-table :data="orders" style="width: 100%">
      <el-table-column :label="$t('make')">
        <template slot-scope="scope">
          <span>{{ scope.row.make }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('model')">
        <template slot-scope="scope">
          <span>{{ scope.row.model }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('price')">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('clientName')">
        <template slot-scope="scope">
          <span>{{ scope.row.clientName }}</span>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <router-link :to="`/orders/${scope.row.id}`">
            <el-button icon="el-icon-link" size="mini" circle></el-button>
          </router-link>

          <el-button
            icon="el-icon-delete"
            size="mini"
            circle
            @click.stop="openDeleteActionDialog(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

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
  }
};
</script>