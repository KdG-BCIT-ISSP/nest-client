import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const deletePost = async (id: number) => {
  const response = await axiosInterceptor.delete(`/posts/${id}`, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
  return response.data;
};
