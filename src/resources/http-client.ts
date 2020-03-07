import axios from 'axios';

const newAxiosInstance = () => {
  const instance = axios.create({baseURL: 'http://www.colourlovers.com/api'});

  instance.interceptors.request.use(
    config => {
      __DEV__ && console.log('Axios sending request ', config);
      return config;
    },
    error => {
      __DEV__ && console.log('Axios request error ', error);
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      __DEV__ && console.log('Axios received response', response);
      return response;
    },
    error => {
      __DEV__ && console.log('Axios request error ', error);
      return Promise.reject(error);
    },
  );

  return instance;
};

export const httpClient = newAxiosInstance();
