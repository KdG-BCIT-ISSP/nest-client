import axiosInterceptor, {
    CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getArticle = async () => {
    const response = await axiosInterceptor.get("/article", {
        requiresAuth: true,
    } as CustomAxiosRequestConfig);
    return response.data;
};
