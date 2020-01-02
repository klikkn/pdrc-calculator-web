<template>
  <div>
    <h1>{{ $t('calculation') }}</h1>

    <form v-on:submit.prevent="onSubmit" v-on:reset="onReset">
      <table>
        <tr>
          <td>
            <select v-model="form.classIndex">
              <option disabled value="null">{{ $t('select.class') }}</option>
              <option v-for="(value, index) of classes" :key="index" :value="index">{{value.title}}</option>
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
              <option
                v-for="(square, index) of squares"
                :key="index"
                :value="index"
              >{{square.title}}</option>
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
import { clone, isNil } from "ramda";
import { mapGetters } from "vuex";
import { calculate } from "../services/api";
import { errorHandler } from "../services/errors";

const defaultFormState = {
  classIndex: null,

  selected: [],
  complicated: {},
  squares: {}
};

export default {
  data: function() {
    return { form: clone(defaultFormState), result: 0 };
  },

  computed: {
    ...mapGetters(["user", "params", "prices", "classes", "squares", "parts"]),

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