<template>
  <div>
    <h1>Calculation</h1>

    <form v-on:submit.prevent="onSubmit" v-on:reset="onReset">
      <select v-model="form.make">
        <option disabled value>Please select one</option>
      </select>

      <select v-model="form.model">
        <option disabled value>Please select one</option>
      </select>

      <select v-model="form.year">
        <option disabled value>Please select one</option>
      </select>

      <table>
        <tr v-for="(part, key) of form.parts" :key="key">
          <td>
            <input type="checkbox" :id="key" v-model="part.value" />
            <label :for="key">{{ part.label }}</label>
          </td>
          <td>
            <input v-model="part.square" />
          </td>
          <td>
            <input type="checkbox" :id="`${key}-hard`" :value="key" v-model="form.hard[key]" />
            <label :for="`${key}-hard`">Hard</label>
          </td>
          <td>
            <input
              type="checkbox"
              :id="`${key}-assembly`"
              :value="key"
              v-model="form.assembly[key]"
            />
            <label :for="`${key}-assembly`">Assembly</label>
          </td>
        </tr>
      </table>

      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    {{ form }}
  </div>
</template>

<script>
import { clone } from "ramda";

const defaultFormState = {
  make: "",
  model: "",
  year: "",

  parts: {
    doorFrontLeft: { label: "doorFrontLeft", value: false, square: null },
    doorFrontRight: { label: "doorFrontRight", value: false, square: null },
    doorBackLeft: { label: "doorBackLeft", value: false, square: null },
    doorBackRight: { label: "doorBackRight", value: false, square: null },

    wingFrontLeft: { label: "wingFrontLeft", value: false, square: null },
    wingFrontRight: { label: "wingFrontRight", value: false, square: null },
    wingBackLeft: { label: "wingBackLeft", value: false, square: null },
    wingBackRight: { label: "wingBackRight", value: false, square: null },

    hood: { label: "hood", value: false, square: null },
    trunk: { label: "trunk", value: false, square: null },
    roof: { label: "roof", value: false, square: null },

    rackLeftRack: { label: "rackLeftRack", value: false, square: null },
    rackRightRack: { label: "rackRightRack", value: false, square: null }
  },

  hard: {},
  assembly: {}
};

export default {
  data: function() {
    return { form: clone(defaultFormState) };
  },

  methods: {
    onSubmit: function() {
      console.log(this.form);
    },
    onReset: function() {
      console.log(1);
      this.form = clone(defaultFormState);
    }
  }
};
</script>