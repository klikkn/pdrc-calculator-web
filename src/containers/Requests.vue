<template>
  <div>
    <h1>{{ $t('orders') }}</h1>

    <el-collapse>
      <el-collapse-item
        v-for="(request, index) of availableRequests"
        :key="request.id"
        :name="index"
      >
        <template slot="title">
          <div class="header">
            <div class="remove">
              <el-button
                icon="el-icon-delete"
                size="mini"
                circle
                @click.stop="openDeleteActionDialog(request.id)"
              ></el-button>
            </div>

            <div>{{ request.date | date }}</div>
            <div>{{ request.price }} {{ $t('rub') }}</div>
            <div>{{ request.make }} {{ request.model | emptyString}}</div>
          </div>
        </template>

        <div class="content">
          <div>
            <div>{{ $t('vin')}}: {{ request.vin | emptyString }}</div>
            <div>{{ $t('carNumber')}}: {{ request.carNumber | emptyString }}</div>
            <div>{{ $t('clientName')}}: {{ request.clientName }}</div>
            <div>{{ $t('phoneNumber')}}: {{ request.phoneNumber }}</div>
            <div>{{ $t('classIndex')}}: {{ classes[request.classIndex].title }}</div>
          </div>

          <div>
            <div>{{ $t('partsCount')}}: {{ request.items.length }}</div>

            <table class="table requests-table">
              <tr>
                <th>{{ $t('element') }}</th>
                <th>{{ $t('size') }}</th>
                <th>{{ $t('complicated') }}</th>
              </tr>
              <tr v-for="(item, index) of request.items" :key="index" class="table">
                <td>{{ $t(item.value) }}</td>
                <td>{{ squares[item.square].title }} {{ $t('sm2') }}</td>
                <td>
                  <i v-if="item.complicated" class="el-icon-success"></i>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog :title="$t('confirmation')" :visible.sync="deleteDialogVisible">
      <div v-loading="isDeleteRequestLoading">{{ $t('deleteConfirmation') }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="deleteDialogVisible = false"
          :disabled="isDeleteRequestLoading"
        >{{ $t('cancel') }}</el-button>
        <el-button
          type="primary"
          @click="deleteAction"
          :disabled="isDeleteRequestLoading"
        >{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  display: grid;
  grid-gap: 10px;
  align-items: center;
}

.content {
  display: grid;
  align-items: flex-start;
  padding-left: 55px;
  max-width: 800px;
}

.requests-table th {
  text-align: left;
}

.requests-table th,
.requests-table td {
  padding-left: 0;
}

@media screen and (min-width: 0) {
  .header {
    grid-template-columns: auto auto;
    grid-template-rows: repeat(4, auto);
  }

  .remove {
    grid-row: 1/-1;
    grid-column: 1/2;
    align-self: start;
  }

  .content {
    grid-template-columns: auto;
    grid-gap: 10px;
    padding-left: 15px;
  }
}

@media screen and (min-width: 568px) {
  .header {
    grid-template-columns: repeat(4, auto);
    grid-template-columns: auto minmax(75px, auto) minmax(75px, auto) auto;
    grid-template-rows: repeat(1, auto);
  }

  .remove {
    grid-row: initial;
    grid-column: initial;
  }
}

@media screen and (min-width: 768px) {
  .content {
    grid-template-columns: repeat(2, auto);
    grid-gap: 25px;
    padding-left: 55px;
  }
}
</style>

<script>
import { isEmpty } from "ramda";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data: function() {
    return {
      deleteDialogVisible: false,
      deletedDraftId: null
    };
  },

  mounted: function() {
    if (isEmpty(this.requests)) this.getRequests();
  },

  computed: {
    ...mapState({
      requests: ({ requests }) => requests,
      squares: ({ params }) => (params ? params.squares : []),
      classes: ({ params }) => (params ? params.classes : []),
      isDeleteRequestLoading: ({ isDeleteRequestLoading }) =>
        isDeleteRequestLoading,
      isDeleteRequestError: ({ isDeleteRequestError }) => isDeleteRequestError
    }),
    ...mapGetters(["availableRequests"])
  },

  methods: {
    ...mapActions(["getRequests", "deleteRequest"]),

    openDeleteActionDialog(id) {
      this.deleteDialogVisible = true;
      this.deletedDraftId = id;
    },

    deleteAction() {
      this.deleteRequest(this.deletedDraftId);
    }
  },

  watch: {
    isDeleteRequestLoading: function(newVal, oldVal) {
      if (
        !newVal &&
        oldVal &&
        this.deleteDialogVisible &&
        !this.isDeleteRequestError
      ) {
        this.deleteDialogVisible = false;
        this.deletedDraftId = null;
      }
    }
  },

  filters: {
    emptyString: function(value) {
      return value === "" ? "-" : value;
    }
  }
};
</script>