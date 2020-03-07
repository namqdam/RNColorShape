import {httpClient} from '@app/resources/http-client';

export const generateColor = async (): Promise<any[]> => {
  const {data} = await httpClient.request({
    url: '/colors/random?format=json',
  });
  return data;
};

export const generatePattern = async (): Promise<any[]> => {
  const {data} = await httpClient.request({
    url: '/patterns/random?format=json',
  });
  return data;
};
