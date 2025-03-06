import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const deleteArticle = async (id: number) => {
  const response = await axiosInterceptor.delete(`/article/${id}`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
