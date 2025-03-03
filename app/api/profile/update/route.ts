import axiosInterceptor, { CustomAxiosRequestConfig } from "../../axiosInterceptor";

export const updateProfile = async (username: string, region: string, avatar: string) => {
    const requestData = { username, region, avatar };
    console.log("Request Data:", requestData); 
    const response = await axiosInterceptor.put("/member/me", {
        username,
        region,
        avatar
    }, { requiresAuth: true, } as CustomAxiosRequestConfig);
    return response.data;
};
