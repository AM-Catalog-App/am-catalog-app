import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export const bulkUploadProducts = async (products) => {
    const url = '/admin/bulk-product-upload';
    try {
        const response = await axiosInstance.post(url, products);

        return response.data;
    } catch (error) {
        console.error('Error during bulk upload:', error);
        throw error; 
    }
};

export const uploadProductImages = async (imageDataArray, productId) => {
  const url = "/admin/upload-product-images";

  const headers = {
    "Content-Type": "application/json",
    "X-Product-Id": productId,
  };

  try {
    const response = await axiosInstance.post(url, imageDataArray, { headers });

    return response.data;
  } catch (error) {
    console.error("Upload failed", error.response?.status, error.response?.data);
    throw error;
  }
};
  
