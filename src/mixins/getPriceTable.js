import Vue from 'vue';
import { mapState } from "vuex";

export default Vue.mixin({

  computed: {
    ...mapState(["params"]),
  },

  methods: {
    getPriceTableItems(items) {
      if (!this.params) return [];

      const { categories, squares, parts } = this.params;

      return items.map(e => {
        return {
          category: this.$t(categories[e.category]),
          count: e.count,
          part: this.$t(parts[e.part]),
          square: squares[e.square].title
        };
      });
    }
  }
})