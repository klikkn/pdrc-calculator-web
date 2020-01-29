<template>
  <div>
    <h1>{{ $t('calculation') }}</h1>

    <form
      v-on:submit.prevent="onSubmit"
      v-on:reset="onReset"
      v-loading.fullscreen.lock="!isFormVisible"
    >
      <el-select v-model="form.classIndex" @change="onChange" :placeholder="$t('select.class')">
        <el-option
          v-for="(value, index) of classes"
          :key="index"
          :label="value.title"
          :value="index"
        ></el-option>
      </el-select>

      <div class="mt-1 grid" v-if="isFormVisible">
        <div class="grid-row mb-1">
          <el-select
            class="part"
            v-model="temporaryItem.part"
            @change="onChange"
            :placeholder="$t('select.part')"
          >
            <el-option v-for="(part, index) of parts" :key="index" :value="part" :label="$t(part)"></el-option>
          </el-select>

          <el-select
            class="category"
            v-model="temporaryItem.category"
            @change="onChangeCategory"
            :placeholder="$t('select.category')"
          >
            <el-option
              v-for="(category, index) of categories"
              :key="index"
              :label="$t(category)"
              :value="index"
            ></el-option>
          </el-select>

          <el-select
            class="square"
            v-model="temporaryItem.square"
            @change="onChange"
            :placeholder="$t('select.square')"
            :disabled="temporaryItem.category === null"
          >
            <el-option
              v-for="(square, index) of squares"
              :key="index"
              :label="square.title"
              :value="index"
              v-show="temporaryItem.category !== 2 || index < 2"
            ></el-option>
          </el-select>

          <el-input-number
            class="counter"
            v-model="temporaryItem.count"
            :placeholder="$t('select.count')"
            :min="1"
          ></el-input-number>

          <el-button
            class="button"
            type="primary"
            @click="onAddItem"
            :disabled="isAddItemDisabled"
          >{{ $t('add') }}</el-button>
        </div>
      </div>

      <PartsTable
        class="table"
        :items="form.items"
        :squares="squares"
        :categories="categories"
        removeAction="true"
        @remove="onRemoveItem"
      />

      <div class="grid-row grid-row--last mt-1" v-if="isFormVisible">
        <div class="result">{{ $t('total') }}: {{ form.result }} {{ $t('rub') }}</div>
        <el-button
          type="primary"
          :disabled="form.classIndex === null || !form.items.length"
          native-type="submit"
        >{{ $t('calculate') }}</el-button>
        <el-button type="primary" native-type="reset">{{ $t('reset') }}</el-button>
        <el-button
          type="primary"
          :disabled="form.result === 0 || !form.items.length"
          @click="dialogFormVisible = true"
        >{{ $t('order') }}</el-button>
      </div>
    </form>

    <el-dialog :title="$t('orderCreateFormTitle')" :visible.sync="dialogFormVisible">
      <el-form :model="orderForm" class="orderForm" v-loading="isCreateOrderLoading">
        <el-date-picker
          v-model="orderForm.date"
          type="date"
          :placeholder="$t('enter.date')"
          format="dd.MM.yyyy"
          value-format="timestamp"
        ></el-date-picker>

        <el-input v-model="orderForm.vin" :placeholder="$t('enter.vin')" autocomplete="off"></el-input>
        <el-input v-model="orderForm.make" :placeholder="$t('enter.make')" autocomplete="off"></el-input>
        <el-input v-model="orderForm.model" :placeholder="$t('enter.model')" autocomplete="off"></el-input>
        <el-input
          v-model="orderForm.carNumber"
          :placeholder="$t('enter.carNumber')"
          autocomplete="off"
        ></el-input>
        <el-input
          v-model="orderForm.clientName"
          :placeholder="$t('enter.clientName')"
          autocomplete="off"
        ></el-input>
        <el-input
          v-model="orderForm.phoneNumber"
          :placeholder="$t('enter.phoneNumber')"
          autocomplete="off"
        ></el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogFormVisible = false"
          :disabled="isCreateOrderLoading"
        >{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onSave" :disabled="isCreateOrderLoading">{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-checkbox,
.el-select {
  width: 100%;
}

.grid {
  display: grid;
  grid-gap: 15px;
}

.grid-row {
  display: grid;
}

.grid-row--last .el-button {
  margin: 0;
}

.result {
  font-weight: bold;
  align-self: center;
}

.orderForm {
  display: grid;
  grid-gap: 15px;
}

.table {
  font-size: 14px;
}

.counter {
  width: 100%;
}

@media screen and (min-width: 0) {
  .grid-row {
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
  }

  .grid-row button {
    grid-column: 1/-1;
  }

  .grid-row--last {
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }

  .grid-row--last button,
  .grid-row .counter {
    grid-column: 1/-1;
  }

  .part,
  .result {
    grid-column: 1/-1;
  }

  .result {
    text-align: center;
    padding: 10px;
  }
}

@media screen and (min-width: 568px) {
}

@media screen and (min-width: 768px) {
  .grid {
    grid-template-columns: auto;
  }

  .grid-row {
    grid-template-columns: 3fr 2fr 2fr 2fr 120px;
  }

  .grid-row button {
    grid-column: initial;
  }

  .grid-row--last {
    grid-template-columns: 1fr auto auto auto;
    grid-gap: 10px;
  }

  .grid-row .counter,
  .grid-row--last button {
    grid-column: initial;
  }

  .part,
  .result {
    grid-column: 1/2;
  }

  .result {
    text-align: left;
    padding: 0px;
  }
}

@media screen and (min-width: 1024px) {
}
</style>

<script>
import { clone, isNil, prepend, remove } from "ramda";
import { mapState, mapActions } from "vuex";

const temporaryItemDefaultState = {
  part: null,
  category: null,
  square: null,
  count: 1
};

export default {
  beforeDestroy() {
    this.updateCalculationForm(this.form);
  },

  data: function() {
    return {
      temporaryItem: temporaryItemDefaultState,
      isFormVisible: true,
      dialogFormVisible: false,
      orderForm: {
        vin: "",
        make: "",
        model: "",
        carNumber: "",
        clientName: "",
        phoneNumber: "",
        date: new Date().getTime(),
        price: ""
      }
    };
  },

  computed: {
    ...mapState({
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      parts: ({ params }) => (params ? params.parts : []),
      categories: ({ params }) => (params ? params.categories : []),

      form: ({ calculationForm }) => clone(calculationForm),
      isCreateOrderLoading: ({ isCreateOrderLoading }) => isCreateOrderLoading,
      isCreateOrderError: ({ isCreateOrderError }) => isCreateOrderError
    }),

    isAddItemDisabled: function() {
      const { part, square, category } = this.temporaryItem;
      return (
        isNil(part) ||
        isNil(square) ||
        isNil(category) ||
        this.temporaryItem.count < 1
      );
    },

    isEmptyParams: function() {
      return isNil(this.params);
    }
  },

  methods: {
    ...mapActions([
      "updateCalculationForm",
      "resetCalculationForm",
      "calculate",
      "createOrder"
    ]),

    onSubmit: function() {
      this.updateCalculationForm(this.form);
      this.calculate();
    },

    onReset: function() {
      this.resetCalculationForm();
      this.temporaryItem = clone(temporaryItemDefaultState);

      this.onChange();
      this.forceRerender();
    },

    onSave: function() {
      this.createOrder(this.orderForm);
    },

    onChange() {
      this.$forceUpdate();
    },

    onChangeCategory() {
      this.temporaryItem.square = null;
      this.onChange();
    },

    onAddItem() {
      this.form.result = 0;
      this.form.items = this.addUniqItem(this.temporaryItem, this.form.items);
      this.$forceUpdate();
    },

    onRemoveItem({ index }) {
      this.form.result = 0;
      this.form.items = remove(index, 1, this.form.items);
      this.$forceUpdate();
    },

    // TODO: remove this very bad hack
    // I don't know how to rerender element-ui components
    forceRerender() {
      this.isFormVisible = false;
      setTimeout(() => {
        this.isFormVisible = true;
      }, 300);
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