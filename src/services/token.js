const key = "pdrc-calculator-token";

export default {
  get: function () {
    return localStorage.getItem(key);
  },
  set: function (value) {
    localStorage.setItem(key, value);
  },
  remove: function () {
    localStorage.removeItem(key);
  },
};