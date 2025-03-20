import axiosInterceptor, {
  CustomAxiosRequestConfig,
} from "../../axiosInterceptor";

export const toggleLike = async (contentId: number) => {
  const response = await axiosInterceptor.post(
    `content/${contentId}/toggleLike`,
    { contentId },
    { requiresAuth: true } as CustomAxiosRequestConfig
  );
  return response.data;
};
