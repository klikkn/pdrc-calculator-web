<template>
  <div>
    <template v-if="isNative">
      <div class="el-input el-input--suffix" :class="{ 'is-disabled': disabled }">
        <select
          class="select-field el-input__inner"
          :value="value"
          @change="updateValue($event.target.value)"
          :disabled="disabled"
        >
          <option :value="null" disabled selected>{{ placeholder }}</option>
          <option
            v-for="(value, index) of items"
            :key="keyProp ? value[keyProp] : index"
            :value="valueProp ? value[valueProp] : index"
          >{{ labelsList ? labelsList[index] : value }}</option>
        </select>

        <span class="el-input__suffix">
          <span class="el-input__suffix-inner">
            <i class="el-select__caret el-input__icon el-icon-arrow-down"></i>
          </span>
        </span>
      </div>
    </template>

    <template v-else>
      <el-select
        :value="value"
        @change="updateValue"
        :placeholder="placeholder"
        class="select-field"
        :disabled="disabled"
      >
        <el-option
          v-for="(value, index) of items"
          :key="keyProp ? value[keyProp] : index"
          :label="labelsList ? labelsList[index] : value"
          :value="valueProp ? value[valueProp] : index"
        ></el-option>
      </el-select>
    </template>
  </div>
</template>

<style>
.select-field {
  width: 100%;
}
</style>

<script>
export default {
  props: [
    "isNative",
    "items",
    "value",
    "keyProp",
    "valueProp",
    "labelsList",
    "placeholder",
    "disabled"
  ],

  methods: {
    updateValue: function(value) {
      this.$emit("change", value);
    }
  }
};
</script>