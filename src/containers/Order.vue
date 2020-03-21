<template>
  <div>
    <div class="flex">
      <h1>{{ $t('order') }}</h1>
      <div>
        <el-button icon="el-icon-edit" circle @click.stop></el-button>
        <el-button icon="el-icon-refresh" circle @click.stop></el-button>
      </div>
    </div>

    <CustomerForm ref="customerForm" />

    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="$t('part')">
        <template slot-scope="scope">
          <span>{{ scope.row.part }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('square')">
        <template slot-scope="scope">
          <span>{{ scope.row.square }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('category')">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('count')">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <el-button
            icon="el-icon-delete"
            size="mini"
            circle
            @click.stop="openDeleteActionDialog(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import { clone } from "ramda";

import { getOrder } from "../services/api";

export default {
  mounted: async function() {
    try {
      const orderId = this.$route.params.id;

      if (!orderId) {
        this.resetFormValues();
        return;
      }

      const { data } = await getOrder(orderId);

      this.$data.item = {
        classIndex: data.classIndex,
        price: data.price,
        items: data.items
      };

      this.$data.customer = {
        vin: data.vin,
        make: data.make,
        model: data.model,
        carNumber: data.carNumber,
        clientName: data.clientName,
        phoneNumber: data.phoneNumber,
        date: data.date
      };

      this.resetFormValues();
    } catch (err) {
      this.handleError(err);
    }
  },

  data: function() {
    return {
      item: {
        classIndex: 0,
        price: 0,
        items: []
      },
      customer: {
        vin: "",
        make: "",
        model: "",
        carNumber: "",
        clientName: "",
        phoneNumber: "",
        date: ""
      },
      editableItem: clone(this.item),
      editable: false
    };
  },

  computed: {
    ...mapState([
      "isMobile",
      "isCreateOrderLoading",
      "isCreateOrderError",
      "calculationForm",
      "params"
    ]),

    ...mapState({
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      parts: ({ params }) => (params ? params.parts : []),
      categories: ({ params }) => (params ? params.categories : [])
    }),

    tableData() {
      if (!this.params) return [];

      const { categories, squares, parts } = this.params;

      return this.$data.item.items.map(e => ({
        category: this.$t(categories[e.category]),
        count: e.count,
        part: this.$t(parts[e.part]),
        square: squares[e.square].title
      }));
    }
  },

  methods: {
    ...mapActions(["handleError"]),

    resetForm() {
      this.updateForm(this.item, this.customer);
    },

    resetFormValues() {
      this.$data.editableItem = clone(this.item);
      this.$refs.customerForm.$data.form = clone(this.customer);
    }
  }
};
</script>