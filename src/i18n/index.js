import Vue from "vue";
import VueI18n from "vue-i18n";
import ru from "./ru";

Vue.use(VueI18n);

const messages = { ru };

export default new VueI18n({
  locale: "ru",
  messages
});
