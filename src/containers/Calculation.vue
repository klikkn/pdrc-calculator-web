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
          <el-button type="primary" native-type="submit">{{ $t('submit') }}</el-button>
          <el-button type="primary" native-type="reset">{{ $t('reset') }}</el-button>
          <div class="result">{{ $t('result') }}: {{ form.result }}</div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.el-checkbox,
.el-select {
  width: 100%;
}

.el-button {
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

@media screen and (min-width: 0) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
  }

  .grid-row--last {
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }

  .part {
    grid-column: 1/-1;
  }

  .result {
    justify-self: start;
  }
}

@media screen and (min-width: 568px) {
}

@media screen and (min-width: 768px) {
  .grid-row {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .grid-row--last {
    grid-template-columns: auto auto 1fr;
    grid-gap: 10px;
  }

  .part {
    grid-column: 1/2;
  }

  .result {
    justify-self: end;
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
    return { isFormVisible: true };
  },

  computed: {
    ...mapState({
      params: state => state.params,
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      parts: ({ params }) => (params ? params.parts : []),

      form: ({ calculationForm }) => clone(calculationForm)
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
      "calculate"
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
  }
};
</script>