<template>
  <div>
    <h1>Cars</h1>
    <table>
      <tr>
        <th>Make</th>
        <th>Model</th>
        <th>From</th>
        <th>Till</th>
        <th>Class</th>
      </tr>
      <tr v-for="(model) of models" :key="model.id">
        <td>{{ model.make.title }}</td>
        <td>{{ model.title }}</td>
        <td>{{ model.from }}</td>
        <td>{{ model.till }}</td>
        <td>{{ model.class }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  mounted: function() {
    this.getModels();
  },

  computed: mapState({ models: ({ models }) => models }),
  methods: { ...mapActions(["getModels"]) }
};
</script>