<template>
  <div>
    <form
      v-on:submit.prevent="onCalculate"
      v-on:reset.prevent="onReset"
      v-loading.fullscreen.lock="!isFormVisible"
      class="order__form"
    >
      <select-field
        :isNative="isMobile"
        :items="classes"
        :labelsList="getTitles(classes)"
        v-model="estimate.classIndex"
        @change="onClassChange"
        labelProp="title"
        :placeholder="$t('select.class')"
        class="order__class"
      ></select-field>

      <div class="order__item">
        <select-field
          class="order__part"
          :isNative="isMobile"
          :items="parts"
          :labelsList="getTranslatedList(parts)"
          v-model="item.part"
          @change="onPartChange"
          :placeholder="$t('select.part')"
        ></select-field>

        <select-field
          class="order__category"
          :isNative="isMobile"
          :items="categories"
          :labelsList="getTranslatedList(categories)"
          v-model="item.category"
          @change="onCategoryChange"
          :placeholder="$t('select.category')"
        ></select-field>

        <select-field
          class="order__square"
          :isNative="isMobile"
          :items="filteredSquares"
          :labelsList="getTitles(squares)"
          v-model="item.square"
          @change="onSquareChange"
          :placeholder="$t('select.square')"
          :disabled="isCategorySelect"
        ></select-field>

        <el-input-number
          class="order__count"
          v-model="item.count"
          :placeholder="$t('select.count')"
          :min="1"
        ></el-input-number>

        <el-button
          class="order__calculate button"
          type="primary"
          @click="onAddItem"
          :disabled="isAddItemDisabled"
        >{{ $t('add') }}</el-button>
      </div>

      <div style="overflow: hidden">
        <el-table :data="tableData">
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
                @click.stop="onRemoveItem(scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="order__footer" v-if="isFormVisible">
        <div class="order__price">
          {{ $t('total') }}:
          <span class="bold">{{ estimate.price }} {{ $t('rub') }}</span>
        </div>
        <el-button
          type="primary"
          :disabled="!isClassSelected || !isItems"
          native-type="submit"
        >{{ $t('calculate') }}</el-button>

        <el-button type="primary" native-type="reset">{{ $t('reset') }}</el-button>

        <el-button
          type="primary"
          :disabled="!isPrice"
          @click="dialogFormVisible = true"
        >{{ $t('continue') }}</el-button>
      </div>
    </form>

    <el-dialog
      :title="$t('customerDialogTitle')"
      :visible.sync="dialogFormVisible"
      @opened="onCustomerFormOpened"
    >
      <CustomerForm ref="customerForm" :initialState="this.customer" :loading="loading" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :disabled="loading">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onSave" :disabled="loading">{{ $t('save') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.order__form {
  display: grid;
  grid-gap: 25px;
}

.order__item {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 1fr 1fr;
}

.order__calculate,
.order__part,
.order__count {
  grid-column: 1/-1;
}

.order__count {
  width: 100%;
}

.order__footer {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 1fr;
}

.order__price {
  padding: 10px 0;
}

.order__footer .el-button {
  margin: 0;
}

@media screen and (min-width: 768px) {
  .order__calculate,
  .order__part,
  .order__count {
    grid-column: auto;
  }

  .order__item {
    grid-template-columns: 3fr 2fr 2fr 2fr 120px;
  }

  .order__footer {
    grid-template-columns: 1fr auto auto auto;
  }
}

@media screen and (min-width: 1024px) {
  .order__item {
    grid-template-columns: 3fr 2fr 2fr 2fr 120px;
  }
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import { clone, isNil, prepend, remove } from "ramda";
import { calculate } from "../services/api";

const itemDefaultState = { part: null, category: null, square: null, count: 1 };
const estimateDefaultState = { classIndex: 0, items: [], price: 0 };
const customerDefaultState = {
  vin: "",
  make: "",
  model: "",
  carNumber: "",
  clientName: "",
  phoneNumber: "",
  date: new Date().getTime()
};

export default {
  props: ["initialState", "loading"],

  mounted() {
    this.resetForm();
  },

  data: function() {
    return {
      item: clone(itemDefaultState),
      estimate: clone(estimateDefaultState),
      customer: clone(customerDefaultState),
      isFormVisible: true,
      dialogFormVisible: false
    };
  },

  computed: {
    ...mapState(["isMobile", "params"]),

    ...mapState({
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      parts: ({ params }) => (params ? params.parts : []),
      categories: ({ params }) => (params ? params.categories : [])
    }),

    tableData() {
      if (!this.params) return [];

      const { categories, squares, parts } = this.params;

      return this.estimate.items.map(e => ({
        category: this.$t(categories[e.category]),
        count: e.count,
        part: this.$t(parts[e.part]),
        square: squares[e.square].title
      }));
    },

    //TODO: move to BE
    // If hailstorm we should show just 2 first squares
    filteredSquares() {
      return this.item.category !== 2
        ? this.squares
        : this.squares.filter((_, i) => i < 2);
    },

    isAddItemDisabled: function() {
      const { part, square, category } = this.item;
      return (
        isNil(part) || isNil(square) || isNil(category) || this.item.count < 1
      );
    },

    isEmptyParams: function() {
      return isNil(this.params);
    },

    isClassSelected() {
      return this.estimate.classIndex !== null;
    },

    isItems() {
      return this.estimate.items.length > 0;
    },

    isCategorySelect() {
      return this.item.category === null;
    },

    isPrice() {
      return this.estimate.price > 0;
    }
  },

  methods: {
    ...mapActions(["handleError"]),

    getTranslatedList(values) {
      return values.map(v => this.$t(v));
    },

    getTitles(values) {
      return values.map(v => v.title);
    },

    onClassChange(val) {
      this.estimate.classIndex = +val;
      this.estimate.price = 0;
    },

    onPartChange(val) {
      this.item.part = +val;
    },

    onCategoryChange(val) {
      this.item.category = +val;
      this.item.square = null;
    },

    onSquareChange(val) {
      this.item.square = +val;
    },

    onAddItem() {
      this.estimate.items = this.addUniqItem(this.item, this.estimate.items);
      this.estimate.price = 0;
    },

    addUniqItem(newItem, items) {
      const exsistingItem = items.find(
        e =>
          e.part === newItem.part &&
          e.category === newItem.category &&
          e.square === newItem.square
      );

      if (!exsistingItem) return prepend(clone(newItem), clone(items));

      exsistingItem.count += newItem.count;
      return clone(items);
    },

    onRemoveItem(index) {
      this.estimate.price = 0;
      this.estimate.items = remove(index, 1, this.estimate.items);
    },

    onCustomerFormOpened() {
      this.$refs.customerForm.$data.form = clone(this.customer);
    },

    resetForm() {
      const data = clone(this.initialState);

      if (this.initialState) {
        this.estimate = clone({
          classIndex: data.classIndex,
          price: data.price,
          items: data.items
        });

        this.customer = clone({
          vin: data.vin,
          make: data.make,
          model: data.model,
          carNumber: data.carNumber,
          clientName: data.clientName,
          phoneNumber: data.phoneNumber,
          date: Date.parse(data.date)
        });

        return;
      }

      this.estimate = clone(estimateDefaultState);
      this.customer = clone(customerDefaultState);
    },

    onCalculate: async function() {
      try {
        const { data } = await calculate(this.estimate);
        this.estimate = clone({ ...this.estimate, price: data.price });
      } catch (err) {
        this.handleError(err);
      }
    },

    onReset: function() {
      this.resetForm();
    },

    onSave: function() {
      this.$emit("submit", {
        ...this.estimate,
        ...this.$refs.customerForm.$data.customer
      });
    }
  },

  watch: {
    isCreateOrderLoading: function(newVal, oldVal) {
      if (
        !newVal &&
        oldVal &&
        this.dialogFormVisible &&
        !this.isCreateOrderError
      )
        this.dialogFormVisible = false;
    }
  }
};
</script>