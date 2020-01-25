import axios from "axios";
import store from '../store'
import tokenService from './token'

const options = {
  baseURL: process.env.VUE_APP_API_HOST,
  timeout: 15000,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }
};

axios.interceptors.request.use(function (config) {
  store.dispatch('enableLoader');

  if (!['/auth/local', '/auth/local/register'].includes(config.url)) {
    const token = tokenService.get();
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  store.dispatch('disableLoader');
  return response;
}, function (error) {
  store.dispatch('disableLoader');
  return Promise.reject(error);
});

export default class httpClient {
  static get(url = "", opt) {
    return axios.get(url, { ...options, ...opt });
  }

  static delete(url = "", opt) {
    return axios.delete(url, { ...options, ...opt });
  }

  static post(url = "", data = {}, opt) {
    return axios.post(url, data, { ...options, ...opt });
  }

  static put(url = "", data = {}, opt) {
    return axios.put(url, data, { ...options, ...opt });
  }
}
