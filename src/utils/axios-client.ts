import { HttpException, ServiceUnavailableException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

const api = (baseUrl: string, token?: string): AxiosInstance => {
  const api = axios.create();
  api.defaults.baseURL = baseUrl;
  if (token) api.defaults.headers.common = { Authorization: `Bearer ${token}` };

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.code === 'ECONNREFUSED')
        return Promise.reject(new ServiceUnavailableException());
      return Promise.reject(
        new HttpException(err.response?.data, err.response?.status),
      );
    },
  );
  return api;
};

export const genericHttpConsumer = () => {
  return api('');
};
