import axiosInstance from "../constants/axiosInstance"

const getAllCategories = async () => {
    try {
        const { data } = await axiosInstance.get("/catalog/categories");
        // console.log("data", data)
        return data;
    } catch (error) {
        console.error('Error during fetching all categories:', error);
        throw error;
    }
}

const getBestsellers = async (categoryName) => {
    try {
        const { data } = await axiosInstance.get(`/catalog/bestsellers?category=${categoryName}`);
        // console.log("data", data)
        return data;
    } catch (error) {
        console.error('Error during fetching bestsellers:', error);
        throw error;
    }
}


const getProducts = async ({ category, startIndex, endIndex, colour, location, search }) => {
    try {
        const encodedCategory = encodeURIComponent(category);

        const { data } = await axiosInstance.get(`/catalog/products?startIndex=${startIndex}&endIndex=${endIndex}&category=${encodedCategory}&colour=${colour}&location=${location}&search=${search}`);

        // console.log("data", data)
        return data;
    } catch (error) {
        console.error('Error during fetching products list:', error);
        throw error;
    }
}


const getFilters = async () => {
    try {
        const { data } = await axiosInstance.get(`/catalog/product-search-filters`);
        // console.log("data", data)
        return data;
    } catch (error) {
        console.error('Error during fetching bestsellers:', error);
        throw error;
    }
}
const getOutOfStockProducts = async ({ category, startIndex, endIndex, colour, location, search }) => {
    try {
        const { data } = await axiosInstance.get(`/catalog/products/out-of-stock?startIndex=${startIndex}&endIndex=${endIndex}&category=${category}&colour=${colour}&location=${location}&search=${search}`);
        // console.log("data", data)
        return data;
    } catch (error) {
        console.error('Error during fetching out-of-stock products list:', error);
        throw error;
    }
}


export { getAllCategories, getBestsellers, getProducts, getFilters, getOutOfStockProducts }