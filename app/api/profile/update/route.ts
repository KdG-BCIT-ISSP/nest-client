import axiosInterceptor from "../../axioInterceptor";

export const updateProfile = async (username: string, region: string, avatar: string) => {
    const response = await axiosInterceptor.put("/member/me", {
        username,
        region,
        avatar
    });
    return response.data;
};
