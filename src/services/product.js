import axiosInstance from "../constants/axiosInstance"

const getProductDetails = async (barcode) => {
    try {
        const { data } = await axiosInstance.get(`/catalog/product-detail?barcode=${barcode}`);
        return data;
    } catch (error) {
        console.error('Error during bulk upload:', error);
        throw error;
    }
}


export { getProductDetails }