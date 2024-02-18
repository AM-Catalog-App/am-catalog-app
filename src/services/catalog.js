import axiosInstance from "../constants/axiosInstance"

const getAllCategories = async () => {
    try {
        const { data } = await axiosInstance.get("/catalog/categories");
        // console.log("data", data)
        return data;
    } catch (error) {
        console.error('Error during bulk upload:', error);
        throw error; // Re-throw the modified error or a new error
    }
}


export { getAllCategories }