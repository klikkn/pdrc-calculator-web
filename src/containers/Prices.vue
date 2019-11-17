<template>
  <div>
    <h1>{{ $t('prices') }}</h1>
    <div v-for="(priceTable, index) of prices" :key="index">
      <h3>{{ $t(categories[index]) }}</h3>
      <table>
        <tr>
          <th></th>
          <th v-for="(value, index) of classes" :key="index">{{ $t('class') }} {{ value }}</th>
        </tr>
        <tr v-for="(rowValue, rowIndex) of squares" :key="rowIndex">
          <th>{{squares[rowIndex]}} {{ $t('sm2') }}</th>
          <td v-for="(priceValue, colIndex) of priceTable" :key="colIndex">
            <input type="text" v-model="priceTable[colIndex][rowIndex]" />
          </td>
        </tr>
      </table>
    </div>

    <button v-on:click="onSave">{{ $t('save') }}</button>
  </div>
</template>

<script>
import { isEmpty } from "ramda";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mounted: function() {
    if (isEmpty(this.params)) this.getParams();
  },

  data: function() {
    return {
      categories: ["light", "complicated", "roof"]
    };
  },

  computed: {
    ...mapState({ params: ({ params }) => params }),
    ...mapGetters(["prices", "classes", "squares"])
  },

  methods: {
    ...mapActions(["getClasses", "getSquares", "getParams", "updateParams"]),

    onSave() {
      console.log(this.params);
      this.updateParams({ data: this.params });
    }
  }
};
</script>