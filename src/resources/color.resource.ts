import {httpClient} from '@app/resources/http-client';

const generateColor = async (): Promise<any[]> => {
  const {data} = await httpClient.request({
    url: '/colors/random?format=json',
  });
  return data;
};

const generatePattern = async (): Promise<any[]> => {
  const {data} = await httpClient.request({
    url: '/patterns/random?format=json',
  });
  return data;
};

export const ColorResource = {
  generateColor,
  generatePattern,
};
