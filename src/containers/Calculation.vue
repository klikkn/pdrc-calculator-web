<template>
  <div>
    <h1>{{ $t('calculation') }}</h1>

    <form v-on:submit.prevent="onSubmit" v-on:reset="onReset">
      <table>

        <tr>
          <td>
            <select v-model="form.classValue">
              <option disabled value="null">{{ $t('select.class') }}</option>
              <option v-for="(value, index) of classes" :key="index" :value="value">{{value}}</option>
            </select>
          </td>
        </tr>
      </table>

      <table v-if="!isEmptyParams">
        <tr v-for="(part, index) of parts" :key="index">
          <td>
            <input type="checkbox" :id="index" :value="part" v-model="form.selected" />
            <label :for="index">{{ $t(part) }}</label>
          </td>

          <td>
            <select v-model="form.squares[part]">
              <option disabled value="undefined">{{ $t('select.square') }}</option>
              <option v-for="(square, index) of squares" :key="index" :value="index">{{square}}</option>
            </select>
          </td>

          <td v-if="part != 'roof'">
            <input
              type="checkbox"
              :id="`${part}-hard`"
              :value="index"
              v-model="form.complicated[part]"
            />
            <label :for="`${part}-hard`">{{ $t('complicated') }}</label>
          </td>
          <td v-else></td>
        </tr>
      </table>

      <button type="submit" :disabled="isSubmitDisabled">{{ $t('submit') }}</button>
      <button type="reset">{{ $t('reset') }}</button>

      <div class="mt-1">{{ $t('result') }}: {{ result }}</div>
    </form>
  </div>
</template>

<style>
</style>

<script>
import { clone, isEmpty } from "ramda";
import { mapState, mapGetters, mapActions } from "vuex";
import { calculate } from "../services/api";

const defaultFormState = {
  classValue: null,

  selected: [],
  complicated: {},
  squares: {}
};

export default {
  mounted: function() {
    if (isEmpty(this.params)) this.getParams();
    if (isEmpty(this.parts))  this.getParts();
  },

  data: function() {
    return { form: clone(defaultFormState), result: 0 };
  },

  computed: {
    ...mapState({
      params: state => state.params,
      parts: state => state.parts
    }),

    ...mapGetters(["prices", "classes", "squares", "modelsByMakeId"]),

    isSubmitDisabled: function() {
      const { classValue } = this.form;
      return ![classValue].every(Boolean);
    },

    isEmptyParams: function() {
      return isEmpty(this.params);
    }
  },

  methods: {
    ...mapActions([
      "getParams",
      "getParts"
    ]),

    onSubmit: async function() {
      try {
        const { selected, classValue, complicated, squares } = this.form;
        const { data } = await calculate({
          selected,
          classValue,
          complicated,
          squares
        });

        this.result = data;
      } catch (err) {
        console.log(err);
      }
    },

    onReset: function() {
      this.form = clone(defaultFormState);
      this.result = 0;
    }
  }
};
</script>