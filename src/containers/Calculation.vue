<template>
  <div>
    <h1>{{ $t('calculation') }}</h1>

    <form
      v-on:submit.prevent="onSubmit"
      v-on:reset="onReset"
      v-loading.fullscreen.lock="!isFormVisible"
    >
      <select-field
        :isNative="isMobile"
        :items="classes"
        :labelsList="getTitles(classes)"
        v-model="form.classIndex"
        @change="onClassChange"
        labelProp="title"
        :placeholder="$t('select.class')"
      ></select-field>

      <div class="mt-1 grid" v-if="isFormVisible">
        <div class="grid-row mb-1">
          <select-field
            :isNative="isMobile"
            :items="parts"
            :labelsList="getTranslatedList(parts)"
            v-model="temporaryItem.part"
            @change="onPartChange"
            :placeholder="$t('select.part')"
          ></select-field>

          <select-field
            :isNative="isMobile"
            :items="categories"
            :labelsList="getTranslatedList(categories)"
            v-model="temporaryItem.category"
            @change="onCategoryChange"
            :placeholder="$t('select.category')"
          ></select-field>

          <select-field
            :isNative="isMobile"
            :items="filteredSquares"
            :labelsList="getTitles(squares)"
            v-model="temporaryItem.square"
            @change="onSquareChange"
            :placeholder="$t('select.square')"
            :disabled="isCategorySelect"
          ></select-field>

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
        <div class="result">{{ $t('total') }}: {{ calculationForm.result }} {{ $t('rub') }}</div>
        <el-button
          type="primary"
          :disabled="!isClassSelected || !isItems"
          native-type="submit"
        >{{ $t('calculate') }}</el-button>
        <el-button type="primary" native-type="reset">{{ $t('reset') }}</el-button>
        <el-button
          type="primary"
          :disabled="!isResult"
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
  beforeMount() {
    this.form = clone(this.$store.state.calculationForm);
  },

  beforeDestroy() {
    this.updateCalculationForm(this.form);
  },

  data: function() {
    return {
      form: null,
      temporaryItem: clone(temporaryItemDefaultState),
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
    ...mapState([
      "isMobile",
      "isCreateOrderLoading",
      "isCreateOrderError",
      "calculationForm"
    ]),

    ...mapState({
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      parts: ({ params }) => (params ? params.parts : []),
      categories: ({ params }) => (params ? params.categories : [])
    }),

    //TODO: move to BE
    filteredSquares() {
      return this.temporaryItem.category !== 2
        ? this.squares
        : this.squares.filter((_, i) => i < 2);
    },

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
    },

    isClassSelected() {
      return this.form.classIndex !== null;
    },

    isItems() {
      return this.form.items.length > 0;
    },

    isCategorySelect() {
      return this.temporaryItem.category === null;
    },

    isResult() {
      return this.calculationForm.result > 0;
    }
  },

  methods: {
    ...mapActions([
      "updateCalculationForm",
      "resetCalculationForm",
      "calculate",
      "createOrder"
    ]),

    getTranslatedList(values) {
      return values.map(v => this.$t(v));
    },

    getTitles(values) {
      return values.map(v => v.title);
    },

    onSubmit: function() {
      this.updateCalculationForm(this.form);
      this.calculate();
    },

    onReset: function() {
      this.resetCalculationForm();
      this.form = clone(this.$store.state.calculationForm);
      this.temporaryItem = clone(temporaryItemDefaultState);

      this.$forceUpdate();
      this.forceRerender();
    },

    onSave: function() {
      this.createOrder(this.orderForm);
    },

    onClassChange(val) {
      this.form.classIndex = val;
      this.$forceUpdate();
    },

    onPartChange(val) {
      this.temporaryItem.part = val;
      this.$forceUpdate();
    },

    onCategoryChange(val) {
      this.temporaryItem.category = val;
      this.temporaryItem.square = null;
      this.$forceUpdate();
    },

    onSquareChange(val) {
      this.temporaryItem.square = val;
      this.$forceUpdate();
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