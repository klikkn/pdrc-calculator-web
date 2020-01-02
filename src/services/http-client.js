import axios from "axios";
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
  if (!['/auth/local', '/auth/local/register'].includes(config.url)) {
    const token = tokenService.get();
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }

  return config;
});

export default class httpClient {
  static get(url = "") {
    return axios.get(url, options);
  }

  static delete(url = "") {
    return axios.delete(url, options);
  }

  static post(url = "", data = {}) {
    return axios.post(url, data, options);
  }

  static put(url = "", data = {}) {
    return axios.put(url, data, options);
  }
}
