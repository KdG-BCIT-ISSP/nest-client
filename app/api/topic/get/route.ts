import axiosInterceptor, {
    CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const getTopic = async () => {
    const response = await axiosInterceptor.get("/topic/", {
        requiresAuth: true,
    } as CustomAxiosRequestConfig);
    return response.data;
};
