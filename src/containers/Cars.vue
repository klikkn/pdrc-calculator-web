<template>
  <div>
    <h1>Cars</h1>
    <table>
      <tr>
        <th>Make</th>
        <th>Model</th>
        <th>From</th>
        <th>Till</th>
      </tr>
      <tr v-for="(car, index) of cars" :key="index">
        <td>{{ car.make }}</td>
        <td>{{ car.model }}</td>
        <td>{{ car.from }}</td>
        <td>{{ car.till }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    prices: state => state.prices,
    cars: state => state.cars
  })
};
</script>