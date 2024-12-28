import axiosInstance from "../constants/axiosInstance";

export const bulkUploadProducts = async (products) => {
  const url = "/admin/bulk-product-upload";
  try {
    const response = await axiosInstance.post(url, products);

    return response.data;
  } catch (error) {
    console.error("Error during bulk upload:", error);
    throw error;
  }
};

export const uploadProductImages = async (imageDataArray, removedImages, productId) => {
  const url = "/admin/upload-product-images";

  const headers = {
    "Content-Type": "application/json",
    "X-Product-Id": productId,
  };
  const body = { imageDataArray, removedImages }

  try {
    const response = await axiosInstance.post(url, body, { headers });

    return response.data;
  } catch (error) {
    console.error("Upload failed", error.response?.status, error.response?.data);
    throw error;
  }
};

export const updateCategoryImage = async (imageData) => {
  const url = "/admin/update-category-image";
  try {
    const response = await axiosInstance.post(url, imageData);

    return response.data;
  } catch (error) {
    console.error("Upload failed", error.response?.status, error.response?.data);
    throw error;
  }
};


export const updateProductDetails = async (formData) => {
  const url = "/admin/update-product-details";
  try {
    const response = await axiosInstance.post(url, formData);
    return response.data;
  } catch (error) {
    console.error("Upload failed", error.response?.status, error.response?.data);
    throw error;
  }
};


export const login = async (username, password) => {
  const url = "/user/login";
  try {
    const response = await axiosInstance.post(url, { username, password });
    return response.data;
  } catch (error) {
    console.error("Upload failed", error.response?.status, error.response?.data);
    throw error;
  }
};

