<template>
  <div>
    <h1>{{ $t('cars') }}</h1>

    <select v-model="make" :disabled="!makes.length" @change="onMakeChange">
      <option disabled value="null">{{ $t('select.make') }}</option>
      <option v-for="(make, index) of makes" :key="index" :value="make">{{make.title}}</option>
    </select>

    <table v-if="make">
      <tr>
        <th>{{ $t('make') }}</th>
        <th>{{ $t('model') }}</th>
        <th>{{ $t('from') }}</th>
        <th>{{ $t('till') }}</th>
        <th>{{ $t('class') }}</th>
      </tr>
      <tr v-for="model of modelsByMakeId(make ? make.id : null)" :key="model.id">
        <td>{{ make.title }}</td>
        <td>{{ model.title }}</td>
        <td>{{ model.from }}</td>
        <td>{{ model.till }}</td>
        <td>{{ model.class }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { isEmpty } from "ramda";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  mounted: function() {
    if (isEmpty(this.makes)) this.getMakes();
  },

  data: function() {
    return { make: null, models: [] };
  },

  computed: {
    ...mapState({ makes: ({ makes }) => makes }),
    ...mapGetters(["modelsByMakeId"])
  },

  methods: {
    ...mapActions(["getMakes", "getMakeModels"]),

    onMakeChange: function() {
      this.getMakeModels({ id: this.make.id });
    }
  }
};
</script>