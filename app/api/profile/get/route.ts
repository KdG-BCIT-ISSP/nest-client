import axiosInterceptor, { CustomAxiosRequestConfig } from "../../axioInterceptor";

export const getProfile = async () => {
    const response = await axiosInterceptor.get("/member/me", {
        requiresAuth: true,
    } as CustomAxiosRequestConfig);
    return response.data;
};