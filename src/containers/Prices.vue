<template>
  <div>
    <h1>Prices</h1>

    <div v-for="(priceTable, index) of prices" :key="index">
      <h3>{{categories[index]}}</h3>
      <table>
        <tr>
          <th v-for="(header, index) of headers" :key="index">{{ header }}</th>
        </tr>
        <tr v-for="(rowValue, rowIndex) of rows" :key="rowIndex">
          <th>{{rows[rowIndex]}}</th>
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
import { mapState } from "vuex";

export default {
  data: function() {
    return {
      categories: ["light", "hard", "roof"],
      headers: ["size", "class1", "class2", "class3", "class4"],
      rows: ["1-3", "3-5", "5-10", "10-20", "20-40", "40-70"]
    };
  },
  computed: mapState({
    prices: state => state.prices
  })
};
</script>