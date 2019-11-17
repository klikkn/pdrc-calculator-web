<template>
  <div>
    <h1>{{ $t('calculation') }}</h1>

    <form v-on:submit.prevent="onSubmit" v-on:reset="onReset">
      <table>
        <tr>
          <td>
            <select v-model="form.make" :disabled="!makes.length" @change="onMakeChange">
              <option disabled value="null">{{ $t('select.make') }}</option>
              <option v-for="(make, index) of makes" :key="index" :value="make">{{make.title}}</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>
            <select
              v-model="form.model"
              :disabled="!form.make || !models.length"
              @change="onModelChange"
            >
              <option disabled value="null">{{ $t('select.model') }}</option>
              <option
                v-for="model of modelsByMakeId(form.make ? form.make.id : null)"
                :key="model.id"
                :value="model"
              >{{model.title}}</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>
            <select v-model="form.year" :disabled="!form.model">
              <option disabled value="null">{{ $t('select.year') }}</option>
              <option v-for="(year) in getYearsRange(form.model)" :key="year">{{year}}</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>
            <select v-model="form.classValue" :disabled="!form.model">
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

      <div>{{ $t('result') }} {{ result }}</div>
    </form>
  </div>
</template>

<script>
import { clone, range, isEmpty } from "ramda";
import { mapState, mapGetters, mapActions } from "vuex";
import { calculate } from "../services/api";

const defaultFormState = {
  make: null,
  model: null,
  year: null,
  classValue: null,

  selected: [],
  complicated: {},
  squares: {}
};

export default {
  mounted: function() {
    if (isEmpty(this.params)) this.getParams();
    if (isEmpty(this.makes)) this.getMakes();

    this.getParts();
  },

  data: function() {
    return { form: clone(defaultFormState), result: 0 };
  },

  computed: {
    ...mapState({
      params: state => state.params,
      makes: state => state.makes,
      models: state => state.models,
      parts: state => state.parts
    }),

    ...mapGetters(["prices", "classes", "squares", "modelsByMakeId"]),

    isSubmitDisabled: function() {
      const { make, model, classValue } = this.form;
      return ![make, model, classValue].every(Boolean);
    },

    isEmptyParams: function() {
      return isEmpty(this.params);
    }
  },

  methods: {
    ...mapActions([
      "getParams",
      "getMakes",
      "getModel",
      "getMakeModels",
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
    },

    onMakeChange: function() {
      this.form.model = null;
      this.form.year = null;
      this.form.classValue = null;

      this.getMakeModels({ id: this.form.make.id });
    },

    onModelChange: function() {
      if (!this.form.model) return;
      this.form.classValue = this.form.model.class;
    },

    getYearsRange(model) {
      if (!model) return [];

      return range(
        model.from,
        model.till ? model.till : new Date().getFullYear()
      );
    }
  }
};
</script>