import axios from 'axios';
import endPoints from '@services/api';

export const addProduct = async (body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(endPoints.products.postProduct, body, config);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(endPoints.products.deleteProduct(id));
  return response.data;
};

export const updateProduct = async (id, body) => {
  const config = {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.put(endPoints.products.putProduct(id), body, config);
  return response.data;
};
