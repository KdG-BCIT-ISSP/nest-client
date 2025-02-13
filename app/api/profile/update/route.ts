import axiosInterceptor, { CustomAxiosRequestConfig } from "../../axioInterceptor";

export const updateProfile = async (username: string, region: string, avatar: string) => {
    const response = await axiosInterceptor.put("/member/me", {
        username,
        region,
        avatar
    }, { requiresAuth: true, } as CustomAxiosRequestConfig);
    return response.data;
};
