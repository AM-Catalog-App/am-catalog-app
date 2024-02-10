import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export const bulkUploadProducts = async (products) => {
    try {
        console.log(products);
        const response = await axiosInstance.post('/admin/bulk-product-upload', products);
        return response.data;
    } catch (error) {
        console.error('Error during bulk upload:', error);
        // Modify the error or perform other actions
        throw error; // Re-throw the modified error or a new error
    }
};
