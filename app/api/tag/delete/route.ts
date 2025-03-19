import axiosInterceptor, {
    CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const deleteTag = async (id: number) => {
    const response = await axiosInterceptor.delete(`/tag/delete/${id}`, {
        requiresAuth: true,
    } as CustomAxiosRequestConfig);
    return response.data;
};
