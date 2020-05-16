<template>
  <div>
    <h1>{{ $t('orders') }}</h1>

    <el-table :data="orders" style="width: 100%" @row-click="onRowClick">
      <el-table-column :label="$t('car')">
        <template slot-scope="scope">
          <span>{{ (scope.row.make) ? `${scope.row.make} ${scope.row.model}` : scope.row.model || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('price')">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('clientName')">
        <template slot-scope="scope">
          <span>{{ scope.row.clientName || "—" }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getOrders } from "@/services/api";

export default {
  data: function() {
    return {
      orders: []
    };
  },

  mounted: function() {
    this.getOrders();
  },

  methods: {
    ...mapActions(["handleError"]),

    async getOrders() {
      try {
        const { data } = await getOrders();
        this.orders = data;
      } catch (err) {
        this.handleError(err);
      }
    },

    onRowClick: function({id}) {
      this.$router.push(`/orders/${id}`);
    }
  }
};
</script>