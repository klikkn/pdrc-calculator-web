<template>
  <div>
    <h1>{{ $t('calculation') }}</h1>

    <form v-on:submit.prevent="onSubmit" v-on:reset="onReset">
      <el-select v-model="form.classIndex" :placeholder="$t('select.class')">
        <el-option
          v-for="(value, index) of classes"
          :key="index"
          :label="value.title"
          :value="index"
        ></el-option>
      </el-select>

      <div v-if="!isEmptyParams" class="mt-1 grid">
        <div v-for="(part, index) of parts" :key="index" class="grid-row">
          <div class="part">
            <el-checkbox v-model="form.selected[part]" border>{{ $t(part) }}</el-checkbox>
          </div>

          <div class="square">
            <el-select v-model="form.squares[part]" :placeholder="$t('select.square')">
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
              border
            >{{ $t('complicated') }}</el-checkbox>
            <div v-else></div>
          </div>
        </div>
      </div>

      <div class="mt-1">
        <el-button type="primary" native-type="submit">{{ $t('submit') }}</el-button>
        <el-button type="primary" native-type="reset">{{ $t('reset') }}</el-button>
      </div>

      <div class="mt-1">{{ $t('result') }}: {{ result }}</div>
    </form>
  </div>
</template>

<style scoped>
.el-checkbox,
.el-select {
  width: 100%;
}

@media screen and (min-width: 0) {
  .grid {
    display: grid;
    grid-gap: 15px;
  }

  .grid-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
  }

  .part {
    grid-column: 1/-1;
  }
}

@media screen and (min-width: 568px) {
}

@media screen and (min-width: 768px) {
  .grid-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
  }

  .part {
    grid-column: 1/2;
  }
}
</style>

<script>
import { clone, isNil } from "ramda";
import { mapState } from "vuex";
import { calculate } from "../services/api";
import { errorHandler } from "../services/errors";

const defaultFormState = {
  classIndex: null,

  selected: {},
  complicated: {},
  squares: {}
};

export default {
  data: function() {
    return { form: clone(defaultFormState), result: 0 };
  },

  computed: {
    ...mapState({
      user: state => clone(state.user),
      params: state => clone(state.params),
      prices: ({ params }) => (params ? clone(params.prices) : []),
      classes: ({ params }) => (params ? clone(params.classes) : []),
      squares: ({ params }) => (params ? clone(params.squares) : []),
      parts: ({ params }) => (params ? clone(params.parts) : [])
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
    onSubmit: async function() {
      try {
        const { selected, classIndex, complicated, squares } = this.form;
        const {
          data: { result }
        } = await calculate({
          selected,
          classIndex,
          complicated,
          squares
        });

        this.result = result;
      } catch (err) {
        errorHandler(err.message);
      }
    },

    onReset: function() {
      this.form = clone(defaultFormState);
      this.result = 0;
    }
  }
};
</script>