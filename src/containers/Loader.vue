<template>
  <div v-if="isLoading">Loading</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLoading"])
  }
};
</script>