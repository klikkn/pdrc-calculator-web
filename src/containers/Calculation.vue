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
        <div v-for="(part, index) of parts" :key="index" class="grid-row">
          <div class="part">
            <el-checkbox v-model="form.selected[part]" @change="onChange" border>{{ $t(part) }}</el-checkbox>
          </div>

          <div class="square">
            <el-select
              v-model="form.squares[part]"
              @change="onChange"
              :placeholder="$t('select.square')"
            >
              <el-option
                v-for="(square, index) of squares"
                :key="index"
                :label="square.title"
                :value="index"
              ></el-option>
            </el-select>
          </div>

          <div class="complicated">
            <el-checkbox
              v-model="form.complicated[part]"
              v-if="part != 'roof'"
              @change="onChange"
              border
            >{{ $t('complicated') }}</el-checkbox>
            <div v-else></div>
          </div>
        </div>

        <div class="grid-row grid-row--last">
          <div class="result">{{ $t('total') }}: {{ form.result }}</div>
          <el-button
            type="primary"
            :disabled="form.classIndex === null"
            native-type="submit"
          >{{ $t('calculate') }}</el-button>
          <el-button type="primary" native-type="reset">{{ $t('reset') }}</el-button>
          <el-button
            type="primary"
            :disabled="form.result === 0"
            @click="dialogFormVisible = true"
          >{{ $t('order') }}</el-button>
        </div>
      </div>
    </form>

    <el-dialog :title="$t('requestCreateFormTitle')" :visible.sync="dialogFormVisible">
      <el-form :model="requestForm" class="requestForm" v-loading="isCreateRequestLoading">
        <el-date-picker
          v-model="requestForm.date"
          type="date"
          :placeholder="$t('enter.date')"
          format="dd.MM.yyyy"
          value-format="timestamp"
        ></el-date-picker>

        <el-input v-model="requestForm.vin" :placeholder="$t('enter.vin')" autocomplete="off"></el-input>
        <el-input v-model="requestForm.make" :placeholder="$t('enter.make')" autocomplete="off"></el-input>
        <el-input v-model="requestForm.model" :placeholder="$t('enter.model')" autocomplete="off"></el-input>
        <el-input
          v-model="requestForm.carNumber"
          :placeholder="$t('enter.carNumber')"
          autocomplete="off"
        ></el-input>
        <el-input
          v-model="requestForm.clientName"
          :placeholder="$t('enter.clientName')"
          autocomplete="off"
        ></el-input>
        <el-input
          v-model="requestForm.phoneNumber"
          :placeholder="$t('enter.phoneNumber')"
          autocomplete="off"
        ></el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogFormVisible = false"
          :disabled="isCreateRequestLoading"
        >{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onSave" :disabled="isCreateRequestLoading">{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-checkbox,
.el-select {
  width: 100%;
}

.grid-row--last .el-button {
  margin: 0;
}

.grid {
  display: grid;
  grid-gap: 15px;
}

.grid-row {
  display: grid;
}

.result {
  font-weight: bold;
  align-self: center;
}

.requestForm {
  display: grid;
  grid-gap: 15px;
}

@media screen and (min-width: 0) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
  }

  .grid-row--last {
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }

  .grid-row--last button {
    grid-column: 1/-1;
  }

  .part {
    grid-column: 1/-1;
  }
}

@media screen and (min-width: 568px) {
}

@media screen and (min-width: 768px) {
  .grid-row {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .grid-row--last {
    grid-template-columns: 1fr auto auto auto;
    grid-gap: 10px;
  }

  .grid-row--last button {
    grid-column: initial;
  }

  .part {
    grid-column: 1/2;
  }
}
</style>

<script>
import { clone, isNil } from "ramda";
import { mapState, mapActions } from "vuex";

export default {
  beforeDestroy() {
    this.updateCalculationForm(this.form);
  },

  data: function() {
    return {
      isFormVisible: true,
      dialogFormVisible: false,
      requestForm: {
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
      params: state => state.params,
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      parts: ({ params }) => (params ? params.parts : []),
      form: ({ calculationForm }) => clone(calculationForm),
      isCreateRequestLoading: ({ isCreateRequestLoading }) =>
        isCreateRequestLoading,
      isCreateRequestError: ({ isCreateRequestError }) => isCreateRequestError
    }),

    isSubmitDisabled: function() {
      const { classIndex } = this.form;
      return isNil(classIndex);
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
      "createRequest"
    ]),

    onSubmit: function() {
      this.updateCalculationForm(this.form);
      this.calculate();
    },

    onReset: function() {
      this.resetCalculationForm();
      this.onChange();
      this.forceRerender();
    },

    onSave: function() {
      this.createRequest(this.requestForm);
    },

    onChange() {
      this.$forceUpdate();
    },

    // TODO: remove this very bad hack
    // I don't know how to rerender element-ui components
    forceRerender() {
      this.isFormVisible = false;
      setTimeout(() => {
        this.isFormVisible = true;
      }, 300);
    }
  },

  watch: {
    isCreateRequestLoading: function(newVal, oldVal) {
      if (
        !newVal &&
        oldVal &&
        this.dialogFormVisible &&
        !this.isCreateRequestError
      )
        this.dialogFormVisible = false;
    }
  }
};
</script>