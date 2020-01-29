<template>
  <table class="table orders-table">
    <tr>
      <th v-if="removeAction" class="remove"></th>
      <th>{{ $t('element') }}</th>
      <th>{{ $t('category') }}</th>
      <th>{{ $t('size') }}</th>
    </tr>
    <tr v-for="(item, index) of items" :key="index" class="table">
      <td v-if="removeAction" class="remove">
        <el-button
          icon="el-icon-delete"
          size="mini"
          circle
          @click="$emit('remove', { item, index })"
        ></el-button>
      </td>
      <td>{{ $t(item.part) }}</td>
      <td>
        <span>{{ $t(categories[item.category]) }}</span>
      </td>
      <td>
        <span v-if="squares[item.square]">{{ squares[item.square].title }} {{ $t('sm2') }}</span>
      </td>
    </tr>
  </table>
</template>

<style scoped>
.orders-table th {
  text-align: left;
}

.orders-table th,
.orders-table td {
  padding-left: 0;
}

.remove {
  width: 35px;
}

@media screen and (min-width: 0) {
}

@media screen and (min-width: 568px) {
}

@media screen and (min-width: 768px) {
}
</style>

<script>
export default {
  props: ["removeAction", "items", "squares", "categories"]
};
</script>