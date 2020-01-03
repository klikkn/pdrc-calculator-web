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
          <th>
            <div>{{ $t('class') }}</div>
            <div>-</div>
            <div>{{ $t('size') }}</div>
          </th>
          <th v-for="(value, index) of classes" :key="index">{{ value.title }}</th>
        </tr>
        <tr v-for="(rowValue, rowIndex) of squares" :key="rowIndex">
          <th class="row-th">{{squares[rowIndex].title}}</th>
          <td v-for="(priceValue, colIndex) of priceTable" :key="colIndex">
            <div class="el-input">
              <input
                class="el-input__inner"
                type="text"
                v-model.number="priceTable[colIndex][rowIndex]"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  color: var(--SECONDARY_TEXT);
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
  table >>> .el-input__inner {
    font-size: 0.7rem;
  }

  table >>> .el-input__inner {
    padding: 0;
  }
}

@media screen and (min-width: 568px) {
  table,
  th,
  td,
  table >>> .el-input__inner {
    font-size: 0.875rem;
  }

  table >>> .el-input__inner {
    padding: 0 5px;
  }
}

@media screen and (min-width: 768px) {
  table >>> .el-input__inner {
    padding: 0 15px;
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