import axiosInterceptor, {
    CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const updateTag = async (
    id: number,
    name: string,
) => {
    const response = await axiosInterceptor.put(
        `/tag/update/${id}`,
        {
            name: name,
        },
        { requiresAuth: true } as CustomAxiosRequestConfig
    );
    return response.data;
};
