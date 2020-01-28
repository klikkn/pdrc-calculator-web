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
          <th class="fz-1">
            <div>{{ $t('class') }}</div>
            <div>-</div>
            <div>{{ $t('size') }}</div>
          </th>
          <th class="fz-1" v-for="(value, index) of classes" :key="index">{{ value.title }}</th>
        </tr>
        <tr
          v-for="(rowValue, rowIndex) of squares"
          :key="rowIndex"
          v-show="index !== 2 || rowIndex < 2"
        >
          <th class="fz-1">{{squares[rowIndex].title}}</th>
          <td class="fz-1" v-for="(priceValue, colIndex) of priceTable" :key="colIndex">
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
  border-spacing: 0;
  border-collapse: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media screen and (min-width: 0) {
  td,
  tr,
  th {
    padding: 0;
  }

  table >>> .el-input__inner {
    padding: 0;
  }
}

@media screen and (min-width: 568px) {
  td,
  tr,
  th {
    padding: 1px;
  }

  table >>> .el-input__inner {
    padding: 0 5px;
  }
}

@media screen and (min-width: 768px) {
  td,
  tr,
  th {
    padding: 5px;
  }

  table >>> .el-input__inner {
    padding: 0 15px;
  }
}

@media screen and (min-width: 1024px) {
}
</style>

<script>
import { mapActions, mapState } from "vuex";
import { clone } from "ramda";

export default {
  computed: {
    ...mapState({
      prices: ({ user }) => (user ? clone(user.prices) : []),
      classes: ({ params }) => (params ? params.classes : []),
      squares: ({ params }) => (params ? params.squares : []),
      categories: ({ params }) => (params ? params.categories : [])
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