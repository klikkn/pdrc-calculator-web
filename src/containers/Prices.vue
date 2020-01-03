<template>
  <div>
    <h1>{{ $t('prices') }}</h1>
    <div v-for="(priceTable, index) of prices" :key="index">
      <h3>{{ $t(categories[index]) }}</h3>
      <table>
        <tr>
          <th>{{ $t('size') }}</th>
          <th v-for="(value, index) of classes" :key="index">{{ value.title }}</th>
        </tr>
        <tr v-for="(rowValue, rowIndex) of squares" :key="rowIndex">
          <th>{{squares[rowIndex].title}}</th>
          <td v-for="(priceValue, colIndex) of priceTable" :key="colIndex">
            <input type="text" v-model.number="priceTable[colIndex][rowIndex]" />
          </td>
        </tr>
      </table>
    </div>

    <button class="mt-1" v-on:click="onSave">{{ $t('save') }}</button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { clone } from "ramda";

export default {
  computed: {
    ...mapState({
      prices: ({ user }) => (user ? clone(user.prices) : []),
      classes: ({ params }) => (params ? clone(params.classes) : []),
      squares: ({ params }) => (params ? clone(params.squares) : []),
      categories: ({ params }) => (params ? clone(params.categories) : [])
    })
  },

  methods: {
    ...mapActions(["updateMe"]),

    onSave() {
      this.updateMe({ prices: this.prices });
    }
  }
};
</script>