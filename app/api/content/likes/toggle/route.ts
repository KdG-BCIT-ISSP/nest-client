import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../../axiosInterceptor";

export const toggleLikes = async (contentId: number) => {
  const response = await axiosInterceptor.post(
    `/content/${contentId}/toggleLike`,
    {
      requiresAuth: true,
    } as CustomAxiosRequestConfig
  );
  return response.data;
};
