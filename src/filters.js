import Vue from "vue";
import dayjs from 'dayjs'

Vue.filter('date', function (value) {
  return dayjs(value).format('DD.MM.YYYY')
})