import axios from 'axios';
import Cookies from 'js-cookie';

const Api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  }
});

Api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status) {
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('permissions');
      window.location = '/';
    } else if (403 === error.response.status) {
      window.location = '/app/blank';
    } else {
      return Promise.reject(error);
    }
  }
);

export default Api;
