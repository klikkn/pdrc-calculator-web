<template>
  <div>
    <h1>{{ $t('orders') }}</h1>

    <el-table :data="orders" style="width: 100%">
      <el-table-column :label="$t('make')">
        <template slot-scope="scope">
          <span>{{ scope.row.make || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('model')">
        <template slot-scope="scope">
          <span>{{ scope.row.model || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('price')">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('client')">
        <template slot-scope="scope">
          <span>{{ scope.row.client || "—" }}</span>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <router-link :to="`/orders/${scope.row.id}`">
            <el-button icon="el-icon-link" size="mini" circle></el-button>
          </router-link>
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
    }
  }
};
</script>