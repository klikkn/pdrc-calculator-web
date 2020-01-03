<template>
  <div>
    <h1>{{ $t('prices') }}</h1>
    <div v-for="(priceTable, index) of prices" :key="index">
      <div class="header mt-1">
        <h3>{{ $t(categories[index]) }}</h3>
        <el-button type="primary" @click="onSave">{{ $t('save') }}</el-button>
      </div>

      <table>
        <tr>
          <th class="row-th">
            <div>{{ $t('class') }}</div>
            <div>-</div>
            <div>{{ $t('size') }}</div>
          </th>
          <th v-for="(value, index) of classes" :key="index">{{ value.title }}</th>
        </tr>
        <tr v-for="(rowValue, rowIndex) of squares" :key="rowIndex">
          <th class="row-th">{{squares[rowIndex].title}}</th>
          <td v-for="(priceValue, colIndex) of priceTable" :key="colIndex">
            <input type="text" v-model.number="priceTable[colIndex][rowIndex]" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  color: var(--SECONDARY_TEXT);
}

table,
th,
td {
  border: 1px solid var(--LIGHTER_BORDER);
}

input {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px 0;

  width: 100%;

  border: none;
  text-align: center;

  color: var(--REGULAR_TEXT);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media screen and (min-width: 0) {
  table,
  th,
  td,
  input {
    font-size: 0.7rem;
  }
}

@media screen and (min-width: 568px) {
  table,
  th,
  td,
  input {
    font-size: 1rem;
  }
}

@media screen and (min-width: 768px) {
  table,
  th,
  td,
  input {
    font-size: 1.25rem;
  }
}
</style>

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