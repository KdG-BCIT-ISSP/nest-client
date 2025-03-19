import axiosInterceptor, {
    CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const createTopic = async (
    name: string,
    description: string,
) => {
    const response = await axiosInterceptor.post(
        "/topic/create",
        {
            name: name,
            description: description,
        },
        { requiresAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
};
