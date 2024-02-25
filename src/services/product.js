import axiosInstance from "../constants/axiosInstance"

const getProductDetails = async (barCode) => {
    try {
        const { data } = await axiosInstance.get(`/catalog/product-detail?barcode=${barCode}`);
        return data;
    } catch (error) {
        console.error('Error during bulk upload:', error);
        throw error;
    }
}


export { getProductDetails }