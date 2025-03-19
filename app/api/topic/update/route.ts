import axiosInterceptor, {
    CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const updateTopic = async (
    id: number,
    name: string,
    description: string
) => {
    const response = await axiosInterceptor.put(
        `/topic/update/${id}`,
        {
            name: name,
            description: description,
        },
        { requiresAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
};
