<template>
  <div>
    <h1>Prices</h1>

    <div v-for="(priceTable, index) of prices" :key="index">
      <h3>{{categories[index]}}</h3>
      <table>
        <tr>
          <th v-for="(header, index) of ['size', ...classes]" :key="index">{{ header }}</th>
        </tr>
        <tr v-for="(rowValue, rowIndex) of squares" :key="rowIndex">
          <th>{{squares[rowIndex]}}</th>
          <td
            v-for="(priceValue, colIndex) of priceTable"
            :key="colIndex"
          >{{priceTable[colIndex][rowIndex]}}</td>
        </tr>
      </table>
    </div>
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
      categories: ["light", "hard", "roof"]
    };
  },

  computed: {
    ...mapState({ params: ({ params }) => params }),
    ...mapGetters(["prices", "classes", "squares"])
  },

  methods: {
    ...mapActions(["getClasses", "getSquares", "getParams"])
  }
};
</script>