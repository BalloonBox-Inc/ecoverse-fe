import * as config from '@config/index';
import axios from 'axios';

const instance = axios.create({
  baseURL: config.BACKEND_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (config.method !== 'GET') {
    config.headers = { ...config.headers, 'Content-Type': 'application/json' };
  }
  return config;
});

export default instance;
